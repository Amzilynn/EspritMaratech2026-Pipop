import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

const dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'omnia_db',
});

async function main() {
    console.log('🔧 Starting database fix...\n');

    await dataSource.initialize();
    console.log('✅ Connected to database\n');

    // Enable UUID extension
    console.log('📦 Enabling UUID extension...');
    await dataSource.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    console.log('✅ UUID extension enabled\n');

    // Check current users
    try {
        const count = await dataSource.query(`SELECT COUNT(*) FROM users`);
        console.log(`📊 Current users: ${count[0].count}\n`);
    } catch (e) {
        console.log('ℹ️  Users table doesn\'t exist yet\n');
    }

    // Drop and recreate
    console.log('🗑️  Dropping users table...');
    await dataSource.query(`DROP TABLE IF EXISTS users CASCADE`);
    console.log('✅ Table dropped\n');

    console.log('🔨 Creating users table with UUID...');
    await dataSource.query(`
        CREATE TABLE users (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            "firstName" VARCHAR(255) NOT NULL,
            "lastName" VARCHAR(255) NOT NULL,
            "roleId" INTEGER,
            "responsableId" UUID,
            CONSTRAINT fk_role FOREIGN KEY ("roleId") REFERENCES roles(id),
            CONSTRAINT fk_responsable FOREIGN KEY ("responsableId") REFERENCES users(id)
        )
    `);
    console.log('✅ Table created\n');

    // Create admin
    console.log('👤 Creating admin user...');
    const pwd = await bcrypt.hash('admin123', 10);
    const roleResult = await dataSource.query(`SELECT id FROM roles WHERE name = 'ADMIN'`);

    if (roleResult.length > 0) {
        await dataSource.query(
            `INSERT INTO users (email, password, "firstName", "lastName", "roleId") VALUES ($1, $2, $3, $4, $5)`,
            ['admin@omnia.org', pwd, 'Admin', 'System', roleResult[0].id]
        );
        console.log('✅ Admin created: admin@omnia.org / admin123\n');
    }

    // Verify
    const test = await dataSource.query(`SELECT uuid_generate_v4() as id`);
    console.log('✅ UUID test:', test[0].id);

    console.log('\n✨ Fix completed!\n');
    console.log('Next steps:');
    console.log('1. Restart backend: npm run start:dev');
    console.log('2. Login: admin@omnia.org / admin123\n');

    await dataSource.destroy();
}

main().catch(console.error);
