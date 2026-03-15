import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, User, Bell, ChevronLeft, LogOut, X, Calendar, Info, CheckCircle2, AlertTriangle, XCircle, LayoutDashboard, FileText, Clock, Building2, Calculator, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useState, useEffect, useRef } from 'react';

export default function Layout() {
  const location = useLocation();
  const { logout, role } = useAuth();
  const { notifications, addNotification, removeNotification } = useNotification();
  const isHome = location.pathname === '/';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Simulate initial notifications based on role
    const timer = setTimeout(() => {
      if (role === 'staff') {
        addNotification({
          title: 'New Shift Available',
          message: 'A new shift matching your preferences is available at Meadow View.',
          link: '/staff/rota',
          linkText: 'View Details',
          type: 'info'
        });
      } else if (role === 'client') {
        addNotification({
          title: 'Timesheets Pending',
          message: 'You have 3 staff timesheets awaiting your approval.',
          link: '/client',
          linkText: 'Review Now',
          type: 'warning'
        });
      } else if (role === 'admin') {
        addNotification({
          title: 'Compliance Alert',
          message: '2 staff members have documents expiring this week.',
          link: '/admin/compliance',
          linkText: 'Check Compliance',
          type: 'error'
        });
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [role, addNotification]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'error': return <XCircle className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 text-green-600 border-green-500';
      case 'warning': return 'bg-orange-50 text-orange-600 border-orange-500';
      case 'error': return 'bg-red-50 text-red-600 border-red-500';
      default: return 'bg-blue-50 text-blue-600 border-blue-500';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-rr-bg text-rr-text font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-rr-bg/90 backdrop-blur-md border-b border-rr-accent/20 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          {!isHome && (
            <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-rr-accent/10 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
          )}
          <Link to="/" className="flex items-center gap-2">
            {/* Logo */}
            <img 
              src="/logo.png" 
              alt="RR" 
              className="w-10 h-10 object-contain" 
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Fallback if logo.png is missing
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<div class="w-8 h-8 bg-rr-text text-rr-bg rounded-sm flex items-center justify-center font-serif font-bold text-lg leading-none tracking-tighter">RR</div>';
              }}
            />
            <span className="font-serif font-semibold text-lg tracking-tight hidden sm:block">
              Renew Rehoboth
            </span>
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-rr-bg border border-rr-accent/20 rounded-full mr-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-rr-text/60">
              {role?.replace('_', ' ')} portal
            </span>
          </div>
          
          <div className="relative" ref={notificationsRef}>
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 rounded-full hover:bg-rr-accent/10 transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-rr-bg"></span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-rr-accent/20 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                <div className="px-4 py-3 border-b border-rr-accent/10 flex items-center justify-between">
                  <p className="text-sm font-bold text-rr-text">Notifications</p>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-rr-text/40">{notifications.length} New</span>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-rr-text/40 text-sm">
                      No new notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div key={notification.id} className="p-4 border-b border-rr-accent/10 hover:bg-rr-bg/50 transition-colors relative">
                        <button 
                          onClick={() => removeNotification(notification.id)}
                          className="absolute top-4 right-4 p-1 text-rr-text/30 hover:text-rr-text hover:bg-rr-bg rounded-lg transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="flex gap-3 pr-6">
                          <div className={`p-2 rounded-xl shrink-0 ${getNotificationColor(notification.type).split(' ').slice(0, 2).join(' ')}`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-rr-text mb-1">{notification.title}</h4>
                            <p className="text-xs text-rr-text/60 font-medium mb-2">
                              {notification.message}
                            </p>
                            {notification.link && (
                              <Link 
                                to={notification.link} 
                                onClick={() => {
                                  setIsNotificationsOpen(false);
                                  removeNotification(notification.id);
                                }}
                                className="text-xs font-bold text-rr-text hover:text-rr-accent underline underline-offset-2"
                              >
                                {notification.linkText || 'View Details'}
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          
          <button 
            onClick={logout}
            className="hidden sm:block p-2 rounded-full hover:bg-red-50 text-rr-text/40 hover:text-red-600 transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>

          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full hover:bg-rr-accent/10 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-rr-accent/20 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-2 border-b border-rr-accent/10 mb-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-rr-text/40">Navigation</p>
                </div>
                
                {role === 'staff' && (
                  <>
                    <Link to="/staff" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-rr-bg text-sm font-medium transition-colors">
                      <LayoutDashboard className="w-4 h-4 text-rr-accent" /> Dashboard
                    </Link>
                    <Link to="/staff/rota" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-rr-bg text-sm font-medium transition-colors">
                      <Calendar className="w-4 h-4 text-rr-accent" /> My Rota
                    </Link>
                    <Link to="/staff/shift" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-rr-bg text-sm font-medium transition-colors">
                      <Clock className="w-4 h-4 text-rr-accent" /> Active Shift
                    </Link>
                    <Link to="/staff/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-rr-bg text-sm font-medium transition-colors">
                      <User className="w-4 h-4 text-rr-accent" /> Profile
                    </Link>
                    <Link to="/staff/policies" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-rr-bg text-sm font-medium transition-colors">
                      <FileText className="w-4 h-4 text-rr-accent" /> Policies
                    </Link>
                  </>
                )}

                {role === 'admin' && (
                  <>
                    <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-rr-bg text-sm font-medium transition-colors">
                      <LayoutDashboard className="w-4 h-4 text-rr-accent" /> Dashboard
                    </Link>
                    <Link to="/admin/interviews" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-rr-bg text-sm font-medium transition-colors">
                      <User className="w-4 h-4 text-rr-accent" /> Staff
                    </Link>
                    <Link to="/admin/clients" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-rr-bg text-sm font-medium transition-colors">
                      <Building2 className="w-4 h-4 text-rr-accent" /> Clients
                    </Link>
                    <Link to="/admin/finance" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-rr-bg text-sm font-medium transition-colors">
                      <Calculator className="w-4 h-4 text-rr-accent" /> Finance
                    </Link>
                    <Link to="/admin/compliance" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-rr-bg text-sm font-medium transition-colors">
                      <ShieldCheck className="w-4 h-4 text-rr-accent" /> Compliance
                    </Link>
                    <Link to="/admin/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-rr-bg text-sm font-medium transition-colors">
                      <User className="w-4 h-4 text-rr-accent" /> Profile
                    </Link>
                  </>
                )}

                {role === 'client' && (
                  <>
                    <Link to="/client" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-rr-bg text-sm font-medium transition-colors">
                      <LayoutDashboard className="w-4 h-4 text-rr-accent" /> Dashboard
                    </Link>
                    <Link to="/client/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-rr-bg text-sm font-medium transition-colors">
                      <User className="w-4 h-4 text-rr-accent" /> Profile
                    </Link>
                  </>
                )}

                <div className="border-t border-rr-accent/10 mt-2 pt-2">
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-sm font-medium text-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative pb-20 sm:pb-0">
        <Outlet />
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      {role === 'staff' && (
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-rr-accent/20 px-6 py-3 flex items-center justify-between z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <Link to="/staff" className={`flex flex-col items-center gap-1 ${location.pathname === '/staff' ? 'text-rr-text' : 'text-rr-text/40 hover:text-rr-text'}`}>
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] font-bold">Home</span>
          </Link>
          <Link to="/staff/rota" className={`flex flex-col items-center gap-1 ${location.pathname === '/staff/rota' ? 'text-rr-text' : 'text-rr-text/40 hover:text-rr-text'}`}>
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] font-bold">Rota</span>
          </Link>
          <Link to="/staff/shift" className={`flex flex-col items-center gap-1 ${location.pathname === '/staff/shift' ? 'text-rr-text' : 'text-rr-text/40 hover:text-rr-text'}`}>
            <Clock className="w-5 h-5" />
            <span className="text-[10px] font-bold">Shift</span>
          </Link>
          <Link to="/staff/profile" className={`flex flex-col items-center gap-1 ${location.pathname === '/staff/profile' ? 'text-rr-text' : 'text-rr-text/40 hover:text-rr-text'}`}>
            <User className="w-5 h-5" />
            <span className="text-[10px] font-bold">Profile</span>
          </Link>
        </nav>
      )}

      {role === 'client' && (
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-rr-accent/20 px-6 py-3 flex items-center justify-around z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <Link to="/client" className={`flex flex-col items-center gap-1 ${location.pathname === '/client' ? 'text-rr-text' : 'text-rr-text/40 hover:text-rr-text'}`}>
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] font-bold">Dashboard</span>
          </Link>
          <Link to="/client/profile" className={`flex flex-col items-center gap-1 ${location.pathname === '/client/profile' ? 'text-rr-text' : 'text-rr-text/40 hover:text-rr-text'}`}>
            <User className="w-5 h-5" />
            <span className="text-[10px] font-bold">Profile</span>
          </Link>
        </nav>
      )}

      {role === 'admin' && (
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-rr-accent/20 px-6 py-3 flex items-center justify-between z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] overflow-x-auto no-scrollbar gap-4">
          <Link to="/admin" className={`flex flex-col items-center gap-1 shrink-0 ${location.pathname === '/admin' ? 'text-rr-text' : 'text-rr-text/40 hover:text-rr-text'}`}>
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] font-bold">Home</span>
          </Link>
          <Link to="/admin/interviews" className={`flex flex-col items-center gap-1 shrink-0 ${location.pathname === '/admin/interviews' ? 'text-rr-text' : 'text-rr-text/40 hover:text-rr-text'}`}>
            <User className="w-5 h-5" />
            <span className="text-[10px] font-bold">Staff</span>
          </Link>
          <Link to="/admin/clients" className={`flex flex-col items-center gap-1 shrink-0 ${location.pathname === '/admin/clients' ? 'text-rr-text' : 'text-rr-text/40 hover:text-rr-text'}`}>
            <Building2 className="w-5 h-5" />
            <span className="text-[10px] font-bold">Clients</span>
          </Link>
          <Link to="/admin/finance" className={`flex flex-col items-center gap-1 shrink-0 ${location.pathname === '/admin/finance' ? 'text-rr-text' : 'text-rr-text/40 hover:text-rr-text'}`}>
            <Calculator className="w-5 h-5" />
            <span className="text-[10px] font-bold">Finance</span>
          </Link>
          <Link to="/admin/compliance" className={`flex flex-col items-center gap-1 shrink-0 ${location.pathname === '/admin/compliance' ? 'text-rr-text' : 'text-rr-text/40 hover:text-rr-text'}`}>
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[10px] font-bold">Compliance</span>
          </Link>
          <Link to="/admin/profile" className={`flex flex-col items-center gap-1 shrink-0 ${location.pathname === '/admin/profile' ? 'text-rr-text' : 'text-rr-text/40 hover:text-rr-text'}`}>
            <User className="w-5 h-5" />
            <span className="text-[10px] font-bold">Profile</span>
          </Link>
        </nav>
      )}

      {/* Toast Notifications */}
      <div className="fixed bottom-20 sm:bottom-6 right-6 z-50 flex flex-col gap-3">
        {notifications.map((notification) => (
          <div key={notification.id} className="animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-xl border border-rr-accent/20 p-4 w-80 flex gap-4 items-start relative overflow-hidden">
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${getNotificationColor(notification.type).split(' ')[2]}`}></div>
              <div className={`p-2 rounded-xl shrink-0 ${getNotificationColor(notification.type).split(' ').slice(0, 2).join(' ')}`}>
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 pt-1">
                <h4 className="text-sm font-bold text-rr-text mb-1">{notification.title}</h4>
                <p className="text-xs text-rr-text/60 font-medium mb-3">
                  {notification.message}
                </p>
                {notification.link && (
                  <Link 
                    to={notification.link} 
                    onClick={() => removeNotification(notification.id)}
                    className="text-xs font-bold text-rr-text hover:text-rr-accent underline underline-offset-2"
                  >
                    {notification.linkText || 'View Details'}
                  </Link>
                )}
              </div>
              <button 
                onClick={() => removeNotification(notification.id)}
                className="p-1 text-rr-text/40 hover:text-rr-text hover:bg-rr-bg rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
