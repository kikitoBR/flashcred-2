
const API_URL = 'http://localhost:3001/api';

export const rpaService = {
    simulate: async (data: { client: any; vehicle: any; banks: string[] }) => {
        try {
            const response = await fetch(`${API_URL}/simulate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('RPA Service Error:', error);
            throw error;
        }
    }
};

export const clientService = {
    getAll: async () => {
        const response = await fetch(`${API_URL}/clients`);
        if (!response.ok) throw new Error('Failed to fetch clients');
        return response.json();
    },
    create: async (data: any) => {
        const response = await fetch(`${API_URL}/clients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create client');
        return response.json();
    }
};

export const vehicleService = {
    getAll: async () => {
        const response = await fetch(`${API_URL}/vehicles`);
        if (!response.ok) throw new Error('Failed to fetch vehicles');
        return response.json();
    },
    create: async (data: any) => {
        const response = await fetch(`${API_URL}/vehicles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create vehicle');
        return response.json();
    }
};

export const salesService = {
    getAll: async () => {
        const response = await fetch(`${API_URL}/sales`);
        if (!response.ok) throw new Error('Failed to fetch sales');
        return response.json();
    },
    getStats: async () => {
        const response = await fetch(`${API_URL}/sales/stats`);
        if (!response.ok) throw new Error('Failed to fetch sales stats');
        return response.json();
    },
    create: async (data: any) => {
        const response = await fetch(`${API_URL}/sales`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create sale');
        return response.json();
    },
    logSimulation: async (data: any) => {
        const response = await fetch(`${API_URL}/sales/simulation`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to log simulation');
        return response.json();
    }
};
