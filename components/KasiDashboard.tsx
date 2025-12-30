import React, { useEffect, useState } from 'react';
import { User, Resident } from '../types';
import { getStoredResidents } from '../services/store';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { FileBarChart2, FileText, Download } from 'lucide-react';

interface KasiDashboardProps {
  currentUser: User;
}

const KasiDashboard: React.FC<KasiDashboardProps> = ({ currentUser }) => {
  const [residents, setResidents] = useState<Resident[]>([]);

  useEffect(() => {
    setResidents(getStoredResidents());
  }, []);

  // Compute Stats
  const genderData = [
    { name: 'Laki-laki', value: residents.filter(r => r.gender === 'Laki-laki').length },
    { name: 'Perempuan', value: residents.filter(r => r.gender === 'Perempuan').length },
  ];

  const COLORS = ['#059669', '#ec4899']; // Emerald and Pink

  const jobStats = residents.reduce((acc, curr) => {
    const job = curr.job || 'Lainnya';
    acc[job] = (acc[job] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const jobData = Object.keys(jobStats).map(key => ({
    name: key,
    jumlah: jobStats[key]
  }));

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-end mb-6">
        <div>
           <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
             <FileBarChart2 className="text-emerald-600"/>
             Analisa Kependudukan
           </h2>
           <p className="text-gray-500 text-sm mt-1">Laporan dan Statistik untuk Seksi Pemerintahan</p>
        </div>
        <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
           <Download size={16}/> Unduh Laporan PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gender Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Distribusi Gender</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Job Chart */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Statistik Pekerjaan</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={jobData}>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false}/>
                <Tooltip cursor={{fill: '#f0fdf4'}} />
                <Bar dataKey="jumlah" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
           <p className="text-xs text-blue-600 uppercase font-bold mb-1">Total Warga</p>
           <p className="text-2xl font-bold text-gray-800">{residents.length}</p>
        </div>
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
           <p className="text-xs text-amber-600 uppercase font-bold mb-1">Warga Tetap</p>
           <p className="text-2xl font-bold text-gray-800">{residents.filter(r => r.status === 'Tetap').length}</p>
        </div>
         <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
           <p className="text-xs text-purple-600 uppercase font-bold mb-1">Warga Kontrak</p>
           <p className="text-2xl font-bold text-gray-800">{residents.filter(r => r.status === 'Kontrak').length}</p>
        </div>
         <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
           <p className="text-xs text-rose-600 uppercase font-bold mb-1">Wiajib KTP</p>
           <p className="text-2xl font-bold text-gray-800">
             {residents.filter(r => {
                const age = new Date().getFullYear() - new Date(r.birthDate).getFullYear();
                return age >= 17;
             }).length}
           </p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-gray-200 flex items-center justify-between">
         <div className="flex gap-4 items-center">
            <div className="bg-gray-100 p-3 rounded-lg">
                <FileText className="text-gray-600"/>
            </div>
            <div>
                <h4 className="font-bold text-gray-800">Rekapitulasi Bulanan</h4>
                <p className="text-sm text-gray-500">Terakhir diperbarui: {new Date().toLocaleDateString()}</p>
            </div>
         </div>
         <button className="text-emerald-600 font-bold text-sm hover:underline">Lihat Detail</button>
      </div>
    </div>
  );
};

export default KasiDashboard;
