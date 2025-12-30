import React, { useState } from 'react';
import { Landmark, User, Lock, ArrowRight, UserPlus, ArrowLeft, Briefcase, Loader2 } from 'lucide-react';
import { User as UserType, UserRole } from '../types';
import { fetchUsers, saveUser } from '../services/store';

interface LoginProps {
  onLogin: (user: UserType) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Register State
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole | ''>(''); 

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const users = await fetchUsers();
      const foundUser = users.find(
        (u) => u.username === username && u.password === password
      );

      if (foundUser) {
        if (foundUser.area === 'Menunggu Verifikasi Admin') {
          setError('Akun Anda sedang dalam proses verifikasi oleh Administrator. Mohon tunggu persetujuan.');
          setIsLoading(false);
          return;
        }
        onLogin(foundUser);
      } else {
        setError('Username atau password salah.');
        setIsLoading(false);
      }
    } catch (err) {
      setError('Gagal menghubungkan ke server.');
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    if (!regRole) {
      setError('Silakan pilih jabatan anda terlebih dahulu.');
      setIsLoading(false);
      return;
    }

    try {
      const users = await fetchUsers();
      if (users.some(u => u.username === regUsername)) {
        setError('Username sudah digunakan, silakan pilih yang lain.');
        setIsLoading(false);
        return;
      }

      const newUser: UserType = {
        id: Date.now().toString(),
        username: regUsername,
        password: regPassword,
        fullName: regName,
        role: regRole as UserRole,
        area: 'Menunggu Verifikasi Admin'
      };

      await saveUser(newUser);
      
      setSuccessMsg('Registrasi berhasil! Akun Anda kini menunggu persetujuan Admin sebelum dapat digunakan.');
      setIsRegistering(false);
      setUsername(regUsername);
      setPassword('');
      setRegName('');
      setRegUsername('');
      setRegPassword('');
      setRegRole('');
    } catch (err) {
      setError('Terjadi kesalahan saat mendaftar.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-800 to-emerald-900 animate-gradient-x">
      
      {/* Animated Background Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Floating Card - Glassmorphism */}
      <div className="relative w-full max-w-md mx-4">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur opacity-30 transition duration-1000 group-hover:opacity-100"></div>
        <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/50">
          
          {/* Header Branding */}
          <div className="bg-gradient-to-b from-white/50 to-emerald-50/50 p-8 text-center border-b border-emerald-100/50">
            <h2 className="text-emerald-800 font-extrabold text-2xl tracking-[0.2em] mb-4 drop-shadow-sm">SIPADESA</h2>
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg mb-4 ring-4 ring-white/80 shadow-emerald-500/30">
              <Landmark className="text-white w-12 h-12" />
            </div>
            <h1 className="text-xl font-bold text-gray-800 leading-tight">Sistem Pendataan<br/>Warga Desa</h1>
            <p className="text-sm text-gray-500 mt-2 font-medium">
              {isRegistering ? 'Daftarkan akun baru anda' : 'Masuk untuk mengelola data'}
            </p>
          </div>

          {/* Form Container */}
          <div className="p-8 pt-6">
            {error && (
              <div className="mb-4 bg-red-50/80 backdrop-blur-sm text-red-600 text-sm p-3 rounded-lg border border-red-200 text-center animate-pulse font-medium">
                {error}
              </div>
            )}
            {successMsg && (
              <div className="mb-4 bg-green-50/80 backdrop-blur-sm text-green-700 text-sm p-3 rounded-lg border border-green-200 text-center font-medium">
                {successMsg}
              </div>
            )}

            {!isRegistering ? (
              /* LOGIN FORM */
              <form onSubmit={handleLogin} className="space-y-5 animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Username</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-emerald-500 group-focus-within:text-emerald-600 transition-colors" />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isLoading}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-gray-50/50 focus:bg-white disabled:opacity-50"
                      placeholder="Masukkan username"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-emerald-500 group-focus-within:text-emerald-600 transition-colors" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-gray-50/50 focus:bg-white disabled:opacity-50"
                      placeholder="Masukkan password"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-500/30 text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <><Loader2 className="animate-spin w-4 h-4 mr-2" /> Memuat...</>
                  ) : (
                    <>Masuk Aplikasi <ArrowRight className="ml-2 w-4 h-4" /></>
                  )}
                </button>
                
                <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                  <p className="text-sm text-gray-600 mb-2">Belum punya akun?</p>
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => setIsRegistering(true)}
                    className="text-emerald-600 hover:text-emerald-800 font-bold text-sm flex items-center justify-center mx-auto transition-colors disabled:opacity-50"
                  >
                    <UserPlus className="w-4 h-4 mr-1" /> Daftar Akun Baru
                  </button>
                </div>
              </form>
            ) : (
              /* REGISTER FORM */
              <form onSubmit={handleRegister} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-2 gap-3">
                   <div className="space-y-1 col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Nama Lengkap</label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      disabled={isLoading}
                      className="block w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-gray-50/50 focus:bg-white disabled:opacity-50"
                      placeholder="Nama sesuai KTP"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Username</label>
                    <input
                      type="text"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      disabled={isLoading}
                      className="block w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-gray-50/50 focus:bg-white disabled:opacity-50"
                      placeholder="Username unik"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Password</label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      disabled={isLoading}
                      className="block w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-gray-50/50 focus:bg-white disabled:opacity-50"
                      placeholder="Rahasia"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Daftar Sebagai</label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <Briefcase className="h-5 w-5 text-emerald-500" />
                     </div>
                     <select
                       value={regRole}
                       onChange={(e) => setRegRole(e.target.value as UserRole)}
                       disabled={isLoading}
                       className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-gray-50/50 focus:bg-white appearance-none disabled:opacity-50"
                       required
                     >
                       <option value="" disabled>Pilih Jabatan</option>
                       <option value={UserRole.ADMIN}>Administrator</option>
                       <option value={UserRole.RT_RW}>Ketua RT/RW</option>
                       <option value={UserRole.KADUS}>Kepala Dusun</option>
                       <option value={UserRole.KASI}>Kepala Seksi</option>
                     </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/30 text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transition-all mt-6 disabled:opacity-70"
                >
                   {isLoading ? (
                    <><Loader2 className="animate-spin w-4 h-4 mr-2" /> Memproses...</>
                  ) : (
                    'Daftar Sekarang'
                  )}
                </button>

                <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => setIsRegistering(false)}
                    className="w-full text-gray-500 hover:text-gray-700 font-bold text-sm flex items-center justify-center mt-2 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Login
                </button>
              </form>
            )}
          </div>
        </div>
        <p className="mt-8 text-center text-white/60 text-sm font-medium drop-shadow-md">© 2024 Pemerintah Desa Digital</p>
      </div>
    </div>
  );
};

export default Login;