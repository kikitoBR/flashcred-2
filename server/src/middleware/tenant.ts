
import { Request, Response, NextFunction } from 'express';
import { query } from '../database';

// Extend Express Request interface
declare global {
    namespace Express {
        interface Request {
            tenant?: any;
        }
    }
}

export const tenantMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const host = req.headers.host || '';
        let subdomain = host.split('.')[0];

        // For local development or header override
        if (req.headers['x-tenant-id']) {
            subdomain = req.headers['x-tenant-id'] as string;
        }

        // Localhost handling: try to use 'demo' tenant if no specific subdomain/header
        if (host.includes('localhost') && !req.headers['x-tenant-id']) {
            const demoRows = await query("SELECT * FROM tenants WHERE subdomain = 'demo'") as any[];
            if (demoRows && demoRows.length > 0) {
                req.tenant = demoRows[0];
                console.log(`[Tenant Lookup] Dev mode: defaulted to demo tenant (${req.tenant.id}).`);
                return next();
            } else {
                console.warn('[Tenant Lookup] Running on localhost but no demo tenant found.');
            }
        }

        // Real DB Lookup
        let rows = await query('SELECT * FROM tenants WHERE subdomain = ?', [subdomain]) as any[];

        // IP Address or Missing Subdomain Fallback
        const isIP = /^\d+(\.\d+){3}/.test(host);
        if ((!rows || rows.length === 0) && (isIP || host.includes('localhost'))) {
            console.log(`[Tenant Lookup] Host looks like IP (${host}) or localhost. Falling back to first tenant.`);
            rows = await query('SELECT * FROM tenants LIMIT 1') as any[];
        }

        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: `Tenant not found for subdomain: ${subdomain}. Por favor, use o domínio correto ou verifique o banco de dados.` });
        }

        req.tenant = rows[0];
        console.log(`[Tenant Lookup] Identified: ${req.tenant.name} (${req.tenant.id})`);
        next();
    } catch (error) {
        console.error('Tenant resolution error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
