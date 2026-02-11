import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useTrans } from '@/hooks/useTrans';
import { PieChart, Plus, Trash2, AlertCircle, Coins } from 'lucide-react';

interface GLAccount {
    id: number;
    name: string;
    code: string;
    type: string;
}

interface CostCenter {
    id: number;
    name: string;
    code: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    costCenters: CostCenter[];
    glAccounts: GLAccount[];
    currentYear: number;
}

interface AllocationRow {
    gl_account_id: string | number;
    amount: string;
    formattedAmount: string;
}

export function BudgetForm({ isOpen, onClose, costCenters, glAccounts, currentYear }: Props) {
    const { trans } = useTrans();
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        cost_center_id: '',
        fiscal_year: currentYear,
        allocations: [{ gl_account_id: '', amount: '0' }] as { gl_account_id: string | number; amount: string }[],
    });

    const [rows, setRows] = useState<AllocationRow[]>([
        { gl_account_id: '', amount: '0', formattedAmount: '0' }
    ]);

    useEffect(() => {
        if (isOpen) {
            setRows([{ gl_account_id: '', amount: '0', formattedAmount: '0' }]);
            reset();
            clearErrors();
        }
    }, [isOpen]);

    const formatNumber = (value: string) => {
        const cleanValue = value.replace(/\D/g, '');
        if (!cleanValue) return { raw: '0', formatted: '0' };
        return {
            raw: cleanValue,
            formatted: new Intl.NumberFormat('id-ID').format(Number(cleanValue))
        };
    };

    const handleRowChange = (index: number, field: keyof AllocationRow, value: string) => {
        const newRows = [...rows];
        if (field === 'formattedAmount') {
            const { raw, formatted } = formatNumber(value);
            newRows[index].amount = raw;
            newRows[index].formattedAmount = formatted;
        } else if (field === 'gl_account_id') {
            newRows[index].gl_account_id = value;
        }
        setRows(newRows);

        // Sync with useForm
        setData('allocations', newRows.map(r => ({ gl_account_id: r.gl_account_id, amount: r.amount })));
    };

    const addRow = () => {
        setRows([...rows, { gl_account_id: '', amount: '0', formattedAmount: '0' }]);
    };

    const removeRow = (index: number) => {
        if (rows.length === 1) return;
        const newRows = rows.filter((_, i) => i !== index);
        setRows(newRows);
        setData('allocations', newRows.map(r => ({ gl_account_id: r.gl_account_id, amount: r.amount })));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('budgets.store'), {
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    const totalBudget = rows.reduce((sum, r) => sum + Number(r.amount), 0);

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="2xl">
            <form onSubmit={submit} className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <PieChart className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">
                            {trans('Allocate Budget')}
                        </h2>
                        <p className="text-xs text-gray-500">
                            {trans('Set financial limits for specific departments and accounts.')}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div>
                        <InputLabel htmlFor="cost_center_id" value={trans('Cost Center')} />
                        <select
                            id="cost_center_id"
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-100 rounded-md shadow-sm text-sm font-medium"
                            value={data.cost_center_id}
                            onChange={(e) => setData('cost_center_id', e.target.value)}
                            required
                        >
                            <option value="">{trans('Select Department')}</option>
                            {costCenters.map(cc => (
                                <option key={cc.id} value={cc.id}>{cc.code} - {cc.name}</option>
                            ))}
                        </select>
                        <InputError message={errors.cost_center_id} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="fiscal_year" value={trans('Fiscal Year')} />
                        <select
                            id="fiscal_year"
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-100 rounded-md shadow-sm text-sm font-medium"
                            value={data.fiscal_year}
                            onChange={(e) => setData('fiscal_year', parseInt(e.target.value))}
                            required
                        >
                            {[2024, 2025, 2026, 2027].map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                        <InputError message={errors.fiscal_year} className="mt-2" />
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Coins className="w-3 h-3" />
                            {trans('Budget Lines')}
                        </h3>
                        <button
                            type="button"
                            onClick={addRow}
                            className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 uppercase tracking-tight"
                        >
                            <Plus className="w-3 h-3" />
                            {trans('Add Account')}
                        </button>
                    </div>

                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {rows.map((row, index) => (
                            <div key={index} className="flex gap-3 group animate-in slide-in-from-right-2 duration-200">
                                <div className="flex-1">
                                    <select
                                        className="w-full border-gray-200 focus:border-indigo-400 focus:ring-indigo-100 rounded-lg text-sm transition-all"
                                        value={row.gl_account_id}
                                        onChange={(e) => handleRowChange(index, 'gl_account_id', e.target.value)}
                                        required
                                    >
                                        <option value="">{trans('Select Account')}</option>
                                        {glAccounts.map(acc => (
                                            <option key={acc.id} value={acc.id} disabled={rows.some((r, i) => i !== index && r.gl_account_id == acc.id)}>
                                                {acc.code} - {acc.name} ({trans(acc.type)})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-48 relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">Rp</span>
                                    <input
                                        type="text"
                                        className="w-full pl-9 pr-4 py-2 border-gray-200 focus:border-indigo-400 focus:ring-indigo-100 rounded-lg text-sm text-right font-mono font-bold transition-all"
                                        value={row.formattedAmount}
                                        onChange={(e) => handleRowChange(index, 'formattedAmount', e.target.value)}
                                        required
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeRow(index)}
                                    className="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                    disabled={rows.length === 1}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{trans('Total Allocation')}</span>
                        <p className="text-xl font-black text-indigo-600">
                            Rp {new Intl.NumberFormat('id-ID').format(totalBudget)}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <SecondaryButton onClick={onClose}>{trans('Cancel')}</SecondaryButton>
                        <PrimaryButton disabled={processing} className="px-8">
                            {trans('Save Budgets')}
                        </PrimaryButton>
                    </div>
                </div>

                {Object.keys(errors).length > 0 && (
                    <div className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-lg flex gap-3 text-rose-700 animate-pulse">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <div className="text-xs font-medium">
                            {trans('Please correct the validation errors above.')}
                            {errors.cost_center_id && <p>• {errors.cost_center_id}</p>}
                            {errors.fiscal_year && <p>• {errors.fiscal_year}</p>}
                            {Object.entries(errors).filter(([key]) => key.startsWith('allocations')).map(([key, msg]) => (
                                <p key={key}>• {msg as string}</p>
                            ))}
                        </div>
                    </div>
                )}
            </form>
        </Modal>
    );
}
