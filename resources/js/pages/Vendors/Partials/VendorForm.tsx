import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useTrans } from '@/hooks/useTrans';
import { Building2, CreditCard, Landmark, ReceiptText } from 'lucide-react';

interface GLAccount {
    id: number;
    code: string;
    name: string;
}

interface Currency {
    id: number;
    code: string;
    name: string;
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
    bank_name: string | null;
    bank_account_number: string | null;
    bank_holder_name: string | null;
    payable_account_id: number | null;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    vendor?: Vendor | null;
    glAccounts: GLAccount[];
    currencies: Currency[];
    paymentTerms: PaymentTerm[];
}

export function VendorForm({ isOpen, onClose, vendor, glAccounts, currencies, paymentTerms }: Props) {
    const { trans } = useTrans();
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        phone: '',
        address_line1: '',
        address_line2: '',
        city: '',
        postal_code: '',
        country: 'ID',
        tax_id: '',
        is_pkp: false,
        currency_id: '' as string | number,
        payment_term_id: '' as string | number,
        bank_name: '',
        bank_account_number: '',
        bank_holder_name: '',
        payable_account_id: '' as string | number,
    });

    useEffect(() => {
        if (vendor) {
            setData({
                name: vendor.name,
                email: vendor.email || '',
                phone: vendor.phone || '',
                address_line1: vendor.address_line1,
                address_line2: vendor.address_line2 || '',
                city: vendor.city,
                postal_code: vendor.postal_code,
                country: vendor.country,
                tax_id: vendor.tax_id || '',
                is_pkp: vendor.is_pkp,
                currency_id: vendor.currency_id || '',
                payment_term_id: vendor.payment_term_id || '',
                bank_name: vendor.bank_name || '',
                bank_account_number: vendor.bank_account_number || '',
                bank_holder_name: vendor.bank_holder_name || '',
                payable_account_id: vendor.payable_account_id || '',
            });
        } else {
            reset();
            // Set defaults if lists are not empty
            if (currencies.length > 0) setData('currency_id', currencies[0].id);
            if (paymentTerms.length > 0) setData('payment_term_id', paymentTerms[0].id);
        }
        clearErrors();
    }, [vendor, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (vendor) {
            put(route('vendors.update', vendor.id), {
                onSuccess: () => onClose(),
            });
        } else {
            post(route('vendors.store'), {
                onSuccess: () => onClose(),
            });
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="4xl">
            <form onSubmit={handleSubmit} className="p-6">
                <div className="flex items-center gap-2 mb-6 border-b pb-4">
                    <Building2 className="w-6 h-6 text-indigo-600" />
                    <h2 className="text-lg font-bold text-gray-900">
                        {vendor ? trans('Edit Vendor') : trans('Add Vendor')}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Identity & Address */}
                    <div className="space-y-6">
                        <section>
                            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <ReceiptText className="w-4 h-4" />
                                {trans('General Info')}
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <InputLabel htmlFor="name" value={trans('Vendor Name')} />
                                    <TextInput
                                        id="name"
                                        className="mt-1 block w-full"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="email" value={trans('Email')} />
                                        <TextInput
                                            id="email"
                                            type="email"
                                            className="mt-1 block w-full"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                        />
                                        <InputError message={errors.email} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="phone" value={trans('Phone')} />
                                        <TextInput
                                            id="phone"
                                            className="mt-1 block w-full"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                        />
                                        <InputError message={errors.phone} className="mt-2" />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">{trans('Address')}</h3>
                            <div className="space-y-4">
                                <div>
                                    <InputLabel htmlFor="address_line1" value={trans('Address Line 1')} />
                                    <TextInput
                                        id="address_line1"
                                        className="mt-1 block w-full"
                                        value={data.address_line1}
                                        onChange={(e) => setData('address_line1', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.address_line1} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="address_line2" value={trans('Address Line 2')} />
                                    <TextInput
                                        id="address_line2"
                                        className="mt-1 block w-full"
                                        value={data.address_line2}
                                        onChange={(e) => setData('address_line2', e.target.value)}
                                    />
                                    <InputError message={errors.address_line2} className="mt-2" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="city" value={trans('City')} />
                                        <TextInput
                                            id="city"
                                            className="mt-1 block w-full"
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.city} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="postal_code" value={trans('Postal Code')} />
                                        <TextInput
                                            id="postal_code"
                                            className="mt-1 block w-full"
                                            value={data.postal_code}
                                            onChange={(e) => setData('postal_code', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.postal_code} className="mt-2" />
                                    </div>
                                </div>
                                <div>
                                    <InputLabel htmlFor="country" value={trans('Country')} />
                                    <select
                                        id="country"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        value={data.country}
                                        onChange={(e) => setData('country', e.target.value)}
                                        required
                                    >
                                        <option value="ID">Indonesia</option>
                                        <option value="US">United States</option>
                                        <option value="SG">Singapore</option>
                                    </select>
                                    <InputError message={errors.country} className="mt-2" />
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Financial & Bank */}
                    <div className="space-y-6">
                        <section>
                            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Landmark className="w-4 h-4" />
                                {trans('Financial Profile')}
                            </h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="tax_id" value={trans('Tax ID (NPWP)')} />
                                        <TextInput
                                            id="tax_id"
                                            className="mt-1 block w-full"
                                            value={data.tax_id}
                                            onChange={(e) => setData('tax_id', e.target.value)}
                                        />
                                        <InputError message={errors.tax_id} className="mt-2" />
                                    </div>
                                    <div className="flex items-end pb-2">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                                checked={data.is_pkp}
                                                onChange={(e) => setData('is_pkp', e.target.checked)}
                                            />
                                            <span className="ms-2 text-sm text-gray-600">{trans('Is PKP?')}</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="currency_id" value={trans('Default Currency')} />
                                        <select
                                            id="currency_id"
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            value={data.currency_id}
                                            onChange={(e) => setData('currency_id', e.target.value)}
                                            required
                                        >
                                            <option value="">{trans('Select Currency')}</option>
                                            {currencies.map((c) => (
                                                <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                                            ))}
                                        </select>
                                        <InputError message={errors.currency_id} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="payment_term_id" value={trans('Payment Terms')} />
                                        <select
                                            id="payment_term_id"
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            value={data.payment_term_id}
                                            onChange={(e) => setData('payment_term_id', e.target.value)}
                                            required
                                        >
                                            <option value="">{trans('Select Term')}</option>
                                            {paymentTerms.map((p) => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </select>
                                        <InputError message={errors.payment_term_id} className="mt-2" />
                                    </div>
                                </div>
                                <div>
                                    <InputLabel htmlFor="payable_account_id" value={trans('Payable Account')} />
                                    <select
                                        id="payable_account_id"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        value={data.payable_account_id}
                                        onChange={(e) => setData('payable_account_id', e.target.value)}
                                    >
                                        <option value="">{trans('Select Account')}</option>
                                        {glAccounts.map((account) => (
                                            <option key={account.id} value={account.id}>
                                                {account.code} - {account.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.payable_account_id} className="mt-2" />
                                </div>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <CreditCard className="w-4 h-4" />
                                {trans('Bank Details')}
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <InputLabel htmlFor="bank_name" value={trans('Bank Name')} />
                                    <TextInput
                                        id="bank_name"
                                        className="mt-1 block w-full"
                                        value={data.bank_name}
                                        onChange={(e) => setData('bank_name', e.target.value)}
                                    />
                                    <InputError message={errors.bank_name} className="mt-2" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-1">
                                        <InputLabel htmlFor="bank_account_number" value={trans('Bank Account Number')} />
                                        <TextInput
                                            id="bank_account_number"
                                            className="mt-1 block w-full font-mono"
                                            value={data.bank_account_number}
                                            onChange={(e) => setData('bank_account_number', e.target.value)}
                                        />
                                        <InputError message={errors.bank_account_number} className="mt-2" />
                                    </div>
                                    <div className="col-span-1">
                                        <InputLabel htmlFor="bank_holder_name" value={trans('Bank Holder Name')} />
                                        <TextInput
                                            id="bank_holder_name"
                                            className="mt-1 block w-full"
                                            value={data.bank_holder_name}
                                            onChange={(e) => setData('bank_holder_name', e.target.value)}
                                        />
                                        <InputError message={errors.bank_holder_name} className="mt-2" />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3 border-t pt-6">
                    <SecondaryButton onClick={onClose} type="button">{trans('Cancel')}</SecondaryButton>
                    <PrimaryButton className="ms-3" disabled={processing}>
                        {trans('Save')}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
