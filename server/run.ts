import { query } from './src/database';
query("UPDATE tenants SET subdomain='thadeuveiculos' WHERE id='tenant-123'").then(() => {
    console.log('Database Updated');
    process.exit(0);
}).catch(e => {
    console.error(e);
    process.exit(1);
});
