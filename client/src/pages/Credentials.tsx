import React, { useState, useEffect } from 'react';
import { User, Key, Eye, EyeOff, Save, Loader2, Power } from 'lucide-react';
import { Card, Button } from '../../components/ui';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { BANKS } from '../../constants';
import { Bank, BankCredential } from '../../types';
import { credentialsService } from '../services/api';

interface CredentialCardProps {
    bank: Bank;
    credential: BankCredential;
    onSaveSuccess: () => void;
}

const CredentialCard: React.FC<CredentialCardProps> = ({ bank, credential, onSaveSuccess }) => {
    const [login, setLogin] = useState(credential.login || '');
    const [password, setPassword] = useState(credential.password || '');
    const [showPassword, setShowPassword] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isStatusToggling, setIsStatusToggling] = useState(false);
    const { user } = useAuth();

    const isAdmin = user?.role === 'admin' || user?.role === 'gerente';
    const isActive = credential.status === 'ACTIVE' || !credential.status;

    useEffect(() => {
        setLogin(credential.login || '');
        setPassword(credential.password || '');
        setIsDirty(false);
    }, [credential]);

    const handleSave = async () => {
        try {
            setIsSaving(true);
            await credentialsService.save(bank.id, login, password);
            setIsDirty(false);
            onSaveSuccess();
        } catch (error) {
            console.error('Failed to save credentials:', error);
            alert('Erro ao salvar credenciais.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggleStatus = async () => {
        if (!isAdmin) return;
        try {
            setIsStatusToggling(true);
            const newStatus = isActive ? 'INACTIVE' : 'ACTIVE';
            await credentialsService.updateStatus(bank.id, newStatus);
            onSaveSuccess(); // Refresh list to update UI state
        } catch (error) {
            console.error('Failed to toggle status:', error);
            alert('Erro ao alterar status.');
        } finally {
            setIsStatusToggling(false);
        }
    };

    return (
        <Card className={`overflow-hidden flex flex-col h-full border-t-4 transition-opacity ${!isActive ? 'opacity-70 grayscale-[30%]' : ''}`} style={{ borderTopColor: bank.color.replace('bg-', '') }}>
            <div className={`p-4 border-b border-slate-100 flex items-center justify-between ${!isActive ? 'bg-slate-100' : 'bg-slate-50/50'}`}>
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${isActive ? bank.color : 'bg-slate-400'} shadow-sm`}>
                        {bank.logoInitial}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-sm">{bank.name}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-xs text-slate-400">RPA Status:</p>
                            <button
                                onClick={handleToggleStatus}
                                disabled={isStatusToggling || !isAdmin}
                                title={!isAdmin ? "Apenas administradores podem alterar o status global deste banco." : "Ativar/Desativar banco para toda a locatária."}
                                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${isActive
                                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                    : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                                    } ${!isAdmin && 'opacity-70 cursor-not-allowed'}`}
                            >
                                {isStatusToggling ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                    <Power className="w-3 h-3" />
                                )}
                                {isActive ? 'Ativo' : 'Inativo'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-5 space-y-4 flex-1">
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Usuário / Login</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all disabled:bg-slate-50 disabled:text-slate-400"
                            value={login}
                            disabled={!isActive}
                            onChange={(e) => { setLogin(e.target.value); setIsDirty(true); }}
                            placeholder="Chave de acesso"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Senha</label>
                    <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type={showPassword ? "text" : "password"}
                            className="w-full pl-9 pr-10 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all disabled:bg-slate-50 disabled:text-slate-400"
                            value={password}
                            disabled={!isActive}
                            onChange={(e) => { setPassword(e.target.value); setIsDirty(true); }}
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={!isActive}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none disabled:opacity-50"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                    Atualizado: {credential.lastUpdated && credential.lastUpdated !== '-' ? new Date(credential.lastUpdated).toLocaleDateString('pt-BR') : '-'}
                </span>
                <Button
                    size="sm"
                    disabled={!isDirty || isSaving || !isActive}
                    variant={isDirty ? "primary" : "outline"}
                    onClick={handleSave}
                    icon={isSaving ? <Loader2 className="animate-spin w-3 h-3" /> : <Save className="w-3 h-3" />}
                >
                    {isSaving ? 'Salvando' : 'Salvar'}
                </Button>
            </div>
        </Card>
    );
};

export const Credentials = () => {
    const { bankCredentials, refreshData } = useAppContext();

    return (
        <div className="space-y-6 animate-fade-in p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-slate-900">Credenciais Bancárias</h1>
                    <p className="text-slate-500 text-sm">Gerencie os acessos do RPA para cada instituição.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {BANKS.map((bank) => {
                    const credential = bankCredentials.find(c => c.bankId === bank.id) || { bankId: bank.id, login: '', lastUpdated: '-' };
                    return (
                        <CredentialCard
                            key={bank.id}
                            bank={bank}
                            credential={credential as BankCredential}
                            onSaveSuccess={refreshData}
                        />
                    );
                })}
            </div>
        </div>
    );
};
