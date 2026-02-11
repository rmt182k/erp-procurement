import React, { useState, useMemo, useEffect } from 'react';
import {
    Search,
    ChevronUp,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    SearchX
} from 'lucide-react';
import { useTrans } from '@/hooks/useTrans';

export interface Column<T> {
    header: string;
    key?: keyof T;
    accessorKey?: string; // Support for nested or just alternative key name
    sortable?: boolean;
    render?: (item: T) => React.ReactNode;
    cell?: (props: { row: { original: T } }) => React.ReactNode; // Support for 'cell' style renderers
    className?: string;
    headerClassName?: string;
    align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    searchPlaceholder?: string;
    searchKeys?: (keyof T)[];
    itemsPerPage?: number;
    initialSort?: { key: keyof T; order: 'asc' | 'desc' };
    className?: string;
    emptyMessage?: string;
    onRowClick?: (item: T) => void;
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    headerExtra?: React.ReactNode;
    hideSearch?: boolean;
}

function cls(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}

export function DataTable<T extends { id: string | number }>({
    data,
    columns,
    searchPlaceholder = "Cari data...",
    searchKeys,
    itemsPerPage = 10,
    initialSort,
    className,
    emptyMessage,
    onRowClick,
    onEdit,
    onDelete,
    headerExtra,
    hideSearch = false
}: DataTableProps<T>) {
    const { trans } = useTrans();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof T; order: 'asc' | 'desc' } | null>(
        initialSort || null
    );
    const [pageSize, setPageSize] = useState(itemsPerPage);
    const [currentPage, setCurrentPage] = useState(1);

    const actualSearchPlaceholder = searchPlaceholder || trans('Search data...');
    const actualEmptyMessage = emptyMessage || trans('No data found.');

    // 1. Filtering Logic
    const filteredData = useMemo(() => {
        if (!searchTerm) return data;

        const lowerSearch = searchTerm.toLowerCase();
        return data.filter(item => {
            // If searchKeys provided, search in them. Otherwise search in all sortable columns or just all keys.
            const keysToSearch = (searchKeys || columns.filter(c => c.key || c.accessorKey).map(c => (c.key || c.accessorKey) as keyof T));

            return keysToSearch.some(key => {
                const value = item[key];
                return String(value).toLowerCase().includes(lowerSearch);
            });
        });
    }, [data, searchTerm, searchKeys, columns]);

    // 2. Sorting Logic
    const sortedData = useMemo(() => {
        if (!sortConfig) return filteredData;

        const result = [...filteredData];
        result.sort((a, b) => {
            const valA = a[sortConfig.key];
            const valB = b[sortConfig.key];

            if (typeof valA === 'number' && typeof valB === 'number') {
                return sortConfig.order === 'asc' ? valA - valB : valB - valA;
            }

            const strA = String(valA).toLowerCase();
            const strB = String(valB).toLowerCase();

            if (strA < strB) return sortConfig.order === 'asc' ? -1 : 1;
            if (strA > strB) return sortConfig.order === 'asc' ? 1 : -1;
            return 0;
        });
        return result;
    }, [filteredData, sortConfig]);

    // 3. Pagination Logic
    const totalPages = Math.ceil(sortedData.length / pageSize);
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return sortedData.slice(startIndex, startIndex + pageSize);
    }, [sortedData, currentPage, pageSize]);

    // Reset to page 1 on search or page size change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, pageSize]);

    const handleSort = (key: keyof T) => {
        let order: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.order === 'asc') {
            order = 'desc';
        }
        setSortConfig({ key, order });
    };

    return (
        <div className={cls("space-y-4", className)}>
            {/* Header Controls: Search, Extra Filters, Page Size */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {!hideSearch && (
                    <div className="relative group flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            placeholder={actualSearchPlaceholder}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                )}

                <div className="flex flex-wrap items-center gap-3 justify-end">
                    {headerExtra && (
                        <div className="flex items-center gap-3">
                            {headerExtra}
                        </div>
                    )}

                    <div className="flex items-center gap-2 text-xs font-medium text-gray-400 bg-gray-50/50 border border-gray-100 px-3 py-1.5 rounded-lg">
                        <span className="uppercase tracking-wider">{trans('Show')}</span>
                        <select
                            className="bg-transparent border-none py-0 pl-1 pr-6 focus:ring-0 text-sm font-bold text-indigo-600 cursor-pointer"
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                        >
                            {[5, 10, 25, 50, 100].map(size => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                        <span className="uppercase tracking-wider">{trans('Rows')}</span>
                    </div>
                </div>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto border border-gray-100 rounded-xl bg-white shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            {columns.map((column, idx) => (
                                <th
                                    key={idx}
                                    className={cls(
                                        "px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider transition-colors",
                                        column.sortable && (column.key || column.accessorKey) && "cursor-pointer hover:bg-gray-100 group",
                                        column.align === 'center' ? "text-center" : column.align === 'right' ? "text-right" : "text-left",
                                        column.headerClassName
                                    )}
                                    onClick={() => column.sortable && (column.key || column.accessorKey) && handleSort((column.key || column.accessorKey) as keyof T)}
                                >
                                    <div className={cls(
                                        "flex items-center gap-2",
                                        column.align === 'center' ? "justify-center" : column.align === 'right' ? "justify-end" : "justify-start"
                                    )}>
                                        {column.header}
                                        {column.sortable && (column.key || column.accessorKey) && (
                                            <div className="flex flex-col">
                                                <ChevronUp
                                                    size={12}
                                                    className={cls(
                                                        "transition-opacity",
                                                        (sortConfig?.key === column.key || sortConfig?.key === column.accessorKey) && sortConfig?.order === 'asc' ? "text-indigo-600 opacity-100" : "opacity-20"
                                                    )}
                                                />
                                                <ChevronDown
                                                    size={12}
                                                    className={cls(
                                                        "-mt-1 transition-opacity",
                                                        (sortConfig?.key === column.key || sortConfig?.key === column.accessorKey) && sortConfig?.order === 'desc' ? "text-indigo-600 opacity-100" : "opacity-20"
                                                    )}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                            ))}
                            {(onEdit || onDelete) && (
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                                    {trans('Action')}
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {paginatedData.length > 0 ? (
                            paginatedData.map((item) => (
                                <tr
                                    key={item.id}
                                    className={cls(
                                        "hover:bg-gray-50/80 transition-colors group",
                                        onRowClick && "cursor-pointer"
                                    )}
                                    onClick={() => onRowClick?.(item)}
                                >
                                    {columns.map((column, idx) => (
                                        <td
                                            key={idx}
                                            className={cls(
                                                "px-6 py-4 text-sm transition-all",
                                                column.align === 'center' ? "text-center" : column.align === 'right' ? "text-right" : "text-left",
                                                column.className
                                            )}
                                        >
                                            {column.cell ? column.cell({ row: { original: item } }) :
                                                column.render ? column.render(item) :
                                                    (item[(column.key || column.accessorKey) as keyof T] as unknown as React.ReactNode)}
                                        </td>
                                    ))}
                                    {(onEdit || onDelete) && (
                                        <td className="px-6 py-4 text-sm text-right space-x-2">
                                            {onEdit && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                                                    className="text-indigo-600 hover:text-indigo-900 font-medium"
                                                >
                                                    {trans('Edit')}
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); if (confirm(trans('Are you sure you want to delete this?'))) onDelete(item); }}
                                                    className="text-red-600 hover:text-red-900 font-medium"
                                                >
                                                    {trans('Delete')}
                                                </button>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="px-6 py-16 text-center">
                                    <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                                        <SearchX className="w-8 h-8 opacity-20" />
                                        <span className="italic text-sm">{actualEmptyMessage}</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination UI */}
            <div className="flex items-center justify-between pt-2">
                <div className="text-xs font-medium text-gray-500">
                    {trans('Showing')} <span className="text-gray-900 font-bold">{filteredData.length > 0 ? ((currentPage - 1) * pageSize) + 1 : 0}</span> - <span className="text-gray-900 font-bold">{Math.min(currentPage * pageSize, filteredData.length)}</span> {trans('of')} <span className="text-gray-900 font-bold">{filteredData.length}</span> {trans('data')}
                </div>
                {totalPages > 1 && (
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        <div className="flex items-center gap-1">
                            {[...Array(totalPages)].map((_, i) => {
                                if (
                                    totalPages <= 7 ||
                                    i === 0 ||
                                    i === totalPages - 1 ||
                                    (i >= currentPage - 2 && i <= currentPage)
                                ) {
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={cls(
                                                "min-w-[40px] h-10 text-sm font-semibold rounded-lg transition-all",
                                                currentPage === i + 1
                                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                                                    : "text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200"
                                            )}
                                        >
                                            {i + 1}
                                        </button>
                                    );
                                } else if (
                                    (i === 1 && currentPage > 4) ||
                                    (i === totalPages - 2 && currentPage < totalPages - 3)
                                ) {
                                    return <span key={i} className="px-1 text-gray-300">...</span>;
                                }
                                return null;
                            })}
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
