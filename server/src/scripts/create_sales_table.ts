
import { query } from '../database';

async function createSalesTable() {
    try {
        console.log('Creating sales table...');

        await query(`
            CREATE TABLE IF NOT EXISTS sales (
                id VARCHAR(36) PRIMARY KEY,
                tenant_id VARCHAR(36) NOT NULL,
                client_id VARCHAR(36),
                client_name VARCHAR(255) NOT NULL,
                client_cpf VARCHAR(20),
                vehicle_id VARCHAR(36),
                vehicle_description VARCHAR(255) NOT NULL,
                bank_id VARCHAR(50) NOT NULL,
                bank_name VARCHAR(100) NOT NULL,
                financed_value DECIMAL(12, 2) NOT NULL,
                down_payment DECIMAL(12, 2) DEFAULT 0,
                installments INT DEFAULT 48,
                monthly_payment DECIMAL(10, 2),
                interest_rate DECIMAL(5, 2),
                status ENUM('PENDING', 'APPROVED', 'REJECTED', 'FINALIZED') DEFAULT 'PENDING',
                sale_date DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (tenant_id) REFERENCES tenants(id),
                INDEX idx_tenant_date (tenant_id, sale_date),
                INDEX idx_status (status)
            )
        `);

        console.log('Sales table created successfully!');

        // Also create simulations table to track all simulation attempts
        await query(`
            CREATE TABLE IF NOT EXISTS simulations (
                id VARCHAR(36) PRIMARY KEY,
                tenant_id VARCHAR(36) NOT NULL,
                client_id VARCHAR(36),
                client_name VARCHAR(255) NOT NULL,
                client_cpf VARCHAR(20),
                vehicle_id VARCHAR(36),
                vehicle_description VARCHAR(255),
                bank_id VARCHAR(50) NOT NULL,
                bank_name VARCHAR(100) NOT NULL,
                status ENUM('PENDING', 'APPROVED', 'REJECTED', 'ERROR') DEFAULT 'PENDING',
                result_data JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (tenant_id) REFERENCES tenants(id),
                INDEX idx_tenant_created (tenant_id, created_at)
            )
        `);

        console.log('Simulations table created successfully!');

    } catch (error) {
        console.error('Error creating tables:', error);
    }
    process.exit(0);
}

createSalesTable();
