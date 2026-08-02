/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FeedbackData } from '../types';
import { Send, CheckCircle2, MessageSquare, AlertTriangle, Bug, HelpCircle } from 'lucide-react';

interface FeedbackViewProps {
  onSendFeedback: (data: FeedbackData) => Promise<void>;
}

export default function FeedbackView({ onSendFeedback }: FeedbackViewProps) {
  const [formData, setFormData] = useState({
    tipe: 'Saran' as 'Saran' | 'Bug' | 'Pertanyaan' | 'PermintaanFitur',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message.trim()) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    const feedbackPayload: FeedbackData = {
      saran: formData.tipe === 'Saran' ? formData.message.trim() : '',
      bug: formData.tipe === 'Bug' ? formData.message.trim() : '',
      pertanyaan: formData.tipe === 'Pertanyaan' ? formData.message.trim() : '',
      permintaanFitur: formData.tipe === 'PermintaanFitur' ? formData.message.trim() : '',
      tanggal: new Date().toISOString().split('T')[0],
    };

    try {
      await onSendFeedback(feedbackPayload);
      setSuccess(true);
      setFormData({ tipe: 'Saran', message: '' });
    } catch (err: any) {
      setError(err.message || 'Gagal mengirimkan tanggapan Anda');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="feedback-view" className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      {/* Header Info */}
      <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-slate-200/80 flex items-start gap-4">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
          <MessageSquare className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 leading-tight">
            Hubungi Pengembang (Feedback)
          </h2>
          <p className="text-slate-500 text-sm mt-1.5">
            KasMasjid adalah proyek administrasi nirlaba. Masukan, temuan bug, pertanyaan, atau usulan fitur dari Anda sangat berharga untuk pengembangan platform ini.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-[32px] border border-slate-200/80 space-y-6 shadow-sm">
        {/* Success Alert */}
        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-sm text-emerald-800 flex items-center gap-2.5 animate-scale-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="font-medium">Tanggapan berhasil dikirim! Terima kasih atas partisipasi aktif Anda dalam memajukan sistem administrasi masjid.</div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-sm text-rose-800 flex items-center gap-2.5 animate-scale-in">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <span className="font-bold">Gagal mengirim masukan:</span> {error}
            </div>
          </div>
        )}

        {/* Feedback Type picker */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2.5">Tipe Masukan / Tanggapan</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { key: 'Saran', label: 'Saran / Kritik' },
              { key: 'Bug', label: 'Laporkan Bug' },
              { key: 'Pertanyaan', label: 'Pertanyaan' },
              { key: 'PermintaanFitur', label: 'Usul Fitur' },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setFormData({ ...formData, tipe: item.key as any })}
                className={`py-3 px-2 text-xs font-semibold rounded-xl border transition-all text-center cursor-pointer ${
                  formData.tipe === item.key
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-100'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Body */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2.5">Pesan Masukan Anda</label>
          <textarea
            required
            rows={6}
            placeholder={
              formData.tipe === 'Saran' ? 'Tuliskan saran perbaikan untuk performa, alur, atau desain...' :
              formData.tipe === 'Bug' ? 'Deskripsikan bug: apa yang diklik, apa yang salah, dan apa pesan errornya...' :
              formData.tipe === 'Pertanyaan' ? 'Tuliskan pertanyaan seputar deployment, keamanan data, atau integrasi sheets...' :
              'Tuliskan ide fitur impian Anda yang ingin ditambahkan di update edisi selanjutnya...'
            }
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-slate-700 leading-relaxed"
          />
        </div>

        {/* Footer actions */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            Tanggapan disimpan di spreadsheet Anda & dikirim ke dev.
          </span>
          <button
            type="submit"
            disabled={loading || !formData.message.trim()}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {loading ? 'Mengirim...' : 'Kirim Feedback'}
          </button>
        </div>
      </form>
    </div>
  );
}
