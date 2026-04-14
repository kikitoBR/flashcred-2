
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Zap, AlertCircle, CheckCircle, UserCheck } from 'lucide-react';

export const Register = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Token de convite não encontrado no link.');
      setLoading(false);
      return;
    }
    validateToken();
  }, [token]);

  const getApiUrl = (path: string) => {
    const isLocalhost = window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1');
    return isLocalhost ? `http://localhost:3001${path}` : path;
  };

  const validateToken = async () => {
    try {
      const isLocalhost = window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1');
      const headers: Record<string, string> = {};
      if (isLocalhost) headers['x-tenant-id'] = 'demo';

      const res = await fetch(getApiUrl(`/api/invitations/validate/${token}`), { headers });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Convite inválido ou expirado');
      }

      setEmail(data.email);
      setRole(data.role);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setSubmitting(true);
    try {
      const isLocalhost = window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (isLocalhost) headers['x-tenant-id'] = 'demo';

      const res = await fetch(getApiUrl('/api/invitations/register'), {
        method: 'POST',
        headers,
        body: JSON.stringify({ token, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao processar cadastro');

      setSuccess(true);
      setTimeout(() => navigate('/sign-in'), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-white flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium">Validando seu convite...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-slate-800">
        <div className="p-8 text-center border-b border-slate-800 relative rounded-t-2xl">
          <div className="w-56 h-auto mx-auto mb-2 relative z-10">
            <img src="/logo-bg.png" alt="FlashCred Logo" className="w-full h-full object-contain drop-shadow-md" />
          </div>
          <p className="text-slate-400 mt-2 relative z-10">Ative seu acesso ao sistema</p>
        </div>

        <div className="p-8 bg-white">
          {error && (
            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm font-medium border border-red-100">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                <CheckCircle size={32} />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Conta Ativada!</h2>
              <p className="text-slate-500 mb-6">Seu cadastro foi realizado com sucesso. Redirecionando para o login...</p>
              <button 
                onClick={() => navigate('/sign-in')}
                className="text-emerald-600 font-bold hover:underline"
              >
                Clique aqui se não for redirecionado
              </button>
            </div>
          ) : !error ? (
            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">E-mail (Vinculado ao Convite)</label>
                <input
                  type="email"
                  disabled
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed opacity-80"
                  value={email}
                />
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-bold">Papel: {role}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Escolha sua Senha</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-slate-50 focus:bg-white"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Confirme a Senha</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-slate-50 focus:bg-white"
                  placeholder="Repita a senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-lg flex justify-center items-center gap-2 group disabled:opacity-70"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'Ativar Minha Conta'
                )}
              </button>
            </form>
          ) : (
             <div className="text-center py-4">
                <button 
                  onClick={() => navigate('/sign-in')}
                  className="bg-slate-900 text-white px-6 py-2 rounded-xl"
                >
                  Voltar para o Login
                </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
