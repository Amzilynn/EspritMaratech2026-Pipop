import { DataSource } from 'typeorm';
import { Planning } from './planning/entities/planning.entity';
import { User } from './users/entities/user.entity';
import { Beneficiaire } from './beneficiaires/entities/beneficiaire.entity';
import { Role } from './users/entities/role.entity';

import { Visit } from './visits/entities/visit.entity';
import { VisitBeneficiaire } from './visits/entities/visit-beneficiaire.entity';
import { Aid } from './visits/entities/aid.entity';

const dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '0000',
    database: 'omnia_db',
    entities: [Planning, User, Beneficiaire, Role, VisitBeneficiaire, Aid, Visit],
});

async function seed() {
    await dataSource.initialize();
    console.log('Seed: Connected to DB');

    const planningRepo = dataSource.getRepository(Planning);
    const userRepo = dataSource.getRepository(User);
    const beneficiaireRepo = dataSource.getRepository(Beneficiaire);

    const benevoles = await userRepo.find({ relations: ['role'] });
    const activeBenevoles = benevoles.filter(u => u.role?.name === 'BENEVOLE');
    const families = await beneficiaireRepo.find();

    if (activeBenevoles.length === 0 || families.length === 0) {
        console.log('Seed: Need benevoles and families to seed planning.');
        await dataSource.destroy();
        return;
    }

    console.log('Seed: Planning...');

    const plannings = [
        {
            dateTournee: '2024-02-15',
            zone: 'Tunis Centre',
            status: 'Planifiée',
            assignedBenevole: activeBenevoles[0],
            beneficiaire: families[0]
        },
        {
            dateTournee: '2024-02-16',
            zone: 'Ariana',
            status: 'Effectuée',
            assignedBenevole: activeBenevoles[0],
            beneficiaire: families[1]
        },
        {
            dateTournee: '2024-02-18',
            zone: 'Bizerte',
            status: 'Planifiée',
            assignedBenevole: activeBenevoles[1] || activeBenevoles[0],
            beneficiaire: families[2] || families[0]
        }
    ];

    for (const p of plannings) {
        const item = planningRepo.create(p);
        await planningRepo.save(item);
    }

    console.log('Seed: Planning completed.');
    await dataSource.destroy();
}

seed().catch(console.error);
