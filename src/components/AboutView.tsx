import React, { useState } from 'react';
import { 
  Info, Sparkles, Rocket, BookOpen, HelpCircle, Activity, 
  ShieldCheck, PhoneCall, ChevronRight, Search, CheckCircle2, 
  AlertCircle, Clock, Smartphone, Layers, Wrench, Globe, 
  ExternalLink, FileText, Code2, ArrowRight, MessageSquare,
  HelpCircle as QuestionIcon, Zap, Heart, Check, RefreshCw
} from 'lucide-react';

interface AboutViewProps {
  onNavigate?: (menuKey: string) => void;
}

export default function AboutView({ onNavigate }: AboutViewProps) {
  const [activeTab, setActiveTab] = useState<
    'tentang' | 'whats-new' | 'roadmap' | 'tutorial' | 'faq' | 'status' | 'version' | 'contact'
  >('tentang');

  const [faqSearch, setFaqSearch] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0); // First item open by default (the HP Bendahara question)

  const navTabs = [
    { id: 'tentang', label: 'Tentang KasMasjid', icon: Info, color: 'text-emerald-600 bg-emerald-50' },
    { id: 'whats-new', label: 'Apa yang Baru', icon: Sparkles, color: 'text-amber-600 bg-amber-50' },
    { id: 'roadmap', label: 'Roadmap', icon: Rocket, color: 'text-indigo-600 bg-indigo-50' },
    { id: 'tutorial', label: 'Tutorial & Panduan', icon: BookOpen, color: 'text-sky-600 bg-sky-50' },
    { id: 'faq', label: 'FAQ', icon: HelpCircle, color: 'text-purple-600 bg-purple-50' },
    { id: 'status', label: 'Status Layanan', icon: Activity, color: 'text-teal-600 bg-teal-50' },
    { id: 'version', label: 'Versi Aplikasi', icon: Code2, color: 'text-slate-600 bg-slate-100' },
    { id: 'contact', label: 'Hubungi Pengembang', icon: PhoneCall, color: 'text-rose-600 bg-rose-50' },
  ];

  const faqs = [
    {
      question: 'Mengapa hanya HP Bendahara yang bisa melihat data?',
      answer: 'Keamanan dan privasi data kas masjid adalah prioritas utama. Pada edisi KasMasjid Basic, data transaksi disimpan secara lokal di perangkat HP Bendahara dan dienkripsi ke spreadsheet Google Drive akun pribadi masjid/Bendahara. Pendekatan ini memastikan data keuangan tidak dapat diubah atau diakses pihak tak berwenang. Jika DKM memerlukan akses multi-pengurus (Ketua, Sekretaris, & Audit) dengan otentikasi bertingkat, Anda dapat mengaktifkan fitur KasMasjid Pro (Multi-Admin).'
    },
    {
      question: 'Apakah data kas masjid saya aman jika HP Bendahara hilang?',
      answer: 'Sangat aman! Selama Anda telah mengaktifkan fitur Sinkronisasi Google Sheets, seluruh rekaman arus kas, catatan inventaris, dan pengumuman tersimpan secara berkala di akun Google Drive masjid. Anda hanya perlu login kembali menggunakan akun Google tersebut di HP baru.'
    },
    {
      question: 'Apakah aplikasi KasMasjid Basic benar-benar gratis selamanya?',
      answer: 'Ya, KasMasjid Basic dirancang sebagai kontribusi sosial (infaq teknologi) untuk seluruh DKM tempat ibadah di Indonesia, 100% gratis selamanya tanpa biaya tersembunyi.'
    },
    {
      question: 'Bagaimana jika masjid kami tidak memiliki koneksi internet stabil?',
      answer: 'KasMasjid mengusung teknologi offline-first. Anda dapat terus menginput transaksi kas dan mengelola data tanpa internet. Sistem akan menyinkronkan data secara otomatis ke Google Sheets begitu perangkat terhubung ke internet.'
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
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-[32px] p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-0"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <Info className="w-3.5 h-3.5" />
              Pusat Informasi & Bantuan
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
              Tentang KasMasjid
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Platform administrasi & akuntansi keuangan masjid yang transparan, terpercaya, dan amanah.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white font-black text-sm flex items-center justify-center font-display italic">
              KM
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white">KasMasjid Basic</div>
              <div className="text-[10px] text-emerald-300 font-medium">v2.4.0 (Agustus 2026)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Left Sidebar Nav + Right Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Navigation Grid / Tabs */}
        <div className="md:col-span-4 lg:col-span-3 space-y-2 no-print">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-2 shadow-xs space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5">
              Menu Informasi
            </p>
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full p-2.5 rounded-xl flex items-center justify-between text-xs font-bold transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-white/20 text-white' : tab.color
                    }`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="truncate">{tab.label}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                    isActive ? 'text-emerald-400 translate-x-0.5' : 'text-slate-400'
                  }`} />
                </button>
              );
            })}
          </div>

          {/* Quick Help Card */}
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

        {/* Right Content View */}
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
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Setiap rupiah dicatat dengan teliti dan dapat dicetak dalam laporan rekapitulasi berkala untuk jamaah.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
                    <Globe className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-xs text-slate-900">Data Milik Masjid</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Data disimpan secara aman di Google Sheets akun pribadi DKM tanpa ketergantungan server pihak ketiga.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-xs text-slate-900">Ringan & Offline-First</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Dapat diakses lancar melalui smartphone Bendahara meskipun di lokasi dengan sinyal internet terbatas.
                  </p>
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
                    <p className="text-[11px] text-slate-500">
                      Single-admin, Google Sheets Sync, Ledger Arus Kas, Inventaris, Pengumuman, Laporan PDF. 100% Gratis.
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
                    <span className="px-2 py-0.5 rounded text-[9px] font-black bg-indigo-100 text-indigo-800 uppercase">
                      KasMasjid Pro
                    </span>
                    <h4 className="font-bold text-xs text-slate-800 pt-1">Fitur Lanjutan & Ekosistem</h4>
                    <p className="text-[11px] text-slate-500">
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
                    <h3 className="font-bold text-sm text-slate-900">Versi 2.4.0 — Penyempurnaan Produk & Model Layanan</h3>
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Agustus 2026</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Penyelarasan Produk:</strong> Penyederhanaan label menjadi KasMasjid Basic & KasMasjid Pro.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Dialog Model Layanan Pro:</strong> Penjelasan transparan 3 skema (Implementasi Mandiri, Pendampingan Implementasi, Layanan Pengelolaan).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Bottom Navbar Reorganization:</strong> Pengelompokan menu Kelola Masjid, Bantuan AI, & Fitur Pro.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Pusat Informasi "Tentang KasMasjid":</strong> Halaman terpadu panduan, FAQ, tutorial, & roadmap.</span>
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
                  <ul className="space-y-1 text-xs text-slate-500">
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
                  <ul className="space-y-1 text-xs text-slate-500">
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
                  <p className="text-xs text-slate-600 leading-relaxed">
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
                  <p className="text-xs text-slate-600 leading-relaxed">
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
                  <p className="text-xs text-slate-600 leading-relaxed">
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

              <div className="space-y-4">
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
                  const isHighlight = faq.question.includes('HP Bendahara');
                  return (
                    <div
                      key={idx}
                      className={`rounded-2xl border transition-all overflow-hidden ${
                        isHighlight 
                          ? 'border-emerald-300 bg-emerald-50/40 ring-2 ring-emerald-500/10' 
                          : 'border-slate-200/80 bg-white'
                      }`}
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full p-4 text-left flex items-center justify-between gap-3 cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {isHighlight && (
                            <span className="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-600 text-white shrink-0 uppercase">
                              Utama
                            </span>
                          )}
                          <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                            {faq.question}
                          </h3>
                        </div>
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
                  <div className="text-center py-8 text-xs text-slate-400">
                    Tidak ada pertanyaan yang sesuai kata kunci pencarian.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: STATUS LAYANAN */}
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

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-500 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span>Region Server:</span>
                  <span className="font-bold text-slate-800">Cloud Run Asia-Southeast (Jakarta / SG)</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span>Pemeriksaan Terakhir:</span>
                  <span className="font-bold text-slate-800">Hari ini, Real-time Status</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: VERSI APLIKASI */}
          {activeTab === 'version' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 pb-4 space-y-1">
                <h2 className="font-display font-black text-xl text-slate-900">Versi Aplikasi & Spesifikasi</h2>
                <p className="text-xs text-slate-500">Detail rilis perangkat lunak dan arsitektur sistem</p>
              </div>

              <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Aplikasi Aktif</span>
                    <h3 className="font-display font-bold text-lg text-white">KasMasjid Basic</h3>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-full">
                    v2.4.0-stable
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px]">Framework UI:</span>
                    <p className="font-bold text-white mt-0.5">React 18 + Vite + Tailwind CSS</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Metode Penyimpanan:</span>
                    <p className="font-bold text-white mt-0.5">Google Sheets API + Local Storage</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Model Lisensi:</span>
                    <p className="font-bold text-white mt-0.5">Gratis Selamanya (Infaq Teknologi)</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Kesesuaian Perangkat:</span>
                    <p className="font-bold text-white mt-0.5">Smartphone, Tablet, Laptop, PC</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between text-xs text-emerald-950">
                <div className="space-y-0.5">
                  <p className="font-bold">Ingin Mengaktifkan Fitur KasMasjid Pro?</p>
                  <p className="text-[11px] text-emerald-800">Dapatkan Multi-Admin, WhatsApp Notif, Portal Jamaah, & QRIS Infaq.</p>
                </div>
                <button
                  onClick={() => onNavigate && onNavigate('portal-jamaah')}
                  className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs cursor-pointer shrink-0"
                >
                  Lihat Pro
                </button>
              </div>
            </div>
          )}

          {/* TAB 8: HUBUNGI PENGEMBANG */}
          {activeTab === 'contact' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 pb-4 space-y-1">
                <h2 className="font-display font-black text-xl text-slate-900">Hubungi Pengembang</h2>
                <p className="text-xs text-slate-500">Layanan bantuan, konsultasi pendampingan, dan saran pengembangan</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <a
                  href="https://wa.me/6288973641682?text=Halo%20Admin%20KasMasjid%20saya%20ingin%20berkonsultasi%20mengenai%20KasMasjid"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 transition-all cursor-pointer space-y-3 group text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-950">WhatsApp Dukungan Teknis</h3>
                    <p className="text-xs text-slate-500 mt-1">Konsultasi langsung dengan tim pendamping DKM</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    Hubungi via WhatsApp →
                  </span>
                </a>

                <button
                  onClick={() => onNavigate && onNavigate('feedback')}
                  className="p-5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all cursor-pointer space-y-3 group text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Kirim Feedback & Masukan</h3>
                    <p className="text-xs text-slate-500 mt-1">Kirimkan ide atau laporan perbaikan fitur</p>
                  </div>
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    Buka Formulir Feedback →
                  </span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Email Resmi:</span>
                  <a href="mailto:support@kasmasjid.app" className="font-bold text-emerald-700 underline">support@kasmasjid.app</a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Website Utama:</span>
                  <a href="https://www.kukas.biz.id" target="_blank" rel="noreferrer" className="font-bold text-emerald-700 underline">www.kukas.biz.id</a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Komunitas DKM:</span>
                  <span className="font-bold text-slate-800">KasMasjid Ecosystem Indonesia</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
