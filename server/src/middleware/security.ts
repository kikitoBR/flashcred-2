
import { Request, Response, NextFunction } from 'express';
import { query } from '../database';
import { v4 as uuidv4 } from 'uuid';
import { sendResetPasswordEmail, sendEmail } from '../utils/email';

/**
 * Sentinel Middleware: Monitors suspicious activity and 4xx errors
 */
export const securitySentinel = async (req: any, res: Response, next: NextFunction) => {
  const originalJson = res.json;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  
  // Intercept response to watch for errors
  res.json = function (body: any) {
    const statusCode = res.statusCode;
    
    if (statusCode === 401 || statusCode === 403 || statusCode === 429) {
      const eventType = statusCode === 429 ? 'RATE_LIMIT' : 'AUTH_FAILURE';
      
      // Async logging to not block response
      logSecurityEvent(eventType, statusCode.toString(), JSON.stringify(body), ip as string, req.tenant?.id)
        .catch(err => console.error('[Sentinel] Logging error:', err));
    }
    
    return originalJson.call(this, body);
  };

  next();
};

async function logSecurityEvent(type: string, status: string, details: string, ip: string, tenantId: string) {
  const id = uuidv4();
  await query(
    `INSERT INTO security_logs (id, event_type, status, message, ip_address, tenant_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, type, status, details, ip, tenantId || 'GLOBAL']
  );

  // Check for threshold (e.g., 5 events in last 10 minutes from this IP)
  const recentEvents: any = await query(
    `SELECT COUNT(*) as count FROM security_logs 
     WHERE ip_address = ? AND created_at > DATE_SUB(NOW(), INTERVAL 10 MINUTE)`,
    [ip]
  );

  if (recentEvents[0].count === 5) {
    // TRIGGER ALERT EMAIL
    const adminEmails = (process.env.ADMIN_EMAILS || process.env.SMTP_USER || 'contato@flashcred.net').split(',');
    
    const alertBody = `
      <div style="font-family: sans-serif; color: #0f172a; border: 2px solid #ef4444; padding: 20px; border-radius: 12px;">
        <h2 style="color: #ef4444;">🚨 Alerta de Segurança: Atividade Suspeita</h2>
        <p>O sistema detectou um comportamento anômalo vindo de um IP específico.</p>
        <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>IP Alvo:</strong> ${ip}</p>
          <p><strong>Tipo de Evento:</strong> ${type}</p>
          <p><strong>Último Status:</strong> ${status}</p>
          <p><strong>Detalhes:</strong> ${details}</p>
        </div>
        <p style="font-size: 14px;">O IP foi temporariamente restringido pelo sistema de proteção.</p>
      </div>
    `;

    for (const email of adminEmails) {
      await sendEmail(email.trim(), `🚨 ALERTA DE SEGURANÇA - FlashCred`, alertBody);
    }
    
    console.log('[Sentinel] ALERT EMAILS SENT for IP:', ip);
  }
}
