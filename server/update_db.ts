import { query } from './src/database';
async function run() {
    try {
        console.log('Adding is_hidden column to users table...');
        await query('ALTER TABLE users ADD COLUMN is_hidden BOOLEAN DEFAULT FALSE');
        console.log('Column added successfully.');
    } catch (e: any) {
        if (e.code === 'ER_DUP_FIELDNAME') {
            console.log('Column already exists.');
        } else {
            console.error('Error adding column:', e);
            process.exit(1);
        }
    }
    process.exit(0);
}
run();
