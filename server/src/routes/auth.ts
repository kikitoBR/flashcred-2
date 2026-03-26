import { Router } from 'express';
import { query } from '../database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'flashcred_super_secret_key';

// POST /api/auth/login
router.post('/login', async (req: any, res: any) => {
    try {
        const { email, password } = req.body;
        const tenantId = req.tenant?.id;

        if (!email || !password) {
            return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
        }

        // Search user by email and tenant
        let users: any = await query('SELECT * FROM users WHERE email = ? AND tenant_id = ?', [email, tenantId]);

        // Fallback or Initial Admin Setup
        if (!users || users.length === 0) {
            // Se for o primeiro acesso admin, cria o usuário master temporário
            if (email === 'admin@flashcred.com') {
                const id = uuidv4();
                const hash = await bcrypt.hash('admin123', 10);
                await query(
                    'INSERT INTO users (id, tenant_id, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
                    [id, tenantId, email, hash, 'admin']
                );
                users = [{ id, tenant_id: tenantId, email, role: 'admin', password_hash: hash }];
            } else {
                return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
            }
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
        }

        const token = jwt.sign(
            { id: user.id, tenant_id: user.tenant_id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: { id: user.id, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

// GET /api/auth/me - Retrieve current user session info
router.get('/me', authMiddleware, async (req: any, res: any) => {
    try {
        const users: any = await query('SELECT id, email, role FROM users WHERE id = ?', [req.user.id]);
        if (!users || users.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        res.json(users[0]);
    } catch (error) {
        console.error('Fetch me error:', error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

export default router;
