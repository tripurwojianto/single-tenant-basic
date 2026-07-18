/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MosqueState, CashTransaction, InventoryItem, Announcement } from '../types';
import { 
  TrendingUp, TrendingDown, Wallet, Box, Megaphone, PlusCircle, 
  ArrowUpRight, ArrowDownRight, Calendar, User, FileText, MapPin, 
  Settings, Check, X, AlertTriangle 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardViewProps {
  state: MosqueState;
  onAddIncome: (income: Omit<CashTransaction, 'id'>) => Promise<void>;
  onAddExpense: (expense: Omit<CashTransaction, 'id'>) => Promise<void>;
  onAddInventory: (item: Omit<InventoryItem, 'id'>) => Promise<void>;
  onAddAnnouncement: (ann: Omit<Announcement, 'id'>) => Promise<void>;
}

export default function DashboardView({ 
  state, 
  onAddIncome, 
  onAddExpense, 
  onAddInventory, 
  onAddAnnouncement 
}: DashboardViewProps) {
  // Modal states
  const [activeModal, setActiveModal] = useState<'income' | 'expense' | 'inventory' | 'announcement' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Income Form State
  const [incomeForm, setIncomeForm] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    kategori: state.categories.filter(c => c.tipe === 'Income')[0]?.nama || 'Infaq Jumat',
    deskripsi: '',
    nominal: '',
    bukti: '',
  });

  // Expense Form State
  const [expenseForm, setExpenseForm] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    kategori: state.categories.filter(c => c.tipe === 'Expense')[0]?.nama || 'Operasional',
    deskripsi: '',
    nominal: '',
    bukti: '',
  });

  // Inventory Form State
  const [inventoryForm, setInventoryForm] = useState({
    namaBarang: '',
    kategori: 'Perlengkapan',
    lokasi: 'Ruang Sholat Utama',
    jumlah: '1',
    kondisi: 'Baik' as 'Baik' | 'Rusak Ringan' | 'Rusak Berat',
    keterangan: '',
  });

  // Announcement Form State
  const [announcementForm, setAnnouncementForm] = useState({
    judul: '',
    isi: '',
    tanggal: new Date().toISOString().split('T')[0],
    status: 'Publish' as 'Draft' | 'Publish',
  });

  // Calculations
  const totalIncome = state.incomes.reduce((sum, item) => sum + item.nominal, 0);
  const totalExpense = state.expenses.reduce((sum, item) => sum + item.nominal, 0);
  const balance = totalIncome - totalExpense;

  // Filter incomes and expenses of current month (e.g., 2026-07)
  const currentMonthStr = new Date().toISOString().slice(0, 7); // "2026-07"
  const monthIncomes = state.incomes
    .filter(item => item.tanggal.startsWith(currentMonthStr))
    .reduce((sum, item) => sum + item.nominal, 0);
  const monthExpenses = state.expenses
    .filter(item => item.tanggal.startsWith(currentMonthStr))
    .reduce((sum, item) => sum + item.nominal, 0);

  const totalInventory = state.inventory.reduce((sum, item) => sum + item.jumlah, 0);
  const latestAnnouncements = state.announcements
    .filter(a => a.status === 'Publish')
    .slice(0, 2);

  // Chart data aggregation (Group by date)
  const last10DaysMap: { [key: string]: { income: number; expense: number } } = {};
  
  // Collect unique dates from transactions and sort them
  const allTx = [...state.incomes, ...state.expenses];
  const sortedDates = allTx
    .map(t => t.tanggal)
    .filter((v, i, self) => self.indexOf(v) === i)
    .sort()
    .slice(-10); // Last 10 days with activity

  sortedDates.forEach(date => {
    last10DaysMap[date] = { income: 0, expense: 0 };
  });

  state.incomes.forEach(inc => {
    if (last10DaysMap[inc.tanggal] !== undefined) {
      last10DaysMap[inc.tanggal].income += inc.nominal;
    }
  });

  state.expenses.forEach(exp => {
    if (last10DaysMap[exp.tanggal] !== undefined) {
      last10DaysMap[exp.tanggal].expense += exp.nominal;
    }
  });

  const chartData = sortedDates.map(date => ({
    date: date.substring(5), // "MM-DD"
    Pemasukan: last10DaysMap[date].income,
    Pengeluaran: last10DaysMap[date].expense,
  }));

  // Monthly Trend Chart Aggregation
  const uniqueMonths = Array.from(
    new Set([
      ...state.incomes.map(item => item.tanggal.substring(0, 7)),
      ...state.expenses.map(item => item.tanggal.substring(0, 7)),
    ])
  ).filter(m => /^\d{4}-\d{2}$/.test(m)).sort();

  let targetMonths = [...uniqueMonths];
  if (targetMonths.length < 6) {
    const today = new Date();
    const tempMonths: string[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      tempMonths.push(`${yyyy}-${mm}`);
    }
    targetMonths = Array.from(new Set([...targetMonths, ...tempMonths])).sort();
  }

  const indonesianMonthNames: { [key: string]: string } = {
    '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05': 'Mei', '06': 'Jun',
    '07': 'Jul', '08': 'Ags', '09': 'Sep', '10': 'Okt', '11': 'Nov', '12': 'Des'
  };

  const monthlyChartData = targetMonths.map(yearMonth => {
    const [year, month] = yearMonth.split('-');
    const label = `${indonesianMonthNames[month]} ${year.substring(2)}`;
    
    const incomeSum = state.incomes
      .filter(item => item.tanggal.startsWith(yearMonth))
      .reduce((sum, item) => sum + item.nominal, 0);
      
    const expenseSum = state.expenses
      .filter(item => item.tanggal.startsWith(yearMonth))
      .reduce((sum, item) => sum + item.nominal, 0);

    return {
      period: yearMonth,
      label,
      Pemasukan: incomeSum,
      Pengeluaran: expenseSum,
    };
  });

  // Handlers
  const handleIncomeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incomeForm.nominal || Number(incomeForm.nominal) <= 0) {
      setError('Nominal harus lebih besar dari 0');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onAddIncome({
        tanggal: incomeForm.tanggal,
        kategori: incomeForm.kategori,
        deskripsi: incomeForm.deskripsi,
        nominal: Number(incomeForm.nominal),
        bukti: incomeForm.bukti,
      });
      setActiveModal(null);
      setIncomeForm({
        tanggal: new Date().toISOString().split('T')[0],
        kategori: state.categories.filter(c => c.tipe === 'Income')[0]?.nama || 'Infaq Jumat',
        deskripsi: '',
        nominal: '',
        bukti: '',
      });
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan transaksi');
    } finally {
      setLoading(false);
    }
  };

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.nominal || Number(expenseForm.nominal) <= 0) {
      setError('Nominal harus lebih besar dari 0');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onAddExpense({
        tanggal: expenseForm.tanggal,
        kategori: expenseForm.kategori,
        deskripsi: expenseForm.deskripsi,
        nominal: Number(expenseForm.nominal),
        bukti: expenseForm.bukti,
      });
      setActiveModal(null);
      setExpenseForm({
        tanggal: new Date().toISOString().split('T')[0],
        kategori: state.categories.filter(c => c.tipe === 'Expense')[0]?.nama || 'Operasional',
        deskripsi: '',
        nominal: '',
        bukti: '',
      });
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan transaksi');
    } finally {
      setLoading(false);
    }
  };

  const handleInventorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inventoryForm.namaBarang) {
      setError('Nama barang wajib diisi');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onAddInventory({
        namaBarang: inventoryForm.namaBarang,
        kategori: inventoryForm.kategori,
        lokasi: inventoryForm.lokasi,
        jumlah: Number(inventoryForm.jumlah || 1),
        kondisi: inventoryForm.kondisi,
        keterangan: inventoryForm.keterangan,
      });
      setActiveModal(null);
      setInventoryForm({
        namaBarang: '',
        kategori: 'Perlengkapan',
        lokasi: 'Ruang Sholat Utama',
        jumlah: '1',
        kondisi: 'Baik',
        keterangan: '',
      });
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan inventaris');
    } finally {
      setLoading(false);
    }
  };

  const handleAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementForm.judul || !announcementForm.isi) {
      setError('Judul dan isi pengumuman wajib diisi');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onAddAnnouncement(announcementForm);
      setActiveModal(null);
      setAnnouncementForm({
        judul: '',
        isi: '',
        tanggal: new Date().toISOString().split('T')[0],
        status: 'Publish',
      });
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan pengumuman');
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  // Sort all transactions to get latest 4
  const allTransactions = [
    ...state.incomes.map(item => ({ ...item, tipe: 'Income' as const })),
    ...state.expenses.map(item => ({ ...item, tipe: 'Expense' as const }))
  ].sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());

  const latestTransactions = allTransactions.slice(0, 4);

  return (
    <div id="dashboard-view" className="space-y-6 animate-fade-in">
      {/* Mosque Profile Header styled as a clean Bento Card */}
      <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {state.info.logo ? (
            <img 
              src={state.info.logo} 
              alt="Logo" 
              className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shadow-sm"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center font-display font-bold text-white text-2xl shadow-md">
              {state.info.namaMasjid ? state.info.namaMasjid.substring(0, 2).toUpperCase() : 'KM'}
            </div>
          )}
          <div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 leading-tight">
              {state.info.namaMasjid || 'Masjid Al-Ikhlas'}
            </h1>
            <p className="text-slate-500 text-sm font-sans mt-1 italic">
              "{state.info.tagline || 'Mengabdi untuk Kemaslahatan Ummat'}"
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Status Server</span>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 justify-end">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span> Google Sheets Connected
            </span>
          </div>
        </div>
      </div>

      {/* Bento Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Stat: Total Saldo (col-span-6) */}
        <div className="md:col-span-12 lg:col-span-6 bg-emerald-600 rounded-[32px] p-8 text-white shadow-xl shadow-emerald-950/10 flex flex-col justify-between min-h-[220px]">
          <div>
            <p className="text-emerald-100 font-semibold uppercase tracking-[0.2em] text-[10px]">Total Saldo Kas</p>
            <h3 className="text-4xl sm:text-5xl font-black mt-2 tracking-tight font-display">
              {formatRupiah(balance)}
            </h3>
          </div>
          <div className="flex justify-between items-end border-t border-emerald-500/50 pt-4 mt-6">
            <div className="flex gap-6">
              <div>
                <p className="text-[10px] text-emerald-200 uppercase tracking-wider font-semibold">Pemasukan Bln Ini</p>
                <p className="font-bold text-sm">+{formatRupiah(monthIncomes)}</p>
              </div>
              <div>
                <p className="text-[10px] text-emerald-200 uppercase tracking-wider font-semibold">Pengeluaran Bln Ini</p>
                <p className="font-bold text-sm">-{formatRupiah(monthExpenses)}</p>
              </div>
            </div>
            <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase backdrop-blur-md">v1.0.0 Stable</span>
          </div>
        </div>

        {/* Stat: Inventaris Metric (col-span-3) */}
        <div className="md:col-span-6 lg:col-span-3 bg-white border border-slate-200 rounded-[32px] p-6 flex flex-col justify-center items-center text-center min-h-[220px]">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-4 font-bold text-xl">
            {totalInventory}
          </div>
          <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Inventaris</p>
          <p className="text-sm font-medium text-slate-400 mt-1">Barang Tercatat</p>
        </div>

        {/* Stat: Pengumuman Metric (col-span-3) */}
        <div className="md:col-span-6 lg:col-span-3 bg-white border border-slate-200 rounded-[32px] p-6 flex flex-col justify-center items-center text-center min-h-[220px]">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 font-bold text-xl">
            {state.announcements.filter(a => a.status === 'Publish').length}
          </div>
          <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Pengumuman</p>
          <p className="text-sm font-medium text-slate-400 mt-1">Terbit Publik</p>
        </div>

        {/* Quick Actions (col-span-4) */}
        <div className="md:col-span-12 lg:col-span-4 bg-white border border-slate-200 rounded-[32px] p-8 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Aksi Cepat Admin</h4>
            <div className="space-y-3">
              <button 
                onClick={() => setActiveModal('income')}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-emerald-50 rounded-2xl border border-transparent hover:border-emerald-100 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-lg">+</div>
                  <div className="text-left">
                    <p className="font-bold text-slate-800 text-sm">Tambah Pemasukan</p>
                    <p className="text-[10px] text-slate-500 uppercase">Infaq, Sedekah, Donasi</p>
                  </div>
                </div>
                <span className="text-slate-300 group-hover:text-emerald-500 transition-colors">→</span>
              </button>

              <button 
                onClick={() => setActiveModal('expense')}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-red-50 rounded-2xl border border-transparent hover:border-red-100 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center font-bold text-lg">-</div>
                  <div className="text-left">
                    <p className="font-bold text-slate-800 text-sm">Tambah Pengeluaran</p>
                    <p className="text-[10px] text-slate-500 uppercase">Operasional, Gaji, Listrik</p>
                  </div>
                </div>
                <span className="text-slate-300 group-hover:text-red-500 transition-colors">→</span>
              </button>

              <button 
                onClick={() => setActiveModal('inventory')}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-amber-50 rounded-2xl border border-transparent hover:border-amber-100 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center text-lg">📦</div>
                  <div className="text-left">
                    <p className="font-bold text-slate-800 text-sm">Catat Inventaris</p>
                    <p className="text-[10px] text-slate-500 uppercase">Aset & Perlengkapan</p>
                  </div>
                </div>
                <span className="text-slate-300 group-hover:text-amber-500 transition-colors">→</span>
              </button>

              <button 
                onClick={() => setActiveModal('announcement')}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-blue-50 rounded-2xl border border-transparent hover:border-blue-100 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-lg">📢</div>
                  <div className="text-left">
                    <p className="font-bold text-slate-800 text-sm">Buat Pengumuman</p>
                    <p className="text-[10px] text-slate-500 uppercase">DKM, Agenda, Kajian</p>
                  </div>
                </div>
                <span className="text-slate-300 group-hover:text-blue-500 transition-colors">→</span>
              </button>
            </div>
          </div>
          <div className="mt-6 border-t border-slate-100 pt-4">
            <p className="text-[10px] text-slate-400 text-center font-medium">BASIC EDITION • SECURE SYSTEM</p>
          </div>
        </div>

        {/* Recent Activity Table (col-span-8) */}
        <div className="md:col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-[32px] p-8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ringkasan Arus Kas</h4>
              <span className="text-[10px] font-bold text-emerald-600 uppercase">Aktual Terakhir</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-[10px] text-slate-400 uppercase border-b border-slate-100">
                    <th className="pb-4 font-bold">Tanggal</th>
                    <th className="pb-4 font-bold">Kategori</th>
                    <th className="pb-4 font-bold">Keterangan</th>
                    <th className="pb-4 font-bold text-right">Nominal</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-50">
                  {latestTransactions.length > 0 ? (
                    latestTransactions.map((tx, idx) => (
                      <tr key={idx}>
                        <td className="py-4 text-slate-500 font-medium text-xs whitespace-nowrap">{tx.tanggal}</td>
                        <td className="py-4">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${
                            tx.tipe === 'Income' 
                              ? 'bg-emerald-50 text-emerald-600' 
                              : 'bg-rose-50 text-rose-600'
                          }`}>
                            {tx.kategori}
                          </span>
                        </td>
                        <td className="py-4 font-medium text-slate-700 text-xs max-w-[180px] truncate" title={tx.deskripsi}>
                          {tx.deskripsi || '-'}
                        </td>
                        <td className={`py-4 text-right font-bold text-xs whitespace-nowrap ${
                          tx.tipe === 'Income' ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                          {tx.tipe === 'Income' ? '+' : '-'} {formatRupiah(tx.nominal)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-xs text-slate-400">
                        Belum ada transaksi tercatat.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-[10px] font-medium text-slate-400 italic">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            Terintegrasi Realtime dengan Google Sheets
          </div>
        </div>

        {/* Trend Area Chart (col-span-8) */}
        <div className="md:col-span-12 lg:col-span-8 bg-white p-6 sm:p-8 rounded-[32px] border border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg text-slate-900">Grafik Arus Kas Aktual</h3>
              <p className="text-xs text-slate-500">Aliran dana kas harian pada hari dengan transaksi aktif</p>
            </div>
            <div className="flex gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block"></span>
                <span>Pemasukan</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 block"></span>
                <span>Pengeluaran</span>
              </div>
            </div>
          </div>
          <div className="h-64 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value) => [formatRupiah(Number(value)), '']}
                  />
                  <Area type="monotone" dataKey="Pemasukan" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorIn)" />
                  <Area type="monotone" dataKey="Pengeluaran" stroke="#f43f5e" strokeWidth={2.5} fillOpacity={1} fill="url(#colorOut)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Calendar className="w-8 h-8 mb-2" />
                <span className="text-sm">Belum ada history transaksi untuk divisualisasikan</span>
              </div>
            )}
          </div>
        </div>

        {/* Latest Announcements Detail (col-span-4) */}
        <div className="md:col-span-12 lg:col-span-4 bg-white p-8 rounded-[32px] border border-slate-200/80 flex flex-col justify-between min-h-[340px]">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-lg text-slate-900">Pengumuman Terbaru</h3>
              <Megaphone className="w-5 h-5 text-sky-600 animate-bounce" />
            </div>

            <div className="space-y-4">
              {latestAnnouncements.length > 0 ? (
                latestAnnouncements.map((ann) => (
                  <div key={ann.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-mono font-bold text-slate-400 flex items-center gap-1 mb-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {ann.tanggal}
                    </span>
                    <h4 className="font-display font-bold text-slate-900 text-sm mb-1">{ann.judul}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{ann.isi}</p>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Megaphone className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Tidak ada pengumuman terpublikasi</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <span className="text-xs text-slate-500">Mencakup agenda DKM, kajian, & sosial</span>
          </div>
        </div>

        {/* Monthly Trend Area Chart (col-span-12) */}
        <div className="md:col-span-12 bg-white p-6 sm:p-8 rounded-[32px] border border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <TrendingUp className="w-4.5 h-4.5" />
                </div>
                Tren Keuangan Bulanan
              </h3>
              <p className="text-xs text-slate-500 mt-1">Grafik akumulasi pemasukan dan pengeluaran tiap bulan pada tahun berjalan</p>
            </div>
            <div className="flex gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block"></span>
                <span>Total Pemasukan</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 block"></span>
                <span>Total Pengeluaran</span>
              </div>
            </div>
          </div>
          <div className="h-72 w-full">
            {monthlyChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMonthlyIn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorMonthlyOut" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(value) => [formatRupiah(Number(value)), '']}
                  />
                  <Area type="monotone" dataKey="Pemasukan" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorMonthlyIn)" name="Pemasukan" />
                  <Area type="monotone" dataKey="Pengeluaran" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorMonthlyOut)" name="Pengeluaran" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Calendar className="w-8 h-8 mb-2" />
                <span className="text-sm">Belum ada history bulanan untuk divisualisasikan</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QUICK ACTION MODALS */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-xl overflow-hidden border border-slate-100 animate-scale-in">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-2.5">
                <span className={`w-3 h-3 rounded-full block ${
                  activeModal === 'income' ? 'bg-emerald-500' :
                  activeModal === 'expense' ? 'bg-rose-500' :
                  activeModal === 'inventory' ? 'bg-amber-500' : 'bg-sky-500'
                }`}></span>
                <h3 className="font-display font-bold text-lg text-slate-900">
                  {activeModal === 'income' && 'Catat Pemasukan Baru'}
                  {activeModal === 'expense' && 'Catat Pengeluaran Baru'}
                  {activeModal === 'inventory' && 'Tambah Inventaris Baru'}
                  {activeModal === 'announcement' && 'Buat Pengumuman Baru'}
                </h3>
              </div>
              <button 
                onClick={() => { setActiveModal(null); setError(null); }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={
              activeModal === 'income' ? handleIncomeSubmit :
              activeModal === 'expense' ? handleExpenseSubmit :
              activeModal === 'inventory' ? handleInventorySubmit : handleAnnouncementSubmit
            } className="p-6 space-y-4">
              
              {error && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* INCOME FORM */}
              {activeModal === 'income' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Tanggal</label>
                      <input 
                        type="date" 
                        required
                        value={incomeForm.tanggal}
                        onChange={(e) => setIncomeForm({ ...incomeForm, tanggal: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Kategori</label>
                      <select
                        value={incomeForm.kategori}
                        onChange={(e) => setIncomeForm({ ...incomeForm, kategori: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm"
                      >
                        {state.categories.filter(c => c.tipe === 'Income').map((c, i) => (
                          <option key={i} value={c.nama}>{c.nama}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Nominal (Rupiah)</label>
                    <input 
                      type="number" 
                      placeholder="Contoh: 1500000"
                      required
                      value={incomeForm.nominal}
                      onChange={(e) => setIncomeForm({ ...incomeForm, nominal: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Deskripsi Transaksi</label>
                    <textarea 
                      placeholder="Tulis rincian atau asal muasal dana..."
                      rows={3}
                      value={incomeForm.deskripsi}
                      onChange={(e) => setIncomeForm({ ...incomeForm, deskripsi: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">URL Bukti Penerimaan (Opsional)</label>
                    <input 
                      type="text" 
                      placeholder="Tautan gambar atau kuitansi..."
                      value={incomeForm.bukti}
                      onChange={(e) => setIncomeForm({ ...incomeForm, bukti: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm"
                    />
                  </div>
                </>
              )}

              {/* EXPENSE FORM */}
              {activeModal === 'expense' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Tanggal</label>
                      <input 
                        type="date" 
                        required
                        value={expenseForm.tanggal}
                        onChange={(e) => setExpenseForm({ ...expenseForm, tanggal: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Kategori</label>
                      <select
                        value={expenseForm.kategori}
                        onChange={(e) => setExpenseForm({ ...expenseForm, kategori: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm"
                      >
                        {state.categories.filter(c => c.tipe === 'Expense').map((c, i) => (
                          <option key={i} value={c.nama}>{c.nama}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Nominal (Rupiah)</label>
                    <input 
                      type="number" 
                      placeholder="Contoh: 850000"
                      required
                      value={expenseForm.nominal}
                      onChange={(e) => setExpenseForm({ ...expenseForm, nominal: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm font-mono font-bold text-rose-700"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Deskripsi Pengeluaran</label>
                    <textarea 
                      placeholder="Rincian pembayaran, penerima, atau kepentingan..."
                      rows={3}
                      value={expenseForm.deskripsi}
                      onChange={(e) => setExpenseForm({ ...expenseForm, deskripsi: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">URL Nota / Kuitansi (Opsional)</label>
                    <input 
                      type="text" 
                      placeholder="Tautan gambar nota pembayaran..."
                      value={expenseForm.bukti}
                      onChange={(e) => setExpenseForm({ ...expenseForm, bukti: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm"
                    />
                  </div>
                </>
              )}

              {/* INVENTORY FORM */}
              {activeModal === 'inventory' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Nama Barang</label>
                      <input 
                        type="text" 
                        placeholder="Contoh: Genset Honda"
                        required
                        value={inventoryForm.namaBarang}
                        onChange={(e) => setInventoryForm({ ...inventoryForm, namaBarang: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Kategori</label>
                      <select
                        value={inventoryForm.kategori}
                        onChange={(e) => setInventoryForm({ ...inventoryForm, kategori: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm"
                      >
                        <option value="Elektronik">Elektronik</option>
                        <option value="Perlengkapan">Perlengkapan</option>
                        <option value="Peralatan">Peralatan</option>
                        <option value="Audio">Audio / Visual</option>
                        <option value="Mesin">Mesin & Utilitas</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Jumlah</label>
                      <input 
                        type="number" 
                        required
                        min="1"
                        value={inventoryForm.jumlah}
                        onChange={(e) => setInventoryForm({ ...inventoryForm, jumlah: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm font-bold"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Lokasi Penyimpanan</label>
                      <input 
                        type="text" 
                        placeholder="Contoh: Gudang utama"
                        value={inventoryForm.lokasi}
                        onChange={(e) => setInventoryForm({ ...inventoryForm, lokasi: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Kondisi Barang</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Baik', 'Rusak Ringan', 'Rusak Berat'].map((cond) => (
                        <button
                          key={cond}
                          type="button"
                          onClick={() => setInventoryForm({ ...inventoryForm, kondisi: cond as any })}
                          className={`py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                            inventoryForm.kondisi === cond
                              ? cond === 'Baik' ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                                : cond === 'Rusak Ringan' ? 'bg-amber-50 border-amber-500 text-amber-800'
                                : 'bg-rose-50 border-rose-500 text-rose-800'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {cond}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Keterangan Tambahan</label>
                    <input 
                      type="text" 
                      placeholder="Merek, spesifikasi, atau catatan..."
                      value={inventoryForm.keterangan}
                      onChange={(e) => setInventoryForm({ ...inventoryForm, keterangan: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm"
                    />
                  </div>
                </>
              )}

              {/* ANNOUNCEMENT FORM */}
              {activeModal === 'announcement' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Judul Pengumuman</label>
                    <input 
                      type="text" 
                      placeholder="Kajian subuh, gotong royong, dll..."
                      required
                      value={announcementForm.judul}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, judul: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Konten / Isi Pengumuman</label>
                    <textarea 
                      placeholder="Tuliskan detail pengumuman yang ingin disampaikan secara lengkap..."
                      rows={4}
                      required
                      value={announcementForm.isi}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, isi: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Tanggal Rilis</label>
                      <input 
                        type="date" 
                        required
                        value={announcementForm.tanggal}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, tanggal: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Status Publikasi</label>
                      <select
                        value={announcementForm.status}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, status: e.target.value as any })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm"
                      >
                        <option value="Publish">Publish (Tampil)</option>
                        <option value="Draft">Draft (Simpan saja)</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-gradient-to-r from-white to-slate-50 -mx-6 -mb-6 p-6">
                <button
                  type="button"
                  onClick={() => { setActiveModal(null); setError(null); }}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-5 py-2 text-sm font-semibold text-white rounded-xl shadow-sm cursor-pointer disabled:opacity-50 ${
                    activeModal === 'income' ? 'bg-emerald-600 hover:bg-emerald-700' :
                    activeModal === 'expense' ? 'bg-rose-600 hover:bg-rose-700' :
                    activeModal === 'inventory' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-sky-600 hover:bg-sky-700'
                  }`}
                >
                  {loading ? 'Menyimpan...' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
