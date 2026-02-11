import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useTrans } from '@/hooks/useTrans';
import { Clock } from 'lucide-react';

interface PaymentTerm {
    id?: number;
    name: string;
    days: number;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    paymentTerm: PaymentTerm | null;
}

export function PaymentTermForm({ isOpen, onClose, paymentTerm }: Props) {
    const { trans } = useTrans();
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        days: 0,
    });

    useEffect(() => {
        if (paymentTerm) {
            setData({
                name: paymentTerm.name,
                days: paymentTerm.days,
            });
        } else {
            reset();
        }
        clearErrors();
    }, [paymentTerm, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (paymentTerm?.id) {
            put(route('vendor-payment-terms.update', paymentTerm.id), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        } else {
            post(route('vendor-payment-terms.store'), {
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
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">
                            {paymentTerm ? trans('Edit Payment Term') : trans('Add Payment Term')}
                        </h2>
                        <p className="text-xs text-gray-500">{trans('Define payment duration in days.')}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <InputLabel htmlFor="name" value={trans('Term Name')} />
                        <TextInput
                            id="name"
                            className="mt-1 block w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g. Net 30"
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="days" value={trans('Days')} />
                        <TextInput
                            id="days"
                            type="number"
                            className="mt-1 block w-full"
                            value={data.days}
                            onChange={(e) => setData('days', parseInt(e.target.value))}
                            placeholder="e.g. 30"
                            required
                            min={0}
                        />
                        <InputError message={errors.days} className="mt-2" />
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-6">
                    <SecondaryButton onClick={onClose} disabled={processing}>
                        {trans('Cancel')}
                    </SecondaryButton>
                    <PrimaryButton className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800" disabled={processing}>
                        {trans('Save Term')}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
