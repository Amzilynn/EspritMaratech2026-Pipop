-- Fix Users Table ID Column to Use UUID with Auto-Generation

-- Step 1: Check if uuid-ossp extension is enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 2: Drop and recreate the users table with proper UUID generation
-- WARNING: This will delete all existing users!
-- If you need to preserve data, export it first

DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "roleId" INTEGER REFERENCES roles(id),
    "responsableId" UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);

-- Create index on roleId for faster joins
CREATE INDEX idx_users_role ON users("roleId");

-- Create index on responsableId for faster hierarchy queries
CREATE INDEX idx_users_responsable ON users("responsableId");

-- Verify the table structure
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;
