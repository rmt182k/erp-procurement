import React, { useState, useEffect, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    ChevronRight,
    ChevronDown,
    Plus,
    Trash2,
    GripVertical,
    Building2,
    Network,
    Users,
    User as UserIcon,
    Briefcase,
    Globe,
    Edit3,
    Check,
    X as CloseIcon,
    Mail
} from 'lucide-react';
import { OrgNode, NodeType, User } from '@/types/org-structure';
import { useOrgStore } from '@/Stores/useOrgStore';
import { useOrgContext } from '../OrgContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface OrgTreeItemProps {
    node: OrgNode;
    depth?: number;
    searchTerm?: string;
}

const HighlightMatch = ({ text, match }: { text: string; match?: string }) => {
    if (!match || !text.toLowerCase().includes(match.toLowerCase())) return <>{text}</>;

    const parts = text.split(new RegExp(`(${match})`, 'gi'));
    return (
        <span className="truncate">
            {parts.map((part, i) =>
                part.toLowerCase() === match.toLowerCase() ?
                    <mark key={i} className="bg-yellow-200 text-yellow-900 rounded-px px-0.5">{part}</mark> :
                    part
            )}
        </span>
    );
};

const NodeIcon = ({ type }: { type: NodeType }) => {
    switch (type) {
        case 'company': return <Building2 className="w-4 h-4 text-blue-600" />;
        case 'entity': return <Globe className="w-4 h-4 text-indigo-600" />;
        case 'department': return <Briefcase className="w-4 h-4 text-emerald-600" />;
        case 'division': return <Network className="w-4 h-4 text-purple-600" />;
        case 'team': return <Users className="w-4 h-4 text-orange-600" />;
        case 'person': return <UserIcon className="w-4 h-4 text-pink-600" />;
        default: return <Building2 className="w-4 h-4" />;
    }
};

export const OrgTreeItem: React.FC<OrgTreeItemProps> = ({ node, depth = 0, searchTerm }) => {
    const { toggleExpand, deleteNode, addNode, renameNode, updateNode } = useOrgStore();
    const { users } = useOrgContext();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(node.label);
    const inputRef = useRef<HTMLInputElement>(null);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: node.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        marginLeft: `${depth * 20}px`,
    };

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditing]);

    const handleRename = () => {
        if (editValue.trim() && editValue !== node.label) {
            renameNode(node.id, editValue);
        }
        setIsEditing(false);
    };

    const handleAddChild = (type: NodeType) => {
        const label = `New ${type.charAt(0).toUpperCase() + type.slice(1)}`;
        addNode(node.id, type, label);
        setIsMenuOpen(false);
    };

    const handleUserSelect = (userId: number) => {
        const user = users.find(u => u.id === userId);
        if (user) {
            updateNode(node.id, {
                label: user.name,
                meta: { ...node.meta, userId: user.id, userEmail: user.email }
            });
            setIsEditing(false);
        }
    };

    return (
        <div ref={setNodeRef} style={style} className={cn("mb-1 select-none", isDragging && "opacity-50")}>
            <div className={cn(
                "group flex items-center justify-between p-2 rounded-lg border border-transparent hover:border-gray-200 hover:bg-white transition-all duration-200 shadow-sm bg-white/50",
                isDragging && "border-blue-500 bg-blue-50 shadow-md",
                searchTerm && node.label.toLowerCase().includes(searchTerm.toLowerCase()) && "ring-1 ring-indigo-200 bg-indigo-50/30"
            )}>
                <div className="flex items-center gap-2 flex-1">
                    <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical size={16} />
                    </div>

                    <button
                        onClick={() => toggleExpand(node.id)}
                        className={cn(
                            "p-0.5 rounded hover:bg-gray-200 transition-colors",
                            (!node.children || node.children.length === 0) && "invisible"
                        )}
                    >
                        {node.isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>

                    <div className="flex items-center gap-2 flex-1">
                        <NodeIcon type={node.type} />

                        {isEditing ? (
                            <div className="flex items-center gap-2 flex-1">
                                {node.type === 'person' ? (
                                    <select
                                        className="text-sm border-gray-300 rounded-md py-0.5 pr-8 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                        value={node.meta?.userId || ''}
                                        onChange={(e) => handleUserSelect(Number(e.target.value))}
                                        onBlur={() => !node.meta?.userId && setIsEditing(false)}
                                    >
                                        <option value="">Select User...</option>
                                        {users.map(user => (
                                            <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                                        ))}
                                    </select>
                                ) : (
                                    <>
                                        <input
                                            ref={inputRef}
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                                            className="text-sm font-medium border-0 border-b-2 border-indigo-500 p-0 focus:ring-0 bg-transparent flex-1"
                                        />
                                        <button onClick={handleRename} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"><Check size={14} /></button>
                                        <button onClick={() => setIsEditing(false)} className="p-1 text-red-500 hover:bg-red-50 rounded"><CloseIcon size={14} /></button>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col min-w-0 flex-1 cursor-pointer group/label" onDoubleClick={() => setIsEditing(true)}>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-700 truncate">
                                        <HighlightMatch text={node.label} match={searchTerm} />
                                    </span>
                                    <Edit3 size={12} className="text-gray-400 opacity-0 group-hover/label:opacity-100 transition-opacity" onClick={() => setIsEditing(true)} />
                                </div>
                                {node.type === 'person' && node.meta?.userEmail && (
                                    <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                        <Mail size={10} />
                                        <HighlightMatch text={node.meta.userEmail} match={searchTerm} />
                                    </span>
                                )}
                            </div>
                        )}

                        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold px-1.5 py-0.5 bg-gray-100 rounded">
                            {node.type}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-1 px-2 text-[11px] font-semibold text-gray-600 bg-gray-100 hover:bg-indigo-600 hover:text-white rounded-md transition-all flex items-center gap-1"
                        >
                            <Plus size={14} /> Add
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-1 flex flex-col">
                                {(['entity', 'department', 'division', 'team', 'person'] as NodeType[]).map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => handleAddChild(type)}
                                        className="text-left px-3 py-1.5 text-xs hover:bg-gray-50 rounded capitalize flex items-center gap-2"
                                    >
                                        <NodeIcon type={type} />
                                        {type}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => deleteNode(node.id)}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            {node.isExpanded && node.children && (
                <div className="mt-1">
                    {node.children.map((child) => (
                        <OrgTreeItem key={child.id} node={child} depth={depth + 1} searchTerm={searchTerm} />
                    ))}
                </div>
            )}
        </div>
    );
};
