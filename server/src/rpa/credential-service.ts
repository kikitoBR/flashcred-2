import { pool } from '../database';
import { Credential } from './types';
import { decrypt } from '../utils/crypto';

/**
 * CredentialService - Centralized credential management from database.
 * Credentials are stored encrypted (AES-256-GCM) and decrypted on read.
 * 
 * Table schema:
 *   id VARCHAR(36), tenant_id VARCHAR(36), bank_id VARCHAR(50),
 *   login VARCHAR(100), password_enc VARCHAR(255), last_updated TIMESTAMP
 */
export class CredentialService {

    /**
     * Fetch and decrypt credentials for a bank + tenant combination.
     */
    async getCredentials(bankId: string, tenantId: string, userId: string): Promise<Credential | null> {
        try {
            const [rows]: any = await pool.execute(
                `SELECT login, password as password_enc 
                 FROM bank_credentials 
                 WHERE bank_id = ? AND tenant_id = ? AND user_id = ?
                 LIMIT 1`,
                [bankId, tenantId, userId]
            );

            if (!rows || rows.length === 0) {
                console.warn(`[CredentialService] No credentials found for bank="${bankId}", tenant="${tenantId}"`);
                return null;
            }

            const row = rows[0];
            console.log(`[CredentialService] ✅ Fetched credentials for bank="${bankId}" (login: ${row.login})`);

            // Decrypt password
            let password: string;
            try {
                password = decrypt(row.password_enc);
            } catch (err: any) {
                console.error(`[CredentialService] ❌ Failed to decrypt password for bank="${bankId}":`, err.message);
                return null;
            }

            return {
                login: row.login,
                password,
            };
        } catch (error: any) {
            console.error(`[CredentialService] Error fetching credentials:`, error.message);
            return null;
        }
    }
}

// Singleton instance
export const credentialService = new CredentialService();
