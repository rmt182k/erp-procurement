import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { X, Save, Loader2 } from 'lucide-react';

interface Unit {
    id: string;
    name: string;
    abbreviation: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    unit?: Unit | null;
}

function cls(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}

export const UnitForm: React.FC<Props> = ({ isOpen, onClose, unit }) => {
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        abbreviation: '',
    });

    useEffect(() => {
        if (unit) {
            setData({
                name: unit.name,
                abbreviation: unit.abbreviation,
            });
        } else {
            reset();
        }
        clearErrors();
    }, [unit, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (unit) {
            put(route('items.units.update', unit.id), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        } else {
            post(route('items.units.store'), {
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
                        <h2 className="text-lg font-bold text-gray-900">{unit ? 'Edit Satuan' : 'Tambah Satuan Baru'}</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Kelola unit satuan pengukuran barang Anda.</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Nama Satuan</label>
                            <input
                                type="text"
                                className={cls(
                                    "w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm focus:ring-2 transition-all",
                                    errors.name ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:ring-indigo-100 focus:border-indigo-400"
                                )}
                                placeholder="Misal: Kilogram, Pack, Unit"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                            />
                            {errors.name && <p className="text-[10px] text-red-500 font-medium">{errors.name}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Singkatan</label>
                            <input
                                type="text"
                                className={cls(
                                    "w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm focus:ring-2 transition-all font-mono",
                                    errors.abbreviation ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:ring-indigo-100 focus:border-indigo-400"
                                )}
                                placeholder="Misal: Kg, Pcs, Box"
                                value={data.abbreviation}
                                onChange={e => setData('abbreviation', e.target.value)}
                            />
                            {errors.abbreviation && <p className="text-[10px] text-red-500 font-medium">{errors.abbreviation}</p>}
                        </div>
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
                            {unit ? 'Update Satuan' : 'Simpan Satuan'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
