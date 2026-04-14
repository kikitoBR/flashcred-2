
import { Router } from 'express';
import { query } from '../database';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { requireRole, authMiddleware } from '../middleware/auth';

const router = Router();

/**
 * Initialize Invitations Table if not exists
 */
const initTable = async () => {
    try {
        await query(`
            CREATE TABLE IF NOT EXISTS invitations (
                id VARCHAR(36) PRIMARY KEY,
                tenant_id VARCHAR(36),
                email VARCHAR(255),
                token VARCHAR(255) UNIQUE,
                role VARCHAR(20),
                expires_at TIMESTAMP,
                used BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
    } catch (err) {
        console.error('[Invitations] Init Error:', err);
    }
};
initTable();

// POST /api/invitations - Generate a new invite (Admin Only)
router.post('/', authMiddleware, requireRole(['admin']), async (req: any, res: any) => {
    try {
        const tenantId = req.tenant.id;
        const { email, role } = req.body;

        if (!email || !role) {
            return res.status(400).json({ error: 'E-mail e papel são obrigatórios' });
        }

        // Check if user already exists
        const existing: any = await query('SELECT id FROM users WHERE email = ? AND tenant_id = ?', [email, tenantId]);
        if (existing && existing.length > 0) {
            return res.status(400).json({ error: 'Usuário já cadastrado no sistema.' });
        }

        const id = uuidv4();
        const token = crypto.randomBytes(32).toString('hex');
        
        // Expiry in 2 hours
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 2);

        await query(
            'INSERT INTO invitations (id, tenant_id, email, token, role, expires_at) VALUES (?, ?, ?, ?, ?, ?)',
            [id, tenantId, email, token, role, expiresAt]
        );

        // Construct the link (In production use FlashCred.net, in localhost use hostname)
        const host = req.headers.host?.includes('localhost') ? 'http://localhost:3010' : 'https://flashcred.net';
        const link = `${host}/#/register?token=${token}`;

        res.status(201).json({ 
            id, 
            token, 
            link, 
            expiresAt: expiresAt.toISOString(),
            email,
            role
        });
    } catch (error) {
        console.error('Error creating invitation:', error);
        res.status(500).json({ error: 'Erro ao gerar convite' });
    }
});

// GET /api/invitations/validate/:token - Public check
router.get('/validate/:token', async (req: any, res: any) => {
    try {
        const { token } = req.params;
        
        const rows: any = await query(
            'SELECT * FROM invitations WHERE token = ? AND used = 0 AND expires_at > NOW()',
            [token]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Convite inválido ou expirado' });
        }

        const invite = rows[0];
        res.json({
            email: invite.email,
            role: invite.role,
            tenant_id: invite.tenant_id
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao validar convite' });
    }
});

// POST /api/invitations/register - Public registration
router.post('/register', async (req: any, res: any) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ error: 'Dados incompletos' });
        }

        // Validate token again
        const rows: any = await query(
            'SELECT * FROM invitations WHERE token = ? AND used = 0 AND expires_at > NOW()',
            [token]
        );

        if (rows.length === 0) {
            return res.status(400).json({ error: 'Link de cadastro expirado ou já utilizado' });
        }

        const invite = rows[0];
        const userId = uuidv4();
        const passwordHash = await bcrypt.hash(password, 10);

        // CREATE USER and MARK TOKEN AS USED in a simplified transaction (sequence of queries)
        // Note: Real transaction would be better but let's stick to current pattern
        await query(
            'INSERT INTO users (id, tenant_id, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
            [userId, invite.tenant_id, invite.email, passwordHash, invite.role]
        );

        await query('UPDATE invitations SET used = 1 WHERE id = ?', [invite.id]);

        res.status(201).json({ message: 'Cadastro realizado com sucesso!' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Erro ao processar cadastro' });
    }
});

// GET /api/invitations - List (Admin Only)
router.get('/', authMiddleware, requireRole(['admin']), async (req: any, res: any) => {
    try {
        const tenantId = req.tenant.id;
        const invites = await query(
            'SELECT id, email, role, expires_at, used, created_at, token FROM invitations WHERE tenant_id = ? AND used = 0 AND expires_at > NOW() ORDER BY created_at DESC',
            [tenantId]
        );
        res.json(invites);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar convites' });
    }
});

// DELETE /api/invitations/:id (Admin Only)
router.delete('/:id', authMiddleware, requireRole(['admin']), async (req: any, res: any) => {
    try {
        const tenantId = req.tenant.id;
        await query('DELETE FROM invitations WHERE id = ? AND tenant_id = ?', [req.params.id, tenantId]);
        res.json({ message: 'Convite removido' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao remover convite' });
    }
});

export default router;
