/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Announcement, MosqueState } from '../types';
import { 
  Megaphone, Plus, Edit, Trash, Calendar, CheckCircle2, 
  Eye, FileText, X, AlertTriangle 
} from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';

interface AnnouncementsViewProps {
  state: MosqueState;
  onAddAnnouncement: (ann: Omit<Announcement, 'id'>) => Promise<void>;
  onEditAnnouncement: (id: string, ann: Omit<Announcement, 'id'>) => Promise<void>;
  onDeleteAnnouncement: (id: string) => Promise<void>;
}

export default function AnnouncementsView({
  state,
  onAddAnnouncement,
  onEditAnnouncement,
  onDeleteAnnouncement
}: AnnouncementsViewProps) {
  const [filterStatus, setFilterStatus] = useState<'All' | 'Publish' | 'Draft'>('All');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<Announcement | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form fields
  const [formField, setFormField] = useState({
    judul: '',
    isi: '',
    tanggal: new Date().toISOString().split('T')[0],
    status: 'Publish' as 'Draft' | 'Publish',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openAddModal = () => {
    setFormField({
      judul: '',
      isi: '',
      tanggal: new Date().toISOString().split('T')[0],
      status: 'Publish',
    });
    setEditItem(null);
    setIsFormOpen(true);
    setError(null);
  };

  const openEditModal = (item: Announcement) => {
    setEditItem(item);
    setFormField({
      judul: item.judul,
      isi: item.isi,
      tanggal: item.tanggal,
      status: item.status,
    });
    setIsFormOpen(true);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formField.judul.trim() || !formField.isi.trim()) {
      setError('Judul dan isi pengumuman wajib diisi');
      return;
    }
    setLoading(true);
    setError(null);

    const annData: Omit<Announcement, 'id'> = {
      judul: formField.judul.trim(),
      isi: formField.isi.trim(),
      tanggal: formField.tanggal,
      status: formField.status,
    };

    try {
      if (editItem && editItem.id) {
        const confirmed = window.confirm('Apakah Anda yakin ingin memperbarui pengumuman ini?');
        if (!confirmed) {
          setLoading(false);
          return;
        }
        await onEditAnnouncement(editItem.id, annData);
      } else {
        await onAddAnnouncement(annData);
      }
      setIsFormOpen(false);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan pengumuman');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setLoading(true);
    setError(null);
    try {
      await onDeleteAnnouncement(deleteId);
      setDeleteId(null);
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus pengumuman');
    } finally {
      setLoading(false);
    }
  };

  const filteredAnnouncements = state.announcements.filter((item) => {
    if (filterStatus === 'All') return true;
    return item.status === filterStatus;
  }).sort((a, b) => b.tanggal.localeCompare(a.tanggal));

  return (
    <div id="announcements-view" className="space-y-6 animate-fade-in">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-[32px] border border-slate-200/80">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center shrink-0">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 leading-tight">
              Papan Rilis Pengumuman Resmi
            </h2>
            <p className="text-slate-500 text-sm mt-1.5">
              Komposisi kajian rutin, agenda hari raya, berita duka cita, atau maklumat kepengurusan DKM.
            </p>
          </div>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          Tulis Pengumuman Baru
        </button>
      </div>

      {/* Filter tab bar */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit">
        {(['All', 'Publish', 'Draft'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              filterStatus === status
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'
            }`}
          >
            {status === 'All' ? 'Semua Pengumuman' : status}
          </button>
        ))}
      </div>

      {/* List Announcements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((ann) => (
            <div 
              key={ann.id} 
              className="bg-white p-6 sm:p-8 rounded-[32px] border border-slate-200/80 hover:shadow-md transition-shadow relative flex flex-col justify-between"
            >
              <div>
                {/* Meta Header block */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {ann.tanggal}
                  </span>
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    ann.status === 'Publish' 
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                      : 'bg-amber-50 text-amber-800 border border-amber-100'
                  }`}>
                    {ann.status}
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-slate-900 tracking-tight mb-2">
                  {ann.judul}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-sans whitespace-pre-wrap">
                  {ann.isi}
                </p>
              </div>

              {/* Actions footer block */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(ann)}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Ubah
                </button>
                <button
                  onClick={() => setDeleteId(ann.id || null)}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash className="w-3.5 h-3.5" />
                  Hapus
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="md:col-span-2 py-16 text-center text-slate-400 bg-white rounded-[32px] border border-slate-200">
            <Megaphone className="w-12 h-12 mx-auto mb-2 opacity-50 text-slate-400" />
            <span className="text-sm">Belum ada rilis pengumuman terdaftar di kategori ini</span>
          </div>
        )}
      </div>

      {/* ANNOUNCEMENT FORM DIALOG */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[32px] w-full max-w-lg shadow-xl overflow-hidden border border-slate-100 animate-scale-in">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full block bg-sky-500"></span>
                <h3 className="font-display font-bold text-lg text-slate-900">
                  {editItem ? 'Ubah Pengumuman' : 'Tulis Pengumuman Baru'}
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

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5 tracking-widest">Judul Pengumuman</label>
                <input 
                  type="text" 
                  placeholder="Kajian subuh, tabligh akbar, santunan..."
                  required
                  value={formField.judul}
                  onChange={(e) => setFormField({ ...formField, judul: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5 tracking-widest">Konten / Isi Pengumuman</label>
                <textarea 
                  placeholder="Tulis rincian lengkap maklumat pengumuman di sini..."
                  rows={5}
                  required
                  value={formField.isi}
                  onChange={(e) => setFormField({ ...formField, isi: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5 tracking-widest">Tanggal Rilis</label>
                  <input 
                    type="date" 
                    required
                    value={formField.tanggal}
                    onChange={(e) => setFormField({ ...formField, tanggal: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5 tracking-widest">Status Publikasi</label>
                  <select
                    value={formField.status}
                    onChange={(e) => setFormField({ ...formField, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm text-slate-700 bg-white"
                  >
                    <option value="Publish">Publish (Tampil)</option>
                    <option value="Draft">Draft (Simpan saja)</option>
                  </select>
                </div>
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
                  className="px-5 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Menyimpan...' : 'Simpan Pengumuman'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM DIALOG */}
      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Konfirmasi Hapus Pengumuman"
        message="Apakah Anda yakin ingin menghapus rilis pengumuman ini secara permanen dari database Google Sheets? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        isLoading={loading}
      />
    </div>
  );
}
