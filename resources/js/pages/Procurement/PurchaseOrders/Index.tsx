import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTrans } from '@/hooks/useTrans';
import { ShoppingCart, Plus, Eye, Printer, CheckCircle, Clock, XCircle, FileText } from 'lucide-react';
import PrimaryButton from '@/Components/PrimaryButton';

interface PurchaseOrder {
    id: string;
    doc_number: string;
    vendor: { name: string };
    procurement_type: { name: string };
    cost_center: { name: string };
    status: string;
    order_date: string;
    grand_total: number;
    currency_code: string;
    creator: { name: string };
}

interface Props {
    purchaseOrders: PurchaseOrder[];
}

export default function Index({ purchaseOrders }: Props) {
    const { trans } = useTrans();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED': return 'bg-green-100 text-green-800';
            case 'DRAFT': return 'bg-gray-100 text-gray-800';
            case 'SUBMITTED': return 'bg-blue-100 text-blue-800';
            case 'REJECTED': return 'bg-red-100 text-red-800';
            case 'ISSUED': return 'bg-indigo-100 text-indigo-800';
            case 'CANCELLED': return 'bg-slate-100 text-slate-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'APPROVED': return <CheckCircle size={14} />;
            case 'DRAFT': return <Clock size={14} />;
            case 'REJECTED': return <XCircle size={14} />;
            default: return <FileText size={14} />;
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{trans('Purchase Orders')}</h2>}
        >
            <Head title={trans('Purchase Orders')} />

            <div className="max-w-7xl mx-auto">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <p className="text-gray-600 italic">
                            {trans('Official orders issued to vendors.')}
                        </p>
                    </div>
                    <Link href={route('purchase-orders.create')}>
                        <PrimaryButton className="flex items-center gap-2">
                            <Plus size={16} /> {trans('Create Direct PO')}
                        </PrimaryButton>
                    </Link>
                </div>

                <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-widest">
                            <tr>
                                <th className="px-6 py-4 text-left">{trans('PO Number')}</th>
                                <th className="px-6 py-4 text-left">{trans('Vendor')}</th>
                                <th className="px-6 py-4 text-left">{trans('Date')}</th>
                                <th className="px-6 py-4 text-right">{trans('Total Amount')}</th>
                                <th className="px-6 py-4 text-center">{trans('Status')}</th>
                                <th className="px-6 py-4 text-right">{trans('Action')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {purchaseOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400 italic">
                                        {trans('No purchase orders found.')}
                                    </td>
                                </tr>
                            ) : (
                                purchaseOrders.map((po) => (
                                    <tr key={po.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-bold text-indigo-600">{po.doc_number}</div>
                                            <div className="text-[10px] text-gray-400">{po.procurement_type.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600 font-medium">
                                            {po.vendor.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                                            {new Date(po.order_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-mono font-bold">
                                            {po.currency_code} {new Intl.NumberFormat().format(po.grand_total)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(po.status)}`}>
                                                {getStatusIcon(po.status)}
                                                {po.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <div className="flex justify-end gap-2">
                                                <Link href={route('purchase-orders.show', po.id)} className="p-1 hover:text-indigo-600 text-gray-400 transition-colors">
                                                    <Eye size={18} />
                                                </Link>
                                                {po.status === 'APPROVED' && (
                                                    <a href={route('purchase-orders.print', po.id)} target="_blank" className="p-1 hover:text-orange-600 text-gray-400 transition-colors">
                                                        <Printer size={18} />
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
