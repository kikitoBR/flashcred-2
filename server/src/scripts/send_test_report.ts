
import { generateAndSendDailyReport } from '../services/monitorService';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Manual Trigger for Health Report
 */
async function test() {
  console.log('[Test] Triggering manual health report simulation...');
  try {
    await generateAndSendDailyReport();
    console.log('[Test] ✅ Simulation finished. Check your emails!');
    process.exit(0);
  } catch (err: any) {
    console.error('[Test] ❌ Simulation failed:', err.message);
    process.exit(1);
  }
}

test();
