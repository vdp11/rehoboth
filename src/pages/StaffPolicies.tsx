import { useState } from 'react';
import { FileText, CheckCircle2, ShieldCheck, ChevronRight, Download, Clock } from 'lucide-react';

interface Policy {
  id: string;
  title: string;
  version: string;
  lastUpdated: string;
  status: 'signed' | 'pending';
}

export default function StaffPolicies() {
  const [policies, setPolicies] = useState<Policy[]>([
    { id: '1', title: 'Agency Terms of Engagement', version: 'v2.4', lastUpdated: '2024-01-15', status: 'signed' },
    { id: '2', title: 'Health & Safety Policy', version: 'v1.8', lastUpdated: '2023-11-20', status: 'signed' },
    { id: '3', title: 'Data Protection & GDPR', version: 'v3.1', lastUpdated: '2024-02-10', status: 'pending' },
    { id: '4', title: 'Safeguarding Adults & Children', version: 'v2.0', lastUpdated: '2024-03-01', status: 'pending' },
    { id: '5', title: 'Uniform & Dress Code', version: 'v1.2', lastUpdated: '2023-08-05', status: 'signed' },
  ]);

  const [signingPolicy, setSigningPolicy] = useState<Policy | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [signature, setSignature] = useState('');

  const handleSign = (id: string) => {
    setPolicies(policies.map(p => p.id === id ? { ...p, status: 'signed' } : p));
    setSigningPolicy(null);
    setAgreed(false);
    setSignature('');
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold tracking-tight">Agency Policies</h1>
        <p className="text-rr-text/60 text-sm font-medium">Review and sign mandatory agency policies and terms.</p>
      </div>

      {signingPolicy && (
        <div className="fixed inset-0 z-[100] bg-rr-text/20 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl border border-rr-accent/20 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-rr-accent/10 bg-rr-bg/50">
              <h3 className="font-serif font-bold text-xl">Sign Policy</h3>
              <p className="text-sm text-rr-text/60">{signingPolicy.title} ({signingPolicy.version})</p>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex items-start gap-3">
                <input 
                  type="checkbox" 
                  id="agree" 
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-rr-accent/30 text-rr-text focus:ring-rr-text"
                />
                <label htmlFor="agree" className="text-sm text-rr-text/70 leading-relaxed cursor-pointer">
                  I confirm that I have read, understood, and agree to the terms outlined in the <strong>{signingPolicy.title}</strong>. I understand that this digital signature is legally binding.
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-rr-text/40 uppercase tracking-widest">Digital Signature (Type your full name)</label>
                <input 
                  type="text" 
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="Full Legal Name"
                  className="w-full bg-rr-bg/30 border border-rr-accent/20 rounded-xl p-4 text-lg font-serif italic focus:outline-none focus:ring-2 focus:ring-rr-text/10"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setSigningPolicy(null)}
                  className="flex-1 py-3 px-4 rounded-xl font-semibold border border-rr-accent/20 text-rr-text/50 hover:bg-rr-bg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  disabled={!agreed || !signature}
                  onClick={() => handleSign(signingPolicy.id)}
                  className="flex-1 py-3 px-4 rounded-xl font-semibold bg-rr-text text-rr-bg hover:bg-rr-text/90 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sign & Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {policies.map((policy) => (
          <div 
            key={policy.id} 
            className="bg-white border border-rr-accent/20 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${policy.status === 'signed' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-semibold text-lg">{policy.title}</h3>
                <p className="text-xs text-rr-text/50 font-bold uppercase tracking-wider">Version {policy.version} • Updated {policy.lastUpdated}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-between sm:justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-rr-accent/10">
              {policy.status === 'signed' ? (
                <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1.5 rounded-lg text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  Signed
                </div>
              ) : (
                <div className="flex items-center gap-2 text-yellow-700 bg-yellow-50 px-3 py-1.5 rounded-lg text-xs font-bold">
                  <Clock className="w-4 h-4" />
                  Pending Signature
                </div>
              )}
              
              <div className="flex gap-2">
                <button className="p-2 rounded-lg hover:bg-rr-bg text-rr-text/40 hover:text-rr-text transition-colors border border-transparent hover:border-rr-accent/20">
                  <Download className="w-5 h-5" />
                </button>
                {policy.status === 'pending' && (
                  <button 
                    onClick={() => setSigningPolicy(policy)}
                    className="bg-rr-text text-rr-bg px-4 py-2 rounded-xl text-xs font-bold hover:bg-rr-text/90 transition-colors shadow-sm"
                  >
                    Sign Now
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-rr-bg/50 border border-rr-accent/20 rounded-3xl p-8 text-center space-y-4">
        <ShieldCheck className="w-12 h-12 text-rr-accent mx-auto opacity-30" />
        <h3 className="font-serif font-bold text-xl">Compliance Status</h3>
        <p className="text-sm text-rr-text/60 max-w-sm mx-auto leading-relaxed">
          You have signed {policies.filter(p => p.status === 'signed').length} out of {policies.length} policies. Please ensure all pending documents are signed to remain compliant for shifts.
        </p>
      </div>
    </div>
  );
}
