import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import SidebarLink from '@/Components/SidebarLink';
import { LayoutDashboard, Network, Package, Building2, Coins, PieChart, ShieldCheck, Workflow } from 'lucide-react';
import { useTrans } from '@/hooks/useTrans';

interface SidebarProps {
    isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
    const { trans } = useTrans();
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
                        icon={<LayoutDashboard size={20} />}
                    >
                        {trans('Dashboard')}
                    </SidebarLink>

                    <SidebarLink
                        href={route('organization.index')}
                        active={route().current('organization.index')}
                        isOpen={isOpen}
                        icon={<Network size={20} />}
                    >
                        {trans('Organization')}
                    </SidebarLink>

                    <SidebarLink
                        href={route('items.index')}
                        active={route().current('items.index')}
                        isOpen={isOpen}
                        icon={<Package size={20} />}
                    >
                        {trans('Items')}
                    </SidebarLink>

                    <SidebarLink
                        href={route('vendors.index')}
                        active={route().current('vendors.*')}
                        isOpen={isOpen}
                        icon={<Building2 size={20} />}
                    >
                        {trans('Vendors')}
                    </SidebarLink>

                    <SidebarLink
                        href={route('chart-of-accounts.index')}
                        active={route().current('chart-of-accounts.*')}
                        isOpen={isOpen}
                        icon={<Coins size={20} />}
                    >
                        {trans('Chart of Accounts')}
                    </SidebarLink>

                    {/* Budgeting Section */}
                    <div className={`mt-6 mb-2 px-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{trans('Budgeting')}</span>
                    </div>

                    <SidebarLink
                        href={route('cost-centers.index')}
                        active={route().current('cost-centers.*')}
                        isOpen={isOpen}
                        icon={<Network size={20} />}
                    >
                        {trans('Cost Centers')}
                    </SidebarLink>

                    <SidebarLink
                        href={route('budgets.index')}
                        active={route().current('budgets.*')}
                        isOpen={isOpen}
                        icon={<PieChart size={20} />}
                    >
                        {trans('Budgets')}
                    </SidebarLink>

                    {/* Security Section */}
                    <div className={`mt-6 mb-2 px-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{trans('Security & Rules')}</span>
                    </div>

                    <SidebarLink
                        href={route('roles.index')}
                        active={route().current('roles.*')}
                        isOpen={isOpen}
                        icon={<ShieldCheck size={20} />}
                    >
                        {trans('Roles & Permissions')}
                    </SidebarLink>

                    <SidebarLink
                        href={route('approval-rules.index')}
                        active={route().current('approval-rules.*')}
                        isOpen={isOpen}
                        icon={<Workflow size={20} />}
                    >
                        {trans('Approval Rules')}
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


