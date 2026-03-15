import { Link } from 'react-router-dom';
import { Briefcase, UserCircle, LayoutDashboard, ArrowRight, Calculator } from 'lucide-react';
import { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { role } = useAuth();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 max-w-4xl mx-auto w-full">
      <div className="text-center mb-12 space-y-4">
        <div className="mb-6">
          <img 
            src="/logo.png" 
            alt="Renew Rehoboth Logo" 
            className="w-32 h-32 object-contain mx-auto" 
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Fallback if logo.png is missing
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = '<div class="w-24 h-24 bg-rr-text text-rr-bg rounded-xl flex items-center justify-center font-serif font-bold text-5xl leading-none tracking-tighter mx-auto shadow-xl">RR</div>';
            }}
          />
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight">
          Welcome to the <span className="italic text-rr-accent capitalize">{role?.replace('_', ' ')}</span> Portal
        </h1>
        <p className="text-rr-text/70 text-lg max-w-lg mx-auto font-medium">
          Manage your compliance, shifts, and agency operations in one unified platform.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
        {(role === 'staff' || role === 'admin') && (
          <div className="group relative bg-white border border-rr-accent/20 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start gap-4 overflow-hidden">
            <div className="p-3 bg-rr-bg rounded-xl text-rr-text group-hover:bg-rr-text group-hover:text-rr-bg transition-colors duration-300">
              <UserCircle className="w-8 h-8" />
            </div>
            <div className="w-full">
              <h2 className="text-xl font-serif font-semibold mb-2 text-left">Staff Portal</h2>
              <div className="space-y-2">
                <Link to="/staff/rota" className="flex items-center justify-between p-2 rounded-lg hover:bg-rr-bg text-sm font-medium transition-colors">
                  My Rota & Shifts <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/staff/profile" className="flex items-center justify-between p-2 rounded-lg hover:bg-rr-bg text-sm font-medium transition-colors">
                  Profile & Compliance <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/staff/policies" className="flex items-center justify-between p-2 rounded-lg hover:bg-rr-bg text-sm font-medium transition-colors">
                  Agency Policies <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-rr-text transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </div>
        )}
        
        {(role === 'client' || role === 'admin') && (
          <RoleCard
            to="/client"
            icon={<Briefcase className="w-8 h-8" />}
            title="Client Portal"
            description="Request shifts, review staff profiles, and approve timesheets."
          />
        )}

        {role === 'admin' && (
          <RoleCard
            to="/admin"
            icon={<LayoutDashboard className="w-8 h-8" />}
            title="Admin Portal"
            description="Manage agency operations, compliance, and finance."
          />
        )}
      </div>
    </div>
  );
}

function RoleCard({ to, icon, title, description }: { to: string; icon: ReactNode; title: string; description: string }) {
  return (
    <Link
      to={to}
      className="group relative bg-white border border-rr-accent/20 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start gap-4 overflow-hidden"
    >
      <div className="p-3 bg-rr-bg rounded-xl text-rr-text group-hover:bg-rr-text group-hover:text-rr-bg transition-colors duration-300">
        {icon}
      </div>
      <div>
        <h2 className="text-xl font-serif font-semibold mb-2 flex items-center gap-2">
          {title}
          <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
        </h2>
        <p className="text-sm text-rr-text/70 leading-relaxed">
          {description}
        </p>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-rr-text transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
    </Link>
  );
}
