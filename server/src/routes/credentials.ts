import { Router } from 'express';
import { query } from '../database';
import { v4 as uuidv4 } from 'uuid';
import { encrypt, decrypt } from '../utils/crypto';

const router = Router();

// GET /api/credentials - List all credentials for tenant
router.get('/', async (req, res: any) => {
    try {
        const tenantId = req.tenant.id;
        const credentials: any = await query(
            `SELECT bank_id as bankId, login, password as password_enc, status, last_updated as lastUpdated FROM bank_credentials WHERE tenant_id = ?`,
            [tenantId]
        );

        // Decrypt the passwords to send them back to the UI (as per current design)
        const decryptedCredentials = credentials.map((cred: any) => {
            let password = '';
            try {
                if (cred.password_enc) {
                    password = decrypt(cred.password_enc);
                }
            } catch (e) {
                console.error(`Failed to decrypt password for bank ${cred.bankId}`);
            }
            return {
                bankId: cred.bankId,
                login: cred.login,
                password,
                status: cred.status,
                lastUpdated: cred.lastUpdated
            };
        });

        res.json(decryptedCredentials);
    } catch (error) {
        console.error('Error fetching credentials:', error);
        res.status(500).json({ error: 'Failed to fetch credentials' });
    }
});

// PUT /api/credentials/:bankId - Create or update credential
router.put('/:bankId', async (req, res: any) => {
    try {
        const tenantId = req.tenant.id;
        const bankId = req.params.bankId;
        const { login, password } = req.body;

        if (!login) {
            return res.status(400).json({ error: 'Login is required' });
        }

        // Fetch current to conditionally update password
        const existing: any = await query(
            `SELECT id, password as password_enc FROM bank_credentials WHERE tenant_id = ? AND bank_id = ?`,
            [tenantId, bankId]
        );

        let finalPasswordEnc = '';
        if (password && password.trim() !== '') {
            finalPasswordEnc = encrypt(password);
        } else if (existing.length > 0) {
            finalPasswordEnc = existing[0].password_enc;
        } else {
            return res.status(400).json({ error: 'Password is required for new credentials' });
        }

        if (existing.length > 0) {
            // Update
            await query(
                `UPDATE bank_credentials SET login = ?, password = ? WHERE tenant_id = ? AND bank_id = ?`,
                [login, finalPasswordEnc, tenantId, bankId]
            );
        } else {
            // Insert
            const id = uuidv4();
            await query(
                `INSERT INTO bank_credentials (id, tenant_id, bank_id, login, password) VALUES (?, ?, ?, ?, ?)`,
                [id, tenantId, bankId, login, finalPasswordEnc]
            );
        }

        res.json({ message: 'Credentials saved successfully' });
    } catch (error) {
        console.error('Error saving credentials:', error);
        res.status(500).json({ error: 'Failed to save credentials' });
    }
});

// PATCH /api/credentials/:bankId/status - Toggle bank credential status
router.patch('/:bankId/status', async (req, res: any) => {
    try {
        const tenantId = req.tenant.id;
        const bankId = req.params.bankId;
        const { status } = req.body; // 'ACTIVE', 'INVALID', 'EXPIRED'

        if (!['ACTIVE', 'INVALID', 'EXPIRED'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const existing: any = await query(
            `SELECT id FROM bank_credentials WHERE tenant_id = ? AND bank_id = ?`,
            [tenantId, bankId]
        );

        if (existing.length > 0) {
            await query(
                `UPDATE bank_credentials SET status = ? WHERE tenant_id = ? AND bank_id = ?`,
                [status, tenantId, bankId]
            );
            res.json({ message: 'Status updated successfully' });
        } else {
            // Create an empty, inactive credential if one doesn't exist
            const id = uuidv4();
            await query(
                `INSERT INTO bank_credentials (id, tenant_id, bank_id, login, password, status) VALUES (?, ?, ?, ?, ?, ?)`,
                [id, tenantId, bankId, '', '', status]
            );
            res.json({ message: 'Status updated (and empty credential created)' });
        }

    } catch (error) {
        console.error('Error updating credential status:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
});

export default router;
