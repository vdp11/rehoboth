import { useState, ReactNode } from 'react';
import { User, Mail, Phone, MapPin, Upload, CheckCircle2, AlertCircle, Calendar, Globe, Trash2, FileText, ShieldCheck, Eye, RefreshCw, Building2 } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

interface ComplianceDoc {
  id: string;
  type: string;
  status: 'valid' | 'expiring' | 'missing';
  expiryDate?: string;
  fileName?: string;
}

export default function ClientProfile() {
  const { addNotification } = useNotification();
  const [personalInfo, setPersonalInfo] = useState({
    firstName: 'John',
    lastName: 'Smith',
    companyName: 'St. Jude Care Home',
    position: 'Facility Manager',
  });

  const [contactInfo, setContactInfo] = useState({
    email: 'john.smith@stjudecare.com',
    phone: '+44 1632 960123',
    address: '12 Care Lane, Manchester, M1 4AB',
  });

  const [docs, setDocs] = useState<ComplianceDoc[]>([
    { id: '1', type: 'Service Agreement', status: 'valid', expiryDate: '2025-12-31', fileName: 'service_agreement_2024.pdf' },
    { id: '2', type: 'Insurance Certificate', status: 'expiring', expiryDate: '2024-05-01', fileName: 'insurance_cert.pdf' },
    { id: '3', type: 'Health & Safety Policy', status: 'missing' },
  ]);

  const handleUpload = (id: string, fileName: string = 'uploaded_doc.pdf') => {
    setDocs(docs.map(doc => 
      doc.id === id 
        ? { ...doc, status: 'valid', fileName, expiryDate: '2026-01-01' } 
        : doc
    ));
    addNotification({
      title: 'Document Uploaded',
      message: `${fileName} has been uploaded successfully.`,
      type: 'success'
    });
  };

  const handleViewDocument = (fileName: string) => {
    addNotification({
      title: 'Viewing Document',
      message: `Opening ${fileName}...`,
      type: 'info'
    });
  };

  const handleRequestRenewal = (type: string) => {
    addNotification({
      title: 'Renewal Requested',
      message: `A renewal request for ${type} has been sent to the admin.`,
      type: 'success'
    });
  };

  const handleDelete = (id: string, type: string) => {
    setDocs(docs.map(doc => 
      doc.id === id 
        ? { ...doc, status: 'missing', fileName: undefined, expiryDate: undefined } 
        : doc
    ));
    addNotification({
      title: 'Document Deleted',
      message: `${type} document has been removed.`,
      type: 'warning'
    });
  };

  const handleSaveChanges = () => {
    addNotification({
      title: 'Profile Updated',
      message: 'Your profile changes have been saved successfully.',
      type: 'success'
    });
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto w-full space-y-8 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-serif font-bold tracking-tight">Client Profile</h1>
        <div className="flex gap-3">
          <button 
            onClick={handleSaveChanges}
            className="bg-rr-text text-rr-bg px-6 py-2 rounded-xl font-semibold text-sm hover:bg-rr-text/90 transition-colors shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-6 border border-rr-accent/20 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-rr-bg border-2 border-rr-accent/20 overflow-hidden flex items-center justify-center">
            <Building2 className="w-12 h-12 text-rr-text/40" />
          </div>
          <label className="cursor-pointer absolute bottom-0 right-0 p-2 bg-rr-text text-rr-bg rounded-full shadow-lg hover:scale-110 transition-transform">
            <Upload className="w-4 h-4" />
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  addNotification({
                    title: 'Profile Picture Updated',
                    message: `${e.target.files[0].name} uploaded successfully.`,
                    type: 'success'
                  });
                }
              }}
            />
          </label>
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-serif font-bold">{personalInfo.firstName} {personalInfo.lastName}</h2>
          <p className="text-rr-text/60 font-medium">{personalInfo.position} at {personalInfo.companyName}</p>
          <div className="mt-2 flex items-center justify-center sm:justify-start gap-2">
            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider rounded-md">Active Client</span>
            <span className="px-2 py-0.5 bg-rr-bg text-rr-text/60 text-[10px] font-bold uppercase tracking-wider rounded-md">ID: CL-1024</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Information */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-5 h-5 text-rr-accent" />
            <h3 className="font-serif font-semibold text-xl">Contact Details</h3>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-rr-accent/20 space-y-4 shadow-sm">
            <InputField label="First Name" value={personalInfo.firstName} icon={<User className="w-4 h-4" />} />
            <InputField label="Last Name" value={personalInfo.lastName} />
            <InputField label="Company Name" value={personalInfo.companyName} icon={<Building2 className="w-4 h-4" />} />
            <InputField label="Position" value={personalInfo.position} />
          </div>
        </section>

        {/* Contact Information */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="w-5 h-5 text-rr-accent" />
            <h3 className="font-serif font-semibold text-xl">Communication</h3>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-rr-accent/20 space-y-4 shadow-sm">
            <InputField label="Email Address" value={contactInfo.email} icon={<Mail className="w-4 h-4" />} />
            <InputField label="Phone Number" value={contactInfo.phone} icon={<Phone className="w-4 h-4" />} />
            <div className="space-y-1">
              <label className="text-xs font-bold text-rr-text/40 uppercase tracking-wider">Facility Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-rr-accent" />
                <textarea 
                  className="w-full pl-10 pr-4 py-2 bg-rr-bg/30 border border-rr-accent/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rr-text/10 min-h-[80px]"
                  value={contactInfo.address}
                  readOnly
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Compliance Documents */}
      <section id="compliance" className="space-y-4 scroll-mt-24">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-rr-accent" />
            <h3 className="font-serif font-semibold text-xl">Facility Documents</h3>
          </div>
          <span className="text-xs font-bold text-rr-text/40 bg-rr-bg px-3 py-1 rounded-full">
            {docs.filter(d => d.status === 'valid').length}/{docs.length} Verified
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {docs.map((doc) => (
            <div key={doc.id} className="bg-white rounded-2xl p-5 border border-rr-accent/20 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="font-serif font-semibold text-lg leading-tight">{doc.type}</p>
                  {doc.fileName ? (
                    <p className="text-xs text-rr-text/50 flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {doc.fileName}
                    </p>
                  ) : (
                    <p className="text-xs text-red-500 font-medium italic">Document missing</p>
                  )}
                </div>
                <StatusBadge status={doc.status} />
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="text-[10px] font-bold uppercase tracking-widest text-rr-text/40">
                  {doc.expiryDate ? `Expires: ${doc.expiryDate}` : 'No expiry set'}
                </div>
                <div className="flex gap-2">
                  {doc.fileName && (
                    <>
                      <button 
                        onClick={() => handleViewDocument(doc.fileName!)}
                        className="p-2 text-rr-text/40 hover:text-rr-accent hover:bg-rr-accent/10 rounded-lg transition-colors" 
                        title="View Document"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleRequestRenewal(doc.type)}
                        className="p-2 text-rr-text/40 hover:text-rr-accent hover:bg-rr-accent/10 rounded-lg transition-colors" 
                        title="Request Renewal"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(doc.id, doc.type)}
                        className="p-2 text-rr-text/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" 
                        title="Delete Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <label 
                    className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      doc.fileName 
                        ? 'bg-rr-bg text-rr-text/70 hover:bg-rr-accent/10' 
                        : 'bg-rr-text text-rr-bg hover:bg-rr-text/90 shadow-sm'
                    }`}
                  >
                    <Upload className="w-3 h-3" />
                    {doc.fileName ? 'Replace' : 'Upload'}
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleUpload(doc.id, e.target.files[0].name);
                        }
                      }} 
                    />
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function InputField({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-rr-text/40 uppercase tracking-wider">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-rr-accent">{icon}</div>}
        <input 
          type="text" 
          className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2 bg-rr-bg/30 border border-rr-accent/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rr-text/10`}
          value={value}
          readOnly
        />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: ComplianceDoc['status'] }) {
  switch (status) {
    case 'valid':
      return (
        <div className="p-1.5 bg-green-50 text-green-600 rounded-lg flex items-center gap-1.5">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-wider hidden lg:block">Verified</span>
        </div>
      );
    case 'expiring':
      return (
        <div className="p-1.5 bg-orange-50 text-orange-600 rounded-lg flex items-center gap-1.5">
          <AlertCircle className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-wider hidden lg:block">Expiring</span>
        </div>
      );
    case 'missing':
      return (
        <div className="p-1.5 bg-red-50 text-red-600 rounded-lg flex items-center gap-1.5">
          <AlertCircle className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-wider hidden lg:block">Missing</span>
        </div>
      );
  }
}
