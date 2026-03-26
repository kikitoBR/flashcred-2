import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'flashcred_super_secret_key';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                tenant_id: string;
                email: string;
                role: string;
            };
        }
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token não fornecido ou inválido.' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET) as any;

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Sessão expirada ou token inválido. Faça login novamente.' });
    }
};

export const requireRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: `Acesso negado. Requer um dos seguintes papéis: ${allowedRoles.join(', ')}` });
        }

        next();
    };
};
