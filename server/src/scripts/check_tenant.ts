
import { query } from '../database';

async function checkTenants() {
    try {
        console.log('Checking tenants...');
        const tenants = await query('SELECT * FROM tenants');
        console.log('Tenants:', tenants);

        if ((tenants as any[]).length === 0) {
            console.log('No tenants found. Creating demo tenant...');
            await query("INSERT INTO tenants (id, name, subdomain, plan, status) VALUES ('demo-id', 'Demo Tenant', 'demo', 'ENTERPRISE', 'ACTIVE')");
            console.log('Demo tenant created.');
        }
    } catch (error) {
        console.error('Database error:', error);
    }
    process.exit(0);
}

checkTenants();
