import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { DataTable, Column } from '@/Components/DataTable';
import { Workflow, Plus, Search, Layers, Settings, ArrowRight, DollarSign } from 'lucide-react';
import { useTrans } from '@/hooks/useTrans';
import { ApprovalRuleForm } from './Partials/ApprovalRuleForm';

interface ApprovalStep {
    id: number;
    step_order: number;
    role_name: string;
}

interface ApprovalRule {
    id: number;
    doc_type: string;
    min_amount: string;
    max_amount: string;
    currency: string;
    priority: number;
    steps: ApprovalStep[];
}

interface Props {
    rules: ApprovalRule[];
    roles: { id: number; name: string; label: string }[];
}

export default function Index({ rules, roles }: Props) {
    const { trans } = useTrans();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedRule, setSelectedRule] = useState<ApprovalRule | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(Number(amount));
    };

    const handleEdit = (rule: ApprovalRule) => {
        setSelectedRule(rule);
        setIsFormOpen(true);
    };

    const columns: Column<ApprovalRule>[] = [
        {
            header: trans("Type"),
            key: 'doc_type',
            render: (r) => (
                <div className="flex flex-col">
                    <span className="font-bold text-gray-900">{r.doc_type}</span>
                    <span className="text-[10px] text-gray-400 font-mono italic">Priority: {r.priority}</span>
                </div>
            )
        },
        {
            header: trans("Amount Range"),
            key: 'min_amount',
            render: (r) => (
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <span className="text-gray-400">{formatCurrency(r.min_amount)}</span>
                    <ArrowRight className="w-3 h-3 text-gray-300" />
                    <span className="text-gray-900 font-bold">{formatCurrency(r.max_amount)}</span>
                </div>
            )
        },
        {
            header: trans("Workflow Steps"),
            key: 'steps',
            render: (r) => (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-[400px] scrollbar-hide">
                    {r.steps.map((s, i) => (
                        <div key={s.id} className="flex items-center gap-2 shrink-0">
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-100 rounded-full shadow-sm">
                                <span className="w-4 h-4 rounded-full bg-indigo-600 text-[10px] text-white flex items-center justify-center font-bold">
                                    {s.step_order}
                                </span>
                                <span className="text-[10px] font-bold text-gray-900 uppercase tracking-tight">
                                    {s.role_name}
                                </span>
                            </div>
                            {i < r.steps.length - 1 && (
                                <ArrowRight className="w-3 h-3 text-gray-200" />
                            )}
                        </div>
                    ))}
                </div>
            )
        },
        {
            header: trans("Actions"),
            key: 'id',
            align: 'right',
            render: (r) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => handleEdit(r)}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    >
                        <Settings className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    const filteredRules = rules.filter(r =>
        r.doc_type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-lg">
                            <Workflow className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="font-bold text-xl text-gray-900 leading-tight">
                                {trans('Approval Rules')}
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {trans('Configure dynamic routing paths for financial documents.')}
                            </p>
                        </div>
                    </div>
                    <button
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm text-sm font-semibold"
                        onClick={() => {
                            setSelectedRule(null);
                            setIsFormOpen(true);
                        }}
                    >
                        <Plus className="w-4 h-4" />
                        {trans('Create Rule')}
                    </button>
                </div>
            }
        >
            <Head title={trans('Approval Rules')} />

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{trans('Active Rules')}</span>
                            <Layers className="w-5 h-5 text-gray-200" />
                        </div>
                        <p className="text-2xl font-black text-gray-900 mt-2">{rules.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{trans('Auto-Approval Range')}</span>
                            <DollarSign className="w-5 h-5 text-gray-200" />
                        </div>
                        <p className="text-2xl font-black text-indigo-600 mt-2 font-mono">0 <span className="text-xs text-gray-400">IDR</span></p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-end">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                            <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">{trans('Engine Status')}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-500 mt-1">{trans('Routing active for PO & PR')}</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                        <div className="relative group max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                placeholder={trans("Search by document type...")}
                                className="w-full pl-10 pr-4 py-2 bg-white border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="p-6">
                        <DataTable
                            data={filteredRules}
                            columns={columns}
                            hideSearch={true}
                        />
                    </div>
                </div>
            </div>

            <ApprovalRuleForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                rule={selectedRule}
                roles={roles}
            />
        </AuthenticatedLayout>
    );
}
