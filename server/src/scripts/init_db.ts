
import { pool } from '../database';

const createTables = async () => {
    try {
        console.log('Initializing database...');

        const connection = await pool.getConnection();

        // Tenants Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS tenants (
                id VARCHAR(36) PRIMARY KEY,
                subdomain VARCHAR(50) UNIQUE NOT NULL,
                name VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Table tenants created/verified.');

        // Users Table (for login)
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(36) PRIMARY KEY,
                tenant_id VARCHAR(36) NOT NULL,
                email VARCHAR(255) NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role ENUM('vendedor', 'gerente', 'admin') DEFAULT 'vendedor',
                is_hidden BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
            );
        `);
        console.log('Table users created/verified.');

        // Clients Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS clients (
                id VARCHAR(36) PRIMARY KEY,
                tenant_id VARCHAR(36) NOT NULL,
                name VARCHAR(100) NOT NULL,
                cpf VARCHAR(20) NOT NULL,
                email VARCHAR(100),
                phone VARCHAR(20),
                income DECIMAL(10, 2),
                score INT,
                status VARCHAR(20),
                address_json TEXT, -- Storing address as JSON for simplicity now
                cnh_json TEXT,     -- Storing CNH info as JSON
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
            );
        `);
        console.log('Table clients created/verified.');

        // Vehicles Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS vehicles (
                id VARCHAR(36) PRIMARY KEY,
                tenant_id VARCHAR(36) NOT NULL,
                brand VARCHAR(50),
                model VARCHAR(100),
                year INT,
                price DECIMAL(10, 2),
                plate VARCHAR(10),
                mileage INT,
                images_json TEXT, -- Array of strings
                status VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
            );
        `);
        console.log('Table vehicles created/verified.');

        // Bank Credentials
        await connection.query(`
            CREATE TABLE IF NOT EXISTS bank_credentials (
                id VARCHAR(36) PRIMARY KEY,
                tenant_id VARCHAR(36) NOT NULL,
                bank_id VARCHAR(50) NOT NULL,
                login VARCHAR(100) NOT NULL,
                password_enc VARCHAR(255), -- Should be encrypted!
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
                UNIQUE KEY unique_bank_tenant (tenant_id, bank_id)
            );
        `);
        console.log('Table bank_credentials created/verified.');

        // Insert Default Tenant if not exists (for testing)
        const [rows]: any = await connection.query("SELECT * FROM tenants WHERE subdomain = 'demo'");
        if (rows.length === 0) {
            await connection.query(`
                INSERT INTO tenants (id, subdomain, name)
                VALUES ('tenant-123', 'demo', 'Concessionária Demo')
            `);
            console.log('Inserted default demo tenant.');
        }

        connection.release();
        console.log('Database initialization completed successfully.');
        process.exit(0);

    } catch (error) {
        console.error('Database initialization failed:', error);
        process.exit(1);
    }
};

createTables();
