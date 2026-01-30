
import { query } from '../database';

async function updateDb() {
    try {
        console.log('Updating database schema...');

        // Add columns if they don't exist
        try {
            await query("ALTER TABLE clients ADD COLUMN address_json JSON");
            console.log('Added address_json column.');
        } catch (e: any) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log('address_json column already exists.');
            } else {
                console.error('Error adding address_json:', e);
            }
        }

        try {
            await query("ALTER TABLE clients ADD COLUMN cnh_json JSON");
            console.log('Added cnh_json column.');
        } catch (e: any) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log('cnh_json column already exists.');
            } else {
                console.error('Error adding cnh_json:', e);
            }
        }

        // Ensure Birth Date column exists (user screenshot shows it)
        try {
            await query("ALTER TABLE clients ADD COLUMN birth_date DATE");
            console.log('Added birth_date column.');
        } catch (e: any) {
            console.log('birth_date column check skipped or failed (might exist).', e.message);
        }

    } catch (error) {
        console.error('Database update error:', error);
    }
    process.exit(0);
}

updateDb();
