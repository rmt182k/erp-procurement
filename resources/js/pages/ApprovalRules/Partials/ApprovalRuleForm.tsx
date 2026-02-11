import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useTrans } from '@/hooks/useTrans';
import { Workflow, Plus, Trash2, ArrowRight, Activity, Layers } from 'lucide-react';

interface ApprovalStep {
    id?: number;
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
    isOpen: boolean;
    onClose: () => void;
    rule: ApprovalRule | null;
    roles: { id: number; name: string; label: string }[];
}

export function ApprovalRuleForm({ isOpen, onClose, rule, roles }: Props) {
    const { trans } = useTrans();
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        doc_type: 'PurchaseOrder',
        min_amount: '0',
        max_amount: '999999999',
        priority: 0,
        steps: [] as ApprovalStep[],
    });

    useEffect(() => {
        if (isOpen) {
            if (rule) {
                setData({
                    doc_type: rule.doc_type,
                    min_amount: rule.min_amount,
                    max_amount: rule.max_amount,
                    priority: rule.priority,
                    steps: rule.steps.map(s => ({ step_order: s.step_order, role_name: s.role_name })),
                });
            } else {
                reset();
                setData('steps', [{ step_order: 1, role_name: '' }]);
            }
            clearErrors();
        }
    }, [isOpen, rule]);

    const addStep = () => {
        const nextOrder = data.steps.length + 1;
        setData('steps', [...data.steps, { step_order: nextOrder, role_name: '' }]);
    };

    const removeStep = (index: number) => {
        const newSteps = data.steps.filter((_, i) => i !== index)
            .map((s, i) => ({ ...s, step_order: i + 1 }));
        setData('steps', newSteps);
    };

    const updateStep = (index: number, roleName: string) => {
        const newSteps = [...data.steps];
        newSteps[index].role_name = roleName;
        setData('steps', newSteps);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rule) {
            put(route('approval-rules.update', rule.id), {
                onSuccess: () => onClose(),
            });
        } else {
            post(route('approval-rules.store'), {
                onSuccess: () => onClose(),
            });
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="2xl">
            <form onSubmit={submit} className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <Workflow className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">
                            {rule ? trans('Edit Approval Rule') : trans('Create Approval Rule')}
                        </h2>
                        <p className="text-xs text-gray-500">
                            {trans('Define sequential roles for document verification.')}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="col-span-2 md:col-span-1">
                        <InputLabel htmlFor="doc_type" value={trans('Document Type')} />
                        <select
                            id="doc_type"
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-100 rounded-md shadow-sm text-sm"
                            value={data.doc_type}
                            onChange={(e) => setData('doc_type', e.target.value)}
                            required
                        >
                            <option value="PurchaseOrder">{trans('Purchase Order (PO)')}</option>
                            <option value="PurchaseRequest">{trans('Purchase Request (PR)')}</option>
                            <option value="RFQ">{trans('Request for Quotation (RFQ)')}</option>
                        </select>
                        <InputError message={errors.doc_type} className="mt-2" />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <InputLabel htmlFor="priority" value={trans('Priority')} />
                        <TextInput
                            id="priority"
                            type="number"
                            className="mt-1 block w-full"
                            value={data.priority}
                            onChange={(e) => setData('priority', parseInt(e.target.value))}
                            required
                        />
                        <p className="text-[10px] text-gray-400 mt-1">{trans('Higher priority rules take precedence if amounts overlap.')}</p>
                    </div>

                    <div>
                        <InputLabel htmlFor="min_amount" value={trans('Min Amount (IDR)')} />
                        <TextInput
                            id="min_amount"
                            type="number"
                            className="mt-1 block w-full"
                            value={data.min_amount}
                            onChange={(e) => setData('min_amount', e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <InputLabel htmlFor="max_amount" value={trans('Max Amount (IDR)')} />
                        <TextInput
                            id="max_amount"
                            type="number"
                            className="mt-1 block w-full font-bold"
                            value={data.max_amount}
                            onChange={(e) => setData('max_amount', e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Layers className="w-3 h-3 text-indigo-400" />
                            {trans('Sequential Steps')}
                        </h3>
                        <button
                            type="button"
                            onClick={addStep}
                            className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 uppercase tracking-tight"
                        >
                            <Plus className="w-3 h-3" />
                            {trans('Add Step')}
                        </button>
                    </div>

                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {data.steps.map((step, index) => (
                            <div key={index} className="flex items-center gap-3 group animate-in slide-in-from-right-2 duration-200">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center font-black text-gray-400 shrink-0">
                                    {step.step_order}
                                </div>
                                <div className="flex-1">
                                    <select
                                        className="w-full border-gray-200 focus:border-indigo-400 focus:ring-indigo-100 rounded-lg text-sm transition-all"
                                        value={step.role_name}
                                        onChange={(e) => updateStep(index, e.target.value)}
                                        required
                                    >
                                        <option value="">{trans('Select Role...')}</option>
                                        {roles.map(role => (
                                            <option key={role.id} value={role.name}>{role.label} ({role.name})</option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeStep(index)}
                                    className="p-2 text-gray-200 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                    disabled={data.steps.length === 1}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
                    <SecondaryButton onClick={onClose}>{trans('Cancel')}</SecondaryButton>
                    <PrimaryButton disabled={processing} className="px-8 font-black">
                        {rule ? trans('Update Rule') : trans('Create Rule')}
                    </PrimaryButton>
                </div>

                {Object.keys(errors).length > 0 && (
                    <div className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-lg flex gap-3 text-rose-700">
                        <Activity className="w-5 h-5 shrink-0" />
                        <div className="text-xs font-medium">
                            {trans('Please correct the validation errors above.')}
                            {Object.entries(errors).map(([key, msg]) => (
                                <p key={key}>• {msg as string}</p>
                            ))}
                        </div>
                    </div>
                )}
            </form>
        </Modal>
    );
}
