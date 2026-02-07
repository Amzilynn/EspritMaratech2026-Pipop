import { Client } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

async function cleanDb() {
    const client = new Client({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        user: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'omnia_db',
    });

    try {
        await client.connect();
        console.log('Connected to DB. Dropping all tables...');

        // Disable triggers to avoid constraint issues during drop
        await client.query('DROP TABLE IF EXISTS "aids" CASCADE;');
        await client.query('DROP TABLE IF EXISTS "visit_beneficiaires" CASCADE;');
        await client.query('DROP TABLE IF EXISTS "visits" CASCADE;');
        await client.query('DROP TABLE IF EXISTS "beneficiaires" CASCADE;');
        await client.query('DROP TABLE IF EXISTS "audit" CASCADE;');
        await client.query('DROP TABLE IF EXISTS "users" CASCADE;');
        await client.query('DROP TABLE IF EXISTS "roles" CASCADE;');

        console.log('Tables dropped successfully.');
    } catch (error) {
        console.error('Error cleaning DB:', error);
    } finally {
        await client.end();
    }
}

cleanDb();
