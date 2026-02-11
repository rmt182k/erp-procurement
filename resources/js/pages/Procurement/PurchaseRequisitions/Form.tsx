import React, { useState, useMemo, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Plus, Trash2, Save, ShoppingCart, ArrowLeft } from 'lucide-react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { useTrans } from '@/hooks/useTrans';

interface ProcurementType {
    id: number;
    name: string;
    is_service: boolean;
}

interface CostCenter {
    id: number;
    name: string;
}

interface Item {
    id: string;
    name: string;
    code: string;
    category: { name: string };
    unit: { name: string };
}

interface Vendor {
    id: number;
    name: string;
}

interface Props {
    procurementTypes: ProcurementType[];
    costCenters: CostCenter[];
    items: Item[];
    vendors: Vendor[];
}

export default function Form({ procurementTypes, costCenters, items, vendors }: Props) {
    const { trans } = useTrans();
    const { data, setData, post, processing, errors } = useForm({
        procurement_type_id: '',
        cost_center_id: '',
        suggested_vendor_id: '',
        required_date: '',
        description: '',
        items: [] as any[]
    });

    const selectedType = useMemo(() =>
        procurementTypes.find(t => String(t.id) === String(data.procurement_type_id)),
        [data.procurement_type_id, procurementTypes]
    );

    // Filter items based on procurement type (is_service)
    const filteredItems = useMemo(() => {
        if (!selectedType) return items;
        // Logic: if is_service is true, only show items with 'Service' category
        // Assuming category name is 'Service' or similar. 
        // For now, let's filter if category name contains 'Service' (Case insensitive)
        return items.filter(item => {
            const isItemService = item.category?.name?.toLowerCase().includes('service') ||
                item.category?.name?.toLowerCase().includes('jasa');
            return selectedType.is_service ? isItemService : !isItemService;
        });
    }, [selectedType, items]);

    const addItem = () => {
        setData('items', [
            ...data.items,
            { item_id: '', quantity: 1, estimated_unit_price: 0 }
        ]);
    };

    const removeItem = (index: number) => {
        const newItems = [...data.items];
        newItems.splice(index, 1);
        setData('items', newItems);
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setData('items', newItems);
    };

    const totalAmount = useMemo(() => {
        return data.items.reduce((sum, item) => sum + (item.quantity * item.estimated_unit_price), 0);
    }, [data.items]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('purchase-requisitions.store'));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{trans('Buat Purchase Requisition')}</h2>}
        >
            <Head title={trans('Buat PR')} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Header Info */}
                        <div className="bg-white shadow sm:rounded-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <ShoppingCart className="text-indigo-600" size={20} />
                                    Informasi Dasar
                                </h3>
                                <Link href={route('purchase-requisitions.index')} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                                    <ArrowLeft size={16} /> Kembali
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div>
                                    <InputLabel value={trans('Tipe Pengadaan')} required />
                                    <select
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        value={data.procurement_type_id}
                                        onChange={e => setData('procurement_type_id', e.target.value)}
                                    >
                                        <option value="">Pilih Tipe</option>
                                        {procurementTypes.map(t => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </select>
                                    <InputError message={errors.procurement_type_id} />
                                </div>

                                <div>
                                    <InputLabel value={trans('Cost Center')} required />
                                    <select
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        value={data.cost_center_id}
                                        onChange={e => setData('cost_center_id', e.target.value)}
                                    >
                                        <option value="">Pilih Cost Center</option>
                                        {costCenters.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                    <InputError message={errors.cost_center_id} />
                                </div>

                                <div>
                                    <InputLabel value={trans('Tanggal Dibutuhkan')} required />
                                    <TextInput
                                        type="date"
                                        className="mt-1 block w-full"
                                        value={data.required_date}
                                        onChange={e => setData('required_date', e.target.value)}
                                    />
                                    <InputError message={errors.required_date} />
                                </div>

                                <div>
                                    <InputLabel value={trans('Preferensi Vendor')} />
                                    <select
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        value={data.suggested_vendor_id}
                                        onChange={e => setData('suggested_vendor_id', e.target.value)}
                                    >
                                        <option value="">Pilih Vendor</option>
                                        {vendors.map(v => (
                                            <option key={v.id} value={v.id}>{v.name}</option>
                                        ))}
                                    </select>
                                    <InputError message={errors.suggested_vendor_id} />
                                </div>

                                <div className="md:col-span-2">
                                    <InputLabel value={trans('Deskripsi / Justifikasi')} required />
                                    <textarea
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        rows={3}
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        placeholder="Jelaskan apa yang dibeli dan mengapa ini dibutuhkan..."
                                    />
                                    <InputError message={errors.description} />
                                </div>
                            </div>
                        </div>

                        {/* Items Section */}
                        <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="text-lg font-bold">{trans('Daftar Barang / Jasa')}</h3>
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-bold border border-green-200 hover:bg-green-100 transition-colors"
                                >
                                    <Plus size={16} className="mr-1" /> {trans('Tambah Baris')}
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 uppercase text-[10px] font-bold text-gray-500 tracking-widest">
                                        <tr>
                                            <th className="px-6 py-4">{trans('Barang / Jasa')}</th>
                                            <th className="px-6 py-4 w-32">{trans('Jumlah')}</th>
                                            <th className="px-6 py-4 w-48">{trans('Est. Harga Satuan')}</th>
                                            <th className="px-6 py-4 w-48 text-right">{trans('Subtotal')}</th>
                                            <th className="px-6 py-4 w-16"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {data.items.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
                                                    Belum ada item. Klik "Tambah Baris" untuk memulai.
                                                </td>
                                            </tr>
                                        ) : (
                                            data.items.map((item, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <select
                                                            className="w-full border-none bg-transparent focus:ring-0 text-sm font-medium"
                                                            value={item.item_id}
                                                            onChange={e => updateItem(idx, 'item_id', e.target.value)}
                                                        >
                                                            <option value="">Pilih Item</option>
                                                            {filteredItems.map(it => (
                                                                <option key={it.id} value={it.id}>[{it.code}] {it.name}</option>
                                                            ))}
                                                        </select>
                                                        <InputError message={errors[`items.${idx}.item_id`]} />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="number"
                                                            className="w-full border-none bg-transparent focus:ring-0 text-sm"
                                                            value={item.quantity}
                                                            onChange={e => updateItem(idx, 'quantity', Number(e.target.value))}
                                                            min="1"
                                                        />
                                                        <InputError message={errors[`items.${idx}.quantity`]} />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center">
                                                            <span className="text-gray-400 mr-1 text-sm">Rp</span>
                                                            <input
                                                                type="text"
                                                                className="w-full border-none bg-transparent focus:ring-0 text-sm"
                                                                value={item.estimated_unit_price}
                                                                onChange={e => updateItem(idx, 'estimated_unit_price', Number(e.target.value.replace(/[^0-9]/g, '')))}
                                                            />
                                                        </div>
                                                        <InputError message={errors[`items.${idx}.estimated_unit_price`]} />
                                                    </td>
                                                    <td className="px-6 py-4 text-right font-bold text-gray-700">
                                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.quantity * item.estimated_unit_price)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeItem(idx)}
                                                            className="p-2 text-red-400 hover:text-red-600 transition-colors"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-gray-50/50 font-bold">
                                            <td colSpan={3} className="px-6 py-4 text-right uppercase tracking-[2px] text-xs text-gray-400">Total Estimasi Keseluruhan</td>
                                            <td className="px-6 py-4 text-right text-indigo-600 text-lg">
                                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalAmount)}
                                            </td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                            <PrimaryButton
                                disabled={processing || data.items.length === 0}
                                className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {trans('Simpan Draft PR')}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
