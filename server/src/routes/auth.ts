import { Router } from 'express';
import { query } from '../database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware } from '../middleware/auth';
import rateLimit from 'express-rate-limit';
import { sendResetPasswordEmail } from '../utils/email';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'flashcred_super_secret_key';

// Limiters per security best practices
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 10,
    message: { error: 'Muitas tentativas de login. Tente novamente em 15 minutos.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const forgotPasswordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    message: { error: 'Muitas solicitações de recuperação. Tente novamente em 1 hora.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// POST /api/auth/login
router.post('/login', loginLimiter, async (req: any, res: any) => {
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

// POST /api/auth/forgot-password
router.post('/forgot-password', forgotPasswordLimiter, async (req: any, res: any) => {
    try {
        const { email } = req.body;
        const tenantId = req.tenant?.id;

        if (!email) {
            return res.status(400).json({ error: 'E-mail obrigatório.' });
        }

        const users: any = await query('SELECT id, email FROM users WHERE email = ? AND tenant_id = ?', [email, tenantId]);

        if (!users || users.length === 0) {
            // Return success even if not found to prevent user enumeration
            return res.json({ message: 'Se este e-mail estiver cadastrado, um link de recuperação será enviado.' });
        }

        const user = users[0];
        const token = uuidv4();
        const expires = new Date(Date.now() + 3600000); // 1 hour from now

        await query(
            'UPDATE users SET reset_token = ?, reset_expires = ? WHERE id = ?',
            [token, expires, user.id]
        );

        // Protocol and Domain resolution for the link (using hash for HashRouter compatibility)
        const protocol = req.secure ? 'https' : 'http';
        const host = req.get('host');
        const resetLink = `${protocol}://${host}/#/reset-password?token=${token}`;

        const emailSent = await sendResetPasswordEmail(user.email, user.email.split('@')[0], resetLink);
        
        if (!emailSent) {
            return res.status(500).json({ error: 'Erro ao enviar e-mail de recuperação. Por favor, contate o suporte.' });
        }

        res.json({ message: 'Se este e-mail estiver cadastrado, um link de recuperação será enviado.' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Erro ao processar solicitação.' });
    }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req: any, res: any) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ error: 'Token e nova senha são obrigatórios.' });
        }

        const users: any = await query(
            'SELECT id FROM users WHERE reset_token = ? AND reset_expires > NOW()',
            [token]
        );

        if (!users || users.length === 0) {
            return res.status(400).json({ error: 'Token inválido ou expirado.' });
        }

        const user = users[0];
        const hash = await bcrypt.hash(newPassword, 10);

        await query(
            'UPDATE users SET password_hash = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?',
            [hash, user.id]
        );

        res.json({ message: 'Senha atualizada com sucesso!' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Erro ao atualizar senha.' });
    }
});

// GET /api/auth/me
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
