
import { Router } from 'express';
import { query } from '../database';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// GET /api/sales - List all sales for tenant
router.get('/', async (req, res: any) => {
    try {
        const tenantId = req.tenant.id;
        const sales = await query(
            `SELECT * FROM sales WHERE tenant_id = ? ORDER BY created_at DESC LIMIT 100`,
            [tenantId]
        );
        res.json(sales);
    } catch (error) {
        console.error('Error fetching sales:', error);
        res.status(500).json({ error: 'Failed to fetch sales' });
    }
});

// GET /api/sales/stats - Get sales statistics
router.get('/stats', async (req, res: any) => {
    try {
        const tenantId = req.tenant.id;

        // Today's date
        const today = new Date().toISOString().split('T')[0];

        // Get today's simulations count
        const [todaySimsResult] = await query(
            `SELECT COUNT(*) as count FROM simulations WHERE tenant_id = ? AND DATE(created_at) = ?`,
            [tenantId, today]
        ) as any[];

        // Get today's approvals count
        const [todayApprovalsResult] = await query(
            `SELECT COUNT(*) as count FROM simulations WHERE tenant_id = ? AND DATE(created_at) = ? AND status = 'APPROVED'`,
            [tenantId, today]
        ) as any[];

        // Get total financed value (all time)
        const [totalFinancedResult] = await query(
            `SELECT COALESCE(SUM(financed_value), 0) as total FROM sales WHERE tenant_id = ? AND status = 'FINALIZED'`,
            [tenantId]
        ) as any[];

        // Get weekly performance data
        const weeklyData = await query(
            `SELECT 
                DAYOFWEEK(created_at) as day_of_week,
                COUNT(*) as count
             FROM simulations 
             WHERE tenant_id = ? 
               AND created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
             GROUP BY DAYOFWEEK(created_at)
             ORDER BY day_of_week`,
            [tenantId]
        );

        // Get recent simulations
        const recentSimulations = await query(
            `SELECT id, client_name, vehicle_description, bank_name, status, created_at 
             FROM simulations 
             WHERE tenant_id = ? 
             ORDER BY created_at DESC 
             LIMIT 5`,
            [tenantId]
        );

        res.json({
            todaySimulations: todaySimsResult?.count || 0,
            todayApprovals: todayApprovalsResult?.count || 0,
            totalFinanced: totalFinancedResult?.total || 0,
            weeklyData: weeklyData,
            recentSimulations: recentSimulations
        });
    } catch (error) {
        console.error('Error fetching sales stats:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

// POST /api/sales - Create a new sale
router.post('/', async (req, res: any) => {
    try {
        const tenantId = req.tenant.id;
        const {
            clientId,
            clientName,
            clientCpf,
            vehicleId,
            vehicleDescription,
            bankId,
            bankName,
            financedValue,
            downPayment,
            installments,
            monthlyPayment,
            interestRate,
            status,
            saleDate
        } = req.body;

        const id = uuidv4();

        await query(
            `INSERT INTO sales (id, tenant_id, client_id, client_name, client_cpf, vehicle_id, vehicle_description, 
             bank_id, bank_name, financed_value, down_payment, installments, monthly_payment, interest_rate, status, sale_date)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, tenantId, clientId, clientName, clientCpf, vehicleId, vehicleDescription,
                bankId, bankName, financedValue, downPayment || 0, installments || 48,
                monthlyPayment, interestRate, status || 'FINALIZED', saleDate || new Date()]
        );

        res.status(201).json({ id, message: 'Sale registered successfully' });
    } catch (error) {
        console.error('Error creating sale:', error);
        res.status(500).json({ error: 'Failed to create sale' });
    }
});

// POST /api/sales/simulation - Log a simulation attempt
router.post('/simulation', async (req, res: any) => {
    try {
        const tenantId = req.tenant.id;
        const {
            clientId,
            clientName,
            clientCpf,
            vehicleId,
            vehicleDescription,
            bankId,
            bankName,
            status,
            resultData
        } = req.body;

        const id = uuidv4();

        await query(
            `INSERT INTO simulations (id, tenant_id, client_id, client_name, client_cpf, vehicle_id, vehicle_description, 
             bank_id, bank_name, status, result_data)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, tenantId, clientId, clientName, clientCpf, vehicleId, vehicleDescription,
                bankId, bankName, status || 'PENDING', JSON.stringify(resultData || {})]
        );

        res.status(201).json({ id, message: 'Simulation logged successfully' });
    } catch (error) {
        console.error('Error logging simulation:', error);
        res.status(500).json({ error: 'Failed to log simulation' });
    }
});

export default router;
