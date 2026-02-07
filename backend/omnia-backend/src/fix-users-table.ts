import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

async function fixUsersTable() {
    const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'omnia_db',
    });

    try {
        await dataSource.initialize();
        console.log('✅ Connected to database');

        // Enable UUID extension
        await dataSource.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        console.log('✅ UUID extension enabled');

        // Check if users table exists and has data
        const userCount = await dataSource.query(`
            SELECT COUNT(*) as count FROM users
        `).catch(() => [{ count: 0 }]);

        console.log(`📊 Current users in database: ${userCount[0].count}`);

        if (userCount[0].count > 0) {
            console.log('⚠️  WARNING: Users table has data. Backing up...');

            // Create backup table
            await dataSource.query(`
                DROP TABLE IF EXISTS users_backup;
                CREATE TABLE users_backup AS SELECT * FROM users;
            `);
            console.log('✅ Backup created: users_backup');
        }

        // Drop the users table (CASCADE will drop related foreign keys)
        console.log('🗑️  Dropping users table...');
        await dataSource.query(`DROP TABLE IF EXISTS users CASCADE`);

        // Recreate users table with proper UUID generation
        console.log('🔨 Creating users table with UUID generation...');
        await dataSource.query(`
            CREATE TABLE users (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                "firstName" VARCHAR(255) NOT NULL,
                "lastName" VARCHAR(255) NOT NULL,
                "roleId" INTEGER,
                "responsableId" UUID,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_users_role FOREIGN KEY ("roleId") REFERENCES roles(id) ON DELETE SET NULL,
                CONSTRAINT fk_users_responsable FOREIGN KEY ("responsableId") REFERENCES users(id) ON DELETE SET NULL
            )
        `);

        // Create indexes
        console.log('📑 Creating indexes...');
        await dataSource.query(`CREATE INDEX idx_users_email ON users(email)`);
        await dataSource.query(`CREATE INDEX idx_users_role ON users("roleId")`);
        await dataSource.query(`CREATE INDEX idx_users_responsable ON users("responsableId")`);

        // Create default admin user
        console.log('👤 Creating default admin user...');
        const hashedPassword = await bcrypt.hash('admin123', 10);

        // Get ADMIN role ID
        const adminRole = await dataSource.query(`SELECT id FROM roles WHERE name = 'ADMIN' LIMIT 1`);

        if (adminRole.length > 0) {
            await dataSource.query(`
                INSERT INTO users (email, password, "firstName", "lastName", "roleId")
                VALUES ($1, $2, $3, $4, $5)
            `, ['admin@omnia.org', hashedPassword, 'Admin', 'System', adminRole[0].id]);
            console.log('✅ Default admin created: admin@omnia.org / admin123');
        } else {
            console.log('⚠️  No ADMIN role found. Please run seed-roles first.');
        }

        // Verify the fix
        const tableInfo = await dataSource.query(`
            SELECT column_name, data_type, column_default, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'users'
            ORDER BY ordinal_position
        `);

        console.log('\n📋 Users table structure:');
        console.table(tableInfo);

        // Test UUID generation
        console.log('\n🧪 Testing UUID generation...');
        const testResult = await dataSource.query(`
            SELECT uuid_generate_v4() as test_uuid
        `);
        console.log('✅ UUID generation works:', testResult[0].test_uuid);

        console.log('\n✨ Database fix completed successfully!');
        console.log('\n📝 Next steps:');
        console.log('1. Restart your backend server');
        console.log('2. Login with: admin@omnia.org / admin123');
        console.log('3. Create new users through the UI');

    } catch (error) {
        console.error('❌ Error fixing database:', error);
        throw error;
    } finally {
        await dataSource.destroy();
        console.log('🔌 Database connection closed');
    }
}

// Run the fix
fixUsersTable()
    .then(() => {
        console.log('\n✅ All done!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Failed:', error);
        process.exit(1);
    });
