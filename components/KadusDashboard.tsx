import React, { useState, useEffect } from 'react';
import { User, Resident } from '../types';
import { getStoredResidents } from '../services/store';
import { Search, CheckCircle2, Map } from 'lucide-react';

interface KadusDashboardProps {
  currentUser: User;
}

const KadusDashboard: React.FC<KadusDashboardProps> = ({ currentUser }) => {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Kadus ideally sees data for their Dusun
    const all = getStoredResidents();
    setResidents(all);
  }, []);

  const filteredResidents = residents.filter(r => 
    (r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || r.nik.includes(searchTerm)) &&
    (currentUser.area ? r.dusun.toLowerCase().includes(currentUser.area.replace('Dusun ', '').toLowerCase()) : true)
  );

  return (
    <div className="space-y-6">
      <div className="bg-emerald-900 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-1">Validasi Data Dusun</h2>
          <p className="text-emerald-200">Wilayah: {currentUser.area || 'Semua Dusun'}</p>
        </div>
        <div className="relative z-10 mt-4 md:mt-0 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
            <span className="text-3xl font-bold block text-center">{filteredResidents.length}</span>
            <span className="text-xs uppercase tracking-wider opacity-80">Total Warga</span>
        </div>
        {/* Decor */}
        <Map className="absolute -right-10 -bottom-10 w-64 h-64 text-emerald-800 opacity-50 rotate-12" />
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-200 mb-4">
            <Search className="text-gray-400 ml-2" />
            <input 
              className="bg-transparent w-full outline-none text-gray-700" 
              placeholder="Filter data warga dusun..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 font-semibold">
              <tr>
                <th className="p-3 rounded-tl-lg">NIK</th>
                <th className="p-3">Nama</th>
                <th className="p-3">L/P</th>
                <th className="p-3">RT/RW</th>
                <th className="p-3">Dusun</th>
                <th className="p-3 text-center rounded-tr-lg">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredResidents.map(r => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-mono text-gray-500">{r.nik}</td>
                  <td className="p-3 font-medium text-gray-800">{r.fullName}</td>
                  <td className="p-3">{r.gender === 'Laki-laki' ? 'L' : 'P'}</td>
                  <td className="p-3">{r.rt}/{r.rw}</td>
                  <td className="p-3 text-emerald-700 font-medium">{r.dusun}</td>
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                      <CheckCircle2 size={12} className="mr-1" /> Terdata
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredResidents.length === 0 && (
            <div className="p-8 text-center text-gray-400">
              Data tidak ditemukan untuk area ini.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KadusDashboard;
