import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { DataTable, Column } from '@/Components/DataTable';
import {
    Building2,
    Plus,
    LayoutGrid,
    List as ListIcon,
    Search,
    Mail,
    Phone,
    MapPin,
    Building,
    Edit,
    Trash2,
    Coins,
    Clock,
    Users
} from 'lucide-react';
import { useTrans } from '@/hooks/useTrans';
import { VendorForm } from './Partials/VendorForm';
import { CurrencyForm } from './Partials/CurrencyForm';
import { PaymentTermForm } from './Partials/PaymentTermForm';

interface GLAccount {
    id: number;
    code: string;
    name: string;
}

interface Currency {
    id: number;
    code: string;
    name: string;
    symbol: string | null;
}

interface PaymentTerm {
    id: number;
    name: string;
    days: number;
}

interface Vendor {
    id: number;
    code: string;
    name: string;
    email: string | null;
    phone: string | null;
    address_line1: string;
    address_line2: string | null;
    city: string;
    postal_code: string;
    country: string;
    tax_id: string | null;
    is_pkp: boolean;
    currency_id: number | null;
    payment_term_id: number | null;
    currency?: Currency;
    paymentTerm?: PaymentTerm;
    bank_name: string | null;
    bank_account_number: string | null;
    bank_holder_name: string | null;
    payable_account_id: number | null;
    payable_account?: GLAccount;
}

interface Props {
    vendors: Vendor[];
    gl_accounts: GLAccount[];
    currencies: Currency[];
    payment_terms: PaymentTerm[];
    filters: {
        search?: string;
    };
}

function cls(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}

type TabType = 'vendors' | 'currencies' | 'payment_terms';

export default function Index({ vendors, gl_accounts, currencies, payment_terms, filters }: Props) {
    const { trans } = useTrans();
    const [activeTab, setActiveTab] = useState<TabType>('vendors');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    // Form States
    const [isVendorFormOpen, setIsVendorFormOpen] = useState(false);
    const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

    const [isCurrencyFormOpen, setIsCurrencyFormOpen] = useState(false);
    const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);

    const [isPaymentTermFormOpen, setIsPaymentTermFormOpen] = useState(false);
    const [editingPaymentTerm, setEditingPaymentTerm] = useState<PaymentTerm | null>(null);

    const handleDelete = (type: TabType, id: number) => {
        let routeName = '';
        let confirmMsg = '';

        switch (type) {
            case 'vendors': routeName = 'vendors.destroy'; confirmMsg = trans('Are you sure you want to delete this vendor?'); break;
            case 'currencies': routeName = 'currencies.destroy'; confirmMsg = trans('Are you sure you want to delete this currency?'); break;
            case 'payment_terms': routeName = 'vendor-payment-terms.destroy'; confirmMsg = trans('Are you sure you want to delete this payment term?'); break;
        }

        if (confirm(confirmMsg)) {
            router.delete(route(routeName, id), { preserveScroll: true });
        }
    };

    const vendorColumns: Column<Vendor>[] = [
        {
            header: trans("Vendor Info"),
            key: 'name',
            sortable: true,
            render: (vendor) => (
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900">{vendor.name}</span>
                    <span className="text-xs text-gray-500 font-mono mt-0.5 uppercase tracking-tight">{vendor.code}</span>
                </div>
            )
        },
        {
            header: trans("Contact"),
            key: 'email',
            render: (vendor) => (
                <div className="flex flex-col gap-1">
                    {vendor.email && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <Mail className="w-3 h-3 text-gray-400" />
                            {vendor.email}
                        </div>
                    )}
                    {vendor.phone && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <Phone className="w-3 h-3 text-gray-400" />
                            {vendor.phone}
                        </div>
                    )}
                </div>
            )
        },
        {
            header: trans("Address"),
            key: 'city',
            render: (vendor) => (
                <div className="flex items-start gap-1.5 text-xs text-gray-600 max-w-xs">
                    <MapPin className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span>{vendor.city}, {vendor.country}</span>
                </div>
            )
        },
        {
            header: trans("Financial Profile"),
            key: 'currency_id',
            render: (vendor) => (
                <div className="flex flex-col gap-1 text-[11px]">
                    <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold uppercase inline-block w-fit">
                        {vendor.currency?.code || '-'}
                    </span>
                    <span className="text-gray-500 font-medium whitespace-nowrap">
                        Term: {vendor.paymentTerm?.name || '-'}
                    </span>
                    {vendor.is_pkp && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold uppercase inline-block w-fit">
                            PKP
                        </span>
                    )}
                </div>
            )
        },
        {
            header: "",
            align: 'right',
            className: 'w-0 whitespace-nowrap',
            render: (vendor) => (
                <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => { setEditingVendor(vendor); setIsVendorFormOpen(true); }}
                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title={trans("Edit")}
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete('vendors', vendor.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title={trans("Delete")}
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    const currencyColumns: Column<Currency>[] = [
        {
            header: trans("Currency Code"),
            key: 'code',
            className: 'font-bold text-gray-900',
            render: (c) => <span className="uppercase">{c.code}</span>
        },
        {
            header: trans("Name"),
            key: 'name',
            render: (c) => <span>{c.name}</span>
        },
        {
            header: trans("Symbol"),
            key: 'symbol',
            align: 'center',
            render: (c) => <span className="font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-1 rounded">{c.symbol || '-'}</span>
        },
        {
            header: "",
            align: 'right',
            className: 'w-0 whitespace-nowrap',
            render: (c) => (
                <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingCurrency(c); setIsCurrencyFormOpen(true); }} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete('currencies', c.id)} className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
            )
        }
    ];

    const paymentTermColumns: Column<PaymentTerm>[] = [
        {
            header: trans("Term Name"),
            key: 'name',
            className: 'font-semibold text-gray-900',
        },
        {
            header: trans("Days"),
            key: 'days',
            align: 'center',
            render: (p) => <span className="font-mono">{p.days} {trans('Days')}</span>
        },
        {
            header: "",
            align: 'right',
            className: 'w-0 whitespace-nowrap',
            render: (p) => (
                <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingPaymentTerm(p); setIsPaymentTermFormOpen(true); }} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete('payment_terms', p.id)} className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
            )
        }
    ];

    const filteredVendors = vendors.filter(v =>
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.email && v.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        v.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredCurrencies = currencies.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredPaymentTerms = payment_terms.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight flex items-center gap-2">
                        <Building2 className="w-6 h-6 text-indigo-600" />
                        {trans('Vendor Management')}
                    </h2>

                    {activeTab === 'vendors' && (
                        <button
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm text-sm font-semibold"
                            onClick={() => { setEditingVendor(null); setIsVendorFormOpen(true); }}
                        >
                            <Plus className="w-4 h-4" />
                            {trans('Add Vendor')}
                        </button>
                    )}
                    {activeTab === 'currencies' && (
                        <button
                            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-sm text-sm font-semibold"
                            onClick={() => { setEditingCurrency(null); setIsCurrencyFormOpen(true); }}
                        >
                            <Plus className="w-4 h-4" />
                            {trans('Add Currency')}
                        </button>
                    )}
                    {activeTab === 'payment_terms' && (
                        <button
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm font-semibold"
                            onClick={() => { setEditingPaymentTerm(null); setIsPaymentTermFormOpen(true); }}
                        >
                            <Plus className="w-4 h-4" />
                            {trans('Add Payment Term')}
                        </button>
                    )}
                </div>
            }
        >
            <Head title={trans('Vendor Management')} />

            <div className="space-y-6">
                {/* Tabs */}
                <div className="flex items-center gap-1 bg-gray-100/50 p-1 rounded-xl w-fit border border-gray-200 shadow-sm">
                    <button
                        onClick={() => setActiveTab('vendors')}
                        className={cls(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                            activeTab === 'vendors' ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                        )}
                    >
                        <Users className="w-4 h-4" />
                        {trans('Vendors')}
                    </button>
                    <button
                        onClick={() => setActiveTab('currencies')}
                        className={cls(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                            activeTab === 'currencies' ? "bg-white text-orange-600 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                        )}
                    >
                        <Coins className="w-4 h-4" />
                        {trans('Currencies')}
                    </button>
                    <button
                        onClick={() => setActiveTab('payment_terms')}
                        className={cls(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                            activeTab === 'payment_terms' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                        )}
                    >
                        <Clock className="w-4 h-4" />
                        {trans('Payment Terms')}
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6">
                        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="relative group flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder={trans("Search...")}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all font-medium"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            {activeTab === 'vendors' && (
                                <div className="flex items-center gap-2 border border-gray-100 rounded-lg p-1 bg-gray-50/50 shadow-sm">
                                    <button onClick={() => setViewMode('list')} className={cls("p-1.5 rounded-md transition-all", viewMode === 'list' ? 'bg-white shadow text-indigo-600' : 'text-gray-400')}><ListIcon className="w-4 h-4" /></button>
                                    <button onClick={() => setViewMode('grid')} className={cls("p-1.5 rounded-md transition-all", viewMode === 'grid' ? 'bg-white shadow text-indigo-600' : 'text-gray-400')}><LayoutGrid className="w-4 h-4" /></button>
                                </div>
                            )}
                        </div>

                        {activeTab === 'vendors' && (
                            viewMode === 'list' ? (
                                <DataTable data={filteredVendors} columns={vendorColumns} initialSort={{ key: 'name', order: 'asc' }} hideSearch={true} />
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredVendors.map((vendor) => (
                                        <div key={vendor.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all relative group h-full flex flex-col">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Building className="w-4 h-4 text-indigo-600" />
                                                        <span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-widest">{vendor.code}</span>
                                                    </div>
                                                    <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight">{vendor.name}</h3>
                                                </div>
                                                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => { setEditingVendor(vendor); setIsVendorFormOpen(true); }} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all" title={trans("Edit")}><Edit className="w-4 h-4" /></button>
                                                    <button onClick={() => handleDelete('vendors', vendor.id)} className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all" title={trans("Delete")}><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                            <div className="space-y-2.5 mb-6 flex-1 text-sm text-gray-600">
                                                <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-gray-400" /><span className="truncate">{vendor.email || '-'}</span></div>
                                                <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-gray-400" /><span className="line-clamp-1">{vendor.city}, {vendor.country}</span></div>
                                            </div>
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                                                <div className="flex gap-2">
                                                    <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider">{vendor.currency?.code || '-'}</span>
                                                    {vendor.is_pkp && <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">PKP</span>}
                                                </div>
                                                <div className="text-[10px] text-gray-400 font-bold uppercase">{vendor.paymentTerm?.name || '-'}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        )}

                        {activeTab === 'currencies' && (
                            <DataTable data={filteredCurrencies} columns={currencyColumns} hideSearch={true} />
                        )}

                        {activeTab === 'payment_terms' && (
                            <DataTable data={filteredPaymentTerms} columns={paymentTermColumns} hideSearch={true} />
                        )}
                    </div>
                </div>
            </div>

            <VendorForm
                isOpen={isVendorFormOpen}
                onClose={() => setIsVendorFormOpen(false)}
                vendor={editingVendor}
                glAccounts={gl_accounts}
                currencies={currencies}
                paymentTerms={payment_terms}
            />

            <CurrencyForm
                isOpen={isCurrencyFormOpen}
                onClose={() => setIsCurrencyFormOpen(false)}
                currency={editingCurrency}
            />

            <PaymentTermForm
                isOpen={isPaymentTermFormOpen}
                onClose={() => setIsPaymentTermFormOpen(false)}
                paymentTerm={editingPaymentTerm}
            />
        </AuthenticatedLayout>
    );
}
