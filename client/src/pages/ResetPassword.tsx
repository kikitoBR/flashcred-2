
import React, { useState, useEffect } from 'react';
import { Lock, CheckCircle2, AlertCircle, Zap, Loader2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            setError('Token de recuperao invlido ou ausente.');
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }
        if (newPassword.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Erro ao redefinir senha.');

            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-slate-900 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-slate-800">
                <div className="p-8 text-center border-b border-slate-800 relative rounded-t-2xl">
                    <div className="w-56 h-auto mx-auto mb-2 relative z-10">
                        <img src="/logo-bg.png" alt="FlashCred Logo" className="w-full h-full object-contain drop-shadow-md" />
                    </div>
                    <p className="text-slate-400 mt-2 text-sm relative z-10">Crie uma senha segura para sua conta</p>
                </div>

                <div className="p-8 bg-white">
                    {success ? (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 size={32} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Senha Alterada!</h2>
                            <p className="text-slate-500 text-sm mb-6">Sua senha foi atualizada com sucesso. Redirecionando para o login...</p>
                            <div className="flex justify-center">
                                <Loader2 className="animate-spin text-emerald-500" />
                            </div>
                        </div>
                    ) : (
                        <>
                            {error && (
                                <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm font-medium border border-red-100">
                                    <AlertCircle size={20} />
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Nova Senha</label>
                                    <div className="relative">
                                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="password"
                                            required
                                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-slate-50 focus:bg-white"
                                            placeholder="••••••••"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Confirmar Nova Senha</label>
                                    <div className="relative">
                                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="password"
                                            required
                                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-slate-50 focus:bg-white"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !token}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-lg flex justify-center items-center gap-2 group disabled:opacity-70"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        'Redefinir Senha'
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
