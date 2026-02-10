import React, { createContext, useContext } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useOrgStore } from '@/Stores/useOrgStore';
import { OrgTreeItem } from './Partials/OrgTreeItem';
import { Users2, Search, Filter, Info, Plus, Settings2, X } from 'lucide-react';
import { User } from '@/types/org-structure';
import { OrgContext } from './OrgContext';
import { router } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';

interface Props {
    users: User[];
    initialNodes: any[];
}

export default function Index({ users, initialNodes }: Props) {
    const { nodes, allowMultipleRoots, setAllowMultipleRoots, addNode } = useOrgStore();
    const [isProcessing, setIsProcessing] = React.useState(false);

    // Initialize store with server data
    React.useEffect(() => {
        if (initialNodes) {
            useOrgStore.setState({ nodes: initialNodes });
        }
    }, [initialNodes]);

    const handleSave = () => {
        setIsProcessing(true);
        router.put(route('organization.update'), { nodes: nodes as any }, {
            onSuccess: () => {
                setIsProcessing(false);
            },
            onError: () => {
                setIsProcessing(false);
            },
            onFinish: () => {
                setIsProcessing(false);
            }
        });
    };
    const [searchTerm, setSearchTerm] = React.useState('');

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Recursive search function
    const filterNodes = (items: any[], query: string): any[] => {
        if (!query) return items;

        const lowerQuery = query.toLowerCase();

        return items.reduce((acc, item) => {
            const matchesItself = item.label.toLowerCase().includes(lowerQuery) ||
                (item.type === 'person' && item.meta?.userEmail?.toLowerCase().includes(lowerQuery));

            const filteredChildren = item.children ? filterNodes(item.children, query) : [];
            const hasMatchingChildren = filteredChildren.length > 0;

            if (matchesItself || hasMatchingChildren) {
                acc.push({
                    ...item,
                    children: filteredChildren,
                    // If filtering, we want to see the hierarchy
                    isExpanded: query ? true : item.isExpanded
                });
            }
            return acc;
        }, []);
    };

    const filteredNodes = React.useMemo(() => filterNodes(nodes, searchTerm), [nodes, searchTerm]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            useOrgStore.getState().moveNode(active.id as string, over.id as string);
        }
    };

    const getFlatIds = (items: any[]): string[] => {
        return items.reduce((acc, item) => {
            acc.push(item.id);
            // When searching, we treat everything as expanded if it has visible children
            if (item.children && (searchTerm || item.isExpanded)) {
                acc.push(...getFlatIds(item.children));
            }
            return acc;
        }, []);
    };

    const flatIds = React.useMemo(() => getFlatIds(filteredNodes), [filteredNodes, searchTerm]);

    return (
        <OrgContext.Provider value={{ users }}>
            <AuthenticatedLayout
                header={
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight flex items-center gap-2">
                            <Users2 className="w-6 h-6 text-indigo-600" />
                            Organization Structure
                        </h2>
                        <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 transition-all">
                                <Settings2 size={16} />
                                <span>Multiple Roots</span>
                                <input
                                    type="checkbox"
                                    checked={allowMultipleRoots}
                                    onChange={(e) => setAllowMultipleRoots(e.target.checked)}
                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                />
                            </label>

                            {(allowMultipleRoots || nodes.length === 0) && (
                                <button
                                    onClick={() => addNode(null, 'company', 'New Company')}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 transition ease-in-out duration-150"
                                >
                                    <Plus size={14} /> Add Company
                                </button>
                            )}

                            <button
                                onClick={handleSave}
                                disabled={isProcessing}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition ease-in-out duration-150"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </button>
                        </div>
                    </div>
                }
            >
                <Head title="Organization Structure" />

                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Sidebar Controls */}
                        <div className="space-y-4">
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider text-center">Admin Controls</h3>
                                <div className="space-y-3">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Find employee or entity..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-9 pr-9 py-2 bg-gray-50 border-gray-200 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        {searchTerm && (
                                            <button
                                                onClick={() => setSearchTerm('')}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                                            >
                                                <X size={14} />
                                            </button>
                                        )}
                                    </div>
                                    <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all">
                                        <Filter size={16} /> Advanced Filter
                                    </button>
                                </div>
                            </div>

                            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                <h4 className="flex items-center gap-2 text-indigo-900 font-bold text-sm mb-2">
                                    <Info size={16} /> Quick Tips
                                </h4>
                                <div className="space-y-2 text-xs text-indigo-700">
                                    <p>• Double-click labels to rename</p>
                                    <p>• "Person" nodes can be linked to Users</p>
                                    <p>• Enable "Multiple Roots" to add more companies</p>
                                </div>
                            </div>
                        </div>

                        {/* Tree View */}
                        <div className="md:col-span-3">
                            <div className="bg-gray-50/50 p-6 rounded-2xl border-2 border-dashed border-gray-200 min-h-[600px]">
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext
                                        items={flatIds}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className="space-y-2">
                                            {filteredNodes.length > 0 ? (
                                                filteredNodes.map((node) => (
                                                    <OrgTreeItem key={node.id} node={node} searchTerm={searchTerm} />
                                                ))
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                                                    <Users2 size={48} className="mb-4 opacity-20" />
                                                    <p>{searchTerm ? 'No matching departments or employees found.' : 'No organization structure defined.'}</p>
                                                    {!searchTerm && (
                                                        <button
                                                            onClick={() => addNode(null, 'company', 'My Company')}
                                                            className="mt-4 text-indigo-600 hover:underline font-medium"
                                                        >
                                                            Create Root Node
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </SortableContext>
                                </DndContext>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </OrgContext.Provider>
    );
}
