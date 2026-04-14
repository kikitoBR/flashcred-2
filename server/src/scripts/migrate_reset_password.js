
const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
    console.log('Starting database migration...');
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });

    try {
        console.log('Adding reset_token and reset_expires to users table...');
        await db.query('ALTER TABLE users ADD COLUMN reset_token VARCHAR(255), ADD COLUMN reset_expires DATETIME');
        console.log('✅ Migration completed successfully');
    } catch (error) {
        if (error.message.includes('Duplicate column name')) {
            console.log('⚠️ Columns already exist, skipping.');
        } else {
            console.error('❌ Migration failed:', error.message);
        }
    } finally {
        await db.end();
        process.exit(0);
    }
}

migrate();
