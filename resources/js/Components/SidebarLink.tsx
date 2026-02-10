import { Link } from '@inertiajs/react';
import { ReactNode } from 'react';

interface SidebarLinkProps {
    href: string;
    active?: boolean;
    children: ReactNode;
    icon?: ReactNode;
    isOpen: boolean;
}

export default function SidebarLink({ href, active = false, children, icon, isOpen }: SidebarLinkProps) {
    return (
        <Link
            href={href}
            className={`
                flex items-center py-3 px-3.5
                text-gray-700 hover:bg-gray-100 hover:text-indigo-600
                transition-colors duration-200
                ${active ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600' : ''}
                ${isOpen ? 'justify-start' : 'justify-center'}
            `}
        >
            <span className={`${isOpen ? 'mr-3' : ''} flex-shrink-0 w-6 h-6`}>
                {icon}
            </span>

            <span className={`whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'} `}>
                {children}
            </span>
        </Link>
    );
}
