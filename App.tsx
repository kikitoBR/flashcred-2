
import React, { useState, useEffect, useContext, createContext, useRef, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Car,
  Calculator,
  LogOut,
  Menu,
  X,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  XCircle,
  TrendingUp,
  DollarSign,
  ChevronRight,
  ChevronDown,
  Loader2,
  Trophy,
  Zap,
  MoreHorizontal,
  MapPin,
  Phone,
  Mail,
  Edit2,
  Trash2,
  PlayCircle,
  PieChart,
  RefreshCw,
  PhoneCall,
  Calendar,
  Filter,
  ImageIcon,
  ArrowRight,
  CheckSquare,
  Square,
  Upload,
  ChevronLeft,
  Eye,
  History,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  User,
  CreditCard,
  FileText,
  Printer,
  ShoppingBag,
  PartyPopper,
  Lock,
  EyeOff,
  Save,
  Key,
  Info
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart as RePieChart, Pie, Cell, Legend
} from 'recharts';
import { Button, Card, Input, Badge, Modal } from './components/ui';
import { BANKS, MOCK_CLIENTS, MOCK_VEHICLES, MOCK_CREDENTIALS } from './constants';
import { Client, Vehicle, SimulationOffer, SimulationResult, BankCredential, Bank, Sale } from './types';
import { generateCreditAnalysis } from './services/geminiService';

const getScoreColor = (score: number) => {
  if (score >= 700) return 'success';
  if (score >= 500) return 'warning';
  return 'danger';
};

// --- Context Definition ---
interface AppContextType {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  vehicles: Vehicle[];
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  bankCredentials: BankCredential[];
  updateBankCredential: (data: BankCredential) => void;
  updateClientScore: (clientId: string, newScore: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// --- Dashboard Page ---
const Dashboard = () => {
  const navigate = useNavigate();
  const data = [
    { name: 'Seg', vendas: 4 },
    { name: 'Ter', vendas: 3 },
    { name: 'Qua', vendas: 7 },
    { name: 'Qui', vendas: 5 },
    { name: 'Sex', vendas: 9 },
    { name: 'Sab', vendas: 12 },
    { name: 'Dom', vendas: 8 },
  ];

  return (
    <div className="space-y-6 animate-fade-in print:hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">Painel de Controle</h1>
          <p className="text-slate-500 text-sm">Bem-vindo de volta ao FlashCred.</p>
        </div>
        <Button className="w-full md:w-auto" variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => navigate('/clients')}>Novo Cliente</Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card className="p-6 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase">Simulações Hoje</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">24</h3>
              <p className="text-xs text-emerald-600 mt-1 flex items-center font-medium">
                <TrendingUp className="w-3 h-3 mr-1" /> +12% vs ontem
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
              <Calculator className="w-6 h-6" />
            </div>
          </div>
        </Card>
        <Card className="p-6 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase">Aprovações</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">15</h3>
              <p className="text-xs text-amber-600 mt-1 flex items-center font-medium">
                <TrendingUp className="w-3 h-3 mr-1" /> 62% Taxa de Conversão
              </p>
            </div>
            <div className="p-3 bg-amber-50 rounded-full text-amber-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </Card>
        <Card className="p-6 border-l-4 border-l-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase">Total Financiado</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">R$ 1.2M</h3>
              <p className="text-xs text-slate-400 mt-1">Este mês</p>
            </div>
            <div className="p-3 bg-slate-100 rounded-full text-slate-700">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Chart & Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Desempenho Semanal</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="vendas" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} name="Vendas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Simulações Recentes</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${i % 2 === 0 ? 'bg-amber-600' : 'bg-emerald-500'}`}>
                    {i % 2 === 0 ? 'I' : 'S'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Roberto Silva</p>
                    <p className="text-xs text-slate-500">Honda Civic • 2022</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={i === 2 ? 'danger' : 'success'}>{i === 2 ? 'Reprovado' : 'Aprovado'}</Badge>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4 text-xs" onClick={() => navigate('/statistics')}>Ver Histórico Completo</Button>
        </Card>
      </div>
    </div>
  );
};

// --- Credential Card Component ---
const CredentialCard = ({ bank, credential, onSave }: { bank: Bank, credential: BankCredential, onSave: (id: string, l: string, p: string) => void }) => {
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

// --- Credentials Page ---
const Credentials = () => {
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
    <div className="space-y-6 animate-fade-in">
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

// --- Statistics Page ---
const Statistics = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'remarketing' | 'retry'>('remarketing');

  // Modal for Client Details
  const [isOppModalOpen, setIsOppModalOpen] = useState(false);
  const [selectedOppClient, setSelectedOppClient] = useState<any>(null);

  // State for History Table
  const [historySearch, setHistorySearch] = useState('');
  const [historyStatusFilter, setHistoryStatusFilter] = useState<string>('ALL');
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  // State for Opportunities (Remarketing/Retry) Table
  const [oppSearch, setOppSearch] = useState('');
  const [oppSortConfig, setOppSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  // Export PDF State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportStartDate, setExportStartDate] = useState('2023-01-01');
  const [exportEndDate, setExportEndDate] = useState(new Date().toISOString().split('T')[0]);

  // Consolidated Data for Last 5 Months
  const salesData = [
    { name: 'Jul', value: 600000 },
    { name: 'Ago', value: 500000 },
    { name: 'Set', value: 750000 },
    { name: 'Out', value: 820000 },
    { name: 'Nov', value: 950000 },
  ];

  // Aggregated Bank Performance (All Time/Period)
  const bankPerformanceData = [
    { name: 'Itaú', aprovados: 120, reprovados: 35 },
    { name: 'Santander', aprovados: 98, reprovados: 45 },
    { name: 'Bradesco', aprovados: 85, reprovados: 55 },
    { name: 'BV', aprovados: 65, reprovados: 30 },
    { name: 'C6', aprovados: 50, reprovados: 25 },
  ];

  // Mock Data for Intelligence Lists
  const remarketingList = [
    { id: 1, name: 'Fernanda Lima', car: 'Jeep Compass', date: 'Há 3 dias', status: 'Aprovado', deal: 'R$ 1.850/mês', cpf: '123.456.789-00', phone: '(11) 99999-1111', income: 6500, email: 'fernanda@email.com' },
    { id: 2, name: 'Marcos Paulo', car: 'Toyota Corolla', date: 'Há 5 dias', status: 'Aprovado', deal: 'R$ 2.100/mês', cpf: '222.987.654-22', phone: '(11) 98888-2222', income: 8200, email: 'marcos@email.com' },
    { id: 3, name: 'Julia Roberts', car: 'Fiat Pulse', date: 'Há 7 dias', status: 'Aprovado', deal: 'R$ 1.450/mês', cpf: '333.123.456-33', phone: '(21) 97777-3333', income: 5000, email: 'julia@email.com' },
    { id: 4, name: 'Carlos Andrade', car: 'Honda City', date: 'Há 1 dia', status: 'Aprovado', deal: 'R$ 1.900/mês', cpf: '444.321.654-44', phone: '(31) 96666-4444', income: 7000, email: 'carlos@email.com' },
    { id: 5, name: 'Luciana Mello', car: 'Renault Kwid', date: 'Há 2 dias', status: 'Aprovado', deal: 'R$ 900/mês', cpf: '555.789.123-55', phone: '(41) 95555-5555', income: 3200, email: 'luciana@email.com' },
  ];

  const retryList = [
    { id: 4, name: 'Ricardo Almeida', car: 'Honda HR-V', date: 'Há 35 dias', income: 4500, newScore: 520, cpf: '666.888.999-66', phone: '(11) 94444-6666', email: 'ricardo@email.com' },
    { id: 5, name: 'Eliane Santos', car: 'VW T-Cross', date: 'Há 42 dias', income: 12000, newScore: null, cpf: '777.111.222-77', phone: '(21) 93333-7777', email: 'eliane@email.com' },
    { id: 6, name: 'Bruno Dias', car: 'Chevrolet Tracker', date: 'Há 60 dias', income: 5800, newScore: 680, cpf: '888.333.444-88', phone: '(31) 92222-8888', email: 'bruno@email.com' },
    { id: 7, name: 'Sérgio Ramos', car: 'Ford Ranger', date: 'Há 32 dias', income: 15000, newScore: 480, cpf: '999.555.666-99', phone: '(41) 91111-9999', email: 'sergio@email.com' },
    { id: 8, name: 'Paula Diniz', car: 'Peugeot 208', date: 'Há 45 dias', income: 3800, newScore: 710, cpf: '000.222.333-00', phone: '(51) 90000-0000', email: 'paula@email.com' },
  ];

  const simulationHistory = [
    { id: 101, client: 'Roberto Silva', vehicle: 'Honda Civic', date: '2023-10-25', status: 'Aprovado', bank: 'Itaú', rate: 1.89 },
    { id: 102, client: 'Ana Souza', vehicle: 'Toyota Corolla', date: '2023-10-25', status: 'Reprovado', bank: '-', rate: 0 },
    { id: 103, client: 'Carlos Oliveira', vehicle: 'Jeep Compass', date: '2023-10-24', status: 'Aprovado', bank: 'Santander', rate: 1.95 },
    { id: 104, client: 'Mariana Costa', vehicle: 'Fiat Pulse', date: '2023-10-24', status: 'Análise', bank: '-', rate: 0 },
    { id: 105, client: 'Pedro Santos', vehicle: 'Chevrolet Onix', date: '2023-05-22', status: 'Aprovado', bank: 'BV', rate: 2.10 },
    { id: 106, client: 'Lucas Pereira', vehicle: 'VW Nivus', date: '2023-10-23', status: 'Aprovado', bank: 'Bradesco', rate: 1.75 },
    { id: 107, client: 'Juliana Melo', vehicle: 'Fiat Toro', date: '2023-10-22', status: 'Reprovado', bank: '-', rate: 0 },
    { id: 108, client: 'Rafael Costa', vehicle: 'Jeep Renegade', date: '2023-10-21', status: 'Aprovado', bank: 'Itaú', rate: 1.99 },
    { id: 109, client: 'Beatriz Silva', vehicle: 'Honda HR-V', date: '2023-10-20', status: 'Aprovado', bank: 'Safra', rate: 2.05 },
    { id: 110, client: 'Gustavo Lima', vehicle: 'Toyota Yaris', date: '2023-10-20', status: 'Análise', bank: '-', rate: 0 },
  ];

  const handleOpenClientDetails = (client: any) => {
    setSelectedOppClient(client);
    setIsOppModalOpen(true);
  };

  const handleSimulateAgain = (clientData: any) => {
    navigate('/simulation', {
      state: {
        preSelectedClient: {
          name: clientData.name,
          cpf: clientData.cpf,
          phone: clientData.phone,
          score: clientData.newScore || clientData.score || 500
        },
        preSelectedVehicleModel: clientData.car
      }
    });
  };

  const handleExportClick = () => {
    setIsExportModalOpen(true);
  };

  const handleConfirmExport = () => {
    setIsExportModalOpen(false);
    // Slight delay to allow modal to close before printing
    setTimeout(() => {
      window.print();
    }, 300);
  };

  // --- History Logic ---
  const filteredHistory = simulationHistory
    .filter(item => {
      const matchesSearch =
        item.client.toLowerCase().includes(historySearch.toLowerCase()) ||
        item.vehicle.toLowerCase().includes(historySearch.toLowerCase()) ||
        item.bank.toLowerCase().includes(historySearch.toLowerCase());

      const matchesStatus = historyStatusFilter === 'ALL' || item.status === historyStatusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (!sortConfig) return 0;
      const { key, direction } = sortConfig;
      // @ts-ignore
      const aValue = a[key];
      // @ts-ignore
      const bValue = b[key];
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig?.key !== columnKey) return <ArrowUpDown size={14} className="text-slate-300 ml-1 inline" />;
    return sortConfig.direction === 'asc'
      ? <ArrowUp size={14} className="text-emerald-600 ml-1 inline" />
      : <ArrowDown size={14} className="text-emerald-600 ml-1 inline" />;
  };

  // --- Opportunities Logic ---
  const currentOppList = activeTab === 'remarketing' ? remarketingList : retryList;

  const filteredOppList = currentOppList
    .filter((item: any) => {
      return item.name.toLowerCase().includes(oppSearch.toLowerCase()) ||
        item.car.toLowerCase().includes(oppSearch.toLowerCase());
    })
    .sort((a: any, b: any) => {
      if (!oppSortConfig) return 0;
      const { key, direction } = oppSortConfig;
      const aValue = a[key];
      const bValue = b[key];
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });

  const requestOppSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (oppSortConfig && oppSortConfig.key === key && oppSortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setOppSortConfig({ key, direction });
  };

  const OppSortIcon = ({ columnKey }: { columnKey: string }) => {
    if (oppSortConfig?.key !== columnKey) return <ArrowUpDown size={14} className="text-slate-300 ml-1 inline" />;
    return oppSortConfig.direction === 'asc'
      ? <ArrowUp size={14} className="text-emerald-600 ml-1 inline" />
      : <ArrowDown size={14} className="text-emerald-600 ml-1 inline" />;
  };

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}`;
  };

  // --- PDF REPORT DATA GENERATION ---
  const reportHistory = useMemo(() => {
    return simulationHistory.filter(item => {
      return item.date >= exportStartDate && item.date <= exportEndDate;
    });
  }, [simulationHistory, exportStartDate, exportEndDate]);

  const reportSummary = useMemo(() => {
    const total = reportHistory.length;
    const approved = reportHistory.filter(i => i.status === 'Aprovado').length;
    const rejected = reportHistory.filter(i => i.status === 'Reprovado').length;
    const approvalRate = total > 0 ? (approved / total) * 100 : 0;
    return { total, approved, rejected, approvalRate };
  }, [reportHistory]);

  return (
    <>
      {/* NORMAL SCREEN VIEW */}
      <div className="space-y-8 animate-fade-in print:hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">Estatísticas & Oportunidades</h1>
            <p className="text-slate-500 text-sm">Inteligência de dados e histórico de operações.</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button className="w-full md:w-auto" variant="primary" icon={<FileText className="w-4 h-4" />} onClick={handleExportClick}>Exportar PDF</Button>
          </div>
        </div>

        {/* Top Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-4 md:p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Desempenho Mensal (Últimos 5 meses)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => `R$${value / 1000}k`} />
                  <Tooltip
                    formatter={(value) => [`R$ ${value.toLocaleString()}`, 'Faturado']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-4 md:p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Aprovação por Banco (Total)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bankPerformanceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} width={70} />
                  <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend />
                  <Bar dataKey="aprovados" name="Aprovados" stackId="a" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                  <Bar dataKey="reprovados" name="Reprovados" stackId="a" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Simulation History with Filters */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <History className="text-slate-600" size={24} /> Histórico Geral
          </h2>

          <div className="flex flex-col md:flex-row gap-4 mb-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Pesquisar por cliente, veículo ou banco..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <select
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={historyStatusFilter}
                onChange={(e) => setHistoryStatusFilter(e.target.value)}
              >
                <option value="ALL">Todos os Status</option>
                <option value="Aprovado">Aprovados</option>
                <option value="Reprovado">Reprovados</option>
                <option value="Análise">Em Análise</option>
              </select>
            </div>
          </div>

          <Card className="overflow-hidden">
            <div className="max-h-[500px] overflow-auto custom-scrollbar">
              <table className="w-full text-left relative min-w-[600px]">
                <thead className="bg-slate-50 border-b border-slate-100 sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th
                      className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase cursor-pointer hover:bg-slate-100 select-none"
                      onClick={() => requestSort('date')}
                    >
                      Data <SortIcon columnKey="date" />
                    </th>
                    <th
                      className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase cursor-pointer hover:bg-slate-100 select-none"
                      onClick={() => requestSort('client')}
                    >
                      Cliente <SortIcon columnKey="client" />
                    </th>
                    <th
                      className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase cursor-pointer hover:bg-slate-100 select-none"
                      onClick={() => requestSort('vehicle')}
                    >
                      Veículo <SortIcon columnKey="vehicle" />
                    </th>
                    <th
                      className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase cursor-pointer hover:bg-slate-100 select-none"
                      onClick={() => requestSort('status')}
                    >
                      Status <SortIcon columnKey="status" />
                    </th>
                    <th
                      className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase cursor-pointer hover:bg-slate-100 select-none"
                      onClick={() => requestSort('bank')}
                    >
                      Melhor Banco <SortIcon columnKey="bank" />
                    </th>
                    <th
                      className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase cursor-pointer hover:bg-slate-100 select-none"
                      onClick={() => requestSort('rate')}
                    >
                      Taxa <SortIcon columnKey="rate" />
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-slate-500 text-sm whitespace-nowrap">{formatDate(item.date)}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">{item.client}</td>
                      <td className="px-6 py-4 text-slate-600">{item.vehicle}</td>
                      <td className="px-6 py-4">
                        <Badge variant={item.status === 'Aprovado' ? 'success' : item.status === 'Reprovado' ? 'danger' : 'warning'}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{item.bank}</td>
                      <td className="px-6 py-4 font-bold text-emerald-600 text-sm">
                        {item.rate > 0 ? `${item.rate.toFixed(2)}%` : '-'}
                      </td>
                    </tr>
                  ))}
                  {filteredHistory.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                        Nenhuma simulação encontrada com os filtros atuais.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Intelligence Module */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Zap className="text-[#CD7F32]" size={24} /> Oportunidades Recuperáveis
          </h2>

          <Card className="overflow-hidden flex flex-col h-full">
            {/* Tabs */}
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => { setActiveTab('remarketing'); setOppSearch(''); }}
                className={`flex-1 py-4 text-xs md:text-sm font-semibold text-center transition-colors border-b-2 ${activeTab === 'remarketing' ? 'border-emerald-500 text-emerald-600 bg-emerald-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
              >
                <div className="flex flex-col md:flex-row items-center justify-center gap-2">
                  <div className="flex items-center gap-1">
                    <PhoneCall size={16} />
                    Remarketing
                  </div>
                  <Badge variant="brand">{remarketingList.length}</Badge>
                </div>
              </button>
              <button
                onClick={() => { setActiveTab('retry'); setOppSearch(''); }}
                className={`flex-1 py-4 text-xs md:text-sm font-semibold text-center transition-colors border-b-2 ${activeTab === 'retry' ? 'border-amber-500 text-amber-600 bg-amber-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
              >
                <div className="flex flex-col md:flex-row items-center justify-center gap-2">
                  <div className="flex items-center gap-1">
                    <RefreshCw size={16} />
                    Repescagem
                  </div>
                  <Badge variant="warning">{retryList.length}</Badge>
                </div>
              </button>
            </div>

            {/* Search Bar for Opportunities */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={`Pesquisar na lista de ${activeTab === 'remarketing' ? 'Remarketing' : 'Repescagem'}...`}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={oppSearch}
                  onChange={(e) => setOppSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="p-0">
              <div className="max-h-[400px] overflow-auto custom-scrollbar">
                {activeTab === 'remarketing' && (
                  <table className="w-full text-left relative min-w-[600px]">
                    <thead className="bg-slate-50 border-b border-slate-100 sticky top-0 z-10 shadow-sm">
                      <tr>
                        <th
                          className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase cursor-pointer hover:bg-slate-100 select-none"
                          onClick={() => requestOppSort('name')}
                        >
                          Cliente <OppSortIcon columnKey="name" />
                        </th>
                        <th
                          className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase cursor-pointer hover:bg-slate-100 select-none"
                          onClick={() => requestOppSort('car')}
                        >
                          Veículo <OppSortIcon columnKey="car" />
                        </th>
                        <th
                          className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase cursor-pointer hover:bg-slate-100 select-none"
                          onClick={() => requestOppSort('date')}
                        >
                          Data <OppSortIcon columnKey="date" />
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Oferta</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredOppList.map((item: any) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleOpenClientDetails(item)}
                              className="font-medium text-emerald-600 hover:underline text-left focus:outline-none"
                            >
                              {item.name}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-slate-600">{item.car}</td>
                          <td className="px-6 py-4 text-slate-500">{item.date}</td>
                          <td className="px-6 py-4">
                            <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded text-xs">{item.deal}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button size="sm" variant="primary" icon={<Phone size={14} />} onClick={() => handleOpenClientDetails(item)}>Contatar</Button>
                          </td>
                        </tr>
                      ))}
                      {filteredOppList.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                            Nenhum cliente encontrado nesta lista.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}

                {activeTab === 'retry' && (
                  <table className="w-full text-left relative min-w-[600px]">
                    <thead className="bg-slate-50 border-b border-slate-100 sticky top-0 z-10 shadow-sm">
                      <tr>
                        <th
                          className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase cursor-pointer hover:bg-slate-100 select-none"
                          onClick={() => requestOppSort('name')}
                        >
                          Cliente <OppSortIcon columnKey="name" />
                        </th>
                        <th
                          className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase cursor-pointer hover:bg-slate-100 select-none"
                          onClick={() => requestOppSort('car')}
                        >
                          Veículo <OppSortIcon columnKey="car" />
                        </th>
                        <th
                          className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase cursor-pointer hover:bg-slate-100 select-none"
                          onClick={() => requestOppSort('date')}
                        >
                          Data <OppSortIcon columnKey="date" />
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Contato</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredOppList.map((item: any) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleOpenClientDetails(item)}
                              className="font-medium text-emerald-600 hover:underline text-left focus:outline-none"
                            >
                              {item.name}
                            </button>
                            {item.newScore && <div className="text-xs text-emerald-600 mt-1 flex items-center gap-1"><TrendingUp size={10} /> Score: {item.newScore}</div>}
                          </td>
                          <td className="px-6 py-4 text-slate-600">{item.car}</td>
                          <td className="px-6 py-4">
                            <span className="text-amber-700 bg-amber-50 px-2 py-1 rounded text-xs border border-amber-100">{item.date}</span>
                          </td>
                          <td className="px-6 py-4 text-slate-600 text-sm font-medium">
                            {item.phone}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              size="sm"
                              variant="secondary"
                              icon={<PlayCircle size={14} />}
                              onClick={() => handleSimulateAgain(item)}
                            >
                              Simular
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {filteredOppList.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                            Nenhum cliente encontrado nesta lista.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Opp Client Details Modal */}
        <Modal
          isOpen={isOppModalOpen}
          onClose={() => setIsOppModalOpen(false)}
          title="Detalhes do Cliente"
        >
          {selectedOppClient && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                  <User size={32} className="text-slate-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedOppClient.name}</h3>
                  <p className="text-slate-500 text-sm">Cliente em Potencial</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">Contato</p>
                  <div className="flex items-center gap-2 text-sm text-slate-700 mb-1">
                    <Phone size={14} /> {selectedOppClient.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <Mail size={14} /> {selectedOppClient.email}
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">Dados Pessoais</p>
                  <p className="text-sm text-slate-700">CPF: {selectedOppClient.cpf}</p>
                  <p className="text-sm text-slate-700 mt-1">Renda: <span className="font-bold text-emerald-600">R$ {selectedOppClient.income?.toLocaleString()}</span></p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h4 className="font-bold text-slate-900 mb-2">Veículo de Interesse</h4>
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Car className="text-slate-400" />
                    <span className="font-medium text-slate-700">{selectedOppClient.car}</span>
                  </div>
                  <Badge variant={activeTab === 'remarketing' ? 'success' : 'warning'}>
                    {activeTab === 'remarketing' ? 'Aprovado' : 'Recusado'}
                  </Badge>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button onClick={() => setIsOppModalOpen(false)} variant="outline">Fechar</Button>
                <Button
                  className="ml-2"
                  icon={<PlayCircle size={14} />}
                  onClick={() => {
                    setIsOppModalOpen(false);
                    handleSimulateAgain(selectedOppClient);
                  }}
                >
                  Simular Novamente
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Export Date Selection Modal */}
        <Modal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          title="Exportar Relatório PDF"
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Selecione o período que deseja incluir no relatório:</p>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Data Início"
                type="date"
                value={exportStartDate}
                onChange={(e) => setExportStartDate(e.target.value)}
              />
              <Input
                label="Data Fim"
                type="date"
                value={exportEndDate}
                onChange={(e) => setExportEndDate(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button variant="ghost" onClick={() => setIsExportModalOpen(false)}>Cancelar</Button>
              <Button variant="primary" icon={<Printer size={16} />} onClick={handleConfirmExport}>Gerar Relatório</Button>
            </div>
          </div>
        </Modal>
      </div>

      {/* HIDDEN PRINT VIEW */}
      <div className="hidden print:block font-sans p-8 bg-white text-slate-900">
        {/* Print Header */}
        <div className="flex justify-between items-center border-b-2 border-slate-800 pb-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-lg print:bg-emerald-500">
              <Zap className="text-white w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">FlashCred <span className="text-[#CD7F32]">Relatórios</span></h1>
              <p className="text-sm text-slate-500">Automação de Crédito</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-slate-900 text-lg">Relatório Geral de Operações</p>
            <p className="text-sm text-slate-500">Período: {formatDate(exportStartDate)} a {formatDate(exportEndDate)}</p>
            <p className="text-xs text-slate-400 mt-1">Gerado em: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">Resumo Executivo</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
              <p className="text-xs uppercase font-bold text-slate-500">Total Simulações</p>
              <p className="text-2xl font-bold text-slate-900">{reportSummary.total}</p>
            </div>
            <div className="p-4 border border-slate-200 rounded-lg bg-emerald-50 border-emerald-100">
              <p className="text-xs uppercase font-bold text-emerald-700">Aprovados</p>
              <p className="text-2xl font-bold text-emerald-700">{reportSummary.approved}</p>
            </div>
            <div className="p-4 border border-slate-200 rounded-lg bg-red-50 border-red-100">
              <p className="text-xs uppercase font-bold text-red-700">Reprovados</p>
              <p className="text-2xl font-bold text-red-700">{reportSummary.rejected}</p>
            </div>
            <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
              <p className="text-xs uppercase font-bold text-slate-500">Taxa de Aprovação</p>
              <p className="text-2xl font-bold text-slate-900">{reportSummary.approvalRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        {/* Full History Table */}
        <div className="mb-8 break-inside-avoid">
          <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">Histórico de Simulações</h2>
          <table className="w-full text-left text-sm border border-slate-200">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-3 py-2 border-b border-slate-200 font-semibold">Data</th>
                <th className="px-3 py-2 border-b border-slate-200 font-semibold">Cliente</th>
                <th className="px-3 py-2 border-b border-slate-200 font-semibold">Veículo</th>
                <th className="px-3 py-2 border-b border-slate-200 font-semibold">Banco</th>
                <th className="px-3 py-2 border-b border-slate-200 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {reportHistory.map(item => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="px-3 py-2">{formatDate(item.date)}</td>
                  <td className="px-3 py-2">{item.client}</td>
                  <td className="px-3 py-2">{item.vehicle}</td>
                  <td className="px-3 py-2">{item.bank}</td>
                  <td className="px-3 py-2 font-medium">
                    {item.status}
                  </td>
                </tr>
              ))}
              {reportHistory.length === 0 && (
                <tr><td colSpan={5} className="px-3 py-4 text-center text-slate-500">Nenhum registro neste período.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Opportunities Table */}
        <div className="break-inside-avoid">
          <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">Oportunidades em Aberto (Remarketing & Repescagem)</h2>
          <table className="w-full text-left text-sm border border-slate-200">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-3 py-2 border-b border-slate-200 font-semibold">Tipo</th>
                <th className="px-3 py-2 border-b border-slate-200 font-semibold">Cliente</th>
                <th className="px-3 py-2 border-b border-slate-200 font-semibold">Veículo</th>
                <th className="px-3 py-2 border-b border-slate-200 font-semibold">Contato</th>
                <th className="px-3 py-2 border-b border-slate-200 font-semibold">Obs</th>
              </tr>
            </thead>
            <tbody>
              {remarketingList.map(item => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="px-3 py-2"><span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-1 rounded">Remarketing</span></td>
                  <td className="px-3 py-2">{item.name}</td>
                  <td className="px-3 py-2">{item.car}</td>
                  <td className="px-3 py-2">{item.phone}</td>
                  <td className="px-3 py-2 text-xs text-slate-500">Aprovado: {item.deal}</td>
                </tr>
              ))}
              {retryList.map(item => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="px-3 py-2"><span className="text-xs font-bold text-amber-700 bg-amber-100 px-1 rounded">Repescagem</span></td>
                  <td className="px-3 py-2">{item.name}</td>
                  <td className="px-3 py-2">{item.car}</td>
                  <td className="px-3 py-2">{item.phone}</td>
                  <td className="px-3 py-2 text-xs text-slate-500">Recusa: {item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

// --- Clients Page ---
const Clients = () => {
  const { clients, setClients } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Form State
  const initialFormState = {
    name: '', cpf: '', email: '', phone: '', income: '', score: '0',
    address: { street: '', number: '', neighborhood: '', city: '', state: '', zipCode: '' },
    cnh: { hasCnh: false, categories: [] as string[] },
    desiredVehicle: { type: '' as 'NOVO' | 'SEMINOVO' | 'USADO' | '', brand: '', model: '', priceRange: '' }
  };
  const [formData, setFormData] = useState(initialFormState);

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.cpf.includes(searchTerm) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      cpf: client.cpf,
      email: client.email,
      phone: client.phone,
      income: client.income.toString(),
      score: client.score.toString(),
      address: { ...client.address },
      cnh: client.cnh || { hasCnh: false, categories: [] },
      desiredVehicle: client.desiredVehicle || { type: '', brand: '', model: '', priceRange: '' }
    });
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setEditingClient(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      // Update existing
      setClients(prev => prev.map(c => c.id === editingClient.id ? {
        ...c,
        ...formData,
        income: Number(formData.income),
        score: Number(formData.score)
      } as Client : c));
    } else {
      // Create new
      const newClient: Client = {
        id: Math.random().toString(36).substr(2, 9),
        status: 'ACTIVE',
        ...formData,
        income: Number(formData.income),
        score: Number(formData.score)
      } as Client;
      setClients(prev => [newClient, ...prev]);
    }
    setIsModalOpen(false);
  };

  const toggleCnhCategory = (cat: string) => {
    setFormData(prev => {
      const currentCats = prev.cnh.categories;
      const newCats = currentCats.includes(cat)
        ? currentCats.filter(c => c !== cat)
        : [...currentCats, cat];
      return { ...prev, cnh: { ...prev.cnh, categories: newCats } };
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">Gestão de Clientes</h1>
          <p className="text-slate-500 text-sm">Gerencie sua base de contatos e histórico de crédito.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nome, CPF ou email..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={handleNew}>Novo</Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">CPF / Contato</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Renda</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
                        {client.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{client.name}</p>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <MapPin size={10} />
                          {client.address.city}, {client.address.state}
                        </div>
                        {client.cnh?.hasCnh && (
                          <div className="flex gap-1 mt-1">
                            {client.cnh.categories.map(cat => (
                              <span key={cat} className="text-[10px] bg-slate-200 text-slate-600 px-1 rounded font-bold">{cat}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-700">{client.cpf}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Mail size={10} /> {client.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Phone size={10} /> {client.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-700">R$ {client.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={getScoreColor(client.score)}>
                      {client.score} pts
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={client.status === 'ACTIVE' ? 'brand' : 'neutral'}>
                      {client.status === 'ACTIVE' ? 'Ativo' : 'Arquivado'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(client)}
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Simular"
                      >
                        <PlayCircle size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Nenhum cliente encontrado com os filtros atuais.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal New/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingClient ? "Editar Cliente" : "Cadastrar Cliente"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nome Completo"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
              className="col-span-1 md:col-span-2"
            />
            <Input
              label="CPF"
              value={formData.cpf}
              onChange={e => setFormData({ ...formData, cpf: e.target.value })}
              required
              placeholder="000.000.000-00"
            />
            <Input
              label="Data de Nascimento"
              type="date"
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Telefone"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              required
              placeholder="(00) 00000-0000"
            />
            <Input
              label="Renda Mensal (R$)"
              type="number"
              value={formData.income}
              onChange={e => setFormData({ ...formData, income: e.target.value })}
              required
            />
            <Input
              label="Score Aproximado"
              type="number"
              value={formData.score}
              onChange={e => setFormData({ ...formData, score: e.target.value })}
              required
            />
          </div>

          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 mb-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.cnh.hasCnh}
                onChange={(e) => setFormData({ ...formData, cnh: { ...formData.cnh, hasCnh: e.target.checked } })}
                className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
              />
              <span className="text-sm font-semibold text-slate-700">Possui CNH?</span>
            </label>

            {formData.cnh.hasCnh && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {['A', 'B', 'C', 'D', 'E'].map(cat => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => toggleCnhCategory(cat)}
                    className={`w-10 h-10 rounded-lg font-bold transition-all border-2 ${formData.cnh.categories.includes(cat)
                      ? 'bg-emerald-500 text-white border-emerald-600'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-300'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 uppercase mb-3">Endereço</h4>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Rua"
                className="col-span-2"
                value={formData.address.street}
                onChange={e => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
              />
              <Input
                label="Número"
                value={formData.address.number}
                onChange={e => setFormData({ ...formData, address: { ...formData.address, number: e.target.value } })}
              />
              <Input
                label="Bairro"
                value={formData.address.neighborhood}
                onChange={e => setFormData({ ...formData, address: { ...formData.address, neighborhood: e.target.value } })}
              />
              <Input
                label="Cidade"
                value={formData.address.city}
                onChange={e => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
              />
              <Input
                label="CEP"
                value={formData.address.zipCode}
                onChange={e => setFormData({ ...formData, address: { ...formData.address, zipCode: e.target.value } })}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 uppercase mb-3 flex items-center gap-2">
              <Car className="w-4 h-4 text-emerald-600" /> Veículo Desejado
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Tipo</label>
                <select
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={formData.desiredVehicle.type}
                  onChange={e => setFormData({ ...formData, desiredVehicle: { ...formData.desiredVehicle, type: e.target.value as 'NOVO' | 'SEMINOVO' | 'USADO' | '' } })}
                >
                  <option value="">Selecione...</option>
                  <option value="NOVO">Novo (0km)</option>
                  <option value="SEMINOVO">Seminovo</option>
                  <option value="USADO">Usado</option>
                </select>
              </div>
              <Input
                label="Marca Preferida"
                placeholder="Ex: Honda, Toyota, VW..."
                value={formData.desiredVehicle.brand}
                onChange={e => setFormData({ ...formData, desiredVehicle: { ...formData.desiredVehicle, brand: e.target.value } })}
              />
              <Input
                label="Modelo Desejado"
                placeholder="Ex: Civic, Corolla, T-Cross..."
                value={formData.desiredVehicle.model}
                onChange={e => setFormData({ ...formData, desiredVehicle: { ...formData.desiredVehicle, model: e.target.value } })}
              />
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Faixa de Preço</label>
                <select
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={formData.desiredVehicle.priceRange}
                  onChange={e => setFormData({ ...formData, desiredVehicle: { ...formData.desiredVehicle, priceRange: e.target.value } })}
                >
                  <option value="">Selecione...</option>
                  <option value="Até R$ 40.000">Até R$ 40.000</option>
                  <option value="R$ 40.000 - R$ 70.000">R$ 40.000 - R$ 70.000</option>
                  <option value="R$ 70.000 - R$ 100.000">R$ 70.000 - R$ 100.000</option>
                  <option value="R$ 100.000 - R$ 150.000">R$ 100.000 - R$ 150.000</option>
                  <option value="Acima de R$ 150.000">Acima de R$ 150.000</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit">{editingClient ? 'Salvar Alterações' : 'Cadastrar Cliente'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// --- Vehicle Details Modal ---
const VehicleDetailsModal = ({
  isOpen,
  onClose,
  vehicle,
  onSimulate,
  onRegisterSale
}: {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  onSimulate: (v: Vehicle) => void;
  onRegisterSale: (v: Vehicle) => void;
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
          <div className="relative h-64 md:h-80 bg-slate-100 rounded-lg overflow-hidden group">
            <img
              src={vehicle.images[currentImageIndex]}
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
            <div className="absolute top-2 right-2">
              <Badge variant={vehicle.status === 'AVAILABLE' ? 'success' : vehicle.status === 'SOLD' ? 'neutral' : 'warning'}>
                {vehicle.status === 'AVAILABLE' ? 'Disponível' : vehicle.status === 'SOLD' ? 'Vendido' : 'Reservado'}
              </Badge>
            </div>
          </div>
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

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-blue-900">Simulação de Financiamento</h4>
                <p className="text-xs text-blue-700 mt-1">
                  Entrada sugerida de R$ {(vehicle.price * 0.3).toLocaleString('pt-BR')} (30%) +
                  48x de R$ {((vehicle.price * 0.7 * 1.5) / 48).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}.
                </p>
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

// --- Sale Registration Modal ---
const SaleRegistrationModal = ({
  isOpen,
  onClose,
  vehicle,
  clients,
  onConfirm
}: {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  clients: Client[];
  onConfirm: (saleData: any) => void;
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
            onChange={(e) => setSaleValue(e.target.value)}
            required
          />
          <Input
            label="Data da Venda"
            type="date"
            value={saleDate}
            onChange={(e) => setSaleDate(e.target.value)}
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

// --- Vehicles Page ---
const Vehicles = () => {
  const navigate = useNavigate();
  const { vehicles, setVehicles, clients } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'AVAILABLE' | 'SOLD' | 'RESERVED'>('ALL');

  // Modals State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [viewingVehicle, setViewingVehicle] = useState<Vehicle | null>(null);
  const [sellingVehicle, setSellingVehicle] = useState<Vehicle | null>(null);

  // Form Initial State
  const initialFormState = {
    brand: '', model: '', year: '', price: '', plate: '', mileage: '',
    images: [] as string[], status: 'AVAILABLE' as 'AVAILABLE' | 'SOLD' | 'RESERVED'
  };
  const [formData, setFormData] = useState(initialFormState);

  // Carousel State for each card
  const [currentImageIndices, setCurrentImageIndices] = useState<Record<string, number>>({});

  const toggleImage = (vehicleId: string, direction: 'prev' | 'next', total: number) => {
    setCurrentImageIndices(prev => {
      const current = prev[vehicleId] || 0;
      let nextIndex = direction === 'next' ? current + 1 : current - 1;
      if (nextIndex >= total) nextIndex = 0;
      if (nextIndex < 0) nextIndex = total - 1;
      return { ...prev, [vehicleId]: nextIndex };
    });
  };

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.plate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || v.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (e: React.MouseEvent, vehicle: Vehicle) => {
    e.stopPropagation();
    setEditingVehicle(vehicle);
    setFormData({
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year.toString(),
      price: vehicle.price.toString(),
      plate: vehicle.plate,
      mileage: vehicle.mileage.toString(),
      images: vehicle.images,
      status: vehicle.status
    });
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setEditingVehicle(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages: string[] = [];
      let processed = 0;

      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            newImages.push(reader.result);
          }
          processed++;
          if (processed === files.length) {
            setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
          }
        };
        reader.readAsDataURL(file as Blob);
      });
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const vehicleData = {
      ...formData,
      year: Number(formData.year),
      price: Number(formData.price),
      mileage: Number(formData.mileage),
      images: formData.images.length > 0 ? formData.images : [`https://picsum.photos/400/250?random=${Math.floor(Math.random() * 1000)}`]
    };

    if (editingVehicle) {
      setVehicles(prev => prev.map(v => v.id === editingVehicle.id ? { ...v, ...vehicleData } as Vehicle : v));
    } else {
      setVehicles(prev => [{ ...vehicleData, id: Math.random().toString(36).substr(2, 9) } as Vehicle, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja remover este veículo?')) {
      setVehicles(prev => prev.filter(v => v.id !== id));
    }
  };

  // --- New Handlers for Details & Actions ---
  const handleSimulate = (vehicle: Vehicle) => {
    navigate('/simulation', {
      state: { preSelectedVehicle: vehicle }
    });
  };

  const handleRegisterSale = (vehicle: Vehicle) => {
    setSellingVehicle(vehicle);
    setViewingVehicle(null);
  };

  const handleConfirmSale = (saleData: any) => {
    setVehicles(prev => prev.map(v => v.id === sellingVehicle?.id ? { ...v, status: 'SOLD' } as Vehicle : v));
    setSellingVehicle(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return <Badge variant="success">Disponível</Badge>;
      case 'RESERVED': return <Badge variant="warning">Reservado</Badge>;
      case 'SOLD': return <Badge variant="neutral">Vendido</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">Gestão de Veículos</h1>
          <p className="text-slate-500 text-sm">Controle total do seu estoque.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar marca, modelo ou placa..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={handleNew}>Novo Veículo</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 pb-2 overflow-x-auto">
        {(['ALL', 'AVAILABLE', 'RESERVED', 'SOLD'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${filterStatus === status
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'
              }`}
          >
            {status === 'ALL' && 'Todos'}
            {status === 'AVAILABLE' && 'Disponíveis'}
            {status === 'RESERVED' && 'Reservados'}
            {status === 'SOLD' && 'Vendidos'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVehicles.map((vehicle) => {
          const currentImgIndex = currentImageIndices[vehicle.id] || 0;
          const displayImage = vehicle.images[currentImgIndex];

          return (
            <Card
              key={vehicle.id}
              className="overflow-hidden group hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setViewingVehicle(vehicle)}
            >
              <div className="relative h-48 bg-slate-200 overflow-hidden">
                <img src={displayImage} alt={`${vehicle.brand} ${vehicle.model}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-2 right-2 z-10">
                  {getStatusBadge(vehicle.status)}
                </div>

                {/* Image Navigation Overlay */}
                {vehicle.images.length > 1 && (
                  <>
                    <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <button onClick={(e) => { e.stopPropagation(); toggleImage(vehicle.id, 'prev', vehicle.images.length) }} className="p-1 bg-black/50 text-white rounded-full hover:bg-black/70 pointer-events-auto"><ChevronLeft size={16} /></button>
                      <button onClick={(e) => { e.stopPropagation(); toggleImage(vehicle.id, 'next', vehicle.images.length) }} className="p-1 bg-black/50 text-white rounded-full hover:bg-black/70 pointer-events-auto"><ChevronRight size={16} /></button>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full z-10">
                      {currentImgIndex + 1}/{vehicle.images.length}
                    </div>
                  </>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-900 text-lg truncate">{vehicle.brand} {vehicle.model}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 mb-3">
                  <span className="bg-slate-100 px-2 py-0.5 rounded">{vehicle.year}</span>
                  <span>•</span>
                  <span>{vehicle.mileage.toLocaleString()} km</span>
                </div>

                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-xs text-slate-400">Preço à vista</p>
                    <p className="text-xl font-bold text-emerald-600">R$ {vehicle.price.toLocaleString('pt-BR')}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">
                    {vehicle.plate}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); handleEdit(e, vehicle); }} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"><Edit2 size={16} /></button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(vehicle.id); }} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredVehicles.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
          <Car className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">Nenhum veículo encontrado com os filtros selecionados.</p>
        </div>
      )}

      {/* Modal New/Edit Vehicle */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingVehicle ? "Editar Veículo" : "Adicionar Veículo"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Marca" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} required placeholder="Ex: Honda" />
            <Input label="Modelo" value={formData.model} onChange={e => setFormData({ ...formData, model: e.target.value })} required placeholder="Ex: Civic Touring" />

            <Input label="Ano" type="number" value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} required />
            <Input label="Placa" value={formData.plate} onChange={e => setFormData({ ...formData, plate: e.target.value })} required className="uppercase" />

            <Input label="Quilometragem" type="number" value={formData.mileage} onChange={e => setFormData({ ...formData, mileage: e.target.value })} required />
            <Input label="Preço (R$)" type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Fotos do Veículo</label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors relative cursor-pointer">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-center pointer-events-none">
                <div className="bg-emerald-100 p-3 rounded-full inline-flex mb-3">
                  <Upload className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="text-sm font-medium text-slate-900">Clique para enviar fotos</p>
                <p className="text-xs text-slate-500 mt-1">PNG, JPG (Multiplos arquivos permitidos)</p>
              </div>
            </div>

            {/* Thumbnail Grid */}
            {formData.images.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative aspect-video rounded-md overflow-hidden group border border-slate-200">
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Status</label>
            <select
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            >
              <option value="AVAILABLE">Disponível</option>
              <option value="RESERVED">Reservado</option>
              <option value="SOLD">Vendido</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit">{editingVehicle ? 'Salvar' : 'Adicionar'}</Button>
          </div>
        </form>
      </Modal>

      {/* Details Modal */}
      <VehicleDetailsModal
        isOpen={!!viewingVehicle}
        onClose={() => setViewingVehicle(null)}
        vehicle={viewingVehicle}
        onSimulate={handleSimulate}
        onRegisterSale={handleRegisterSale}
      />

      {/* Sale Registration Modal */}
      <SaleRegistrationModal
        isOpen={!!sellingVehicle}
        onClose={() => setSellingVehicle(null)}
        vehicle={sellingVehicle}
        clients={clients}
        onConfirm={handleConfirmSale}
      />
    </div>
  );
};

// --- New Simulation Page ---
const NewSimulation = () => {
  const { clients, vehicles, setVehicles, updateClientScore } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [simulationType, setSimulationType] = useState<'registered' | 'guest'>('registered');

  // Registered Client Selection
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [clientSearchTerm, setClientSearchTerm] = useState('');

  // Guest Client Form
  const [guestData, setGuestData] = useState({
    name: '',
    cpf: '',
    phone: '',
    hasCnh: false,
    categories: [] as string[],
    score: '500'
  });

  // Vehicle Selection
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [isVehicleDropdownOpen, setIsVehicleDropdownOpen] = useState(false);
  const [vehicleSearchTerm, setVehicleSearchTerm] = useState('');

  const [selectedBanks, setSelectedBanks] = useState<string[]>(BANKS.map(b => b.id));
  const [simulationResults, setSimulationResults] = useState<SimulationOffer[]>([]);
  const [aiSummary, setAiSummary] = useState('');

  // Sale Success State
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [finalizedOffer, setFinalizedOffer] = useState<SimulationOffer | null>(null);

  // Handle Pre-selection from Retry/Remarketing
  useEffect(() => {
    if (location.state) {
      const { preSelectedClient, preSelectedVehicleModel } = location.state;

      // 1. Try to match Client
      if (preSelectedClient) {
        const foundClient = clients.find(c =>
          c.name.toLowerCase() === preSelectedClient.name.toLowerCase() ||
          c.cpf === preSelectedClient.cpf
        );

        if (foundClient) {
          setSimulationType('registered');
          setSelectedClient(foundClient.id);
        } else {
          // If not found in DB, use Guest Mode and pre-fill data
          setSimulationType('guest');
          setGuestData({
            name: preSelectedClient.name || '',
            cpf: preSelectedClient.cpf || '',
            phone: preSelectedClient.phone || '',
            score: preSelectedClient.score ? preSelectedClient.score.toString() : '500',
            hasCnh: false,
            categories: []
          });
        }
      }

      // 2. Try to match Vehicle
      if (preSelectedVehicleModel) {
        // Fuzzy match: check if model string contains the state string or vice versa
        const foundVehicle = vehicles.find(v => {
          const fullVehicleName = `${v.brand} ${v.model}`.toLowerCase();
          const target = preSelectedVehicleModel.toLowerCase();
          return fullVehicleName.includes(target) || target.includes(v.model.toLowerCase());
        });

        if (foundVehicle) {
          setSelectedVehicle(foundVehicle.id);
        }
      }
    }
  }, [location.state, clients, vehicles]);

  // Resolved Client Object (Either from DB or Temporary Guest)
  const getClientForSimulation = (): Client | undefined => {
    if (simulationType === 'registered') {
      return clients.find(c => c.id === selectedClient);
    } else {
      // Create temporary guest client object
      if (!guestData.name || !guestData.cpf) return undefined;
      return {
        id: `guest-${Date.now()}`,
        name: guestData.name,
        cpf: guestData.cpf,
        income: 5000, // Default income since field was removed for simplicity
        score: Number(guestData.score),
        status: 'ACTIVE',
        email: 'nao_cadastrado@simulacao.com',
        phone: guestData.phone,
        address: { street: '', number: '', neighborhood: '', city: '', state: '', zipCode: '' },
        cnh: { hasCnh: guestData.hasCnh, categories: guestData.categories }
      };
    }
  };

  const client = getClientForSimulation();
  const vehicle = vehicles.find(v => v.id === selectedVehicle);

  const filteredClientsForDropdown = clients.filter(c =>
    c.name.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
    c.cpf.includes(clientSearchTerm)
  );

  const filteredVehiclesForDropdown = vehicles.filter(v =>
    v.brand.toLowerCase().includes(vehicleSearchTerm.toLowerCase()) ||
    v.model.toLowerCase().includes(vehicleSearchTerm.toLowerCase()) ||
    v.plate.toLowerCase().includes(vehicleSearchTerm.toLowerCase())
  );

  const toggleBank = (id: string) => {
    if (selectedBanks.includes(id)) {
      setSelectedBanks(selectedBanks.filter(b => b !== id));
    } else {
      setSelectedBanks([...selectedBanks, id]);
    }
  };

  const toggleGuestCnhCategory = (cat: string) => {
    setGuestData(prev => {
      const currentCats = prev.categories;
      const newCats = currentCats.includes(cat)
        ? currentCats.filter(c => c !== cat)
        : [...currentCats, cat];
      return { ...prev, categories: newCats };
    });
  };

  const startSimulation = async () => {
    if (!client || !vehicle) return;

    setStep(3); // Loading state

    // Mock API Delay
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Generate Mock Results
    const results: SimulationOffer[] = selectedBanks.map(bankId => {
      const bank = BANKS.find(b => b.id === bankId)!;
      // Random logic: Higher score > higher chance of approval
      // Base chance 20% + score influence
      const isApproved = Math.random() < (client.score / 1000) + 0.2;

      if (!isApproved) {
        return {
          bankId,
          status: 'REJECTED',
          reason: 'Política interna de crédito',
          interestRate: 0,
          maxInstallments: 0,
          downPayment: 0,
          installments: []
        };
      }

      const rate = 1.5 + Math.random() * 2.5; // 1.5% to 4.0%
      const downPayment = vehicle.price * 0.2; // 20% down
      const financedAmount = vehicle.price - downPayment;

      // Calculate installments (PMT formula simplified)
      const calculatePMT = (months: number) => {
        const i = rate / 100;
        return (financedAmount * i * Math.pow(1 + i, months)) / (Math.pow(1 + i, months) - 1);
      };

      return {
        bankId,
        status: 'APPROVED',
        interestRate: Number(rate.toFixed(2)),
        maxInstallments: 60,
        downPayment,
        installments: [
          { months: 24, value: calculatePMT(24) },
          { months: 36, value: calculatePMT(36) },
          { months: 48, value: calculatePMT(48) },
          { months: 60, value: calculatePMT(60) },
        ]
      };
    });

    setSimulationResults(results);

    // Update Client Score only if registered
    if (simulationType === 'registered') {
      const approvedCount = results.filter(r => r.status === 'APPROVED').length;
      const totalSimulated = results.length;
      if (totalSimulated > 0) {
        const newScore = Math.round((approvedCount / totalSimulated) * 1000);
        updateClientScore(client.id, newScore);
      }
    }

    // Call AI Service
    const summary = await generateCreditAnalysis(client, vehicle, results);
    setAiSummary(summary);

    setStep(4); // Show Results
  };

  const handleFinalizeSale = (offer: SimulationOffer) => {
    if (!vehicle) return;

    setFinalizedOffer(offer);

    // 1. Mark vehicle as SOLD in global state
    setVehicles(prev => prev.map(v =>
      v.id === vehicle.id ? { ...v, status: 'SOLD' } : v
    ));

    // 2. Show Success Modal
    setShowSuccessModal(true);
  };

  const getBestOffer = () => {
    const approved = simulationResults.filter(r => r.status === 'APPROVED');
    if (approved.length === 0) return null;
    return approved.reduce((prev, curr) => prev.interestRate < curr.interestRate ? prev : curr);
  };

  const bestOffer = getBestOffer();

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">Nova Simulação Multibanco</h1>
        <p className="text-slate-500 text-sm">Encontre a melhor taxa para o seu cliente em segundos.</p>
      </div>

      {/* Progress Steps */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-center justify-between px-4 md:px-10 py-4 bg-white rounded-xl border border-slate-100 mb-4 md:mb-8 min-w-[500px]">
          {[
            { id: 1, label: 'Dados' },
            { id: 2, label: 'Bancos' },
            { id: 3, label: 'Análise' },
            { id: 4, label: 'Ofertas' }
          ].map((s, idx) => (
            <div key={s.id} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= s.id ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                {s.id}
              </div>
              <span className={`ml-2 text-sm font-medium ${step >= s.id ? 'text-slate-900' : 'text-slate-400'}`}>{s.label}</span>
              {idx < 3 && <div className="w-8 md:w-12 h-0.5 mx-2 md:mx-4 bg-slate-100"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Selection */}
      {step === 1 && (
        <Card className="p-4 md:p-8 max-w-4xl mx-auto">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Selecione Cliente e Veículo</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            <div className="space-y-2">
              <div className="flex justify-between items-center h-8 mb-1">
                <label className="block text-sm font-semibold text-slate-700">Cliente</label>
                <div className="flex p-1 bg-slate-100 rounded-lg">
                  <button
                    className={`text-[10px] px-2 py-1 rounded font-bold transition-all ${simulationType === 'registered' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
                    onClick={() => setSimulationType('registered')}
                  >
                    Cadastrado
                  </button>
                  <button
                    className={`text-[10px] px-2 py-1 rounded font-bold transition-all ${simulationType === 'guest' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500'}`}
                    onClick={() => setSimulationType('guest')}
                  >
                    Rápido
                  </button>
                </div>
              </div>

              {simulationType === 'registered' ? (
                <div className="space-y-2 relative">

                  {/* Custom Dropdown Trigger */}
                  <div
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center cursor-pointer hover:border-emerald-400 transition-colors h-[46px]"
                    onClick={() => {
                      setIsClientDropdownOpen(!isClientDropdownOpen);
                      if (!isClientDropdownOpen) setClientSearchTerm('');
                    }}
                  >
                    <span className={`text-sm truncate mr-2 ${selectedClient ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
                      {selectedClient
                        ? clients.find(c => c.id === selectedClient)?.name
                        : "Selecione um cliente..."}
                    </span>
                    <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />
                  </div>

                  {/* Dropdown Menu */}
                  {isClientDropdownOpen && (
                    <div className="absolute z-20 top-full left-0 w-full bg-white border border-slate-200 rounded-lg shadow-xl mt-1 overflow-hidden animate-fade-in">
                      <div className="p-2 border-b border-slate-100 bg-slate-50">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                          <input
                            autoFocus
                            className="w-full pl-8 pr-3 py-1.5 text-sm bg-white border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="Buscar por Nome ou CPF..."
                            value={clientSearchTerm}
                            onChange={(e) => setClientSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {filteredClientsForDropdown.map(c => (
                          <div
                            key={c.id}
                            className={`p-3 hover:bg-emerald-50 cursor-pointer border-b border-slate-50 last:border-0 flex items-center justify-between group ${selectedClient === c.id ? 'bg-emerald-50' : ''}`}
                            onClick={() => {
                              setSelectedClient(c.id);
                              setIsClientDropdownOpen(false);
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                                {c.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-slate-800">{c.name}</p>
                                <p className="text-xs text-slate-500">CPF: {c.cpf}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant={getScoreColor(c.score)}>{c.score}</Badge>
                            </div>
                          </div>
                        ))}
                        {filteredClientsForDropdown.length === 0 && (
                          <div className="p-4 text-center text-sm text-slate-500">
                            Nenhum cliente encontrado.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Overlay to close dropdown when clicking outside */}
                  {isClientDropdownOpen && (
                    <div className="fixed inset-0 z-10" onClick={() => setIsClientDropdownOpen(false)}></div>
                  )}

                  {client && (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 mt-2">
                      <p className="text-sm font-bold text-slate-900">{client.name}</p>
                      <p className="text-xs text-slate-500">Score: <span className={client.score > 700 ? 'text-emerald-600' : 'text-amber-600'}>{client.score}</span> • Renda: R$ {client.income.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <Input
                      placeholder="Nome Completo"
                      value={guestData.name}
                      onChange={e => setGuestData({ ...guestData, name: e.target.value })}
                    />
                    <Input
                      placeholder="CPF"
                      value={guestData.cpf}
                      onChange={e => setGuestData({ ...guestData, cpf: e.target.value })}
                    />
                    <Input
                      placeholder="Telefone"
                      value={guestData.phone}
                      onChange={e => setGuestData({ ...guestData, phone: e.target.value })}
                    />

                    <div className="flex items-center gap-3 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={guestData.hasCnh}
                          onChange={(e) => setGuestData({ ...guestData, hasCnh: e.target.checked })}
                          className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                        />
                        <span className="text-xs font-semibold text-slate-700">Possui CNH?</span>
                      </label>
                      {guestData.hasCnh && (
                        <div className="flex gap-1 flex-wrap">
                          {['A', 'B', 'C', 'D', 'E'].map(cat => (
                            <button
                              type="button"
                              key={cat}
                              onClick={() => toggleGuestCnhCategory(cat)}
                              className={`w-8 h-8 rounded text-xs font-bold transition-all border ${guestData.categories.includes(cat)
                                ? 'bg-emerald-500 text-white border-emerald-600'
                                : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-300'
                                }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2 relative">
              <div className="flex justify-between items-center h-8 mb-1">
                <label className="block text-sm font-semibold text-slate-700">Veículo</label>
              </div>

              {/* Custom Vehicle Dropdown Trigger */}
              <div
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center cursor-pointer hover:border-emerald-400 transition-colors h-[46px]"
                onClick={() => {
                  setIsVehicleDropdownOpen(!isVehicleDropdownOpen);
                  if (!isVehicleDropdownOpen) setVehicleSearchTerm('');
                }}
              >
                <span className={`text-sm truncate mr-2 ${selectedVehicle ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
                  {selectedVehicle
                    ? vehicles.find(v => v.id === selectedVehicle)?.model
                    : "Selecione um veículo..."}
                </span>
                <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />
              </div>

              {/* Vehicle Dropdown Menu */}
              {isVehicleDropdownOpen && (
                <div className="absolute z-20 top-full left-0 w-full bg-white border border-slate-200 rounded-lg shadow-xl mt-1 overflow-hidden animate-fade-in">
                  <div className="p-2 border-b border-slate-100 bg-slate-50">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                      <input
                        autoFocus
                        className="w-full pl-8 pr-3 py-1.5 text-sm bg-white border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Buscar por Modelo, Marca ou Placa..."
                        value={vehicleSearchTerm}
                        onChange={(e) => setVehicleSearchTerm(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {filteredVehiclesForDropdown.map(v => (
                      <div
                        key={v.id}
                        className={`p-3 hover:bg-emerald-50 cursor-pointer border-b border-slate-50 last:border-0 flex items-center justify-between group ${selectedVehicle === v.id ? 'bg-emerald-50' : ''}`}
                        onClick={() => {
                          setSelectedVehicle(v.id);
                          setIsVehicleDropdownOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-12 bg-slate-100 rounded overflow-hidden flex-shrink-0">
                            <img src={v.images[0]} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{v.brand} {v.model}</p>
                            <p className="text-xs text-slate-500">{v.year} • {v.mileage.toLocaleString()} km • {v.plate}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-emerald-600">R$ {v.price.toLocaleString('pt-BR')}</p>
                          {v.status === 'AVAILABLE' ?
                            <span className="text-[10px] text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">Disponível</span> :
                            <span className="text-[10px] text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">{v.status === 'RESERVED' ? 'Reservado' : 'Vendido'}</span>
                          }
                        </div>
                      </div>
                    ))}
                    {filteredVehiclesForDropdown.length === 0 && (
                      <div className="p-4 text-center text-sm text-slate-500">
                        Nenhum veículo encontrado.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Overlay to close dropdown when clicking outside */}
              {isVehicleDropdownOpen && (
                <div className="fixed inset-0 z-10" onClick={() => setIsVehicleDropdownOpen(false)}></div>
              )}

              {vehicle && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 mt-2 flex gap-3">
                  <img src={vehicle.images[0]} className="w-16 h-12 object-cover rounded" alt="" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">{vehicle.brand} {vehicle.model}</p>
                    <p className="text-xs text-slate-500">{vehicle.year} • {vehicle.mileage.toLocaleString()} km • {vehicle.plate}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <Button
              disabled={!client || !selectedVehicle}
              onClick={() => setStep(2)}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Continuar
            </Button>
          </div>
        </Card>
      )}

      {/* Step 2: Banks */}
      {step === 2 && (
        <Card className="p-4 md:p-8 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900">Selecione os Bancos para Simular</h2>
            <button
              className="text-sm text-emerald-600 font-medium hover:underline"
              onClick={() => setSelectedBanks(selectedBanks.length === BANKS.length ? [] : BANKS.map(b => b.id))}
            >
              {selectedBanks.length === BANKS.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {BANKS.map(bank => {
              const isSelected = selectedBanks.includes(bank.id);
              return (
                <div
                  key={bank.id}
                  onClick={() => toggleBank(bank.id)}
                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 relative ${isSelected ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-100 hover:border-slate-200'}`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${bank.color}`}>
                    {bank.logoInitial}
                  </div>
                  <span className="font-medium text-slate-900 text-sm text-center">{bank.name}</span>
                  <div className="absolute top-3 right-3">
                    {isSelected ? <CheckSquare className="text-emerald-500 w-5 h-5" /> : <Square className="text-slate-300 w-5 h-5" />}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-8 flex justify-between">
            <Button variant="ghost" onClick={() => setStep(1)}>Voltar</Button>
            <Button
              disabled={selectedBanks.length === 0}
              onClick={startSimulation}
              icon={<PlayCircle className="w-4 h-4" />}
            >
              Iniciar Simulação
            </Button>
          </div>
        </Card>
      )}

      {/* Step 3: Simulation Loader */}
      {step === 3 && (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-slate-100 border-t-emerald-500 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap className="text-emerald-500 w-8 h-8 animate-pulse" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-6">Analisando Perfil de Crédito...</h2>
          <p className="text-slate-500 mt-2 max-w-md">
            Conectando com as instituições financeiras e buscando as melhores taxas para {client?.name}.
          </p>
          <div className="mt-8 flex gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Itaú</span>
            <span className="flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Santander</span>
            <span className="flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> BV</span>
          </div>
        </div>
      )}

      {/* Step 4: Results */}
      {step === 4 && (
        <div className="space-y-8 animate-fade-in">
          {/* AI Summary */}
          <div className="bg-gradient-to-r from-emerald-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3 text-emerald-400 font-bold uppercase text-xs tracking-wider">
                <Zap size={14} /> FlashCred AI Analysis
              </div>
              <h3 className="text-xl font-bold mb-2">Resumo da Análise</h3>
              <p className="text-slate-200 leading-relaxed max-w-4xl">
                {aiSummary || "Analisando resultados..."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Client & Vehicle Info */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-bold text-slate-900 mb-4">Detalhes da Simulação</h3>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500 text-sm">Cliente</span>
                    <div className="text-right">
                      <span className="font-medium text-slate-900 text-sm block">{client?.name}</span>
                      {simulationType === 'guest' && <span className="text-xs text-amber-600">(Não cadastrado)</span>}
                    </div>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500 text-sm">Score</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={getScoreColor(client!.score)}>{client?.score}</Badge>
                      {/* Show update indicator if score changed */}
                      {simulationType === 'registered' && <span className="text-xs text-emerald-600 flex items-center"><TrendingUp size={12} /> Atualizado</span>}
                    </div>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500 text-sm">Veículo</span>
                    <span className="font-medium text-slate-900 text-sm">{vehicle?.brand} {vehicle?.model}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500 text-sm">Valor</span>
                    <span className="font-medium text-slate-900 text-sm">R$ {vehicle?.price.toLocaleString()}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-6" onClick={() => setStep(1)}>Nova Simulação</Button>
              </Card>
            </div>

            {/* Right Column: Offers */}
            <div className="lg:col-span-2 space-y-4">
              {simulationResults.sort((a, b) => {
                // Sort: Approved first, then by interest rate
                if (a.status === 'APPROVED' && b.status !== 'APPROVED') return -1;
                if (a.status !== 'APPROVED' && b.status === 'APPROVED') return 1;
                return a.interestRate - b.interestRate;
              }).map((offer) => {
                const bank = BANKS.find(b => b.id === offer.bankId)!;
                const isBest = bestOffer?.bankId === offer.bankId;

                return (
                  <Card key={offer.bankId} className={`relative overflow-hidden transition-all ${offer.status === 'APPROVED' ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-red-500 opacity-80'}`}>
                    {isBest && (
                      <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                        Melhor Oferta
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${bank.color}`}>
                            {bank.logoInitial}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900">{bank.name}</h4>
                            <p className="text-xs text-slate-500">
                              {offer.status === 'APPROVED' ? 'Crédito Pré-Aprovado' : 'Proposta Recusada'}
                            </p>
                          </div>
                        </div>
                        <Badge variant={offer.status === 'APPROVED' ? 'success' : 'danger'}>
                          {offer.status === 'APPROVED' ? 'Aprovado' : 'Reprovado'}
                        </Badge>
                      </div>

                      {offer.status === 'APPROVED' ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div className="p-3 bg-slate-50 rounded-lg text-center">
                            <p className="text-xs text-slate-500 uppercase">Taxa Mensal</p>
                            <p className="text-lg font-bold text-emerald-600">{offer.interestRate}%</p>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-lg text-center">
                            <p className="text-xs text-slate-500 uppercase">Entrada (20%)</p>
                            <p className="text-lg font-bold text-slate-900">R$ {offer.downPayment.toLocaleString()}</p>
                          </div>
                          <div className="col-span-2 p-3 bg-emerald-50/50 border border-emerald-100 rounded-lg flex items-center justify-between px-4">
                            <div>
                              <p className="text-xs text-emerald-700 font-bold uppercase">Sugestão (48x)</p>
                              <p className="text-xl font-bold text-emerald-700">R$ {offer.installments.find(i => i.months === 48)?.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                            </div>
                            <Button
                              size="sm"
                              variant="primary"
                              icon={<CheckCircle2 size={16} />}
                              onClick={() => handleFinalizeSale(offer)}
                            >
                              Fechar Negócio
                            </Button>
                          </div>

                          {/* Installment Table */}
                          <div className="col-span-2 md:col-span-4 mt-2">
                            <details className="text-sm text-slate-500 cursor-pointer">
                              <summary className="hover:text-emerald-600 transition-colors font-medium mb-2">Ver todas as parcelas</summary>
                              <div className="grid grid-cols-4 gap-2 mt-2">
                                {offer.installments.map(inst => (
                                  <div key={inst.months} className="bg-white border border-slate-200 p-2 rounded text-center">
                                    <p className="text-xs text-slate-400">{inst.months}x</p>
                                    <p className="font-bold text-slate-800">R$ {inst.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                                  </div>
                                ))}
                              </div>
                            </details>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-red-50 p-3 rounded-lg text-red-700 text-sm flex items-center gap-2">
                          <AlertCircle size={16} />
                          Motivo: {offer.reason}
                        </div>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS SALE MODAL */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => { }} // Disallow close by clicking bg
        title=""
      >
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <PartyPopper className="text-emerald-600 w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Venda Confirmada!</h2>
          <p className="text-slate-500 mb-8 max-w-sm">
            Parabéns! O veículo <strong>{vehicle?.brand} {vehicle?.model}</strong> foi marcado como vendido e o financiamento iniciado.
          </p>

          {finalizedOffer && (
            <div className="w-full bg-slate-50 rounded-lg p-4 mb-8 border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-500">Banco</span>
                <span className="font-bold text-slate-900">{BANKS.find(b => b.id === finalizedOffer.bankId)?.name}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-500">Taxa</span>
                <span className="font-bold text-emerald-600">{finalizedOffer.interestRate}% a.m.</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Valor Financiado</span>
                <span className="font-bold text-slate-900">R$ {(vehicle!.price - finalizedOffer.downPayment).toLocaleString()}</span>
              </div>
            </div>
          )}

          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/vehicles');
              }}
            >
              Ver Estoque
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/');
              }}
            >
              Ir para Dashboard
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};


// --- Layout & Main App ---
const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Painel', path: '/' },
    { icon: <Calculator size={20} />, label: 'Simulação', path: '/simulation' },
    { icon: <Users size={20} />, label: 'Clientes', path: '/clients' },
    { icon: <Car size={20} />, label: 'Veículos', path: '/vehicles' },
    { icon: <PieChart size={20} />, label: 'Estatísticas', path: '/statistics' },
    { icon: <Lock size={20} />, label: 'Credenciais', path: '/credentials' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-col hidden md:flex shadow-2xl print:hidden">
        <div className="p-6 flex items-center gap-2">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <Zap className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Flash<span className="text-[#CD7F32]">Cred</span></h1>
            <p className="text-xs text-slate-400">Automação de Crédito</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${location.pathname === item.path
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-900/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-amber-500 flex items-center justify-center font-bold text-white shadow-lg">
              JS
            </div>
            <div>
              <p className="text-sm font-semibold">João Silva</p>
              <p className="text-xs text-slate-500">Vendedor Sênior</p>
            </div>
            <LogOut size={16} className="ml-auto text-slate-500 hover:text-white cursor-pointer" />
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Sidebar Drawer */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 p-2 rounded-lg">
              <Zap className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Flash<span className="text-[#CD7F32]">Cred</span></h1>
            </div>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${location.pathname === item.path
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-900/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-amber-500 flex items-center justify-center font-bold text-white">
              JS
            </div>
            <div>
              <p className="text-sm font-semibold">João Silva</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header & Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 p-1.5 rounded">
              <Zap className="text-white" size={20} />
            </div>
            <span className="font-bold text-slate-900">FlashCred</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-600">
            <Menu size={24} />
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/simulation" element={<NewSimulation />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/vehicles" element={<Vehicles />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/credentials" element={<Credentials />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [vehicles, setVehicles] = useState<Vehicle[]>(MOCK_VEHICLES);
  const [bankCredentials, setBankCredentials] = useState<BankCredential[]>(MOCK_CREDENTIALS);

  const updateClientScore = (clientId: string, newScore: number) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, score: newScore } : c));
  };

  const updateBankCredential = (updatedCred: BankCredential) => {
    setBankCredentials(prev => {
      const exists = prev.find(c => c.bankId === updatedCred.bankId);
      if (exists) {
        return prev.map(c => c.bankId === updatedCred.bankId ? updatedCred : c);
      }
      return [...prev, updatedCred];
    });
  };

  return (
    <AppContext.Provider value={{ clients, setClients, vehicles, setVehicles, bankCredentials, updateBankCredential, updateClientScore }}>
      {children}
    </AppContext.Provider>
  );
};

const App = () => {
  return (
    <Router>
      <AppProvider>
        <Layout />
      </AppProvider>
    </Router>
  );
};

export default App;
