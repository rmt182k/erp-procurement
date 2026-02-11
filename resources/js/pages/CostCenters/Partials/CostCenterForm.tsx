import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useTrans } from '@/hooks/useTrans';
import { Network } from 'lucide-react';

interface CostCenter {
    id: number;
    code: string;
    name: string;
    description: string | null;
    is_active: boolean;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    costCenter: CostCenter | null;
}

export function CostCenterForm({ isOpen, onClose, costCenter }: Props) {
    const { trans } = useTrans();
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        code: '',
        name: '',
        description: '',
        is_active: true,
    });

    useEffect(() => {
        if (costCenter) {
            setData({
                code: costCenter.code,
                name: costCenter.name,
                description: costCenter.description || '',
                is_active: costCenter.is_active,
            });
        } else {
            reset();
        }
        clearErrors();
    }, [costCenter, isOpen]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (costCenter) {
            put(route('cost-centers.update', costCenter.id), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        } else {
            post(route('cost-centers.store'), {
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
                        <Network className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">
                            {costCenter ? trans('Edit Cost Center') : trans('Add Cost Center')}
                        </h2>
                        <p className="text-xs text-gray-500">
                            {trans('Define cost center code and department name.')}
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <InputLabel htmlFor="code" value={trans('Cost Center Code')} />
                        <TextInput
                            id="code"
                            type="text"
                            className="mt-1 block w-full font-mono uppercase"
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value)}
                            required
                            placeholder="e.g. CC-IT-01"
                        />
                        <InputError message={errors.code} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="name" value={trans('Department Name')} />
                        <TextInput
                            id="name"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            placeholder="e.g. IT Department"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="description" value={trans('Description')} />
                        <textarea
                            id="description"
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-sm"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={3}
                            placeholder={trans('Optional...')}
                        />
                        <InputError message={errors.description} className="mt-2" />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_active"
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                            checked={data.is_active}
                            onChange={(e) => setData('is_active', e.target.checked)}
                        />
                        <InputLabel htmlFor="is_active" value={trans('Active')} className="mb-0" />
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-end gap-3">
                    <SecondaryButton onClick={onClose}>{trans('Cancel')}</SecondaryButton>
                    <PrimaryButton disabled={processing}>
                        {costCenter ? trans('Update Cost Center') : trans('Create Cost Center')}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
