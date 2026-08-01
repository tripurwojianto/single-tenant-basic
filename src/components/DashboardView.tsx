/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import KasMasjidLogo from './KasMasjidLogo';
import { MosqueState, CashTransaction, InventoryItem, Announcement } from '../types';
import { 
  TrendingUp, TrendingDown, Wallet, Box, Megaphone, PlusCircle, 
  ArrowUpRight, ArrowDownRight, Calendar, User, FileText, MapPin, 
  Settings, Check, X, AlertTriangle, Sparkles, ArrowRight, Loader2, Building
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getIncomeCategories, getExpenseCategories, getGroupedIncomeCategories, getGroupedExpenseCategories } from '../constants/transactionCategories';

interface DashboardViewProps {
  state: MosqueState;
  spreadsheetId?: string | null;
  isDemoMode?: boolean;
  syncError?: string | null;
  connectionStatus?: 'connected' | 'pending' | 'error';
  syncQueueLength?: number;
  onManualSync?: () => void;
  onReauthenticate?: () => void;
  onAddIncome: (income: Omit<CashTransaction, 'id'>) => Promise<void>;
  onAddExpense: (expense: Omit<CashTransaction, 'id'>) => Promise<void>;
  onAddInventory: (item: Omit<InventoryItem, 'id'>) => Promise<void>;
  onAddAnnouncement: (ann: Omit<Announcement, 'id'>) => Promise<void>;
  onNavigateToAmina?: () => void;
}

export default function DashboardView({ 
  state, 
  spreadsheetId,
  isDemoMode,
  syncError,
  connectionStatus = 'connected',
  syncQueueLength = 0,
  onManualSync,
  onReauthenticate,
  onAddIncome, 
  onAddExpense, 
  onAddInventory, 
  onAddAnnouncement,
  onNavigateToAmina
}: DashboardViewProps) {
  // Modal states
  const [activeModal, setActiveModal] = useState<'income' | 'expense' | 'inventory' | 'announcement' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Income Form State
  const [incomeForm, setIncomeForm] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    kategori: getIncomeCategories(state.categories)[0] || 'Infaq Umum',
    deskripsi: '',
    nominal: '',
    bukti: '',
  });

  // Expense Form State
  const [expenseForm, setExpenseForm] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    kategori: getExpenseCategories(state.categories)[0] || 'Air',
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
    if (!incomeForm.tanggal) {
      setError('Tanggal transaksi wajib diisi');
      return;
    }
    if (!incomeForm.kategori) {
      setError('Kategori transaksi wajib dipilih');
      return;
    }
    if (!incomeForm.nominal) {
      setError('Nominal transaksi wajib diisi');
      return;
    }
    const nominalNum = Number(incomeForm.nominal);
    if (isNaN(nominalNum)) {
      setError('Nominal transaksi harus berupa angka yang valid');
      return;
    }
    if (nominalNum < 0) {
      setError('Nominal transaksi tidak boleh bernilai negatif');
      return;
    }
    if (nominalNum === 0) {
      setError('Nominal transaksi harus lebih besar dari 0');
      return;
    }
    if (!incomeForm.deskripsi.trim()) {
      setError('Deskripsi / rincian transaksi wajib diisi');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onAddIncome({
        tanggal: incomeForm.tanggal,
        kategori: incomeForm.kategori,
        deskripsi: incomeForm.deskripsi.trim(),
        nominal: nominalNum,
        bukti: incomeForm.bukti,
      });
      setActiveModal(null);
      setIncomeForm({
        tanggal: new Date().toISOString().split('T')[0],
        kategori: getIncomeCategories(state.categories)[0] || 'Infaq Umum',
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
    if (!expenseForm.tanggal) {
      setError('Tanggal transaksi wajib diisi');
      return;
    }
    if (!expenseForm.kategori) {
      setError('Kategori transaksi wajib dipilih');
      return;
    }
    if (!expenseForm.nominal) {
      setError('Nominal transaksi wajib diisi');
      return;
    }
    const nominalNum = Number(expenseForm.nominal);
    if (isNaN(nominalNum)) {
      setError('Nominal transaksi harus berupa angka yang valid');
      return;
    }
    if (nominalNum < 0) {
      setError('Nominal transaksi tidak boleh bernilai negatif');
      return;
    }
    if (nominalNum === 0) {
      setError('Nominal transaksi harus lebih besar dari 0');
      return;
    }
    if (!expenseForm.deskripsi.trim()) {
      setError('Deskripsi / rincian transaksi wajib diisi');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onAddExpense({
        tanggal: expenseForm.tanggal,
        kategori: expenseForm.kategori,
        deskripsi: expenseForm.deskripsi.trim(),
        nominal: nominalNum,
        bukti: expenseForm.bukti,
      });
      setActiveModal(null);
      setExpenseForm({
        tanggal: new Date().toISOString().split('T')[0],
        kategori: getExpenseCategories(state.categories)[0] || 'Air',
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
    <div id="dashboard-view" className="space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* 1. HERO MASJID DASHBOARD */}
      <div className="relative overflow-hidden rounded-[28px] sm:rounded-[32px] bg-emerald-950 text-white shadow-xl shadow-emerald-950/10 border border-emerald-800/60">
        {/* Subtle Mosque Background Pattern / Image Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 scale-105"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=1200&auto=format&fit=crop')` 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-900/95 to-teal-950/90 backdrop-blur-[1px]" />

        {/* Hero Content */}
        <div className="relative p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {state.info.logo ? (
              <img 
                src={state.info.logo} 
                alt={`Logo ${state.info.namaMasjid || 'Masjid'}`} 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-400/40 shadow-lg shrink-0 bg-white/10"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-800/80 text-emerald-100 flex items-center justify-center font-display font-black text-2xl sm:text-3xl border-2 border-emerald-400/40 shadow-lg shrink-0">
                {state.info.namaMasjid ? state.info.namaMasjid.charAt(0).toUpperCase() : <Building className="w-8 h-8 text-emerald-300" />}
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-200 bg-emerald-800/80 px-2.5 py-0.5 rounded-full border border-emerald-700/60">
                  Dashboard Administrator
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-white tracking-tight leading-snug">
                  {state.info.namaMasjid || 'Masjid Al-Ikhlas'}
                </h1>
              </div>

              <p className="text-emerald-200/90 text-xs sm:text-sm font-sans italic font-medium max-w-xl">
                "{state.info.tagline || 'Menuju Masyarakat Madani Berlandaskan Al-Qur\'an'}"
              </p>

              <div className="flex items-center gap-1.5 text-emerald-300/80 text-xs font-semibold pt-1">
                <MapPin className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                <span className="truncate">
                  {state.info.alamat ? `${state.info.alamat}${state.info.kota ? ', ' + state.info.kota : ''}` : 'Jl. Masjid Raya No.1'}
                </span>
              </div>
            </div>
          </div>

          {/* Sync Status Badge inside Hero */}
          <div className="shrink-0 self-start md:self-center">
            {isDemoMode ? (
              <div className="px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-extrabold flex items-center gap-2 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>🟡 Mode Demo (Lokal)</span>
              </div>
            ) : connectionStatus === 'error' || syncError ? (
              <div className="px-3.5 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-extrabold flex items-center gap-2 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>🔴 Google Sheets Tidak Dapat Diakses</span>
              </div>
            ) : connectionStatus === 'pending' || syncQueueLength > 0 ? (
              <div className="px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-extrabold flex items-center gap-2 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>🟡 Menunggu Sinkronisasi {syncQueueLength > 0 ? `(${syncQueueLength} data)` : ''}</span>
              </div>
            ) : (
              <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-extrabold flex items-center gap-2 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>🟢 Google Sheets Terhubung</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 1.5 KARTU ASISTEN AMINA */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-850 to-teal-900 rounded-[28px] sm:rounded-[32px] p-6 sm:p-7 text-white shadow-xl shadow-emerald-950/10 border border-emerald-700/60 relative overflow-hidden">
        {/* Background Decorative Glow */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-40 h-40 bg-teal-400/10 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-emerald-950 flex items-center justify-center font-black text-2xl shadow-md border border-emerald-300/30 shrink-0">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-950" />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-lg sm:text-xl text-white tracking-tight flex items-center gap-2">
                  <span>✨ Asisten Amina</span>
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold border border-emerald-400/30 uppercase tracking-wider">
                  AI Pendamping DKM
                </span>
              </div>
              <p className="text-emerald-100/90 text-xs sm:text-sm font-sans font-medium leading-relaxed max-w-2xl">
                Bingung menyusun laporan, membuat pengumuman, atau menjawab pertanyaan administrasi masjid? Amina siap membantu.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateToAmina?.()}
            className="w-full md:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-display font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-950/20 hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2.5 shrink-0 cursor-pointer active:scale-95 group border border-emerald-300/50"
          >
            <span>[ Mulai Bertanya ]</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* 2. KARTU TOTAL SALDO KAS */}
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 text-white shadow-xl shadow-emerald-950/10 flex flex-col justify-between min-h-[200px]">
        <div>
          <div className="flex items-center justify-between">
            <p className="text-emerald-100 font-semibold uppercase tracking-[0.2em] text-[10px] sm:text-xs">
              Total Saldo Kas Utama
            </p>
            <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase backdrop-blur-md tracking-wider">
              Realtime Balance
            </span>
          </div>
          <h3 className="text-3xl sm:text-5xl font-black mt-2 tracking-tight font-display">
            {formatRupiah(balance)}
          </h3>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-emerald-500/40 pt-4 mt-6">
          <div className="flex flex-wrap items-center gap-6 sm:gap-8">
            <div>
              <p className="text-[10px] text-emerald-200 uppercase tracking-wider font-semibold">Pemasukan Bulan Ini</p>
              <p className="font-extrabold text-sm sm:text-base text-emerald-100">+{formatRupiah(monthIncomes)}</p>
            </div>
            <div className="h-8 w-px bg-emerald-500/40 hidden sm:block" />
            <div>
              <p className="text-[10px] text-emerald-200 uppercase tracking-wider font-semibold">Pengeluaran Bulan Ini</p>
              <p className="font-extrabold text-sm sm:text-base text-rose-200">-{formatRupiah(monthExpenses)}</p>
            </div>
          </div>

          <div className="text-[10px] text-emerald-200 font-semibold italic">
            Aman & Terverifikasi DKM
          </div>
        </div>
      </div>

      {/* 3. RINGKASAN DASHBOARD (INVENTARIS, PENGUMUMAN, ARSIP) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Inventaris */}
        <div className="bg-white border border-slate-200/80 rounded-[24px] sm:rounded-[28px] p-6 flex items-center gap-4 shadow-xs hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 font-black text-2xl shrink-0 border border-amber-100/80">
            <Box className="w-7 h-7" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{totalInventory}</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Inventaris</p>
            <p className="text-[11px] text-slate-400 font-medium">Barang & Aset Tercatat</p>
          </div>
        </div>

        {/* Pengumuman */}
        <div className="bg-white border border-slate-200/80 rounded-[24px] sm:rounded-[28px] p-6 flex items-center gap-4 shadow-xs hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-black text-2xl shrink-0 border border-blue-100/80">
            <Megaphone className="w-7 h-7" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">
              {state.announcements.filter(a => a.status === 'Publish').length}
            </p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pengumuman</p>
            <p className="text-[11px] text-slate-400 font-medium">Terpublikasi untuk Jamaah</p>
          </div>
        </div>

        {/* Arsip / Transaksi */}
        <div className="bg-white border border-slate-200/80 rounded-[24px] sm:rounded-[28px] p-6 flex items-center gap-4 shadow-xs hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 font-black text-2xl shrink-0 border border-emerald-100/80">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">
              {state.incomes.length + state.expenses.length}
            </p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Arsip Kas</p>
            <p className="text-[11px] text-slate-400 font-medium">Catatan Arus Transaksi</p>
          </div>
        </div>
      </div>

      {/* 4. AKSI CEPAT ADMIN / PENGURUS */}
      <div className="bg-white border border-slate-200/80 rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display font-black text-lg text-slate-900">Aksi Cepat Admin</h3>
            <p className="text-xs text-slate-500 font-medium">Pintasan cepat untuk penginputan data harian masjid</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
          <button 
            onClick={() => setActiveModal('income')}
            className="flex items-center justify-between p-4 bg-slate-50 hover:bg-emerald-50/80 rounded-2xl border border-slate-200/60 hover:border-emerald-200 transition-all group cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-black text-lg shrink-0">
                +
              </div>
              <div>
                <p className="font-bold text-slate-900 text-xs sm:text-sm">Tambah Pemasukan</p>
                <p className="text-[10px] text-slate-500">Infaq, Sedekah, Donasi</p>
              </div>
            </div>
            <span className="text-slate-300 group-hover:text-emerald-600 transition-colors">→</span>
          </button>

          <button 
            onClick={() => setActiveModal('expense')}
            className="flex items-center justify-between p-4 bg-slate-50 hover:bg-rose-50/80 rounded-2xl border border-slate-200/60 hover:border-rose-200 transition-all group cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-100 text-rose-700 rounded-xl flex items-center justify-center font-black text-lg shrink-0">
                -
              </div>
              <div>
                <p className="font-bold text-slate-900 text-xs sm:text-sm">Tambah Pengeluaran</p>
                <p className="text-[10px] text-slate-500">Operasional, Gaji, Listrik</p>
              </div>
            </div>
            <span className="text-slate-300 group-hover:text-rose-600 transition-colors">→</span>
          </button>

          <button 
            onClick={() => setActiveModal('inventory')}
            className="flex items-center justify-between p-4 bg-slate-50 hover:bg-amber-50/80 rounded-2xl border border-slate-200/60 hover:border-amber-200 transition-all group cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center text-base shrink-0">
                📦
              </div>
              <div>
                <p className="font-bold text-slate-900 text-xs sm:text-sm">Tambah Inventaris</p>
                <p className="text-[10px] text-slate-500">Aset & Perlengkapan</p>
              </div>
            </div>
            <span className="text-slate-300 group-hover:text-amber-600 transition-colors">→</span>
          </button>

          <button 
            onClick={() => setActiveModal('announcement')}
            className="flex items-center justify-between p-4 bg-slate-50 hover:bg-blue-50/80 rounded-2xl border border-slate-200/60 hover:border-blue-200 transition-all group cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center text-base shrink-0">
                📢
              </div>
              <div>
                <p className="font-bold text-slate-900 text-xs sm:text-sm">Buat Pengumuman</p>
                <p className="text-[10px] text-slate-500">DKM, Agenda, Kajian</p>
              </div>
            </div>
            <span className="text-slate-300 group-hover:text-blue-600 transition-colors">→</span>
          </button>

          <button 
            onClick={() => onNavigateToAmina?.()}
            className="flex items-center justify-between p-4 bg-emerald-50/60 hover:bg-emerald-100/80 rounded-2xl border border-emerald-200/80 transition-all group cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center text-base shrink-0 shadow-xs">
                🤖
              </div>
              <div>
                <p className="font-bold text-slate-900 text-xs sm:text-sm">Asisten Amina</p>
                <p className="text-[10px] text-emerald-700 font-medium">Tanya DKM & Kas</p>
              </div>
            </div>
            <span className="text-emerald-400 group-hover:text-emerald-700 transition-colors">→</span>
          </button>
        </div>
      </div>

      {/* 5. AKTIVITAS TERBARU & GRAFIK */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Recent Activity Table (col-span-8) */}
        <div className="md:col-span-12 lg:col-span-8 bg-white border border-slate-200/80 rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-display font-black text-base sm:text-lg text-slate-900">Aktivitas Transaksi Terbaru</h3>
                <p className="text-xs text-slate-500">Ringkasan transaksi arus kas terkini</p>
              </div>
              <span className="text-[10px] font-extrabold text-emerald-600 uppercase px-2.5 py-1 bg-emerald-50 border border-emerald-100 rounded-lg">
                Aktual
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-[10px] text-slate-400 uppercase border-b border-slate-100">
                    <th className="pb-3 font-bold">Tanggal</th>
                    <th className="pb-3 font-bold">Kategori</th>
                    <th className="pb-3 font-bold">Keterangan</th>
                    <th className="pb-3 font-bold text-right">Nominal</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-50">
                  {latestTransactions.length > 0 ? (
                    latestTransactions.map((tx, idx) => (
                      <tr key={idx}>
                        <td className="py-3.5 text-slate-500 font-medium text-xs whitespace-nowrap">{tx.tanggal}</td>
                        <td className="py-3.5">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${
                            tx.tipe === 'Income' 
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                              : 'bg-rose-50 text-rose-600 border border-rose-100'
                          }`}>
                            {tx.kategori}
                          </span>
                        </td>
                        <td className="py-3.5 font-medium text-slate-700 text-xs max-w-[180px] truncate" title={tx.deskripsi}>
                          {tx.deskripsi || '-'}
                        </td>
                        <td className={`py-3.5 text-right font-bold text-xs whitespace-nowrap ${
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

        {/* Latest Announcements Sidebar Card (col-span-4) */}
        <div className="md:col-span-12 lg:col-span-4 bg-white p-6 sm:p-8 rounded-[28px] sm:rounded-[32px] border border-slate-200/80 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-black text-base text-slate-900">Pengumuman Terbaru</h3>
              <Megaphone className="w-4 h-4 text-emerald-600" />
            </div>

            <div className="space-y-3.5">
              {latestAnnouncements.length > 0 ? (
                latestAnnouncements.map((ann) => (
                  <div key={ann.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100/80">
                    <span className="text-[10px] font-mono font-bold text-slate-400 flex items-center gap-1 mb-1">
                      <Calendar className="w-3 h-3" />
                      {ann.tanggal}
                    </span>
                    <h4 className="font-display font-bold text-slate-900 text-xs sm:text-sm mb-1">{ann.judul}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{ann.isi}</p>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Megaphone className="w-6 h-6 mx-auto mb-1.5 opacity-50" />
                  <p className="text-xs">Tidak ada pengumuman terpublikasi</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400 font-medium">Mencakup agenda DKM, kajian, & sosial</span>
          </div>
        </div>

      </div>

      {/* Trend Area Chart (Full Width Below) */}
      <div className="bg-white p-6 sm:p-8 rounded-[28px] sm:rounded-[32px] border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="font-display font-black text-base sm:text-lg text-slate-900">Grafik Arus Kas Harian</h3>
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
              <span className="text-sm">Belum ada riwayat transaksi untuk divisualisasikan</span>
            </div>
          )}
        </div>
      </div>

      {/* Monthly Trend Area Chart */}
      <div className="bg-white p-6 sm:p-8 rounded-[28px] sm:rounded-[32px] border border-slate-200/80 shadow-xs">
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

      {/* 6. BANNER NOTIFIKASI SINKRONISASI (TAMPIL HANYA JIKA ADA KENDALA ATAU ANTREAN PENDING) */}
      {(connectionStatus === 'error' || syncError) ? (
        <div className="p-4 sm:p-5 bg-rose-50/90 border border-rose-200/80 rounded-[20px] sm:rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs text-rose-900 transition-all">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-rose-100 rounded-xl text-rose-700 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-rose-950">
                🔴 Google Sheets Tidak Dapat Diakses
              </h4>
              <p className="text-[11px] sm:text-xs text-rose-800/90 mt-0.5 leading-relaxed">
                Periksa koneksi internet atau pulihkan database Google Sheets Anda. Data transaksi tetap tersimpan aman di penyimpanan lokal.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto shrink-0">
            {onManualSync && (
              <button
                onClick={onManualSync}
                className="w-full sm:w-auto px-4 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-extrabold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs whitespace-nowrap"
              >
                <span>Sinkronkan Sekarang</span>
              </button>
            )}
            {onReauthenticate && (
              <button
                onClick={onReauthenticate}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-900 active:scale-[0.98] text-white font-extrabold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs whitespace-nowrap"
              >
                <span>Masuk Kembali dengan Google</span>
              </button>
            )}
          </div>
        </div>
      ) : (connectionStatus === 'pending' || syncQueueLength > 0) ? (
        <div className="p-4 sm:p-5 bg-amber-50/90 border border-amber-200/80 rounded-[20px] sm:rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs text-amber-900 transition-all">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-xl text-amber-700 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-amber-950">
                🟡 Menunggu Sinkronisasi
              </h4>
              <p className="text-[11px] sm:text-xs text-amber-800/90 mt-0.5 leading-relaxed">
                Terdapat {syncQueueLength} jenis data/transaksi tersimpan lokal yang akan dikirim ke Google Sheets secara otomatis saat koneksi tersedia.
              </p>
            </div>
          </div>
          {onManualSync && (
            <button
              onClick={onManualSync}
              className="w-full sm:w-auto px-4 py-2.5 bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white font-extrabold rounded-xl text-xs transition-all shrink-0 flex items-center justify-center gap-2 cursor-pointer shadow-xs whitespace-nowrap"
            >
              <span>Sinkronkan Sekarang</span>
            </button>
          )}
        </div>
      ) : null}

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
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                        Tanggal <span className="text-rose-500">*</span>
                      </label>
                      <input 
                        type="date" 
                        required
                        value={incomeForm.tanggal}
                        onChange={(e) => setIncomeForm({ ...incomeForm, tanggal: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                        Kategori <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={incomeForm.kategori}
                        onChange={(e) => setIncomeForm({ ...incomeForm, kategori: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm bg-white"
                      >
                        {getGroupedIncomeCategories(state.categories).map((group) => (
                          <optgroup key={group.groupName} label={group.groupName}>
                            {group.categories.map((catName) => (
                              <option key={catName} value={catName}>{catName}</option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                      Nominal (Rupiah) <span className="text-rose-500">*</span>
                    </label>
                    <input 
                      type="number" 
                      min="1"
                      placeholder="Contoh: 1500000"
                      required
                      value={incomeForm.nominal}
                      onChange={(e) => {
                        const val = e.target.value;
                        setIncomeForm({ ...incomeForm, nominal: val });
                        if (val !== '' && Number(val) < 0) {
                          setError('Nominal transaksi tidak boleh bernilai negatif');
                        } else if (error === 'Nominal transaksi tidak boleh bernilai negatif') {
                          setError(null);
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                      Deskripsi Transaksi <span className="text-rose-500">*</span>
                    </label>
                    <textarea 
                      placeholder="Tulis rincian atau asal muasal dana..."
                      rows={3}
                      required
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
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                        Tanggal <span className="text-rose-500">*</span>
                      </label>
                      <input 
                        type="date" 
                        required
                        value={expenseForm.tanggal}
                        onChange={(e) => setExpenseForm({ ...expenseForm, tanggal: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                        Kategori <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={expenseForm.kategori}
                        onChange={(e) => setExpenseForm({ ...expenseForm, kategori: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm bg-white"
                      >
                        {getGroupedExpenseCategories(state.categories).map((group) => (
                          <optgroup key={group.groupName} label={group.groupName}>
                            {group.categories.map((catName) => (
                              <option key={catName} value={catName}>{catName}</option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                      Nominal (Rupiah) <span className="text-rose-500">*</span>
                    </label>
                    <input 
                      type="number" 
                      min="1"
                      placeholder="Contoh: 850000"
                      required
                      value={expenseForm.nominal}
                      onChange={(e) => {
                        const val = e.target.value;
                        setExpenseForm({ ...expenseForm, nominal: val });
                        if (val !== '' && Number(val) < 0) {
                          setError('Nominal transaksi tidak boleh bernilai negatif');
                        } else if (error === 'Nominal transaksi tidak boleh bernilai negatif') {
                          setError(null);
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm font-mono font-bold text-rose-700"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                      Deskripsi Pengeluaran <span className="text-rose-500">*</span>
                    </label>
                    <textarea 
                      placeholder="Rincian pembayaran, penerima, atau kepentingan..."
                      rows={3}
                      required
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
                  className={`px-5 py-2 text-sm font-semibold text-white rounded-xl shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 ${
                    activeModal === 'income' ? 'bg-emerald-600 hover:bg-emerald-700' :
                    activeModal === 'expense' ? 'bg-rose-600 hover:bg-rose-700' :
                    activeModal === 'inventory' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-sky-600 hover:bg-sky-700'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Simpan Data</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
