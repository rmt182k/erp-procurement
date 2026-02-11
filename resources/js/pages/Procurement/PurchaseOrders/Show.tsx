import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTrans } from '@/hooks/useTrans';
import { ArrowLeft, Printer, CheckCircle, XCircle, Send, Building2, User, Calendar, DollarSign, Package, AlertCircle } from 'lucide-react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

interface POItem {
    id: string;
    item: { name: string };
    quantity: number;
    unit_price: number;
    tax_rate: number;
    total_price: number;
    notes: string | null;
    pr_item?: {
        purchase_requisition: {
            doc_number: string;
        }
    }
}

interface PurchaseOrder {
    id: string;
    doc_number: string;
    vendor: { name: string; address: string; contact_person: string; email: string };
    cost_center: { name: string };
    currency: { symbol: string };
    currency_code: string;
    exchange_rate: number;
    status: string;
    order_date: string;
    subtotal: number;
    tax_amount: number;
    discount_amount: number;
    grand_total: number;
    notes: string | null;
    shipping_address: string | null;
    creator: { name: string };
    approver: { name: string } | null;
    items: POItem[];
}

interface Props {
    po: PurchaseOrder;
}

export default function Show({ po }: Props) {
    const { trans } = useTrans();
    const { post, processing } = useForm();

    const approve = () => {
        if (confirm(trans('Approve this Purchase Order? This will commit the budget.'))) {
            post(route('purchase-orders.approve', po.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-4">
                        <Link href={route('purchase-orders.index')} className="text-gray-400 hover:text-indigo-600 transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            {trans('Purchase Order')} {po.doc_number}
                        </h2>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${po.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {po.status}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        {po.status === 'DRAFT' && (
                            <PrimaryButton onClick={approve} disabled={processing} className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
                                <CheckCircle size={16} /> {trans('Approve & Commit')}
                            </PrimaryButton>
                        )}
                        <a href={route('purchase-orders.print', po.id)} target="_blank">
                            <SecondaryButton className="flex items-center gap-2">
                                <Printer size={16} /> {trans('Print PDF')}
                            </SecondaryButton>
                        </a>
                    </div>
                </div>
            }
        >
            <Head title={`${trans('PO')} ${po.doc_number}`} />

            <div className="max-w-7xl mx-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Main Info */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white shadow sm:rounded-lg p-6 grid grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Building2 size={14} /> {trans('Vendor Details')}
                                </h3>
                                <p className="text-lg font-bold text-gray-900">{po.vendor.name}</p>
                                <p className="text-sm text-gray-600 mt-1">{po.vendor.address}</p>
                                <div className="mt-4 space-y-1 text-sm text-gray-500">
                                    <p>{trans('Contact')}: {po.vendor.contact_person}</p>
                                    <p>{trans('Email')}: {po.vendor.email}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Package size={14} /> {trans('Shipping & Org')}
                                </h3>
                                <p className="text-sm font-medium text-gray-900">{trans('Cost Center')}: {po.cost_center.name}</p>
                                <p className="text-sm text-gray-600 mt-2 font-bold">{trans('Shipping Address')}:</p>
                                <p className="text-sm text-gray-600 italic mt-1">{po.shipping_address || trans('Central Warehouse')}</p>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 uppercase text-[10px] font-bold text-gray-400">
                                    <tr>
                                        <th className="px-6 py-4 text-left">{trans('Item Description')}</th>
                                        <th className="px-6 py-4 text-center">{trans('Qty')}</th>
                                        <th className="px-6 py-4 text-right">{trans('Unit Price')}</th>
                                        <th className="px-6 py-4 text-right">{trans('Total')}</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {po.items.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900">{item.item.name}</div>
                                                {item.pr_item && (
                                                    <div className="text-[10px] text-indigo-500 font-medium">Source: {item.pr_item.purchase_requisition.doc_number}</div>
                                                )}
                                                {item.notes && <div className="text-xs text-gray-400 italic">{item.notes}</div>}
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm font-medium">{item.quantity}</td>
                                            <td className="px-6 py-4 text-right text-sm">
                                                {po.currency.symbol} {new Intl.NumberFormat().format(item.unit_price)}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-bold">
                                                {po.currency.symbol} {new Intl.NumberFormat().format(item.total_price)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Sidebar / Totals */}
                    <div className="space-y-6 text-gray-600">
                        <div className="bg-white shadow sm:rounded-lg p-6 space-y-4">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b pb-2 mb-4">{trans('Summary')}</h3>

                            <div className="flex justify-between text-sm">
                                <span>{trans('Subtotal')}</span>
                                <span className="font-bold">{po.currency.symbol} {new Intl.NumberFormat().format(po.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>{trans('Tax (PPN 11%)')}</span>
                                <span className="font-bold">{po.currency.symbol} {new Intl.NumberFormat().format(po.tax_amount)}</span>
                            </div>
                            {po.discount_amount > 0 && (
                                <div className="flex justify-between text-sm text-red-600">
                                    <span>{trans('Discount')}</span>
                                    <span className="font-bold">- {po.currency.symbol} {new Intl.NumberFormat().format(po.discount_amount)}</span>
                                </div>
                            )}

                            <div className="border-t pt-4 flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-900">{trans('TOTAL')}</span>
                                <span className="text-xl font-black text-indigo-600">
                                    {po.currency.symbol} {new Intl.NumberFormat().format(po.grand_total)}
                                </span>
                            </div>

                            {po.currency_code !== 'IDR' && (
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100 italic text-[10px]">
                                    <div className="flex items-center gap-1 text-gray-400 font-bold uppercase mb-1">
                                        <AlertCircle size={10} /> {trans('Exchange Rate Snapshot')}
                                    </div>
                                    1 {po.currency_code} = {new Intl.NumberFormat('id-ID').format(po.exchange_rate)} IDR
                                    <br />
                                    Base Value: Rp {new Intl.NumberFormat('id-ID').format(po.grand_total * po.exchange_rate)}
                                </div>
                            )}
                        </div>

                        <div className="bg-white shadow sm:rounded-lg p-6 space-y-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-400 uppercase text-[10px] font-bold"><User size={12} /> {trans('Audits')}</div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-tighter">{trans('Created By')}</p>
                                <p className="font-bold">{po.creator.name}</p>
                                <p className="text-[10px] text-gray-400">{new Date(po.order_date).toLocaleString()}</p>
                            </div>
                            {po.approver && (
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-tighter">{trans('Approved By')}</p>
                                    <p className="font-bold text-green-600">{po.approver?.name}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
