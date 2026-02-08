import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';
import { Role } from './users/entities/role.entity';
import { Beneficiaire } from './beneficiaires/entities/beneficiaire.entity';
import { Visit } from './visits/entities/visit.entity';
import { VisitBeneficiaire } from './visits/entities/visit-beneficiaire.entity';
import { Aid } from './visits/entities/aid.entity';
import { Audit } from './audit/entities/audit.entity';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '0000',
    database: process.env.DB_NAME || 'omnia_db',
    entities: [User, Role, Beneficiaire, Visit, VisitBeneficiaire, Aid, Audit],
    synchronize: true,
});

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomChoice = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomDate = (start: Date, end: Date) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const GOVERNORATES = [
    { name: 'Tunis', lat: 36.8065, lng: 10.1815 },
    { name: 'Ariana', lat: 36.8625, lng: 10.1956 },
    { name: 'Ben Arous', lat: 36.7531, lng: 10.2222 },
    { name: 'Manouba', lat: 36.8078, lng: 10.0864 },
    { name: 'Nabeul', lat: 36.4561, lng: 10.7339 },
    { name: 'Zaghouan', lat: 36.4029, lng: 10.1429 },
    { name: 'Bizerte', lat: 37.2744, lng: 9.8739 },
    { name: 'Béja', lat: 36.7256, lng: 9.1817 },
    { name: 'Jendouba', lat: 36.5011, lng: 8.7794 },
    { name: 'Le Kef', lat: 36.1742, lng: 8.7049 },
    { name: 'Siliana', lat: 36.084, lng: 9.370 },
    { name: 'Kairouan', lat: 35.6781, lng: 10.0963 },
    { name: 'Kassérine', lat: 35.1672, lng: 8.8319 },
    { name: 'Sidi Bouzid', lat: 35.0382, lng: 9.4858 },
    { name: 'Sousse', lat: 35.8256, lng: 10.637 },
    { name: 'Monastir', lat: 35.778, lng: 10.8262 },
    { name: 'Mahdia', lat: 35.5047, lng: 11.0622 },
    { name: 'Sfax', lat: 34.7406, lng: 10.7603 },
    { name: 'Gafsa', lat: 34.425, lng: 8.7842 },
    { name: 'Tozeur', lat: 33.9197, lng: 8.1336 },
    { name: 'Kebili', lat: 33.7044, lng: 8.969 },
    { name: 'Gabès', lat: 33.8815, lng: 10.0982 },
    { name: 'Médenine', lat: 33.3549, lng: 10.5055 },
    { name: 'Tataouine', lat: 32.9297, lng: 10.4518 }
];

async function seed() {
    await AppDataSource.initialize();
    console.log('🌍 --- TUNISIA FULL COVERAGE SEEDING (300+ Families) ---');

    const roleRepo = AppDataSource.getRepository(Role);
    const userRepo = AppDataSource.getRepository(User);
    const beneRepo = AppDataSource.getRepository(Beneficiaire);
    const visitRepo = AppDataSource.getRepository(Visit);
    const vbRepo = AppDataSource.getRepository(VisitBeneficiaire);
    const aidRepo = AppDataSource.getRepository(Aid);

    // 0. CLEANUP
    try {
        await aidRepo.query('TRUNCATE TABLE "aids", "visit_beneficiaires", "visits", "beneficiaires" RESTART IDENTITY CASCADE');
        await userRepo.query('TRUNCATE TABLE "users", "roles" RESTART IDENTITY CASCADE');
    } catch (e) {
        await aidRepo.delete({}); await vbRepo.delete({}); await visitRepo.delete({});
        await beneRepo.delete({}); await userRepo.delete({}); await roleRepo.delete({});
    }

    // 1. ROLES
    const roles = ['ADMIN', 'RESPONSABLE_TERRAIN', 'BENEVOLE', 'CITOYEN'];
    const savedRoles: Record<string, Role> = {};
    for (const name of roles) {
        savedRoles[name] = await roleRepo.save(roleRepo.create({ name }));
    }

    // 2. USERS
    const password = await bcrypt.hash('password123', 10);
    const admin = await userRepo.save(userRepo.create({ email: 'admin@omnia.tn', firstName: 'Mehdi', lastName: 'Zoghlami', password, role: savedRoles['ADMIN'] }));

    // Create one manager and one volunteer per region group? No, just enough for the app.
    const savedManagers: User[] = [];
    for (let i = 0; i < 5; i++) {
        savedManagers.push(await userRepo.save(userRepo.create({
            email: `manager${i}@omnia.tn`,
            firstName: `Responsable`,
            lastName: `${i}`,
            password,
            role: savedRoles['RESPONSABLE_TERRAIN']
        })));
    }

    const savedVolunteers: User[] = [];
    for (let i = 0; i < 20; i++) {
        savedVolunteers.push(await userRepo.save(userRepo.create({
            email: `benevole${i}@omnia.tn`,
            firstName: `Bénévole`,
            lastName: `${i}`,
            password,
            role: savedRoles['BENEVOLE'],
            responsable: savedManagers[i % 5]
        })));
    }

    // 3. BENEFICIARIES (300 Families across 24 Regions)
    console.log('Generating 300 families distributed across all 24 governorates...');
    const savedFamilies: Beneficiaire[] = [];

    // Distribute equally
    for (const gov of GOVERNORATES) {
        const familiesInThisGov = randomInt(10, 15);
        for (let i = 0; i < familiesInThisGov; i++) {
            const members = randomInt(1, 9);
            savedFamilies.push(await beneRepo.save(beneRepo.create({
                codeFamille: `FAM-${gov.name.substring(0, 3).toUpperCase()}-${String(i + 1).padStart(2, '0')}`,
                nomFamille: `Citoyen ${gov.name}`,
                adresse: `${gov.name}, Secteur ${randomInt(1, 10)}`,
                latitude: gov.lat + (Math.random() - 0.5) * 0.1, // Wider spread
                longitude: gov.lng + (Math.random() - 0.5) * 0.1,
                telephone: `216${randomInt(10000000, 99999999)}`,
                nbMembres: members,
                nbEnfants: Math.max(0, members - randomInt(1, 3)),
                nbPersonnesAgees: randomChoice([0, 1, 2]),
                nbHandicapes: randomChoice([0, 0, 1]),
                revenuMensuel: randomChoice([0, 200, 450, 600]),
                typeLogement: randomChoice(['Précaire', 'Locataire', 'Propriétaire']),
                statutSocial: randomChoice(['Chômage', 'Handicap', 'Ouvrier']),
                active: true,
            })));
        }
    }

    // 4. HISTORICAL VISITS
    console.log('Seeding 1000+ historical records...');
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 8);

    for (const fam of savedFamilies) {
        const vCount = (fam.nbHandicapes > 0 || fam.revenuMensuel < 200) ? randomInt(4, 12) : randomInt(1, 3);
        for (let j = 0; j < vCount; j++) {
            const date = randomDate(startDate, new Date());
            const visit = await visitRepo.save(visitRepo.create({
                date,
                notes: `Suivi routinier à ${fam.adresse}.`,
                user: randomChoice(savedVolunteers)
            }));
            const vb = await vbRepo.save(vbRepo.create({ visit, beneficiaire: fam }));

            if (Math.random() > 0.5) {
                await aidRepo.save(aidRepo.create({
                    type: randomChoice(['Alimentaire', 'Santé', 'Financier']),
                    natureIntervention: 'Distribution',
                    quantite: 1,
                    unite: 'Unité',
                    valeurEstimee: randomInt(50, 300),
                    visitBeneficiaire: vb,
                    dateDistribution: date
                }));
            }
        }
    }

    // 5. ML SCORING
    for (const fam of savedFamilies) {
        let score = 10 + (fam.nbMembres * 5) + (fam.nbHandicapes * 30);
        if (fam.revenuMensuel < 300) score += 40;
        score = Math.min(99, score + (Math.random() * 10 - 5));

        await beneRepo.update(fam.id, {
            vulnerabilityScore: score,
            economicFactor: randomInt(10, 40),
            socialFactor: randomInt(10, 40),
            urgencyFactor: randomInt(0, 10),
            scoreLastUpdated: new Date()
        });
    }

    await AppDataSource.destroy();
    console.log('✅ SEEDING COMPLETE! Tunisia is now fully covered with humanitarian data.');
}

seed().catch(err => { console.error(err); process.exit(1); });
