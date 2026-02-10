export type NodeType = 'company' | 'entity' | 'department' | 'division' | 'team' | 'person';

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface OrgNode {
    id: string;
    type: NodeType;
    label: string;
    isExpanded?: boolean;
    children?: OrgNode[];
    meta?: {
        userId?: number;
        userEmail?: string;
        budgetCode?: string;
        email?: string;
        role?: string;
    };
}

export interface NodeIconConfig {
    type: NodeType;
    icon: string; // Icon name from lucide
    color: string;
}
