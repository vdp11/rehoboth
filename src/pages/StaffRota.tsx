import { useState } from 'react';
import { Calendar, Clock, MapPin, ChevronRight, Filter, Search, CheckCircle2, AlertCircle, X, Check, Phone, Mail, MessageSquare } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { Link } from 'react-router-dom';

interface Shift {
  id: string;
  role: string;
  client: string;
  location: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: 'Available' | 'Assigned' | 'Completed';
  rate: string;
  notes?: string;
  contactPreference?: string;
}

export default function StaffRota() {
  const [filter, setFilter] = useState<'All' | 'Available' | 'Assigned' | 'Completed'>('All');
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

  const [shifts, setShifts] = useState<Shift[]>([
    {
      id: 'SH-2024-089',
      role: 'Senior Healthcare Assistant',
      client: 'St. Jude Care Home',
      location: 'London, NW1 4EP',
      date: new Date(),
      startTime: '08:00',
      endTime: '20:00',
      status: 'Assigned',
      rate: '£15.50/hr',
      notes: 'Please report to Sarah. Bring ID.',
      contactPreference: 'Phone',
    },
    {
      id: 'SH-2024-090',
      role: 'Healthcare Assistant',
      client: 'Meadow View',
      location: 'London, SE1 7PB',
      date: addDays(new Date(), 1),
      startTime: '20:00',
      endTime: '08:00',
      status: 'Available',
      rate: '£14.00/hr',
      notes: 'Night shift. Access via side gate.',
      contactPreference: 'SMS',
    },
    {
      id: 'SH-2024-091',
      role: 'Senior Healthcare Assistant',
      client: 'City Hospital',
      location: 'London, EC1A 7BE',
      date: addDays(new Date(), 2),
      startTime: '08:00',
      endTime: '20:00',
      status: 'Available',
      rate: '£18.00/hr',
      notes: 'Ward 4. High intensity.',
      contactPreference: 'Email',
    },
    {
      id: 'SH-2024-088',
      role: 'Healthcare Assistant',
      client: 'St. Jude Care Home',
      location: 'London, NW1 4EP',
      date: addDays(new Date(), -1),
      startTime: '08:00',
      endTime: '20:00',
      status: 'Completed',
      rate: '£14.00/hr',
    },
  ]);

  const filteredShifts = shifts.filter(s => filter === 'All' || s.status === filter);

  const handleStatusChange = (id: string, newStatus: 'Assigned' | 'Available') => {
    setShifts(shifts.map(s => s.id === id ? { ...s, status: newStatus } : s));
    setSelectedShift(null);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">My Rota</h1>
          <p className="text-rr-text/60 text-sm font-medium">Manage your schedule and available shifts.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-rr-accent/20 shadow-sm">
          {(['All', 'Available', 'Assigned', 'Completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === f ? 'bg-rr-text text-rr-bg shadow-sm' : 'text-rr-text/50 hover:text-rr-text'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredShifts.map((shift) => (
          <button
            key={shift.id}
            onClick={() => setSelectedShift(shift)}
            className="w-full text-left block group bg-white border border-rr-accent/20 rounded-2xl p-5 hover:shadow-md transition-all duration-300 relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl shrink-0 ${
                  shift.status === 'Available' ? 'bg-blue-50 text-blue-600' :
                  shift.status === 'Assigned' ? 'bg-green-50 text-green-600' :
                  'bg-gray-50 text-gray-400'
                }`}>
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-lg group-hover:text-rr-text transition-colors">{shift.role}</h3>
                  <p className="text-sm text-rr-text/60 font-medium">{shift.client} • {shift.location}</p>
                  <div className="mt-2 flex flex-wrap gap-3">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-rr-text/50">
                      <Clock className="w-3.5 h-3.5" />
                      {format(shift.date, 'EEE, dd MMM')} • {shift.startTime} - {shift.endTime}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-rr-text/50">
                      <MapPin className="w-3.5 h-3.5" />
                      {shift.rate}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-4 sm:pt-0 border-rr-accent/10">
                <div className="flex flex-col items-end">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    shift.status === 'Available' ? 'bg-blue-100 text-blue-800' :
                    shift.status === 'Assigned' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {shift.status}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-rr-accent group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            
            {shift.status === 'Available' && (
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                <div className="absolute top-0 right-0 bg-blue-500 text-white text-[8px] font-bold uppercase py-1 px-8 transform rotate-45 translate-x-4 -translate-y-1 shadow-sm">
                  New
                </div>
              </div>
            )}
          </button>
        ))}

        {filteredShifts.length === 0 && (
          <div className="text-center py-12 bg-rr-bg/50 rounded-3xl border-2 border-dashed border-rr-accent/20">
            <AlertCircle className="w-12 h-12 text-rr-accent mx-auto mb-4 opacity-20" />
            <p className="text-rr-text/40 font-medium">No shifts found for this filter.</p>
          </div>
        )}
      </div>

      {/* Shift Details Modal */}
      {selectedShift && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-rr-text">{selectedShift.role}</h2>
                  <p className="text-rr-text/60 font-medium">{selectedShift.client}</p>
                </div>
                <button onClick={() => setSelectedShift(null)} className="p-2 hover:bg-rr-bg rounded-full transition-colors">
                  <X className="w-6 h-6 text-rr-text/40" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-rr-text/40">Date & Time</p>
                  <p className="text-sm font-bold flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-rr-accent" />
                    {format(selectedShift.date, 'EEE, dd MMM')}
                  </p>
                  <p className="text-sm font-bold flex items-center gap-2">
                    <Clock className="w-4 h-4 text-rr-accent" />
                    {selectedShift.startTime} - {selectedShift.endTime}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-rr-text/40">Location & Rate</p>
                  <p className="text-sm font-bold flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rr-accent" />
                    {selectedShift.location}
                  </p>
                  <p className="text-sm font-bold text-green-600">{selectedShift.rate}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-rr-bg rounded-2xl space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-rr-text/40">Contact Preference</p>
                  <div className="flex items-center gap-2 text-sm font-bold">
                    {selectedShift.contactPreference === 'Phone' && <Phone className="w-4 h-4" />}
                    {selectedShift.contactPreference === 'Email' && <Mail className="w-4 h-4" />}
                    {selectedShift.contactPreference === 'SMS' && <MessageSquare className="w-4 h-4" />}
                    {selectedShift.contactPreference || 'Not specified'}
                  </div>
                </div>

                <div className="p-4 bg-rr-bg rounded-2xl space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-rr-text/40">Shift Notes</p>
                  <p className="text-sm text-rr-text/80 leading-relaxed">{selectedShift.notes || 'No special instructions provided.'}</p>
                </div>
              </div>

              {selectedShift.status === 'Available' && (
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setSelectedShift(null)}
                    className="flex-1 py-4 rounded-2xl font-bold text-sm border border-rr-accent/20 text-rr-text/60 hover:bg-rr-bg transition-all"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => handleStatusChange(selectedShift.id, 'Assigned')}
                    className="flex-1 py-4 rounded-2xl font-bold text-sm bg-rr-text text-rr-bg hover:bg-rr-text/90 shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" /> Accept Shift
                  </button>
                </div>
              )}

              {selectedShift.status === 'Assigned' && (
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => handleStatusChange(selectedShift.id, 'Available')}
                    className="flex-1 py-4 rounded-2xl font-bold text-sm border border-red-100 text-red-600 hover:bg-red-50 transition-all"
                  >
                    Reject Shift
                  </button>
                  <Link 
                    to="/staff"
                    className="flex-1 py-4 rounded-2xl font-bold text-sm bg-rr-text text-rr-bg hover:bg-rr-text/90 shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    View Active Shift
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
