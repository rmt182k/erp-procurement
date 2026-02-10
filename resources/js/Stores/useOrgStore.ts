import { create } from 'zustand';
import { OrgNode, NodeType } from '@/types/org-structure';
import { v4 as uuidv4 } from 'uuid';

interface OrgState {
    nodes: OrgNode[];
    allowMultipleRoots: boolean;
    setAllowMultipleRoots: (allow: boolean) => void;
    addNode: (parentId: string | null, type: NodeType, label: string) => void;
    updateNode: (id: string, updates: Partial<OrgNode>) => void;
    renameNode: (id: string, newLabel: string) => void;
    deleteNode: (id: string) => void;
    toggleExpand: (id: string) => void;
    moveNode: (activeId: string, overId: string) => void;
}

// Helper to find and update a node in a recursive tree
const updateRecursive = (nodes: OrgNode[], id: string, updater: (node: OrgNode) => OrgNode): OrgNode[] => {
    return nodes.map((node) => {
        if (node.id === id) {
            return updater(node);
        }
        if (node.children) {
            return { ...node, children: updateRecursive(node.children, id, updater) };
        }
        return node;
    });
};

// Helper to delete a node
const deleteRecursive = (nodes: OrgNode[], id: string): OrgNode[] => {
    return nodes.filter((node) => node.id !== id).map((node) => ({
        ...node,
        children: node.children ? deleteRecursive(node.children, id) : undefined
    }));
};

export const useOrgStore = create<OrgState>((set) => ({
    nodes: [
        {
            id: 'root-1',
            type: 'company',
            label: 'Main Company',
            isExpanded: true,
            children: []
        }
    ],
    allowMultipleRoots: false,

    setAllowMultipleRoots: (allow) => set({ allowMultipleRoots: allow }),

    addNode: (parentId, type, label) => set((state) => {
        const newNode: OrgNode = {
            id: uuidv4(),
            type,
            label,
            isExpanded: true,
            children: []
        };

        if (!parentId) {
            // Check if multiple roots are allowed if adding a company
            if (type === 'company' && !state.allowMultipleRoots && state.nodes.length > 0) {
                return state;
            }
            return { nodes: [...state.nodes, newNode] };
        }

        return {
            nodes: updateRecursive(state.nodes, parentId, (node) => ({
                ...node,
                children: [...(node.children || []), newNode]
            }))
        };
    }),

    updateNode: (id, updates) => set((state) => ({
        nodes: updateRecursive(state.nodes, id, (node) => ({ ...node, ...updates }))
    })),

    renameNode: (id, newLabel) => set((state) => ({
        nodes: updateRecursive(state.nodes, id, (node) => ({ ...node, label: newLabel }))
    })),

    deleteNode: (id) => set((state) => ({
        nodes: deleteRecursive(state.nodes, id)
    })),

    toggleExpand: (id) => set((state) => ({
        nodes: updateRecursive(state.nodes, id, (node) => ({ ...node, isExpanded: !node.isExpanded }))
    })),

    moveNode: (activeId, overId) => set((state) => {
        const findAndRemove = (nodes: OrgNode[], id: string): { nodes: OrgNode[], removed?: OrgNode } => {
            let removed: OrgNode | undefined;
            const filtered = nodes.filter(n => {
                if (n.id === id) {
                    removed = n;
                    return false;
                }
                return true;
            }).map(n => {
                const res = n.children ? findAndRemove(n.children, id) : { nodes: [] };
                if (res.removed) removed = res.removed;
                return { ...n, children: n.children ? res.nodes : [] };
            });
            return { nodes: filtered, removed };
        };

        const findAndInsert = (nodes: OrgNode[], overId: string, nodeToInsert: OrgNode): OrgNode[] => {
            const index = nodes.findIndex(n => n.id === overId);
            if (index !== -1) {
                const newNodes = [...nodes];
                newNodes.splice(index, 0, nodeToInsert);
                return newNodes;
            }
            return nodes.map(n => ({
                ...n,
                children: n.children ? findAndInsert(n.children, overId, nodeToInsert) : []
            }));
        };

        const { nodes: filteredNodes, removed } = findAndRemove(state.nodes, activeId);
        if (!removed) return state;

        return { nodes: findAndInsert(filteredNodes, overId, removed) };
    })
}));
