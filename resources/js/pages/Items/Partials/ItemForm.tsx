import React, { useEffect, useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { X, Save, AlertCircle, Loader2, Plus, Check } from 'lucide-react';

interface Item {
    id: string;
    category_id: string;
    unit_id: string;
    code: string;
    name: string;
    price: number | string;
    stock: number | string;
    description: string | null;
    status: 'active' | 'inactive';
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    item?: Item | null;
    categories: { id: string; name: string }[];
    units: { id: string; name: string; abbreviation: string }[];
}

function cls(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}

export const ItemForm: React.FC<Props> = ({ isOpen, onClose, item, categories, units }) => {
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        category_id: '',
        unit_id: '',
        code: '',
        name: '',
        price: '',
        stock: '0',
        description: '',
        status: 'active' as 'active' | 'inactive',
    });

    // Mini-form states
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isCategoryLoading, setIsCategoryLoading] = useState(false);

    const [isAddingUnit, setIsAddingUnit] = useState(false);
    const [newUnitName, setNewUnitName] = useState('');
    const [newUnitAbbr, setNewUnitAbbr] = useState('');
    const [isUnitLoading, setIsUnitLoading] = useState(false);

    useEffect(() => {
        if (item) {
            setData({
                category_id: item.category_id,
                unit_id: item.unit_id,
                code: item.code,
                name: item.name,
                price: item.price.toString(),
                stock: item.stock.toString(),
                description: item.description || '',
                status: item.status,
            });
        } else {
            reset();
        }
        clearErrors();
        setIsAddingCategory(false);
        setIsAddingUnit(false);
    }, [item, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (item) {
            put(route('items.update', item.id), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        } else {
            post(route('items.store'), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        }
    };

    const handleCreateCategory = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        setIsCategoryLoading(true);
        router.post(route('items.categories.store'), {
            name: newCategoryName
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (page: any) => {
                setIsAddingCategory(false);
                setNewCategoryName('');
                // The categories list will be updated in props automatically
                // We'll try to find the new category ID and select it
                const newCat = page.props.categories.find((c: any) => c.name === newCategoryName);
                if (newCat) setData('category_id', newCat.id);
            },
            onFinish: () => setIsCategoryLoading(false)
        });
    };

    const handleCreateUnit = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!newUnitName.trim() || !newUnitAbbr.trim()) return;

        setIsUnitLoading(true);
        router.post(route('items.units.store'), {
            name: newUnitName,
            abbreviation: newUnitAbbr
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (page: any) => {
                setIsAddingUnit(false);
                setNewUnitName('');
                setNewUnitAbbr('');
                const newU = page.props.units.find((u: any) => u.abbreviation === newUnitAbbr);
                if (newU) setData('unit_id', newU.id);
            },
            onFinish: () => setIsUnitLoading(false)
        });
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[110] transition-opacity"
                onClick={onClose}
            />

            {/* Slide Panel */}
            <div className={cls(
                "fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[120] flex flex-col transition-transform duration-300 transform",
                isOpen ? "translate-x-0" : "translate-x-full"
            )}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">{item ? 'Edit Barang' : 'Tambah Barang Baru'}</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Lengkapi detail informasi barang di bawah ini.</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Basic Info Section */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Kode Barang</label>
                                <input
                                    type="text"
                                    className={cls(
                                        "w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm focus:ring-2 transition-all",
                                        errors.code ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:ring-indigo-100 focus:border-indigo-400"
                                    )}
                                    placeholder="SKU-XXX"
                                    value={data.code}
                                    onChange={e => setData('code', e.target.value)}
                                />
                                {errors.code && <p className="text-[10px] text-red-500 font-medium">{errors.code}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Status</label>
                                <select
                                    className="w-full px-3 py-2 bg-gray-50 border-gray-200 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value as any)}
                                >
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Non-aktif</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Nama Barang</label>
                            <input
                                type="text"
                                className={cls(
                                    "w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm focus:ring-2 transition-all",
                                    errors.name ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:ring-indigo-100 focus:border-indigo-400"
                                )}
                                placeholder="Misal: Monitor Dell 24 Inch"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                            />
                            {errors.name && <p className="text-[10px] text-red-500 font-medium">{errors.name}</p>}
                        </div>

                        {/* Kategori */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Kategori</label>
                                <button
                                    type="button"
                                    onClick={() => setIsAddingCategory(!isAddingCategory)}
                                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 uppercase tracking-tight"
                                >
                                    {isAddingCategory ? <X className="w-2.5 h-2.5" /> : <Plus className="w-2.5 h-2.5" />}
                                    {isAddingCategory ? 'Batal' : 'Kategori Baru'}
                                </button>
                            </div>

                            {isAddingCategory ? (
                                <div className="flex gap-2 animate-in slide-in-from-top-1 duration-200">
                                    <input
                                        type="text"
                                        autoFocus
                                        placeholder="Nama kategori..."
                                        className="flex-1 px-3 py-1.5 bg-indigo-50/30 border-indigo-200 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
                                        value={newCategoryName}
                                        onChange={e => setNewCategoryName(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleCreateCategory(e as any)}
                                    />
                                    <button
                                        type="button"
                                        disabled={isCategoryLoading || !newCategoryName.trim()}
                                        onClick={handleCreateCategory}
                                        className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-sm"
                                    >
                                        {isCategoryLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                    </button>
                                </div>
                            ) : (
                                <select
                                    className={cls(
                                        "w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm focus:ring-2 transition-all",
                                        errors.category_id ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:ring-indigo-100 focus:border-indigo-400"
                                    )}
                                    value={data.category_id}
                                    onChange={e => setData('category_id', e.target.value)}
                                >
                                    <option value="">Pilih Kategori</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            )}
                            {errors.category_id && !isAddingCategory && <p className="text-[10px] text-red-500 font-medium">{errors.category_id}</p>}
                        </div>

                        {/* Satuan */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Satuan</label>
                                <button
                                    type="button"
                                    onClick={() => setIsAddingUnit(!isAddingUnit)}
                                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 uppercase tracking-tight"
                                >
                                    {isAddingUnit ? <X className="w-2.5 h-2.5" /> : <Plus className="w-2.5 h-2.5" />}
                                    {isAddingUnit ? 'Batal' : 'Satuan Baru'}
                                </button>
                            </div>

                            {isAddingUnit ? (
                                <div className="space-y-2 p-3 bg-indigo-50/30 border border-indigo-100 rounded-lg animate-in slide-in-from-top-1 duration-200">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            autoFocus
                                            placeholder="Nama (Misal: Kilogram)"
                                            className="flex-1 px-3 py-1.5 bg-white border-gray-200 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
                                            value={newUnitName}
                                            onChange={e => setNewUnitName(e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Abbr (Kg)"
                                            className="w-20 px-3 py-1.5 bg-white border-gray-200 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
                                            value={newUnitAbbr}
                                            onChange={e => setNewUnitAbbr(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            disabled={isUnitLoading || !newUnitName.trim() || !newUnitAbbr.trim()}
                                            onClick={handleCreateUnit}
                                            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-sm"
                                        >
                                            {isUnitLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <select
                                    className={cls(
                                        "w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm focus:ring-2 transition-all",
                                        errors.unit_id ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:ring-indigo-100 focus:border-indigo-400"
                                    )}
                                    value={data.unit_id}
                                    onChange={e => setData('unit_id', e.target.value)}
                                >
                                    <option value="">Pilih Satuan</option>
                                    {units.map(u => (
                                        <option key={u.id} value={u.id}>{u.name} ({u.abbreviation})</option>
                                    ))}
                                </select>
                            )}
                            {errors.unit_id && !isAddingUnit && <p className="text-[10px] text-red-500 font-medium">{errors.unit_id}</p>}
                        </div>
                    </div>

                    <div className="h-px bg-gray-100" />

                    {/* Pricing & Stock Section */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Harga (Rp)</label>
                                <input
                                    type="number"
                                    className={cls(
                                        "w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm focus:ring-2 transition-all font-mono",
                                        errors.price ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:ring-indigo-100 focus:border-indigo-400"
                                    )}
                                    placeholder="0"
                                    value={data.price}
                                    onChange={e => setData('price', e.target.value)}
                                />
                                {errors.price && <p className="text-[10px] text-red-500 font-medium">{errors.price}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Stok Awal</label>
                                <input
                                    type="number"
                                    className={cls(
                                        "w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm focus:ring-2 transition-all font-mono",
                                        errors.stock ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:ring-indigo-100 focus:border-indigo-400"
                                    )}
                                    placeholder="0"
                                    value={data.stock}
                                    onChange={e => setData('stock', e.target.value)}
                                />
                                {errors.stock && <p className="text-[10px] text-red-500 font-medium">{errors.stock}</p>}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Keterangan</label>
                            <textarea
                                className="w-full px-3 py-2 bg-gray-50 border-gray-200 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all resize-none h-24"
                                placeholder="Opsional..."
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                            />
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-white">
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-semibold"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={processing}
                            className="flex-[2] px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-semibold flex items-center justify-center gap-2"
                        >
                            {processing ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            {item ? 'Simpan Perubahan' : 'Simpan Barang'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

