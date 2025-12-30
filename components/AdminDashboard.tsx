import React, { useState, useEffect } from 'react';
import { User, UserRole, Resident } from '../types';
import { fetchUsers, saveUser, deleteUser, fetchResidents, deleteResident } from '../services/store';
import { Users, UserPlus, KeyRound, Trash2, Database, BarChart3, ShieldCheck, Pencil, Search, FileText, CheckCircle, Loader2 } from 'lucide-react';

interface AdminDashboardProps {
  currentUser: User;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'residents'>('overview');
  const [residentSearch, setResidentSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Form State for User Management
  const [showUserForm, setShowUserForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form Fields
  const [userId, setUserId] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<UserRole>(UserRole.RT_RW);
  const [newArea, setNewArea] = useState('');

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    setIsLoading(true);
    try {
        const u = await fetchUsers();
        const r = await fetchResidents();
        setUsers(u);
        setResidents(r);
    } catch (error) {
        alert("Gagal mengambil data dari server");
    } finally {
        setIsLoading(false);
    }
  };

  const openCreateForm = () => {
    resetForm();
    setIsEditing(false);
    setShowUserForm(true);
  };

  const openEditForm = (user: User) => {
    setUserId(user.id);
    setNewUsername(user.username);
    setNewPassword(user.password || '');
    setNewName(user.fullName);
    setNewRole(user.role);
    setNewArea(user.area || '');
    
    setIsEditing(true);
    setShowUserForm(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const userToSave: User = {
      id: isEditing ? userId : Date.now().toString(),
      username: newUsername,
      password: newPassword, 
      fullName: newName,
      role: newRole,
      area: newArea,
    };

    await saveUser(userToSave);
    setShowUserForm(false);
    resetForm();
    await refreshData();
    setIsLoading(false);
  };

  const handleResetPassword = async (userId: string) => {
    const newPass = prompt("Masukkan password baru untuk user ini:", "123456");
    if (newPass) {
      setIsLoading(true);
      const user = users.find(u => u.id === userId);
      if (user) {
        await saveUser({ ...user, password: newPass });
        await refreshData();
        alert(`Password untuk ${user.username} berhasil diubah.`);
      }
      setIsLoading(false);
    }
  };

  const handleVerifyUser = async (user: User) => {
    let assignedArea = '';
    
    if (user.role === UserRole.RT_RW) {
       assignedArea = prompt("Masukkan Wilayah Kerja RT/RW (Contoh: RT 01 RW 05):", "RT 01 RW 01") || '';
       if (!assignedArea) return; 
    } else if (user.role === UserRole.KADUS) {
       assignedArea = prompt("Masukkan Nama Dusun (Contoh: Dusun Mawar):", "Dusun Mawar") || '';
       if (!assignedArea) return;
    } else {
       if(!confirm("Aktifkan akun ini?")) return;
       assignedArea = ''; 
    }

    setIsLoading(true);
    const updatedUser = { ...user, area: assignedArea };
    await saveUser(updatedUser);
    await refreshData();
    alert(`Akun ${user.fullName} berhasil diverifikasi dan aktif.`);
    setIsLoading(false);
  };

  const handleDeleteUser = async (userToDelete: User) => {
    if (userToDelete.id === currentUser.id) {
        alert("Anda tidak dapat menghapus akun Anda sendiri saat sedang login.");
        return;
    }

    if (confirm(`Apakah anda yakin ingin menghapus user ${userToDelete.username}?`)) {
      setIsLoading(true);
      await deleteUser(userToDelete.id);
      await refreshData();
      setIsLoading(false);
    }
  }

  const handleDeleteResident = async (id: string) => {
    if(confirm("Hapus data warga ini secara permanen?")) {
      setIsLoading(true);
      await deleteResident(id);
      await refreshData();
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setUserId('');
    setNewUsername('');
    setNewPassword('');
    setNewName('');
    setNewRole(UserRole.RT_RW);
    setNewArea('');
  };

  // Statistics
  const totalResidents = residents.length;
  const maleCount = residents.filter(r => r.gender === 'Laki-laki').length;
  const femaleCount = residents.filter(r => r.gender === 'Perempuan').length;

  const filteredResidents = residents.filter(r => 
    r.fullName.toLowerCase().includes(residentSearch.toLowerCase()) || 
    r.nik.includes(residentSearch)
  );

  return (
    <div className="space-y-6 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center rounded-2xl">
            <div className="bg-white p-4 rounded-xl shadow-2xl flex items-center gap-3">
                <Loader2 className="animate-spin text-emerald-600" />
                <span className="font-bold text-gray-700">Sinkronisasi Data...</span>
            </div>
        </div>
      )}

       {/* Top Stats Cards */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100 flex items-center space-x-4 transition-transform hover:scale-[1.02]">
          <div className="p-4 bg-emerald-100/50 text-emerald-600 rounded-2xl">
            <Users size={28} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Warga</p>
            <h3 className="text-3xl font-extrabold text-gray-800">{totalResidents}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100 flex items-center space-x-4 transition-transform hover:scale-[1.02]">
           <div className="p-4 bg-blue-100/50 text-blue-600 rounded-2xl">
            <ShieldCheck size={28} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Pengguna Sistem</p>
            <h3 className="text-3xl font-extrabold text-gray-800">{users.length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100 flex items-center space-x-4 transition-transform hover:scale-[1.02]">
           <div className="p-4 bg-purple-100/50 text-purple-600 rounded-2xl">
            <Database size={28} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Dusun Terdata</p>
            <h3 className="text-3xl font-extrabold text-gray-800">{[...new Set(residents.map(r => r.dusun))].length}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
         {/* Tabs Header */}
        <div className="flex border-b border-gray-100 bg-gray-50/50 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-4 text-sm font-bold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${activeTab === 'overview' ? 'border-emerald-500 text-emerald-700 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
          >
            <BarChart3 size={18}/> Statistik Global
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-6 py-4 text-sm font-bold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${activeTab === 'users' ? 'border-emerald-500 text-emerald-700 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
          >
            <ShieldCheck size={18}/> Manajemen Pengguna
          </button>
           <button 
            onClick={() => setActiveTab('residents')}
            className={`px-6 py-4 text-sm font-bold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${activeTab === 'residents' ? 'border-emerald-500 text-emerald-700 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
          >
            <FileText size={18}/> Data Penduduk
          </button>
        </div>

        <div className="p-6 min-h-[400px]">
           {/* OVERVIEW TAB */}
           {activeTab === 'overview' && (
             <div className="space-y-6 animate-in fade-in duration-300">
               <h3 className="text-xl font-bold text-gray-800">Ringkasan Demografi</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 shadow-sm">
                   <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Sebaran Gender</p>
                   <div className="flex items-center justify-center gap-8">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-2 mx-auto">
                            <Users size={32} />
                        </div>
                        <span className="block text-3xl font-extrabold text-blue-700">{maleCount}</span>
                        <span className="text-xs font-bold text-gray-500 uppercase">Laki-laki</span>
                      </div>
                      <div className="h-16 w-px bg-gray-200"></div>
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 mb-2 mx-auto">
                            <Users size={32} />
                        </div>
                        <span className="block text-3xl font-extrabold text-pink-700">{femaleCount}</span>
                        <span className="text-xs font-bold text-gray-500 uppercase">Perempuan</span>
                      </div>
                   </div>
                 </div>
                 <div className="p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex flex-col justify-center items-center text-center">
                    <Database className="w-12 h-12 text-emerald-300 mb-2" />
                    <p className="text-gray-500 font-medium">Data sistem terupdate secara realtime saat RT/RW melakukan input data. Pastikan untuk selalu memverifikasi akun pengguna baru.</p>
                 </div>
               </div>
             </div>
           )}

           {/* USERS TAB */}
           {activeTab === 'users' && (
             <div className="animate-in fade-in duration-300">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Daftar Pengguna Sistem</h3>
                    <button 
                    onClick={openCreateForm}
                    className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                    >
                    <UserPlus size={18} /> Tambah Pengguna
                    </button>
                </div>
                
                {showUserForm && (
                <div className="mb-8 bg-emerald-50 p-6 rounded-2xl border border-emerald-100 animate-in fade-in slide-in-from-top-4">
                  <h4 className="font-bold text-emerald-800 mb-4">{isEditing ? 'Edit Data Pengguna' : 'Buat Akun Baru'}</h4>
                  <form onSubmit={handleSaveUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <input required placeholder="Username" value={newUsername} onChange={e => setNewUsername(e.target.value)} className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                    <input required={!isEditing} type="text" placeholder="Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                    <input required placeholder="Nama Lengkap" value={newName} onChange={e => setNewName(e.target.value)} className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                    <select value={newRole} onChange={e => setNewRole(e.target.value as UserRole)} className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white">
                      <option value={UserRole.RT_RW}>Ketua RT/RW</option>
                      <option value={UserRole.KADUS}>Kepala Dusun</option>
                      <option value={UserRole.KASI}>Kepala Seksi</option>
                      <option value={UserRole.ADMIN}>Administrator</option>
                    </select>
                    <input placeholder="Area (Contoh: RT 01 / Dusun Mawar)" value={newArea} onChange={e => setNewArea(e.target.value)} className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none md:col-span-2" />
                    <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                      <button type="button" onClick={() => setShowUserForm(false)} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg">Batal</button>
                      <button type="submit" disabled={isLoading} className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow-md disabled:opacity-50">Simpan</button>
                    </div>
                  </form>
                </div>
              )}

              <div className="overflow-hidden rounded-xl border border-gray-200 overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 uppercase font-bold text-xs tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Nama</th>
                            <th className="px-6 py-4">Username</th>
                            <th className="px-6 py-4">Jabatan</th>
                            <th className="px-6 py-4">Wilayah / Status</th>
                            <th className="px-6 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {users.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-bold text-gray-800">{user.fullName}</td>
                            <td className="px-6 py-4 font-mono text-xs">{user.username}</td>
                            <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border 
                                ${user.role === UserRole.ADMIN ? 'bg-red-50 text-red-700 border-red-100' : 
                                user.role === UserRole.RT_RW ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                user.role === UserRole.KADUS ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                'bg-orange-50 text-orange-700 border-orange-100'}`}>
                                {user.role === UserRole.RT_RW ? 'RT/RW' : user.role}
                            </span>
                            </td>
                            <td className="px-6 py-4 text-gray-500">
                                {user.area === 'Menunggu Verifikasi Admin' ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded border border-amber-200 text-[10px] animate-pulse">BUTUH VERIFIKASI</span>
                                    </div>
                                ) : (
                                    user.area || '-'
                                )}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-1">
                                    {user.area === 'Menunggu Verifikasi Admin' && (
                                       <button 
                                         onClick={() => handleVerifyUser(user)} 
                                         className="p-2 bg-emerald-100 text-emerald-600 hover:bg-emerald-200 rounded-lg transition-colors mr-2"
                                         title="Setujui Akun"
                                       >
                                         <CheckCircle size={16} />
                                       </button>
                                    )}

                                    <button onClick={() => openEditForm(user)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Pencil size={16} /></button>
                                    <button onClick={() => handleResetPassword(user.id)} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"><KeyRound size={16} /></button>
                                    
                                    <button 
                                      onClick={() => handleDeleteUser(user)} 
                                      disabled={user.id === currentUser.id}
                                      className={`p-2 rounded-lg transition-colors ${user.id === currentUser.id ? 'text-gray-300 cursor-not-allowed' : 'text-red-600 hover:bg-red-50'}`}
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
              </div>
             </div>
           )}

           {/* RESIDENTS TAB (New) */}
           {activeTab === 'residents' && (
               <div className="animate-in fade-in duration-300">
                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                       <h3 className="text-xl font-bold text-gray-800">Database Kependudukan Lengkap</h3>
                       <div className="relative w-full md:w-auto">
                           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18}/>
                           <input 
                              type="text" 
                              placeholder="Cari NIK atau Nama..." 
                              value={residentSearch}
                              onChange={(e) => setResidentSearch(e.target.value)}
                              className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none w-full md:w-64 bg-gray-50 focus:bg-white transition-all"
                           />
                       </div>
                   </div>

                   <div className="overflow-hidden rounded-xl border border-gray-200 overflow-x-auto">
                       <table className="w-full text-left text-sm text-gray-600">
                           <thead className="bg-gray-50 text-gray-700 uppercase font-bold text-xs tracking-wider">
                               <tr>
                                   <th className="px-6 py-4">NIK</th>
                                   <th className="px-6 py-4">Nama Lengkap</th>
                                   <th className="px-6 py-4">L/P</th>
                                   <th className="px-6 py-4">Alamat</th>
                                   <th className="px-6 py-4">Wilayah</th>
                                   <th className="px-6 py-4 text-right">Aksi</th>
                               </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-100 bg-white">
                               {filteredResidents.map(resident => (
                                   <tr key={resident.id} className="hover:bg-gray-50 transition-colors">
                                       <td className="px-6 py-4 font-mono text-xs">{resident.nik}</td>
                                       <td className="px-6 py-4 font-bold text-gray-800">{resident.fullName}</td>
                                       <td className="px-6 py-4">{resident.gender === 'Laki-laki' ? 'L' : 'P'}</td>
                                       <td className="px-6 py-4 truncate max-w-[150px]">{resident.address}</td>
                                       <td className="px-6 py-4">
                                           <span className="block text-xs font-bold text-emerald-700">RT {resident.rt} / RW {resident.rw}</span>
                                           <span className="text-[10px] text-gray-400 uppercase">{resident.dusun}</span>
                                       </td>
                                       <td className="px-6 py-4 text-right">
                                           <button 
                                             onClick={() => handleDeleteResident(resident.id)}
                                             className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 ml-auto text-xs font-bold"
                                           >
                                               <Trash2 size={14} /> Hapus
                                           </button>
                                       </td>
                                   </tr>
                               ))}
                               {filteredResidents.length === 0 && (
                                   <tr>
                                       <td colSpan={6} className="px-6 py-8 text-center text-gray-400 italic">
                                           Tidak ada data warga yang ditemukan.
                                       </td>
                                   </tr>
                               )}
                           </tbody>
                       </table>
                   </div>
               </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;