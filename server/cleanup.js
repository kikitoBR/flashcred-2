const mysql = require('mysql2/promise');
async function clean() {
  try {
    const db = await mysql.createConnection({
      host: 'srv1194.hstgr.io',
      user: 'u825658242_flashcred',
      password: '44434241Mm.',
      database: 'u825658242_flashcred'
    });
    console.log('--- Database Cleanup Started ---');
    await db.query('SET FOREIGN_KEY_CHECKS = 0');
    
    console.log('Clearing sales...');
    await db.query('TRUNCATE TABLE sales');
    
    console.log('Clearing simulations...');
    await db.query('TRUNCATE TABLE simulations');
    
    console.log('Clearing interactions...');
    await db.query('TRUNCATE TABLE client_interactions');
    
    await db.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('--- Cleanup Successful ---');
    
    const [cs] = await db.query('SELECT COUNT(*) as count FROM clients');
    const [vs] = await db.query('SELECT COUNT(*) as count FROM vehicles');
    console.log(`Remaining Records -> Clients: ${cs[0].count}, Vehicles: ${vs[0].count}`);
    
    await db.end();
    process.exit(0);
  } catch (err) {
    console.error('FAILED:', err);
    process.exit(1);
  }
}
clean();
