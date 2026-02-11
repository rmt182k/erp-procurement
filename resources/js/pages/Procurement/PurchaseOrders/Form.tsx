import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTrans } from '@/hooks/useTrans';
import { ArrowLeft, Save, Plus, Trash2, ShoppingCart, Calculator, Hash } from 'lucide-react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import { useState, useEffect } from 'react';

interface PurchaseOrder {
    id: string;
    doc_number: string;
    vendor_id: number;
    procurement_type_id: number;
    cost_center_id: number;
    order_date: string;
    delivery_date: string | null;
    currency_code: string;
    exchange_rate: number;
    notes: string | null;
    items: any[];
}

interface Vendor { id: number; name: string; currency_code: string }
interface ProcurementType { id: number; name: string }
interface CostCenter { id: number; name: string }

interface Props {
    po?: PurchaseOrder;
    vendors: Vendor[];
    procurementTypes: ProcurementType[];
    costCenters: CostCenter[];
}

export default function Form({ po, vendors, procurementTypes, costCenters }: Props) {
    const { trans } = useTrans();
    const isEditing = !!po;

    const { data, setData, post, put, processing, errors } = useForm({
        vendor_id: po?.vendor_id || '',
        procurement_type_id: po?.procurement_type_id || '',
        cost_center_id: po?.cost_center_id || '',
        order_date: po?.order_date ? new Date(po.order_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        delivery_date: po?.delivery_date ? new Date(po.delivery_date).toISOString().split('T')[0] : '',
        currency_code: po?.currency_code || 'IDR',
        exchange_rate: po?.exchange_rate || 1,
        notes: po?.notes || '',
        items: po?.items || [],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(route('purchase-orders.update', po.id));
        } else {
            post(route('purchase-orders.store'));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('purchase-orders.index')} className="text-gray-400 hover:text-indigo-600 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        {isEditing ? `${trans('Edit PO')} ${po.doc_number}` : trans('Create Purchase Order')}
                    </h2>
                </div>
            }
        >
            <Head title={isEditing ? trans('Edit PO') : trans('Create PO')} />

            <div className="max-w-7xl mx-auto">
                <form onSubmit={submit} className="space-y-6">
                    <div className="bg-white shadow sm:rounded-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1 space-y-4">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b pb-2 mb-4 flex items-center gap-2">
                                <Hash size={14} /> {trans('General Info')}
                            </h3>

                            <div>
                                <InputLabel value={trans('Vendor')} required />
                                <select
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    value={data.vendor_id}
                                    onChange={(e) => setData('vendor_id', e.target.value)}
                                    required
                                >
                                    <option value="">{trans('-- Select Vendor --')}</option>
                                    {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                                </select>
                                <InputError message={errors.vendor_id} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel value={trans('Cost Center')} required />
                                <select
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    value={data.cost_center_id}
                                    onChange={(e) => setData('cost_center_id', e.target.value)}
                                    required
                                >
                                    <option value="">{trans('-- Select Cost Center --')}</option>
                                    {costCenters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-4">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b pb-2 mb-4 flex items-center gap-2">
                                <ShoppingCart size={14} /> {trans('Items & Pricing')}
                            </h3>

                            {/* Simplified Item Form for MVP */}
                            <div className="p-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-center">
                                <Calculator size={48} className="text-gray-300 mb-4" />
                                <h4 className="font-bold text-gray-500">{trans('Negotiation Phase')}</h4>
                                <p className="text-sm text-gray-400 max-w-xs mt-1">
                                    {trans('Usually, POs are generated from PRs. Direct manual PO creation is restricted to specific users in this trial.')}
                                </p>
                                {isEditing ? (
                                    <p className="mt-4 text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full border border-indigo-100 italic">
                                        Update pricing in the "Show" page action instead.
                                    </p>
                                ) : (
                                    <Link href={route('purchase-requisitions.index')} className="mt-4">
                                        <SecondaryButton>{trans('Go to PRs to Convert')}</SecondaryButton>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Link href={route('purchase-orders.index')}>
                            <SecondaryButton>{trans('Cancel')}</SecondaryButton>
                        </Link>
                        <PrimaryButton disabled={processing || !data.vendor_id}>
                            <Save size={16} className="mr-2" /> {isEditing ? trans('Update Order') : trans('Create Order')}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
