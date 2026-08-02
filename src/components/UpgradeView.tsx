import React, { useState } from 'react';
import { 
  Sparkles, CheckCircle2, ShieldCheck, Globe, Users, Smartphone, 
  Receipt, ArrowRight, MessageCircle, HelpCircle, Info, ChevronRight, 
  Building2, Check, ExternalLink, Send, X, Star, HeartHandshake, QrCode
} from 'lucide-react';

interface UpgradeViewProps {
  mosqueName?: string;
  onNavigateToDemo?: () => void;
}

export default function UpgradeView({ mosqueName = 'Masjid Anda', onNavigateToDemo }: UpgradeViewProps) {
  const [selectedPlan, setSelectedPlan] = useState<'portal' | 'membership' | null>(null);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [consultNotes, setConsultNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleOpenConsult = (plan: 'portal' | 'membership') => {
    setSelectedPlan(plan);
    setConsultNotes(`Assalamu'alaikum, saya ingin bertanya lebih lanjut mengenai paket KasMasjid ${plan === 'portal' ? 'Portal' : 'Membership'} untuk ${mosqueName}.`);
    setIsConsultModalOpen(true);
  };

  const handleSendConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !senderPhone.trim()) return;

    setSubmitted(true);
    setTimeout(() => {
      // Send via WhatsApp URL redirect in new tab
      const message = encodeURIComponent(
        `*Konsultasi KasMasjid ${selectedPlan === 'portal' ? 'Portal' : 'Membership'}*\n\n` +
        `🕌 *Nama Masjid:* ${mosqueName}\n` +
        `👤 *Pengurus/DKM:* ${senderName}\n` +
        `📱 *No. WA:* ${senderPhone}\n\n` +
        `📝 *Pesan:* ${consultNotes}`
      );
      window.open(`https://wa.me/6288973641682?text=${message}`, '_blank');

      setIsConsultModalOpen(false);
      setSubmitted(false);
      setSenderName('');
      setSenderPhone('');
    }, 800);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12 font-sans">
      
      {/* 1. Header & Educational Banner */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 rounded-[28px] sm:rounded-[36px] p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-emerald-700/50">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-10 w-60 h-60 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
            <span>Pilihan Paket & Edisi KasMasjid</span>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight leading-snug">
            Tumbuh Bersama Kebutuhan & Transparansi DKM Masjid Anda
          </h1>

          <p className="text-emerald-100/90 text-xs sm:text-base leading-relaxed font-medium">
            KasMasjid hadir dalam beberapa tingkatan layanan. Mulai dari pembukuan kas mandiri bendahara hingga website portal resmi dengan pendampingan penuh.
          </p>
        </div>

        {/* Notice Banner */}
        <div className="mt-6 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-600/40 text-emerald-100 text-xs sm:text-sm flex items-start gap-3 relative z-10 backdrop-blur-xs">
          <Info className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold text-white">Halaman Informasi & Edukasi</p>
            <p className="text-emerald-200/80 leading-relaxed text-xs">
              Halaman ini bertujuan menjelaskan perbedaan paket KasMasjid untuk bahan pertimbangan pengurus DKM. <strong>Belum memerlukan proses pembayaran.</strong>
            </p>
          </div>
        </div>
      </div>

      {/* 2. Tiga Kartu Paket Utama (Basic, Portal, Membership) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
        
        {/* PAKET 1: KASMASJID BASIC */}
        <div className="bg-white rounded-[28px] p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between relative hover:border-slate-300 transition-all">
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-extrabold uppercase tracking-wider border border-slate-200">
                Edisi Aktif saat ini
              </span>
              <span className="font-display font-bold text-xs text-slate-400">01 / BASIC</span>
            </div>

            <div>
              <h2 className="font-display font-black text-2xl text-slate-900 tracking-tight">
                KasMasjid (Google Sheets)
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Solusi Pembukuan Internal Bendahara
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1">
              <p className="font-bold text-slate-800">Fokus Utama:</p>
              <p className="leading-relaxed">Dikelola mandiri oleh bendahara masjid untuk kebutuhan akuntabilitas kas internal.</p>
            </div>

            <div className="space-y-3 pt-2">
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wider text-[10px]">Fitur Utama Basic:</p>
              
              <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Single Admin</strong> (1 Akun Pengurus / Bendahara)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Data hanya dikelola bendahara</strong> secara fokus</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Cocok untuk penggunaan pribadi</strong> & masjid lingkungan</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>Penyimpanan Google Sheets di Google Drive pribadi</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>Laporan Arus Kas Ledger, Aset Inventaris & Pengumuman</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>Pendamping AI Asisten Amina untuk konsultasi DKM</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 mt-6 border-t border-slate-100">
            <button
              disabled
              className="w-full py-3.5 px-4 bg-slate-100 text-slate-500 font-display font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 cursor-default border border-slate-200"
            >
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Paket Saat Ini Digunakan</span>
            </button>
          </div>
        </div>

        {/* PAKET 2: KASMASJID PORTAL */}
        <div className="bg-gradient-to-b from-emerald-50/60 via-white to-white rounded-[28px] p-6 sm:p-7 border-2 border-emerald-500 shadow-lg shadow-emerald-950/5 flex flex-col justify-between relative hover:border-emerald-600 transition-all transform hover:-translate-y-1">
          {/* Highlight Badge */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-[10px] uppercase tracking-widest px-4 py-1 rounded-full shadow-md border border-emerald-400/40 flex items-center gap-1.5">
            <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
            <span>Rekomendasi DKM</span>
          </div>

          <div className="space-y-6 pt-2">
            <div className="flex items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold uppercase tracking-wider border border-emerald-200">
                Edisi Kolaborasi
              </span>
              <span className="font-display font-bold text-xs text-emerald-700">02 / PORTAL</span>
            </div>

            <div>
              <h2 className="font-display font-black text-2xl text-slate-900 tracking-tight flex items-center gap-2">
                <span>KasMasjid Portal</span>
              </h2>
              <p className="text-xs text-emerald-800 font-semibold mt-1">
                Website Publik Masjid & Kolaborasi Tim
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-200/80 text-xs text-emerald-950 space-y-1">
              <p className="font-bold text-emerald-900">Fokus Utama:</p>
              <p className="leading-relaxed">Keterbukaan informasi keuangan ke jamaah & kerjasama antar pengurus DKM.</p>
            </div>

            <div className="space-y-3 pt-2">
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wider text-[10px]">Fitur Utama Portal:</p>
              
              <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Multi Admin</strong> (Ketua, Sekretaris, Bendahara)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Website publik masjid</strong> resmi untuk warta & laporan</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Jamaah dapat melihat informasi</strong> saldo & kegiatan</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Notifikasi WhatsApp otomatis donatur & grup WA DKM</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Cetak Struk/Kwitansi fisik dengan printer termal</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Infaq & Sedekah Digital via QRIS Masjid</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 mt-6 border-t border-emerald-100">
            <button
              onClick={() => handleOpenConsult('portal')}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-display font-extrabold text-xs rounded-2xl transition-all shadow-md hover:shadow-lg shadow-emerald-900/10 flex items-center justify-center gap-2 cursor-pointer border border-emerald-500 active:scale-98"
            >
              <span>[ Konsultasi Informasi Portal ]</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PAKET 3: KASMASJID MEMBERSHIP */}
        <div className="bg-white rounded-[28px] p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between relative hover:border-slate-300 transition-all">
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-[11px] font-extrabold uppercase tracking-wider border border-teal-200">
                Managed Service
              </span>
              <span className="font-display font-bold text-xs text-slate-400">03 / MEMBERSHIP</span>
            </div>

            <div>
              <h2 className="font-display font-black text-2xl text-slate-900 tracking-tight">
                KasMasjid Membership
              </h2>
              <p className="text-xs text-teal-700 font-semibold mt-1">
                Eksklusif Terima Beres & Custom Domain
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-100 text-xs text-slate-700 space-y-1">
              <p className="font-bold text-teal-900">Fokus Utama:</p>
              <p className="leading-relaxed">Solusi lengkap tanpa ribet teknis dengan pendampingan tim ahli secara berkelanjutan.</p>
            </div>

            <div className="space-y-3 pt-2">
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wider text-[10px]">Fitur Utama Membership:</p>
              
              <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>URL unik khusus</strong> <i>(contoh: masjid-annoor.kukas.biz.id)</i></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Bisa Custom Domain</strong> <i>(contoh: www.masjidannoor.or.id)</i></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Pendampingan teknis</strong> & operasional harian</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Update berkelanjutan</strong> (fitur baru otomatis didapat)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Bantuan instalasi & impor data kas lama masjid</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Infrastruktur cloud khusus & backup otomatis berkala</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 mt-6 border-t border-slate-100">
            <button
              onClick={() => handleOpenConsult('membership')}
              className="w-full py-3.5 px-4 bg-teal-800 hover:bg-teal-700 text-white font-display font-extrabold text-xs rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer border border-teal-700 active:scale-98"
            >
              <span>[ Konsultasi Informasi Membership ]</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* 3. TABEL MATRIKS KOMPARASI */}
      <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="space-y-1">
          <h2 className="font-display font-black text-xl text-slate-900 tracking-tight flex items-center gap-2">
            <span>Matriks Perbandingan Fitur</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Rincian kapabilitas dari tiap tingkatan layanan KasMasjid.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-700 font-display font-extrabold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 w-1/3">Fitur / Kapabilitas</th>
                <th className="py-3.5 px-4 text-center w-1/5">KasMasjid</th>
                <th className="py-3.5 px-4 text-center w-1/5 text-emerald-800 bg-emerald-50/50">KasMasjid Portal</th>
                <th className="py-3.5 px-4 text-center w-1/5 text-teal-900 bg-teal-50/50">KasMasjid Membership</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900">Hak Akses Pengurus</td>
                <td className="py-3.5 px-4 text-center text-slate-600">Single Admin (1 Akun)</td>
                <td className="py-3.5 px-4 text-center font-bold text-emerald-800 bg-emerald-50/30">Multi Admin (Tim DKM)</td>
                <td className="py-3.5 px-4 text-center font-bold text-teal-900 bg-teal-50/30">Multi Admin Unlimited</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900">Pengelolaan Data Kas</td>
                <td className="py-3.5 px-4 text-center text-slate-600">Khusus Bendahara</td>
                <td className="py-3.5 px-4 text-center font-bold text-emerald-800 bg-emerald-50/30">Pengurus & DKM</td>
                <td className="py-3.5 px-4 text-center font-bold text-teal-900 bg-teal-50/30">Pengurus + Managed Support</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900">Website Publik Jamaah</td>
                <td className="py-3.5 px-4 text-center text-slate-400">Tidak Ada</td>
                <td className="py-3.5 px-4 text-center font-bold text-emerald-800 bg-emerald-50/30">✓ Ada (Portal Jamaah)</td>
                <td className="py-3.5 px-4 text-center font-bold text-teal-900 bg-teal-50/30">✓ Ada (Portal Dedicated)</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900">Informasi Jamaah</td>
                <td className="py-3.5 px-4 text-center text-slate-400">Internal Masjid</td>
                <td className="py-3.5 px-4 text-center font-bold text-emerald-800 bg-emerald-50/30">✓ Transparan ke Jamaah</td>
                <td className="py-3.5 px-4 text-center font-bold text-teal-900 bg-teal-50/30">✓ Transparan ke Jamaah</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900">Alamat Web / Domain</td>
                <td className="py-3.5 px-4 text-center text-slate-600">Akses Mandiri</td>
                <td className="py-3.5 px-4 text-center font-bold text-emerald-800 bg-emerald-50/30">URL Subdomain Portal</td>
                <td className="py-3.5 px-4 text-center font-bold text-teal-900 bg-teal-50/30">URL Unik / Custom Domain (.or.id)</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900">Pendampingan Teknis</td>
                <td className="py-3.5 px-4 text-center text-slate-600">Panduan Mandiri</td>
                <td className="py-3.5 px-4 text-center font-bold text-emerald-800 bg-emerald-50/30">Dukungan Standar DKM</td>
                <td className="py-3.5 px-4 text-center font-bold text-teal-900 bg-teal-50/30">✓ Pendampingan Penuh</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900">Pembaruan (Update) Fitur</td>
                <td className="py-3.5 px-4 text-center text-slate-600">Versi Rilis Standard</td>
                <td className="py-3.5 px-4 text-center font-bold text-emerald-800 bg-emerald-50/30">Update Reguler</td>
                <td className="py-3.5 px-4 text-center font-bold text-teal-900 bg-teal-50/30">✓ Update Berkelanjutan Otomatis</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Konsultasi / Tanya Info Modal */}
      {isConsultModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative space-y-6 animate-in fade-in zoom-in duration-150">
            
            <button 
              onClick={() => setIsConsultModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Konsultasi DKM KasMasjid</span>
              </div>

              <h3 className="font-display font-black text-xl text-slate-900">
                Informasi KasMasjid {selectedPlan === 'portal' ? 'Portal' : 'Membership'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Sampaikan pertanyaan atau kebutuhan DKM Anda. Tim KasMasjid akan membantu menjelaskan sistem secara langsung.
              </p>
            </div>

            <form onSubmit={handleSendConsultation} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Nama Masjid / Musala
                </label>
                <input 
                  type="text" 
                  value={mosqueName}
                  disabled
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-semibold cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Nama Pengurus / DKM <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: Bpk. Ahmad (Bendahara DKM)"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Nomor WhatsApp <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="tel" 
                  required
                  placeholder="Contoh: 081234567890"
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Pertanyaan / Catatan Tambahan
                </label>
                <textarea 
                  rows={3}
                  value={consultNotes}
                  onChange={(e) => setConsultNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsConsultModalOpen(false)}
                  className="w-1/3 py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-xl transition-all cursor-pointer text-center"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitted}
                  className="w-2/3 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitted ? (
                    <span>Menyiapkan WhatsApp...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Kirim via WhatsApp</span>
                    </>
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
