
import cron from 'node-cron';
import { query, pool } from '../database';
import { sendEmail } from '../utils/email';

/**
 * Monitor Service: Handles scheduled reports and deep health checks
 */
export const initMonitoring = () => {
  console.log('[Monitor] Monitoring Service initialized.');

  // Ensure tables exist before starting
  ensureTablesExist().catch(err => console.error('[Monitor] DB Init Error:', err));

  // Schedule Daily Report at 08:00 AM
  cron.schedule('0 8 * * *', async () => {
    console.log('[Monitor] Generating daily health report...');
    try {
      await generateAndSendDailyReport();
    } catch (err) {
      console.error('[Monitor] Failed to generate daily report:', err);
    }
  });
};

async function ensureTablesExist() {
  await query(`
    CREATE TABLE IF NOT EXISTS security_logs (
      id VARCHAR(36) PRIMARY KEY,
      event_type VARCHAR(50),
      status VARCHAR(20),
      message TEXT,
      ip_address VARCHAR(45),
      tenant_id VARCHAR(36),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  await query(`
    CREATE TABLE IF NOT EXISTS monitoring_configs (
      id VARCHAR(36) PRIMARY KEY,
      config_key VARCHAR(50) UNIQUE,
      config_value TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  console.log('[Monitor] Security tables verified.');
}

/**
 * Deep Health Check: Verifies server and database
 */
export const checkSystemHealth = async () => {
  try {
    // Check DB connection
    await pool.query('SELECT 1');
    return {
      status: 'UP',
      database: 'CONNECTED',
      timestamp: new Date().toISOString()
    };
  } catch (err: any) {
    return {
      status: 'DEGRADED',
      database: 'DISCONNECTED',
      error: err.message,
      timestamp: new Date().toISOString()
    };
  }
};

export async function generateAndSendDailyReport() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.toISOString().split('T')[0];

  // 1. Stats from Simulations
  const sims: any = await query(
    `SELECT COUNT(*) as total, 
            SUM(CASE WHEN status = 'APPROVED' THEN 1 ELSE 0 END) as approved,
            SUM(CASE WHEN status LIKE 'REJECT%' THEN 1 ELSE 0 END) as rejected
     FROM simulations WHERE DATE(created_at) = ?`,
    [dateStr]
  );

  // 2. Security Alerts
  const security: any = await query(
    `SELECT COUNT(*) as count FROM security_logs WHERE DATE(created_at) = ?`,
    [dateStr]
  );

  // 3. Bank Performance
  const bankStats: any = await query(
    `SELECT bank_name, COUNT(*) as count 
     FROM simulations WHERE DATE(created_at) = ? 
     GROUP BY bank_name`,
    [dateStr]
  );

  const stats = sims[0];
  const reportHtml = `
    <div style="font-family: sans-serif; color: #0f172a; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #10b981;">FlashCred: Relatório Diário de Saúde</h2>
      <p>Resumo das atividades solicitadas em <strong>${dateStr}</strong></p>
      
      <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">📊 Fluxo de Simulações</h3>
        <p>Total de Simulações: <strong>${stats.total}</strong></p>
        <p>Aprovadas: <span style="color: #10b981;">${stats.approved}</span></p>
        <p>Reprovadas: <span style="color: #ef4444;">${stats.rejected}</span></p>
      </div>

      <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #fecaca;">
        <h3 style="margin-top: 0; color: #991b1b;">🛡️ Segurança</h3>
        <p>Eventos Suspeitos Registrados: <strong>${security[0].count}</strong></p>
      </div>

      <div>
        <h3>🏦 Performance por Banco</h3>
        <ul>
          ${bankStats.map((b: any) => `<li>${b.bank_name}: <strong>${b.count}</strong></li>`).join('')}
        </ul>
      </div>

      <p style="font-size: 12px; color: #94a3b8; margin-top: 30px; text-align: center;">
        Este é um e-mail automático do sistema de monitoramento FlashCred.
      </p>
    </div>
  `;

  const adminEmails = (process.env.ADMIN_EMAILS || process.env.SMTP_USER || 'contato@flashcred.net').split(',');
  
  for (const email of adminEmails) {
    await sendEmail(email.trim(), `Relatório FlashCred - ${dateStr}`, reportHtml);
    console.log('[Monitor] Daily report sent to:', email.trim());
  }
}
