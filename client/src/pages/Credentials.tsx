
import React, { useState, useEffect } from 'react';
import { User, Key, Eye, EyeOff, Save, Loader2 } from 'lucide-react';
import { Card, Button } from '../../components/ui';
import { useAppContext } from '../context/AppContext';
import { BANKS } from '../../constants';
import { Bank, BankCredential } from '../../types';

interface CredentialCardProps {
    bank: Bank;
    credential: BankCredential;
    onSave: (id: string, l: string, p: string) => void;
}

const CredentialCard: React.FC<CredentialCardProps> = ({ bank, credential, onSave }) => {
    const [login, setLogin] = useState(credential.login || '');
    const [password, setPassword] = useState(credential.password || '');
    const [showPassword, setShowPassword] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setLogin(credential.login || '');
        // In a real app we wouldn't populate password from partial returns, but for mock purposes:
        setPassword(credential.password || '');
    }, [credential]);

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        onSave(bank.id, login, password);
        setIsSaving(false);
        setIsDirty(false);
    };

    return (
        <Card className="overflow-hidden flex flex-col h-full border-t-4" style={{ borderTopColor: bank.color.replace('bg-', '') }}>
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${bank.color} shadow-sm`}>
                        {bank.logoInitial}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-sm">{bank.name}</h3>
                        <p className="text-xs text-slate-400">RPA Status: <span className="text-emerald-500 font-semibold">Ativo</span></p>
                    </div>
                </div>
            </div>

            <div className="p-5 space-y-4 flex-1">
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Usuário / Login</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            value={login}
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
                            className="w-full pl-9 pr-10 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setIsDirty(true); }}
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                    Atualizado: {credential.lastUpdated !== '-' ? new Date(credential.lastUpdated).toLocaleDateString('pt-BR') : '-'}
                </span>
                <Button
                    size="sm"
                    disabled={!isDirty || isSaving}
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
    const { bankCredentials, updateBankCredential } = useAppContext();

    const handleSave = (bankId: string, login: string, password?: string) => {
        updateBankCredential({
            bankId,
            login,
            password,
            lastUpdated: new Date().toISOString().split('T')[0]
        });
    };

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
                            credential={credential}
                            onSave={handleSave}
                        />
                    );
                })}
            </div>
        </div>
    );
};
