import { Router } from 'express';
import { query } from '../database';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { requireRole, authMiddleware } from '../middleware/auth';

const router = Router();

// Apply auth middleware to all user routes
router.use(authMiddleware);

// Only Admins can manage users
router.use(requireRole(['admin']));

// GET /api/users
router.get('/', async (req: any, res: any) => {
    try {
        const tenantId = req.tenant.id;
        const users = await query('SELECT id, email, role, created_at FROM users WHERE tenant_id = ? ORDER BY created_at DESC', [tenantId]);
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
});

// POST /api/users
router.post('/', async (req: any, res: any) => {
    try {
        const tenantId = req.tenant.id;
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ error: 'Dados incompletos' });
        }

        // Check if user already exists
        const existing: any = await query('SELECT id FROM users WHERE email = ? AND tenant_id = ?', [email, tenantId]);
        if (existing && existing.length > 0) {
            return res.status(400).json({ error: 'Usuário já existe' });
        }

        const id = uuidv4();
        const passwordHash = await bcrypt.hash(password, 10);

        await query(
            'INSERT INTO users (id, tenant_id, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
            [id, tenantId, email, passwordHash, role]
        );

        res.status(201).json({ message: 'Usuário criado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
});

// PUT /api/users/:id/role
router.put('/:id/role', async (req: any, res: any) => {
    try {
        const tenantId = req.tenant.id;
        const { id } = req.params;
        const { role } = req.body;

        if (!role) {
            return res.status(400).json({ error: 'Papel não informado' });
        }

        await query('UPDATE users SET role = ? WHERE id = ? AND tenant_id = ?', [role, id, tenantId]);
        res.json({ message: 'Papel atualizado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar papel do usuário' });
    }
});

// DELETE /api/users/:id
router.delete('/:id', async (req: any, res: any) => {
    try {
        const tenantId = req.tenant.id;
        const { id } = req.params;

        // Prevent admin deleting themselves
        if (req.user.id === id) {
            return res.status(400).json({ error: 'Você não pode deletar a si mesmo' });
        }

        await query('DELETE FROM users WHERE id = ? AND tenant_id = ?', [id, tenantId]);
        res.json({ message: 'Usuário deletado' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
});

export default router;
