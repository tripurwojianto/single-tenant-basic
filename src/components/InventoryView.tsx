/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { InventoryItem, MosqueState } from '../types';
import { 
  Box, Plus, Edit, Trash, Search, MapPin, Tag, ShieldCheck, 
  AlertCircle, ChevronRight, X, AlertTriangle, FileSpreadsheet 
} from 'lucide-react';

interface InventoryViewProps {
  state: MosqueState;
  onAddInventory: (item: Omit<InventoryItem, 'id'>) => Promise<void>;
  onEditInventory: (id: string, item: Omit<InventoryItem, 'id'>) => Promise<void>;
  onDeleteInventory: (id: string) => Promise<void>;
}

export default function InventoryView({ 
  state, 
  onAddInventory, 
  onEditInventory, 
  onDeleteInventory 
}: InventoryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCondition, setSelectedCondition] = useState<'Semua' | 'Baik' | 'Rusak Ringan' | 'Rusak Berat'>('Semua');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form states
  const [formField, setFormField] = useState({
    namaBarang: '',
    kategori: 'Perlengkapan',
    lokasi: 'Ruang Sholat Utama',
    jumlah: '1',
    kondisi: 'Baik' as 'Baik' | 'Rusak Ringan' | 'Rusak Berat',
    keterangan: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openAddModal = () => {
    setFormField({
      namaBarang: '',
      kategori: 'Perlengkapan',
      lokasi: 'Ruang Sholat Utama',
      jumlah: '1',
      kondisi: 'Baik',
      keterangan: '',
    });
    setEditItem(null);
    setIsFormOpen(true);
    setError(null);
  };

  const openEditModal = (item: InventoryItem) => {
    setEditItem(item);
    setFormField({
      namaBarang: item.namaBarang,
      kategori: item.kategori,
      lokasi: item.lokasi,
      jumlah: item.jumlah.toString(),
      kondisi: item.kondisi,
      keterangan: item.keterangan || '',
    });
    setIsFormOpen(true);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formField.namaBarang.trim()) {
      setError('Nama barang wajib diisi');
      return;
    }
    if (!formField.jumlah || Number(formField.jumlah) <= 0) {
      setError('Jumlah barang harus minimal 1');
      return;
    }
    setLoading(true);
    setError(null);

    const itemData: Omit<InventoryItem, 'id'> = {
      namaBarang: formField.namaBarang.trim(),
      kategori: formField.kategori,
      lokasi: formField.lokasi,
      jumlah: Number(formField.jumlah),
      kondisi: formField.kondisi,
      keterangan: formField.keterangan,
    };

    try {
      if (editItem && editItem.id) {
        const confirmed = window.confirm('Apakah Anda yakin ingin memperbarui data barang inventaris ini?');
        if (!confirmed) {
          setLoading(false);
          return;
        }
        await onEditInventory(editItem.id, itemData);
      } else {
        await onAddInventory(itemData);
      }
      setIsFormOpen(false);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan barang inventaris');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setLoading(true);
    setError(null);
    try {
      await onDeleteInventory(deleteId);
      setDeleteId(null);
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus inventaris');
    } finally {
      setLoading(false);
    }
  };

  // Filters
  const filteredList = state.inventory.filter((item) => {
    const matchesSearch = 
      item.namaBarang.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lokasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kategori.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCondition = selectedCondition === 'Semua' || item.kondisi === selectedCondition;

    return matchesSearch && matchesCondition;
  });

  // Calculate quick stats
  const totalItems = state.inventory.reduce((sum, item) => sum + item.jumlah, 0);
  const totalBaik = state.inventory.filter(i => i.kondisi === 'Baik').reduce((sum, item) => sum + item.jumlah, 0);
  const totalRusakRingan = state.inventory.filter(i => i.kondisi === 'Rusak Ringan').reduce((sum, item) => sum + item.jumlah, 0);
  const totalRusakBerat = state.inventory.filter(i => i.kondisi === 'Rusak Berat').reduce((sum, item) => sum + item.jumlah, 0);

  return (
    <div id="inventory-view" className="space-y-6 animate-fade-in">
      {/* Header Profile */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-[32px] border border-slate-200/80">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
            <Box className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 leading-tight">
              Manajemen Inventaris & Aset Masjid
            </h2>
            <p className="text-slate-500 text-sm mt-1.5">
              Daftar inventarisasi sarana prasarana penunjang kegiatan peribadatan masjid.
            </p>
          </div>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          Tambah Barang Aset
        </button>
      </div>

      {/* Asset Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-[24px] border border-slate-200/60 text-left">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Aset Fisik</span>
          <h4 className="font-display font-black text-3xl text-slate-900 mt-2">{totalItems} <span className="text-xs text-slate-400 font-sans font-medium">unit</span></h4>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-slate-200/60 text-left">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Kondisi Baik</span>
          <h4 className="font-display font-black text-3xl text-emerald-600 mt-2">{totalBaik} <span className="text-xs text-emerald-400 font-sans font-medium">unit</span></h4>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-slate-200/60 text-left">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Rusak Ringan</span>
          <h4 className="font-display font-black text-3xl text-amber-600 mt-2">{totalRusakRingan} <span className="text-xs text-amber-400 font-sans font-medium">unit</span></h4>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-slate-200/60 text-left">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Rusak Berat</span>
          <h4 className="font-display font-black text-3xl text-rose-600 mt-2">{totalRusakBerat} <span className="text-xs text-rose-400 font-sans font-medium">unit</span></h4>
        </div>
      </div>

      {/* Filters Area */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-200/80 flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Cari nama barang, kategori, lokasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm text-slate-700"
          />
        </div>

        {/* Condition Filter */}
        <div className="w-full sm:w-60">
          <select
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value as any)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm text-slate-700 bg-white"
          >
            <option value="Semua">Semua Kondisi</option>
            <option value="Baik">Kondisi Baik</option>
            <option value="Rusak Ringan">Kondisi Rusak Ringan</option>
            <option value="Rusak Berat">Kondisi Rusak Berat</option>
          </select>
        </div>
      </div>

      {/* Inventory Items List */}
      <div className="bg-white rounded-[32px] border border-slate-200/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-display font-bold text-[10px] uppercase tracking-widest">
                <th className="py-4 px-6">Nama Barang</th>
                <th className="py-4 px-6">Kategori</th>
                <th className="py-4 px-6">Lokasi</th>
                <th className="py-4 px-6 text-center">Jumlah</th>
                <th className="py-4 px-6 text-center">Kondisi</th>
                <th className="py-4 px-6">Keterangan</th>
                <th className="py-4 px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
              {filteredList.length > 0 ? (
                filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900 whitespace-nowrap">
                      {item.namaBarang}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-slate-500 text-xs">
                      <span className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-slate-400" />
                        {item.kategori}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-slate-500 text-xs">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {item.lokasi}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center font-bold font-mono text-slate-950 text-xs">
                      {item.jumlah}
                    </td>
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                        item.kondisi === 'Baik' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' :
                        item.kondisi === 'Rusak Ringan' ? 'bg-amber-50 text-amber-800 border border-amber-100' :
                        'bg-rose-50 text-rose-800 border border-rose-100'
                      }`}>
                        {item.kondisi}
                      </span>
                    </td>
                    <td className="py-4 px-6 max-w-xs truncate text-slate-500 text-xs">
                      {item.keterangan || '-'}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEditModal(item)}
                          className="w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
                          title="Ubah data aset"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(item.id || null)}
                          className="w-7 h-7 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 rounded-lg flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
                          title="Hapus aset"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    <Box className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <span className="text-sm">Tidak ditemukan barang inventaris yang cocok</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-400">
          * Aset yang dalam kondisi rusak berat direkomendasikan segera diinventarisasi ulang untuk rencana perbaikan atau penghapusan aset.
        </div>
      </div>

      {/* INVENTORY FORM MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[32px] w-full max-w-lg shadow-xl overflow-hidden border border-slate-100 animate-scale-in">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full block bg-amber-500"></span>
                <h3 className="font-display font-bold text-lg text-slate-900">
                  {editItem ? 'Ubah Barang Inventaris' : 'Tambah Barang Inventaris Baru'}
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
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5 tracking-widest">Nama Barang</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Genset Honda"
                    required
                    value={formField.namaBarang}
                    onChange={(e) => setFormField({ ...formField, namaBarang: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5 tracking-widest">Kategori</label>
                  <select
                    value={formField.kategori}
                    onChange={(e) => setFormField({ ...formField, kategori: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm bg-white"
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
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5 tracking-widest">Jumlah</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    value={formField.jumlah}
                    onChange={(e) => setFormField({ ...formField, jumlah: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm font-bold font-mono"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5 tracking-widest">Lokasi Penyimpanan</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Gudang utama"
                    value={formField.lokasi}
                    onChange={(e) => setFormField({ ...formField, lokasi: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5 tracking-widest">Kondisi Barang</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Baik', 'Rusak Ringan', 'Rusak Berat'].map((cond) => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => setFormField({ ...formField, kondisi: cond as any })}
                      className={`py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                        formField.kondisi === cond
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
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5 tracking-widest">Keterangan Tambahan</label>
                <input 
                  type="text" 
                  placeholder="Merek, spesifikasi, atau catatan..."
                  value={formField.keterangan}
                  onChange={(e) => setFormField({ ...formField, keterangan: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm"
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
                  className="px-5 py-2 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Menyimpan...' : 'Simpan Barang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM DIALOG */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[32px] w-full max-w-sm shadow-xl overflow-hidden p-6 text-center border border-slate-100 animate-scale-in">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900 mb-2">Konfirmasi Hapus</h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Apakah Anda yakin ingin menghapus barang inventaris ini secara permanen dari database Google Sheets? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={loading}
                className="px-5 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
