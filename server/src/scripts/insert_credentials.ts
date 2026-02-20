import { pool } from '../database';
import { v4 as uuidv4 } from 'uuid';
import { encrypt } from '../utils/crypto';

/**
 * Insert/update bank credentials in bank_credentials table.
 * Passwords are encrypted with AES-256-GCM before storage.
 * 
 * Usage: npx ts-node src/scripts/insert_credentials.ts <bank_id> <login> <password>
 * Example: npx ts-node src/scripts/insert_credentials.ts omni 02730L0THADEU 1ERCNCI4
 */
const insertCredentials = async () => {
    const args = process.argv.slice(2);

    if (args.length < 3) {
        console.log('Usage: npx ts-node src/scripts/insert_credentials.ts <bank_id> <login> <password>');
        process.exit(1);
    }

    const [bankId, login, password] = args;
    const tenantId = 'tenant-123';
    const id = uuidv4();

    // Encrypt the password before storing
    const passwordEnc = encrypt(password);
    console.log(`🔒 Password encrypted (${passwordEnc.length} chars)`);

    try {
        const connection = await pool.getConnection();

        await connection.query(
            `INSERT INTO bank_credentials (id, tenant_id, bank_id, login, password_enc)
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE 
                login = VALUES(login), 
                password_enc = VALUES(password_enc),
                last_updated = CURRENT_TIMESTAMP`,
            [id, tenantId, bankId, login, passwordEnc]
        );

        console.log(`✅ Credentials saved for bank="${bankId}", tenant="${tenantId}", login="${login}"`);
        console.log(`🔐 Password stored encrypted in database.`);

        connection.release();
        process.exit(0);
    } catch (error) {
        console.error('Error inserting credentials:', error);
        process.exit(1);
    }
};

insertCredentials();
