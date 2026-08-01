import React, { useState } from 'react';
import KasMasjidLogo from './KasMasjidLogo';
import { 
  Info, Sparkles, Rocket, BookOpen, HelpCircle, FileText, Lock, Activity, 
  Code2, PhoneCall, ChevronRight, ExternalLink, ShieldCheck, Globe, 
  Smartphone, Search, Check, ArrowRight, MessageSquare, Tag, Building
} from 'lucide-react';

interface AboutViewProps {
  onNavigate?: (menuKey: string) => void;
}

export default function AboutView({ onNavigate }: AboutViewProps) {
  const [activeTab, setActiveTab] = useState<
    'tentang' | 'whats-new' | 'roadmap' | 'tutorial' | 'faq' | 'status' | 'version' | 'contact'
  >('tentang');

  const [faqSearch, setFaqSearch] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Exact 10 menu items requested in exact sequence
  const navItems = [
    { id: 'tentang', type: 'tab', label: 'Tentang KasMasjid', icon: Info, color: 'text-emerald-600 bg-emerald-50' },
    { id: 'whats-new', type: 'tab', label: 'Apa yang Baru', icon: Sparkles, color: 'text-amber-600 bg-amber-50' },
    { id: 'roadmap', type: 'tab', label: 'Roadmap', icon: Rocket, color: 'text-indigo-600 bg-indigo-50' },
    { id: 'tutorial', type: 'tab', label: 'Tutorial & Panduan', icon: BookOpen, color: 'text-sky-600 bg-sky-50' },
    { id: 'faq', type: 'tab', label: 'FAQ', icon: HelpCircle, color: 'text-purple-600 bg-purple-50' },
    { 
      id: 'terms', 
      type: 'external', 
      label: 'Syarat & Ketentuan', 
      icon: FileText, 
      color: 'text-amber-600 bg-amber-50',
      url: 'https://blog.kasmasjid.web.id/p/syarat-dan-ketentuan.html'
    },
    { 
      id: 'privacy', 
      type: 'external', 
      label: 'Kebijakan Privasi', 
      icon: Lock, 
      color: 'text-indigo-600 bg-indigo-50',
      url: 'https://blog.kasmasjid.web.id/p/kebijakan-privasi.html'
    },
    { id: 'status', type: 'tab', label: 'Status Layanan', icon: Activity, color: 'text-teal-600 bg-teal-50' },
    { id: 'version', type: 'tab', label: 'Versi Aplikasi', icon: Code2, color: 'text-slate-600 bg-slate-100' },
    { id: 'contact', type: 'tab', label: 'Hubungi Pengembang', icon: PhoneCall, color: 'text-rose-600 bg-rose-50' },
  ];

  const faqs = [
    {
      question: 'Mengapa hanya HP Bendahara yang bisa melihat data?',
      answer: 'Keamanan dan privasi data kas masjid adalah prioritas utama. Pada edisi KasMasjid Basic, data transaksi disimpan secara lokal di perangkat HP Bendahara dan dienkripsi ke spreadsheet Google Drive akun pribadi masjid/Bendahara. Pendekatan ini memastikan data keuangan tidak dapat diubah atau diakses pihak tak berwenang.'
    },
    {
      question: 'Apakah data kas masjid saya aman jika HP Bendahara hilang?',
      answer: 'Sangat aman! Selama Anda telah mengaktifkan fitur Sinkronisasi Google Sheets, seluruh rekaman arus kas, catatan inventaris, dan pengumuman tersimpan secara berkala di akun Google Drive DKM. Anda hanya perlu login kembali menggunakan akun Google tersebut di HP baru.'
    },
    {
      question: 'Apakah aplikasi KasMasjid Basic benar-benar gratis selamanya?',
      answer: 'Ya, KasMasjid Basic dirancang sebagai kontribusi sosial (infaq teknologi) untuk seluruh DKM tempat ibadah di Indonesia, 100% gratis selamanya tanpa biaya tersembunyi.'
    },
    {
      question: 'Bagaimana jika masjid kami tidak memiliki koneksi internet stabil?',
      answer: 'KasMasjid mengusung teknologi offline-first. Anda dapat terus menginput transaksi kas dan mengelola data tanpa internet. Sistem akan menyinkronkan data secara otomatis begitu perangkat terhubung ke internet.'
    },
    {
      question: 'Bagaimana cara membagikan laporan keuangan kepada jamaah?',
      answer: 'Anda dapat mengunduh laporan bulanan/mingguan dalam bentuk PDF dari menu Laporan, lalu mencetaknya untuk diletakkan di mading masjid. Jika menggunakan KasMasjid Pro, laporan dapat otomatis tampil di Portal Publik Jamaah & Mading Digital.'
    }
  ];

  const filteredFaqs = faqs.filter(f => 
    f.question.toLowerCase().includes(faqSearch.toLowerCase()) || 
    f.answer.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12 text-left">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-[32px] p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-0"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <Info className="w-3.5 h-3.5" />
              Pusat Informasi & Bantuan
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
              Tentang Aplikasi
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Informasi platform, tautan kebijakan resmi, bantuan penggunaan, dan profil pengembang KasMasjid.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 shrink-0">
            <KasMasjidLogo className="w-10 h-10" />
            <div className="text-left">
              <div className="text-xs font-bold text-white">KasMasjid Basic</div>
              <div className="text-[10px] text-emerald-300 font-medium">Versi 2.4.0</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Left Sidebar Nav + Right Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Navigation Grid / Tabs Sidebar */}
        <div className="md:col-span-4 lg:col-span-3 space-y-2 no-print">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-2 shadow-xs space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5">
              Menu Informasi
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              
              if (item.type === 'external') {
                return (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full p-2.5 rounded-xl flex items-center justify-between text-xs font-bold transition-all cursor-pointer text-left hover:bg-slate-100 text-slate-700 group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate">{item.label}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0 transition-colors" />
                  </a>
                );
              }

              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full p-2.5 rounded-xl flex items-center justify-between text-xs font-bold transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-white/20 text-white' : item.color
                    }`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="truncate">{item.label}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                    isActive ? 'text-emerald-400 translate-x-0.5' : 'text-slate-400'
                  }`} />
                </button>
              );
            })}
          </div>

          {/* Quick AI Assistance Card */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-2 text-left">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              Tanya Asisten AI Amina
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed font-sans">
              Butuh bantuan analisis data atau tips pengelolaan keuangan DKM? Tanyakan langsung ke Amina.
            </p>
            <button
              onClick={() => onNavigate && onNavigate('amina')}
              className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Buka Amina AI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="md:col-span-8 lg:col-span-9 bg-white rounded-[32px] border border-slate-200/80 p-6 sm:p-8 shadow-xs text-left">
          
          {/* TAB 1: TENTANG KASMASJID */}
          {activeTab === 'tentang' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 pb-4 space-y-1">
                <h2 className="font-display font-black text-xl text-slate-900">Tentang KasMasjid</h2>
                <p className="text-xs text-slate-500">Mengenal platform pengelolaan administrasi & kas tempat ibadah</p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                <p>
                  <strong>KasMasjid</strong> adalah aplikasi manajemen keuangan dan operasional tempat ibadah yang dikembangkan untuk menjawab kebutuhan pengurus DKM (Dewan Kemakmuran Masjid) di seluruh Indonesia.
                </p>
                <p>
                  Dengan antarmuka yang ramah pengguna, KasMasjid memudahkan Bendahara dalam mencatat pemasukan infaq, pengeluaran operasional, mengelola daftar inventaris fisik, hingga menyusun warta pengumuman jemaah secara cepat dan akurat.
                </p>
              </div>

              {/* 3 Pillars */}
              <div className="grid sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-xs text-slate-900">Transparan & Amanah</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                    Setiap rupiah dicatat dengan teliti dan dapat dicetak dalam laporan rekapitulasi berkala untuk jamaah.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
                    <Globe className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-xs text-slate-900">Data Milik Masjid</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                    Data disimpan secara aman di Google Sheets akun pribadi DKM tanpa ketergantungan server pihak ketiga.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-xs text-slate-900">Ringan & Offline-First</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                    Dapat diakses lancar melalui smartphone Bendahara meskipun di lokasi dengan sinyal internet terbatas.
                  </p>
                </div>
              </div>

              {/* Legal Quick Links Section for OAuth Compliance */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider text-slate-400">
                  Dokumen Legal & Kebijakan
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <a
                    href="https://blog.kasmasjid.web.id/p/syarat-dan-ketentuan.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 flex items-center justify-between transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-bold text-slate-800">📄 Syarat & Ketentuan</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
                  </a>

                  <a
                    href="https://blog.kasmasjid.web.id/p/kebijakan-privasi.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 flex items-center justify-between transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Lock className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-bold text-slate-800">🔒 Kebijakan Privasi</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
                  </a>
                </div>
              </div>

              {/* Product Levels */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider text-slate-400">
                  Konsistensi Produk KasMasjid
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
                    <span className="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-100 text-emerald-800 uppercase">
                      KasMasjid Basic
                    </span>
                    <h4 className="font-bold text-xs text-slate-800 pt-1">Penggunaan Standar DKM</h4>
                    <p className="text-[11px] text-slate-500 font-sans">
                      Single-admin, Google Sheets Sync, Ledger Arus Kas, Inventaris, Pengumuman, Laporan PDF. 100% Gratis.
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
                    <span className="px-2 py-0.5 rounded text-[9px] font-black bg-indigo-100 text-indigo-800 uppercase">
                      KasMasjid Pro
                    </span>
                    <h4 className="font-bold text-xs text-slate-800 pt-1">Fitur Lanjutan & Ekosistem</h4>
                    <p className="text-[11px] text-slate-500 font-sans">
                      Multi-Admin, WA Notif, Portal Jamaah, Zakat Digital, Infaq QRIS, dan Cetak Struk. Pilihan skema Mandiri/Pendampingan/Pengelolaan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: APA YANG BARU */}
          {activeTab === 'whats-new' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 pb-4 space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-black text-xl text-slate-900">Apa yang Baru</h2>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase">
                    Pembaruan Terkini
                  </span>
                </div>
                <p className="text-xs text-slate-500">Catatan pembaruan dan penyempurnaan fitur KasMasjid</p>
              </div>

              <div className="space-y-6">
                {/* Release v2.4 */}
                <div className="relative pl-6 border-l-2 border-emerald-500 space-y-2">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-100"></div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900">Versi 2.4.0 — Integration & Google OAuth Compliance</h3>
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Agustus 2026</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-600 font-sans">
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Integrasi Tautan Legal:</strong> Menambahkan menu resmi Syarat & Ketentuan dan Kebijakan Privasi di Pusat Informasi.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Pengelompokan Menu Navigasi:</strong> Penyesuaian urutan 10 menu informasi & bantuan sesuai panduan Google OAuth Compliance.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Penyelarasan Edisi:</strong> Penjelasan transparan perbedaan skema KasMasjid Basic & KasMasjid Pro.</span>
                    </li>
                  </ul>
                </div>

                {/* Release v2.3 */}
                <div className="relative pl-6 border-l-2 border-slate-200 space-y-2">
                  <div className="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-slate-300"></div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-800">Versi 2.3.0 — Komposer Pengumuman & Google Sheets API</h3>
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Juli 2026</span>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-500 font-sans">
                    <li>• Peluncuran modul Warta Pengumuman Masjid dengan templat Jumat & Ramadhan.</li>
                    <li>• Sinkronisasi Google Sheets otomatis dengan pengoperasian offline-first.</li>
                  </ul>
                </div>

                {/* Release v2.0 */}
                <div className="relative pl-6 border-l-2 border-slate-200 space-y-2">
                  <div className="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-slate-300"></div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-800">Versi 2.0.0 — Asisten Amina AI Integration</h3>
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Juni 2026</span>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-500 font-sans">
                    <li>• Integrasi kecerdasan buatan Amina AI untuk analisis keuangan & konsultasi program masjid.</li>
                    <li>• Modul Pencatatan Inventaris Barang & Barcode generator.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ROADMAP */}
          {activeTab === 'roadmap' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 pb-4 space-y-1">
                <h2 className="font-display font-black text-xl text-slate-900">Roadmap Pengembangan</h2>
                <p className="text-xs text-slate-500">Rencana inovasi dan pengembangan fitur KasMasjid mendatang</p>
              </div>

              <div className="grid gap-4">
                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider">
                      Target Q3 2026
                    </span>
                    <span className="text-[10px] font-bold text-indigo-700">Tahap Pengembangan</span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">Integrasi Infaq QRIS & Gateway WA Notif</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    Penerimaan donasi non-tunai secara otomatis tercatat di kas masjid serta pengiriman pesan terima kasih WhatsApp otomatis ke donatur.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                      Target Q4 2026
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">Rencana Desain</span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">Multi-User Role & Log Audit Keuangan</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    Pengurus DKM dapat membagi peran (Ketua, Bendahara, Pengawas). Seluruh perubahan data tercatat dalam sistem audit trail.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                      Target Q1 2027
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">Eksplorasi R&D</span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">Aplikasi Mobile Native & Bluetooth Printer Support</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    Peluncuran aplikasi Android/iOS native dan integrasi cetak kwitansi infaq fisik menggunakan printer thermal Bluetooth.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TUTORIAL */}
          {activeTab === 'tutorial' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 pb-4 space-y-1">
                <h2 className="font-display font-black text-xl text-slate-900">Tutorial & Panduan</h2>
                <p className="text-xs text-slate-500">Panduan langkah demi langkah penggunaan KasMasjid untuk Bendahara DKM</p>
              </div>

              <div className="space-y-4 font-sans">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-black">1</span>
                    Pencatatan Transaksi Kas (Pemasukan & Pengeluaran)
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-7">
                    Buka menu <strong>Arus Kas</strong> → Klik tombol <strong>+ Pemasukan Baru</strong> atau <strong>+ Pengeluaran Baru</strong> → Pilih kategori (misal: Infaq Kotak Jumat, Listrik, Operasional) → Isi nominal dan tanggal → Klik Simpan. Data langsung tersimpan di HP & tersinkron.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-black">2</span>
                    Menghubungkan Google Sheets untuk Cloud Backup
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-7">
                    Klik menu <strong>Lainnya (Bottom Bar)</strong> → Pilih <strong>Google Sheets Sync</strong> → Lakukan otentikasi akun Google DKM. Aplikasi akan otomatis membuat sheet penyimpanan pribadi di Google Drive Anda.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-black">3</span>
                    Mencetak Laporan PDF Bulanan
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-7">
                    Buka menu <strong>Laporan</strong> → Pilih filter bulan atau rentang tanggal → Klik tombol <strong>Cetak / Unduh PDF</strong>. Dokumen rapi siap ditempel pada Papan Pengumuman Masjid.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-black">4</span>
                    Mencatat Inventaris & Aset Masjid
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-7">
                    Buka menu <strong>Lainnya</strong> → Pilih <strong>Daftar Inventaris</strong> → Tambahkan barang (misal: Sound System, Sajadah, Karpet) beserta status kondisi barang dan jumlah unitnya.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: FAQ */}
          {activeTab === 'faq' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 pb-4 space-y-1">
                <h2 className="font-display font-black text-xl text-slate-900">FAQ (Pertanyaan Umum)</h2>
                <p className="text-xs text-slate-500">Jawaban lengkap atas pertanyaan yang sering diajukan pengurus masjid</p>
              </div>

              {/* Search FAQ */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Cari pertanyaan (contoh: HP Bendahara, Google Sheets, Keamanan)..."
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-3">
                {filteredFaqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full p-4 text-left flex items-center justify-between gap-3 cursor-pointer"
                      >
                        <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                          {faq.question}
                        </h3>
                        <ChevronRight className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                          isOpen ? 'rotate-90 text-emerald-600' : ''
                        }`} />
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 font-sans">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}

                {filteredFaqs.length === 0 && (
                  <div className="text-center py-8 text-xs text-slate-400 font-sans">
                    Tidak ada pertanyaan yang sesuai kata kunci pencarian.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 8: STATUS LAYANAN */}
          {activeTab === 'status' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 pb-4 space-y-1">
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-black text-xl text-slate-900">Status Layanan</h2>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Semua Sistem Normal
                  </span>
                </div>
                <p className="text-xs text-slate-500">Pemantauan kesehatan infrastruktur & API KasMasjid</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-xs text-slate-900">Core Web App (PWA)</h4>
                    <p className="text-[10px] text-slate-500">Sistem Antarmuka KasMasjid</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                    Operational (100%)
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-xs text-slate-900">Google Sheets Sync API</h4>
                    <p className="text-[10px] text-slate-500">Integrasi OAuth & Cloud Storage</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                    Operational
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-xs text-slate-900">Asisten AI Amina Engine</h4>
                    <p className="text-[10px] text-slate-500">Analisis Keuangan Cerdas</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                    Operational
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-xs text-slate-900">Generator PDF Laporan</h4>
                    <p className="text-[10px] text-slate-500">Pencetakan Berkas Kas</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                    Operational
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: VERSI APLIKASI */}
          {activeTab === 'version' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 pb-4 space-y-1">
                <h2 className="font-display font-black text-xl text-slate-900">Versi Aplikasi</h2>
                <p className="text-xs text-slate-500">Spesifikasi sistem dan informasi lisensi KasMasjid Basic</p>
              </div>

              <div className="p-5 bg-slate-900 text-white rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Edisi Aktif</span>
                    <h3 className="font-display font-bold text-base text-white">KasMasjid Basic</h3>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-full">
                    v2.4.0
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-sans">
                  <div>
                    <span className="text-slate-400 text-[11px]">Framework UI:</span>
                    <p className="font-bold text-white mt-0.5">React 18 + Vite + Tailwind</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Database Cloud:</span>
                    <p className="font-bold text-white mt-0.5">Google Sheets API v4</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Sistem Penyimpanan:</span>
                    <p className="font-bold text-white mt-0.5">Offline-First IndexedDB</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Lisensi Penggunaan:</span>
                    <p className="font-bold text-white mt-0.5">Gratis (Infaq Teknologi DKM)</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: HUBUNGI PENGEMBANG */}
          {activeTab === 'contact' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 pb-4 space-y-1">
                <h2 className="font-display font-black text-xl text-slate-900">Hubungi Pengembang</h2>
                <p className="text-xs text-slate-500">Layanan bantuan WhatsApp, email resmi, & feedback pengurus DKM</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <a
                  href="https://wa.me/6288973641682?text=Halo%20Admin%20KasMasjid%20saya%20ingin%20berkonsultasi%20mengenai%20KasMasjid"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 sm:p-5 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 transition-all cursor-pointer space-y-3 group text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-950">WhatsApp Dukungan DKM</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-sans">Konsultasi langsung dengan tim pendamping teknis</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    Hubungi WhatsApp →
                  </span>
                </a>

                <button
                  onClick={() => onNavigate && onNavigate('feedback')}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all cursor-pointer space-y-3 group text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">Formulir Feedback</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-sans">Kirimkan masukan atau usulan fitur baru</p>
                  </div>
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    Kirim Feedback →
                  </span>
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs text-slate-600 font-sans">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Email Bantuan:</span>
                  <a href="mailto:support@kasmasjid.app" className="font-bold text-emerald-700 underline">support@kasmasjid.app</a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Situs Web Blog:</span>
                  <a href="https://blog.kasmasjid.web.id" target="_blank" rel="noreferrer" className="font-bold text-emerald-700 underline">blog.kasmasjid.web.id</a>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Footer Resmi */}
      <footer className="pt-8 pb-4 text-center space-y-1.5 border-t border-slate-200/80 mt-8">
        <p className="font-display font-black text-sm text-slate-800 tracking-tight">KasMasjid Basic</p>
        <p className="text-xs font-semibold text-slate-500">Versi 2.4.0</p>
        <div className="flex items-center justify-center gap-4 text-xs font-medium text-emerald-700 pt-1">
          <a href="https://blog.kasmasjid.web.id/p/syarat-dan-ketentuan.html" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
            <FileText className="w-3 h-3" />
            <span>Syarat & Ketentuan</span>
          </a>
          <span>•</span>
          <a href="https://blog.kasmasjid.web.id/p/kebijakan-privasi.html" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
            <Lock className="w-3 h-3" />
            <span>Kebijakan Privasi</span>
          </a>
        </div>
        <p className="text-xs text-slate-400 pt-1">© 2026 KasMasjid — Powered by KUKAS</p>
      </footer>

    </div>
  );
}
