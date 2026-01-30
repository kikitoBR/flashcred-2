
import { Router } from 'express';
import { query } from '../database';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// GET /api/vehicles
router.get('/', async (req, res: any) => {
    try {
        const tenantId = req.tenant.id;
        const vehicles = await query('SELECT * FROM vehicles WHERE tenant_id = ? ORDER BY created_at DESC', [tenantId]);

        const parsedVehicles = (vehicles as any[]).map(v => ({
            ...v,
            images: JSON.parse(v.images_json || '[]')
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
        const { brand, model, year, price, plate, mileage, images } = req.body;

        const id = uuidv4();
        const imagesJson = JSON.stringify(images || []);

        await query(
            `INSERT INTO vehicles (id, tenant_id, brand, model, year, price, plate, mileage, images_json, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'AVAILABLE')`,
            [id, tenantId, brand, model, year, price, plate, mileage, imagesJson]
        );

        res.status(201).json({ id, message: 'Vehicle created successfully' });
    } catch (error) {
        console.error('Error creating vehicle:', error);
        res.status(500).json({ error: 'Failed to create vehicle' });
    }
});

export default router;
