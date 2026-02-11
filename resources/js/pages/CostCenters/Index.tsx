import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { DataTable, Column } from '@/Components/DataTable';
import {
    Network,
    Plus,
    Search,
    Edit,
    Trash2,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import { useTrans } from '@/hooks/useTrans';
import { CostCenterForm } from './Partials/CostCenterForm';

interface CostCenter {
    id: number;
    code: string;
    name: string;
    description: string | null;
    is_active: boolean;
}

interface Props {
    cost_centers: CostCenter[];
}

export default function Index({ cost_centers }: Props) {
    const { trans } = useTrans();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCC, setEditingCC] = useState<CostCenter | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleDelete = (id: number) => {
        if (confirm(trans('Are you sure you want to delete this cost center?'))) {
            router.delete(route('cost-centers.destroy', id));
        }
    };

    const columns: Column<CostCenter>[] = [
        {
            header: trans("Code"),
            key: 'code',
            sortable: true,
            className: 'font-mono font-bold text-gray-900',
        },
        {
            header: trans("Department Name"),
            key: 'name',
            sortable: true,
            render: (cc) => (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{cc.name}</span>
                    {cc.description && <span className="text-xs text-gray-500 line-clamp-1">{cc.description}</span>}
                </div>
            )
        },
        {
            header: trans("Status"),
            key: 'is_active',
            sortable: true,
            render: (cc) => (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${cc.is_active
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : 'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                    {cc.is_active ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {cc.is_active ? trans('Active') : trans('Inactive')}
                </span>
            )
        },
        {
            header: "",
            align: 'right',
            className: 'w-0 whitespace-nowrap',
            render: (cc) => (
                <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => { setEditingCC(cc); setIsFormOpen(true); }}
                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(cc.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    const filteredCC = cost_centers.filter(cc =>
        cc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cc.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight flex items-center gap-2">
                        <Network className="w-6 h-6 text-indigo-600" />
                        {trans('Cost Centers')}
                    </h2>
                    <button
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm text-sm font-semibold"
                        onClick={() => { setEditingCC(null); setIsFormOpen(true); }}
                    >
                        <Plus className="w-4 h-4" />
                        {trans('Add Cost Center')}
                    </button>
                </div>
            }
        >
            <Head title={trans('Cost Centers')} />

            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                        <div className="relative group max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                placeholder={trans("Search code or name...")}
                                className="w-full pl-10 pr-4 py-2 bg-white border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="p-6">
                        <DataTable
                            data={filteredCC}
                            columns={columns}
                            initialSort={{ key: 'code', order: 'asc' }}
                            hideSearch={true}
                        />
                    </div>
                </div>
            </div>

            <CostCenterForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                costCenter={editingCC}
            />
        </AuthenticatedLayout>
    );
}
