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

export default function Index({ auth, types }: { auth: any, types: any[] }) {
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
        { header: 'Code', accessorKey: 'code' },
        { header: 'Name', accessorKey: 'name' },
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
            header: 'Inventory?',
            accessorKey: 'track_inventory',
            cell: ({ row }: any) => row.original.track_inventory ? '✅' : '❌'
        },
        {
            header: 'Service?',
            accessorKey: 'is_service',
            cell: ({ row }: any) => row.original.is_service ? '✅' : '❌'
        },
        {
            header: 'Asset?',
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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Procurement Type Settings</h2>}
        >
            <Head title="Procurement Types" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between mb-6">
                            <h3 className="text-lg font-medium">Manage Transaction Behaviors</h3>
                            <PrimaryButton onClick={() => openModal()}>Add New Type</PrimaryButton>
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
                        {editingType ? 'Edit Procurement Type' : 'Create New Procurement Type'}
                    </h2>

                    <div className="mt-6 space-y-4">
                        <div>
                            <InputLabel htmlFor="code" value="Code" />
                            <TextInput
                                id="code"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="name" value="Name" />
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
                                <span>Require PR</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <Checkbox checked={data.require_rfq} onChange={(e) => setData('require_rfq', e.target.checked)} />
                                <span>Require RFQ (Bidding)</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <Checkbox checked={data.require_grn} onChange={(e) => setData('require_grn', e.target.checked)} />
                                <span>Require GRN</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <Checkbox checked={data.track_inventory} onChange={(e) => setData('track_inventory', e.target.checked)} />
                                <span>Track Inventory</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <Checkbox checked={data.is_service} onChange={(e) => setData('is_service', e.target.checked)} />
                                <span>Is Service Item</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <Checkbox checked={data.is_asset} onChange={(e) => setData('is_asset', e.target.checked)} />
                                <span>Is Asset Item</span>
                            </label>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>
                        <PrimaryButton className="ml-3" disabled={processing}>
                            {editingType ? 'Update' : 'Create'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
