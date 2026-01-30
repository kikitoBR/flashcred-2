
import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Vehicle, Client } from '../../types';
import { Button, Input, Modal } from './ui';

interface SaleRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    vehicle: Vehicle | null;
    clients: Client[];
    onConfirm: (saleData: any) => void;
}

export const SaleRegistrationModal: React.FC<SaleRegistrationModalProps> = ({
    isOpen,
    onClose,
    vehicle,
    clients,
    onConfirm
}) => {
    const [clientId, setClientId] = useState('');
    const [saleValue, setSaleValue] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'FINANCING' | 'CASH' | 'CONSORTIUM'>('FINANCING');
    const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        if (isOpen && vehicle) {
            setSaleValue(vehicle.price.toString());
            setClientId('');
            setPaymentMethod('FINANCING');
            setSaleDate(new Date().toISOString().split('T')[0]);
        }
    }, [isOpen, vehicle]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm({
            clientId,
            value: Number(saleValue),
            paymentMethod,
            date: saleDate
        });
    };

    if (!vehicle) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Registrar Venda">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4">
                    <div className="flex gap-4 items-center">
                        <div className="w-16 h-12 bg-slate-200 rounded overflow-hidden">
                            <img src={vehicle.images[0]} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">{vehicle.brand} {vehicle.model}</h3>
                            <p className="text-xs text-slate-500">{vehicle.plate}</p>
                        </div>
                        <div className="ml-auto text-right">
                            <p className="text-xs text-slate-400">Preço Anunciado</p>
                            <p className="font-bold text-emerald-600">R$ {vehicle.price.toLocaleString('pt-BR')}</p>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Cliente Comprador</label>
                    <select
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={clientId}
                        onChange={(e) => setClientId(e.target.value)}
                        required
                    >
                        <option value="">Selecione o cliente...</option>
                        {clients.filter(c => c.status === 'ACTIVE').map(client => (
                            <option key={client.id} value={client.id}>{client.name} - {client.cpf}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Valor Final da Venda (R$)"
                        type="number"
                        value={saleValue}
                        onChange={(e: any) => setSaleValue(e.target.value)}
                        required
                    />
                    <Input
                        label="Data da Venda"
                        type="date"
                        value={saleDate}
                        onChange={(e: any) => setSaleDate(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Forma de Pagamento</label>
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { id: 'FINANCING', label: 'Financiamento' },
                            { id: 'CASH', label: 'À Vista' },
                            { id: 'CONSORTIUM', label: 'Consórcio' },
                        ].map((method) => (
                            <button
                                key={method.id}
                                type="button"
                                className={`py-2 px-3 rounded-lg text-xs font-bold border-2 transition-all ${paymentMethod === method.id
                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                    : 'border-slate-200 bg-white text-slate-500 hover:border-emerald-200'
                                    }`}
                                onClick={() => setPaymentMethod(method.id as any)}
                            >
                                {method.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4">
                    <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
                    <Button type="submit" variant="success" icon={<CheckCircle2 className="w-4 h-4" />}>Confirmar Venda</Button>
                </div>
            </form>
        </Modal>
    );
};
