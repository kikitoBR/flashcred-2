
import { query } from '../database';

async function checkTables() {
    try {
        console.log('Checking tables...');
        const tables = await query('SHOW TABLES');
        console.log('Tables:', tables);

        // Check columns of clients
        try {
            const columns = await query('DESCRIBE clients');
            console.log('Clients table columns:', columns);
        } catch (e) {
            console.log('Clients table does not exist or error describing it.');
        }

    } catch (error) {
        console.error('Database error:', error);
    }
    process.exit(0);
}

checkTables();
