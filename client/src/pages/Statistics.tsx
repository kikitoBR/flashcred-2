
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    History, Search, ArrowUpDown, ArrowUp, ArrowDown, Zap, PhoneCall, RefreshCw,
    User, Phone, Mail, Car, PlayCircle, Printer, TrendingUp, FileText
} from 'lucide-react';
import {
    ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip,
    BarChart, Bar, Legend
} from 'recharts';
import { Button, Card, Badge, Input, Modal } from '../../components/ui';

export const Statistics = () => {
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
        <div className="pb-20 p-6">
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
                                        formatter={(value: any) => [`R$ ${value.toLocaleString()}`, 'Faturado']}
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
                                onChange={(e: any) => setExportStartDate(e.target.value)}
                            />
                            <Input
                                label="Data Fim"
                                type="date"
                                value={exportEndDate}
                                onChange={(e: any) => setExportEndDate(e.target.value)}
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
        </div>
    );
};
