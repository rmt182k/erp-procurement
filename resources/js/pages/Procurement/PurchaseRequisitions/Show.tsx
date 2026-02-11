import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    FileText,
    User,
    Calendar,
    Building2,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ArrowLeft,
    Send,
    Ban
} from 'lucide-react';
import { useTrans } from '@/hooks/useTrans';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

interface Approval {
    id: number;
    role_name: string;
    status: string;
    remarks: string | null;
    approved_at: string | null;
    approver?: { name: string };
}

interface PurchaseRequisition {
    id: string;
    doc_number: string;
    status: string;
    total_estimated_amount: number;
    required_date: string;
    description: string;
    cancel_reason: string | null;
    requester: { name: string };
    procurement_type: { name: string };
    cost_center: { name: string };
    items: Array<{
        id: string;
        item: { name: string; code: string; unit: { name: string } };
        quantity: number;
        estimated_unit_price: number;
        subtotal: number;
        notes: string | null;
    }>;
    approvals: Approval[];
}

interface Props {
    requisition: PurchaseRequisition;
}

export default function Show({ requisition }: Props) {
    const { trans } = useTrans();
    const { post: submitPr, processing: submitting } = useForm();
    const { data: cancelData, setData: setCancelData, post: cancelPr, processing: cancelling, errors: cancelErrors } = useForm({
        cancel_reason: ''
    });

    const [showCancelModal, setShowCancelModal] = React.useState(false);

    const handleConfirmCancel = (e: React.FormEvent) => {
        e.preventDefault();
        cancelPr(route('purchase-requisitions.cancel', requisition.id), {
            onSuccess: () => setShowCancelModal(false)
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{trans('Detail PR')} - {requisition.doc_number}</h2>}
        >
            <Head title={`PR ${requisition.doc_number}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Actions Bar */}
                    <div className="flex justify-between items-center bg-white p-4 shadow sm:rounded-lg">
                        <Link href={route('purchase-requisitions.index')} className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm">
                            <ArrowLeft size={16} /> {trans('Back to List')}
                        </Link>

                        <div className="flex gap-3">
                            {requisition.status === 'DRAFT' && (
                                <PrimaryButton
                                    onClick={() => submitPr(route('purchase-requisitions.submit', requisition.id))}
                                    disabled={submitting}
                                    className="bg-indigo-600 hover:bg-indigo-700"
                                >
                                    <Send size={16} className="mr-2" /> {trans('Submit for Approval')}
                                </PrimaryButton>
                            )}

                            {requisition.status === 'SUBMITTED' && (
                                <button
                                    onClick={() => setShowCancelModal(true)}
                                    className="inline-flex items-center px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-md font-bold text-xs uppercase tracking-widest hover:bg-red-100 transition duration-150"
                                >
                                    <Ban size={16} className="mr-2" /> {trans('Cancel PR')}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Header Details */}
                            <div className="bg-white shadow sm:rounded-lg p-6">
                                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                    <FileText className="text-indigo-600" size={20} />
                                    {trans('Main Information')}
                                </h3>
                                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">{trans('Document No.')}</p>
                                        <p className="font-bold text-lg">{requisition.doc_number}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">{trans('Status')}</p>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 ${requisition.status === 'DRAFT' ? 'bg-gray-100 text-gray-600' :
                                            requisition.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-600' :
                                                requisition.status === 'APPROVED' ? 'bg-green-100 text-green-600' :
                                                    requisition.status === 'REJECTED' ? 'bg-red-100 text-red-600' :
                                                        'bg-purple-100 text-purple-600'
                                            }`}>
                                            {requisition.status}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold flex items-center gap-1">
                                            <User size={12} /> {trans('Requester')}
                                        </p>
                                        <p className="font-medium">{requisition.requester.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold flex items-center justify-end gap-1">
                                            <Calendar size={12} /> {trans('Required Date')}
                                        </p>
                                        <p className="font-medium">{new Date(requisition.required_date).toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold flex items-center gap-1">
                                            <Building2 size={12} /> {trans('Cost Center')}
                                        </p>
                                        <p className="font-medium">{requisition.cost_center.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">{trans('Procurement Type')}</p>
                                        <p className="font-medium text-indigo-600 font-bold">{requisition.procurement_type.name}</p>
                                    </div>
                                    <div className="col-span-2 pt-4 border-t border-gray-100">
                                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">{trans('Description / Justification')}</p>
                                        <p className="text-sm bg-gray-50 p-4 rounded-lg italic whitespaces-pre-line text-gray-600 border border-gray-100">
                                            "{requisition.description}"
                                        </p>
                                    </div>
                                    {requisition.cancel_reason && (
                                        <div className="col-span-2 bg-red-50 border border-red-100 p-4 rounded-lg">
                                            <p className="text-xs text-red-400 uppercase tracking-widest font-bold mb-1">{trans('Cancellation Reason')}</p>
                                            <p className="text-sm text-red-700">{requisition.cancel_reason}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Items List */}
                            <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                                <div className="p-6 border-b border-gray-100">
                                    <h3 className="text-lg font-bold">{trans('Items / Services List')}</h3>
                                </div>
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 uppercase text-[10px] font-bold text-gray-500 tracking-widest">
                                        <tr>
                                            <th className="px-6 py-4">{trans('Item')}</th>
                                            <th className="px-6 py-4 w-24">{trans('Unit')}</th>
                                            <th className="px-6 py-4 w-24 text-center">{trans('Qty')}</th>
                                            <th className="px-6 py-4 text-right">{trans('Est. Price')}</th>
                                            <th className="px-6 py-4 text-right">{trans('Subtotal')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {requisition.items.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50/50">
                                                <td className="px-6 py-4">
                                                    <p className="font-bold text-gray-700">{item.item.name}</p>
                                                    <p className="text-xs text-gray-400">{item.item.code}</p>
                                                    {item.notes && <p className="text-xs italic text-blue-500 mt-1">Note: {item.notes}</p>}
                                                </td>
                                                <td className="px-6 py-4 text-sm">{item.item.unit.name}</td>
                                                <td className="px-6 py-4 text-center font-bold">{item.quantity}</td>
                                                <td className="px-6 py-4 text-right text-sm">
                                                    {new Intl.NumberFormat('id-ID').format(item.estimated_unit_price)}
                                                </td>
                                                <td className="px-6 py-4 text-right font-bold text-gray-900">
                                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.subtotal)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-gray-50 font-bold">
                                        <tr>
                                            <td colSpan={4} className="px-6 py-4 text-right text-xs uppercase text-gray-400 tracking-widest">{trans('Total Estimated PR')}</td>
                                            <td className="px-6 py-4 text-right text-indigo-600 text-lg">
                                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(requisition.total_estimated_amount)}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        {/* Approval Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-white shadow sm:rounded-lg p-6">
                                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                    <Clock className="text-indigo-600" size={20} />
                                    {trans('Approval Timeline')}
                                </h3>

                                <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                                    {requisition.approvals.length === 0 ? (
                                        <div className="flex items-center gap-3 text-gray-400 bg-gray-50 p-4 rounded-lg">
                                            <AlertCircle size={20} className="opacity-50" />
                                            <p className="text-sm italic">{trans('Approval not initiated. Submit PR first.')}</p>
                                        </div>
                                    ) : (
                                        requisition.approvals.sort((a, b) => (BigInt(a.id) > BigInt(b.id) ? 1 : -1)).map((approval, idx) => (
                                            <div key={approval.id} className="relative pl-8">
                                                <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 ${approval.status === 'APPROVED' ? 'bg-green-500' :
                                                    approval.status === 'PENDING' ? 'bg-blue-500 animate-pulse' :
                                                        approval.status === 'REJECTED' ? 'bg-red-500' :
                                                            'bg-gray-300'
                                                    }`}>
                                                    {approval.status === 'APPROVED' ? <CheckCircle2 size={12} className="text-white" /> :
                                                        approval.status === 'REJECTED' ? <XCircle size={12} className="text-white" /> :
                                                            approval.status === 'PENDING' ? <Clock size={12} className="text-white" /> : null}
                                                </div>

                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{trans('Step')} {idx + 1}</p>
                                                    <p className="font-bold text-gray-800">{approval.role_name}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${approval.status === 'APPROVED' ? 'bg-green-50 text-green-600' :
                                                            approval.status === 'PENDING' ? 'bg-blue-50 text-blue-600' :
                                                                approval.status === 'REJECTED' ? 'bg-red-50 text-red-600' :
                                                                    'bg-gray-50 text-gray-400'
                                                            }`}>
                                                            {approval.status}
                                                        </span>
                                                        {approval.approved_at && (
                                                            <span className="text-[10px] text-gray-400">
                                                                {new Date(approval.approved_at).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {approval.remarks && (
                                                        <p className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded border-l-2 border-gray-200 italic">
                                                            "{approval.remarks}"
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showCancelModal} onClose={() => setShowCancelModal(false)} maxWidth="md">
                <form onSubmit={handleConfirmCancel} className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 border-b pb-3 mb-4 flex items-center gap-2 text-red-600">
                        <Ban size={20} /> {trans('Confirm PR Cancellation')}
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                        {trans('This action will cancel this PR and **release** the previously locked budget. Cancelled PRs cannot be resubmitted.')}
                    </p>
                    <div>
                        <InputLabel value={trans('Cancellation Reason')} required />
                        <textarea
                            className="mt-1 block w-full border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-md shadow-sm"
                            rows={3}
                            value={cancelData.cancel_reason}
                            onChange={e => setCancelData('cancel_reason', e.target.value)}
                            placeholder={trans('Example: Wrong item quantity input...')}
                            required
                        />
                        <InputError message={cancelErrors.cancel_reason} />
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setShowCancelModal(false)}>{trans('No, Back')}</SecondaryButton>
                        <button
                            type="submit"
                            disabled={cancelling}
                            className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                        >
                            {trans('Yes, Cancel Now')}
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
