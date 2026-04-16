
import { Router } from 'express';
import { query } from '../database';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// GET /api/vehicles
router.get('/', async (req: any, res: any) => {
    try {
        const tenantId = req.tenant.id;
        const vehicles = await query('SELECT * FROM vehicles WHERE tenant_id = ? ORDER BY created_at DESC', [tenantId]);

        const parsedVehicles = (vehicles as any[]).map(v => ({
            ...v,
            images: JSON.parse(v.images_json || '[]'),
            uf: v.uf,
            version: v.version,
            condition: v.vehicle_condition
        }));

        res.json(parsedVehicles);
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        res.status(500).json({ error: 'Failed to fetch vehicles' });
    }
});

// POST /api/vehicles
router.post('/', async (req, res: any) => {
    try {
        const tenantId = req.tenant.id;
        const { brand, model, version, year, price, plate, mileage, images, uf, condition } = req.body;

        const id = uuidv4();
        const imagesJson = JSON.stringify(images || []);
        const userId = req.user?.id;

        await query(
            `INSERT INTO vehicles (id, tenant_id, user_id, brand, model, version, year, price, plate, mileage, images_json, status, uf, vehicle_condition)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'AVAILABLE', ?, ?)`,
            [id, tenantId, userId, brand, model, version || null, year, price, plate, mileage, imagesJson, uf || null, condition || 'SEMINOVO']
        );

        res.status(201).json({ id, message: 'Vehicle created successfully' });
    } catch (error) {
        console.error('Error creating vehicle:', error);
        res.status(500).json({ error: 'Failed to create vehicle' });
    }
});

// PUT /api/vehicles/:id
router.put('/:id', async (req, res: any) => {
    try {
        const tenantId = req.tenant.id;
        const { id } = req.params;
        const { brand, model, version, year, price, plate, mileage, images, status, uf, condition } = req.body;

        const imagesJson = JSON.stringify(images || []);

        let sql = `UPDATE vehicles 
             SET brand = ?, model = ?, version = ?, year = ?, price = ?, plate = ?, mileage = ?, images_json = ?, status = ?, uf = ?, vehicle_condition = ?
             WHERE id = ? AND tenant_id = ?`;
        let params: any[] = [brand, model, version || null, year, price, plate, mileage, imagesJson, status || 'AVAILABLE', uf || null, condition || 'SEMINOVO', id, tenantId];

        if (req.user?.role === 'vendedor') {
            sql += ' AND user_id = ?';
            params.push(req.user?.id);
        }

        const result: any = await query(sql, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Vehicle not found or unauthorized' });
        }

        res.json({ message: 'Vehicle updated successfully' });
    } catch (error) {
        console.error('Error updating vehicle:', error);
        res.status(500).json({ error: 'Failed to update vehicle' });
    }
});

// DELETE /api/vehicles/:id
router.delete('/:id', async (req: any, res: any) => {
    try {
        const tenantId = req.tenant.id;
        const { id } = req.params;

        // 1. Verificar se o veículo existe e pertence ao tenant
        const vehicle = await query('SELECT * FROM vehicles WHERE id = ? AND tenant_id = ?', [id, tenantId]) as any[];
        if (vehicle.length === 0) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }

        // 2. Verificar se existem vendas finalizadas vinculadas a este veículo
        const sales = await query('SELECT id FROM sales WHERE vehicle_id = ? AND tenant_id = ? AND status = "FINALIZED"', [id, tenantId]) as any[];
        if (sales.length > 0) {
            return res.status(400).json({ 
                error: 'Não é possível excluir um veículo que já possui uma venda finalizada vinculada.' 
            });
        }

        // 3. (Opcional) Desvincular simulações ou apenas deixar o ID órfão. 
        // Aqui optamos por deletar, o banco deve estar configurado para lidar com isso ou as simulações apenas perderão o link.
        await query('DELETE FROM vehicles WHERE id = ? AND tenant_id = ?', [id, tenantId]);

        res.json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        res.status(500).json({ error: 'Failed to delete vehicle' });
    }
});

export default router;
