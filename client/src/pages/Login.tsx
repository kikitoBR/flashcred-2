import React, { useState } from 'react';
import { Zap, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const host = window.location.hostname;
      const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1') || host.includes('187.77.255.193');
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (isLocalhost) {
        headers['x-tenant-id'] = 'demo';
      }

      const apiUrl = isLocalhost && window.location.port === '3000' ? 'http://localhost:3001/api/auth/login' : '/api/auth/login';

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao efetuar login');
      }

      login(data.token, data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-slate-900 p-8 text-center border-b border-slate-800 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-amber-500/20 mix-blend-overlay"></div>
          <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 relative z-10 shadow-lg shadow-emerald-500/30">
            <Zap className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white relative z-10">FlashCred</h1>
          <p className="text-slate-400 mt-2 relative z-10">Faça login para continuar</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm font-medium border border-red-100">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
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
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Senha</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-slate-50 focus:bg-white"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                'Entrar'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
