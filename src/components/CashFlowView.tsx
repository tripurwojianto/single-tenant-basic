/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CashTransaction, Category, MosqueState } from '../types';
import { getIncomeCategories, getExpenseCategories, getGroupedIncomeCategories, getGroupedExpenseCategories } from '../constants/transactionCategories';
import { 
  TrendingUp, TrendingDown, Plus, Edit, Trash, Search, Filter, 
  Calendar, Check, X, Eye, ExternalLink, AlertTriangle, FileText, Loader2 
} from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';

interface CashFlowViewProps {
  state: MosqueState;
  onAddTransaction: (tipe: 'Income' | 'Expense', data: Omit<CashTransaction, 'id'>) => Promise<void>;
  onEditTransaction: (tipe: 'Income' | 'Expense', id: string, data: Omit<CashTransaction, 'id'>) => Promise<void>;
  onDeleteTransaction: (tipe: 'Income' | 'Expense', id: string) => Promise<void>;
  onAddCategory: (category: Category) => Promise<void>;
}

export default function CashFlowView({ 
  state, 
  onAddTransaction, 
  onEditTransaction, 
  onDeleteTransaction,
  onAddCategory
}: CashFlowViewProps) {
  const [activeTab, setActiveTab] = useState<'income' | 'expense'>('income');
  
  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Form Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<CashTransaction | null>(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // Loading & Error States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Delete Confirmation Dialog state
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form fields
  const [formField, setFormField] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    kategori: '',
    deskripsi: '',
    nominal: '',
    bukti: '',
  });

  // Category creation field
  const [newCategoryName, setNewCategoryName] = useState('');

  // Setup initial category on modal open
  const openAddModal = () => {
    const cats = activeTab === 'income' ? getIncomeCategories(state.categories) : getExpenseCategories(state.categories);
    setFormField({
      tanggal: new Date().toISOString().split('T')[0],
      kategori: cats[0] || '',
      deskripsi: '',
      nominal: '',
      bukti: '',
    });
    setEditItem(null);
    setIsFormOpen(true);
    setError(null);
  };

  const openEditModal = (item: CashTransaction) => {
    setEditItem(item);
    setFormField({
      tanggal: item.tanggal,
      kategori: item.kategori,
      deskripsi: item.deskripsi,
      nominal: item.nominal.toString(),
      bukti: item.bukti || '',
    });
    setIsFormOpen(true);
    setError(null);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formField.tanggal) {
      setError('Tanggal transaksi wajib diisi.');
      return;
    }
    if (!formField.kategori) {
      setError('Kategori transaksi wajib diisi. Silakan pilih atau tambahkan kategori terlebih dahulu.');
      return;
    }
    if (!formField.nominal) {
      setError('Nominal transaksi wajib diisi.');
      return;
    }
    const nominalNum = Number(formField.nominal);
    if (isNaN(nominalNum)) {
      setError('Nominal transaksi harus berupa angka yang valid.');
      return;
    }
    if (nominalNum < 0) {
      setError('Nominal transaksi tidak boleh bernilai negatif.');
      return;
    }
    if (nominalNum === 0) {
      setError('Nominal transaksi harus lebih besar dari 0.');
      return;
    }
    if (!formField.deskripsi.trim()) {
      setError('Deskripsi / rincian transaksi wajib diisi.');
      return;
    }

    setLoading(true);
    setError(null);

    const txType = activeTab === 'income' ? 'Income' : 'Expense';
    const txData: Omit<CashTransaction, 'id'> = {
      tanggal: formField.tanggal,
      kategori: formField.kategori,
      deskripsi: formField.deskripsi.trim(),
      nominal: nominalNum,
      bukti: formField.bukti,
    };

    try {
      if (editItem && editItem.id) {
        // Safe Update confirmation
        const confirmed = window.confirm(`Apakah Anda yakin ingin memperbarui data transaksi ini?`);
        if (!confirmed) {
          setLoading(false);
          return;
        }
        await onEditTransaction(txType, editItem.id, txData);
      } else {
        await onAddTransaction(txType, txData);
      }
      setIsFormOpen(false);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan transaksi');
    } finally {
      setLoading(false);
    }
  };

  // Delete Handler
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setLoading(true);
    setError(null);
    try {
      const txType = activeTab === 'income' ? 'Income' : 'Expense';
      await onDeleteTransaction(txType, deleteId);
      setDeleteId(null);
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus transaksi');
    } finally {
      setLoading(false);
    }
  };

  // Add Category Handler
  const handleAddCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    
    setLoading(true);
    try {
      const txType = activeTab === 'income' ? 'Income' : 'Expense';
      await onAddCategory({ tipe: txType, nama: newCategoryName.trim() });
      setNewCategoryName('');
      setIsCategoryOpen(false);
      // Automatically set the form category to the newly created one if form is open
      setFormField(prev => ({ ...prev, kategori: newCategoryName.trim() }));
    } catch (err: any) {
      alert(err.message || 'Gagal menambahkan kategori');
    } finally {
      setLoading(false);
    }
  };

  // Filter lists
  const currentList = activeTab === 'income' ? state.incomes : state.expenses;
  const availableCategories = activeTab === 'income' ? getIncomeCategories(state.categories) : getExpenseCategories(state.categories);
  const groupedCategories = activeTab === 'income' ? getGroupedIncomeCategories(state.categories) : getGroupedExpenseCategories(state.categories);

  const filteredList = currentList.filter((item) => {
    const matchesSearch = 
      item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kategori.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'Semua' || item.kategori === selectedCategory;
    
    const matchesStart = !startDate || item.tanggal >= startDate;
    const matchesEnd = !endDate || item.tanggal <= endDate;

    return matchesSearch && matchesCategory && matchesStart && matchesEnd;
  }).sort((a, b) => b.tanggal.localeCompare(a.tanggal)); // Sort by date descending

  // Calculations
  const filteredTotal = filteredList.reduce((sum, item) => sum + item.nominal, 0);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  return (
    <div id="cash-flow-view" className="space-y-6 animate-fade-in">
      {/* Header and Add buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-[32px] border border-slate-200/80">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
            activeTab === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
          }`}>
            {activeTab === 'income' ? (
              <TrendingUp className="w-6 h-6" />
            ) : (
              <TrendingDown className="w-6 h-6" />
            )}
          </div>
          <div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 leading-tight">
              Pencatatan Keuangan (Arus Kas)
            </h2>
            <p className="text-slate-500 text-sm mt-1.5">
              Kelola data transaksi {activeTab === 'income' ? 'pemasukan' : 'pengeluaran'} kas masjid dengan tertib.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-center">
          <button
            onClick={() => setIsCategoryOpen(true)}
            className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer transition-colors uppercase tracking-wider"
          >
            + Kategori
          </button>
          <button
            onClick={openAddModal}
            className={`px-5 py-2.5 text-sm font-semibold text-white rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'income' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
            }`}
          >
            <Plus className="w-4 h-4" />
            Catat {activeTab === 'income' ? 'Pemasukan' : 'Pengeluaran'}
          </button>
        </div>
      </div>

      {/* Primary Income / Expense Tab bar */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit">
        <button
          onClick={() => { setActiveTab('income'); setSelectedCategory('Semua'); setSearchQuery(''); }}
          className={`px-6 py-2.5 text-sm font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'income'
              ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/50'
              : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Pemasukan
        </button>
        <button
          onClick={() => { setActiveTab('expense'); setSelectedCategory('Semua'); setSearchQuery(''); }}
          className={`px-6 py-2.5 text-sm font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'expense'
              ? 'bg-white text-rose-700 shadow-sm border border-slate-200/50'
              : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'
          }`}
        >
          <TrendingDown className="w-4 h-4" />
          Pengeluaran
        </button>
      </div>

      {/* Search and Filters box */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Cari Keterangan</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Ketik kata kunci..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-slate-700"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Filter Kategori</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-slate-700 bg-white"
          >
            <option value="Semua">Semua Kategori</option>
            {groupedCategories.map((group) => (
              <optgroup key={group.groupName} label={group.groupName}>
                {group.categories.map((catName) => (
                  <option key={catName} value={catName}>{catName}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Mulai Tanggal</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-slate-700"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Sampai Tanggal</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-slate-700"
          />
        </div>
      </div>

      {/* Transactions Table / List */}
      <div className="bg-white rounded-[32px] border border-slate-200/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-display font-bold text-[10px] uppercase tracking-widest">
                <th className="py-4 px-6">Tanggal</th>
                <th className="py-4 px-6">Kategori</th>
                <th className="py-4 px-6">Deskripsi Rincian</th>
                <th className="py-4 px-6 text-right">Nominal</th>
                <th className="py-4 px-6 text-center">Lampiran</th>
                <th className="py-4 px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
              {filteredList.length > 0 ? (
                filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs whitespace-nowrap text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {item.tanggal}
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        activeTab === 'income' 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                          : 'bg-rose-50 text-rose-800 border border-rose-100'
                      }`}>
                        {item.kategori}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-900 max-w-xs sm:max-w-md truncate">
                      {item.deskripsi || '-'}
                    </td>
                    <td className={`py-4 px-6 text-right font-bold whitespace-nowrap text-xs ${
                      activeTab === 'income' ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {activeTab === 'income' ? '+' : '-'} {formatRupiah(item.nominal)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {item.bukti ? (
                        <a 
                           href={item.bukti} 
                           target="_blank" 
                           rel="noreferrer"
                           className="inline-flex w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded-lg items-center justify-center text-slate-600 transition-all cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <span className="text-slate-300 text-xs">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEditModal(item)}
                          className="w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
                          title="Ubah transaksi"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(item.id || null)}
                          className="w-7 h-7 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 rounded-lg flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
                          title="Hapus transaksi"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400">
                    <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <span className="text-sm">Tidak ditemukan transaksi yang cocok dengan kriteria filter</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info total */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-slate-500 font-medium">
            Menampilkan {filteredList.length} dari {currentList.length} transaksi terdaftar.
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Total Periode Ini:</span>
            <span className={`text-xl font-display font-extrabold ${
              activeTab === 'income' ? 'text-emerald-700' : 'text-rose-700'
            }`}>
              {formatRupiah(filteredTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* TRANSACTION MODAL (ADD / EDIT) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[32px] w-full max-w-lg shadow-xl overflow-hidden border border-slate-100 animate-scale-in">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-2.5">
                <span className={`w-3 h-3 rounded-full block ${activeTab === 'income' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                <h3 className="font-display font-bold text-lg text-slate-900">
                  {editItem ? 'Ubah Data Transaksi' : `Catat ${activeTab === 'income' ? 'Pemasukan' : 'Pengeluaran'} Baru`}
                </h3>
              </div>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                    Tanggal <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="date" 
                    required
                    value={formField.tanggal}
                    onChange={(e) => setFormField({ ...formField, tanggal: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-1 text-sm ${
                      activeTab === 'income' ? 'focus:border-emerald-500 focus:ring-emerald-500' : 'focus:border-rose-500 focus:ring-rose-500'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                    Kategori <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formField.kategori}
                    onChange={(e) => setFormField({ ...formField, kategori: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-1 text-sm bg-white ${
                      activeTab === 'income' ? 'focus:border-emerald-500 focus:ring-emerald-500' : 'focus:border-rose-500 focus:ring-rose-500'
                    }`}
                  >
                    {groupedCategories.map((group) => (
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
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                  Nominal (Rupiah) <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="number" 
                  min="1"
                  placeholder="Contoh: 1500000"
                  required
                  value={formField.nominal}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormField({ ...formField, nominal: val });
                    if (val !== '' && Number(val) < 0) {
                      setError('Nominal transaksi tidak boleh bernilai negatif.');
                    } else if (error === 'Nominal transaksi tidak boleh bernilai negatif.') {
                      setError(null);
                    }
                  }}
                  className={`w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-1 text-sm font-mono font-bold ${
                    activeTab === 'income' ? 'focus:border-emerald-500 focus:ring-emerald-500 text-emerald-900' : 'focus:border-rose-500 focus:ring-rose-500 text-rose-900'
                  }`}
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                  Deskripsi Transaksi <span className="text-rose-500">*</span>
                </label>
                <textarea 
                  placeholder="Ketik rincian atau catatan..."
                  rows={3}
                  required
                  value={formField.deskripsi}
                  onChange={(e) => setFormField({ ...formField, deskripsi: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-1 text-sm ${
                    activeTab === 'income' ? 'focus:border-emerald-500 focus:ring-emerald-500' : 'focus:border-rose-500 focus:ring-rose-500'
                  }`}
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">URL Bukti / Lampiran (Opsional)</label>
                <input 
                  type="text" 
                  placeholder="Link url gambar kuitansi, struk belanja..."
                  value={formField.bukti}
                  onChange={(e) => setFormField({ ...formField, bukti: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-1 text-sm ${
                    activeTab === 'income' ? 'focus:border-emerald-500 focus:ring-emerald-500' : 'focus:border-rose-500 focus:ring-rose-500'
                  }`}
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-gradient-to-r from-white to-slate-50 -mx-6 -mb-6 p-6">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-5 py-2 text-sm font-semibold text-white rounded-xl shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 ${
                    activeTab === 'income' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Simpan Transaksi</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY DIALOG */}
      {isCategoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[32px] w-full max-w-sm shadow-xl overflow-hidden border border-slate-100 animate-scale-in">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-display font-bold text-slate-900 text-base">Tambah Kategori Baru</h3>
              <button 
                onClick={() => setIsCategoryOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCategorySubmit} className="p-5 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Tipe Kategori</label>
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                  activeTab === 'income' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {activeTab === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                </span>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Nama Kategori</label>
                <input 
                  type="text" 
                  required
                  placeholder="Misal: CSR Bank, Pemeliharaan Atap..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50 -mx-5 -mb-5 p-4">
                <button
                  type="button"
                  onClick={() => setIsCategoryOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 cursor-pointer"
                >
                  Tambah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Konfirmasi Hapus Transaksi"
        message={
          (() => {
            const item = deleteId ? (activeTab === 'income' ? state.incomes : state.expenses).find(t => t.id === deleteId) : null;
            return item 
              ? `Apakah Anda yakin ingin menghapus transaksi "${item.deskripsi}" (Rp ${item.nominal.toLocaleString('id-ID')}) secara permanen? Data akan dihapus dari database Google Sheets dan tidak dapat dikembalikan.`
              : "Apakah Anda yakin ingin menghapus data transaksi ini secara permanen dari database Google Sheets Anda? Tindakan ini tidak dapat dibatalkan.";
          })()
        }
        confirmText="Ya, Hapus"
        cancelText="Batal"
        isLoading={loading}
      />
    </div>
  );
}
