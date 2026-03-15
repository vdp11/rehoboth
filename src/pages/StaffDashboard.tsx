import { Link } from 'react-router-dom';
import { Calendar, UserCircle, FileText, Clock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ReactNode } from 'react';

export default function StaffDashboard() {
  const { user } = useAuth();

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-8 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">Welcome back, {user?.name || 'Sarah'}</h1>
          <p className="text-rr-text/60 text-sm font-medium">Here's an overview of your shifts and compliance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Next Shift Card */}
        <div className="bg-white border border-rr-accent/20 p-6 rounded-2xl shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-rr-accent" />
              Next Upcoming Shift
            </h2>
            <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
              Confirmed
            </span>
          </div>
          <div className="bg-rr-bg p-4 rounded-xl space-y-2">
            <p className="font-bold text-rr-text">Senior Healthcare Assistant</p>
            <p className="text-sm text-rr-text/70">St. Jude Care Home • London, NW1 4EP</p>
            <p className="text-sm font-semibold text-rr-text/60 flex items-center gap-2 mt-2">
              <Calendar className="w-4 h-4" />
              Tomorrow, 08:00 - 20:00
            </p>
          </div>
          <Link to="/staff/rota" className="mt-auto flex items-center justify-center gap-2 w-full py-3 bg-rr-text text-rr-bg rounded-xl font-bold text-sm hover:bg-rr-text/90 transition-colors">
            View All Shifts <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Compliance Summary Card */}
        <div className="bg-white border border-rr-accent/20 p-6 rounded-2xl shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Compliance Status
            </h2>
            <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Action Needed
            </span>
          </div>
          <div className="space-y-3 flex-1">
            <div className="flex items-center justify-between p-3 bg-rr-bg rounded-xl">
              <span className="text-sm font-medium">DBS Certificate</span>
              <span className="text-xs font-bold text-green-600">Valid</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-100 rounded-xl">
              <span className="text-sm font-medium text-orange-800">Mandatory Training</span>
              <span className="text-xs font-bold text-orange-600">Expiring Soon</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-rr-bg rounded-xl">
              <span className="text-sm font-medium">Right to Work</span>
              <span className="text-xs font-bold text-green-600">Valid</span>
            </div>
          </div>
          <Link to="/staff/profile" className="mt-auto flex items-center justify-center gap-2 w-full py-3 border border-rr-accent/20 text-rr-text rounded-xl font-bold text-sm hover:bg-rr-bg transition-colors">
            Update Documents <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-xl font-serif font-semibold mb-4">Quick Links</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <QuickLink to="/staff/rota" icon={<Calendar className="w-6 h-6" />} label="My Rota" />
          <QuickLink to="/staff/profile" icon={<UserCircle className="w-6 h-6" />} label="Profile" />
          <QuickLink to="/staff/policies" icon={<FileText className="w-6 h-6" />} label="Policies" />
          <QuickLink to="/staff/shift" icon={<Clock className="w-6 h-6" />} label="Active Shift" />
        </div>
      </div>
    </div>
  );
}

function QuickLink({ to, icon, label }: { to: string; icon: ReactNode; label: string }) {
  return (
    <Link to={to} className="flex flex-col items-center justify-center gap-3 p-6 bg-white border border-rr-accent/20 rounded-2xl hover:shadow-md hover:border-rr-accent/40 transition-all group">
      <div className="p-3 bg-rr-bg rounded-xl text-rr-text group-hover:bg-rr-text group-hover:text-rr-bg transition-colors">
        {icon}
      </div>
      <span className="font-semibold text-sm">{label}</span>
    </Link>
  );
}
