import React, { useState } from 'react';
import KasMasjidLogo from './KasMasjidLogo';
import { 
  Info, Lock, FileText, HelpCircle, PhoneCall, ChevronRight, 
  Search, ShieldCheck, Globe, Smartphone, ExternalLink, Code2, 
  MessageSquare, Sparkles, ArrowRight, Check, Tag, Building,
  HelpCircle as QuestionIcon
} from 'lucide-react';

interface AboutViewProps {
  onNavigate?: (menuKey: string) => void;
}

export default function AboutView({ onNavigate }: AboutViewProps) {
  const [selectedSection, setSelectedSection] = useState<'overview' | 'help' | 'version' | 'contact'>('overview');
  const [faqSearch, setFaqSearch] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

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
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12 text-left">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-[32px] p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-0"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <Info className="w-3.5 h-3.5" />
              Menu Informasi & Legal
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

      {/* 2. Ringkasan Deskripsi Resmi Platform */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-3xl shadow-sm border border-emerald-800/60 space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0">
            <Building className="w-4 h-4" />
          </div>
          <h2 className="font-display font-bold text-base text-white">Tentang KasMasjid</h2>
        </div>
        <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-sans">
          KasMasjid adalah platform administrasi masjid berbasis Google Workspace yang membantu pengurus mengelola kas, inventaris, arsip digital, laporan, dan transparansi jamaah.
        </p>
      </div>

      {/* 3. Settings Style Item List (Android/iOS Settings) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-3 sm:p-4 shadow-xs space-y-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-2">
          Menu Pengaturan & Informasi
        </p>

        {/* Item 1: Tentang KasMasjid */}
        <button
          onClick={() => setSelectedSection('overview')}
          className={`w-full p-3.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer text-left ${
            selectedSection === 'overview' 
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold' 
              : 'hover:bg-slate-50 border border-transparent text-slate-800'
          }`}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div className="truncate">
              <p className="text-xs sm:text-sm font-bold text-slate-900">ℹ️ Tentang KasMasjid</p>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">Penjelasan platform & pilar arsitektur Google Workspace</p>
            </div>
          </div>
          <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${selectedSection === 'overview' ? 'rotate-90 text-emerald-600' : 'text-slate-400'}`} />
        </button>

        {/* Item 2: Kebijakan Privasi (External Link) */}
        <a
          href="https://blog.kasmasjid.web.id/p/kebijakan-privasi.html"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full p-3.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer text-left hover:bg-slate-50 border border-transparent text-slate-800 group"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <p className="text-xs sm:text-sm font-bold text-slate-900">🔒 Kebijakan Privasi</p>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Resmi
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">Kebijakan perlindungan data & privasi Google Workspace</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 group-hover:translate-x-0.5 transition-transform shrink-0">
            <span className="hidden sm:inline">Buka</span>
            <ExternalLink className="w-4 h-4" />
          </div>
        </a>

        {/* Item 3: Syarat & Ketentuan (External Link) */}
        <a
          href="https://blog.kasmasjid.web.id/p/syarat-dan-ketentuan.html"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full p-3.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer text-left hover:bg-slate-50 border border-transparent text-slate-800 group"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <p className="text-xs sm:text-sm font-bold text-slate-900">📄 Syarat & Ketentuan</p>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  Resmi
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">Syarat & ketentuan penggunaan platform DKM</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 group-hover:translate-x-0.5 transition-transform shrink-0">
            <span className="hidden sm:inline">Buka</span>
            <ExternalLink className="w-4 h-4" />
          </div>
        </a>

        {/* Item 4: Bantuan */}
        <button
          onClick={() => setSelectedSection('help')}
          className={`w-full p-3.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer text-left ${
            selectedSection === 'help' 
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold' 
              : 'hover:bg-slate-50 border border-transparent text-slate-800'
          }`}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div className="truncate">
              <p className="text-xs sm:text-sm font-bold text-slate-900">❓ Bantuan</p>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">Panduan langkah demi langkah & FAQ Bendahara DKM</p>
            </div>
          </div>
          <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${selectedSection === 'help' ? 'rotate-90 text-emerald-600' : 'text-slate-400'}`} />
        </button>

        {/* Item 5: Hubungi Pengembang */}
        <button
          onClick={() => setSelectedSection('contact')}
          className={`w-full p-3.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer text-left ${
            selectedSection === 'contact' 
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold' 
              : 'hover:bg-slate-50 border border-transparent text-slate-800'
          }`}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div className="truncate">
              <p className="text-xs sm:text-sm font-bold text-slate-900">✉️ Hubungi Pengembang</p>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">Layanan bantuan WhatsApp, email resmi, & feedback</p>
            </div>
          </div>
          <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${selectedSection === 'contact' ? 'rotate-90 text-emerald-600' : 'text-slate-400'}`} />
        </button>

        {/* Item 6: Versi Aplikasi */}
        <button
          onClick={() => setSelectedSection('version')}
          className={`w-full p-3.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer text-left ${
            selectedSection === 'version' 
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold' 
              : 'hover:bg-slate-50 border border-transparent text-slate-800'
          }`}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
              <Tag className="w-5 h-5" />
            </div>
            <div className="truncate">
              <p className="text-xs sm:text-sm font-bold text-slate-900">🏷️ Versi Aplikasi</p>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">Spesifikasi sistem & informasi lisensi KasMasjid Basic</p>
            </div>
          </div>
          <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${selectedSection === 'version' ? 'rotate-90 text-emerald-600' : 'text-slate-400'}`} />
        </button>
      </div>

      {/* 4. Detail Panel for Expandable Sections */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">

        {/* SECTION: OVERVIEW */}
        {selectedSection === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-slate-100 pb-4 space-y-1">
              <h3 className="font-display font-black text-lg text-slate-900">ℹ️ Rincian Fitur KasMasjid</h3>
              <p className="text-xs text-slate-500">Mengenal lebih dalam platform administrasi masjid berbasis Google Workspace</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-slate-900">Transparan & Amanah</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                  Setiap transaksi kas dicatat secara akurat dan siap dicetak menjadi laporan PDF publik untuk mading masjid.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-slate-900">Data Milik DKM</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                  Data tersimpan secara mandiri di spreadsheet Google Drive akun pribadi DKM tanpa server pihak ketiga.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-slate-900">Offline-First PWA</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                  Dapat diakses lancar tanpa sinyal internet dan tersinkron otomatis saat perangkat terhubung kembali.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider text-slate-400">
                Edisi Layanan Platform
              </h4>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 space-y-1">
                  <span className="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-100 text-emerald-800 uppercase">
                    KasMasjid Basic
                  </span>
                  <h5 className="font-bold text-xs text-slate-800 pt-1">Penggunaan Standar DKM</h5>
                  <p className="text-[11px] text-slate-500 font-sans">
                    Single-admin, Google Sheets Sync, Ledger Arus Kas, Inventaris, Pengumuman, Laporan PDF. 100% Gratis Selamanya.
                  </p>
                </div>
                <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 space-y-1">
                  <span className="px-2 py-0.5 rounded text-[9px] font-black bg-indigo-100 text-indigo-800 uppercase">
                    KasMasjid Pro
                  </span>
                  <h5 className="font-bold text-xs text-slate-800 pt-1">Ekosistem Integrasi Pro</h5>
                  <p className="text-[11px] text-slate-500 font-sans">
                    Multi-Admin, WhatsApp Notif, Portal Jamaah, Zakat Digital, Infaq QRIS, dan Cetak Struk Termal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION: HELP & FAQ */}
        {selectedSection === 'help' && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-slate-100 pb-4 space-y-1">
              <h3 className="font-display font-black text-lg text-slate-900">❓ Pusat Bantuan & FAQ</h3>
              <p className="text-xs text-slate-500">Panduan penggunaan dan jawaban atas pertanyaan umum seputar KasMasjid</p>
            </div>

            {/* Quick Tutorials */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">Panduan Langkah Demi Langkah</h4>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <p className="text-xs font-bold text-emerald-900">1. Catat Arus Kas</p>
                  <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
                    Buka menu Arus Kas → Klik + Pemasukan / + Pengeluaran → Isi nominal, kategori, & rincian.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <p className="text-xs font-bold text-emerald-900">2. Hubungkan Google Sheets</p>
                  <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
                    Klik menu Bottom Bar → Google Sheets Sync → Otorisasi akun Google DKM untuk cadangan data.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Search */}
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">Pertanyaan Sering Diajukan (FAQ)</h4>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Cari pertanyaan FAQ..."
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2.5">
                {filteredFaqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div key={idx} className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden">
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full p-3.5 text-left flex items-center justify-between gap-3 cursor-pointer"
                      >
                        <h5 className="font-bold text-xs text-slate-900">{faq.question}</h5>
                        <ChevronRight className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-90 text-emerald-600' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="px-3.5 pb-3.5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 font-sans">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shortcut to Amina AI */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-950">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Butuh Asistensi Khusus?
                </div>
                <p className="text-[11px] text-emerald-800 font-sans">Tanyakan analisis atau pengelolaan keuangan DKM ke Amina AI.</p>
              </div>
              <button
                onClick={() => onNavigate && onNavigate('amina')}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs flex items-center gap-1"
              >
                <span>Tanya Amina</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* SECTION: CONTACT */}
        {selectedSection === 'contact' && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-slate-100 pb-4 space-y-1">
              <h3 className="font-display font-black text-lg text-slate-900">✉️ Hubungi Tim Pengembang</h3>
              <p className="text-xs text-slate-500">Layanan dukungan teknis, konsultasi pendampingan DKM, dan saluran resmi</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <a
                href="https://wa.me/6288973641682?text=Halo%20Admin%20KasMasjid%20saya%20ingin%20berkonsultasi%20mengenai%20KasMasjid"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 sm:p-5 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 transition-all cursor-pointer space-y-3 group text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-950">WhatsApp Dukungan DKM</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Konsultasi langsung dengan tim pendamping teknis</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  Hubungi WhatsApp →
                </span>
              </a>

              <button
                onClick={() => onNavigate && onNavigate('feedback')}
                className="p-4 sm:p-5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all cursor-pointer space-y-3 group text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">Formulir Feedback</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Kirimkan masukan atau usulan fitur baru</p>
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

        {/* SECTION: VERSION */}
        {selectedSection === 'version' && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-slate-100 pb-4 space-y-1">
              <h3 className="font-display font-black text-lg text-slate-900">🏷️ Informasi Versi & Spesifikasi</h3>
              <p className="text-xs text-slate-500">Detail rilis sistem dan teknologi penyusun platform</p>
            </div>

            <div className="p-5 bg-slate-900 text-white rounded-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Aplikasi Aktif</span>
                  <h4 className="font-display font-bold text-base text-white">KasMasjid Basic</h4>
                </div>
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-full">
                  v2.4.0
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-sans">
                <div>
                  <span className="text-slate-400 text-[11px]">Teknologi UI:</span>
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
                  <span className="text-slate-400 text-[11px]">Lisensi:</span>
                  <p className="font-bold text-white mt-0.5">Gratis (Infaq Teknologi DKM)</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 5. Footer Resmi Halaman Tentang (Sesuai Persyaratan 4) */}
      <footer className="pt-8 pb-4 text-center space-y-1.5 border-t border-slate-200/80 mt-8">
        <p className="font-display font-black text-sm text-slate-800 tracking-tight">KasMasjid Basic</p>
        <p className="text-xs font-semibold text-slate-500">Versi 2.4.0</p>
        <p className="text-xs text-slate-400">© 2026 KasMasjid</p>
        <p className="text-xs font-bold text-emerald-600">Powered by KUKAS</p>
      </footer>

    </div>
  );
}

