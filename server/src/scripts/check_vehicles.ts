
import { query } from '../database';

async function checkVehiclesTable() {
    try {
        console.log('Checking vehicles table...');

        // Check if table exists
        const tables = await query("SHOW TABLES LIKE 'vehicles'");
        console.log('Tables found:', tables);

        if ((tables as any[]).length === 0) {
            console.log('Creating vehicles table...');
            await query(`
                CREATE TABLE IF NOT EXISTS vehicles (
                    id VARCHAR(36) PRIMARY KEY,
                    tenant_id VARCHAR(36) NOT NULL,
                    brand VARCHAR(100) NOT NULL,
                    model VARCHAR(100) NOT NULL,
                    year INT NOT NULL,
                    price DECIMAL(12, 2) NOT NULL,
                    plate VARCHAR(20),
                    mileage INT DEFAULT 0,
                    images_json JSON,
                    status ENUM('AVAILABLE', 'SOLD', 'RESERVED') DEFAULT 'AVAILABLE',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
                    INDEX idx_tenant (tenant_id)
                )
            `);
            console.log('Vehicles table created!');
        } else {
            console.log('Vehicles table already exists.');

            // Show columns
            const columns = await query("DESCRIBE vehicles");
            console.log('Columns:', columns);
        }

    } catch (error) {
        console.error('Error:', error);
    }
    process.exit(0);
}

checkVehiclesTable();
