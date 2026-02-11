import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { DataTable, Column } from '@/Components/DataTable';
import { Plus, Eye, Send, XCircle } from 'lucide-react';
import { useTrans } from '@/hooks/useTrans';

interface PurchaseRequisition {
    id: string;
    doc_number: string;
    status: string;
    total_estimated_amount: number;
    required_date: string;
    requester: { name: string };
    procurement_type: { name: string };
    cost_center: { name: string };
}

interface Props {
    requisitions: PurchaseRequisition[];
}

export default function Index({ requisitions }: Props) {
    const { trans } = useTrans();

    const columns: Column<PurchaseRequisition>[] = [
        { header: trans('Document No.'), key: 'doc_number', sortable: true },
        { header: trans('Requester'), accessorKey: 'requester.name', sortable: true },
        { header: trans('Type'), accessorKey: 'procurement_type.name', sortable: true },
        { header: trans('Cost Center'), accessorKey: 'cost_center.name', sortable: true },
        {
            header: trans('Total Est.'),
            key: 'total_estimated_amount',
            sortable: true,
            render: (row) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.total_estimated_amount)
        },
        {
            header: trans('Required Date'),
            key: 'required_date',
            sortable: true,
            render: (row) => new Date(row.required_date).toLocaleDateString('id-ID')
        },
        {
            header: trans('Status'),
            key: 'status',
            render: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${row.status === 'DRAFT' ? 'bg-gray-100 text-gray-600' :
                    row.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-600' :
                        row.status === 'APPROVED' ? 'bg-green-100 text-green-600' :
                            row.status === 'REJECTED' ? 'bg-red-100 text-red-600' :
                                'bg-purple-100 text-purple-600'
                    }`}>
                    {row.status}
                </span>
            )
        },
    ];

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{trans('Purchase Requisitions')}</h2>}
        >
            <Head title={trans('Purchase Requisitions')} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <DataTable
                            data={requisitions}
                            columns={columns}
                            headerExtra={
                                <Link
                                    href={route('purchase-requisitions.create')}
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    {trans('Create New PR')}
                                </Link>
                            }
                            onRowClick={(row) => window.location.href = route('purchase-requisitions.show', row.id)}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
