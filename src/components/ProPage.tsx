import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Smartphone, Receipt, Users, Clock, ShieldAlert, Sparkles,
  MessageSquare, Send, CheckCircle2, ChevronRight, X, Sparkle
} from 'lucide-react';

interface ProPageProps {
  onNavigate: (path: string) => void;
}

export default function ProPage({ onNavigate }: ProPageProps) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const features = [
    {
      title: 'Multi-Admin & Kolaborasi Aman',
      desc: 'Kelola kas bersama tim bendahara Anda secara simultan dengan hak akses berlevel (Super Admin, Editor, Viewer) dilengkapi log histori aktivitas lengkap.',
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Notifikasi & Warta WhatsApp Otomatis',
      desc: 'Kirimkan struk penerimaan infaq/zakat secara instan langsung ke nomor WhatsApp donatur, serta pengumuman ibadah mingguan ke grup jamaah.',
      icon: Smartphone,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Cetak Struk Fisik Termal',
      desc: 'Hubungkan aplikasi dengan printer termal fisik bluetooth atau USB untuk mencetak tanda terima donasi/zakat secara formal di tempat.',
      icon: Receipt,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    {
      title: 'Kunci Tutup Buku Bulanan',
      desc: 'Fitur akuntansi profesional untuk mengunci transaksi bulan lalu guna menghindari kesalahan pengubahan data tidak sengaja oleh tim.',
      icon: Clock,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50'
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-indigo-100 flex flex-col justify-between">
      
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
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
            <span className="font-display font-black text-xs text-white">KP</span>
          </div>
          <span className="font-display font-black text-xs text-slate-900 hidden sm:inline">KasMasjid Pro</span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        <div className="grid md:grid-cols-12 gap-8 items-center bg-white rounded-[32px] p-6 sm:p-12 border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-50/50 to-emerald-50/50 rounded-bl-full -z-10 opacity-70"></div>
          
          <div className="md:col-span-7 space-y-6 text-left">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-black text-indigo-700 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              Edisi Profesional
            </span>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-950 tracking-tight leading-tight">
              Sistem Kolaborasi Keuangan & Notifikasi Pintar Jamaah
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans font-medium">
              Tingkatkan standar akuntabilitas tempat ibadah Anda ke level berikutnya. KasMasjid Pro dirancang untuk mendukung kolaborasi multi-admin dengan database cloud berkinerja tinggi, tanpa melupakan kemudahan integrasi dengan WhatsApp jamaah secara langsung.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-800 text-white text-xs font-black rounded-2xl transition-all cursor-pointer shadow-md shadow-indigo-100"
              >
                Hubungi Kami / Hubungkan DKM
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
              <div className="absolute -inset-4 rounded-[40px] bg-indigo-100/40 blur-xl"></div>
              <div className="relative bg-indigo-50/80 rounded-[32px] p-6 border border-indigo-100 w-72 text-left space-y-4">
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest block">Fitur Unggulan Pro</span>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-xs shrink-0 text-indigo-600">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-950">Multi-User</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Editor & Viewer berlevel</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-xs shrink-0 text-emerald-600">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-950">Notif WhatsApp</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Kirim bukti infaq otomatis</p>
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
              Sorotan Kapabilitas KasMasjid Pro
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Sempurnakan operasional dan singkirkan kesalahan koordinasi pengurus dengan sistem otomatisasi terbaik.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 text-left">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200/80 hover:border-indigo-200 transition-all flex gap-4">
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
        <div className="p-6 sm:p-8 bg-indigo-50/40 border border-indigo-100 rounded-[32px] flex flex-col sm:flex-row items-center gap-6 text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-100/30 rounded-bl-full -z-10"></div>
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-indigo-600 shrink-0 shadow-xs border border-indigo-100/60">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-display font-extrabold text-sm text-indigo-950 flex items-center gap-1.5">
              Status Pengembangan: <span className="bg-indigo-100 text-indigo-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">TAHAP PRE-RELEASE</span>
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              KasMasjid Pro sedang menyelesaikan audit keamanan data dan finalisasi infrastruktur cloud multi-tenant kami. Fitur kolaboratif ini direncanakan meluncur pada Q3 2026. Anda dapat mendaftarkan masjid Anda sekarang untuk mendapatkan antrean uji coba eksklusif tanpa dipungut biaya apa pun selama fase pre-release.
            </p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-8 text-xs text-slate-400">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <span>&copy; 2026 KasMasjid Pro</span>
          <a href="https://kasmasjid.web.id" target="_blank" rel="noreferrer" className="text-indigo-600 font-bold hover:underline">Powered by KasMasjid</a>
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
                    <h3 className="font-display font-black text-xl text-slate-900">Permintaan Dikirim!</h3>
                    <p className="text-xs text-[#16A34A] font-semibold">Tim DKM Success akan menghubungi Anda segera.</p>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto pt-2">
                      Terima kasih atas minat Anda pada edisi KasMasjid Pro. Kami telah mencatat email Anda dan akan mengirimkan penawaran integrasi WhatsApp khusus untuk masjid Anda dalam waktu 1x24 jam.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <h3 className="font-display font-black text-xl text-slate-950">Daftarkan Antrean Pro</h3>
                    <p className="text-xs text-slate-500 font-sans font-medium">Beri tahu kami kebutuhan masjid Anda dan tim ahli kami akan mengoordinasikan instalasinya.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Email Kontak Masjid / Pengurus</label>
                    <input
                      type="email"
                      required
                      placeholder="Contoh: sekretaris@masjidagung.org"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden font-medium text-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Keterangan Tambahan (Nama Masjid & Kota)</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Contoh: Masjid Agung Al-Muhaimin Kota Malang. Ingin tahu skema integrasi laporan WhatsApp bulanan ke jamaah."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden font-medium text-slate-800 resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-indigo-100"
                  >
                    <Send className="w-4 h-4" />
                    Kirim Minat Uji Coba Pro
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
