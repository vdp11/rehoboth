import { useState } from 'react';
import { Calendar, Clock, User, CheckCircle2, XCircle, Search, Filter, MoreVertical, Plus, Mail, Phone, Building2, Sparkles, Loader2 } from 'lucide-react';
import { format, addHours } from 'date-fns';
import { useNotification } from '../context/NotificationContext';
import { GoogleGenAI } from '@google/genai';

interface Interview {
  id: string;
  candidateName: string;
  role: string;
  date: Date;
  time: string;
  interviewer: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Pending Feedback';
  email: string;
  phone: string;
}

interface Shift {
  id: string;
  clientName: string;
  role: string;
  date: Date;
  startTime: string;
  endTime: string;
  staffAssigned?: string;
  status: 'Open' | 'Assigned' | 'Completed' | 'Cancelled';
}

interface Staff {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive' | 'On Leave';
}

export default function AdminInterviews() {
  const { addNotification } = useNotification();
  const [activeTab, setActiveTab] = useState<'interviews' | 'shifts' | 'staff'>('interviews');
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  
  const [newInterview, setNewInterview] = useState<Partial<Interview>>({
    candidateName: '',
    role: '',
    date: new Date(),
    time: '',
    interviewer: '',
    email: '',
    phone: '',
  });

  const [newShift, setNewShift] = useState<Partial<Shift>>({
    clientName: '',
    role: '',
    date: new Date(),
    startTime: '',
    endTime: '',
    staffAssigned: '',
  });

  const [newStaff, setNewStaff] = useState<Partial<Staff>>({
    name: '',
    role: '',
    email: '',
    phone: '',
    status: 'Active',
  });

  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<string>('');
  
  const [staffList, setStaffList] = useState<Staff[]>([
    { id: 'STF-001', name: 'Sarah Jenkins', role: 'Senior HCA', email: 'sarah.j@example.com', phone: '+44 7700 900123', status: 'Active' },
    { id: 'STF-002', name: 'James Wilson', role: 'Registered Nurse', email: 'james.w@example.com', phone: '+44 7700 900456', status: 'Active' },
    { id: 'STF-003', name: 'Emma Thompson', role: 'Healthcare Assistant', email: 'emma.t@example.com', phone: '+44 7700 900789', status: 'On Leave' },
  ]);

  const [interviews, setInterviews] = useState<Interview[]>([
    {
      id: 'INT-001',
      candidateName: 'Alice Thompson',
      role: 'Registered General Nurse (RGN)',
      date: new Date(),
      time: '14:00',
      interviewer: 'Mark Stevens (Compliance Mgr)',
      status: 'Scheduled',
      email: 'alice.t@example.com',
      phone: '+44 7700 900456',
    },
    {
      id: 'INT-002',
      candidateName: 'David Miller',
      role: 'Healthcare Assistant',
      date: new Date(),
      time: '16:30',
      interviewer: 'Sarah Jenkins (Senior HCA)',
      status: 'Pending Feedback',
      email: 'd.miller@example.com',
      phone: '+44 7700 900789',
    },
    {
      id: 'INT-003',
      candidateName: 'Emily Watson',
      role: 'Senior HCA',
      date: new Date(Date.now() + 86400000),
      time: '10:00',
      interviewer: 'Mark Stevens (Compliance Mgr)',
      status: 'Scheduled',
      email: 'emily.w@example.com',
      phone: '+44 7700 900111',
    },
  ]);

  const [shifts, setShifts] = useState<Shift[]>([
    {
      id: 'SHF-001',
      clientName: 'Meadow View Care Home',
      role: 'Healthcare Assistant',
      date: new Date(),
      startTime: '08:00',
      endTime: '20:00',
      staffAssigned: 'Sarah Jenkins',
      status: 'Assigned',
    },
    {
      id: 'SHF-002',
      clientName: 'Sunrise Hospital',
      role: 'Registered General Nurse',
      date: new Date(Date.now() + 86400000),
      startTime: '20:00',
      endTime: '08:00',
      status: 'Open',
    },
  ]);

  const handleScheduleInterview = () => {
    setShowInterviewModal(true);
  };

  const handleCreateShift = () => {
    setShowShiftModal(true);
  };

  const handleAddStaff = () => {
    setShowStaffModal(true);
  };

  const handleScheduleInterviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const interview: Interview = {
      id: `INT-00${interviews.length + 1}`,
      candidateName: newInterview.candidateName || '',
      role: newInterview.role || '',
      date: new Date(newInterview.date || new Date()),
      time: newInterview.time || '',
      interviewer: newInterview.interviewer || '',
      status: 'Scheduled',
      email: newInterview.email || '',
      phone: newInterview.phone || '',
    };
    setInterviews([...interviews, interview]);
    setShowInterviewModal(false);
    setNewInterview({
      candidateName: '', role: '', date: new Date(), time: '', interviewer: '', email: '', phone: ''
    });
    setGeneratedQuestions('');
    addNotification({
      title: 'Interview Scheduled',
      message: `Interview for ${interview.candidateName} has been scheduled.`,
      type: 'success'
    });
  };

  const handleCreateShiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const shift: Shift = {
      id: `SHF-00${shifts.length + 1}`,
      clientName: newShift.clientName || '',
      role: newShift.role || '',
      date: new Date(newShift.date || new Date()),
      startTime: newShift.startTime || '',
      endTime: newShift.endTime || '',
      staffAssigned: newShift.staffAssigned || undefined,
      status: newShift.staffAssigned ? 'Assigned' : 'Open',
    };
    setShifts([...shifts, shift]);
    setShowShiftModal(false);
    setNewShift({
      clientName: '', role: '', date: new Date(), startTime: '', endTime: '', staffAssigned: ''
    });
    addNotification({
      title: 'Shift Created',
      message: `Shift at ${shift.clientName} has been created.`,
      type: 'success'
    });
  };

  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const staff: Staff = {
      id: `STF-00${staffList.length + 1}`,
      name: newStaff.name || '',
      role: newStaff.role || '',
      email: newStaff.email || '',
      phone: newStaff.phone || '',
      status: newStaff.status as 'Active' | 'Inactive' | 'On Leave' || 'Active',
    };
    setStaffList([...staffList, staff]);
    setShowStaffModal(false);
    setNewStaff({
      name: '', role: '', email: '', phone: '', status: 'Active'
    });
    addNotification({
      title: 'Staff Added',
      message: `${staff.name} has been added to the staff directory.`,
      type: 'success'
    });
  };

  const generateInterviewQuestions = async () => {
    if (!newInterview.role) {
      addNotification({ title: 'Error', message: 'Please enter a role first.', type: 'error' });
      return;
    }
    setIsGeneratingQuestions(true);
    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate 3 concise interview questions for a ${newInterview.role} position in a healthcare setting. Return only the questions as a bulleted list.`,
      });
      setGeneratedQuestions(response.text || '');
    } catch (error) {
      console.error(error);
      addNotification({ title: 'Error', message: 'Failed to generate questions. Ensure Gemini API key is set.', type: 'error' });
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">Staff & Scheduling</h1>
          <p className="text-rr-text/60 text-sm font-medium">Manage staff, interviews, and client shifts.</p>
        </div>
        
        <button 
          onClick={activeTab === 'interviews' ? handleScheduleInterview : activeTab === 'shifts' ? handleCreateShift : handleAddStaff}
          className="bg-rr-text text-rr-bg px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-rr-text/90 transition-colors shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {activeTab === 'interviews' ? 'Schedule Interview' : activeTab === 'shifts' ? 'Create Shift' : 'Add Staff'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-rr-accent/20 pb-px">
        <button
          onClick={() => setActiveTab('staff')}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'staff' 
              ? 'border-rr-text text-rr-text' 
              : 'border-transparent text-rr-text/50 hover:text-rr-text'
          }`}
        >
          Staff Directory
        </button>
        <button
          onClick={() => setActiveTab('interviews')}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'interviews' 
              ? 'border-rr-text text-rr-text' 
              : 'border-transparent text-rr-text/50 hover:text-rr-text'
          }`}
        >
          Interviews
        </button>
        <button
          onClick={() => setActiveTab('shifts')}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'shifts' 
              ? 'border-rr-text text-rr-text' 
              : 'border-transparent text-rr-text/50 hover:text-rr-text'
          }`}
        >
          Scheduled Shifts
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-rr-accent/20 overflow-hidden">
        <div className="p-4 border-b border-rr-accent/10 flex flex-col sm:flex-row gap-4 justify-between bg-rr-bg/30">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-rr-text/40" />
            <input 
              type="text" 
              placeholder={`Search ${activeTab}...`}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-rr-accent/20 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-rr-text/10"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-xl border border-rr-accent/20 bg-white text-xs font-bold flex items-center gap-2 hover:bg-rr-bg transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'staff' ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-rr-bg/50 border-b border-rr-accent/10">
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-rr-text/40">Staff Name</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-rr-text/40">Role</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-rr-text/40">Contact</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-rr-text/40">Status</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-rr-text/40"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rr-accent/10">
                {staffList.map((staff) => (
                  <tr key={staff.id} className="hover:bg-rr-bg/30 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-rr-bg border border-rr-accent/20 flex items-center justify-center text-rr-text/40">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{staff.name}</p>
                          <p className="text-xs text-rr-text/50 mt-1">{staff.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-medium">{staff.role}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Mail className="w-4 h-4 text-rr-accent" />
                        {staff.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-rr-text/50 mt-1">
                        <Phone className="w-4 h-4 text-rr-accent" />
                        {staff.phone}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        staff.status === 'Active' ? 'bg-green-100 text-green-800' :
                        staff.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {staff.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 rounded-lg hover:bg-rr-accent/10 text-rr-text/40 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : activeTab === 'interviews' ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-rr-bg/50 border-b border-rr-accent/10">
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-rr-text/40">Candidate</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-rr-text/40">Role & Interviewer</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-rr-text/40">Date & Time</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-rr-text/40">Status</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-rr-text/40"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rr-accent/10">
                {interviews.map((interview) => (
                  <tr key={interview.id} className="hover:bg-rr-bg/30 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-rr-bg border border-rr-accent/20 flex items-center justify-center text-rr-text/40">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{interview.candidateName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Mail className="w-3 h-3 text-rr-text/30" />
                            <span className="text-[10px] text-rr-text/50">{interview.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-medium">{interview.role}</p>
                      <p className="text-xs text-rr-text/50 mt-1">Interviewer: {interview.interviewer}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Calendar className="w-4 h-4 text-rr-accent" />
                        {format(interview.date, 'dd MMM yyyy')}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-rr-text/50 mt-1">
                        <Clock className="w-4 h-4 text-rr-accent" />
                        {interview.time}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        interview.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                        interview.status === 'Pending Feedback' ? 'bg-yellow-100 text-yellow-800' :
                        interview.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {interview.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 rounded-lg hover:bg-rr-accent/10 text-rr-text/40 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-rr-bg/50 border-b border-rr-accent/10">
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-rr-text/40">Client & Role</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-rr-text/40">Date & Time</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-rr-text/40">Assigned Staff</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-rr-text/40">Status</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-rr-text/40"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rr-accent/10">
                {shifts.map((shift) => (
                  <tr key={shift.id} className="hover:bg-rr-bg/30 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rr-bg border border-rr-accent/20 flex items-center justify-center text-rr-text/40">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{shift.clientName}</p>
                          <p className="text-xs text-rr-text/50 mt-1">{shift.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Calendar className="w-4 h-4 text-rr-accent" />
                        {format(shift.date, 'dd MMM yyyy')}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-rr-text/50 mt-1">
                        <Clock className="w-4 h-4 text-rr-accent" />
                        {shift.startTime} - {shift.endTime}
                      </div>
                    </td>
                    <td className="p-4">
                      {shift.staffAssigned ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-rr-accent/20 flex items-center justify-center text-[10px] font-bold">
                            {shift.staffAssigned.charAt(0)}
                          </div>
                          <span className="text-sm font-medium">{shift.staffAssigned}</span>
                        </div>
                      ) : (
                        <span className="text-xs font-medium text-orange-600 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        shift.status === 'Assigned' ? 'bg-blue-100 text-blue-800' :
                        shift.status === 'Open' ? 'bg-orange-100 text-orange-800' :
                        shift.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {shift.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 rounded-lg hover:bg-rr-accent/10 text-rr-text/40 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Schedule Interview Modal */}
      {showInterviewModal && (
        <div className="fixed inset-0 z-[100] bg-rr-text/20 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] shadow-2xl border border-rr-accent/20 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-rr-accent/10 bg-rr-bg/50 flex justify-between items-center shrink-0">
              <div>
                <h3 className="font-serif font-bold text-2xl">Schedule Interview</h3>
                <p className="text-sm text-rr-text/60">Set up a new candidate interview.</p>
              </div>
              <button onClick={() => setShowInterviewModal(false)} className="p-2 hover:bg-rr-accent/10 rounded-full transition-colors">
                <XCircle className="w-6 h-6 text-rr-text/40" />
              </button>
            </div>
            <div className="overflow-y-auto p-8">
              <form id="interview-form" onSubmit={handleScheduleInterviewSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-rr-text/40 ml-1">Candidate Name</label>
                    <select 
                      required
                      value={newInterview.candidateName}
                      onChange={e => setNewInterview({...newInterview, candidateName: e.target.value})}
                      className="w-full px-4 py-3 rounded-2xl border border-rr-accent/20 bg-rr-bg/30 text-sm focus:outline-none focus:ring-2 focus:ring-rr-text/10" 
                    >
                      <option value="">Select Candidate...</option>
                      <option value="Jane Doe">Jane Doe</option>
                      <option value="John Smith">John Smith</option>
                      <option value="Emily Chen">Emily Chen</option>
                      <option value="Michael Brown">Michael Brown</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-rr-text/40 ml-1">Role</label>
                    <select 
                      required
                      value={newInterview.role}
                      onChange={e => setNewInterview({...newInterview, role: e.target.value})}
                      className="w-full px-4 py-3 rounded-2xl border border-rr-accent/20 bg-rr-bg/30 text-sm focus:outline-none focus:ring-2 focus:ring-rr-text/10"
                    >
                      <option value="">Select Role...</option>
                      <option value="Healthcare Assistant">Healthcare Assistant</option>
                      <option value="Senior HCA">Senior HCA</option>
                      <option value="Registered General Nurse (RGN)">Registered General Nurse (RGN)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-rr-text/40 ml-1">Email</label>
                    <input 
                      type="email" 
                      required
                      value={newInterview.email}
                      onChange={e => setNewInterview({...newInterview, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-2xl border border-rr-accent/20 bg-rr-bg/30 text-sm focus:outline-none focus:ring-2 focus:ring-rr-text/10" 
                      placeholder="jane@example.com"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-rr-text/40 ml-1">Phone</label>
                    <input 
                      type="tel" 
                      required
                      value={newInterview.phone}
                      onChange={e => setNewInterview({...newInterview, phone: e.target.value})}
                      className="w-full px-4 py-3 rounded-2xl border border-rr-accent/20 bg-rr-bg/30 text-sm focus:outline-none focus:ring-2 focus:ring-rr-text/10" 
                      placeholder="+44 7700 900000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-rr-text/40 ml-1">Date</label>
                    <input 
                      type="date" 
                      required
                      value={newInterview.date ? format(newInterview.date, 'yyyy-MM-dd') : ''}
                      onChange={e => setNewInterview({...newInterview, date: new Date(e.target.value)})}
                      className="w-full px-4 py-3 rounded-2xl border border-rr-accent/20 bg-rr-bg/30 text-sm focus:outline-none focus:ring-2 focus:ring-rr-text/10" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-rr-text/40 ml-1">Time</label>
                    <input 
                      type="time" 
                      required
                      value={newInterview.time}
                      onChange={e => setNewInterview({...newInterview, time: e.target.value})}
                      className="w-full px-4 py-3 rounded-2xl border border-rr-accent/20 bg-rr-bg/30 text-sm focus:outline-none focus:ring-2 focus:ring-rr-text/10" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-rr-text/40 ml-1">Interviewer</label>
                    <input 
                      type="text" 
                      required
                      value={newInterview.interviewer}
                      onChange={e => setNewInterview({...newInterview, interviewer: e.target.value})}
                      className="w-full px-4 py-3 rounded-2xl border border-rr-accent/20 bg-rr-bg/30 text-sm focus:outline-none focus:ring-2 focus:ring-rr-text/10" 
                      placeholder="e.g. Mark Stevens"
                    />
                  </div>
                </div>

                {/* Gemini Integration */}
                <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-indigo-700">
                      <Sparkles className="w-5 h-5" />
                      <h4 className="font-bold text-sm">AI Interview Assistant</h4>
                    </div>
                    <button
                      type="button"
                      onClick={generateInterviewQuestions}
                      disabled={isGeneratingQuestions || !newInterview.role}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isGeneratingQuestions ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      Generate Questions
                    </button>
                  </div>
                  {generatedQuestions && (
                    <div className="bg-white rounded-xl p-4 text-sm text-rr-text/80 whitespace-pre-wrap border border-indigo-100">
                      {generatedQuestions}
                    </div>
                  )}
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-rr-accent/10 bg-rr-bg/30 shrink-0">
              <button 
                type="submit"
                form="interview-form"
                className="w-full bg-rr-text text-rr-bg py-4 rounded-2xl font-bold text-sm hover:bg-rr-text/90 transition-all shadow-lg"
              >
                Schedule Interview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Shift Modal */}
      {showShiftModal && (
        <div className="fixed inset-0 z-[100] bg-rr-text/20 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] shadow-2xl border border-rr-accent/20 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-rr-accent/10 bg-rr-bg/50 flex justify-between items-center shrink-0">
              <div>
                <h3 className="font-serif font-bold text-2xl">Create Shift</h3>
                <p className="text-sm text-rr-text/60">Create a new shift and assign staff.</p>
              </div>
              <button onClick={() => setShowShiftModal(false)} className="p-2 hover:bg-rr-accent/10 rounded-full transition-colors">
                <XCircle className="w-6 h-6 text-rr-text/40" />
              </button>
            </div>
            <div className="overflow-y-auto p-8">
              <form id="shift-form" onSubmit={handleCreateShiftSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-rr-text/40 ml-1">Client / Location</label>
                    <input 
                      type="text" 
                      required
                      value={newShift.clientName}
                      onChange={e => setNewShift({...newShift, clientName: e.target.value})}
                      className="w-full px-4 py-3 rounded-2xl border border-rr-accent/20 bg-rr-bg/30 text-sm focus:outline-none focus:ring-2 focus:ring-rr-text/10" 
                      placeholder="e.g. Meadow View Care Home"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-rr-text/40 ml-1">Role Required</label>
                    <select 
                      required
                      value={newShift.role}
                      onChange={e => setNewShift({...newShift, role: e.target.value})}
                      className="w-full px-4 py-3 rounded-2xl border border-rr-accent/20 bg-rr-bg/30 text-sm focus:outline-none focus:ring-2 focus:ring-rr-text/10"
                    >
                      <option value="">Select Role...</option>
                      <option value="Healthcare Assistant">Healthcare Assistant</option>
                      <option value="Senior HCA">Senior HCA</option>
                      <option value="Registered General Nurse">Registered General Nurse</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-rr-text/40 ml-1">Date</label>
                    <input 
                      type="date" 
                      required
                      value={newShift.date ? format(newShift.date, 'yyyy-MM-dd') : ''}
                      onChange={e => setNewShift({...newShift, date: new Date(e.target.value)})}
                      className="w-full px-4 py-3 rounded-2xl border border-rr-accent/20 bg-rr-bg/30 text-sm focus:outline-none focus:ring-2 focus:ring-rr-text/10" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-rr-text/40 ml-1">Start Time</label>
                    <input 
                      type="time" 
                      required
                      value={newShift.startTime}
                      onChange={e => setNewShift({...newShift, startTime: e.target.value})}
                      className="w-full px-4 py-3 rounded-2xl border border-rr-accent/20 bg-rr-bg/30 text-sm focus:outline-none focus:ring-2 focus:ring-rr-text/10" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-rr-text/40 ml-1">End Time</label>
                    <input 
                      type="time" 
                      required
                      value={newShift.endTime}
                      onChange={e => setNewShift({...newShift, endTime: e.target.value})}
                      className="w-full px-4 py-3 rounded-2xl border border-rr-accent/20 bg-rr-bg/30 text-sm focus:outline-none focus:ring-2 focus:ring-rr-text/10" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-rr-text/40 ml-1">Assign Staff (Optional)</label>
                  <select 
                    value={newShift.staffAssigned}
                    onChange={e => setNewShift({...newShift, staffAssigned: e.target.value})}
                    className="w-full px-4 py-3 rounded-2xl border border-rr-accent/20 bg-rr-bg/30 text-sm focus:outline-none focus:ring-2 focus:ring-rr-text/10"
                  >
                    <option value="">Leave Unassigned (Broadcast to all)</option>
                    <option value="Sarah Jenkins">Sarah Jenkins</option>
                    <option value="James Wilson">James Wilson</option>
                    <option value="Emma Thompson">Emma Thompson</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-rr-accent/10 bg-rr-bg/30 shrink-0">
              <button 
                type="submit"
                form="shift-form"
                className="w-full bg-rr-text text-rr-bg py-4 rounded-2xl font-bold text-sm hover:bg-rr-text/90 transition-all shadow-lg"
              >
                Create Shift
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Add Staff Modal */}
      {showStaffModal && (
        <div className="fixed inset-0 z-[100] bg-rr-text/20 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] shadow-2xl border border-rr-accent/20 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-rr-accent/10 bg-rr-bg/50 flex justify-between items-center shrink-0">
              <div>
                <h3 className="font-serif font-bold text-2xl">Add Staff</h3>
                <p className="text-sm text-rr-text/60">Add a new staff member to the directory.</p>
              </div>
              <button onClick={() => setShowStaffModal(false)} className="p-2 hover:bg-rr-accent/10 rounded-full transition-colors">
                <XCircle className="w-6 h-6 text-rr-text/40" />
              </button>
            </div>
            <div className="overflow-y-auto p-8">
              <form id="staff-form" onSubmit={handleAddStaffSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-rr-text/40 ml-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={newStaff.name}
                      onChange={e => setNewStaff({...newStaff, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-2xl border border-rr-accent/20 bg-rr-bg/30 text-sm focus:outline-none focus:ring-2 focus:ring-rr-text/10" 
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-rr-text/40 ml-1">Role</label>
                    <select 
                      required
                      value={newStaff.role}
                      onChange={e => setNewStaff({...newStaff, role: e.target.value})}
                      className="w-full px-4 py-3 rounded-2xl border border-rr-accent/20 bg-rr-bg/30 text-sm focus:outline-none focus:ring-2 focus:ring-rr-text/10"
                    >
                      <option value="">Select Role...</option>
                      <option value="Healthcare Assistant">Healthcare Assistant</option>
                      <option value="Senior HCA">Senior HCA</option>
                      <option value="Registered General Nurse">Registered General Nurse</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-rr-text/40 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={newStaff.email}
                      onChange={e => setNewStaff({...newStaff, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-2xl border border-rr-accent/20 bg-rr-bg/30 text-sm focus:outline-none focus:ring-2 focus:ring-rr-text/10" 
                      placeholder="e.g. john.doe@example.com"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-rr-text/40 ml-1">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      value={newStaff.phone}
                      onChange={e => setNewStaff({...newStaff, phone: e.target.value})}
                      className="w-full px-4 py-3 rounded-2xl border border-rr-accent/20 bg-rr-bg/30 text-sm focus:outline-none focus:ring-2 focus:ring-rr-text/10" 
                      placeholder="e.g. +44 7700 900000"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-rr-text/40 ml-1">Status</label>
                  <select 
                    required
                    value={newStaff.status}
                    onChange={e => setNewStaff({...newStaff, status: e.target.value as 'Active' | 'Inactive' | 'On Leave'})}
                    className="w-full px-4 py-3 rounded-2xl border border-rr-accent/20 bg-rr-bg/30 text-sm focus:outline-none focus:ring-2 focus:ring-rr-text/10"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-rr-accent/10 bg-rr-bg/30 shrink-0">
              <button 
                type="submit"
                form="staff-form"
                className="w-full bg-rr-text text-rr-bg py-4 rounded-2xl font-bold text-sm hover:bg-rr-text/90 transition-all shadow-lg"
              >
                Add Staff Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
