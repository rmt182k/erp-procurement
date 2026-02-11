import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useTrans } from '@/hooks/useTrans';
import { Coins } from 'lucide-react';

interface Currency {
    id?: number;
    code: string;
    name: string;
    symbol: string | null;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    currency: Currency | null;
}

export function CurrencyForm({ isOpen, onClose, currency }: Props) {
    const { trans } = useTrans();
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        code: '',
        name: '',
        symbol: '',
    });

    useEffect(() => {
        if (currency) {
            setData({
                code: currency.code,
                name: currency.name,
                symbol: currency.symbol || '',
            });
        } else {
            reset();
        }
        clearErrors();
    }, [currency, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (currency?.id) {
            put(route('currencies.update', currency.id), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        } else {
            post(route('currencies.store'), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="lg">
            <form onSubmit={handleSubmit} className="p-6">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                        <Coins className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">
                            {currency ? trans('Edit Currency') : trans('Add Currency')}
                        </h2>
                        <p className="text-xs text-gray-500">{trans('Define currency code and symbol.')}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="code" value={trans('Currency Code')} />
                            <TextInput
                                id="code"
                                className="mt-1 block w-full uppercase"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                placeholder="e.g. USD"
                                required
                                maxLength={3}
                            />
                            <InputError message={errors.code} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="symbol" value={trans('Symbol')} />
                            <TextInput
                                id="symbol"
                                className="mt-1 block w-full"
                                value={data.symbol}
                                onChange={(e) => setData('symbol', e.target.value)}
                                placeholder="e.g. $"
                            />
                            <InputError message={errors.symbol} className="mt-2" />
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="name" value={trans('Currency Name')} />
                        <TextInput
                            id="name"
                            className="mt-1 block w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g. US Dollar"
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-6">
                    <SecondaryButton onClick={onClose} disabled={processing}>
                        {trans('Cancel')}
                    </SecondaryButton>
                    <PrimaryButton className="bg-orange-600 hover:bg-orange-700 active:bg-orange-800" disabled={processing}>
                        {trans('Save Currency')}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
