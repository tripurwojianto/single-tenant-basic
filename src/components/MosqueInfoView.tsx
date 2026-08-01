/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MosqueInfo, Category } from '../types';
import { 
  Building, Sparkles, Tags, Plus, Edit2, Trash2, RotateCcw, 
  CheckCircle2, AlertTriangle, Loader2, HelpCircle, Check, X, ShieldCheck, TrendingUp, TrendingDown 
} from 'lucide-react';
import { 
  DEFAULT_CATEGORIES, 
  INCOME_CATEGORY_GROUPS, 
  EXPENSE_CATEGORY_GROUPS, 
  getGroupedIncomeCategories, 
  getGroupedExpenseCategories 
} from '../constants/transactionCategories';
import ConfirmationModal from './ConfirmationModal';

interface MosqueInfoViewProps {
  info: MosqueInfo;
  categories?: Category[];
  onSave: (info: MosqueInfo) => Promise<void>;
  onSaveCategories?: (categories: Category[]) => Promise<void>;
}

export default function MosqueInfoView({ 
  info, 
  categories = [], 
  onSave, 
  onSaveCategories 
}: MosqueInfoViewProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'categories'>('profile');
  
  // Mosque Info Form State
  const [formData, setFormData] = useState<MosqueInfo>({ ...info });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Category State Management
  const [catTab, setCatTab] = useState<'Income' | 'Expense'>('Income');
  const [catStatus, setCatStatus] = useState<'success' | 'error' | null>(null);
  const [catErrorMessage, setCatErrorMessage] = useState<string | null>(null);
  const [catLoading, setCatLoading] = useState(false);

  // Add / Edit Category Modal
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{ originalName: string; name: string; type: 'Income' | 'Expense' } | null>(null);
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState<'Income' | 'Expense'>('Income');

  // Delete Category Confirmation Modal
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  // Reset Confirmation Modal
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Get active state categories or defaults
  const activeCategories = categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  // Handler for Profile Form submit
  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaMasjid.trim()) {
      setStatus('error');
      setErrorMessage('Nama Masjid tidak boleh kosong');
      return;
    }
    setLoading(true);
    setStatus(null);
    setErrorMessage(null);
    try {
      await onSave(formData);
      setStatus('success');
      setTimeout(() => setStatus(null), 4000);
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Gagal menyimpan profil masjid');
    } finally {
      setLoading(false);
    }
  };

  // Save modified categories
  const saveCategoriesList = async (newList: Category[]) => {
    if (!onSaveCategories) return;
    setCatLoading(true);
    setCatStatus(null);
    setCatErrorMessage(null);
    try {
      await onSaveCategories(newList);
      setCatStatus('success');
      setTimeout(() => setCatStatus(null), 4000);
    } catch (err: any) {
      setCatStatus('error');
      setCatErrorMessage(err.message || 'Gagal menyimpan daftar kategori');
    } finally {
      setCatLoading(false);
    }
  };

  // Add new category
  const handleAddCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCatName.trim();
    if (!trimmed) return;

    const exists = activeCategories.some(
      c => c.tipe === newCatType && c.nama.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      setCatStatus('error');
      setCatErrorMessage(`Kategori "${trimmed}" sudah ada di daftar ${newCatType === 'Income' ? 'Pemasukan' : 'Pengeluaran'}.`);
      return;
    }

    const updated = [...activeCategories, { tipe: newCatType, nama: trimmed }];
    setIsCatModalOpen(false);
    setNewCatName('');
    await saveCategoriesList(updated);
  };

  // Edit category
  const handleEditCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    const trimmed = editingCategory.name.trim();
    if (!trimmed) return;

    const updated = activeCategories.map(c => {
      if (c.tipe === editingCategory.type && c.nama === editingCategory.originalName) {
        return { ...c, nama: trimmed };
      }
      return c;
    });

    setEditingCategory(null);
    await saveCategoriesList(updated);
  };

  // Delete category
  const handleConfirmDeleteCategory = async () => {
    if (!deletingCategory) return;

    const updated = activeCategories.filter(
      c => !(c.tipe === deletingCategory.tipe && c.nama === deletingCategory.nama)
    );

    setDeletingCategory(null);
    await saveCategoriesList(updated);
  };

  // Reset to default categories
  const handleConfirmReset = async () => {
    setIsResetConfirmOpen(false);
    await saveCategoriesList(DEFAULT_CATEGORIES);
  };

  const groupedIncome = getGroupedIncomeCategories(activeCategories);
  const groupedExpense = getGroupedExpenseCategories(activeCategories);

  return (
    <div id="mosque-info-view" className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                <Building className="w-5 h-5" />
              </div>
              Pengaturan & Informasi Masjid
            </h2>
            <p className="text-slate-500 text-sm mt-2 leading-relaxed">
              Kelola profil utama masjid dan sesuaikan struktur kategori transaksi kas masjid Anda.
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 mt-6 p-1.5 bg-slate-100 rounded-2xl max-w-md">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Building className="w-4 h-4 text-emerald-600" />
            <span>Profil Masjid</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Tags className="w-4 h-4 text-emerald-600" />
            <span>Kategori Transaksi</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PROFIL MASJID */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSubmitProfile} className="bg-white rounded-[32px] border border-slate-200/80 overflow-hidden shadow-sm">
          <div className="h-28 bg-emerald-800 p-6 sm:p-8 flex items-end relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_0.06%,transparent_0.06%)] [background-size:16px_16px] opacity-10"></div>
            <div className="relative z-10 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-emerald-300" />
              <span className="font-display font-bold text-emerald-100 text-xs sm:text-sm uppercase tracking-[0.15em]">Pengaturan Profil Utama</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {status === 'success' && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-sm text-emerald-800 flex items-center gap-2.5 animate-scale-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="font-medium">Profil masjid berhasil diperbarui dan disinkronkan ke Google Sheets!</div>
              </div>
            )}

            {status === 'error' && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-sm text-rose-800 flex items-center gap-2.5 animate-scale-in">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                <div>
                  <span className="font-bold">Gagal memperbarui:</span> {errorMessage}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Nama Masjid <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Building className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Masjid Raya Baiturrahman"
                      value={formData.namaMasjid}
                      onChange={(e) => setFormData({ ...formData, namaMasjid: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-slate-900 bg-slate-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Motto / Tagline</label>
                  <input
                    type="text"
                    placeholder="Contoh: Mengabdi Untuk Umat, Makmur Bersama Al-Qur'an"
                    value={formData.motto || ''}
                    onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-slate-900 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Alamat Lengkap</label>
                  <textarea
                    rows={3}
                    placeholder="Contoh: Jl. Ahmad Yani No. 45, Kecamatan Sukajadi, Kota Bandung"
                    value={formData.alamat || ''}
                    onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                    className="w-full p-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-slate-900 bg-slate-50/50 resize-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Nomor Telepon / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="Contoh: 081234567890"
                    value={formData.telepon || ''}
                    onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-slate-900 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Alamat Email Resmi</label>
                  <input
                    type="email"
                    placeholder="Contoh: dkm@masjidbaiturrahman.or.id"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-slate-900 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Website / Media Sosial</label>
                  <input
                    type="text"
                    placeholder="Contoh: https://masjidbaiturrahman.or.id"
                    value={formData.website || ''}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-slate-900 bg-slate-50/50"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Simpan Perubahan Profil</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: KATEGORI TRANSAKSI */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          {/* Explanation Banner */}
          <div className="bg-emerald-50/80 border border-emerald-200/80 p-5 rounded-[24px] flex items-start gap-3.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-900 leading-relaxed">
              <span className="font-bold">Struktur Kategori Saling Eksklusif (Mutually Exclusive):</span>
              <p className="mt-1">
                Kategori transaksi telah disederhanakan berdasarkan tujuan penggunaan dana (bukan aktivitas), sehingga setiap transaksi hanya memiliki satu kategori yang paling tepat. Administrator dapat menambah, merubah nama, atau menghapus kategori untuk penyesuaian khusus masjid.
              </p>
            </div>
          </div>

          {/* Status Alert */}
          {catStatus === 'success' && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-sm text-emerald-800 flex items-center gap-2.5 animate-scale-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="font-medium">Daftar kategori berhasil diperbarui dan disinkronkan!</div>
            </div>
          )}

          {catStatus === 'error' && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-sm text-rose-800 flex items-center gap-2.5 animate-scale-in">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <span className="font-bold">Gagal memperbarui kategori:</span> {catErrorMessage}
              </div>
            </div>
          )}

          {/* Controls Bar */}
          <div className="bg-white p-5 rounded-[24px] border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Pemasukan / Pengeluaran Sub-tabs */}
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setCatTab('Income')}
                className={`flex-1 sm:flex-none py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  catTab === 'Income'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Pemasukan ({activeCategories.filter(c => c.tipe === 'Income').length})</span>
              </button>
              <button
                type="button"
                onClick={() => setCatTab('Expense')}
                className={`flex-1 sm:flex-none py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  catTab === 'Expense'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TrendingDown className="w-3.5 h-3.5" />
                <span>Pengeluaran ({activeCategories.filter(c => c.tipe === 'Expense').length})</span>
              </button>
            </div>

            {/* Actions: Add & Reset */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(true)}
                disabled={catLoading}
                className="px-3.5 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset Default</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setNewCatType(catTab);
                  setNewCatName('');
                  setIsCatModalOpen(true);
                }}
                disabled={catLoading}
                className={`px-4 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                  catTab === 'Income' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Kategori</span>
              </button>
            </div>
          </div>

          {/* Grouped Category Cards Display */}
          <div className="space-y-4">
            {(catTab === 'Income' ? groupedIncome : groupedExpense).map((group) => (
              <div key={group.groupName} className="bg-white rounded-[24px] border border-slate-200/80 overflow-hidden shadow-xs">
                {/* Group Header */}
                <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-display font-bold text-sm text-slate-800 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${catTab === 'Income' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    {group.groupName}
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 bg-white px-2.5 py-1 rounded-full border border-slate-200">
                    {group.categories.length} Kategori
                  </span>
                </div>

                {/* Categories Items Grid */}
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {group.categories.map((catName) => (
                    <div 
                      key={catName} 
                      className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50/70 hover:bg-slate-100/80 rounded-xl border border-slate-200/60 transition-colors group"
                    >
                      <span className="text-xs font-semibold text-slate-800 truncate pr-2">
                        {catName}
                      </span>
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          title="Ubah nama"
                          onClick={() => setEditingCategory({ originalName: catName, name: catName, type: catTab })}
                          className="p-1 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-white cursor-pointer transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Hapus kategori"
                          onClick={() => setDeletingCategory({ tipe: catTab, nama: catName })}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {group.categories.length === 0 && (
                    <div className="col-span-full py-4 text-center text-xs text-slate-400 italic">
                      Tidak ada kategori dalam kelompok ini.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD CATEGORY */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsCatModalOpen(false)} />
          <div className="bg-white rounded-[28px] w-full max-w-md shadow-2xl border border-slate-100 p-6 relative z-10 animate-scale-in">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                Tambah Kategori Baru
              </h3>
              <button 
                onClick={() => setIsCatModalOpen(false)} 
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCategorySubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Tipe Transaksi</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewCatType('Income')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border cursor-pointer ${
                      newCatType === 'Income' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    Pemasukan (Income)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCatType('Expense')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border cursor-pointer ${
                      newCatType === 'Expense' ? 'bg-rose-50 border-rose-500 text-rose-800' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    Pengeluaran (Expense)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Nama Kategori <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Honor Petugas Kebersihan Khusus"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-slate-900 bg-slate-50/50"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!newCatName.trim()}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs cursor-pointer disabled:opacity-50"
                >
                  Simpan Kategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT CATEGORY */}
      {editingCategory && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setEditingCategory(null)} />
          <div className="bg-white rounded-[28px] w-full max-w-md shadow-2xl border border-slate-100 p-6 relative z-10 animate-scale-in">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-emerald-600" />
                Ubah Nama Kategori
              </h3>
              <button 
                onClick={() => setEditingCategory(null)} 
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditCategorySubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Nama Kategori Saat Ini</label>
                <input
                  type="text"
                  disabled
                  value={editingCategory.originalName}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-500 bg-slate-100"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Nama Baru <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama kategori baru"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-slate-900 bg-slate-50/50"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!editingCategory.name.trim()}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs cursor-pointer disabled:opacity-50"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL: DELETE CATEGORY */}
      <ConfirmationModal
        isOpen={Boolean(deletingCategory)}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleConfirmDeleteCategory}
        title="Hapus Kategori Transaksi"
        message={`Apakah Anda yakin ingin menghapus kategori "${deletingCategory?.nama}" dari daftar ${deletingCategory?.tipe === 'Income' ? 'Pemasukan' : 'Pengeluaran'}?`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        isLoading={catLoading}
      />

      {/* CONFIRMATION MODAL: RESET DEFAULT */}
      <ConfirmationModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleConfirmReset}
        title="Reset Kategori Bawaan (Default)"
        message="Apakah Anda yakin ingin mengembalikan seluruh daftar kategori ke struktur standar (bawaan)? Kategori custom buatan Anda akan terhapus."
        confirmText="Ya, Reset Default"
        cancelText="Batal"
        isLoading={catLoading}
      />
    </div>
  );
}
