import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useTrans } from '@/hooks/useTrans';
import { ShieldCheck, Info, CheckCircle2, Circle } from 'lucide-react';

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
    label: string;
    permissions: Permission[];
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    role: Role | null;
    permissions: Permission[];
}

export function RoleForm({ isOpen, onClose, role, permissions }: Props) {
    const { trans } = useTrans();
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        label: '',
        permissions: [] as number[],
    });

    useEffect(() => {
        if (isOpen) {
            if (role) {
                setData({
                    name: role.name,
                    label: role.label,
                    permissions: role.permissions.map(p => p.id),
                });
            } else {
                reset();
            }
            clearErrors();
        }
    }, [isOpen, role]);

    const togglePermission = (id: number) => {
        const current = [...data.permissions];
        const index = current.indexOf(id);
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(id);
        }
        setData('permissions', current);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (role) {
            put(route('roles.update', role.id), {
                onSuccess: () => onClose(),
            });
        } else {
            post(route('roles.store'), {
                onSuccess: () => onClose(),
            });
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="2xl">
            <form onSubmit={submit} className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <ShieldCheck className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">
                            {role ? trans('Edit Role') : trans('Add Role')}
                        </h2>
                        <p className="text-xs text-gray-500">
                            {trans('Define access rights for this security group.')}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div>
                        <InputLabel htmlFor="label" value={trans('Role Display Name')} />
                        <TextInput
                            id="label"
                            className="mt-1 block w-full"
                            value={data.label}
                            onChange={(e) => setData('label', e.target.value)}
                            required
                            placeholder="e.g. Procurement Manager"
                        />
                        <InputError message={errors.label} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="name" value={trans('Role Key (Slug)')} />
                        <TextInput
                            id="name"
                            className="mt-1 block w-full bg-gray-50/50"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                            required
                            placeholder="e.g. proc_manager"
                            disabled={!!role}
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Info className="w-3 h-3 text-indigo-400" />
                            {trans('Granular Permissions')}
                        </h3>
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                            {data.permissions.length} {trans('Selected')}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {permissions.map(p => {
                            const isSelected = data.permissions.includes(p.id);
                            return (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => togglePermission(p.id)}
                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left group ${isSelected
                                            ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                                            : 'bg-white border-gray-100 hover:border-indigo-100'
                                        }`}
                                >
                                    {isSelected ? (
                                        <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                                    ) : (
                                        <Circle className="w-5 h-5 text-gray-100 group-hover:text-indigo-100 shrink-0" />
                                    )}
                                    <div className="flex flex-col overflow-hidden">
                                        <span className={`text-xs font-bold leading-tight ${isSelected ? 'text-indigo-900' : 'text-gray-700'}`}>
                                            {p.name.split('.').pop()?.replace('_', ' ').toUpperCase()}
                                        </span>
                                        <span className="text-[10px] text-gray-400 font-mono truncate">
                                            {p.name}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
                    <SecondaryButton onClick={onClose}>{trans('Cancel')}</SecondaryButton>
                    <PrimaryButton disabled={processing} className="px-8 font-black">
                        {role ? trans('Update Role') : trans('Create Role')}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
