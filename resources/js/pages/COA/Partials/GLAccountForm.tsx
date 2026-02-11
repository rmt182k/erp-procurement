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

interface GLAccount {
    id: number;
    code: string;
    name: string;
    type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    account: GLAccount | null;
}

export function GLAccountForm({ isOpen, onClose, account }: Props) {
    const { trans } = useTrans();
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<{
        code: string;
        name: string;
        type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
    }>({
        code: '',
        name: '',
        type: 'asset',
    });

    useEffect(() => {
        if (account) {
            setData({
                code: account.code,
                name: account.name,
                type: account.type,
            });
        } else {
            reset();
        }
        clearErrors();
    }, [account, isOpen]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (account) {
            put(route('chart-of-accounts.update', account.id), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        } else {
            post(route('chart-of-accounts.store'), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="md">
            <form onSubmit={submit} className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <Coins className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">
                            {account ? trans('Edit GL Account') : trans('Add GL Account')}
                        </h2>
                        <p className="text-xs text-gray-500">
                            {trans('Define account code, name and classification.')}
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <InputLabel htmlFor="code" value={trans('Account Code')} />
                        <TextInput
                            id="code"
                            type="text"
                            className="mt-1 block w-full font-mono"
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value)}
                            required
                            placeholder="e.g. 1101"
                        />
                        <InputError message={errors.code} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="name" value={trans('Account Name')} />
                        <TextInput
                            id="name"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            placeholder="e.g. Merchandise Inventory"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="type" value={trans('Account Type')} />
                        <select
                            id="type"
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            value={data.type}
                            onChange={(e) => setData('type', e.target.value as any)}
                            required
                        >
                            <option value="asset">{trans('Asset')}</option>
                            <option value="liability">{trans('Liability')}</option>
                            <option value="equity">{trans('Equity')}</option>
                            <option value="revenue">{trans('Revenue')}</option>
                            <option value="expense">{trans('Expense')}</option>
                        </select>
                        <InputError message={errors.type} className="mt-2" />
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-end gap-3">
                    <SecondaryButton onClick={onClose}>{trans('Cancel')}</SecondaryButton>
                    <PrimaryButton disabled={processing}>
                        {account ? trans('Update Account') : trans('Create Account')}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
