
import React, { useState } from 'react';
import { Send, ArrowLeft, CheckCircle2, AlertCircle, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Erro ao processar');
            setMessage(data.message);
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
                    <p className="text-slate-400 mt-2 text-sm relative z-10">Insira seu e-mail para receber o link</p>
                </div>

                <div className="p-8 bg-white">
                    {message ? (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 size={32} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">E-mail Enviado!</h2>
                            <p className="text-slate-500 text-sm mb-6">{message}</p>
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 rounded-xl transition-all"
                            >
                                Voltar para o Login
                            </button>
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
                                    <label className="block text-sm font-medium text-slate-700 mb-2">E-mail</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-slate-50 focus:bg-white"
                                        placeholder="seu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-lg flex justify-center items-center gap-2 group disabled:opacity-70"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            Enviar Link
                                            <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate('/login')}
                                    className="w-full flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
                                >
                                    <ArrowLeft size={16} />
                                    Voltar para o Login
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
