import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Beneficiaire } from './beneficiaires/entities/beneficiaire.entity';
import { User } from './users/entities/user.entity';
import { MedicationRecord } from './ocr/entities/medication-record.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const NAMES = ['Ben Salem', 'Trabelsi', 'Ghomrani', 'Haddad', 'Naceur', 'Zidi', 'Mansour', 'Jridi', 'Kharroubi', 'Belhadj'];
const FIRST_NAMES = ['Mohamed', 'Fatma', 'Ahmed', 'Donia', 'Youssef', 'Amel', 'Ali', 'Leila', 'Khaled', 'Meryem'];
const CITIES = ['Tunis', 'Kasserine', 'Sidi Bouzid', 'Sousse', 'Jendouba', 'Gafsa', 'Beja'];
const LOGEMENTS = ['Propriétaire', 'Locataire', 'Précaire', 'Hébergement d\'urgence'];
const MEDICATIONS = [
    { name: 'Doliprane', class: 'Analgésique', generic: 'Paracétamol' },
    { name: 'Gomrin', class: 'Antidiabétique', generic: 'Glimépiride' },
    { name: 'Augmentin', class: 'Antibiotique', generic: 'Amoxicilline' },
    { name: 'Spasfon', class: 'Antispasmodique', generic: 'Phloroglucinol' },
    { name: 'Aspegic', class: 'Analgésique', generic: 'Aspirine' },
    { name: 'Glucophage', class: 'Antidiabétique', generic: 'Metformine' }
];

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const beneficiaryRepo = app.get<Repository<Beneficiaire>>(getRepositoryToken(Beneficiaire));
    const userRepo = app.get<Repository<User>>(getRepositoryToken(User));
    const ocrRepo = app.get<Repository<MedicationRecord>>(getRepositoryToken(MedicationRecord));

    console.log('--- STARTING BIG DATA SEEDING (TUNISIA CONTEXT) ---');

    // 1. Get a system user to associate records with
    const admin = await userRepo.findOne({ where: { email: 'admin@omnia.tn' } });
    if (!admin) {
        console.error('Admin user not found. Please run seed-roles first.');
        await app.close();
        return;
    }

    // 2. Clear previous test data to avoid duplicates (optional, but cleaner)
    // await ocrRepo.delete({});
    // await beneficiaryRepo.delete({});

    for (let i = 1; i <= 100; i++) {
        const lastName = NAMES[Math.floor(Math.random() * NAMES.length)];
        const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
        const city = CITIES[Math.floor(Math.random() * CITIES.length)];

        // Create realistic beneficiary
        const isPoor = Math.random() > 0.4;
        const nbMembres = Math.floor(Math.random() * 6) + 2;

        const b = beneficiaryRepo.create({
            codeFamille: `TUN-${city.substring(0, 3).toUpperCase()}-${1000 + i}`,
            telephone: `+216 ${Math.floor(Math.random() * 90000000) + 10000000}`,
            nbMembres,
            nbEnfants: Math.min(nbMembres - 1, Math.floor(Math.random() * 4)),
            nbPersonnesAgees: Math.random() > 0.7 ? 1 : 0,
            nbHandicapes: Math.random() > 0.8 ? 1 : 0,
            revenuMensuel: isPoor ? (Math.random() * 400 + 100) : (Math.random() * 1500 + 600),
            typeLogement: isPoor && Math.random() > 0.5 ? 'Précaire' : LOGEMENTS[Math.floor(Math.random() * 3)],
            statutSocial: isPoor ? 'Chômage' : 'Journalier',
            situationSociale: `Originaire de ${city}. Situation économique ${isPoor ? 'difficile' : 'stable'}.`,
            active: true
        });

        const savedB = await beneficiaryRepo.save(b);

        // 3. Create 1-3 OCR records for each beneficiary to "train" trends
        const numRecords = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < numRecords; j++) {
            const med = MEDICATIONS[Math.floor(Math.random() * MEDICATIONS.length)];

            const ocr = ocrRepo.create({
                createdBy: admin,
                beneficiaire: savedB,
                rawOcrText: `Ordonnance pour ${lastName}. Prescription: ${med.name} ${Math.random() > 0.5 ? '500mg' : '1000mg'}`,
                imageUrl: 'https://example.com/mock-prescription.jpg',
                medications: [
                    {
                        name: med.name,
                        genericName: med.generic,
                        drugClass: med.class,
                        dosage: '1 sachet x 3/jour',
                        nlpConfidence: 0.85 + Math.random() * 0.1
                    }
                ]
            });
            await ocrRepo.save(ocr);
        }

        if (i % 20 === 0) console.log(`Injected ${i} beneficiaries and their records...`);
    }

    console.log('--- SEEDING COMPLETE: 100 Families + ~200 Medical Scans Injected ---');
    await app.close();
}

bootstrap();
