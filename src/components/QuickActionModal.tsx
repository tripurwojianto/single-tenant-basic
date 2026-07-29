import React, { useState, useEffect } from 'react';
import { MosqueState, CashTransaction, InventoryItem, Announcement } from '../types';
import { X, AlertTriangle, Plus, Loader2 } from 'lucide-react';

interface QuickActionModalProps {
  activeModal: 'income' | 'expense' | 'inventory' | 'announcement' | null;
  onClose: () => void;
  state: MosqueState;
  onAddIncome: (income: Omit<CashTransaction, 'id'>) => Promise<void>;
  onAddExpense: (expense: Omit<CashTransaction, 'id'>) => Promise<void>;
  onAddInventory: (item: Omit<InventoryItem, 'id'>) => Promise<void>;
  onAddAnnouncement: (announcement: Omit<Announcement, 'id'>) => Promise<void>;
}

export default function QuickActionModal({
  activeModal,
  onClose,
  state,
  onAddIncome,
  onAddExpense,
  onAddInventory,
  onAddAnnouncement
}: QuickActionModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [incomeForm, setIncomeForm] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    kategori: 'Infaq Jumaat',
    nominal: '',
    deskripsi: '',
    bukti: ''
  });

  const [expenseForm, setExpenseForm] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    kategori: 'Listrik & Air',
    nominal: '',
    deskripsi: '',
    bukti: ''
  });

  const [inventoryForm, setInventoryForm] = useState({
    namaBarang: '',
    jumlah: '1',
    kondisi: 'Baik' as const,
    lokasi: 'Ruang Utama',
    nilaiAset: ''
  });

  const [announcementForm, setAnnouncementForm] = useState({
    judul: '',
    isi: '',
    tanggal: new Date().toISOString().split('T')[0],
    status: 'Publish' as const
  });

  useEffect(() => {
    setError(null);
    setIsSubmitting(false);
  }, [activeModal]);

  if (!activeModal) return null;

  const handleIncomeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incomeForm.nominal || Number(incomeForm.nominal) <= 0) {
      setError('Nominal harus lebih dari 0');
      return;
    }
    try {
      setIsSubmitting(true);
      setError(null);
      await onAddIncome({
        tanggal: incomeForm.tanggal,
        kategori: incomeForm.kategori,
        nominal: Number(incomeForm.nominal),
        deskripsi: incomeForm.deskripsi,
        bukti: incomeForm.bukti
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Gagal menyimpan pemasukan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.nominal || Number(expenseForm.nominal) <= 0) {
      setError('Nominal harus lebih dari 0');
      return;
    }
    try {
      setIsSubmitting(true);
      setError(null);
      await onAddExpense({
        tanggal: expenseForm.tanggal,
        kategori: expenseForm.kategori,
        nominal: Number(expenseForm.nominal),
        deskripsi: expenseForm.deskripsi,
        bukti: expenseForm.bukti
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Gagal menyimpan pengeluaran');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInventorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inventoryForm.namaBarang) {
      setError('Nama barang harus diisi');
      return;
    }
    try {
      setIsSubmitting(true);
      setError(null);
      await onAddInventory({
        namaBarang: inventoryForm.namaBarang,
        kategori: 'Perlengkapan',
        lokasi: inventoryForm.lokasi,
        jumlah: Number(inventoryForm.jumlah) || 1,
        kondisi: inventoryForm.kondisi,
        keterangan: inventoryForm.nilaiAset || 'Peralatan/Aset Masjid'
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Gagal menyimpan inventaris');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementForm.judul || !announcementForm.isi) {
      setError('Judul dan isi pengumuman wajib diisi');
      return;
    }
    try {
      setIsSubmitting(true);
      setError(null);
      await onAddAnnouncement({
        judul: announcementForm.judul,
        isi: announcementForm.isi,
        tanggal: announcementForm.tanggal,
        status: announcementForm.status
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Gagal menyimpan pengumuman');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 animate-scale-in">
        
        {/* Header Modal */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-2.5">
            <span className={`w-3 h-3 rounded-full block ${
              activeModal === 'income' ? 'bg-emerald-500' :
              activeModal === 'expense' ? 'bg-rose-500' :
              activeModal === 'inventory' ? 'bg-amber-500' : 'bg-blue-500'
            }`}></span>
            <h3 className="font-display font-black text-base sm:text-lg text-slate-900">
              {activeModal === 'income' && 'Catat Pemasukan Baru'}
              {activeModal === 'expense' && 'Catat Pengeluaran Baru'}
              {activeModal === 'inventory' && 'Tambah Inventaris Baru'}
              {activeModal === 'announcement' && 'Buat Pengumuman Baru'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
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
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">URL Bukti (Opsional)</label>
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
                  placeholder="Contoh: 350000"
                  required
                  value={expenseForm.nominal}
                  onChange={(e) => setExpenseForm({ ...expenseForm, nominal: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Deskripsi Pengeluaran</label>
                <textarea 
                  placeholder="Tulis ke mana dana digunakan..."
                  rows={3}
                  value={expenseForm.deskripsi}
                  onChange={(e) => setExpenseForm({ ...expenseForm, deskripsi: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">URL Nota/Struk (Opsional)</label>
                <input 
                  type="text" 
                  placeholder="Tautan gambar nota..."
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
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Nama Barang / Aset</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Sound System Wireless"
                  required
                  value={inventoryForm.namaBarang}
                  onChange={(e) => setInventoryForm({ ...inventoryForm, namaBarang: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Jumlah</label>
                  <input 
                    type="number" 
                    min="1"
                    required
                    value={inventoryForm.jumlah}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, jumlah: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Kondisi</label>
                  <select
                    value={inventoryForm.kondisi}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, kondisi: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm"
                  >
                    <option value="Baik">Baik</option>
                    <option value="Rusak Ringan">Rusak Ringan</option>
                    <option value="Rusak Berat">Rusak Berat</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Lokasi Penyimpanan</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Gudang Utama"
                    value={inventoryForm.lokasi}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, lokasi: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Keterangan Tambahan</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Pembelian kas DKM 2026"
                    value={inventoryForm.nilaiAset}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, nilaiAset: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm"
                  />
                </div>
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
                  placeholder="Contoh: Pelaksanaan Shalat Idul Fitri 1447 H"
                  required
                  value={announcementForm.judul}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, judul: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Isi Pengumuman</label>
                <textarea 
                  placeholder="Tulis pesan lengkap untuk jemaah..."
                  rows={4}
                  required
                  value={announcementForm.isi}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, isi: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Tanggal Publikasi</label>
                  <input 
                    type="date" 
                    required
                    value={announcementForm.tanggal}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, tanggal: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Status Publikasi</label>
                  <select
                    value={announcementForm.status}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                  >
                    <option value="Publish">Publish (Tampil Publik)</option>
                    <option value="Draft">Draft (Simpan Dulu)</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-3 text-white rounded-xl text-xs font-extrabold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                activeModal === 'income' ? 'bg-emerald-600 hover:bg-emerald-700' :
                activeModal === 'expense' ? 'bg-rose-600 hover:bg-rose-700' :
                activeModal === 'inventory' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? (
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
  );
}
