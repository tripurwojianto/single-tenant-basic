import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { 
  Rocket, 
  Users, 
  Crown, 
  CheckCircle2, 
  ArrowRight, 
  LogOut, 
  MessageSquare, 
  X, 
  Building2, 
  User as UserIcon, 
  Phone, 
  MapPin, 
  Sparkles,
  ShieldCheck,
  Send,
  Check
} from 'lucide-react';

interface ChooseStartPathProps {
  user: User;
  brand?: any;
  onSelectFreeTrial: () => void;
  onLogout: () => void;
  onNavigate: (path: string) => void;
}

export function ChooseStartPath({
  user,
  onSelectFreeTrial,
  onLogout,
  onNavigate,
}: ChooseStartPathProps) {
  const [modalServiceType, setModalServiceType] = useState<'Pendampingan Implementasi' | 'Membership' | null>(null);
  const [namaMasjid, setNamaMasjid] = useState('');
  const [namaPic, setNamaPic] = useState(user?.displayName || '');
  const [noWhatsapp, setNoWhatsapp] = useState('');
  const [kota, setKota] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const openFormModal = (serviceType: 'Pendampingan Implementasi' | 'Membership') => {
    setModalServiceType(serviceType);
    setIsSubmitted(false);
    setFormError('');
  };

  const closeModal = () => {
    setModalServiceType(null);
    setIsSubmitted(false);
    setFormError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaMasjid.trim() || !namaPic.trim() || !noWhatsapp.trim() || !kota.trim()) {
      setFormError('Mohon lengkapi semua kolom formulir.');
      return;
    }

    setFormError('');
    const serviceTitle = modalServiceType || 'Pendampingan KasMasjid';

    const waMessage = 
`*Pengajuan KasMasjid - ${serviceTitle}*

Assalamu'alaikum Admin KasMasjid,
Saya ingin mengajukan *${serviceTitle}* untuk masjid kami:

• *Nama Masjid:* ${namaMasjid.trim()}
• *Nama PIC / Pengurus:* ${namaPic.trim()}
• *Nomor WhatsApp:* ${noWhatsapp.trim()}
• *Kota / Kabupaten:* ${kota.trim()}
• *Akun Google:* ${user.email || '-'}

Mohon informasi dan petunjuk langkah selanjutnya. Terima kasih.`;

    const waUrl = `https://wa.me/6288973641682?text=${encodeURIComponent(waMessage)}`;
    window.open(waUrl, '_blank');
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between font-sans text-slate-800">
      {/* Header Bar */}
      <header className="h-20 bg-white border-b border-slate-200/80 sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#16A34A] rounded-2xl flex items-center justify-center font-black text-white text-base tracking-wider shadow-sm">
            KM
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-black text-slate-900 text-base sm:text-lg tracking-tight">KasMasjid</h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200">
                v1.2
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold">Pilih Cara Memulai</p>
          </div>
        </div>

        {/* User profile & Logout */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold uppercase">
              {user.email ? user.email.substring(0, 2) : 'US'}
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-800 leading-none truncate max-w-[140px]">
                {user.displayName || 'Pengurus Masjid'}
              </p>
              <p className="text-[10px] text-slate-400 truncate max-w-[140px] mt-0.5">
                {user.email}
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200/80"
            title="Keluar / Ganti Akun"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
        {/* Banner Greeting */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
            <span>Autentikasi Google Berhasil</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-slate-900 tracking-tight leading-tight">
            Pilih Cara Memulai
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            Selamat datang, <span className="font-bold text-slate-900">{user.displayName || user.email}</span>. Silakan pilih jalur layanan yang sesuai dengan kebutuhan pengelolaan masjid Anda.
          </p>
        </div>

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          
          {/* Card 1: Coba Gratis */}
          <div className="bg-white rounded-[28px] border-2 border-emerald-500/80 p-6 sm:p-8 shadow-xl shadow-emerald-500/5 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-[#16A34A] text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl">
              Mandiri
            </div>

            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-[#16A34A] flex items-center justify-center shadow-xs">
                <Rocket className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h3 className="font-display font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
                  Coba Gratis
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                  Kelola administrasi masjid secara mandiri.
                </p>
              </div>

              <ul className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-600 font-semibold">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>Akses wizard konfigurasi otomatis</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>Terhubung langsung ke Google Sheets</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>Kelola kas & pengumuman mandiri</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <button
                onClick={onSelectFreeTrial}
                className="w-full py-4 px-6 bg-[#16A34A] hover:bg-[#159242] active:bg-[#128038] text-white font-extrabold text-sm rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group-hover:scale-[1.01]"
              >
                <span>Mulai Gratis</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: Pendampingan Implementasi */}
          <div className="bg-white rounded-[28px] border border-slate-200/90 p-6 sm:p-8 shadow-md hover:shadow-xl transition-all flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs border border-blue-100">
                <Users className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h3 className="font-display font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
                  Pendampingan Implementasi
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                  Kami membantu menyiapkan aplikasi hingga siap digunakan.
                </p>
              </div>

              <ul className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-600 font-semibold">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Setup & migrasi data diawali tim</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Panduan operasional pengurus</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Format laporan disesuaikan</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <button
                onClick={() => openFormModal('Pendampingan Implementasi')}
                className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Ajukan Pendampingan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 3: Membership */}
          <div className="bg-white rounded-[28px] border border-slate-200/90 p-6 sm:p-8 shadow-md hover:shadow-xl transition-all flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs border border-amber-100">
                <Crown className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h3 className="font-display font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
                  Membership
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                  Pendampingan berkelanjutan dan akses fitur premium.
                </p>
              </div>

              <ul className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-600 font-semibold">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Dukungan prioritas WhatsApp</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Akses modul & fitur lanjutan</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Backup & pendampingan rutin</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <button
                onClick={() => openFormModal('Membership')}
                className="w-full py-4 px-6 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Daftar Membership</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-8 border-t border-slate-200/60 bg-white text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
        <div>
          <span className="font-semibold text-slate-600">© 2026 KasMasjid Basic</span> — Dikembangkan untuk mendukung transparansi administrasi masjid.
        </div>
        <div>
          Powered by{' '}
          <a 
            href="https://www.kasmasjid.web.id" 
            target="_blank" 
            rel="noreferrer" 
            className="text-emerald-600 hover:text-emerald-700 font-bold underline underline-offset-4"
          >
            KasMasjid
          </a>
        </div>
      </footer>

      {/* FORM MODAL (For Pendampingan Implementasi & Membership) */}
      {modalServiceType && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] animate-fadeIn">
          <div className="bg-white rounded-[32px] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 text-left relative overflow-hidden flex flex-col max-h-[90vh]">
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full cursor-pointer transition-colors"
              aria-label="Tutup Modal"
            >
              <X className="w-4 h-4" />
            </button>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-5 overflow-y-auto pr-1">
                <div className="space-y-1.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-black text-[#16A34A] uppercase tracking-widest">
                    Formulir Layanan
                  </span>
                  <h3 className="font-display font-black text-xl text-slate-900 tracking-tight">
                    {modalServiceType === 'Pendampingan Implementasi' ? 'Ajukan Pendampingan Implementasi' : 'Daftar Membership KasMasjid'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Silakan isi data singkat berikut. Tim kami akan segera menghubungi Anda via WhatsApp untuk memproses layanan {modalServiceType}.
                  </p>
                </div>

                {formError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
                    {formError}
                  </div>
                )}

                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      Nama Masjid <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={namaMasjid}
                      onChange={(e) => setNamaMasjid(e.target.value)}
                      placeholder="Contoh: Masjid Al-Ikhlas"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-hidden transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                      <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                      Nama PIC / Pengurus <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={namaPic}
                      onChange={(e) => setNamaPic(e.target.value)}
                      placeholder="Contoh: H. Ahmad Sukarno"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-hidden transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      Nomor WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={noWhatsapp}
                      onChange={(e) => setNoWhatsapp(e.target.value)}
                      placeholder="Contoh: 081234567890"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-hidden transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      Kota / Kabupaten <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={kota}
                      onChange={(e) => setKota(e.target.value)}
                      placeholder="Contoh: Bandung / Kab. Bogor"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-hidden transition-all"
                    />
                  </div>
                </div>

                <div className="pt-3 flex items-center gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-3.5 px-5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 fill-current" />
                    <span>Kirim via WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6 space-y-5">
                <div className="w-16 h-16 bg-emerald-100 text-[#16A34A] rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <Check className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display font-black text-xl text-slate-900">
                    Pengajuan Terkirim!
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto font-medium">
                    Data pengajuan <span className="font-bold text-slate-900">{modalServiceType}</span> untuk <span className="font-bold text-slate-900">{namaMasjid}</span> telah disiapkan dan dibuka ke WhatsApp Admin KasMasjid.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-center">
                  <button
                    onClick={closeModal}
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
