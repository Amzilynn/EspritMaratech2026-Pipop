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
    synchronize: false,
});

async function seed() {
    await AppDataSource.initialize();
    console.log('Data Source initialized!');

    const roleRepo = AppDataSource.getRepository(Role);
    const userRepo = AppDataSource.getRepository(User);
    const beneRepo = AppDataSource.getRepository(Beneficiaire);
    const visitRepo = AppDataSource.getRepository(Visit);
    const vbRepo = AppDataSource.getRepository(VisitBeneficiaire);
    const aidRepo = AppDataSource.getRepository(Aid);

    // 1. Seed Roles
    const roles = ['ADMIN', 'RESPONSABLE_TERRAIN', 'BENEVOLE'];
    const savedRoles: Record<string, Role> = {};
    for (const name of roles) {
        let role = await roleRepo.findOne({ where: { name } });
        if (!role) {
            role = roleRepo.create({ name });
            role = await roleRepo.save(role);
        }
        savedRoles[name] = role;
    }
    console.log('Roles seeded.');

    // 2. Seed Users
    const password = await bcrypt.hash('password123', 10);
    const usersData = [
        { email: 'admin@omnia.tn', firstName: 'Mehdi', lastName: 'Admin', role: savedRoles['ADMIN'] },
        { email: 'manager@omnia.tn', firstName: 'Sonia', lastName: 'Manager', role: savedRoles['RESPONSABLE_TERRAIN'] },
        { email: 'volunteer@omnia.tn', firstName: 'Ahmed', lastName: 'Benevole', role: savedRoles['BENEVOLE'] },
    ];

    const savedUsers: User[] = [];
    for (const u of usersData) {
        let user = await userRepo.findOne({ where: { email: u.email } });
        if (!user) {
            user = userRepo.create({ ...u, password });
            user = await userRepo.save(user);
        }
        savedUsers.push(user);
    }
    console.log('Users seeded.');

    // 3. Seed Beneficiaries (Tunis area)
    const families = [
        {
            codeFamille: 'FAM-001',
            nomFamille: 'Ben Ali',
            telephone: '21698123456',
            adresse: 'Lafayette, Tunis',
            latitude: 36.8124,
            longitude: 10.1789,
            nbMembres: 5,
            nbEnfants: 3,
            nbPersonnesAgees: 1,
            revenuMensuel: 450.5,
            typeLogement: 'Locataire',
            statutSocial: 'Précaire',
            situationSociale: 'Single mother with 3 school-age children and an elderly parent.',
        },
        {
            codeFamille: 'FAM-002',
            nomFamille: 'Trabelsi',
            telephone: '21697234567',
            adresse: 'Mellassine, Tunis',
            latitude: 36.7912,
            longitude: 10.1543,
            nbMembres: 4,
            nbEnfants: 2,
            nbHandicapes: 1,
            revenuMensuel: 300,
            typeLogement: 'Précaire',
            statutSocial: 'Chômage',
            situationSociale: 'Father unemployed, one child with physical disability.',
        },
        {
            codeFamille: 'FAM-003',
            nomFamille: 'Gharbi',
            telephone: '21695345678',
            adresse: 'Cité Ibn Khaldoun, Tunis',
            latitude: 36.8321,
            longitude: 10.1654,
            nbMembres: 6,
            nbEnfants: 4,
            nbPersonnesAgees: 0,
            revenuMensuel: 600,
            typeLogement: 'Locataire',
            statutSocial: 'Ouvrier',
            situationSociale: 'Large family, father works as manual laborer.',
        }
    ];

    const savedFamilies: Beneficiaire[] = [];
    for (const f of families) {
        let bene = await beneRepo.findOne({ where: { codeFamille: f.codeFamille } });
        if (!bene) {
            bene = beneRepo.create(f);
            bene = await beneRepo.save(bene);
        }
        savedFamilies.push(bene);
    }
    console.log('Beneficiaries seeded.');

    // 4. Seed a Visit
    const visit = visitRepo.create({
        notes: 'Distribution of winter kits and medical consultation.',
        user: savedUsers[2], // Ahmed (Volunteer)
    });
    const savedVisit = await visitRepo.save(visit);

    // Link families to visit and add aids
    for (const family of savedFamilies) {
        const vb = vbRepo.create({
            visit: savedVisit,
            beneficiaire: family,
        });
        const savedVb = await vbRepo.save(vb);

        // Add specific aids for each family
        if (family.codeFamille === 'FAM-001') {
            await aidRepo.save(aidRepo.create({
                type: 'Colis Alimentaire',
                natureIntervention: 'Distribution',
                quantite: 1,
                unite: 'Carton',
                valeurEstimee: 80,
                visitBeneficiaire: savedVb,
            }));
        } else if (family.codeFamille === 'FAM-002') {
            await aidRepo.save(aidRepo.create({
                type: 'Médicaments',
                natureIntervention: 'Consultation',
                quantite: 2,
                unite: 'Boites',
                valeurEstimee: 45,
                visitBeneficiaire: savedVb,
            }));
        }
    }
    console.log('Visits and Aids seeded.');

    await AppDataSource.destroy();
    console.log('Seeding complete!');
}

seed().catch((err) => {
    console.error('Error during seeding:', err);
    process.exit(1);
});
