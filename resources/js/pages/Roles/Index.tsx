import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { DataTable, Column } from '@/Components/DataTable';
import { ShieldCheck, Plus, Search, Key, Users, Settings } from 'lucide-react';
import { useTrans } from '@/hooks/useTrans';
import { RoleForm } from './Partials/RoleForm';

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
    roles: Role[];
    permissions: Permission[];
}

export default function Index({ roles, permissions }: Props) {
    const { trans } = useTrans();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleEdit = (role: Role) => {
        setSelectedRole(role);
        setIsFormOpen(true);
    };

    const columns: Column<Role>[] = [
        {
            header: trans("Role Name"),
            key: 'label',
            render: (r) => (
                <div className="flex flex-col">
                    <span className="font-bold text-gray-900">{r.label}</span>
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-tighter">{r.name}</span>
                </div>
            )
        },
        {
            header: trans("Permissions"),
            key: 'permissions',
            render: (r) => (
                <div className="flex flex-wrap gap-1 transition-all duration-300">
                    {r.permissions.length > 0 ? (
                        <>
                            {r.permissions.slice(0, 3).map(p => (
                                <span key={p.id} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold border border-indigo-100 uppercase tracking-tight">
                                    {p.name.replace('.', ' ')}
                                </span>
                            ))}
                            {r.permissions.length > 3 && (
                                <span className="px-2 py-0.5 bg-gray-50 text-gray-400 rounded text-[10px] font-bold border border-gray-100">
                                    +{r.permissions.length - 3} more
                                </span>
                            )}
                        </>
                    ) : (
                        <span className="text-gray-300 italic text-[10px]">{trans('No permissions assigned')}</span>
                    )}
                </div>
            )
        },
        {
            header: trans("Actions"),
            key: 'id',
            align: 'right',
            render: (r) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => handleEdit(r)}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    >
                        <Settings className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    const filteredRoles = roles.filter(r =>
        r.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-lg">
                            <ShieldCheck className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="font-bold text-xl text-gray-900 leading-tight">
                                {trans('Roles & Permissions')}
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {trans('Manage security groups and their access rights.')}
                            </p>
                        </div>
                    </div>
                    <button
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm text-sm font-semibold"
                        onClick={() => {
                            setSelectedRole(null);
                            setIsFormOpen(true);
                        }}
                    >
                        <Plus className="w-4 h-4" />
                        {trans('Add Role')}
                    </button>
                </div>
            }
        >
            <Head title={trans('Roles & Permissions')} />

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{trans('Total Roles')}</span>
                            <Users className="w-5 h-5 text-gray-200" />
                        </div>
                        <p className="text-2xl font-black text-gray-900 mt-2">{roles.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{trans('Avg Permissions')}</span>
                            <Key className="w-5 h-5 text-gray-200" />
                        </div>
                        <p className="text-2xl font-black text-gray-900 mt-2">
                            {roles.length > 0 ? (roles.reduce((sum, r) => sum + r.permissions.length, 0) / roles.length).toFixed(1) : 0}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{trans('System Health')}</span>
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <p className="text-2xl font-black text-emerald-500 mt-2 font-mono uppercase tracking-tighter">SECURED</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                        <div className="relative group max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                placeholder={trans("Search roles...")}
                                className="w-full pl-10 pr-4 py-2 bg-white border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="p-6">
                        <DataTable
                            data={filteredRoles}
                            columns={columns}
                            hideSearch={true}
                        />
                    </div>
                </div>
            </div>

            <RoleForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                role={selectedRole}
                permissions={permissions}
            />
        </AuthenticatedLayout>
    );
}
