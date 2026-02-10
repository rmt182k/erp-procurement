import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import {
    Package,
    Plus,
    Edit,
    Trash2,
    LayoutGrid,
    List as ListIcon,
    Tags,
    Ruler,
    Search
} from 'lucide-react';
import { ItemForm } from './Partials/ItemForm';
import { CategoryForm } from './Partials/CategoryForm';
import { UnitForm } from './Partials/UnitForm';
import { DataTable, Column } from '@/Components/DataTable';

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
    category: { name: string };
    unit: { name: string; abbreviation: string };
}

interface ItemCategory {
    id: string;
    name: string;
    description: string | null;
}

interface ItemUnit {
    id: string;
    name: string;
    abbreviation: string;
}

interface Props {
    items: Item[];
    categories: ItemCategory[];
    units: ItemUnit[];
    filters: { search?: string; category?: string };
}

function cls(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}

type TabType = 'barang' | 'kategori' | 'satuan';

export default function Index({ items, categories, units, filters }: Props) {
    const [activeTab, setActiveTab] = useState<TabType>('barang');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

    // Items Form State
    const [isItemFormOpen, setIsItemFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Item | null>(null);

    // Category Form State
    const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<ItemCategory | null>(null);

    // Unit Form State
    const [isUnitFormOpen, setIsUnitFormOpen] = useState(false);
    const [editingUnit, setEditingUnit] = useState<ItemUnit | null>(null);

    const handleDeleteItem = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus barang ini?')) {
            router.delete(route('items.destroy', id), { preserveScroll: true });
        }
    };

    const handleDeleteCategory = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
            router.delete(route('items.categories.destroy', id), { preserveScroll: true });
        }
    };

    const handleDeleteUnit = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus satuan ini?')) {
            router.delete(route('items.units.destroy', id), { preserveScroll: true });
        }
    };

    // --- Column Definitions ---

    const itemColumns: Column<Item>[] = [
        {
            header: "Info Barang",
            key: 'name',
            sortable: true,
            render: (item) => (
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900">{item.name}</span>
                    <span className="text-xs text-gray-500 font-mono mt-0.5">{item.code} • {item.category?.name}</span>
                </div>
            )
        },
        {
            header: "Harga",
            key: 'price',
            sortable: true,
            align: 'right',
            className: 'whitespace-nowrap',
            render: (item) => `Rp ${Number(item.price).toLocaleString('id-ID')}`
        },
        {
            header: "Stok",
            key: 'stock',
            sortable: true,
            align: 'center',
            className: 'whitespace-nowrap',
            render: (item) => `${item.stock} ${item.unit?.abbreviation}`
        },
        {
            header: "Status",
            key: 'status',
            className: 'whitespace-nowrap',
            render: (item) => (
                <span className={cls(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                    item.status === 'active' ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"
                )}>
                    {item.status === 'active' ? 'Aktif' : 'Non-aktif'}
                </span>
            )
        },
        {
            header: "",
            align: 'right',
            className: 'w-0 whitespace-nowrap',
            headerClassName: 'w-0',
            render: (item) => (
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingItem(item); setIsItemFormOpen(true); }} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteItem(item.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
            )
        }
    ];

    const categoryColumns: Column<ItemCategory>[] = [
        { header: "Nama Kategori", key: 'name', sortable: true, className: 'font-semibold' },
        { header: "Keterangan", key: 'description' },
        {
            header: "",
            align: 'right',
            className: 'w-0 whitespace-nowrap',
            headerClassName: 'w-0',
            render: (cat) => (
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingCategory(cat); setIsCategoryFormOpen(true); }} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteCategory(cat.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
            )
        }
    ];

    const unitColumns: Column<ItemUnit>[] = [
        { header: "Nama Satuan", key: 'name', sortable: true, className: 'font-semibold' },
        { header: "Singkatan", key: 'abbreviation', align: 'center', className: 'font-mono whitespace-nowrap' },
        {
            header: "",
            align: 'right',
            className: 'w-0 whitespace-nowrap',
            headerClassName: 'w-0',
            render: (unit) => (
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingUnit(unit); setIsUnitFormOpen(true); }} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteUnit(unit.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
            )
        }
    ];

    const filteredByCatItems = items.filter(i => !selectedCategory || i.category_id === selectedCategory);

    const TabButton = ({ type, label, icon: Icon }: { type: TabType, label: string, icon: any }) => (
        <button
            onClick={() => setActiveTab(type)}
            className={cls(
                "flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 transition-all",
                activeTab === type
                    ? "border-indigo-600 text-indigo-600 bg-indigo-50/30"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            )}
        >
            <Icon className="w-4 h-4" />
            {label}
        </button>
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight flex items-center gap-2">
                        <Package className="w-6 h-6 text-indigo-600" />
                        Master Barang
                    </h2>

                    <button
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm text-sm font-semibold"
                        onClick={() => {
                            if (activeTab === 'barang') { setEditingItem(null); setIsItemFormOpen(true); }
                            if (activeTab === 'kategori') { setEditingCategory(null); setIsCategoryFormOpen(true); }
                            if (activeTab === 'satuan') { setEditingUnit(null); setIsUnitFormOpen(true); }
                        }}
                    >
                        <Plus className="w-4 h-4" />
                        Tambah {activeTab === 'barang' ? 'Barang' : activeTab === 'kategori' ? 'Kategori' : 'Satuan'}
                    </button>
                </div>
            }
        >
            <Head title="Master Barang" />

            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex border-b border-gray-100">
                        <TabButton type="barang" label="Daftar Barang" icon={Package} />
                        <TabButton type="kategori" label="Kelola Kategori" icon={Tags} />
                        <TabButton type="satuan" label="Kelola Satuan" icon={Ruler} />
                    </div>

                    <div className="p-6">
                        {activeTab === 'barang' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                {viewMode === 'list' ? (
                                    <DataTable
                                        data={filteredByCatItems}
                                        columns={itemColumns}
                                        searchPlaceholder="Cari nama atau kode barang..."
                                        searchKeys={['name', 'code']}
                                        initialSort={{ key: 'name', order: 'asc' }}
                                        headerExtra={
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-2 border border-gray-100 rounded-lg p-1 bg-gray-50/50 shadow-sm">
                                                    <button onClick={() => setViewMode('list')} className="p-1.5 rounded-md transition-all bg-white shadow text-indigo-600" title="Tampilan List"><ListIcon className="w-4 h-4" /></button>
                                                    <button onClick={() => setViewMode('grid')} className="p-1.5 rounded-md transition-all text-gray-400" title="Tampilan Grid"><LayoutGrid className="w-4 h-4" /></button>
                                                </div>
                                                <select
                                                    className="text-sm bg-gray-50/50 border-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 min-w-[150px] py-2 font-medium text-gray-700 shadow-sm"
                                                    value={selectedCategory}
                                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                                >
                                                    <option value="">Semua Kategori</option>
                                                    {categories.map(cat => (
                                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        }
                                    />
                                ) : (
                                    <div className="space-y-6">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="relative group flex-1 max-w-md">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-indigo-500 transition-colors" />
                                                <input
                                                    type="text"
                                                    placeholder="Cari nama atau kode barang..."
                                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all font-medium"
                                                />
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-2 border border-gray-100 rounded-lg p-1 bg-gray-50/50 shadow-sm">
                                                    <button onClick={() => setViewMode('list')} className="p-1.5 rounded-md transition-all text-gray-400"><ListIcon className="w-4 h-4" /></button>
                                                    <button onClick={() => setViewMode('grid')} className="p-1.5 rounded-md transition-all bg-white shadow text-indigo-600"><LayoutGrid className="w-4 h-4" /></button>
                                                </div>
                                                <select
                                                    className="text-sm bg-gray-50/50 border-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 min-w-[150px] py-2 font-medium text-gray-700 shadow-sm"
                                                    value={selectedCategory}
                                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                                >
                                                    <option value="">Semua Kategori</option>
                                                    {categories.map(cat => (
                                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all">
                                            {filteredByCatItems.map(item => (
                                                <div key={item.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Package className="w-6 h-6" /></div>
                                                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => { setEditingItem(item); setIsItemFormOpen(true); }} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                                                            <button onClick={() => handleDeleteItem(item.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                                        </div>
                                                    </div>
                                                    <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                                                    <p className="text-xs text-gray-500 font-mono mb-4">{item.code}</p>
                                                    <div className="flex justify-between text-xs pt-3 border-t border-gray-50">
                                                        <span className="font-mono">Rp {Number(item.price).toLocaleString('id-ID')}</span>
                                                        <span className="font-medium">{item.stock} {item.unit?.abbreviation}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'kategori' && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <DataTable
                                    data={categories}
                                    columns={categoryColumns}
                                    searchPlaceholder="Cari nama kategori..."
                                    initialSort={{ key: 'name', order: 'asc' }}
                                />
                            </div>
                        )}

                        {activeTab === 'satuan' && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <DataTable
                                    data={units}
                                    columns={unitColumns}
                                    searchPlaceholder="Cari nama atau singkatan satuan..."
                                    searchKeys={['name', 'abbreviation']}
                                    initialSort={{ key: 'name', order: 'asc' }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Forms */}
            <ItemForm isOpen={isItemFormOpen} onClose={() => setIsItemFormOpen(false)} item={editingItem} categories={categories} units={units} />
            <CategoryForm isOpen={isCategoryFormOpen} onClose={() => setIsCategoryFormOpen(false)} category={editingCategory} />
            <UnitForm isOpen={isUnitFormOpen} onClose={() => setIsUnitFormOpen(false)} unit={editingUnit} />
        </AuthenticatedLayout>
    );
}
