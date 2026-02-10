import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import SidebarLink from '@/Components/SidebarLink';

interface SidebarProps {
    isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
    return (
        <aside
            className={`
                bg-white border-r border-gray-200 shadow-sm
                transition-all duration-300 ease-in-out
                flex flex-col
                ${isOpen ? 'w-64' : 'w-20'}
                h-screen fixed left-0 top-0 z-20
                hidden md:flex
            `}
        >
            {/* Logo Area */}
            <div className={`flex items-center h-16 px-4 border-b border-gray-100 ${isOpen ? 'justify-start' : 'justify-center'}`}>
                <Link href="/">
                    <ApplicationLogo className={`fill-current text-indigo-600 transition-all duration-300 ${isOpen ? 'w-8 h-8' : 'w-8 h-8'}`} />
                </Link>
                <span className={`ml-3 text-lg font-bold text-gray-800 whitespace-nowrap overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                    Procurement
                </span>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1">
                    <SidebarLink
                        href={route('dashboard')}
                        active={route().current('dashboard')}
                        isOpen={isOpen}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                            </svg>
                        }
                    >
                        Dashboard
                    </SidebarLink>

                    {/* Add more links here later */}
                </nav>
            </div>

            {/* User Profile / Footer (Optional) */}
            <div className="border-t border-gray-100 p-4">
                {/* Can put something here if needed */}
            </div>
        </aside>
    );
}
