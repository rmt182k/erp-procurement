import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { DataTable, Column } from '@/Components/DataTable';
import {
    PieChart,
    Plus,
    Calendar,
    ArrowRight,
    Search,
    Filter,
    ArrowUpRight,
    Lock,
    Clock
} from 'lucide-react';
import { useTrans } from '@/hooks/useTrans';
import { BudgetForm } from './Partials/BudgetForm';

interface Budget {
    id: number;
    cost_center_id: number;
    gl_account_id: number;
    fiscal_year: number;
    amount_allocated: string;
    amount_reserved: string;
    amount_used: string;
    cost_center: { name: string; code: string };
    gl_account: { name: string; code: string };
}

interface Props {
    budgets: Budget[];
    cost_centers: { id: number; name: string; code: string }[];
    gl_accounts: { id: number; name: string; code: string; type: string }[];
    fiscal_year: number;
}

export default function Index({ budgets, cost_centers, gl_accounts, fiscal_year }: Props) {
    const { trans } = useTrans();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const formatCurrency = (amount: string | number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(Number(amount));
    };

    const columns: Column<Budget>[] = [
        {
            header: trans("Cost Center"),
            key: 'cost_center_id',
            render: (b) => (
                <div className="flex flex-col">
                    <span className="font-bold text-gray-900">{b.cost_center.name}</span>
                    <span className="text-[10px] font-mono text-gray-500 uppercase">{b.cost_center.code}</span>
                </div>
            )
        },
        {
            header: trans("GL Account"),
            key: 'gl_account_id',
            render: (b) => (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-700">{b.gl_account.name}</span>
                    <span className="text-[10px] font-mono text-gray-500">{b.gl_account.code}</span>
                </div>
            )
        },
        {
            header: trans("Allocated"),
            key: 'amount_allocated',
            align: 'right',
            render: (b) => <span className="font-bold text-gray-900">{formatCurrency(b.amount_allocated)}</span>
        },
        {
            header: trans("Reserved"),
            key: 'amount_reserved',
            align: 'right',
            render: (b) => (
                <div className="flex items-center justify-end gap-1.5 text-amber-600 font-medium">
                    <Lock className="w-3 h-3" />
                    {formatCurrency(b.amount_reserved)}
                </div>
            )
        },
        {
            header: trans("Used"),
            key: 'amount_used',
            align: 'right',
            render: (b) => (
                <div className="flex items-center justify-end gap-1.5 text-emerald-600 font-medium">
                    <ArrowUpRight className="w-3 h-3" />
                    {formatCurrency(b.amount_used)}
                </div>
            )
        },
        {
            header: trans("Remaining"),
            key: 'id',
            align: 'right',
            render: (b) => {
                const remaining = Number(b.amount_allocated) - (Number(b.amount_reserved) + Number(b.amount_used));
                const percentage = (remaining / Number(b.amount_allocated)) * 100;

                return (
                    <div className="flex flex-col items-end gap-1.5">
                        <span className={`font-bold ${remaining < 0 ? 'text-rose-600' : 'text-indigo-600'}`}>
                            {formatCurrency(remaining)}
                        </span>
                        <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden border border-gray-50">
                            <div
                                className={`h-full transition-all duration-500 ${percentage > 50 ? 'bg-emerald-500' : percentage > 20 ? 'bg-amber-500' : 'bg-rose-500'
                                    }`}
                                style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
                            />
                        </div>
                    </div>
                );
            }
        }
    ];

    const filteredBudgets = budgets.filter(b =>
        b.cost_center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.gl_account.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalAllocated = budgets.reduce((sum, b) => sum + Number(b.amount_allocated), 0);
    const totalRemaining = budgets.reduce((sum, b) => sum + (Number(b.amount_allocated) - (Number(b.amount_reserved) + Number(b.amount_used))), 0);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-lg">
                            <PieChart className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="font-bold text-xl text-gray-900 leading-tight">
                                {trans('Annual Budgets')}
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {trans('Fiscal Year')} {fiscal_year}
                            </p>
                        </div>
                    </div>
                    <button
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm text-sm font-semibold"
                        onClick={() => setIsFormOpen(true)}
                    >
                        <Plus className="w-4 h-4" />
                        {trans('Allocate Budget')}
                    </button>
                </div>
            }
        >
            <Head title={trans('Budgets')} />

            <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{trans('Total Allocated')}</span>
                        <p className="text-2xl font-black text-gray-900 mt-2">{formatCurrency(totalAllocated)}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest text-indigo-600">{trans('Total Remaining')}</span>
                        <p className="text-2xl font-black text-indigo-600 mt-2">{formatCurrency(totalRemaining)}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{trans('Status')}</span>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="font-bold text-gray-900 text-sm">{trans('Active Monitoring')}</span>
                            </div>
                        </div>
                        <Clock className="w-8 h-8 text-gray-100" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="relative group flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder={trans("Search by department or account...")}
                                    className="w-full pl-10 pr-4 py-2 bg-white border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all font-medium"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{trans('Year')}</label>
                                <select
                                    className="text-sm bg-white border-gray-200 rounded-lg focus:ring-indigo-100 focus:border-indigo-400 transition-all font-medium py-2 pr-10"
                                    value={fiscal_year}
                                    onChange={(e) => router.get(route('budgets.index'), { fiscal_year: e.target.value })}
                                >
                                    {[2024, 2025, 2026, 2027].map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <DataTable
                            data={filteredBudgets}
                            columns={columns}
                            hideSearch={true}
                        />
                    </div>
                </div>
            </div>

            <BudgetForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                costCenters={cost_centers}
                glAccounts={gl_accounts}
                currentYear={fiscal_year}
            />
        </AuthenticatedLayout>
    );
}
