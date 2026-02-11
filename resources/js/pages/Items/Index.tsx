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
    Search,
    Box
} from 'lucide-react';
import { useTrans } from '@/hooks/useTrans';
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

type TabType = 'items' | 'categories' | 'units';

export default function Index({ items, categories, units, filters }: Props) {
    const { trans } = useTrans();
    const [activeTab, setActiveTab] = useState<TabType>('items');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    // Form States
    const [isItemFormOpen, setIsItemFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Item | null>(null);

    const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<ItemCategory | null>(null);

    const [isUnitFormOpen, setIsUnitFormOpen] = useState(false);
    const [editingUnit, setEditingUnit] = useState<ItemUnit | null>(null);

    const handleDelete = (type: TabType, id: string) => {
        let routeName = '';
        let confirmMsg = '';

        switch (type) {
            case 'items': routeName = 'items.destroy'; confirmMsg = trans('Are you sure you want to delete this item?'); break;
            case 'categories': routeName = 'items.categories.destroy'; confirmMsg = trans('Are you sure you want to delete this category?'); break;
            case 'units': routeName = 'items.units.destroy'; confirmMsg = trans('Are you sure you want to delete this unit?'); break;
        }

        if (confirm(confirmMsg)) {
            router.delete(route(routeName, id), { preserveScroll: true });
        }
    };

    const itemColumns: Column<Item>[] = [
        {
            header: trans("Item Info"),
            key: 'name',
            sortable: true,
            render: (item) => (
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900">{item.name}</span>
                    <span className="text-xs text-gray-500 font-mono mt-0.5 uppercase tracking-tight">
                        {item.code} • {item.category?.name}
                    </span>
                </div>
            )
        },
        {
            header: trans("Price"),
            key: 'price',
            sortable: true,
            align: 'right',
            render: (item) => <span className="font-mono text-xs font-bold">Rp {Number(item.price).toLocaleString('id-ID')}</span>
        },
        {
            header: trans("Stock"),
            key: 'stock',
            sortable: true,
            align: 'center',
            render: (item) => (
                <div className="flex flex-col items-center">
                    <span className="font-bold text-gray-900">{item.stock}</span>
                    <span className="text-[10px] text-gray-400 uppercase font-bold">{item.unit?.abbreviation}</span>
                </div>
            )
        },
        {
            header: trans("Status"),
            key: 'status',
            align: 'center',
            render: (item) => (
                <span className={cls(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                    item.status === 'active' ? "bg-emerald-50 text-emerald-700" : "bg-gray-50 text-gray-500"
                )}>
                    {item.status === 'active' ? trans('Active') : trans('Inactive')}
                </span>
            )
        },
        {
            header: "",
            align: 'right',
            className: 'w-0 whitespace-nowrap',
            render: (item) => (
                <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => { setEditingItem(item); setIsItemFormOpen(true); }}
                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete('items', item.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    const categoryColumns: Column<ItemCategory>[] = [
        {
            header: trans("Category Name"),
            key: 'name',
            sortable: true,
            className: 'font-semibold text-gray-900',
        },
        {
            header: trans("Description"),
            key: 'description',
            render: (cat) => <span className="text-gray-500 text-sm">{cat.description || '-'}</span>
        },
        {
            header: "",
            align: 'right',
            className: 'w-0 whitespace-nowrap',
            render: (cat) => (
                <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingCategory(cat); setIsCategoryFormOpen(true); }} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete('categories', cat.id)} className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
            )
        }
    ];

    const unitColumns: Column<ItemUnit>[] = [
        {
            header: trans("Unit Name"),
            key: 'name',
            sortable: true,
            className: 'font-semibold text-gray-900',
        },
        {
            header: trans("Abbreviation"),
            key: 'abbreviation',
            align: 'center',
            render: (unit) => <span className="px-2 py-1 bg-gray-50 rounded font-mono text-indigo-600 font-bold">{unit.abbreviation}</span>
        },
        {
            header: "",
            align: 'right',
            className: 'w-0 whitespace-nowrap',
            render: (unit) => (
                <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingUnit(unit); setIsUnitFormOpen(true); }} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete('units', unit.id)} className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
            )
        }
    ];

    const filteredItems = items.filter(i =>
        (!selectedCategory || i.category_id === selectedCategory) &&
        (i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            i.code.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredUnits = units.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.abbreviation.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight flex items-center gap-2">
                        <Package className="w-6 h-6 text-indigo-600" />
                        {trans('Master Items')}
                    </h2>

                    <button
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm text-sm font-semibold"
                        onClick={() => {
                            if (activeTab === 'items') { setEditingItem(null); setIsItemFormOpen(true); }
                            if (activeTab === 'categories') { setEditingCategory(null); setIsCategoryFormOpen(true); }
                            if (activeTab === 'units') { setEditingUnit(null); setIsUnitFormOpen(true); }
                        }}
                    >
                        <Plus className="w-4 h-4" />
                        {trans('Add')} {activeTab === 'items' ? trans('Item') : activeTab === 'categories' ? trans('Category') : trans('Unit')}
                    </button>
                </div>
            }
        >
            <Head title={trans('Master Items')} />

            <div className="space-y-6">
                {/* Tabs */}
                <div className="flex items-center gap-1 bg-gray-100/50 p-1 rounded-xl w-fit border border-gray-200 shadow-sm">
                    <button
                        onClick={() => setActiveTab('items')}
                        className={cls(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                            activeTab === 'items' ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                        )}
                    >
                        <Package className="w-4 h-4" />
                        {trans('Items')}
                    </button>
                    <button
                        onClick={() => setActiveTab('categories')}
                        className={cls(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                            activeTab === 'categories' ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                        )}
                    >
                        <Tags className="w-4 h-4" />
                        {trans('Categories')}
                    </button>
                    <button
                        onClick={() => setActiveTab('units')}
                        className={cls(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                            activeTab === 'units' ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                        )}
                    >
                        <Ruler className="w-4 h-4" />
                        {trans('Units')}
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-sm">
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

                            <div className="flex items-center gap-3">
                                {activeTab === 'items' && (
                                    <div className="flex items-center gap-2 border border-gray-100 rounded-lg p-1 bg-gray-50/50 shadow-sm sm:order-2">
                                        <button onClick={() => setViewMode('list')} className={cls("p-1.5 rounded-md transition-all", viewMode === 'list' ? 'bg-white shadow text-indigo-600' : 'text-gray-400')}><ListIcon className="w-4 h-4" /></button>
                                        <button onClick={() => setViewMode('grid')} className={cls("p-1.5 rounded-md transition-all", viewMode === 'grid' ? 'bg-white shadow text-indigo-600' : 'text-gray-400')}><LayoutGrid className="w-4 h-4" /></button>
                                    </div>
                                )}
                                {activeTab === 'items' && (
                                    <select
                                        className="text-sm bg-gray-50/50 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 min-w-[150px] py-2 font-medium text-gray-700 shadow-sm"
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                    >
                                        <option value="">{trans("All Categories")}</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        </div>

                        {activeTab === 'items' && (
                            viewMode === 'list' ? (
                                <DataTable data={filteredItems} columns={itemColumns} initialSort={{ key: 'name', order: 'asc' }} hideSearch={true} />
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredItems.map((item) => (
                                        <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all relative group h-full flex flex-col">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Box className="w-4 h-4 text-indigo-600" />
                                                        <span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-widest">{item.code}</span>
                                                    </div>
                                                    <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight">{item.name}</h3>
                                                </div>
                                                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => { setEditingItem(item); setIsItemFormOpen(true); }} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all" title={trans("Edit")}><Edit className="w-4 h-4" /></button>
                                                    <button onClick={() => handleDelete('items', item.id)} className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all" title={trans("Delete")}><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </div>

                                            <div className="flex-1 mb-6">
                                                <div className="flex items-center flex-wrap gap-2 mt-2">
                                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-lg uppercase">{item.category?.name}</span>
                                                    <span className={cls(
                                                        "px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase",
                                                        item.status === 'active' ? "bg-emerald-50 text-emerald-700" : "bg-gray-50 text-gray-500"
                                                    )}>
                                                        {item.status === 'active' ? trans('Active') : trans('Inactive')}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{trans('Price')}</span>
                                                    <span className="font-bold text-indigo-600">Rp {Number(item.price).toLocaleString('id-ID')}</span>
                                                </div>
                                                <div className="text-right flex flex-col">
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{trans('Stock')}</span>
                                                    <span className="font-bold text-gray-900">{item.stock} <span className="text-[10px] text-gray-500">{item.unit?.abbreviation}</span></span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        )}

                        {activeTab === 'categories' && (
                            <DataTable data={filteredCategories} columns={categoryColumns} hideSearch={true} />
                        )}

                        {activeTab === 'units' && (
                            <DataTable data={filteredUnits} columns={unitColumns} hideSearch={true} />
                        )}
                    </div>
                </div>
            </div>

            <ItemForm isOpen={isItemFormOpen} onClose={() => setIsItemFormOpen(false)} item={editingItem} categories={categories} units={units} />
            <CategoryForm isOpen={isCategoryFormOpen} onClose={() => setIsCategoryFormOpen(false)} category={editingCategory} />
            <UnitForm isOpen={isUnitFormOpen} onClose={() => setIsUnitFormOpen(false)} unit={editingUnit} />
        </AuthenticatedLayout>
    );
}
