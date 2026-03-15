import { useState } from 'react';
import { ShieldCheck, AlertCircle, Search, Filter, CheckCircle2, XCircle, FileText, Download, Mail, MoreVertical } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

interface ComplianceRecord {
  id: string;
  name: string;
  role: string;
  rtw: 'valid' | 'expiring' | 'missing';
  dbs: 'valid' | 'expiring' | 'missing';
  training: 'valid' | 'expiring' | 'missing';
  lastAudit: string;
}

export default function AdminCompliance() {
  const { addNotification } = useNotification();
  const [records] = useState<ComplianceRecord[]>([
    { id: '1', name: 'Sarah Jenkins', role: 'Senior HCA', rtw: 'valid', dbs: 'valid', training: 'expiring', lastAudit: '2024-02-15' },
    { id: '2', name: 'John Doe', role: 'HCA', rtw: 'expiring', dbs: 'valid', training: 'valid', lastAudit: '2024-01-20' },
    { id: '3', name: 'James Wilson', role: 'RGN', rtw: 'valid', dbs: 'missing', training: 'valid', lastAudit: '2024-03-10' },
    { id: '4', name: 'Emma Thompson', role: 'HCA', rtw: 'valid', dbs: 'valid', training: 'valid', lastAudit: '2024-02-28' },
    { id: '5', name: 'Michael Smith', role: 'RGN', rtw: 'valid', dbs: 'valid', training: 'missing', lastAudit: '2024-01-05' },
  ]);

  const handleExportAuditLog = () => {
    addNotification({
      title: 'Audit Log Exported',
      message: 'The compliance audit log has been successfully exported.',
      type: 'success'
    });
  };

  const handleRunNewAudit = () => {
    addNotification({
      title: 'Audit Initiated',
      message: 'A new compliance audit is now running in the background.',
      type: 'info'
    });
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">Compliance Matrix</h1>
          <p className="text-rr-text/60 text-sm font-medium">Monitor Right to Work, DBS, and Training status across all staff.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExportAuditLog}
            className="bg-rr-bg text-rr-text px-4 py-2 rounded-xl font-semibold text-sm hover:bg-rr-accent/10 transition-colors border border-rr-accent/20 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Audit Log
          </button>
          <button 
            onClick={handleRunNewAudit}
            className="bg-rr-text text-rr-bg px-6 py-2 rounded-xl font-semibold text-sm hover:bg-rr-text/90 transition-colors shadow-sm"
          >
            Run New Audit
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-rr-accent/20 shadow-sm mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-rr-text/40" />
          <input 
            type="text" 
            placeholder="Search staff by name or role..." 
            className="w-full pl-10 pr-4 py-2 bg-rr-bg/30 border border-rr-accent/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rr-text/10"
          />
        </div>
        <div className="flex gap-2">
          <select className="bg-rr-bg/30 border border-rr-accent/10 rounded-xl px-4 py-2 text-sm focus:outline-none">
            <option>All Roles</option>
            <option>HCA</option>
            <option>RGN</option>
          </select>
          <select className="bg-rr-bg/30 border border-rr-accent/10 rounded-xl px-4 py-2 text-sm focus:outline-none">
            <option>All Statuses</option>
            <option>Compliant</option>
            <option>Non-Compliant</option>
          </select>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-rr-accent/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-rr-bg/50 text-rr-text/40 text-[10px] font-bold uppercase tracking-widest">
                <th className="px-6 py-4">Staff Member</th>
                <th className="px-6 py-4">Right to Work</th>
                <th className="px-6 py-4">Enhanced DBS</th>
                <th className="px-6 py-4">Training</th>
                <th className="px-6 py-4">Last Audit</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rr-accent/10">
              {records.map((record) => (
                <tr key={record.id} className="hover:bg-rr-bg/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-rr-accent/10 flex items-center justify-center text-rr-accent font-bold text-xs">
                        {record.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{record.name}</p>
                        <p className="text-xs text-rr-text/50">{record.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusIndicator status={record.rtw} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusIndicator status={record.dbs} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusIndicator status={record.training} />
                  </td>
                  <td className="px-6 py-4 text-sm text-rr-text/60">
                    {record.lastAudit}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-rr-bg rounded-lg text-rr-text/40 hover:text-rr-text transition-colors">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-rr-bg rounded-lg text-rr-text/40 hover:text-rr-text transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-6 justify-center text-[10px] font-bold uppercase tracking-widest text-rr-text/40">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          Compliant / Valid
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500" />
          Expiring Soon
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          Missing / Expired
        </div>
      </div>
    </div>
  );
}

function StatusIndicator({ status }: { status: ComplianceRecord['rtw'] }) {
  switch (status) {
    case 'valid':
      return (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-xs font-bold">Valid</span>
        </div>
      );
    case 'expiring':
      return (
        <div className="flex items-center gap-2 text-orange-600">
          <AlertCircle className="w-4 h-4" />
          <span className="text-xs font-bold">Expiring</span>
        </div>
      );
    case 'missing':
      return (
        <div className="flex items-center gap-2 text-red-600">
          <XCircle className="w-4 h-4" />
          <span className="text-xs font-bold">Missing</span>
        </div>
      );
  }
}
