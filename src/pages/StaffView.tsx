import { useState, useMemo, FormEvent } from 'react';
import { Clock, MapPin, Calendar, CheckCircle2, AlertCircle, Play, Square, FileSignature, UserCircle, Check, X, Edit2, Save } from 'lucide-react';
import { format, differenceInMinutes } from 'date-fns';
import { Link } from 'react-router-dom';

export default function StaffView() {
  const [status, setStatus] = useState<'Confirmed' | 'Accepted' | 'Rejected' | 'Completed'>('Confirmed');
  const [clockedIn, setClockedIn] = useState<Date | null>(null);
  const [clockedOut, setClockedOut] = useState<Date | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showTimesheetForm, setShowTimesheetForm] = useState(false);
  
  const [shiftDetails, setShiftDetails] = useState({
    id: 'SH-2024-089',
    role: 'Senior Healthcare Assistant',
    client: 'St. Jude Care Home',
    location: '124 Willow Lane, London, NW1 4EP',
    date: new Date(),
    startTime: '08:00',
    endTime: '20:00',
    rate: '£15.50/hr',
    notes: 'Please report to Ward Manager Sarah upon arrival. Bring updated ID badge.',
    contactPreference: 'Phone',
  });

  const [timesheetForm, setTimesheetForm] = useState({
    breaks: '60',
    notes: '',
    signature: '',
    agreed: false,
  });

  const complianceAlert = useMemo(() => {
    return { type: 'DBS', daysLeft: 12, status: 'expiring' };
  }, []);

  const duration = useMemo(() => {
    if (clockedIn && clockedOut) {
      const mins = differenceInMinutes(clockedOut, clockedIn);
      const hours = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      return `${hours}h ${remainingMins}m`;
    }
    return null;
  }, [clockedIn, clockedOut]);

  const handleClockIn = () => {
    setClockedIn(new Date());
  };

  const handleClockOut = () => {
    setClockedOut(new Date());
  };

  const handleAccept = () => {
    setStatus('Accepted');
  };

  const handleReject = () => {
    setStatus('Rejected');
  };

  const handleSubmitTimesheet = (e: FormEvent) => {
    e.preventDefault();
    setStatus('Completed');
    setShowTimesheetForm(false);
    alert('Timesheet submitted successfully!');
  };

  if (status === 'Rejected') {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4">
        <div className="p-4 bg-red-50 text-red-600 rounded-full">
          <X className="w-12 h-12" />
        </div>
        <h1 className="text-2xl font-serif font-bold">Shift Rejected</h1>
        <p className="text-rr-text/60 max-w-xs">You have rejected this shift. The agency has been notified.</p>
        <Link to="/" className="text-rr-text font-semibold underline underline-offset-4">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto w-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">Shift Details</h1>
          <Link to="/staff/profile" className="group flex items-center gap-3 mt-3 p-2 -ml-2 rounded-2xl hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-rr-accent/10">
            <div className="w-10 h-10 rounded-full bg-rr-bg border border-rr-accent/20 flex items-center justify-center text-rr-text group-hover:bg-rr-text group-hover:text-rr-bg transition-colors">
              <UserCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-rr-text">Sarah Jenkins</p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-rr-text/40">UK Compliance: Valid</span>
              </div>
            </div>
          </Link>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1 ${
            status === 'Accepted' ? 'bg-blue-100 text-blue-800' : 
            status === 'Completed' ? 'bg-gray-100 text-gray-800' :
            'bg-green-100 text-green-800'
          }`}>
            {status === 'Completed' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
            {status}
          </span>
        </div>
      </div>

      {complianceAlert.status === 'expiring' && (
        <div className="mb-6 bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-center justify-between gap-3 text-orange-800 animate-in slide-in-from-right-4 duration-500">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">Your <strong>{complianceAlert.type}</strong> expires in {complianceAlert.daysLeft} days. Please update it to remain compliant.</p>
          </div>
          <Link to="/staff/profile" className="text-xs font-bold underline underline-offset-4 whitespace-nowrap">Update Now</Link>
        </div>
      )}

      {status === 'Confirmed' && (
        <div className="mb-6 bg-white border border-rr-accent/20 rounded-3xl p-6 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-rr-bg rounded-2xl text-rr-text">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-serif font-semibold text-lg mb-1">New Shift Invitation</h3>
              <p className="text-sm text-rr-text/60 mb-4">Please review the details below and accept or reject this shift.</p>
              <div className="flex gap-3">
                <button 
                  onClick={handleReject}
                  className="flex-1 py-3 px-4 rounded-xl font-semibold border border-red-200 text-red-600 hover:bg-red-50 transition-all flex items-center justify-center gap-2 hover:shadow-sm"
                >
                  <X className="w-4 h-4" /> Reject
                </button>
                <button 
                  onClick={handleAccept}
                  className="flex-1 py-3 px-4 rounded-xl font-semibold bg-rr-text text-rr-bg hover:bg-rr-text/90 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  <Check className="w-4 h-4" /> Accept Shift
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {status === 'Accepted' && !clockedIn && (
        <div className="mb-6 bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-3 text-blue-800 animate-in zoom-in-95 duration-300">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">Shift accepted! You can clock in when you arrive at the location.</p>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-rr-accent/20 overflow-hidden mb-6">
        {/* Shift Header */}
        <div className="p-6 border-b border-rr-accent/10 bg-rr-bg/50 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-serif font-semibold mb-1">{shiftDetails.role}</h2>
            <p className="text-rr-text/70 flex items-center gap-2 text-sm font-medium">
              <MapPin className="w-4 h-4" />
              {shiftDetails.client}
            </p>
          </div>
          {!clockedIn && status !== 'Completed' && (
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isEditing 
                  ? 'bg-rr-text text-rr-bg shadow-md' 
                  : 'bg-rr-bg text-rr-text/60 hover:bg-rr-accent/10'
              }`}
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4" />
                  Edit Details
                </>
              )}
            </button>
          )}
        </div>

        {/* Shift Info Grid */}
        <div className="p-6 grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-xs text-rr-text/50 uppercase tracking-wider font-semibold">Date</p>
            <p className="font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rr-accent" />
              {format(shiftDetails.date, 'EEE, dd MMM yyyy')}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-rr-text/50 uppercase tracking-wider font-semibold">Time</p>
            <p className="font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-rr-accent" />
              {shiftDetails.startTime} - {shiftDetails.endTime}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-rr-text/50 uppercase tracking-wider font-semibold">Location</p>
            <p className="font-medium text-sm leading-snug">{shiftDetails.location}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-rr-text/50 uppercase tracking-wider font-semibold">Contact Pref.</p>
            {isEditing ? (
              <select 
                className="w-full bg-rr-bg/50 border border-rr-accent/20 rounded-lg text-sm p-1"
                value={shiftDetails.contactPreference}
                onChange={(e) => setShiftDetails({...shiftDetails, contactPreference: e.target.value})}
              >
                <option>Phone</option>
                <option>Email</option>
                <option>SMS</option>
              </select>
            ) : (
              <p className="font-medium">{shiftDetails.contactPreference}</p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="px-6 pb-6">
          <div className="bg-rr-bg p-4 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rr-accent" />
                <span className="text-xs font-bold uppercase tracking-wider text-rr-text/40">Staff Notes</span>
              </div>
            </div>
            {isEditing ? (
              <textarea 
                className="w-full bg-white border border-rr-accent/20 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-rr-text/10"
                value={shiftDetails.notes}
                onChange={(e) => setShiftDetails({...shiftDetails, notes: e.target.value})}
                rows={3}
              />
            ) : (
              <p className="text-sm text-rr-text/80 leading-relaxed">{shiftDetails.notes}</p>
            )}
          </div>
        </div>

        {/* Integrated Actions for Confirmed Status */}
        {status === 'Confirmed' && (
          <div className="px-6 pb-6 border-t border-rr-accent/10 pt-6 bg-rr-bg/20">
            <div className="flex gap-3">
              <button 
                onClick={handleReject}
                className="flex-1 py-3 px-4 rounded-xl font-semibold border border-red-200 text-red-600 hover:bg-red-50 transition-all flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" /> Reject
              </button>
              <button 
                onClick={handleAccept}
                className="flex-1 py-3 px-4 rounded-xl font-semibold bg-rr-text text-rr-bg hover:bg-rr-text/90 transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <Check className="w-4 h-4" /> Accept Shift
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Area */}
      {status !== 'Confirmed' && status !== 'Completed' && (
        <div className="space-y-4">
          <h3 className="text-lg font-serif font-semibold mb-4">Time & Attendance</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleClockIn}
              disabled={!!clockedIn}
              className={`flex flex-col items-center justify-center gap-3 p-6 rounded-3xl transition-all duration-300 ${
                clockedIn 
                  ? 'bg-rr-bg border border-rr-accent/20 text-rr-text/50 cursor-not-allowed'
                  : 'bg-rr-text text-rr-bg shadow-lg hover:shadow-xl hover:-translate-y-1'
              }`}
            >
              <div className={`p-3 rounded-full ${clockedIn ? 'bg-rr-accent/20' : 'bg-rr-bg/20'}`}>
                <Play className="w-6 h-6 fill-current" />
              </div>
              <div className="text-center">
                <span className="block font-semibold tracking-wide">Clock In</span>
                {clockedIn && <span className="text-xs mt-1 block opacity-80">{format(clockedIn, 'HH:mm')}</span>}
              </div>
            </button>

            <button
              onClick={handleClockOut}
              disabled={!clockedIn || !!clockedOut}
              className={`flex flex-col items-center justify-center gap-3 p-6 rounded-3xl transition-all duration-300 ${
                !clockedIn || clockedOut
                  ? 'bg-rr-bg border border-rr-accent/20 text-rr-text/50 cursor-not-allowed'
                  : 'bg-red-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-1'
              }`}
            >
              <div className={`p-3 rounded-full ${!clockedIn || clockedOut ? 'bg-rr-accent/20' : 'bg-white/20'}`}>
                <Square className="w-6 h-6 fill-current" />
              </div>
              <div className="text-center">
                <span className="block font-semibold tracking-wide">Clock Out</span>
                {clockedOut && <span className="text-xs mt-1 block opacity-80">{format(clockedOut, 'HH:mm')}</span>}
              </div>
            </button>
          </div>

          {clockedIn && clockedOut && !showTimesheetForm && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-4 flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-green-800 uppercase tracking-wider">Total Duration</p>
                  <p className="text-xl font-serif font-bold text-green-900">{duration}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-600 opacity-20" />
              </div>
              <button 
                onClick={() => setShowTimesheetForm(true)}
                className="w-full bg-rr-text text-rr-bg p-4 rounded-2xl font-semibold tracking-wide flex items-center justify-center gap-3 hover:bg-rr-text/90 transition-colors shadow-md"
              >
                <FileSignature className="w-5 h-5" />
                Submit Timesheet
              </button>
            </div>
          )}

          {showTimesheetForm && (
            <form onSubmit={handleSubmitTimesheet} className="mt-8 bg-white border border-rr-accent/20 rounded-3xl p-6 space-y-6 shadow-sm animate-in slide-in-from-bottom-8 duration-500">
              <h3 className="font-serif font-semibold text-xl">Timesheet Submission</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-rr-text/40 uppercase tracking-wider">Total Duration</label>
                  <input type="text" value={duration || ''} readOnly className="w-full bg-rr-bg/50 border border-rr-accent/10 rounded-xl p-3 text-sm font-semibold" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-rr-text/40 uppercase tracking-wider">Break (Mins)</label>
                  <input 
                    type="number" 
                    value={timesheetForm.breaks}
                    onChange={(e) => setTimesheetForm({...timesheetForm, breaks: e.target.value})}
                    className="w-full bg-rr-bg/30 border border-rr-accent/10 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-rr-text/10" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-rr-text/40 uppercase tracking-wider">Shift Notes / Feedback</label>
                <textarea 
                  rows={4}
                  value={timesheetForm.notes}
                  onChange={(e) => setTimesheetForm({...timesheetForm, notes: e.target.value})}
                  placeholder="Any incidents or feedback for the client?"
                  className="w-full bg-rr-bg/30 border border-rr-accent/10 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-rr-text/10"
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-rr-accent/10">
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    id="agree" 
                    checked={timesheetForm.agreed}
                    onChange={(e) => setTimesheetForm({...timesheetForm, agreed: e.target.checked})}
                    className="mt-1 w-4 h-4 rounded border-rr-accent/30 text-rr-text focus:ring-rr-text"
                  />
                  <label htmlFor="agree" className="text-xs text-rr-text/60 leading-relaxed cursor-pointer">
                    I confirm that the hours recorded above are true and accurate. I understand that any false declaration may lead to disciplinary action.
                  </label>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-rr-text/40 uppercase tracking-widest">Digital Signature (Type Full Name)</label>
                  <input 
                    type="text" 
                    value={timesheetForm.signature}
                    onChange={(e) => setTimesheetForm({...timesheetForm, signature: e.target.value})}
                    placeholder="Full Legal Name"
                    className="w-full bg-rr-bg/30 border border-rr-accent/10 rounded-xl p-3 text-sm font-serif italic focus:outline-none focus:ring-2 focus:ring-rr-text/10" 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={!timesheetForm.agreed || !timesheetForm.signature}
                className="w-full bg-rr-text text-rr-bg p-4 rounded-2xl font-semibold tracking-wide flex items-center justify-center gap-3 hover:bg-rr-text/90 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileSignature className="w-5 h-5" />
                Confirm & Send to Client
              </button>
            </form>
          )}
        </div>
      )}

      {status === 'Completed' && (
        <div className="mt-8 bg-green-50 border border-green-200 rounded-3xl p-8 text-center space-y-4 animate-in zoom-in-95 duration-500">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-green-900">Shift Completed</h2>
          <p className="text-green-800/70 text-sm max-w-xs mx-auto">Your timesheet has been submitted and is awaiting client approval. Great job!</p>
          <Link to="/" className="inline-block mt-4 bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors">
            Back to Dashboard
          </Link>
        </div>
      )}
    </div>
  );
}
