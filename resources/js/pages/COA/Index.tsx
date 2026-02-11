import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { DataTable, Column } from '@/Components/DataTable';
import {
    Coins,
    Plus,
    Search,
    Edit,
    Trash2,
    BookOpen,
    Filter
} from 'lucide-react';
import { useTrans } from '@/hooks/useTrans';
import { GLAccountForm } from './Partials/GLAccountForm';

interface GLAccount {
    id: number;
    code: string;
    name: string;
    type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
}

interface Props {
    accounts: GLAccount[];
}

export default function Index({ accounts }: Props) {
    const { trans } = useTrans();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<GLAccount | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState<string>('all');

    const handleDelete = (id: number) => {
        if (confirm(trans('Are you sure you want to delete this account?'))) {
            router.delete(route('chart-of-accounts.destroy', id), {
                preserveScroll: true
            });
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'asset': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'liability': return 'bg-rose-50 text-rose-700 border-rose-100';
            case 'equity': return 'bg-purple-50 text-purple-700 border-purple-100';
            case 'revenue': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'expense': return 'bg-orange-50 text-orange-700 border-orange-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    const columns: Column<GLAccount>[] = [
        {
            header: trans("Account Code"),
            key: 'code',
            sortable: true,
            className: 'font-mono font-bold text-gray-900',
        },
        {
            header: trans("Name"),
            key: 'name',
            sortable: true,
            render: (account) => (
                <span className="font-medium text-gray-700">{account.name}</span>
            )
        },
        {
            header: trans("Type"),
            key: 'type',
            sortable: true,
            render: (account) => (
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getTypeColor(account.type)}`}>
                    {trans(account.type.charAt(0).toUpperCase() + account.type.slice(1))}
                </span>
            )
        },
        {
            header: "",
            align: 'right',
            className: 'w-0 whitespace-nowrap',
            render: (account) => (
                <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => { setEditingAccount(account); setIsFormOpen(true); }}
                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(account.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    const filteredAccounts = accounts.filter(acc => {
        const matchesSearch = acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            acc.code.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === 'all' || acc.type === typeFilter;
        return matchesSearch && matchesType;
    });

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight flex items-center gap-2">
                        <Coins className="w-6 h-6 text-indigo-600" />
                        {trans('Chart of Accounts')}
                    </h2>
                    <button
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm text-sm font-semibold"
                        onClick={() => { setEditingAccount(null); setIsFormOpen(true); }}
                    >
                        <Plus className="w-4 h-4" />
                        {trans('Add Account')}
                    </button>
                </div>
            }
        >
            <Head title={trans('Chart of Accounts')} />

            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="relative group flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder={trans("Search accounts...")}
                                    className="w-full pl-10 pr-4 py-2 bg-white border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all font-medium"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-gray-400" />
                                <select
                                    className="text-sm bg-white border-gray-200 rounded-lg focus:ring-indigo-100 focus:border-indigo-400 transition-all font-medium py-2 pr-10"
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                >
                                    <option value="all">{trans('All Categories')}</option>
                                    <option value="asset">{trans('Asset')}</option>
                                    <option value="liability">{trans('Liability')}</option>
                                    <option value="equity">{trans('Equity')}</option>
                                    <option value="revenue">{trans('Revenue')}</option>
                                    <option value="expense">{trans('Expense')}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <DataTable
                            data={filteredAccounts}
                            columns={columns}
                            initialSort={{ key: 'code', order: 'asc' }}
                            hideSearch={true}
                        />
                    </div>
                </div>
            </div>

            <GLAccountForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                account={editingAccount}
            />
        </AuthenticatedLayout>
    );
}
