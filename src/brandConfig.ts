/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BrandConfig {
  id: 'masjid' | 'sekolah' | 'warga' | 'kulina';
  appName: string;
  subTitle: string;
  accentColorHex: string; // e.g. '#16A34A'
  accentBgClass: string;  // e.g. 'bg-[#16A34A]'
  accentTextClass: string; // e.g. 'text-[#16A34A]'
  accentBorderClass: string; // e.g. 'border-[#16A34A]'
  accentRingClass: string; // e.g. 'focus:ring-emerald-500/20'
  accentBadgeClass: string; // e.g. 'bg-emerald-50 text-emerald-800'
  heroTitle: string;
  heroDescription: string;
  databaseName: string;
  masterRegistryName: string;
  
  // Terminology
  orgLabel: string;        // e.g. "Masjid"
  orgPlaceholder: string;  // e.g. "Masjid Al-Ikhlas"
  ownerLabel: string;      // e.g. "Takmir / Pengurus"
  ownerPlaceholder: string; // e.g. "Ketua DKM / Bendahara"
  userLabel: string;       // e.g. "Takmir"
  
  // Custom texts
  onboardingIntro: string;
}

export const BRANDS: Record<string, BrandConfig> = {
  masjid: {
    id: 'masjid',
    appName: 'KasMasjid',
    subTitle: 'KasMasjid',
    accentColorHex: '#16A34A',
    accentBgClass: 'bg-[#16A34A]',
    accentTextClass: 'text-[#16A34A]',
    accentBorderClass: 'border-[#16A34A]',
    accentRingClass: 'focus:ring-emerald-500/20',
    accentBadgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-100',
    heroTitle: 'Aplikasi Administrasi Keuangan & Operasional Masjid',
    heroDescription: 'Kelola keuangan, inventaris, dan pengumuman masjid secara transparan berbasis Google Sheets milik DKM.',
    databaseName: 'KasMasjid Database',
    masterRegistryName: 'KasMasjid Master Registry',
    orgLabel: 'Nama Masjid',
    orgPlaceholder: 'Contoh: Masjid Al-Ikhlas',
    ownerLabel: 'Humas / Takmir',
    ownerPlaceholder: 'Contoh: Ketua DKM / Bendahara',
    userLabel: 'Takmir Masjid',
    onboardingIntro: 'Tentukan bagaimana Anda ingin mengoperasikan KasMasjid untuk tempat ibadah Anda. Semua model mendukung integrasi penuh Google Sheets.'
  },
  sekolah: {
    id: 'sekolah',
    appName: 'SekolahHub Basic',
    subTitle: 'KasKelas Basic',
    accentColorHex: '#2563EB',
    accentBgClass: 'bg-[#2563EB]',
    accentTextClass: 'text-[#2563EB]',
    accentBorderClass: 'border-[#2563EB]',
    accentRingClass: 'focus:ring-blue-500/20',
    accentBadgeClass: 'bg-blue-50 text-blue-800 border-blue-100',
    heroTitle: 'Pencatatan Keuangan & Kas Kelas Sekolah',
    heroDescription: 'Kelola keuangan kelas, inventaris sekolah, dan pengumuman kelas secara transparan berbasis Google Sheets milik Komite.',
    databaseName: 'SekolahHub Database',
    masterRegistryName: 'SekolahHub Master Registry',
    orgLabel: 'Sekolah / Kelas',
    orgPlaceholder: 'Contoh: SMA Negeri 1 Bandung - Kelas XI-A',
    ownerLabel: 'Wali Kelas / Komite',
    ownerPlaceholder: 'Contoh: Ibu Rina / Pak Budi',
    userLabel: 'Komite Sekolah',
    onboardingIntro: 'Tentukan bagaimana Anda ingin mengoperasikan SekolahHub Basic untuk sekolah atau kelas Anda. Semua model mendukung integrasi penuh Google Sheets.'
  },
  warga: {
    id: 'warga',
    appName: 'WargaHub Basic',
    subTitle: 'KasWarga Basic',
    accentColorHex: '#EA580C',
    accentBgClass: 'bg-[#EA580C]',
    accentTextClass: 'text-[#EA580C]',
    accentBorderClass: 'border-[#EA580C]',
    accentRingClass: 'focus:ring-orange-500/20',
    accentBadgeClass: 'bg-orange-50 text-orange-800 border-orange-100',
    heroTitle: 'Administrasi Kas & Keuangan Warga',
    heroDescription: 'Kelola iuran RT/RW, inventaris lingkungan, dan pengumuman warga secara transparan berbasis Google Sheets milik pengurus.',
    databaseName: 'WargaHub Database',
    masterRegistryName: 'WargaHub Master Registry',
    orgLabel: 'Lingkungan RT / RW',
    orgPlaceholder: 'Contoh: RT 03 / RW 12 Kelurahan Sukamaju',
    ownerLabel: 'Ketua RT / Bendahara',
    ownerPlaceholder: 'Contoh: Bpk. Hermawan',
    userLabel: 'Pengurus Warga',
    onboardingIntro: 'Tentukan bagaimana Anda ingin mengoperasikan WargaHub Basic untuk lingkungan tempat tinggal Anda. Semua model mendukung integrasi penuh Google Sheets.'
  },
  kulina: {
    id: 'kulina',
    appName: 'KulinaHub Basic',
    subTitle: 'KasKulina Basic',
    accentColorHex: '#D97706',
    accentBgClass: 'bg-[#D97706]',
    accentTextClass: 'text-[#D97706]',
    accentBorderClass: 'border-[#D97706]',
    accentRingClass: 'focus:ring-amber-500/20',
    accentBadgeClass: 'bg-amber-50 text-amber-800 border-amber-100',
    heroTitle: 'Pembukuan Kas & Inventaris Usaha Kuliner',
    heroDescription: 'Kelola arus kas harian, inventaris bahan, dan menu makanan secara transparan berbasis Google Sheets milik warung/restoran.',
    databaseName: 'KulinaHub Database',
    masterRegistryName: 'KulinaHub Master Registry',
    orgLabel: 'Usaha / Toko Kuliner',
    orgPlaceholder: 'Contoh: Warung Nasi Padang Sederhana',
    ownerLabel: 'Pemilik Usaha',
    ownerPlaceholder: 'Contoh: Ibu Fatimah',
    userLabel: 'Pemilik Usaha',
    onboardingIntro: 'Tentukan bagaimana Anda ingin mengoperasikan KulinaHub Basic untuk warung atau catering Anda. Semua model mendukung integrasi penuh Google Sheets.'
  }
};

/**
 * Detect active brand based on query param, env, or local storage. Default is 'masjid'.
 */
export function getActiveBrand(): BrandConfig {
  // Check URL query parameters
  if (typeof window !== 'undefined' && window.location) {
    const params = new URLSearchParams(window.location.search);
    const hubParam = params.get('hub')?.toLowerCase();
    if (hubParam && BRANDS[hubParam]) {
      localStorage.setItem('active_hub_brand', hubParam);
      return BRANDS[hubParam];
    }
  }

  // Check LocalStorage
  if (typeof window !== 'undefined' && window.localStorage) {
    const stored = localStorage.getItem('active_hub_brand');
    if (stored && BRANDS[stored]) {
      return BRANDS[stored];
    }
  }

  // Check Environment Variable (VITE_HUB_BRAND)
  const envBrand = (import.meta as any).env?.VITE_HUB_BRAND?.toLowerCase();
  if (envBrand && BRANDS[envBrand]) {
    return BRANDS[envBrand];
  }

  return BRANDS.masjid;
}
