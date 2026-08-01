import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import KasMasjidLogo from './KasMasjidLogo';
import { 
  ArrowLeft, Globe, HeartHandshake, QrCode, ShieldAlert, Sparkles,
  Send, CheckCircle2, X, Star, Calendar, MessageSquare
} from 'lucide-react';

interface MembershipPageProps {
  onNavigate: (path: string) => void;
}

export default function MembershipPage({ onNavigate }: MembershipPageProps) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const features = [
    {
      title: 'Portal Publik Jamaah Real-time',
      desc: 'Halaman web resmi sub-domain khusus masjid Anda yang menampilkan papan informasi warta, jadwal kajian, hingga grafik real-time sisa saldo kas.',
      icon: Globe,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    {
      title: 'Infaq QRIS Dinamis & Statis',
      desc: 'Sistem pembuatan QRIS dinamis di layar portal sehingga donatur dapat memasukkan angka infaq sesuka hati dan tercatat instan di kas.',
      icon: QrCode,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Zakat Fitrah & Maal Terintegrasi',
      desc: 'Modul kalkulator zakat bawaan yang terverifikasi untuk mempermudah perhitungan, pembayaran digital, dan penyerahan kupon tanda terima.',
      icon: HeartHandshake,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50'
    },
    {
      title: 'Setup & Managed Service 100% Selesai',
      desc: 'Layanan terima beres tanpa pusing domain, deployment, perizinan Google API console, ataupun backup. Tim teknis kami menangani semuanya harian.',
      icon: Star,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsContactModalOpen(false);
      setEmail('');
      setMessage('');
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-amber-100 flex flex-col justify-between">
      
      {/* Top Header Row */}
      <header className="h-20 bg-white border-b border-slate-200/80 sticky top-0 z-40 px-6 sm:px-8 flex items-center justify-between">
        <button
          onClick={() => onNavigate('/')}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-all cursor-pointer bg-slate-50 hover:bg-slate-100 px-4 py-2.5 rounded-xl border border-slate-200/50"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </button>

        <div className="flex items-center gap-3">
          <KasMasjidLogo className="w-10 h-10" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-sm text-slate-900 leading-none">KasMasjid</span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-amber-100 text-amber-700 border border-amber-200 rounded-md">Membership</span>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Pendampingan Pengelolaan Kas</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        <div className="grid md:grid-cols-12 gap-8 items-center bg-white rounded-[32px] p-6 sm:p-12 border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-50/50 to-emerald-50/50 rounded-bl-full -z-10 opacity-70"></div>
          
          <div className="md:col-span-7 space-y-6 text-left">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-[10px] font-black text-amber-700 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              Layanan managed service
            </span>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-950 tracking-tight leading-tight">
              Miliki Portal Publik Jamaah & Pembayaran QRIS Mandiri
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans font-medium">
              Satukan kemudahan administrasi internal pengurus dengan keterbukaan infaq publik jamaah. KasMasjid Membership menghadirkan situs portal web resmi masjid dengan integrasi QRIS bank dinamis serta didukung penuh oleh tim managed service kami.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 active:bg-amber-700 text-white text-xs font-black rounded-2xl transition-all cursor-pointer shadow-md shadow-amber-100"
              >
                Hubungi Kami / Setup Instan
              </button>
              <button
                onClick={() => onNavigate('/')}
                className="px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold rounded-2xl transition-all cursor-pointer"
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>

          <div className="md:col-span-5 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 rounded-[40px] bg-amber-100/40 blur-xl"></div>
              <div className="relative bg-amber-50/80 rounded-[32px] p-6 border border-amber-100 w-72 text-left space-y-4">
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block">Fitur Membership</span>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-xs shrink-0 text-amber-500">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-950">Portal Jamaah</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Situs web resmi masjid Anda</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-xs shrink-0 text-emerald-600">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-950">QRIS Dinamis</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Pencatatan donasi digital</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-display font-black text-2xl text-slate-950 tracking-tight">
              Kelebihan Eksklusif Anggota Membership
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Transformasi menyeluruh dengan portal web dan ekosistem keuangan terlengkap untuk jamaah.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 text-left">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200/80 hover:border-amber-200 transition-all flex gap-4">
                  <div className={`w-10 h-10 rounded-xl ${feat.bgColor} flex items-center justify-center ${feat.color} shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-sm text-slate-900 leading-snug">
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

        {/* Product Status Box */}
        <div className="p-6 sm:p-8 bg-amber-50/40 border border-amber-100 rounded-[32px] flex flex-col sm:flex-row items-center gap-6 text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100/30 rounded-bl-full -z-10"></div>
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-amber-600 shrink-0 shadow-xs border border-amber-100/60">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-display font-extrabold text-sm text-amber-950 flex items-center gap-1.5">
              Status Layanan: <span className="bg-amber-100 text-amber-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">AKTIF & DIBUKA TERBATAS</span>
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Kami secara berkala membuka pendaftaran porsi kuota program *Setup Portal Jamaah Instan* untuk 50 masjid terpilih setiap bulannya guna menjaga kualitas pendampingan teknis premium. Ajukan minat DKM Anda sekarang untuk mengamankan antrean survei lokasi serta integrasi QRIS bank daerah tanpa kendala.
            </p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-8 text-xs text-slate-400">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-center text-center">
          <span>&copy; 2026 KasMasjid — Sistem Administrasi & Transparansi Keuangan Masjid</span>
        </div>
      </footer>

      {/* Simulated Contact Modal */}
      <AnimatePresence>
        {isContactModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[999]">
            <div className="bg-white rounded-[32px] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 text-left relative overflow-hidden animate-scale-in">
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {submitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-[#16A34A]" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display font-black text-xl text-slate-900">Permintaan Terkirim!</h3>
                    <p className="text-xs text-[#16A34A] font-semibold">Petugas pendampingan wilayah kami akan menghubungi Anda.</p>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto pt-2">
                      DKM Anda telah masuk ke dalam antrean Managed Service KasMasjid. Tim teknis kami akan mengirimkan proposal detail mencakup survei domain gratis, dan rancangan desain portal jamaah via email.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <h3 className="font-display font-black text-xl text-slate-950">Hubungi Layanan Setup</h3>
                    <p className="text-xs text-slate-500 font-sans font-medium">Beri tahu kami detail tempat ibadah Anda untuk mempersiapkan rencana setup situs web resmi masjid.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Email Kontak Pengurus</label>
                    <input
                      type="email"
                      required
                      placeholder="Contoh: bendahara@masjid-raya.id"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-hidden font-medium text-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Keterangan Tambahan (Nama & Alamat Masjid)</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Contoh: Masjid Raya Baiturrahman, Jl. Diponegoro No. 12, Banda Aceh. Ingin berkonsultasi mengenai aktivasi QRIS yayasan."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-hidden font-medium text-slate-800 resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-2xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-amber-100"
                  >
                    <Send className="w-4 h-4" />
                    Kirim Permintaan Konsultasi
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
