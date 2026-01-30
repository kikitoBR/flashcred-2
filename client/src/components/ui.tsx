
import React from 'react';
import { X } from 'lucide-react';

export const Badge = ({ children, variant }: { children: React.ReactNode, variant: string }) => {
    const styles: any = {
        'brand': 'bg-blue-100 text-blue-800',
        'neutral': 'bg-gray-100 text-gray-800',
        'success': 'bg-green-100 text-green-800',
        'warning': 'bg-yellow-100 text-yellow-800',
        'danger': 'bg-red-100 text-red-800',
    };
    return <span className={`px-2 py-1 rounded text-xs font-bold ${styles[variant] || styles.neutral}`}>{children}</span>;
};

export const Button = ({ children, onClick, variant = 'primary', icon, className = '', type = 'button' }: any) => {
    const baseClass = "px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors";
    const variants: any = {
        primary: "bg-emerald-600 text-white hover:bg-emerald-700",
        ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
        outline: "border border-slate-300 text-slate-700 hover:bg-slate-50",
        success: "bg-green-600 text-white hover:bg-green-700",
        neutral: "bg-gray-600 text-white hover:bg-gray-700"
    };
    return (
        <button type={type} onClick={onClick} className={`${baseClass} ${variants[variant]} ${className}`}>
            {icon} {children}
        </button>
    );
};

export const Input = ({ label, className = '', ...props }: any) => (
    <div className={className}>
        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">{label}</label>
        <input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" {...props} />
    </div>
);

export const Modal = ({ isOpen, onClose, title, children, maxWidth = '2xl' }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
            <div className={`bg-white rounded-xl shadow-2xl w-full max-w-${maxWidth} max-h-[90vh] overflow-y-auto`}>
                <div className="flex justify-between items-center p-4 border-b border-slate-100 sticky top-0 bg-white z-10">
                    <h2 className="text-lg font-bold text-slate-900">{title}</h2>
                    <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-slate-600" /></button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};

export const Card = ({ children, className = '', onClick }: any) => (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 ${className}`} onClick={onClick}>
        {children}
    </div>
);
