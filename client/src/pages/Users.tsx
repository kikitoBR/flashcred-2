import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Save, Trash2, X, Plus, Link as LinkIcon, Copy, Clock, CheckCircle } from 'lucide-react';

export const Users = () => {
  const { user, token } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [invites, setInvites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [email, setEmail] = useState('');
  const [role, setRole] = useState('vendedor');
  const [generatedLink, setGeneratedLink] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchInvites();
  }, []);

  const getHeaders = () => {
    const host = window.location.hostname;
    const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    if (isLocalhost) headers['x-tenant-id'] = 'demo';
    return headers;
  };

  const getApiUrl = (path: string) => {
    const isLocalhost = window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1');
    return isLocalhost ? `http://localhost:3001${path}` : path;
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(getApiUrl('/api/users'), { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvites = async () => {
    try {
      const res = await fetch(getApiUrl('/api/invitations'), { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setInvites(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleGenerateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneratedLink('');
    try {
      const res = await fetch(getApiUrl('/api/invitations'), {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, role })
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedLink(data.link);
        setEmail('');
        setRole('vendedor');
        fetchInvites();
      } else {
        const err = await res.json();
        alert(err.error || 'Erro ao gerar convite');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateRole = async (id: string, newRole: string) => {
    try {
      const res = await fetch(getApiUrl(`/api/users/${id}/role`), {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) fetchUsers();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente deletar este usuário?')) return;
    try {
      const res = await fetch(getApiUrl(`/api/users/${id}`), {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (res.ok) fetchUsers();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteInvite = async (id: string) => {
    if (!confirm('Remover este convite pendente?')) return;
    try {
      const res = await fetch(getApiUrl(`/api/invitations/${id}`), {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (res.ok) fetchInvites();
    } catch (e) {
      console.error(e);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Link copiado para a área de transferência!');
  };

  if (user?.role !== 'admin') {
    return <div className="p-8 text-center text-red-500">Acesso negado. Apenas administradores podem gerenciar usuários.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Usuários do Sistema</h1>
          <p className="text-slate-500 text-sm">Gerencie o acesso de gerentes e vendedores via convite</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition"
          >
            <UserPlus size={20} />
            <span className="font-medium">Gerar Convite</span>
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-800">Novo Convite de Cadastro</h2>
            <button type="button" onClick={() => { setShowForm(false); setGeneratedLink(''); }} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
          </div>
          
           {!generatedLink ? (
            <form onSubmit={handleGenerateInvite} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">E-mail do Vendedor (Bloqueado no Convite)</label>
                  <input required type="email" placeholder="vendedor@flashcred.com" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Papel</label>
                  <select value={role} onChange={e => setRole(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white">
                    <option value="vendedor">Vendedor</option>
                    <option value="gerente">Gerente</option>
                    <option value="admin">Administrador (Admin)</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-600 font-medium">Cancelar</button>
                <button type="submit" className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-xl hover:bg-emerald-600 font-medium">
                  <LinkIcon size={18} /> Gerar Link Expirável
                </button>
              </div>
              <p className="text-xs text-slate-400">O link expirará automaticamente em 2 horas por segurança.</p>
            </form>
          ) : (
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-center">
              <CheckCircle className="mx-auto text-emerald-500 mb-2" size={32} />
              <h3 className="font-bold text-emerald-900 mb-1">Link Gerado com Sucesso!</h3>
              <p className="text-sm text-emerald-700 mb-4">Envie este link para o e-mail: <strong>{email}</strong></p>
              
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-emerald-200 mb-4">
                <code className="text-xs flex-1 truncate">{generatedLink}</code>
                <button onClick={() => copyToClipboard(generatedLink)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-md transition">
                  <Copy size={18} />
                </button>
              </div>
              
              <button 
                onClick={() => { setShowForm(false); setGeneratedLink(''); }}
                className="text-sm font-medium text-emerald-700 underline"
              >
                Fechar e Voltar
              </button>
            </div>
          )}
        </div>
      )}

      {/* Seção de Convites Pendentes */}
      {invites.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-600">
            <Clock size={18} />
            <h2 className="font-bold">Convites Pendentes</h2>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden text-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                  <th className="py-3 px-6">E-mail</th>
                  <th className="py-3 px-6">Papel</th>
                  <th className="py-3 px-6">Expira em</th>
                  <th className="py-3 px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invites.map(invite => (
                  <tr key={invite.id} className="hover:bg-slate-50">
                    <td className="py-3 px-6 font-medium">{invite.email}</td>
                    <td className="py-3 px-6 capitalize">{invite.role}</td>
                    <td className="py-3 px-6 text-slate-500">{new Date(invite.expires_at).toLocaleTimeString()}</td>
                    <td className="py-3 px-6 text-right space-x-2">
                      <button 
                        onClick={() => copyToClipboard(`${window.location.origin}/#/register?token=${invite.token}`)}
                        className="text-indigo-500 hover:text-indigo-700 p-1"
                        title="Copiar Link"
                      >
                        <Copy size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteInvite(invite.id)}
                        className="text-red-400 hover:text-red-600 p-1"
                        title="Cancelar Convite"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-600">
            <Plus size={18} />
            <h2 className="font-bold">Usuários Ativos</h2>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-500">
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Papel</th>
                  <th className="py-4 px-6">Criado em</th>
                  <th className="py-4 px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="py-4 px-6 font-medium text-slate-800 flex items-center gap-2">
                      <div className="w-8 h-8 flex-shrink-0 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                        {u.email.charAt(0).toUpperCase()}
                      </div>
                      {u.email}
                    </td>
                    <td className="py-4 px-6">
                      <select 
                        value={u.role} 
                        onChange={e => handleUpdateRole(u.id, e.target.value)}
                        disabled={u.id === user?.id}
                        className="bg-transparent border-0 font-medium text-slate-700 focus:ring-0 cursor-pointer disabled:opacity-50"
                      >
                        <option value="vendedor">Vendedor</option>
                        <option value="gerente">Gerente</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-slate-500">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="py-4 px-6 text-right">
                      {u.id !== user?.id && (
                        <button onClick={() => handleDelete(u.id)} className="text-red-400 hover:text-red-600 transition p-2">
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && !loading && (
              <div className="p-8 text-center text-slate-500">Nenhum usuário encontrado.</div>
            )}
          </div>
      </div>
    </div>
  );
};
