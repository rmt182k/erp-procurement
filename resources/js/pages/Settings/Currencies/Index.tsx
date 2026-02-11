import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useTrans } from '@/hooks/useTrans';
import { Coins, Plus, Edit2, Trash2, Globe, CheckCircle2 } from 'lucide-react';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Checkbox from '@/Components/Checkbox';

interface Currency {
    code: string;
    name: string;
    symbol: string;
    is_base: boolean;
}

interface Props {
    currencies: Currency[];
}

export default function Index({ currencies }: Props) {
    const { trans } = useTrans();
    const [showModal, setShowModal] = useState(false);
    const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        code: '',
        name: '',
        symbol: '',
        is_base: false,
    });

    const openCreateModal = () => {
        setEditingCurrency(null);
        reset();
        setShowModal(true);
    };

    const openEditModal = (currency: Currency) => {
        setEditingCurrency(currency);
        setData({
            code: currency.code,
            name: currency.name,
            symbol: currency.symbol,
            is_base: currency.is_base,
        });
        setShowModal(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCurrency) {
            put(route('currencies.update', editingCurrency.code), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('currencies.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const closeModal = () => {
        setShowModal(false);
        reset();
    };

    const deleteCurrency = (currency: Currency) => {
        if (confirm(trans('Are you sure you want to delete this currency?'))) {
            destroy(route('currencies.destroy', currency.code));
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{trans('Currencies')}</h2>}
        >
            <Head title={trans('Currencies')} />

            <div className="max-w-7xl mx-auto">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <p className="text-gray-600 italic">
                            {trans('Define currency code and symbol.')}
                        </p>
                    </div>
                    <PrimaryButton onClick={openCreateModal} className="flex items-center gap-2">
                        <Plus size={16} /> {trans('Add Currency')}
                    </PrimaryButton>
                </div>

                <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 uppercase text-xs font-bold text-gray-400 tracking-widest">
                            <tr>
                                <th className="px-6 py-4 text-left">{trans('Code')}</th>
                                <th className="px-6 py-4 text-left">{trans('Name')}</th>
                                <th className="px-6 py-4 text-center">{trans('Symbol')}</th>
                                <th className="px-6 py-4 text-center">{trans('Status')}</th>
                                <th className="px-6 py-4 text-right">{trans('Action')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currencies.map((currency) => (
                                <tr key={currency.code} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap font-bold text-indigo-600">{currency.code}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{currency.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-gray-900">{currency.symbol}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        {currency.is_base ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 gap-1">
                                                <CheckCircle2 size={12} /> {trans('Base Currency')}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {trans('Foreign')}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-3 text-gray-400">
                                            <button onClick={() => openEditModal(currency)} className="hover:text-indigo-600 transition-colors">
                                                <Edit2 size={18} />
                                            </button>
                                            {!currency.is_base && (
                                                <button onClick={() => deleteCurrency(currency)} className="hover:text-red-600 transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal show={showModal} onClose={closeModal} maxWidth="md">
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 border-b pb-3 mb-4 flex items-center gap-2">
                        <Coins size={20} className="text-indigo-600" />
                        {editingCurrency ? trans('Edit Currency') : trans('Add Currency')}
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <InputLabel value={trans('Currency Code')} required />
                            <TextInput
                                className="mt-1 block w-full"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                placeholder="e.g., USD"
                                required
                                disabled={!!editingCurrency}
                            />
                            <InputError message={errors.code} className="mt-1" />
                        </div>

                        <div>
                            <InputLabel value={trans('Currency Name')} required />
                            <TextInput
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="e.g., US Dollar"
                                required
                            />
                            <InputError message={errors.name} className="mt-1" />
                        </div>

                        <div>
                            <InputLabel value={trans('Symbol')} required />
                            <TextInput
                                className="mt-1 block w-full"
                                value={data.symbol}
                                onChange={(e) => setData('symbol', e.target.value)}
                                placeholder="e.g., $"
                                required
                            />
                            <InputError message={errors.symbol} className="mt-1" />
                        </div>

                        <div className="flex items-center gap-2 mt-4 bg-gray-50 p-4 rounded-lg">
                            <Checkbox
                                name="is_base"
                                checked={data.is_base}
                                onChange={(e) => setData('is_base', e.target.checked)}
                            />
                            <label className="text-sm text-gray-600 font-medium cursor-pointer" onClick={() => setData('is_base', !data.is_base)}>
                                {trans('Set as Base Currency (IDR)')}
                            </label>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal}>{trans('Cancel')}</SecondaryButton>
                        <PrimaryButton disabled={processing}>
                            {trans('Save')}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
