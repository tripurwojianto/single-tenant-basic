import React, { useState } from 'react';
import { 
  Users, Smartphone, Receipt, QrCode, HeartHandshake, Globe, 
  Sparkles, ArrowLeft, CheckCircle2, Zap, Wrench, Cloud,
  ChevronRight, Calendar, BellRing, ClipboardCheck, LayoutGrid, CheckSquare
} from 'lucide-react';
import ProServiceModal from './ProServiceModal';

interface FeaturePreviewViewProps {
  featureKey: string;
  onBackToDemo: () => void;
  onUpgradeClick: () => void;
}

export default function FeaturePreviewView({ featureKey, onBackToDemo, onUpgradeClick }: FeaturePreviewViewProps) {
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  // Define details for locked features (All non-basic features are KasMasjid Pro)
  const featureDetails: {
    [key: string]: {
      title: string;
      tier: 'PRO';
      icon: React.ComponentType<any>;
      badgeColor: string;
      iconBg: string;
      iconColor: string;
      tagline: string;
      description: string;
      highlights: string[];
      useCases: { title: string; desc: string }[];
    }
  } = {
    'whatsapp-notif': {
      title: 'Notifikasi WhatsApp Keuangan',
      tier: 'PRO',
      icon: Smartphone,
      badgeColor: 'bg-indigo-50 border-indigo-200 text-indigo-700',
      iconBg: 'bg-indigo-50 text-indigo-600',
      iconColor: 'text-indigo-600',
      tagline: 'Kirim pengumuman & bukti kas otomatis langsung ke handphone jamaah dan DKM',
      description: 'Sistem gerbang WhatsApp (WA Gateway) otomatis yang terhubung langsung dengan pencatatan pembukuan Anda. Setiap kali ada transaksi masuk atau keluar, sistem dapat dikonfigurasi untuk mengirimkan notifikasi instan.',
      highlights: [
        'Kirim struk digital otomatis ke nomor WhatsApp donatur.',
        'Notifikasi real-time untuk pengeluaran bernominal besar kepada Ketua DKM.',
        'Kirim resume saldo kas mingguan otomatis ke grup WA pengurus masjid.',
        'Tanpa perlu biaya sewa server tambahan (siap pakai).'
      ],
      useCases: [
        {
          title: 'Notifikasi Infaq Jumat',
          desc: 'Setiap hari Jumat setelah rekapitulasi, pengurus dapat menekan satu tombol untuk menyiarkan total infaq kotak amal hari itu ke grup WhatsApp Jamaah secara rapi.'
        },
        {
          title: 'Kwitansi Digital Donatur',
          desc: 'Saat donatur menyerahkan dana renovasi masjid, sistem otomatis mengirimkan pesan terima kasih personalisasi beserta link kwitansi PDF langsung ke WhatsApp pribadinya.'
        }
      ]
    },
    'thermal-print': {
      title: 'Cetak Kwitansi / Struk Termal',
      tier: 'PRO',
      icon: Receipt,
      badgeColor: 'bg-indigo-50 border-indigo-200 text-indigo-700',
      iconBg: 'bg-indigo-50 text-indigo-600',
      iconColor: 'text-indigo-600',
      tagline: 'Cetak tanda terima transaksi fisik secara instan layaknya minimarket',
      description: 'Dukungan penuh untuk pencetakan struk transaksi menggunakan printer termal bluetooth maupun USB (ukuran lebar kertas 58mm & 80mm). Membantu meningkatkan akuntabilitas saat penerimaan zakat, infaq khusus, atau bukti kas keluar.',
      highlights: [
        'Kompatibel dengan berbagai merk printer termal Bluetooth/USB di pasaran.',
        'Layout tanda terima dirancang padat, hemat kertas, dan sangat rapi.',
        'Bisa menyertakan logo masjid, teks hadits pilihan, serta tautan QR-Code di bagian bawah struk.',
        'Mendukung cetak ganda (satu untuk donatur, satu untuk arsip bendahara).'
      ],
      useCases: [
        {
          title: 'Pos Layanan Zakat Fitrah',
          desc: 'Panitia Ramadhan dapat mencetak bukti setor zakat fitrah untuk jamaah yang membayar di masjid secara cepat, menghindari antrean pencatatan manual di kertas.'
        },
        {
          title: 'Verifikasi Kas Belanja',
          desc: 'Setiap belanja renovasi atau konsumsi selesai diinput, bendahara mencetak struk termal kecil untuk ditempelkan di buku kwitansi fisik sebagai bukti lampiran audit.'
        }
      ]
    },
    'multi-admin': {
      title: 'Multi-Admin & Kolaborasi',
      tier: 'PRO',
      icon: Users,
      badgeColor: 'bg-indigo-50 border-indigo-200 text-indigo-700',
      iconBg: 'bg-indigo-50 text-indigo-600',
      iconColor: 'text-indigo-600',
      tagline: 'Kelola kas bersama Ketua, Sekretaris, dan Bendahara dalam satu sistem terpadu',
      description: 'Berbeda dengan KasMasjid Basic yang berbasis single-user Google Sheets, edisi Pro menggunakan cloud database utama berkinerja tinggi yang memungkinkan banyak pengurus masuk dan mencatat keuangan secara bersamaan tanpa resiko data tertimpa.',
      highlights: [
        'Multi-level hak akses: Ketua (Viewer/Approval), Bendahara (Editor), Sekretaris (Inventory Editor).',
        'Sistem log aktivitas pengurus: ketahui siapa yang menginput atau mengubah setiap baris data.',
        'Kunci periode keuangan bulanan untuk mencegah pengubahan data masa lalu secara sepihak.',
        'Sinkronisasi instan antar-perangkat (Laptop, HP, Tablet).'
      ],
      useCases: [
        {
          title: 'Kerja Paralel Panitia Renovasi',
          desc: 'Bendahara pembangunan menginput nota pembelian semen, sementara bendahara operasional mencatat tagihan listrik masjid di waktu yang sama tanpa konflik sistem.'
        },
        {
          title: 'Sistem Persetujuan (Approval)',
          desc: 'Bendahara menginput rancangan belanja sosial, Ketua DKM menerima notifikasi di handphonenya dan memberikan tanda setuju (approve) sebelum dana dicairkan.'
        }
      ]
    },
    'portal-jamaah': {
      title: 'Portal Jamaah & Mading Digital',
      tier: 'PRO',
      icon: Globe,
      badgeColor: 'bg-indigo-50 border-indigo-200 text-indigo-700',
      iconBg: 'bg-indigo-50 text-indigo-600',
      iconColor: 'text-indigo-600',
      tagline: 'Publikasikan transparansi keuangan & jadwal kegiatan masjid ke seluruh dunia',
      description: 'Satu halaman web khusus (portal publik) berdomain kustom untuk masjid Anda. Seluruh jamaah dapat memantau secara langsung laporan keuangan mingguan, program kerja DKM, inventaris barang yang siap dipinjam, serta jadwal kajian terdekat.',
      highlights: [
        'Akses bebas tanpa login untuk jamaah demi keamanan data admin utama.',
        'Grafik laporan kas yang interaktif, mudah dipahami orang awam sekalipun.',
        'Formulir pendaftaran jamaah untuk kegiatan qurban, santunan, atau iuran warga.',
        'Optimasi tampilan seluler (sangat ringan dibuka di HP jamaah).'
      ],
      useCases: [
        {
          title: 'Pengumuman Saldo via QR-Code',
          desc: 'Pengurus menempelkan stiker QR-code di gerbang masjid. Jamaah cukup memindai dengan HP mereka untuk langsung melihat sisa saldo kas renovasi & kas sosial terkini.'
        },
        {
          title: 'Reservasi Jadwal Pinjam Barang',
          desc: 'Jamaah yang ingin meminjam tenda atau keranda jenazah dapat melihat ketersediaan barang di portal publik lalu mengisi form pengajuan pinjam secara mandiri.'
        }
      ]
    },
    'zakat-digital': {
      title: 'Manajemen Zakat Fitrah & Maal',
      tier: 'PRO',
      icon: HeartHandshake,
      badgeColor: 'bg-indigo-50 border-indigo-200 text-indigo-700',
      iconBg: 'bg-indigo-50 text-indigo-600',
      iconColor: 'text-indigo-600',
      tagline: 'Pembukuan zakat profesional terintegrasi dari muzakki hingga mustahik',
      description: 'Modul komprehensif untuk mendata pembayar zakat (muzakki) dan penerima manfaat (mustahik) di lingkungan sekitar masjid. Dilengkapi dengan kalkulator zakat syar\'i untuk membantu jamaah menghitung kewajibannya secara akurat.',
      highlights: [
        'Kalkulator zakat emas, perak, perdagangan, pertanian, dan zakat penghasilan.',
        'Klasifikasi mustahik berdasarkan 8 asnaf (Fakir, Miskin, Amil, Muallaf, dll).',
        'Pemberitahuan otomatis via WA / struk cetak saat zakat berhasil disalurkan.',
        'Grafik statistik distribusi zakat untuk dilaporkan pada sidang pleno DKM.'
      ],
      useCases: [
        {
          title: 'Panitia Ramadhan Terstruktur',
          desc: 'Mencatat konversi zakat beras (kg) maupun uang secara real-time, sehingga total beras zakat terkumpul bisa langsung diketahui setiap jamnya.'
        },
        {
          title: 'Penyaluran Tepat Sasaran',
          desc: 'Sistem memberikan rekomendasi mustahik terdekat yang belum menerima bagian zakat, meminimalisir adanya tumpang tindih pembagian paket zakat di masyarakat.'
        }
      ]
    },
    'infaq-qris': {
      title: 'Infaq QRIS Dinamis & Statis',
      tier: 'PRO',
      icon: QrCode,
      badgeColor: 'bg-indigo-50 border-indigo-200 text-indigo-700',
      iconBg: 'bg-indigo-50 text-indigo-600',
      iconColor: 'text-indigo-600',
      tagline: 'Terima infaq non-tunai langsung masuk rekonsiliasi buku kas besar',
      description: 'Integrasi sistem pembayaran non-tunai berbiaya admin rendah khusus tempat ibadah. Setiap kali jamaah memindai QRIS masjid Anda, transaksi akan terekam otomatis di sistem KasMasjid tanpa perlu bendahara menginput satu-persatu.',
      highlights: [
        'Pembuatan kode QRIS statis untuk dipajang di area masjid & sosial media.',
        'QRIS dinamis (nominal tercantum otomatis) untuk penggalangan dana khusus.',
        'Pencatatan real-time yang membedakan infaq non-tunai dengan infaq fisik laci kotak.',
        'Pencairan dana cepat ke rekening Bank Syariah pilihan DKM.'
      ],
      useCases: [
        {
          title: 'QRIS di Layar Proyektor / TV Masjid',
          desc: 'Sebelum sholat Jumat dimulai, layar TV masjid menampilkan QRIS donasi pembangunan masjid, memudahkan jamaah yang tidak membawa uang tunai untuk berinfaq.'
        },
        {
          title: 'Penggalangan Dana Bencana',
          desc: 'Masjid membuka donasi khusus kemanusiaan dengan QRIS dinamis yang langsung menyalurkan dana tersebut ke rekening program kemanusiaan.'
        }
      ]
    }
  };

  const feature = featureDetails[featureKey] || {
    title: 'Fitur KasMasjid Pro',
    tier: 'PRO',
    icon: Sparkles,
    badgeColor: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    iconBg: 'bg-indigo-50 text-indigo-600',
    iconColor: 'text-indigo-600',
    tagline: 'Kembangkan pengelolaan administrasi masjid Anda ke tingkat berikutnya',
    description: 'Fitur ini tersedia dalam produk KasMasjid Pro untuk mendukung ekosistem pengelolaan operasional masjid yang lebih maju.',
    highlights: ['Manajemen canggih', 'Transparansi optimal', 'Integrasi andal'],
    useCases: []
  };

  const IconComponent = feature.icon;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Back Button */}
      <div className="flex items-center justify-between no-print">
        <button
          onClick={onBackToDemo}
          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 flex items-center gap-2 cursor-pointer transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Fitur Demo
        </button>
        <div className={`px-3 py-1 rounded-full border text-[10px] font-extrabold uppercase tracking-widest ${feature.badgeColor}`}>
          Produk KasMasjid Pro
        </div>
      </div>

      {/* Hero Header Section */}
      <div className="bg-white rounded-[32px] border border-slate-200/80 p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -z-10 flex items-center justify-center opacity-40">
          <Sparkles className="w-8 h-8 text-slate-300" />
        </div>

        <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-start relative z-10">
          <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ${feature.iconBg} flex items-center justify-center shrink-0 shadow-sm`}>
            <IconComponent className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <div className="space-y-3 min-w-0 flex-1">
            <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight leading-tight">
              {feature.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
              {feature.tagline}
            </p>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans">
              {feature.description}
            </p>
          </div>
        </div>

        {/* Highlight points */}
        <div className="mt-8 pt-8 border-t border-slate-100 grid sm:grid-cols-2 gap-4">
          {feature.highlights.map((point, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs text-slate-600 font-medium leading-relaxed">{point}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Typical Use Cases */}
      {feature.useCases.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-display font-bold text-base text-slate-800 px-1 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            Skenario & Kasus Penggunaan Realistis
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {feature.useCases.map((useCase, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 block"></span>
                    Skenario {idx + 1}
                  </div>
                  <h4 className="font-display font-bold text-sm text-slate-900">{useCase.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans">{useCase.desc}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600">
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
                  Mendukung efisiensi operasional masjid
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Model Layanan Overview Section */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="space-y-1.5 text-left">
          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block">Skema Implementasi</span>
          <h3 className="font-display font-black text-lg text-slate-900">
            3 Pilihan Model Layanan KasMasjid Pro
          </h3>
          <p className="text-xs text-slate-500">
            Fitur ini tersedia dalam produk KasMasjid Pro. Pilih skema layanan yang paling sesuai dengan kebutuhan DKM Anda:
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 text-left">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Wrench className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-xs text-slate-900">Implementasi Mandiri</h4>
            </div>
            <p className="text-[11px] font-semibold text-emerald-700">Sekali bayar, dikelola sendiri</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Menerima akses source code & panduan instalasi ke Vercel/Cloud. Database dikelola mandiri tanpa iuran bulanan.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-xs text-slate-900">Pendampingan Implementasi</h4>
            </div>
            <p className="text-[11px] font-semibold text-indigo-700">Sekali bayar, dibantu sampai live</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Tim teknis KasMasjid mendampingi proses setup, konfigurasi Google API, hingga aplikasi siap pakai 100%.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                <Cloud className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-xs text-slate-900">Layanan Pengelolaan</h4>
            </div>
            <p className="text-[11px] font-semibold text-purple-700">Berlangganan bulanan</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Tim KasMasjid mengelola penuh infrastruktur server, backup rutin, domain kustom, & support prioritas 24/7.
            </p>
          </div>
        </div>
      </div>

      {/* Upgrading Call To Action Panel */}
      <div className="bg-slate-900 text-white rounded-[32px] p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-950 rounded-tl-full -z-10 opacity-30"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              KasMasjid Pro
            </div>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight">
              Aktivasi KasMasjid Pro untuk DKM Anda
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg leading-relaxed">
              Pelajari 3 pilihan model layanan (Mandiri, Pendampingan, atau Pengelolaan) dan sesuaikan dengan kebutuhan tempat ibadah Anda.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0 justify-center">
            <button
              onClick={() => setIsServiceModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-sm text-center cursor-pointer hover:scale-[1.02] active:scale-95"
            >
              Lihat Pilihan Model Layanan Pro
            </button>
            <button
              onClick={() => setIsServiceModalOpen(true)}
              className="border border-slate-700 hover:border-slate-600 bg-slate-800/40 text-slate-200 px-6 py-3 rounded-2xl text-sm font-bold transition-all text-center cursor-pointer"
            >
              Konsultasi Layanan
            </button>
          </div>
        </div>
      </div>

      {/* Return footer */}
      <div className="text-center no-print pt-4">
        <button
          onClick={onBackToDemo}
          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline underline-offset-4 cursor-pointer"
        >
          ← Kembali ke Dashboard Demo (Gunakan Fitur KasMasjid Basic)
        </button>
      </div>

      {/* Pro Service Modal */}
      <ProServiceModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        featureTitle={feature.title}
      />
    </div>
  );
}

