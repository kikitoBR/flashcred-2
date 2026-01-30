
import { query } from '../database';

async function checkSchema() {
    try {
        console.log('Checking clients table schema...');
        const columns = await query('DESCRIBE clients');
        console.log(JSON.stringify(columns, null, 2));
    } catch (error) {
        console.error('Database error:', error);
    }
    process.exit(0);
}

checkSchema();
