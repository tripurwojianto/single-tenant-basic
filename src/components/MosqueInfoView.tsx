/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MosqueInfo } from '../types';
import { LayoutGrid, Save, Globe, MessageSquare, Mail, MapPin, Building, Sparkles, HelpCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface MosqueInfoViewProps {
  info: MosqueInfo;
  onSave: (info: MosqueInfo) => Promise<void>;
}

export default function MosqueInfoView({ info, onSave }: MosqueInfoViewProps) {
  const [formData, setFormData] = useState<MosqueInfo>({ ...info });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
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

  return (
    <div id="mosque-info-view" className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Description header */}
      <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-slate-200/80">
        <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <Building className="w-5 h-5" />
          </div>
          Informasi & Profil Masjid
        </h2>
        <p className="text-slate-500 text-sm mt-3 leading-relaxed">
          Lengkapi identitas resmi masjid Anda. Informasi di bawah ini akan tercetak otomatis pada bagian kop laporan keuangan, ringkasan kas, serta materi pengumuman publik.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[32px] border border-slate-200/80 overflow-hidden shadow-sm">
        {/* Visual Header Banner */}
        <div className="h-28 bg-emerald-800 p-6 sm:p-8 flex items-end relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_0.06%,transparent_0.06%)] [background-size:16px_16px] opacity-10"></div>
          <div className="relative z-10 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-emerald-300" />
            <span className="font-display font-bold text-emerald-100 text-xs sm:text-sm uppercase tracking-[0.15em]">Pengaturan Profil Utama</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Status Alert Banner */}
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
            {/* Left Col */}
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
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Logo Masjid (URL Gambar)</label>
                <input
                  type="text"
                  placeholder="Contoh: https://link-ke-foto.com/logo.png"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-slate-700"
                />
                <p className="text-[11px] text-slate-400 mt-1">Masukkan link URL foto langsung (.png/.jpg) dari internet atau Unsplash.</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Motto / Tagline Masjid</label>
                <input
                  type="text"
                  placeholder="Contoh: Menuju Ummat Madani Berlandaskan Al-Qur'an"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-slate-700"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Profil Singkat Masjid</label>
                <textarea
                  placeholder="Ceritakan singkat sejarah, kapasitas jamaah, atau keunikan masjid..."
                  rows={4}
                  value={formData.profilSingkat}
                  onChange={(e) => setFormData({ ...formData, profilSingkat: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-slate-700 leading-relaxed"
                />
              </div>
            </div>

            {/* Right Col */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Alamat Jalan</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Contoh: Jl. Ahmad Yani No. 12"
                    value={formData.alamat}
                    onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Kota / Kabupaten</label>
                <input
                  type="text"
                  placeholder="Contoh: Banda Aceh"
                  value={formData.kota}
                  onChange={(e) => setFormData({ ...formData, kota: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-slate-700"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">No. WhatsApp DKM</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <MessageSquare className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Contoh: 081234567890"
                    value={formData.whatsApp}
                    onChange={(e) => setFormData({ ...formData, whatsApp: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-slate-700 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Email DKM / Masjid</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    placeholder="Contoh: info@masjidraya.org"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Situs Web Resmi (Website)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Globe className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Contoh: www.masjidraya.org"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-slate-700"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button Footer row */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
              <HelpCircle className="w-4 h-4 text-slate-300" />
              Kolom bertanda <span className="text-rose-500">*</span> wajib diisi
            </span>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
