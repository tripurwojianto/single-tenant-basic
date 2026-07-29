import React, { useState } from 'react';
import { X, Wrench, Users, Cloud, Check, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';

interface ProServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureTitle?: string;
}

export default function ProServiceModal({ isOpen, onClose, featureTitle }: ProServiceModalProps) {
  const [selectedOption, setSelectedOption] = useState<'MANDIRI' | 'PENDAMPINGAN' | 'PENGELOLAAN' | null>(null);

  if (!isOpen) return null;

  const options = [
    {
      id: 'MANDIRI',
      title: 'Implementasi Mandiri',
      tagline: 'Sekali bayar, aplikasi dikelola sendiri',
      icon: Wrench,
      iconBg: 'bg-emerald-100 text-emerald-800',
      badge: 'Sekali Bayar',
      desc: 'Pengurus DKM menerima hak akses penuh / source code, panduan deployment mandiri ke Vercel/Cloud, serta kontrol database mandiri tanpa iuran bulanan.',
      features: [
        'Akses penuh aplikasi KasMasjid Pro',
        'Panduan instalasi & konfigurasi mandiri',
        'Tanpa biaya langganan bulanan',
        'Database sepenuhnya milik DKM'
      ],
      waMessage: 'Halo Admin KasMasjid, saya berminat dengan KasMasjid Pro skema Implementasi Mandiri.'
    },
    {
      id: 'PENDAMPINGAN',
      title: 'Pendampingan Implementasi',
      tagline: 'Sekali bayar, kami membantu proses implementasi',
      icon: Users,
      iconBg: 'bg-indigo-100 text-indigo-800',
      badge: 'Sekali Bayar',
      desc: 'Tim teknis KasMasjid akan memandu dan membantu proses instalasi, integrasi Google API, hingga sistem KasMasjid Pro berjalan lancar 100%.',
      features: [
        'Pendampingan langsung oleh tim teknis',
        'Bantuan setup database & otentikasi',
        'Bimbingan penggunaan untuk pengurus DKM',
        'Aplikasi langsung aktif & siap pakai'
      ],
      waMessage: 'Halo Admin KasMasjid, saya berminat dengan KasMasjid Pro skema Pendampingan Implementasi.'
    },
    {
      id: 'PENGELOLAAN',
      title: 'Layanan Pengelolaan',
      tagline: 'Berlangganan bulanan, aplikasi & website dikelola tim KasMasjid',
      icon: Cloud,
      iconBg: 'bg-purple-100 text-purple-800',
      badge: 'Berlangganan Bulanan',
      desc: 'Layanan komplit & terima beres. Tim KasMasjid mengelola pemeliharaan server, backup database teratur, kustom domain, dan dukungan teknis prioritas 24/7.',
      features: [
        'Infrastruktur server & cloud dikelola penuh',
        'Backup data teratur & keamanan terjamin',
        'Domain khusus / kustom masjid',
        'Dukungan teknis & konsultasi prioritas 24/7'
      ],
      waMessage: 'Halo Admin KasMasjid, saya berminat dengan KasMasjid Pro skema Layanan Pengelolaan.'
    }
  ];

  const handleConsult = (waMsg: string) => {
    const encoded = encodeURIComponent(
      featureTitle 
        ? `${waMsg} (Terkait fitur: ${featureTitle})`
        : waMsg
    );
    window.open(`https://wa.me/6288973641682?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[999] no-print overflow-y-auto">
      <div className="bg-white rounded-[32px] max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 space-y-6 animate-scale-in relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2 text-left pr-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Pilihan Model Layanan KasMasjid Pro
          </div>
          <h2 className="font-display font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
            Model Layanan KasMasjid Pro
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Produk <strong>KasMasjid Pro</strong> dapat diimplementasikan sesuai kebutuhan dan kapabilitas teknis DKM Anda. Pilih skema layanan yang diinginkan:
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 text-left">
          {options.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selectedOption === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => setSelectedOption(opt.id as any)}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 hover:shadow-md ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/30 ring-2 ring-indigo-600/20'
                    : 'border-slate-200/80 bg-white hover:border-indigo-200'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl ${opt.iconBg} flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {opt.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-900 leading-snug">
                      {opt.title}
                    </h3>
                    <p className="text-[11px] font-semibold text-indigo-700 mt-1 leading-snug">
                      {opt.tagline}
                    </p>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                    {opt.desc}
                  </p>

                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    {opt.features.map((f, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[10px] text-slate-600 font-medium">
                        <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConsult(opt.waMessage);
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Pilih Skema Ini</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span className="text-[11px]">
            💡 Masih ragu memilih? Konsultasikan dulu dengan tim teknis KasMasjid tanpa komitmen.
          </span>
          <button
            onClick={() => handleConsult('Halo Admin KasMasjid, saya ingin berkonsultasi mengenai pilihan layanan KasMasjid Pro.')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 underline shrink-0 cursor-pointer"
          >
            Konsultasi Gratis via WA →
          </button>
        </div>
      </div>
    </div>
  );
}
