
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calculator, CheckCircle2, Car } from 'lucide-react';
import { Vehicle } from '../../types';
import { Badge, Button, Modal } from './ui';

interface VehicleDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    vehicle: Vehicle | null;
    onSimulate: (v: Vehicle) => void;
    onRegisterSale: (v: Vehicle) => void;
}

export const VehicleDetailsModal: React.FC<VehicleDetailsModalProps> = ({
    isOpen,
    onClose,
    vehicle,
    onSimulate,
    onRegisterSale
}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (isOpen) setCurrentImageIndex(0);
    }, [isOpen, vehicle]);

    if (!vehicle) return null;

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % vehicle.images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`${vehicle.brand} ${vehicle.model}`} maxWidth="4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Gallery */}
                <div className="space-y-4">
                    <div className="relative h-64 md:h-80 bg-slate-100 rounded-lg overflow-hidden group flex items-center justify-center">
                        {vehicle.images && vehicle.images.length > 0 ? (
                            <>
                                <img
                                    src={vehicle.images[currentImageIndex] || vehicle.images[0]}
                                    alt={`${vehicle.brand} ${vehicle.model}`}
                                    className="w-full h-full object-cover"
                                />
                                {vehicle.images.length > 1 && (
                                    <>
                                        <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"><ChevronLeft size={20} /></button>
                                        <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"><ChevronRight size={20} /></button>
                                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                                            {currentImageIndex + 1} / {vehicle.images.length}
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <Car className="w-24 h-24 text-slate-300" strokeWidth={1.5} />
                        )}
                        <div className="absolute top-2 right-2">
                            <Badge variant={vehicle.status === 'AVAILABLE' ? 'success' : vehicle.status === 'SOLD' ? 'neutral' : 'warning'}>
                                {vehicle.status === 'AVAILABLE' ? 'Disponível' : vehicle.status === 'SOLD' ? 'Vendido' : 'Reservado'}
                            </Badge>
                        </div>
                    </div>
                    {vehicle.images && vehicle.images.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {vehicle.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={`flex-shrink-0 w-20 h-14 rounded-md overflow-hidden border-2 transition-all ${currentImageIndex === idx ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Details & Actions */}
                <div className="flex flex-col h-full">
                    <div className="flex-1 space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">{vehicle.brand} {vehicle.model}</h2>
                            <p className="text-slate-500 text-sm mt-1">{vehicle.year} • {vehicle.mileage.toLocaleString()} km</p>
                        </div>

                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-emerald-600">R$ {vehicle.price.toLocaleString('pt-BR')}</span>
                            <span className="text-sm text-slate-400">à vista</span>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-3">
                            <h3 className="text-sm font-bold text-slate-900 uppercase">Especificações</h3>
                            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                                <div className="flex justify-between border-b border-slate-200 pb-1">
                                    <span className="text-slate-500">Placa</span>
                                    <span className="font-medium text-slate-900">{vehicle.plate}</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-200 pb-1">
                                    <span className="text-slate-500">Ano</span>
                                    <span className="font-medium text-slate-900">{vehicle.year}</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-200 pb-1">
                                    <span className="text-slate-500">Km</span>
                                    <span className="font-medium text-slate-900">{vehicle.mileage.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-200 pb-1">
                                    <span className="text-slate-500">Combustível</span>
                                    <span className="font-medium text-slate-900">Flex</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-100 flex gap-3">
                        <Button
                            variant="primary"
                            className="flex-1"
                            icon={<Calculator className="w-4 h-4" />}
                            onClick={() => onSimulate(vehicle)}
                        >
                            Simular Financiamento
                        </Button>
                        {vehicle.status === 'AVAILABLE' && (
                            <Button
                                variant="success"
                                className="flex-1"
                                icon={<CheckCircle2 className="w-4 h-4" />}
                                onClick={() => onRegisterSale(vehicle)}
                            >
                                Registrar Venda
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};
