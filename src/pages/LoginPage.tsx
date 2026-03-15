import { useState, ReactNode, FormEvent, useRef, useEffect } from 'react';
import { useAuth, UserRole } from '../context/AuthContext';
import { UserCircle, Briefcase, LayoutDashboard, ShieldCheck, ArrowRight, Lock, Mail, Key, ChevronLeft, Calculator, Menu, X } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setIsMenuOpen(false);
    // Pre-fill email based on role for demo convenience
    let defaultEmail = '';
    if (role === 'admin') defaultEmail = 'admin@renewrehoboth.com';
    else if (role === 'staff') defaultEmail = 'staff@renewrehoboth.com';
    else if (role === 'client') defaultEmail = 'client@renewrehoboth.com';
    setEmail(defaultEmail);
  };

  useEffect(() => {
    if (selectedRole && passwordRef.current) {
      passwordRef.current.focus();
    }
  }, [selectedRole]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    // Simulate a small delay for better UX
    setTimeout(() => {
      login(selectedRole);
      setLoading(false);
    }, 1200);
  };

  const resetSelection = () => {
    setSelectedRole(null);
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-rr-bg flex flex-col items-center justify-center p-6 relative">
      {/* Top Right Menu */}
      <div className="absolute top-6 right-6 z-50">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 bg-white rounded-xl border border-rr-accent/20 shadow-sm hover:shadow-md transition-all text-rr-text"
          title="Menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {isMenuOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-rr-accent/20 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2">
            <button
              onClick={() => handleRoleSelect('admin')}
              className="w-full text-left px-4 py-3 text-sm font-medium text-rr-text hover:bg-rr-bg transition-colors flex items-center gap-3"
            >
              <ShieldCheck className="w-4 h-4 text-rr-text/50" />
              Admin Login
            </button>
          </div>
        )}
      </div>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex mb-4">
            <img 
              src="/logo.png" 
              alt="Renew Rehoboth Logo" 
              className="w-32 h-32 object-contain" 
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Fallback if logo.png is missing
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<div class="w-24 h-24 bg-rr-text text-rr-bg rounded-xl flex items-center justify-center font-serif font-bold text-5xl leading-none tracking-tighter mx-auto shadow-xl">RR</div>';
              }}
            />
          </div>
          <h1 className="text-4xl font-serif font-bold tracking-tight text-rr-text">Renew Rehoboth</h1>
          <p className="text-rr-text/60 font-medium">
            {selectedRole ? `Sign in to the ${selectedRole} portal` : 'Select your portal to continue'}
          </p>
        </div>

        {!selectedRole ? (
          <div className="grid grid-cols-1 gap-4">
            <LoginCard 
              role="staff" 
              icon={<UserCircle className="w-6 h-6" />} 
              title="Staff Portal" 
              description="Access your rota, compliance, and timesheets."
              onClick={() => handleRoleSelect('staff')}
            />
            <LoginCard 
              role="client" 
              icon={<Briefcase className="w-6 h-6" />} 
              title="Client Portal" 
              description="Request shifts and approve staff timesheets."
              onClick={() => handleRoleSelect('client')}
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 rounded-3xl border border-rr-accent/20 shadow-sm relative overflow-hidden">
            <button 
              type="button"
              onClick={resetSelection}
              className="absolute top-4 left-4 p-2 rounded-full hover:bg-rr-bg text-rr-text/40 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="pt-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-rr-text/40 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-rr-text/30" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-rr-accent/20 bg-rr-bg/30 text-sm focus:outline-none focus:ring-2 focus:ring-rr-text/10 transition-all"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-rr-text/40 ml-1">Password</label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-rr-text/30" />
                  <input 
                    type="password" 
                    required
                    ref={passwordRef}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-rr-accent/20 bg-rr-bg/30 text-sm focus:outline-none focus:ring-2 focus:ring-rr-text/10 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-rr-text text-rr-bg py-4 rounded-2xl font-bold text-sm hover:bg-rr-text/90 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-rr-bg border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Sign In to Portal
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        <div className="pt-8 text-center">
          <p className="text-xs text-rr-text/40 flex items-center justify-center gap-2">
            <Lock className="w-3 h-3" />
            Secure Enterprise Access
          </p>
        </div>
      </div>
    </div>
  );
}

function LoginCard({ 
  role, 
  icon, 
  title, 
  description, 
  onClick 
}: { 
  role: UserRole; 
  icon: ReactNode; 
  title: string; 
  description: string; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative w-full bg-white border border-rr-accent/20 p-6 rounded-3xl shadow-sm hover:shadow-md hover:border-rr-text/20 transition-all duration-300 text-left flex items-center gap-6 overflow-hidden"
    >
      <div className="p-4 rounded-2xl bg-rr-bg text-rr-text group-hover:bg-rr-text group-hover:text-rr-bg transition-colors duration-300">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-serif font-bold text-rr-text">{title}</h3>
        <p className="text-sm text-rr-text/50 font-medium leading-relaxed">{description}</p>
      </div>
      <div className="shrink-0">
        <ArrowRight className="w-5 h-5 text-rr-accent transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </button>
  );
}
