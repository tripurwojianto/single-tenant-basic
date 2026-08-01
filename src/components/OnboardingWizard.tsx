/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import KasMasjidLogo from './KasMasjidLogo';
import { 

  Building, MapPin, Phone, Mail, ArrowRight, ArrowLeft, 
  Sparkles, CheckCircle2, ShieldCheck, HelpCircle, Laptop,
  Users, HeartHandshake, Loader2
} from 'lucide-react';
import { BrandConfig, getActiveBrand } from '../brandConfig';

interface OnboardingWizardProps {
  user: any;
  brand?: BrandConfig;
  onComplete: (info: {
    namaMasjid: string;
    logo: string;
    tagline: string;
    alamat: string;
    kota: string;
    whatsApp: string;
    email: string;
    website: string;
    profilSingkat: string;
  }, deploymentMode: string) => void;
  onCancel: () => void;
  syncSpreadsheet: () => Promise<void>;
  isSyncing: boolean;
  syncError: string | null;
}

export default function OnboardingWizard({ 
  user, 
  brand = getActiveBrand(),
  onComplete, 
  onCancel,
  syncSpreadsheet,
  isSyncing,
  syncError
}: OnboardingWizardProps) {
  const draftKey = user?.uid ? `kasmasjid_onboarding_draft_${user.uid}` : 'kasmasjid_onboarding_draft';
  const draft = React.useMemo(() => {
    try {
      const saved = localStorage.getItem(draftKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  }, [draftKey]);

  const [step, setStep] = useState<number>(draft?.step || 1);
  const [deploymentMode, setDeploymentMode] = useState<'MANDIRI' | 'PENDAMPINGAN' | 'PENGELOLAAN' | null>(draft?.deploymentMode || null);
  
  // Dynamic fields state (generic field namaMasjid corresponds to organization name)
  const [namaMasjid, setNamaMasjid] = useState(draft?.namaMasjid || '');
  const [alamat, setAlamat] = useState(draft?.alamat || '');
  const [kota, setKota] = useState(draft?.kota || '');
  const [whatsApp, setWhatsApp] = useState(draft?.whatsApp || '');
  const [email, setEmail] = useState(draft?.email || user?.email || '');
  const [tagline, setTagline] = useState(draft?.tagline || '');
  const [logo, setLogo] = useState(draft?.logo || '');
  const [profilSingkat, setProfilSingkat] = useState(draft?.profilSingkat || '');

  const [hasTriggeredSync, setHasTriggeredSync] = useState(false);

  // Auto-save draft on step or field change
  React.useEffect(() => {
    try {
      const dataToSave = {
        step,
        deploymentMode,
        namaMasjid,
        alamat,
        kota,
        whatsApp,
        email,
        tagline,
        logo,
        profilSingkat
      };
      localStorage.setItem(draftKey, JSON.stringify(dataToSave));
    } catch (e) {
      console.error('Error saving onboarding draft:', e);
    }
  }, [draftKey, step, deploymentMode, namaMasjid, alamat, kota, whatsApp, email, tagline, logo, profilSingkat]);

  const handleNextStep = async () => {
    if (step === 1) {
      if (!deploymentMode) {
        alert('Silakan pilih salah satu opsi deployment terlebih dahulu.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!namaMasjid.trim()) {
        alert(`${brand.orgLabel} wajib diisi.`);
        return;
      }
      setStep(3);
      // Trigger spreadsheet sync automatically on Step 3
      if (!hasTriggeredSync) {
        setHasTriggeredSync(true);
        await syncSpreadsheet();
      }
    } else if (step === 3) {
      if (syncError) {
        alert('Harap perbaiki kegagalan sinkronisasi atau hubungi admin.');
        return;
      }
      setStep(4);
    }
  };

  const handleBackStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFinish = () => {
    try {
      localStorage.removeItem(draftKey);
    } catch (e) {}
    onComplete({
      namaMasjid,
      logo: logo || 'https://images.unsplash.com/photo-1590075865003-e48277faa558?auto=format&fit=crop&q=80&w=200',
      tagline: tagline || `Ramah Pengguna & Akuntabel`,
      alamat: alamat || 'Jl. Raya No. 1',
      kota: kota || 'Bandung',
      whatsApp: whatsApp || '081234567890',
      email: email || user?.email || '',
      website: '',
      profilSingkat: profilSingkat || `Sistem administrasi dan transparansi kas digital.`
    }, deploymentMode || 'MANDIRI');
  };

  const shortCode = brand.id === 'masjid' ? 'KM' : brand.id === 'sekolah' ? 'SH' : brand.id === 'warga' ? 'WH' : 'KH';

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-emerald-100" id="onboarding-wizard-root">
      {/* Mini header */}
      <header className="h-16 border-b border-slate-200/80 bg-white flex items-center justify-between px-6 sm:px-8 shrink-0">
        <div className="flex items-center gap-3">
          <KasMasjidLogo className="w-9 h-9" />
          <div>
            <span className="font-display font-black text-sm text-slate-900 leading-none block">KasMasjid Basic</span>
            <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Wizard Onboarding</span>
          </div>
        </div>
        <button 
          onClick={onCancel}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          Keluar Onboarding
        </button>
      </header>

      {/* Steps Indicator */}
      <div className="bg-white border-b border-slate-200/60 py-4">
        <div className="max-w-xl mx-auto px-4 flex items-center justify-between">
          {[
            { n: 1, label: 'Deployment' },
            { n: 2, label: `Profil ${brand.orgLabel}` },
            { n: 3, label: 'Koneksi Sheets' },
            { n: 4, label: 'Selesai' }
          ].map((s) => (
            <div key={s.n} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                step === s.n 
                  ? `${brand.accentBgClass} text-white ring-4 ring-slate-100` 
                  : step > s.n 
                    ? 'bg-slate-100 text-slate-800'
                    : 'bg-slate-100 text-slate-400'
              }`}>
                {step > s.n ? '✓' : s.n}
              </div>
              <span className={`text-xs font-bold hidden sm:inline ${step === s.n ? 'text-slate-800' : 'text-slate-400'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="bg-white rounded-[32px] border border-slate-200/80 shadow-md p-6 sm:p-10 max-w-2xl w-full min-h-[460px] flex flex-col justify-between">
          
          {/* STEP 1: DEPLOYMENT SELECTION */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${brand.accentBadgeClass} border text-[10px] font-black uppercase tracking-wider`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  Langkah Pertama
                </div>
                <h2 className="font-display font-black text-2xl text-slate-900 tracking-tight">
                  Pilih Model Implementasi
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  {brand.onboardingIntro}
                </p>
              </div>

              <div className="grid gap-4">
                {[
                  {
                    id: 'MANDIRI',
                    title: 'Implementasi Mandiri',
                    desc: 'Sekali bayar, aplikasi dikelola sendiri. Deploy mandiri menggunakan panduan resmi repository KasMasjid.',
                    badge: 'Aplikasi Dikelola Sendiri',
                    icon: Laptop,
                    iconColor: brand.accentTextClass,
                    bgColor: `hover:border-slate-300`
                  },
                  {
                    id: 'PENDAMPINGAN',
                    title: 'Pendampingan Implementasi',
                    desc: `Sekali bayar, kami membantu proses implementasi. Tim teknis membantu penyiapan spreadsheet & deployment ${brand.orgLabel} Anda hingga siap 100%.`,
                    badge: 'Dibantu Sampai Live',
                    icon: Users,
                    iconColor: 'text-indigo-600',
                    bgColor: 'hover:border-indigo-300'
                  },
                  {
                    id: 'PENGELOLAAN',
                    title: 'Layanan Pengelolaan',
                    desc: 'Berlangganan bulanan, aplikasi & website dikelola penuh oleh tim KasMasjid. Bebas repot server, backup rutin & support 24/7.',
                    badge: 'Dikelola Tim KasMasjid',
                    icon: HeartHandshake,
                    iconColor: 'text-purple-600',
                    bgColor: 'hover:border-purple-300'
                  }
                ].map((option) => {
                  const Icon = option.icon;
                  const isSelected = deploymentMode === option.id;
                  return (
                    <div
                      key={option.id}
                      onClick={() => setDeploymentMode(option.id as any)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex gap-4 ${
                        isSelected 
                          ? `bg-slate-50 border-slate-900 shadow-xs` 
                          : 'border-slate-100 bg-white ' + option.bgColor
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 ${option.iconColor}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-1 text-left min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-display font-extrabold text-sm text-slate-900 leading-tight">
                            {option.title}
                          </h4>
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            isSelected ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {option.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                          {option.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: PROFILE INFO */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1">
                <h2 className="font-display font-black text-2xl text-slate-900 tracking-tight">
                  Lengkapi Profil {brand.orgLabel}
                </h2>
                <p className="text-xs text-slate-500 font-sans">
                  Informasi ini akan menjadi kop laporan keuangan dan dipasang di widget informasi utama.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Building className={`w-3.5 h-3.5 ${brand.accentTextClass}`} /> {brand.orgLabel} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={namaMasjid}
                    onChange={(e) => setNamaMasjid(e.target.value)}
                    placeholder={brand.orgPlaceholder}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-slate-500/20 focus:border-slate-800 transition-all outline-hidden font-medium text-slate-800"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <MapPin className={`w-3.5 h-3.5 ${brand.accentTextClass}`} /> Kota / Kabupaten
                  </label>
                  <input
                    type="text"
                    value={kota}
                    onChange={(e) => setKota(e.target.value)}
                    placeholder="Contoh: Bandung"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-slate-500/20 focus:border-slate-800 transition-all outline-hidden font-medium text-slate-800"
                  />
                </div>

                <div className="space-y-1.5 text-left sm:col-span-2">
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <MapPin className={`w-3.5 h-3.5 ${brand.accentTextClass}`} /> Alamat Lengkap
                  </label>
                  <input
                    type="text"
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    placeholder="Contoh: Jl. Merdeka No. 45"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-slate-500/20 focus:border-slate-800 transition-all outline-hidden font-medium text-slate-800"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Phone className={`w-3.5 h-3.5 ${brand.accentTextClass}`} /> WhatsApp {brand.ownerLabel.split('/')[0].trim()}
                  </label>
                  <input
                    type="text"
                    value={whatsApp}
                    onChange={(e) => setWhatsApp(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-slate-500/20 focus:border-slate-800 transition-all outline-hidden font-medium text-slate-800"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Mail className={`w-3.5 h-3.5 ${brand.accentTextClass}`} /> Email Kontak
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Contoh: info@domain.org"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-slate-500/20 focus:border-slate-800 transition-all outline-hidden font-medium text-slate-800"
                  />
                </div>

                <div className="space-y-1.5 text-left sm:col-span-2">
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                    Slogan / Tagline {brand.orgLabel}
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="Contoh: Akuntabel, Transparan, Membawa Manfaat"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-slate-500/20 focus:border-slate-800 transition-all outline-hidden font-medium text-slate-800"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: GOOGLE SHEETS SYNC */}
          {step === 3 && (
            <div className="space-y-6 text-center py-6 animate-fade-in">
              <div className="max-w-md mx-auto space-y-4">
                {isSyncing ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-slate-50 text-slate-900 rounded-full flex items-center justify-center mx-auto animate-pulse">
                      <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-display font-black text-xl text-slate-900">
                        Menyiapkan Berkas Spreadsheet...
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-sans">
                        Sistem sedang memverifikasi dan merancang tab database otomatis pada Google Drive Anda dengan nama berkas <strong className="text-slate-800 font-semibold font-mono">"{brand.databaseName}"</strong>.
                      </p>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 max-w-xs mx-auto overflow-hidden">
                      <div className="bg-slate-900 h-1.5 rounded-full animate-progress-bar"></div>
                    </div>
                  </div>
                ) : syncError ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                      <ShieldCheck className="w-8 h-8 text-rose-500" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-display font-black text-xl text-slate-900">
                        Sinkronisasi Gagal
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-sans">
                        Aplikasi tidak dapat membuat berkas di akun Google Drive Anda. Pastikan Anda telah mengizinkan hak akses Google Drive saat login tadi.
                      </p>
                    </div>
                    <p className="text-[10px] font-mono p-3 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-left max-h-24 overflow-y-auto">
                      {syncError}
                    </p>
                    <button
                      onClick={syncSpreadsheet}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Coba Sinkron Ulang
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-slate-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className={`w-8 h-8 ${brand.accentTextClass}`} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-display font-black text-xl text-slate-900">
                        Google Sheets Terkoneksi!
                      </h3>
                      <p className={`text-xs ${brand.accentTextClass} font-semibold leading-relaxed font-sans`}>
                        Database {brand.appName} berhasil diinisialisasi secara real-time.
                      </p>
                      <p className="text-xs text-slate-500 leading-relaxed font-sans pt-1">
                        Pencatatan saldo, iuran, inventaris, dan publikasi pengumuman sekarang tersimpan aman di cloud Google Drive pribadi Anda.
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between text-left">
                      <div className="flex items-center gap-3">
                        <Building className="w-5 h-5 text-slate-400" />
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block leading-none">Database Google Drive</span>
                          <span className="text-xs font-bold text-slate-700 font-mono">{brand.databaseName}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold ${brand.accentTextClass} bg-slate-100 px-2 py-0.5 rounded-md`}>
                        AKTIF
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS CONGRATS */}
          {step === 4 && (
            <div className="space-y-6 text-center py-6 animate-fade-in">
              <div className="max-w-md mx-auto space-y-4">
                <div className={`w-20 h-20 bg-slate-50 ${brand.accentTextClass} rounded-full flex items-center justify-center mx-auto animate-bounce`}>
                  <Sparkles className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display font-black text-2xl text-slate-900">
                    Selesai & Siap Digunakan!
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    Alhamdulillah, proses digitalisasi administrasi untuk <strong>{namaMasjid || brand.orgLabel}</strong> telah rampung. Akun Anda telah siap mengakses Dasbor utama.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left space-y-2.5">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <CheckCircle2 className={`w-4 h-4 ${brand.accentTextClass}`} />
                    Status Layanan Anda:
                  </div>
                  <ul className="text-[11px] text-slate-600 space-y-1 font-medium pl-5 list-disc leading-relaxed">
                    <li>Database tersimpan di Google Drive pribadi</li>
                    <li>Sistem pelaporan otomatis PDF siap unduh</li>
                    <li>Opsi upgrade ke edisi Pro/Membership terbuka kapan saja</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ACTIONS PANELS */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            {step > 1 && step < 4 ? (
              <button
                onClick={handleBackStep}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-600 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali
              </button>
            ) : (
              <div></div>
            )}

            {step < 4 ? (
              <button
                onClick={handleNextStep}
                disabled={step === 3 && (isSyncing || !!syncError)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
              >
                Lanjutkan
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-slate-950 hover:bg-slate-800 active:bg-black text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-slate-200 hover:-translate-y-0.5"
              >
                Masuk ke Dashboard Utama →
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
