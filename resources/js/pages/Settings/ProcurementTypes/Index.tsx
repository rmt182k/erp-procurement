import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { DataTable, Column } from '@/Components/DataTable';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Checkbox from '@/Components/Checkbox';
import { useTrans } from '@/hooks/useTrans';

export default function Index({ auth, types }: { auth: any, types: any[] }) {
    const { trans } = useTrans();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingType, setEditingType] = useState<any>(null);

    const { data, setData, post, put, delete: destroy, processing, reset } = useForm({
        code: '',
        name: '',
        description: '',
        require_pr: true,
        require_rfq: false,
        require_grn: true,
        track_inventory: true,
        is_service: false,
        is_asset: false,
        is_active: true,
    });

    const columns: Column<any>[] = [
        { header: trans('Code'), accessorKey: 'code' },
        { header: trans('Name'), accessorKey: 'name' },
        {
            header: 'PR?',
            accessorKey: 'require_pr',
            cell: ({ row }: any) => row.original.require_pr ? '✅' : '❌'
        },
        {
            header: 'RFQ?',
            accessorKey: 'require_rfq',
            cell: ({ row }: any) => row.original.require_rfq ? '✅' : '❌'
        },
        {
            header: 'GRN?',
            accessorKey: 'require_grn',
            cell: ({ row }: any) => row.original.require_grn ? '✅' : '❌'
        },
        {
            header: trans('Inventory?'),
            accessorKey: 'track_inventory',
            cell: ({ row }: any) => row.original.track_inventory ? '✅' : '❌'
        },
        {
            header: trans('Service?'),
            accessorKey: 'is_service',
            cell: ({ row }: any) => row.original.is_service ? '✅' : '❌'
        },
        {
            header: trans('Asset?'),
            accessorKey: 'is_asset',
            cell: ({ row }: any) => row.original.is_asset ? '✅' : '❌'
        }
    ];

    const openModal = (type = null) => {
        if (type) {
            setEditingType(type);
            setData(type as any);
        } else {
            setEditingType(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingType) {
            put(route('procurement-types.update', editingType.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('procurement-types.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingType(null);
        reset();
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{trans('Procurement Type Settings')}</h2>}
        >
            <Head title={trans('Procurement Types')} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between mb-6">
                            <h3 className="text-lg font-medium">{trans('Manage Transaction Behaviors')}</h3>
                            <PrimaryButton onClick={() => openModal()}>{trans('Add New Type')}</PrimaryButton>
                        </div>

                        <DataTable
                            data={types}
                            columns={columns}
                            onEdit={(type) => openModal(type)}
                            onDelete={(type) => destroy(route('procurement-types.destroy', type.id))}
                        />
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal}>
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        {editingType ? trans('Edit Procurement Type') : trans('Create New Procurement Type')}
                    </h2>

                    <div className="mt-6 space-y-4">
                        <div>
                            <InputLabel htmlFor="code" value={trans('Code')} />
                            <TextInput
                                id="code"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="name" value={trans('Name')} />
                            <TextInput
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <label className="flex items-center space-x-2">
                                <Checkbox checked={data.require_pr} onChange={(e) => setData('require_pr', e.target.checked)} />
                                <span>{trans('Require PR')}</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <Checkbox checked={data.require_rfq} onChange={(e) => setData('require_rfq', e.target.checked)} />
                                <span>{trans('Require RFQ (Bidding)')}</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <Checkbox checked={data.require_grn} onChange={(e) => setData('require_grn', e.target.checked)} />
                                <span>{trans('Require GRN')}</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <Checkbox checked={data.track_inventory} onChange={(e) => setData('track_inventory', e.target.checked)} />
                                <span>{trans('Track Inventory')}</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <Checkbox checked={data.is_service} onChange={(e) => setData('is_service', e.target.checked)} />
                                <span>{trans('Is Service Item')}</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <Checkbox checked={data.is_asset} onChange={(e) => setData('is_asset', e.target.checked)} />
                                <span>{trans('Is Asset Item')}</span>
                            </label>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>{trans('Cancel')}</SecondaryButton>
                        <PrimaryButton className="ml-3" disabled={processing}>
                            {editingType ? trans('Update') : trans('Create')}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
