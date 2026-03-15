import { useState, ReactNode } from 'react';
import { Users, CalendarDays, FileText, AlertTriangle, CheckCircle2, Search, Filter, MoreVertical, ShieldAlert, Building2 } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminView() {
  const [activeTab, setActiveTab] = useState('compliance');

  const complianceAlerts = [
    { id: 1, name: 'John Doe', role: 'HCA', issue: 'Right to Work expires in 14 days', severity: 'high' },
    { id: 2, name: 'Sarah Jenkins', role: 'Senior HCA', issue: 'Mandatory Training overdue', severity: 'critical' },
    { id: 3, name: 'Michael Smith', role: 'RGN', issue: 'DBS update service check due', severity: 'medium' },
  ];

  const recentTimesheets = [
    { id: 'TS-1102', staff: 'Sarah Jenkins', client: 'St. Jude Care', hours: '11.25', status: 'Approved' },
    { id: 'TS-1103', staff: 'John Doe', client: 'Meadow View', hours: '8.00', status: 'Pending' },
    { id: 'TS-1104', staff: 'Emily Chen', role: 'RGN', client: 'City Hospital', hours: '12.00', status: 'Submitted' },
  ];

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight mb-1">Agency Dashboard</h1>
          <p className="text-rr-text/60 text-sm font-medium">Overview of operations and compliance.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-rr-text/40" />
            <input 
              type="text" 
              placeholder="Search staff, clients..." 
              className="pl-9 pr-4 py-2 rounded-xl border border-rr-accent/30 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-rr-text/20 transition-shadow w-full sm:w-64"
            />
          </div>
          <button className="p-2 rounded-xl border border-rr-accent/30 bg-white hover:bg-rr-bg transition-colors">
            <Filter className="w-4 h-4 text-rr-text/70" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Link to="/admin/interviews" className="block">
          <StatCard icon={<Users />} label="Active Staff" value="142" trend="+12 this month" />
        </Link>
        <Link to="/admin/clients" className="block">
          <StatCard icon={<Building2 />} label="Active Clients" value="45" trend="+3 this month" />
        </Link>
        <StatCard icon={<CalendarDays />} label="Shifts This Week" value="384" trend="89% filled" />
        <Link to="/admin/finance" className="block">
          <StatCard icon={<FileText />} label="Pending Timesheets" value="28" trend="Requires action" alert />
        </Link>
        <Link to="/admin/compliance" className="block">
          <StatCard icon={<AlertTriangle />} label="Compliance Alerts" value="15" trend="3 critical" alert />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-rr-accent/20 overflow-hidden">
            <div className="p-6 border-b border-rr-accent/10 flex items-center justify-between bg-rr-bg/30">
              <h2 className="font-serif font-semibold text-lg">Recent Timesheets</h2>
              <button className="text-sm font-medium text-rr-text/60 hover:text-rr-text transition-colors">View All</button>
            </div>
            <div className="divide-y divide-rr-accent/10">
              {recentTimesheets.map((ts) => (
                <div key={ts.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-rr-bg/50 transition-colors">
                  <div>
                    <p className="font-medium text-sm sm:text-base">{ts.staff}</p>
                    <p className="text-xs sm:text-sm text-rr-text/60">{ts.client} • {ts.hours}h</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${
                      ts.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      ts.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {ts.status}
                    </span>
                    <button className="p-1.5 text-rr-text/40 hover:text-rr-text rounded-lg hover:bg-rr-accent/10 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Area */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-rr-accent/20 overflow-hidden">
            <div className="p-6 border-b border-rr-accent/10 flex items-center gap-2 bg-red-50/50">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              <h2 className="font-serif font-semibold text-lg text-red-900">Compliance Action Required</h2>
            </div>
            <div className="divide-y divide-rr-accent/10">
              {complianceAlerts.map((alert) => (
                <div key={alert.id} className="p-5 hover:bg-rr-bg/50 transition-colors">
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-medium text-sm">{alert.name}</p>
                    <span className={`w-2 h-2 rounded-full mt-1.5 ${
                      alert.severity === 'critical' ? 'bg-red-500' :
                      alert.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500'
                    }`} />
                  </div>
                  <p className="text-xs text-rr-text/60 mb-2">{alert.role}</p>
                  <p className="text-sm text-red-700/80 font-medium bg-red-50 p-2 rounded-lg border border-red-100">
                    {alert.issue}
                  </p>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-rr-accent/10 bg-rr-bg/30">
              <Link 
                to="/admin/compliance"
                className="block w-full py-2 text-center text-sm font-semibold tracking-wide text-rr-text hover:bg-rr-accent/10 rounded-xl transition-colors"
              >
                View Compliance Matrix
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend, alert }: { icon: ReactNode, label: string, value: string, trend: string, alert?: boolean }) {
  return (
    <div className={`bg-white rounded-3xl shadow-sm border p-6 flex flex-col gap-4 ${alert ? 'border-red-200' : 'border-rr-accent/20'}`}>
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-2xl ${alert ? 'bg-red-50 text-red-600' : 'bg-rr-bg text-rr-text'}`}>
          {icon}
        </div>
        <span className={`text-xs font-semibold tracking-wide ${alert ? 'text-red-600' : 'text-rr-text/50'}`}>
          {trend}
        </span>
      </div>
      <div>
        <p className="text-sm text-rr-text/60 font-medium mb-1">{label}</p>
        <p className="text-3xl font-serif font-bold tracking-tight">{value}</p>
      </div>
    </div>
  );
}
