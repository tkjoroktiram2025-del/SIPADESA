import React, { useState, useEffect } from 'react';
import { User, Resident } from '../types';
import { getStoredResidents, saveResident, deleteResident } from '../services/store';
import { Plus, Search, MapPin, User as UserIcon, Briefcase, Calendar } from 'lucide-react';

interface RtDashboardProps {
  currentUser: User;
}

const RtDashboard: React.FC<RtDashboardProps> = ({ currentUser }) => {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [formData, setFormData] = useState<Partial<Resident>>({});

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    // In a real app, we would filter by the RT's area ID from the backend
    // Here we just load all for demo, or filter by client side if user has area set
    const all = getStoredResidents();
    // Simple filter simulation based on currentUser area if populated
    // For demo purposes, we show all but assume RT inputs for their area
    setResidents(all);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.nik) return;

    const newResident: Resident = {
      id: formData.id || Date.now().toString(),
      nik: formData.nik,
      fullName: formData.fullName,
      gender: (formData.gender as 'Laki-laki' | 'Perempuan') || 'Laki-laki',
      birthDate: formData.birthDate || '',
      address: formData.address || '',
      rt: formData.rt || currentUser.area?.split(' ')[1] || '',
      rw: formData.rw || '',
      dusun: formData.dusun || '',
      job: formData.job || '',
      status: (formData.status as 'Tetap' | 'Kontrak') || 'Tetap',
    };

    saveResident(newResident);
    setIsFormOpen(false);
    setFormData({});
    refreshData();
  };

  const handleDelete = (id: string) => {
    if(confirm('Hapus data warga ini?')) {
      deleteResident(id);
      refreshData();
    }
  }

  const filteredResidents = residents.filter(r => 
    r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.nik.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">Data Warga Lingkungan</h2>
           <p className="text-gray-500 text-sm">Kelola data warga di wilayah {currentUser.area || 'RT Anda'}</p>
        </div>
        <button 
          onClick={() => { setFormData({}); setIsFormOpen(true); }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center shadow-lg shadow-emerald-600/20 transition-all"
        >
          <Plus className="mr-2 h-5 w-5" /> Tambah Warga
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input 
          type="text" 
          placeholder="Cari nama atau NIK..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white shadow-sm"
        />
      </div>

      {/* Resident List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResidents.map(resident => (
          <div key={resident.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-gray-800 text-lg group-hover:text-emerald-700 transition-colors">{resident.fullName}</h3>
                <p className="text-xs text-gray-500 font-mono bg-gray-100 inline-block px-1.5 py-0.5 rounded mt-1">{resident.nik}</p>
              </div>
              <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wide
                ${resident.status === 'Tetap' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {resident.status}
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600 mt-4">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-gray-400"/>
                <span>{resident.address} (RT {resident.rt}/RW {resident.rw})</span>
              </div>
               <div className="flex items-center gap-2">
                <Briefcase size={14} className="text-gray-400"/>
                <span>{resident.job}</span>
              </div>
               <div className="flex items-center gap-2">
                <UserIcon size={14} className="text-gray-400"/>
                <span>{resident.gender}, {new Date().getFullYear() - new Date(resident.birthDate).getFullYear()} Thn</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end gap-2">
              <button onClick={() => { setFormData(resident); setIsFormOpen(true); }} className="text-xs text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded font-medium">Edit</button>
              <button onClick={() => handleDelete(resident.id)} className="text-xs text-red-600 hover:bg-red-50 px-3 py-1.5 rounded font-medium">Hapus</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 bg-emerald-50">
              <h3 className="text-xl font-bold text-emerald-900">{formData.id ? 'Edit Warga' : 'Tambah Warga Baru'}</h3>
              <p className="text-sm text-emerald-700">Pastikan data sesuai dengan Kartu Keluarga.</p>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="residentForm" onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">NIK</label>
                  <input required type="text" value={formData.nik || ''} onChange={e => setFormData({...formData, nik: e.target.value})} className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="16 digit NIK"/>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                  <input required type="text" value={formData.fullName || ''} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Sesuai KTP"/>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                   <select className="w-full border rounded-lg p-2.5 bg-white" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value as any})}>
                     <option value="Laki-laki">Laki-laki</option>
                     <option value="Perempuan">Perempuan</option>
                   </select>
                </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
                   <input required type="date" value={formData.birthDate || ''} onChange={e => setFormData({...formData, birthDate: e.target.value})} className="w-full border rounded-lg p-2.5" />
                </div>

                <div className="col-span-2">
                   <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
                   <textarea rows={2} className="w-full border rounded-lg p-2.5" value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})}></textarea>
                </div>

                <div className="grid grid-cols-3 gap-2 col-span-2">
                    <input placeholder="RT" value={formData.rt || ''} onChange={e => setFormData({...formData, rt: e.target.value})} className="border rounded-lg p-2.5" />
                    <input placeholder="RW" value={formData.rw || ''} onChange={e => setFormData({...formData, rw: e.target.value})} className="border rounded-lg p-2.5" />
                    <input placeholder="Dusun" value={formData.dusun || ''} onChange={e => setFormData({...formData, dusun: e.target.value})} className="border rounded-lg p-2.5" />
                </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Pekerjaan</label>
                   <input type="text" value={formData.job || ''} onChange={e => setFormData({...formData, job: e.target.value})} className="w-full border rounded-lg p-2.5" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Status Tempat Tinggal</label>
                   <select className="w-full border rounded-lg p-2.5 bg-white" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                     <option value="Tetap">Tetap</option>
                     <option value="Kontrak">Kontrak</option>
                     <option value="Pindah">Pindah</option>
                   </select>
                </div>

              </form>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors">Batal</button>
              <button type="submit" form="residentForm" className="px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all">Simpan Data</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RtDashboard;
