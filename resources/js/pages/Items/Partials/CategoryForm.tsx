import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { X, Save, Loader2 } from 'lucide-react';

interface Category {
    id: string;
    name: string;
    description: string | null;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    category?: Category | null;
}

function cls(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}

export const CategoryForm: React.FC<Props> = ({ isOpen, onClose, category }) => {
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        description: '',
    });

    useEffect(() => {
        if (category) {
            setData({
                name: category.name,
                description: category.description || '',
            });
        } else {
            reset();
        }
        clearErrors();
    }, [category, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (category) {
            put(route('items.categories.update', category.id), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        } else {
            post(route('items.categories.store'), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[110]" onClick={onClose} />
            <div className={cls(
                "fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[120] flex flex-col transition-transform duration-300 transform",
                isOpen ? "translate-x-0" : "translate-x-full"
            )}>
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">{category ? 'Edit Kategori' : 'Tambah Kategori Baru'}</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Kelola kategori pengelompokan barang Anda.</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Nama Kategori</label>
                        <input
                            type="text"
                            className={cls(
                                "w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm focus:ring-2 transition-all",
                                errors.name ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:ring-indigo-100 focus:border-indigo-400"
                            )}
                            placeholder="Misal: Elektronik, Alat Tulis"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                        />
                        {errors.name && <p className="text-[10px] text-red-500 font-medium">{errors.name}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Keterangan</label>
                        <textarea
                            className="w-full px-3 py-2 bg-gray-50 border-gray-200 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all resize-none h-32"
                            placeholder="Deskripsi singkat kategori..."
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                        />
                    </div>
                </form>

                <div className="p-6 border-t border-gray-100 bg-white">
                    <div className="flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-semibold">
                            Batal
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={processing}
                            className="flex-[2] px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-semibold flex items-center justify-center gap-2"
                        >
                            {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {category ? 'Update Kategori' : 'Simpan Kategori'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
