import React, { useState, useEffect } from 'react';
import { AuthState, User, UserRole } from './types';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import RtDashboard from './components/RtDashboard';
import KadusDashboard from './components/KadusDashboard';
import KasiDashboard from './components/KasiDashboard';
import { LogOut, UserCircle, Menu } from 'lucide-react';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    currentUser: null,
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check for session in localStorage on load (simple persistence)
  useEffect(() => {
    const savedUser = localStorage.getItem('sipadesa_session');
    if (savedUser) {
      setAuth({
        isAuthenticated: true,
        currentUser: JSON.parse(savedUser),
      });
    }
  }, []);

  const handleLogin = (user: User) => {
    setAuth({ isAuthenticated: true, currentUser: user });
    localStorage.setItem('sipadesa_session', JSON.stringify(user));
  };

  const handleLogout = () => {
    setAuth({ isAuthenticated: false, currentUser: null });
    localStorage.removeItem('sipadesa_session');
  };

  if (!auth.isAuthenticated || !auth.currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const roleLabels = {
    [UserRole.ADMIN]: 'Administrator',
    [UserRole.RT_RW]: 'Ketua RT/RW',
    [UserRole.KADUS]: 'Kepala Dusun',
    [UserRole.KASI]: 'Kepala Seksi',
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 animate-gradient-x relative flex items-center justify-center p-0 md:p-4 gap-4">
       
       {/* Animated Background Blobs (Global) */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 pointer-events-none"></div>

      {/* FLOATING SIDEBAR (Desktop) */}
      <aside className="hidden md:flex flex-col w-72 h-full rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl text-white overflow-hidden relative z-10">
        <div className="p-8 border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
          <h1 className="text-3xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-teal-200 drop-shadow-sm">SIPADESA</h1>
          <p className="text-xs text-emerald-200/70 mt-1 font-medium tracking-widest uppercase">Sistem Pendataan Desa</p>
        </div>

        <nav className="flex-1 p-6 space-y-4 overflow-y-auto">
          <div className="px-5 py-4 bg-emerald-950/30 rounded-2xl border border-white/5 shadow-inner">
            <p className="text-[10px] uppercase text-emerald-300 font-bold mb-2 tracking-wider">Login Sebagai</p>
            <p className="font-bold text-lg leading-none mb-1">{roleLabels[auth.currentUser.role]}</p>
            {auth.currentUser.area && (
               <span className="inline-block mt-2 text-[10px] bg-emerald-500/20 text-emerald-100 px-2 py-1 rounded border border-emerald-500/30">
                 {auth.currentUser.area}
               </span>
            )}
          </div>

          <div>
             <div className="text-xs text-emerald-200/50 px-2 mt-6 mb-2 uppercase font-bold tracking-widest">Menu Utama</div>
             <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-emerald-600/80 to-teal-600/80 rounded-xl font-bold text-white shadow-lg shadow-emerald-900/20 flex items-center border border-white/10">
               Dashboard
             </button>
             {/* Additional menu items placeholder */}
             <button className="w-full text-left px-4 py-3 mt-2 text-emerald-100/70 hover:bg-white/5 rounded-xl font-medium transition-colors flex items-center">
               Pengaturan
             </button>
          </div>
        </nav>

        <div className="p-6 border-t border-white/10 bg-black/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-200/80 hover:text-red-100 hover:bg-red-500/20 w-full px-4 py-3 rounded-xl transition-all duration-300 group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Keluar Aplikasi</span>
          </button>
        </div>
      </aside>

      {/* FLOATING MAIN CONTENT (The Big Column) */}
      <main className="flex-1 h-full w-full md:rounded-3xl bg-slate-50/95 backdrop-blur-2xl border border-white/50 shadow-2xl relative z-10 flex flex-col overflow-hidden">
        
        {/* Header - Desktop */}
        <header className="hidden md:flex h-20 bg-white/50 backdrop-blur-sm border-b border-gray-200/50 items-center justify-between px-8 sticky top-0 z-20">
           <h2 className="text-gray-500 font-medium">Selamat Datang, <span className="text-emerald-700 font-bold">{auth.currentUser.fullName}</span></h2>
           <div className="flex items-center gap-3 pl-6 border-l border-gray-300/50">
             <div className="flex flex-col items-end">
               <span className="font-bold text-gray-800 text-sm">{auth.currentUser.fullName}</span>
               <span className="text-xs text-gray-500 font-mono">@{auth.currentUser.username}</span>
             </div>
             <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-200 rounded-full flex items-center justify-center text-emerald-700 shadow-sm ring-2 ring-white">
               <UserCircle size={24} />
             </div>
           </div>
        </header>

        {/* Header - Mobile */}
        <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-4 md:hidden sticky top-0 z-30">
          <span className="font-extrabold text-emerald-800 text-lg tracking-wider">SIPADESA</span>
          <div className="flex items-center gap-2">
             <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Menu />
             </button>
          </div>
        </header>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
           <div className="md:hidden absolute top-16 left-0 w-full bg-white z-40 border-b shadow-xl animate-in slide-in-from-top-2">
              <div className="p-4 space-y-2">
                  <div className="px-4 py-2 bg-emerald-50 rounded-lg mb-2">
                    <p className="text-xs text-gray-500">Login sebagai</p>
                    <p className="font-bold text-emerald-800">{roleLabels[auth.currentUser.role]}</p>
                  </div>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-600 font-bold flex items-center gap-2">
                    <LogOut size={16}/> Keluar
                  </button>
              </div>
           </div>
        )}

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {auth.currentUser.role === UserRole.ADMIN && <AdminDashboard currentUser={auth.currentUser} />}
            {auth.currentUser.role === UserRole.RT_RW && <RtDashboard currentUser={auth.currentUser} />}
            {auth.currentUser.role === UserRole.KADUS && <KadusDashboard currentUser={auth.currentUser} />}
            {auth.currentUser.role === UserRole.KASI && <KasiDashboard currentUser={auth.currentUser} />}
          </div>
          <div className="h-8"></div> {/* Bottom spacer */}
        </div>
      </main>
    </div>
  );
};

export default App;