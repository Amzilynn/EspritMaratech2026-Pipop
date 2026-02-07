import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';
import { Role } from './users/entities/role.entity';
import { Beneficiaire } from './beneficiaires/entities/beneficiaire.entity';
import { Visit } from './visits/entities/visit.entity';
import { VisitBeneficiaire } from './visits/entities/visit-beneficiaire.entity';
import { Aid } from './visits/entities/aid.entity';
import { Resource } from './resources/entities/resource.entity';
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
  entities: [User, Role, Beneficiaire, Visit, VisitBeneficiaire, Aid, Resource],
  synchronize: false,
});

async function seedTunisia() {
  await AppDataSource.initialize();
  console.log('🌍 Starting Tunisia comprehensive seeding...\n');

  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await AppDataSource.query('TRUNCATE TABLE aids CASCADE');
    await AppDataSource.query('TRUNCATE TABLE visit_beneficiaires CASCADE');
    await AppDataSource.query('TRUNCATE TABLE visits CASCADE');
    await AppDataSource.query('TRUNCATE TABLE resources CASCADE');
    await AppDataSource.query('TRUNCATE TABLE medication_records CASCADE');
    await AppDataSource.query('TRUNCATE TABLE audits CASCADE');
    await AppDataSource.query('TRUNCATE TABLE users CASCADE');
    await AppDataSource.query('TRUNCATE TABLE roles CASCADE');
    await AppDataSource.query('TRUNCATE TABLE beneficiaires CASCADE');
    console.log('✅ Data cleared\n');

    // ============ CREATE ROLES ============
    console.log('👤 Creating roles...');
    const roleRepo = AppDataSource.getRepository(Role);
    const roleData = [
      { name: 'ADMIN' },
      { name: 'RESPONSABLE_TERRAIN' },
      { name: 'BENEVOLE' }
    ];
    const roles: Record<string, Role> = {};
    for (const r of roleData) {
      const role = await roleRepo.save(roleRepo.create(r));
      roles[r.name] = role;
    }
    console.log(`✅ Created ${Object.keys(roles).length} roles\n`);

    // ============ SEED USERS (7 total) ============
    console.log('👥 Seeding users (7 total)...');
    const userRepo = AppDataSource.getRepository(User);
    
    const users: User[] = [];
    const userData = [
      {
        email: 'admin.tunis@omnia.tn',
        password: bcrypt.hashSync('Admin@123', 10),
        firstName: 'Hichem',
        lastName: 'Ben Ahmed',
        roleId: 'ADMIN',
      },
      {
        email: 'coordinator.tunis@omnia.tn',
        password: bcrypt.hashSync('Coord@123', 10),
        firstName: 'Fatima',
        lastName: 'Zahra',
        roleId: 'RESPONSABLE_TERRAIN',
      },
      {
        email: 'field1.tunis@omnia.tn',
        password: bcrypt.hashSync('Field@123', 10),
        firstName: 'Youssef',
        lastName: 'Oueslati',
        roleId: 'BENEVOLE',
      },
      {
        email: 'field2.tunis@omnia.tn',
        password: bcrypt.hashSync('Field@123', 10),
        firstName: 'Aisha',
        lastName: 'Karray',
        roleId: 'BENEVOLE',
      },
      {
        email: 'field3.tunis@omnia.tn',
        password: bcrypt.hashSync('Field@123', 10),
        firstName: 'Mohamed',
        lastName: 'Tarhouni',
        roleId: 'BENEVOLE',
      },
      {
        email: 'financial@omnia.tn',
        password: bcrypt.hashSync('Finance@123', 10),
        firstName: 'Leila',
        lastName: 'Hadj Ali',
        roleId: 'RESPONSABLE_TERRAIN',
      },
      {
        email: 'logistician@omnia.tn',
        password: bcrypt.hashSync('Logist@123', 10),
        firstName: 'Karim',
        lastName: 'Jabli',
        roleId: 'BENEVOLE',
      },
    ];

    for (const u of userData) {
      const user = userRepo.create({
        email: u.email,
        password: u.password,
        firstName: u.firstName,
        lastName: u.lastName,
        role: roles[u.roleId],
      });
      const savedUser = await userRepo.save(user);
      users.push(savedUser);
    }
    console.log(`✅ Created ${users.length} users\n`);

    // ============ SEED BENEFICIARIES (12 Tunisian families) ============
    console.log('👨‍👩‍👧‍👦 Seeding beneficiaries (12 Tunisian families)...');
    const beneficiaryRepo = AppDataSource.getRepository(Beneficiaire);

    const beneficiariesData = [
      {
        codeFamille: 'FAM001-SFAX',
        telephone: '+216 74 123 456',
        nbMembres: 6,
        nbEnfants: 3,
        nbPersonnesAgees: 1,
        nbHandicapes: 0,
        revenuMensuel: 450,
        typeLogement: 'Logement insalubre',
        statutSocial: 'Sans emploi',
        situationSociale: 'Famille monoparentale - Mère veuve',
        active: true,
      },
      {
        codeFamille: 'FAM002-TUNIS',
        telephone: '+216 71 234 567',
        nbMembres: 8,
        nbEnfants: 4,
        nbPersonnesAgees: 2,
        nbHandicapes: 1,
        revenuMensuel: 350,
        typeLogement: 'Bidonville',
        statutSocial: 'Chômeur longue durée',
        situationSociale: 'Famille nombreuse, père malade',
        active: true,
      },
      {
        codeFamille: 'FAM003-SOUSSE',
        telephone: '+216 73 345 678',
        nbMembres: 5,
        nbEnfants: 2,
        nbPersonnesAgees: 1,
        nbHandicapes: 0,
        revenuMensuel: 520,
        typeLogement: 'Immeuble dégradé',
        statutSocial: 'Travailleur informel',
        situationSociale: 'Père ouvrier agricole saisonnier',
        active: true,
      },
      {
        codeFamille: 'FAM004-KASSERINE',
        telephone: '+216 72 456 789',
        nbMembres: 7,
        nbEnfants: 3,
        nbPersonnesAgees: 2,
        nbHandicapes: 0,
        revenuMensuel: 380,
        typeLogement: 'Habitation rurale',
        statutSocial: 'Femme au foyer',
        situationSociale: 'Zone rurale isolée, accès santé limité',
        active: true,
      },
      {
        codeFamille: 'FAM005-TATAOUINE',
        telephone: '+216 75 567 890',
        nbMembres: 4,
        nbEnfants: 1,
        nbPersonnesAgees: 1,
        nbHandicapes: 1,
        revenuMensuel: 270,
        typeLogement: 'Maison en adobe',
        statutSocial: 'Retraité',
        situationSociale: 'Région sud isolée, père handicapé',
        active: true,
      },
      {
        codeFamille: 'FAM006-GAFSA',
        telephone: '+216 76 678 901',
        nbMembres: 6,
        nbEnfants: 2,
        nbPersonnesAgees: 1,
        nbHandicapes: 0,
        revenuMensuel: 420,
        typeLogement: 'Petit immeuble collectif',
        statutSocial: 'Mineur - travailleur enfant',
        situationSociale: 'Zone minière, pollution atmosphérique',
        active: true,
      },
      {
        codeFamille: 'FAM007-MEDENINE',
        telephone: '+216 75 789 012',
        nbMembres: 5,
        nbEnfants: 3,
        nbPersonnesAgees: 0,
        nbHandicapes: 0,
        revenuMensuel: 380,
        typeLogement: 'Habitation précaire',
        statutSocial: 'Migrant',
        situationSociale: 'Migrant subsaharien, statut incertain',
        active: true,
      },
      {
        codeFamille: 'FAM008-KEBILI',
        telephone: '+216 75 890 123',
        nbMembres: 7,
        nbEnfants: 4,
        nbPersonnesAgees: 1,
        nbHandicapes: 0,
        revenuMensuel: 340,
        typeLogement: 'Tente semi-permanente',
        statutSocial: 'Nomade',
        situationSociale: 'Famille nomade, enfants hors école',
        active: true,
      },
      {
        codeFamille: 'FAM009-BIZERTE',
        telephone: '+216 72 901 234',
        nbMembres: 4,
        nbEnfants: 1,
        nbPersonnesAgees: 1,
        nbHandicapes: 1,
        revenuMensuel: 310,
        typeLogement: 'Logement sans fenêtres',
        statutSocial: 'Aveugles',
        situationSociale: 'Père aveugle, mère handicapée',
        active: true,
      },
      {
        codeFamille: 'FAM010-MAHDIA',
        telephone: '+216 73 012 345',
        nbMembres: 8,
        nbEnfants: 3,
        nbPersonnesAgees: 2,
        nbHandicapes: 0,
        revenuMensuel: 390,
        typeLogement: 'Immeuble proche zone industrielle',
        statutSocial: 'Pêcheur',
        situationSociale: 'Père pêcheur artisanal, revenus irréguliers',
        active: true,
      },
      {
        codeFamille: 'FAM011-JENDOUBA',
        telephone: '+216 78 123 456',
        nbMembres: 9,
        nbEnfants: 5,
        nbPersonnesAgees: 1,
        nbHandicapes: 0,
        revenuMensuel: 320,
        typeLogement: 'Habitation rurale surpeuplée',
        statutSocial: 'Agriculteur',
        situationSociale: 'Petite exploitation, dépendant intrants',
        active: true,
      },
      {
        codeFamille: 'FAM012-SILIANA',
        telephone: '+216 76 234 567',
        nbMembres: 6,
        nbEnfants: 2,
        nbPersonnesAgees: 1,
        nbHandicapes: 0,
        revenuMensuel: 360,
        typeLogement: 'Maison avec un seul puits',
        statutSocial: 'Berger',
        situationSociale: 'Accès eau limité, élevage subsistance',
        active: true,
      },
    ];

    const beneficiaries: Beneficiaire[] = [];
    for (const b of beneficiariesData) {
      const beneficiary = beneficiaryRepo.create(b);
      const saved = await beneficiaryRepo.save(beneficiary);
      beneficiaries.push(saved);
    }
    console.log(`✅ Created ${beneficiaries.length} beneficiary families\n`);

    // ============ SEED RESOURCES (27 items) ============
    console.log('📦 Seeding resources (27 items)...');
    const resourceRepo = AppDataSource.getRepository(Resource);

    const resourcesData = [
      // Food & Nutrition (10 items)
      { name: 'Riz blanc 5kg', quantity: 150, category: 'Nourriture', unit: 'kg', minThreshold: 50 },
      { name: 'Pâtes alimentaires 1kg', quantity: 200, category: 'Nourriture', unit: 'kg', minThreshold: 75 },
      { name: 'Sucre cristallisé 1kg', quantity: 120, category: 'Nourriture', unit: 'kg', minThreshold: 40 },
      { name: 'Huile alimentaire 5L', quantity: 80, category: 'Nourriture', unit: 'L', minThreshold: 30 },
      { name: 'Farine blanche 10kg', quantity: 100, category: 'Nourriture', unit: 'kg', minThreshold: 35 },
      { name: 'Lait en poudre 900g', quantity: 90, category: 'Nourriture', unit: 'boîtes', minThreshold: 25 },
      { name: 'Sardines en conserve', quantity: 250, category: 'Nourriture', unit: 'boîtes', minThreshold: 60 },
      { name: 'Dattes sèches 1kg', quantity: 110, category: 'Nourriture', unit: 'kg', minThreshold: 30 },
      { name: 'Sel iodé 1kg', quantity: 70, category: 'Nourriture', unit: 'kg', minThreshold: 20 },
      { name: 'Café moulé 250g', quantity: 60, category: 'Nourriture', unit: 'boîtes', minThreshold: 15 },

      // Health & Hygiene (10 items)
      { name: 'Couches bébé paquet de 60', quantity: 45, category: 'Santé', unit: 'paquets', minThreshold: 15 },
      { name: 'Savon antibactérien 100g', quantity: 300, category: 'Hygiène', unit: 'pièces', minThreshold: 80 },
      { name: 'Dentifrice 100ml', quantity: 150, category: 'Hygiène', unit: 'tubes', minThreshold: 40 },
      { name: 'Paracétamol 500mg comprimés', quantity: 200, category: 'Santé', unit: 'boîtes', minThreshold: 50 },
      { name: 'Pansements stériles boîte', quantity: 100, category: 'Santé', unit: 'boîtes', minThreshold: 25 },
      { name: 'Gel antibactérien 250ml', quantity: 80, category: 'Hygiène', unit: 'bouteilles', minThreshold: 20 },
      { name: 'Brosse à dents', quantity: 400, category: 'Hygiène', unit: 'pièces', minThreshold: 100 },
      { name: 'Mouchoirs en papier paquet', quantity: 250, category: 'Hygiène', unit: 'paquets', minThreshold: 60 },
      { name: 'Gaze stérile rouleaux', quantity: 120, category: 'Santé', unit: 'rouleaux', minThreshold: 30 },
      { name: 'Vitamine C 500mg', quantity: 150, category: 'Santé', unit: 'boîtes', minThreshold: 40 },

      // Education (4 items)
      { name: 'Cahiers écolier A4 paquet 5', quantity: 200, category: 'Éducation', unit: 'paquets', minThreshold: 50 },
      { name: 'Stylos bille assortis boîte 20', quantity: 180, category: 'Éducation', unit: 'boîtes', minThreshold: 40 },
      { name: 'Crayons de couleur', quantity: 120, category: 'Éducation', unit: 'boîtes', minThreshold: 30 },
      { name: 'Livres scolaires niveau primaire', quantity: 60, category: 'Éducation', unit: 'pièces', minThreshold: 15 },

      // Household (3 items)
      { name: 'Couvertures thermiques', quantity: 80, category: 'Ménage', unit: 'pièces', minThreshold: 20 },
      { name: 'Produit nettoyant 1L', quantity: 100, category: 'Ménage', unit: 'bouteilles', minThreshold: 25 },
      { name: 'Bougies longue durée', quantity: 300, category: 'Ménage', unit: 'pièces', minThreshold: 75 },
    ];

    const resources: Resource[] = [];
    for (const r of resourcesData) {
      const resource = resourceRepo.create(r);
      const saved = await resourceRepo.save(resource);
      resources.push(saved);
    }
    console.log(`✅ Created ${resources.length} resources\n`);

    // ============ SEED VISITS (5 distribution events) ============
    console.log('📅 Seeding visits (5 distribution events)...');
    const visitRepo = AppDataSource.getRepository(Visit);
    const vbRepo = AppDataSource.getRepository(VisitBeneficiaire);
    const aidRepo = AppDataSource.getRepository(Aid);

    const visitsData = [
      {
        date: new Date('2025-12-15'),
        notes: 'Distribution alimentaire à Sfax',
        user: users[0],
      },
      {
        date: new Date('2025-12-20'),
        notes: 'Distributions et consultations - Tunis',
        user: users[1],
      },
      {
        date: new Date('2026-01-10'),
        notes: 'Kits hiver - Sousse',
        user: users[1],
      },
      {
        date: new Date('2026-01-25'),
        notes: 'Aide d\'urgence zone rurale - Kasserine',
        user: users[2],
      },
      {
        date: new Date('2026-02-05'),
        notes: 'Distribution mobile - Tataouine',
        user: users[3],
      },
    ];

    const visits: Visit[] = [];
    for (const v of visitsData) {
      const visit = visitRepo.create(v);
      const saved = await visitRepo.save(visit);
      visits.push(saved);
    }
    console.log(`✅ Created ${visits.length} visits\n`);

    // ============ LINK VISITS TO BENEFICIARIES & CREATE AIDS ============
    console.log('🔗 Creating visit-beneficiary links and aids...');

    let aidCount = 0;

    // Visit 1 - Sfax (FAM001, FAM006)
    const vb1_1 = vbRepo.create({
      visit: visits[0],
      beneficiaire: beneficiaries[0],
    });
    const savedVb1_1 = await vbRepo.save(vb1_1);

    await aidRepo.save(aidRepo.create({
      type: 'Colis Alimentaire',
      natureIntervention: 'Distribution',
      quantite: 10,
      unite: 'kg',
      valeurEstimee: 50,
      visitBeneficiaire: savedVb1_1,
    }));
    aidCount++;

    await aidRepo.save(aidRepo.create({
      type: 'Lait en poudre',
      natureIntervention: 'Distribution',
      quantite: 3,
      unite: 'boîtes',
      valeurEstimee: 25,
      visitBeneficiaire: savedVb1_1,
    }));
    aidCount++;

    const vb1_2 = vbRepo.create({
      visit: visits[0],
      beneficiaire: beneficiaries[5],
    });
    const savedVb1_2 = await vbRepo.save(vb1_2);

    await aidRepo.save(aidRepo.create({
      type: 'Sucre',
      natureIntervention: 'Distribution',
      quantite: 5,
      unite: 'kg',
      valeurEstimee: 20,
      visitBeneficiaire: savedVb1_2,
    }));
    aidCount++;

    // Visit 2 - Tunis (FAM002, FAM003)
    const vb2_1 = vbRepo.create({
      visit: visits[1],
      beneficiaire: beneficiaries[1],
    });
    const savedVb2_1 = await vbRepo.save(vb2_1);

    await aidRepo.save(aidRepo.create({
      type: 'Pâtes alimentaires',
      natureIntervention: 'Distribution',
      quantite: 15,
      unite: 'kg',
      valeurEstimee: 45,
      visitBeneficiaire: savedVb2_1,
    }));
    aidCount++;

    await aidRepo.save(aidRepo.create({
      type: 'Couches bébé',
      natureIntervention: 'Distribution',
      quantite: 2,
      unite: 'paquets',
      valeurEstimee: 60,
      visitBeneficiaire: savedVb2_1,
    }));
    aidCount++;

    const vb2_2 = vbRepo.create({
      visit: visits[1],
      beneficiaire: beneficiaries[2],
    });
    const savedVb2_2 = await vbRepo.save(vb2_2);

    await aidRepo.save(aidRepo.create({
      type: 'Farine',
      natureIntervention: 'Distribution',
      quantite: 8,
      unite: 'kg',
      valeurEstimee: 30,
      visitBeneficiaire: savedVb2_2,
    }));
    aidCount++;

    // Visit 3 - Sousse (FAM004, FAM010)
    const vb3_1 = vbRepo.create({
      visit: visits[2],
      beneficiaire: beneficiaries[3],
    });
    const savedVb3_1 = await vbRepo.save(vb3_1);

    await aidRepo.save(aidRepo.create({
      type: 'Huile alimentaire',
      natureIntervention: 'Distribution',
      quantite: 4,
      unite: 'L',
      valeurEstimee: 35,
      visitBeneficiaire: savedVb3_1,
    }));
    aidCount++;

    await aidRepo.save(aidRepo.create({
      type: 'Fournitures scolaires',
      natureIntervention: 'Distribution',
      quantite: 3,
      unite: 'ensembles',
      valeurEstimee: 40,
      visitBeneficiaire: savedVb3_1,
    }));
    aidCount++;

    const vb3_2 = vbRepo.create({
      visit: visits[2],
      beneficiaire: beneficiaries[9],
    });
    const savedVb3_2 = await vbRepo.save(vb3_2);

    await aidRepo.save(aidRepo.create({
      type: 'Lait en poudre',
      natureIntervention: 'Distribution',
      quantite: 2,
      unite: 'boîtes',
      valeurEstimee: 20,
      visitBeneficiaire: savedVb3_2,
    }));
    aidCount++;

    // Visit 4 - Kasserine (FAM005, FAM008)
    const vb4_1 = vbRepo.create({
      visit: visits[3],
      beneficiaire: beneficiaries[4],
    });
    const savedVb4_1 = await vbRepo.save(vb4_1);

    await aidRepo.save(aidRepo.create({
      type: 'Riz blanc',
      natureIntervention: 'Distribution',
      quantite: 12,
      unite: 'kg',
      valeurEstimee: 55,
      visitBeneficiaire: savedVb4_1,
    }));
    aidCount++;

    await aidRepo.save(aidRepo.create({
      type: 'Pansements stériles',
      natureIntervention: 'Distribution',
      quantite: 2,
      unite: 'boîtes',
      valeurEstimee: 15,
      visitBeneficiaire: savedVb4_1,
    }));
    aidCount++;

    const vb4_2 = vbRepo.create({
      visit: visits[3],
      beneficiaire: beneficiaries[7],
    });
    const savedVb4_2 = await vbRepo.save(vb4_2);

    await aidRepo.save(aidRepo.create({
      type: 'Bougies',
      natureIntervention: 'Distribution',
      quantite: 5,
      unite: 'pièces',
      valeurEstimee: 10,
      visitBeneficiaire: savedVb4_2,
    }));
    aidCount++;

    // Visit 5 - Tataouine (FAM007, FAM009, FAM011, FAM012)
    const vb5_1 = vbRepo.create({
      visit: visits[4],
      beneficiaire: beneficiaries[6],
    });
    const savedVb5_1 = await vbRepo.save(vb5_1);

    await aidRepo.save(aidRepo.create({
      type: 'Sardines',
      natureIntervention: 'Distribution',
      quantite: 6,
      unite: 'boîtes',
      valeurEstimee: 40,
      visitBeneficiaire: savedVb5_1,
    }));
    aidCount++;

    await aidRepo.save(aidRepo.create({
      type: 'Savon antibactérien',
      natureIntervention: 'Distribution',
      quantite: 5,
      unite: 'pièces',
      valeurEstimee: 25,
      visitBeneficiaire: savedVb5_1,
    }));
    aidCount++;

    const vb5_2 = vbRepo.create({
      visit: visits[4],
      beneficiaire: beneficiaries[8],
    });
    const savedVb5_2 = await vbRepo.save(vb5_2);

    await aidRepo.save(aidRepo.create({
      type: 'Dattes sèches',
      natureIntervention: 'Distribution',
      quantite: 3,
      unite: 'kg',
      valeurEstimee: 30,
      visitBeneficiaire: savedVb5_2,
    }));
    aidCount++;

    await aidRepo.save(aidRepo.create({
      type: 'Médicaments',
      natureIntervention: 'Distribution',
      quantite: 2,
      unite: 'boîtes',
      valeurEstimee: 35,
      visitBeneficiaire: savedVb5_2,
    }));
    aidCount++;

    const vb5_3 = vbRepo.create({
      visit: visits[4],
      beneficiaire: beneficiaries[10],
    });
    const savedVb5_3 = await vbRepo.save(vb5_3);

    await aidRepo.save(aidRepo.create({
      type: 'Farine',
      natureIntervention: 'Distribution',
      quantite: 10,
      unite: 'kg',
      valeurEstimee: 40,
      visitBeneficiaire: savedVb5_3,
    }));
    aidCount++;

    await aidRepo.save(aidRepo.create({
      type: 'Fournitures scolaires',
      natureIntervention: 'Distribution',
      quantite: 2,
      unite: 'ensembles',
      valeurEstimee: 25,
      visitBeneficiaire: savedVb5_3,
    }));
    aidCount++;

    const vb5_4 = vbRepo.create({
      visit: visits[4],
      beneficiaire: beneficiaries[11],
    });
    const savedVb5_4 = await vbRepo.save(vb5_4);

    await aidRepo.save(aidRepo.create({
      type: 'Pâtes alimentaires',
      natureIntervention: 'Distribution',
      quantite: 8,
      unite: 'kg',
      valeurEstimee: 35,
      visitBeneficiaire: savedVb5_4,
    }));
    aidCount++;

    await aidRepo.save(aidRepo.create({
      type: 'Produit nettoyant',
      natureIntervention: 'Distribution',
      quantite: 2,
      unite: 'bouteilles',
      valeurEstimee: 15,
      visitBeneficiaire: savedVb5_4,
    }));
    aidCount++;

    console.log(`✅ Created ${9} visit-beneficiary links\n`);
    console.log(`✅ Created ${aidCount} aid distributions\n`);

    console.log('\n✅✅✅ Tunisia comprehensive seeding completed successfully! ✅✅✅\n');
    console.log('Summary:');
    console.log(`  📊 Users: ${users.length}`);
    console.log(`  👨‍👩‍👧‍👦 Beneficiary families: ${beneficiaries.length}`);
    console.log(`  📦 Resources: ${resources.length}`);
    console.log(`  📅 Visits: ${visits.length}`);
    console.log(`  🔗 Visit-Beneficiary links: 9`);
    console.log(`  🎁 Aid distributions: ${aidCount}`);

  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

seedTunisia();
