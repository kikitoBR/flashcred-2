
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
        const hostOnly = host.split(':')[0];
        const parts = hostOnly.split('.');
        
        let subdomain = 'demo';

        // Direct domain or IP/localhost handling
        const isIP = /^\d{1,3}(\.\d{1,3}){3}/.test(hostOnly);
        const isLocal = hostOnly === 'localhost' || hostOnly === '127.0.0.1';
        const isMainDomain = hostOnly === 'flashcred.net';

        if (!isIP && !isLocal && !isMainDomain && parts.length >= 3) {
            // Extract tenant from subdomain.flashcred.net (or similar)
            subdomain = parts[0];
        } else if (isIP || isLocal || isMainDomain) {
            subdomain = 'demo';
        } else {
            // Generic fallback for any other single-word host
            subdomain = parts[0];
        }

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
