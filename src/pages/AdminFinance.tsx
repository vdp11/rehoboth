import { useState } from 'react';
import { DollarSign, FileText, TrendingUp, ArrowUpRight, ArrowDownRight, Download, Search, Filter, CheckCircle2, Clock } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'Payroll' | 'Invoice';
  entity: string;
  amount: string;
  date: string;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export default function AdminFinance() {
  const [typeFilter, setTypeFilter] = useState<'All' | 'Payroll' | 'Invoice'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Paid' | 'Pending' | 'Overdue'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'INV-2024-001', type: 'Invoice', entity: 'St. Jude Care Home', amount: '£4,250.00', date: '2024-03-01', status: 'Paid' },
    { id: 'PAY-2024-089', type: 'Payroll', entity: 'Sarah Jenkins', amount: '£1,120.50', date: '2024-03-05', status: 'Pending' },
    { id: 'INV-2024-002', type: 'Invoice', entity: 'Meadow View', amount: '£2,800.00', date: '2024-03-02', status: 'Overdue' },
    { id: 'PAY-2024-090', type: 'Payroll', entity: 'John Doe', amount: '£840.00', date: '2024-03-05', status: 'Paid' },
    { id: 'INV-2024-003', type: 'Invoice', entity: 'City Hospital', amount: '£6,100.00', date: '2024-03-04', status: 'Pending' },
  ]);

  const filteredTransactions = transactions.filter(tx => {
    const matchesType = typeFilter === 'All' || tx.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || tx.status === statusFilter;
    const matchesSearch = tx.entity.toLowerCase().includes(searchQuery.toLowerCase()) || tx.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold tracking-tight">Finance & Payroll</h1>
        <p className="text-rr-text/60 text-sm font-medium">Manage agency invoicing and staff payroll.</p>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-rr-accent/20 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="flex items-center text-xs font-bold text-green-600">
              <ArrowUpRight className="w-4 h-4" /> +12%
            </span>
          </div>
          <p className="text-sm text-rr-text/60 font-medium mb-1">Total Revenue (MTD)</p>
          <p className="text-3xl font-serif font-bold">£42,850.00</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-rr-accent/20 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm text-rr-text/60 font-medium mb-1">Pending Payroll</p>
          <p className="text-3xl font-serif font-bold">£12,420.00</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-rr-accent/20 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
              <FileText className="w-6 h-6" />
            </div>
            <span className="flex items-center text-xs font-bold text-red-600">
              5 Invoices
            </span>
          </div>
          <p className="text-sm text-rr-text/60 font-medium mb-1">Overdue Invoices</p>
          <p className="text-3xl font-serif font-bold">£8,150.00</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-rr-accent/20 overflow-hidden">
        <div className="p-6 border-b border-rr-accent/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-rr-bg/30">
          <h2 className="text-xl font-serif font-bold">Recent Transactions</h2>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-rr-text/40" />
              <input 
                type="text" 
                placeholder="Search ID or Entity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white rounded-xl text-xs font-medium border border-rr-accent/20 focus:ring-2 focus:ring-rr-accent/20 w-48"
              />
            </div>
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="px-4 py-2 bg-white rounded-xl text-xs font-bold border border-rr-accent/20 focus:ring-2 focus:ring-rr-accent/20"
            >
              <option value="All">All Types</option>
              <option value="Payroll">Payroll</option>
              <option value="Invoice">Invoice</option>
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 bg-white rounded-xl text-xs font-bold border border-rr-accent/20 focus:ring-2 focus:ring-rr-accent/20"
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
            <button className="px-4 py-2 rounded-xl border border-rr-accent/20 bg-white text-xs font-bold flex items-center gap-2 hover:bg-rr-bg transition-colors">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-rr-bg/50 border-b border-rr-accent/10">
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-rr-text/40">ID & Type</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-rr-text/40">Entity</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-rr-text/40">Amount</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-rr-text/40">Date</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-rr-text/40">Status</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-rr-text/40"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rr-accent/10">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-rr-bg/30 transition-colors group">
                  <td className="p-4">
                    <p className="font-semibold text-sm">{tx.id}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-rr-text/40 mt-0.5">{tx.type}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-medium">{tx.entity}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-bold">{tx.amount}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-rr-text/60">{tx.date}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      tx.status === 'Paid' ? 'bg-green-100 text-green-800' :
                      tx.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 rounded-lg hover:bg-rr-accent/10 text-rr-text/40 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
