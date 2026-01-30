
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
        const rows = await query('SELECT * FROM tenants WHERE subdomain = ?', [subdomain]) as any[];

        if (!rows || rows.length === 0) {
            // Fallback for localhost if the subdomain check failed but we are on localhost (e.g. host is localhost:3000)
            if (host.includes('localhost')) {
                const demoRows = await query("SELECT * FROM tenants WHERE subdomain = 'demo'") as any[];
                if (demoRows && demoRows.length > 0) {
                    req.tenant = demoRows[0];
                    console.log(`[Tenant Lookup] Dev mode (fallback): defaulted to demo tenant.`);
                    return next();
                }
            }
            return res.status(404).json({ error: `Tenant not found for subdomain: ${subdomain}` });
        }

        req.tenant = rows[0];
        console.log(`[Tenant Lookup] Identified: ${req.tenant.name} (${req.tenant.id})`);
        next();
    } catch (error) {
        console.error('Tenant resolution error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
