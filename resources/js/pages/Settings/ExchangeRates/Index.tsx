import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useTrans } from '@/hooks/useTrans';
import { TrendingUp, Plus, Trash2, Calendar, DollarSign, History } from 'lucide-react';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

interface Currency {
    code: string;
    name: string;
    symbol: string;
}

interface ExchangeRate {
    id: number;
    currency_code: string;
    rate: number;
    valid_from: string;
    currency: Currency;
    creator: {
        name: string;
    };
    created_at: string;
}

interface Props {
    currencies: Currency[];
    exchangeRates: ExchangeRate[];
}

export default function Index({ currencies, exchangeRates }: Props) {
    const { trans } = useTrans();
    const [showModal, setShowModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        currency_code: '',
        rate: '',
        valid_from: new Date().toISOString().split('T')[0],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('exchange-rates.store'), {
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    const deleteRate = (id: number) => {
        if (confirm(trans('Are you sure you want to delete this record?'))) {
            // Inertia doesn't have a direct helper for sub-resources if not defined in routes nicely, 
            // but we defined it as resource 'exchange-rates'
            // @ts-ignore
            window.Inertia.delete(route('exchange-rates.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{trans('Exchange Rates History')}</h2>}
        >
            <Head title={trans('Exchange Rates')} />

            <div className="max-w-7xl mx-auto">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <p className="text-gray-600 italic">
                            {trans('Finance history of currency fluctuations.')}
                        </p>
                    </div>
                    <PrimaryButton onClick={() => setShowModal(true)} className="flex items-center gap-2">
                        <Plus size={16} /> {trans('Record New Rate')}
                    </PrimaryButton>
                </div>

                <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 uppercase text-xs font-bold text-gray-400 tracking-widest">
                            <tr>
                                <th className="px-6 py-4 text-left">{trans('Currency')}</th>
                                <th className="px-6 py-4 text-center">{trans('Exchange Rate')}</th>
                                <th className="px-6 py-4 text-center">{trans('Valid From')}</th>
                                <th className="px-6 py-4 text-left">{trans('Created By')}</th>
                                <th className="px-6 py-4 text-right">{trans('Action')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {exchangeRates.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400 italic">
                                        {trans('No history found.')}
                                    </td>
                                </tr>
                            ) : (
                                exchangeRates.map((rate) => (
                                    <tr key={rate.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-gray-900">{rate.currency_code}</span>
                                                <span className="text-xs text-gray-400">({rate.currency.name})</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center font-mono font-bold text-indigo-600">
                                            1 {rate.currency_code} = {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(rate.rate)} IDR
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                                                <Calendar size={12} /> {new Date(rate.valid_from).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-600">{rate.creator.name}</div>
                                            <div className="text-[10px] text-gray-400">{new Date(rate.created_at).toLocaleString()}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <button
                                                onClick={() => deleteRate(rate.id)}
                                                className="text-gray-400 hover:text-red-600 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal show={showModal} onClose={() => setShowModal(false)} maxWidth="md">
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 border-b pb-3 mb-4 flex items-center gap-2">
                        <TrendingUp size={20} className="text-indigo-600" />
                        {trans('Record New Rate')}
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <InputLabel value={trans('Select Foreign Currency')} required />
                            <select
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                value={data.currency_code}
                                onChange={(e) => setData('currency_code', e.target.value)}
                                required
                            >
                                <option value="">{trans('Choose Currency...')}</option>
                                {currencies.map((c) => (
                                    <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                                ))}
                            </select>
                            <InputError message={errors.currency_code} className="mt-1" />
                        </div>

                        <div>
                            <InputLabel value={trans('Exchange Rate (Direct Quote)')} required />
                            <div className="relative mt-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">1 {data.currency_code || '?'} =</span>
                                </div>
                                <TextInput
                                    type="number"
                                    step="0.01"
                                    className="pl-20 block w-full"
                                    value={data.rate}
                                    onChange={(e) => setData('rate', e.target.value)}
                                    placeholder="e.g., 16200"
                                    required
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm text-xs font-bold uppercase tracking-widest pl-2 border-l border-gray-100 ml-2">IDR</span>
                                </div>
                            </div>
                            <p className="mt-2 text-[10px] text-gray-400 italic">
                                * {trans('Direct Quote: 1 Unit Foreign Currency = X Base Currency (IDR)')}
                            </p>
                            <InputError message={errors.rate} className="mt-1" />
                        </div>

                        <div>
                            <InputLabel value={trans('Valid From')} required />
                            <TextInput
                                type="date"
                                className="mt-1 block w-full"
                                value={data.valid_from}
                                onChange={(e) => setData('valid_from', e.target.value)}
                                required
                            />
                            <InputError message={errors.valid_from} className="mt-1" />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setShowModal(false)}>{trans('Cancel')}</SecondaryButton>
                        <PrimaryButton disabled={processing}>
                            {trans('Save Rate')}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
