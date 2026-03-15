import { useState } from 'react';
import { User, CheckCircle2, XCircle, FileSignature, Star, Clock, MapPin, ShieldCheck, Plus, ChevronRight, Calendar, Users, Info } from 'lucide-react';
import { format } from 'date-fns';

import { useNotification } from '../context/NotificationContext';

interface StaffProfile {
  id: string;
  name: string;
  role: string;
  rating: number;
  compliance: 'Verified' | 'Pending';
  bio: string;
  img: string;
}

export default function ClientView() {
  const { addNotification } = useNotification();
  const [signed, setSigned] = useState(false);
  const [rating, setRating] = useState(0);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'timesheets' | 'requests' | 'staff'>('timesheets');

  const timesheet = {
    id: 'TS-2024-1102',
    staffName: 'Sarah Jenkins',
    role: 'Senior Healthcare Assistant',
    date: new Date(),
    scheduledStart: '08:00',
    scheduledEnd: '20:00',
    actualStart: '07:55',
    actualEnd: '20:15',
    totalHours: '12.25',
    breakDeduction: '1.0',
    payableHours: '11.25',
    complianceStatus: 'Verified',
    profileImg: 'https://picsum.photos/seed/sarah/150/150',
  };

  const staffList: StaffProfile[] = [
    { id: '1', name: 'Sarah Jenkins', role: 'Senior HCA', rating: 4.8, compliance: 'Verified', bio: 'Specialist in dementia care with 8 years experience.', img: 'https://picsum.photos/seed/sarah/150/150' },
    { id: '2', name: 'James Wilson', role: 'Registered Nurse', rating: 4.9, compliance: 'Verified', bio: 'Critical care nurse with extensive hospital background.', img: 'https://picsum.photos/seed/james/150/150' },
    { id: '3', name: 'Emma Thompson', role: 'Healthcare Assistant', rating: 4.5, compliance: 'Verified', bio: 'Compassionate care provider focused on elderly support.', img: 'https://picsum.photos/seed/emma/150/150' },
  ];

  const handlePostShiftRequest = () => {
    setShowRequestForm(false);
    addNotification({
      title: 'Shift Request Posted',
      message: 'Your shift request has been sent to all eligible staff.',
      type: 'success'
    });
  };

  const handleRequestFutureShifts = () => {
    setSelectedStaff(null);
    setShowRequestForm(true);
    addNotification({
      title: 'Requesting Specific Staff',
      message: `You are requesting a shift for ${selectedStaff?.name}.`,
      type: 'info'
    });
  };

  const handleRequestInterview = () => {
    if (!selectedStaff) return;
    addNotification({
      title: 'Interview Requested',
      message: `An interview request has been sent to ${selectedStaff.name}.`,
      type: 'success'
    });
    setSelectedStaff(null);
  };

  const handleContactSupport = () => {
    addNotification({
      title: 'Support Request Initiated',
      message: 'A support representative will contact you shortly.',
      type: 'info'
    });
  };

  const handleSign = () => {
    setSigned(true);
    addNotification({
      title: 'Timesheet Approved',
      message: 'The timesheet has been authorized for payroll processing.',
      type: 'success'
    });
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">Client Portal</h1>
          <p className="text-rr-text/60 text-sm font-medium">Manage your shift requests and staff approvals.</p>
        </div>
        <button 
          onClick={() => setShowRequestForm(true)}
          className="bg-rr-text text-rr-bg px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-rr-text/90 transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Request New Shift
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-white p-1 rounded-2xl border border-rr-accent/20 shadow-sm w-fit">
        {(['timesheets', 'requests', 'staff'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === tab ? 'bg-rr-text text-rr-bg shadow-md' : 'text-rr-text/50 hover:text-rr-text'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'timesheets' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif font-semibold">Pending Approval</h2>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1">
              <Clock className="w-3 h-3" />
              1 Action Required
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Timesheet Details */}
              <div className="bg-white rounded-3xl shadow-sm border border-rr-accent/20 overflow-hidden">
                <div className="p-6 border-b border-rr-accent/10 bg-rr-bg/50 flex justify-between items-center">
                  <h3 className="font-serif font-semibold text-lg">Shift Summary</h3>
                  <p className="text-sm font-medium text-rr-text/70">{format(timesheet.date, 'EEE, dd MMM yyyy')}</p>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-6">
                    <div>
                      <p className="text-xs text-rr-text/50 uppercase tracking-wider font-semibold mb-1">Scheduled</p>
                      <p className="font-medium">{timesheet.scheduledStart} - {timesheet.scheduledEnd}</p>
                    </div>
                    <div>
                      <p className="text-xs text-rr-text/50 uppercase tracking-wider font-semibold mb-1">Actual (Clocked)</p>
                      <p className="font-medium text-rr-text">{timesheet.actualStart} - {timesheet.actualEnd}</p>
                    </div>
                  </div>

                  <div className="bg-rr-bg rounded-2xl p-4 grid grid-cols-3 divide-x divide-rr-accent/20 text-center">
                    <div>
                      <p className="text-xs text-rr-text/50 uppercase tracking-wider font-semibold mb-1">Total</p>
                      <p className="font-serif font-bold text-xl">{timesheet.totalHours}h</p>
                    </div>
                    <div>
                      <p className="text-xs text-rr-text/50 uppercase tracking-wider font-semibold mb-1">Break</p>
                      <p className="font-serif font-bold text-xl text-rr-text/60">-{timesheet.breakDeduction}h</p>
                    </div>
                    <div>
                      <p className="text-xs text-rr-text/50 uppercase tracking-wider font-semibold mb-1">Payable</p>
                      <p className="font-serif font-bold text-xl text-green-700">{timesheet.payableHours}h</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Approval Section */}
              <div className="bg-white rounded-3xl shadow-sm border border-rr-accent/20 overflow-hidden p-6 space-y-6">
                <div>
                  <h3 className="font-serif font-semibold text-lg mb-4">Rate Staff Performance</h3>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star}
                        onClick={() => setRating(star)}
                        className={`p-2 rounded-full transition-colors ${rating >= star ? 'text-yellow-500 bg-yellow-50' : 'text-rr-accent hover:bg-rr-bg'}`}
                      >
                        <Star className={`w-8 h-8 ${rating >= star ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-rr-accent/20 pt-6">
                  <h3 className="font-serif font-semibold text-lg mb-4">Client Signature</h3>
                  
                  {!signed ? (
                    <div className="space-y-4">
                      <div className="h-32 bg-rr-bg rounded-2xl border-2 border-dashed border-rr-accent/40 flex items-center justify-center text-rr-text/40 relative overflow-hidden group">
                        <span className="font-medium tracking-wide z-10">Sign here (Touch/Mouse)</span>
                        <div className="absolute inset-0 hover:bg-rr-accent/5 transition-colors cursor-crosshair"></div>
                      </div>
                      
                      <div className="flex gap-4">
                        <button className="flex-1 py-3 px-4 rounded-xl font-semibold tracking-wide border border-rr-accent/40 text-rr-text/70 hover:bg-rr-bg transition-colors flex items-center justify-center gap-2">
                          <XCircle className="w-5 h-5" />
                          Reject
                        </button>
                        <button 
                          onClick={handleSign}
                          className="flex-1 py-3 px-4 rounded-xl font-semibold tracking-wide bg-rr-text text-rr-bg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                          Approve
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center animate-in zoom-in-95 duration-300">
                      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h4 className="font-serif font-bold text-xl text-green-800 mb-2">Timesheet Approved</h4>
                      <p className="text-green-700/80 text-sm">
                        Thank you. The timesheet has been authorized for payroll processing.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Staff Profile Sidebar */}
              <div className="bg-white rounded-3xl shadow-sm border border-rr-accent/20 overflow-hidden p-6 text-center">
                <img 
                  src={timesheet.profileImg} 
                  alt={timesheet.staffName} 
                  className="w-24 h-24 rounded-full object-cover border-4 border-rr-bg shadow-md mx-auto mb-4"
                  referrerPolicy="no-referrer"
                />
                <h3 className="text-xl font-serif font-bold">{timesheet.staffName}</h3>
                <p className="text-rr-text/60 text-sm font-medium mb-4">{timesheet.role}</p>
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-full mb-6">
                  <ShieldCheck className="w-4 h-4" />
                  UK Compliance Verified
                </div>
                <button 
                  onClick={() => setSelectedStaff(staffList.find(s => s.name === timesheet.staffName) || staffList[0])}
                  className="w-full py-2.5 rounded-xl border border-rr-accent/20 text-xs font-bold hover:bg-rr-bg transition-colors flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" />
                  View Full Profile
                </button>
              </div>

              <div className="bg-rr-text text-rr-bg rounded-3xl p-6 shadow-lg">
                <h4 className="font-serif font-bold text-lg mb-2">Need Help?</h4>
                <p className="text-rr-bg/60 text-xs leading-relaxed mb-4">Our support team is available 24/7 for any urgent staffing issues.</p>
                <button 
                  onClick={handleContactSupport}
                  className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-colors"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'staff' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {staffList.map((staff) => (
            <div 
              key={staff.id}
              onClick={() => setSelectedStaff(staff)}
              className="bg-white border border-rr-accent/20 rounded-3xl p-6 flex items-center gap-4 hover:shadow-md hover:border-rr-text/20 transition-all cursor-pointer group"
            >
              <img src={staff.img} alt={staff.name} className="w-16 h-16 rounded-full object-cover border-2 border-rr-bg shadow-sm" referrerPolicy="no-referrer" />
              <div className="flex-1">
                <h3 className="font-serif font-bold text-lg group-hover:text-rr-text transition-colors">{staff.name}</h3>
                <p className="text-rr-text/50 text-xs font-bold uppercase tracking-widest">{staff.role}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-xs font-bold text-rr-text/70">{staff.rating}</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-rr-accent group-hover:translate-x-1 transition-transform" />
            </div>
          ))}
        </div>
      )}

      {/* Staff Profile Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 z-[100] bg-rr-text/20 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] shadow-2xl border border-rr-accent/20 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="relative h-32 bg-rr-bg">
              <button 
                onClick={() => setSelectedStaff(null)}
                className="absolute top-6 right-6 p-2 bg-white/50 backdrop-blur-md rounded-full hover:bg-white transition-colors z-10"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="px-8 pb-8 -mt-12 relative">
              <img src={selectedStaff.img} alt={selectedStaff.name} className="w-24 h-24 rounded-full border-4 border-white shadow-xl mb-4" referrerPolicy="no-referrer" />
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-3xl font-serif font-bold">{selectedStaff.name}</h3>
                <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4" />
                  {selectedStaff.compliance}
                </div>
              </div>
              <p className="text-rr-text/50 font-bold uppercase tracking-widest text-xs mb-6">{selectedStaff.role}</p>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-rr-text/40 uppercase tracking-widest flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Professional Bio
                  </h4>
                  <p className="text-sm text-rr-text/70 leading-relaxed bg-rr-bg/30 p-4 rounded-2xl italic">
                    "{selectedStaff.bio}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-rr-bg/30 p-4 rounded-2xl text-center">
                    <p className="text-[10px] font-bold text-rr-text/40 uppercase tracking-widest mb-1">Rating</p>
                    <p className="text-xl font-serif font-bold flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      {selectedStaff.rating}
                    </p>
                  </div>
                  <div className="bg-rr-bg/30 p-4 rounded-2xl text-center">
                    <p className="text-[10px] font-bold text-rr-text/40 uppercase tracking-widest mb-1">Experience</p>
                    <p className="text-xl font-serif font-bold">8+ Years</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={handleRequestFutureShifts}
                    className="w-full bg-rr-text text-rr-bg py-4 rounded-2xl font-bold text-sm hover:bg-rr-text/90 transition-all shadow-lg"
                  >
                    Request Shift
                  </button>
                  <button 
                    onClick={handleRequestInterview}
                    className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg"
                  >
                    Request Interview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Request Shift Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 z-[100] bg-rr-text/20 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] shadow-2xl border border-rr-accent/20 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-rr-accent/10 bg-rr-bg/50 flex justify-between items-center">
              <div>
                <h3 className="font-serif font-bold text-2xl">Request Staff</h3>
                <p className="text-sm text-rr-text/60">Fill in the details for your shift requirement.</p>
              </div>
              <button onClick={() => setShowRequestForm(false)} className="p-2 hover:bg-rr-accent/10 rounded-full transition-colors">
                <XCircle className="w-6 h-6 text-rr-text/40" />
              </button>
            </div>
            <form className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-rr-text/40 ml-1">Role Required</label>
                  <select className="w-full bg-rr-bg/30 border border-rr-accent/20 rounded-2xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-rr-text/10">
                    <option>Senior HCA</option>
                    <option>Registered Nurse</option>
                    <option>Healthcare Assistant</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-rr-text/40 ml-1">Date</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-rr-text/30" />
                    <input type="date" className="w-full pl-11 pr-4 py-3 rounded-2xl border border-rr-accent/20 bg-rr-bg/30 text-sm focus:outline-none focus:ring-2 focus:ring-rr-text/10" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-rr-text/40 ml-1">Start Time</label>
                  <input type="time" className="w-full px-4 py-3 rounded-2xl border border-rr-accent/20 bg-rr-bg/30 text-sm focus:outline-none focus:ring-2 focus:ring-rr-text/10" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-rr-text/40 ml-1">End Time</label>
                  <input type="time" className="w-full px-4 py-3 rounded-2xl border border-rr-accent/20 bg-rr-bg/30 text-sm focus:outline-none focus:ring-2 focus:ring-rr-text/10" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-rr-text/40 ml-1">Special Instructions</label>
                <textarea 
                  rows={3}
                  className="w-full bg-rr-bg/30 border border-rr-accent/20 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-rr-text/10"
                  placeholder="e.g. Report to Ward Manager Sarah..."
                />
              </div>

              <button 
                type="button"
                onClick={handlePostShiftRequest}
                className="w-full bg-rr-text text-rr-bg py-4 rounded-2xl font-bold text-sm hover:bg-rr-text/90 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                Post Shift Request
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}
