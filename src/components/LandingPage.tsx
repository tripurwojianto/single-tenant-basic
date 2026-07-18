import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutGrid, TrendingUp, Box, Megaphone, FileText, MessageSquare, 
  Building, Users, Smartphone, Receipt, Globe, HeartHandshake, QrCode, 
  ArrowRight, Eye, HelpCircle, CheckCircle2, ChevronDown, BookOpen, 
  Sparkles, Send, X, ShieldCheck
} from 'lucide-react';

interface LandingPageProps {
  onStartDemo: () => void;
  onLogin: () => void;
  isLoggingIn: boolean;
}

export default function LandingPage({ onStartDemo, onLogin, isLoggingIn }: LandingPageProps) {
  // Mockup tab state
  const [activeMockupTab, setActiveMockupTab] = useState<'dashboard' | 'cash' | 'inventory' | 'announcements'>('dashboard');
  
  // Accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Feedback modal simulation state
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const features = [
    {
      title: 'Arus Kas Ledger',
      desc: 'Pencatatan kas masuk dan keluar secara terperinci berdasarkan kluster kategori, pendonor, serta verifikasi pengeluaran bulanan.',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      badge: '💰 Arus Kas'
    },
    {
      title: 'Daftar Inventaris',
      desc: 'Inventarisasi aset fisik masjid secara komprehensif lengkap dengan kode register, kondisi barang, status peminjaman, serta lokasi penempatan.',
      icon: Box,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      badge: '📦 Inventaris'
    },
    {
      title: 'Komposer Pengumuman',
      desc: 'Buat maklumat ibadah, jadwal khotib jumat, atau pengumuman hari besar islami secara langsung dan unduh sebagai selebaran visual rapi.',
      icon: Megaphone,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      badge: '📢 Pengumuman'
    },
    {
      title: 'Informasi Masjid',
      desc: 'Manajemen informasi pengurus DKM, sejarah berdiri, daya tampung, serta kustomisasi kop surat legalitas operasional masjid Anda.',
      icon: Building,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      badge: '🕌 Informasi Masjid'
    },
    {
      title: 'Ringkasan Laporan',
      desc: 'Secara instan menyusun laporan keuangan mingguan dan rekapitulasi buku kas besar yang siap cetak atau ekspor dalam hitungan detik.',
      icon: FileText,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      badge: '📄 Laporan'
    },
    {
      title: 'Kirim Feedback',
      desc: 'Saluran saran dan ide pengurus untuk terus mengembangkan fitur-fitur baru demi kemaslahatan pengelolaan masjid nasional.',
      icon: MessageSquare,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      badge: '💬 Feedback'
    }
  ];

  const pricingCards = [
    {
      title: 'KasMasjid Basic',
      subtitle: 'Community Edition',
      deployment: 'Single Tenant',
      storage: 'Google Sheets',
      price: 'Gratis Selamanya',
      cta: 'Mulai Gunakan',
      action: onLogin,
      isPrimary: true,
      perks: [
        'Data di Google Drive Pribadi',
        'Ledger Arus Kas & Saldo',
        'Inventarisasi & Aset Fisik',
        'Komposer Warta & Pengumuman',
        'Laporan Mingguan PDF/Cetak',
        'Akses Mandiri Tanpa Setup Server'
      ]
    },
    {
      title: 'KasMasjid Pro',
      subtitle: 'Multi Admin',
      deployment: 'Kolaborasi',
      storage: 'Cloud Database',
      price: 'Pelajari Pro',
      cta: 'Pelajari Paket Pro',
      isPrimary: false,
      badge: 'PRO',
      perks: [
        'Multi-Admin & Kolaborasi',
        'Pemberitahuan WhatsApp Otomatis',
        'Sistem Log Aktivitas Pengurus',
        'Pencetakan Struk Fisik Termal',
        'Kunci Tutup Buku Bulanan',
        'Database Berkinerja Tinggi'
      ]
    },
    {
      title: 'KasMasjid Membership',
      subtitle: 'Portal Jamaah & Qris',
      deployment: 'Managed Service',
      storage: 'Ecosystem Suite',
      price: 'Hubungi Kami',
      cta: 'Daftar Membership',
      isPrimary: false,
      badge: 'MEMBERSHIP',
      perks: [
        'Portal Publik Publikasi Jamaah',
        'Infaq QRIS Dinamis & Statis',
        'Pendaftaran Qurban & Anggota',
        'Modul Zakat Fitrah & Maal',
        'Bantuan Deployment 100% Selesai',
        'Dukungan Teknis Prioritas'
      ]
    }
  ];

  const onboardingOptions = [
    {
      step: '01',
      title: 'Deployment Mandiri',
      desc: 'Deploy mandiri secara gratis menggunakan panduan resmi repository KasMasjid Basic di Google Drive.'
    },
    {
      step: '02',
      title: 'Pendampingan Developer',
      desc: 'Dapatkan bantuan langsung dari tim teknis KasMasjid untuk setup awal database Google Sheets Anda hingga lancar.'
    },
    {
      step: '03',
      title: 'Membership Managed',
      desc: 'Nikmati infrastruktur siap pakai instan tanpa pusing setup domain, deployment, atau konfigurasi Google API.'
    }
  ];

  const faqs = [
    {
      q: 'Apakah KasMasjid Basic gratis?',
      a: 'Ya, KasMasjid Basic merupakan edisi komunitas (Community Edition) yang gratis selamanya. Anda dapat menggunakan database Google Sheets Anda sendiri tanpa perlu membayar biaya lisensi bulanan kepada kami.'
    },
    {
      q: 'Data disimpan di mana?',
      a: 'Seluruh data keuangan, inventaris, dan informasi masjid disimpan langsung di dalam berkas Google Sheets bernama "KasMasjid Database" di dalam akun Google Drive pribadi pengurus masjid Anda. Anda memegang kendali penuh atas data Anda.'
    },
    {
      q: 'Apakah aman?',
      a: 'Sangat aman. Karena aplikasi ini menggunakan otentikasi resmi Google OAuth dan berjalan langsung di sisi klien, kami tidak memiliki server perantara yang menampung atau melihat data transaksi Anda. Keamanan dilindungi oleh protokol keamanan kelas dunia dari Google.'
    },
    {
      q: 'Bisakah export PDF?',
      a: 'Tentu saja. Dari menu "Ringkasan Laporan" di KasMasjid, Anda dapat mencetak langsung atau menyimpannya sebagai file PDF rapi yang didesain khusus sebagai kop surat resmi masjid Anda.'
    },
    {
      q: 'Apakah bisa upgrade ke Pro?',
      a: 'Sangat bisa. Kami mendesain skema data KasMasjid Basic sangat teratur. Kapan pun DKM Anda siap melakukan upgrade ke versi Pro (untuk kolaborasi multi-admin atau integrasi notifikasi WhatsApp), data dari Google Sheets lama Anda dapat dipindahkan dengan mudah.'
    }
  ];

  const blogArticles = [
    {
      title: 'Panduan Deploy KasMasjid di Vercel',
      category: 'Tutorial',
      readTime: '5 Menit Membaca',
      desc: 'Panduan langkah-demi-langkah bagi pengurus masjid yang ingin mempublikasikan aplikasi KasMasjid secara gratis di hosting Vercel.'
    },
    {
      title: 'Cara Implementasi Mandiri',
      category: 'Panduan Praktis',
      readTime: '8 Menit Membaca',
      desc: 'Tips mempersiapkan sekretariat digital masjid, melatih bendahara, serta cara mengintegrasikan printer termal fisik untuk struk zakat.'
    },
    {
      title: 'Perbedaan Basic dan Pro',
      category: 'Studi Produk',
      readTime: '4 Menit Membaca',
      desc: 'Pelajari kapan masjid Anda harus tetap menggunakan edisi gratis Sheets, dan kapan saatnya bermigrasi ke database Pro untuk kolaborasi.'
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setFeedbackSuccess(true);
    setTimeout(() => {
      setFeedbackSuccess(false);
      setIsFeedbackModalOpen(false);
      setFeedbackText('');
      setFeedbackEmail('');
    }, 4500);
  };

  return (
    <div id="landing-page" className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-emerald-100 scroll-smooth">
      
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#16A34A] flex items-center justify-center shadow-md shadow-emerald-100">
              <span className="font-display font-black text-base text-white">KM</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-sm tracking-tight text-slate-900 leading-none">KasMasjid Basic</span>
                <span className="text-[8px] font-black uppercase px-1 bg-emerald-50 text-[#16A34A] border border-emerald-100 rounded">v1.2</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">Community Edition</span>
            </div>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onStartDemo}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-4 h-4 text-slate-400" />
              👁 Coba Demo
            </button>
            <button
              onClick={onLogin}
              disabled={isLoggingIn}
              className="px-5 py-2.5 text-xs font-extrabold text-white bg-[#16A34A] hover:bg-[#159242] rounded-xl shadow-xs hover:shadow-md hover:shadow-emerald-100 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
              🟢 Mulai Gunakan
            </button>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-b from-white to-[#F8FAFC] border-b border-slate-200/50">
        <div className="absolute inset-0 bg-[radial-gradient(#16A34A_0.05%,transparent_0.05%)] [background-size:20px_20px] opacity-20"></div>
        
        {/* Soft Green Ambient Gradient in Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#DFF6EA] rounded-full blur-3xl -z-10 opacity-30"></div>

        <div className="max-w-4xl mx-auto px-4 text-center space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold bg-[#DFF6EA] text-[#16A34A] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              SaaS Administrasi Masjid Berbasis Kepercayaan
            </span>
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-[1.15] max-w-3xl mx-auto">
              Digitalisasi Administrasi Masjid <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16A34A] to-[#22C55E]">
                yang sederhana, transparan, dan siap digunakan.
              </span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed font-sans font-medium">
              Kelola arus kas, inventaris, pengumuman, dan informasi masjid dalam satu aplikasi berbasis Google Sheets. Data aman, transparan, dan 100% terkendali di Drive Anda sendiri.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto"
          >
            <button
              onClick={onLogin}
              disabled={isLoggingIn}
              className="w-full sm:w-auto px-8 py-4 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoggingIn ? 'Menyiapkan Hubungan...' : 'Mulai Gunakan Sekarang'}
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={onStartDemo}
              className="w-full sm:w-auto px-8 py-4 text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Eksplorasi Mode Demo
            </button>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="font-display font-black text-3xl text-slate-950 tracking-tight">
              Fitur Lengkap untuk Kemandirian Masjid
            </h2>
            <p className="text-sm text-slate-500 font-sans font-medium">
              Didesain khusus untuk menyajikan kemudahan operasional harian bagi Bendahara dan jajaran DKM di Indonesia.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-white p-6 rounded-3xl border border-slate-200/70 hover:border-emerald-200 transition-all hover:shadow-xs space-y-4 group relative overflow-hidden"
                >
                  <div className={`w-11 h-11 rounded-2xl ${feat.bgColor} flex items-center justify-center ${feat.color} shadow-xs`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                      {feat.badge}
                    </span>
                    <h3 className="font-display font-extrabold text-base text-slate-900">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-sans font-medium">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Screenshot & Live Simulated UI Viewports */}
      <section className="py-20 bg-[#F8FAFC] border-y border-slate-200/60 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="font-display font-black text-3xl text-slate-950 tracking-tight">
              Eksplorasi Antarmuka KasMasjid
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Klik tab di bawah ini untuk mensimulasikan sekilas tampilan antarmuka digital yang bersih, modern, dan sangat mudah digunakan.
            </p>
          </div>

          {/* Interactive tabs */}
          <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
            {[
              { id: 'dashboard', label: '📊 Dashboard' },
              { id: 'cash', label: '💰 Arus Kas' },
              { id: 'inventory', label: '📦 Inventaris' },
              { id: 'announcements', label: '📢 Pengumuman' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveMockupTab(tab.id as any)}
                className={`px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  activeMockupTab === tab.id 
                    ? 'bg-slate-900 text-white shadow-sm' 
                    : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Mockup Frame Screen */}
          <div className="bg-white rounded-[32px] border border-slate-200/80 shadow-lg p-3 sm:p-6 max-w-4xl mx-auto relative overflow-hidden transition-all duration-300">
            {/* Window bar decorations */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 shrink-0">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-400 block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400 block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-400 block"></span>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400">kasmasjid-basic-applet.local</span>
              <div className="w-12"></div>
            </div>

            <div className="min-h-[280px]">
              {/* TAB 1: DASHBOARD SIMULATOR */}
              {activeMockupTab === 'dashboard' && (
                <div className="space-y-6 animate-fade-in text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/60 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Saldo Kas Utama</span>
                      <div className="font-display font-black text-lg sm:text-xl text-slate-950">Rp 48.250.000</div>
                      <span className="text-[9px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">Sehat</span>
                    </div>
                    <div className="p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100/40 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Infaq Masuk</span>
                      <div className="font-display font-black text-lg sm:text-xl text-slate-900">Rp 56.700.000</div>
                      <span className="text-[9px] text-slate-500 font-semibold">Bulan Juli 2026</span>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pengeluaran Operasional</span>
                      <div className="font-display font-black text-lg sm:text-xl text-slate-900">Rp 8.450.000</div>
                      <span className="text-[9px] text-slate-500 font-semibold">Bulan Juli 2026</span>
                    </div>
                  </div>

                  {/* Simulated Chart representation */}
                  <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">Visualisasi Arus Kas Bulanan</span>
                      <span className="text-[9px] font-semibold text-slate-400 uppercase">Periode Berjalan</span>
                    </div>
                    <div className="h-28 flex items-end justify-between gap-2 px-4 pt-4">
                      {[30, 45, 20, 60, 75, 50, 90, 65, 80, 95, 110, 130].map((val, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div 
                            className="w-full bg-[#16A34A]/80 hover:bg-[#16A34A] rounded-t-xs transition-all cursor-pointer" 
                            style={{ height: `${(val / 130) * 100}%` }}
                          ></div>
                          <span className="text-[8px] text-slate-400 font-bold font-mono">B{i+1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CASH FLOW SIMULATOR */}
              {activeMockupTab === 'cash' && (
                <div className="space-y-4 animate-fade-in text-left">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800">Catatan Arus Kas Masuk & Keluar</h4>
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-[#16A34A]">Live Terhubung Google Sheet</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[9px] font-bold">
                          <th className="py-2">Tanggal</th>
                          <th className="py-2">Keterangan</th>
                          <th className="py-2">Kategori</th>
                          <th className="py-2 text-right">Nominal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 font-medium">
                        <tr>
                          <td className="py-2 text-slate-400 font-mono">18 Jul 2026</td>
                          <td className="py-2 text-slate-800">Infaq Kotak Amal Shalat Jumat</td>
                          <td className="py-2"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-md text-[9px] font-bold">Infaq Terbuka</span></td>
                          <td className="py-2 text-right text-[#16A34A] font-bold">+ Rp 3.450.000</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-slate-400 font-mono">16 Jul 2026</td>
                          <td className="py-2 text-slate-800">Biaya Token Listrik Masjid Juli</td>
                          <td className="py-2"><span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[9px] font-bold">Operasional</span></td>
                          <td className="py-2 text-right text-rose-600 font-bold">- Rp 1.500.000</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-slate-400 font-mono">15 Jul 2026</td>
                          <td className="py-2 text-slate-800">Sumbangan Khusus Hamba Allah (Renovasi)</td>
                          <td className="py-2"><span className="px-2 py-0.5 bg-[#DFF6EA] text-emerald-900 rounded-md text-[9px] font-bold">Pembangunan</span></td>
                          <td className="py-2 text-right text-[#16A34A] font-bold">+ Rp 10.000.000</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-slate-400 font-mono">14 Jul 2026</td>
                          <td className="py-2 text-slate-800">Honorarium Khotib Jumat Syawal</td>
                          <td className="py-2"><span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-[9px] font-bold">Da'wah</span></td>
                          <td className="py-2 text-right text-rose-600 font-bold">- Rp 500.000</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: INVENTORY SIMULATOR */}
              {activeMockupTab === 'inventory' && (
                <div className="space-y-4 animate-fade-in text-left">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800">Daftar Inventaris & Aset Fisik DKM</h4>
                    <span className="text-[10px] text-slate-400">Total 124 Unit Barang</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[8px] font-mono text-slate-400 block">INV-0982-Turkish</span>
                        <h5 className="font-bold text-xs text-slate-900">Karpet Masjid Turki Shof Utama</h5>
                        <p className="text-[10px] text-slate-500 font-sans mt-0.5">Kondisi: Sangat Baik • 12 Roll</p>
                      </div>
                      <span className="text-[9px] font-bold bg-emerald-100 text-[#16A34A] px-2 py-0.5 rounded">Tersedia</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[8px] font-mono text-slate-400 block">INV-1102-Audio</span>
                        <h5 className="font-bold text-xs text-slate-900">Wireless Microphone Shure Beta</h5>
                        <p className="text-[10px] text-slate-500 font-sans mt-0.5">Kondisi: Baik • 2 Unit</p>
                      </div>
                      <span className="text-[9px] font-bold bg-emerald-100 text-[#16A34A] px-2 py-0.5 rounded">Tersedia</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[8px] font-mono text-slate-400 block">INV-0043-Sosial</span>
                        <h5 className="font-bold text-xs text-slate-900">Tenda Besi Acara DKM (Terpal Hijau)</h5>
                        <p className="text-[10px] text-slate-500 font-sans mt-0.5">Peminjam: Bapak Ahmad RT04</p>
                      </div>
                      <span className="text-[9px] font-bold bg-rose-50 text-rose-600 px-2 py-0.5 rounded">Dipinjam</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[8px] font-mono text-slate-400 block">INV-1090-Acara</span>
                        <h5 className="font-bold text-xs text-slate-900">Kursi Lipat Chitose Futura</h5>
                        <p className="text-[10px] text-slate-500 font-sans mt-0.5">Kondisi: Sedang • 100 Unit</p>
                      </div>
                      <span className="text-[9px] font-bold bg-emerald-100 text-[#16A34A] px-2 py-0.5 rounded">Tersedia</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: ANNOUNCEMENTS SIMULATOR */}
              {activeMockupTab === 'announcements' && (
                <div className="space-y-4 animate-fade-in text-left max-w-xl mx-auto">
                  <h4 className="text-xs font-bold text-slate-800 text-center">Komposer Maklumat Pengumuman & Brosur Cetak</h4>
                  <div className="bg-emerald-900 text-emerald-50 rounded-3xl p-6 border border-emerald-800 shadow-md relative overflow-hidden space-y-4">
                    {/* Abstract islamic outline top-right */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-800 rounded-bl-full opacity-35"></div>
                    
                    <div className="text-center space-y-1 relative z-10">
                      <span className="text-[8px] font-extrabold uppercase tracking-widest text-emerald-300 block">MAKLUMAT RESMI DKM</span>
                      <h4 className="font-display font-black text-sm text-white">MASJID AL-IKHLAS BANDUNG</h4>
                      <p className="text-[9px] text-emerald-200">Jl. Merdeka No. 45, Babakan Ciamis, Bandung</p>
                    </div>

                    <div className="h-px bg-emerald-800/80 w-full"></div>

                    <div className="space-y-2">
                      <h5 className="font-display font-bold text-xs text-white">📌 Jadwal Kajian Bulanan & Tabligh Akbar</h5>
                      <p className="text-[10px] text-emerald-100 font-sans leading-relaxed">
                        Menghadirkan narasumber utama Dr. KH. Abdullah Gymnastiar (Aa Gym) dengan tema besar "Membangun Keluarga Sakinah Berpondasi Aqidah". Terbuka untuk umum, ikhwan & akhwat.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-2 bg-emerald-850 rounded-xl border border-emerald-800">
                        <span className="text-[8px] text-emerald-300 uppercase block font-bold">WAKTU</span>
                        <span className="text-[9px] font-bold text-white">Ahad, 26 Juli 2026 • 09:00 - Selesai</span>
                      </div>
                      <div className="p-2 bg-emerald-850 rounded-xl border border-emerald-800">
                        <span className="text-[8px] text-emerald-300 uppercase block font-bold">TEMPAT</span>
                        <span className="text-[9px] font-bold text-white">Ruang Utama Masjid Al-Ikhlas</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap & Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="font-display font-black text-3xl text-slate-950 tracking-tight">
              Model Produk & Pilihan Upgrade
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Gunakan edisi Basic secara gratis selamanya atau kembangkan sistem digital DKM Anda dengan fitur Pro terintegrasi.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
            {pricingCards.map((card, idx) => (
              <div 
                key={idx} 
                className={`p-8 rounded-[32px] border flex flex-col justify-between transition-all hover:-translate-y-1 duration-300 ${
                  card.isPrimary 
                    ? 'bg-slate-50/50 border-emerald-500 shadow-md relative' 
                    : 'bg-white border-slate-200'
                }`}
              >
                {card.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      card.badge === 'PRO' 
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                        : 'bg-amber-50 border-amber-200 text-amber-700'
                    }`}>
                      EDISI {card.badge}
                    </span>
                  </div>
                )}
                
                <div className="space-y-6">
                  <div className="space-y-1 text-center">
                    <h3 className="font-display font-black text-lg text-slate-900 leading-none">
                      {card.title}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {card.subtitle}
                    </p>
                  </div>

                  <div className="py-4 border-y border-slate-100 flex flex-col items-center justify-center gap-1 bg-slate-50/50 rounded-2xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{card.deployment}</span>
                    <span className="font-display font-black text-lg text-[#16A34A] tracking-tight">{card.price}</span>
                    <span className="text-[9px] font-mono text-slate-400 font-semibold">{card.storage}</span>
                  </div>

                  <ul className="space-y-3 text-xs font-semibold text-slate-600">
                    {card.perks.map((perk, pIdx) => (
                      <li key={pIdx} className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                        <span className="truncate">{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  {card.action ? (
                    <button
                      onClick={card.action}
                      className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl text-xs tracking-wide transition-all cursor-pointer shadow-sm hover:shadow"
                    >
                      {card.cta}
                    </button>
                  ) : (
                    <button
                      onClick={onStartDemo}
                      className="w-full py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-black rounded-2xl text-xs tracking-wide transition-all cursor-pointer"
                    >
                      {card.cta}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Onboarding & Implementation Options Section */}
      <section className="py-20 bg-[#F8FAFC] border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="font-display font-black text-3xl text-slate-950 tracking-tight">
              Tiga Langkah Implementasi Mudah
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Bagaimana KasMasjid dipasang dan mulai dikelola oleh pengurus DKM Anda.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {onboardingOptions.map((opt, idx) => (
              <div 
                key={idx} 
                className="bg-white p-8 rounded-[32px] border border-slate-200/80 shadow-xs relative overflow-hidden flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="font-display font-black text-3xl text-slate-200/80 leading-none">
                    {opt.step}
                  </div>
                  <h4 className="font-display font-extrabold text-base text-slate-900 leading-tight">
                    {opt.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans font-medium">
                    {opt.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center gap-1.5 text-[10px] font-bold text-[#16A34A]">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                  Mendukung efisiensi operasional
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 space-y-12">
          
          <div className="text-center space-y-3">
            <h2 className="font-display font-black text-3xl text-slate-950 tracking-tight">
              Pertanyaan Umum (FAQ)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Kumpulan pertanyaan yang paling sering diajukan mengenai keamanan dan tata cara penggunaan KasMasjid.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 flex items-center justify-between text-left cursor-pointer focus:outline-hidden"
                  >
                    <span className="font-display font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-2.5">
                      <HelpCircle className="w-4.5 h-4.5 text-[#16A34A] shrink-0" />
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-slate-700' : ''}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="p-5 pt-0 border-t border-slate-50 text-xs sm:text-sm text-slate-500 leading-relaxed font-sans font-medium pl-12">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Blog/Articles Section */}
      <section className="py-20 bg-[#F8FAFC] border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="font-display font-black text-3xl text-slate-950 tracking-tight">
              Artikel & Panduan Terbaru
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Edukasi literasi digital pengurus DKM demi mewujudkan masjid yang amanah dan mandiri.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {blogArticles.map((art, idx) => (
              <div 
                key={idx} 
                className="bg-white p-6 rounded-[32px] border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-emerald-200 transition-colors group cursor-pointer"
              >
                <div className="space-y-4 text-left">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1 text-[#16A34A]">
                      <BookOpen className="w-3.5 h-3.5" />
                      {art.category}
                    </span>
                    <span>{art.readTime}</span>
                  </div>
                  <h4 className="font-display font-extrabold text-sm text-slate-900 group-hover:text-[#16A34A] transition-colors leading-snug">
                    {art.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-sans font-medium">
                    {art.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center gap-1.5 text-[10px] font-bold text-slate-400 group-hover:text-[#16A34A] transition-colors">
                  Baca Selengkapnya
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-slate-900 text-white rounded-[32px] p-8 sm:p-12 relative overflow-hidden shadow-lg border border-slate-800">
            {/* Abstract background green dot decorations */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-950 rounded-bl-full -z-10 opacity-35"></div>

            <div className="max-w-xl space-y-6 text-left relative z-10">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
                <Sparkles className="w-3 h-3" />
                Saran Pengurus Masjid
              </span>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight leading-tight">
                Bantu Kami Mengembangkan KasMasjid
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
                Punya usulan fitur baru atau masukan desain? Kami selalu menyerap aspirasi dari bendahara di seluruh Nusantara untuk menyempurnakan aplikasi ini.
              </p>
              <button
                onClick={() => setIsFeedbackModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#16A34A] hover:bg-[#159242] active:bg-emerald-800 text-white text-xs font-black rounded-2xl transition-all shadow-sm cursor-pointer hover:scale-[1.02]"
              >
                <MessageSquare className="w-4.5 h-4.5" />
                Kirim Feedback & Usulan Fitur →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-white border-t border-slate-200/80 py-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#16A34A] flex items-center justify-center">
              <span className="font-display font-black text-xs text-white">KM</span>
            </div>
            <div>
              <span className="font-display font-extrabold text-sm text-slate-900 leading-none block">KasMasjid Basic</span>
              <span className="text-[10px] text-slate-400 font-semibold block mt-1">Community Edition untuk Digitalisasi Administrasi Masjid.</span>
            </div>
          </div>

          <div className="text-center md:text-right space-y-1 font-semibold text-slate-400">
            <p>&copy; 2026 KasMasjid</p>
            <p>
              Powered by{' '}
              <a 
                href="https://kasmasjid.web.id" 
                target="_blank" 
                rel="noreferrer" 
                className="text-[#16A34A] hover:text-[#159242] font-black underline underline-offset-4"
              >
                KasMasjid
              </a>
            </p>
          </div>

        </div>
      </footer>

      {/* FEEDBACK INPUT MODAL */}
      {isFeedbackModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[999]">
          <div className="bg-white rounded-[32px] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 text-left relative overflow-hidden animate-scale-in">
            <button
              onClick={() => setIsFeedbackModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {feedbackSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-8 h-8 text-[#16A34A]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-black text-xl text-slate-900">Feedback Terkirim!</h3>
                  <p className="text-xs text-[#16A34A] font-semibold">Usulan Anda berhasil disimulasikan.</p>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto pt-2">
                    Terima kasih atas kontribusi Anda. Masukan ini akan dipertimbangkan oleh tim KasMasjid Community dalam rilis pembaruan berikutnya demi transparansi pengelolaan tempat ibadah kita bersama.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-5">
                <div className="space-y-1">
                  <h3 className="font-display font-black text-xl text-slate-950">Usul Fitur Baru</h3>
                  <p className="text-xs text-slate-500 font-sans font-medium">Bantu kami merancang sistem kas masjid tercanggih dan termudah di Indonesia.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Email Pengirim</label>
                  <input
                    type="email"
                    required
                    placeholder="Contoh: bendahara@alikhlas.or.id"
                    value={feedbackEmail}
                    onChange={(e) => setFeedbackEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-[#16A34A] outline-hidden font-medium text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Tuliskan Ide / Saran Anda</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Contoh: Usul agar di dashboard ada widget pengingat jatuh tempo service AC inventaris..."
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-[#16A34A] outline-hidden font-medium text-slate-800 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#16A34A] hover:bg-[#159242] text-white font-bold rounded-2xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Kirim Ide Pengembangan
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
