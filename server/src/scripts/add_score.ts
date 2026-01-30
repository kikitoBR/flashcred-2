
import { query } from '../database';

async function addScoreColumn() {
    try {
        console.log('Adding score column...');
        try {
            await query("ALTER TABLE clients ADD COLUMN score INT DEFAULT 0");
            console.log('Added score column.');
        } catch (e: any) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log('score column already exists.');
            } else {
                console.log('Error adding score (might exist):', e.message);
            }
        }
    } catch (error) {
        console.error('Database error:', error);
    }
    process.exit(0);
}

addScoreColumn();
