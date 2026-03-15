import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Building2, FileText, ShieldCheck, Calculator, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const location = useLocation();
  const { role } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Staff', path: '/admin/interviews', icon: Users },
    { label: 'Clients', path: '/admin/clients', icon: Building2 },
    { label: 'Finance', path: '/admin/finance', icon: Calculator },
    { label: 'Compliance', path: '/admin/compliance', icon: ShieldCheck },
    { label: 'Profile', path: '/admin/profile', icon: User },
  ];

  return (
    <div className="flex-1 flex flex-col">
      {/* Sub-navigation for Admin */}
      <div className="bg-white border-b border-rr-accent/10 sticky top-[57px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-rr-text text-rr-bg shadow-sm'
                      : 'text-rr-text/50 hover:text-rr-text hover:bg-rr-bg'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Admin Content Area */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
