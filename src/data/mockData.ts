/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MosqueState } from '../types';

export const INITIAL_MOCK_DATA: MosqueState = {
  info: {
    namaMasjid: 'Masjid Agung Al-Madinah',
    logo: 'https://images.unsplash.com/photo-1590076214537-1e3c7c97b744?q=80&w=150',
    tagline: 'Membangun Ukhuwah, Menggapai Mardhatillah',
    alamat: 'Jl. Madinah Al-Munawwarah No. 45, Kebayoran Baru',
    kota: 'Jakarta Selatan',
    whatsApp: '081299990000',
    email: 'info@almadinah-masjid.id',
    website: 'www.almadinah-masjid.id',
    profilSingkat: 'Masjid jami yang menjadi wadah utama ibadah ritual, pembinaan rohani, serta pemberdayaan ekonomi umat di wilayah Jakarta Selatan.'
  },
  incomes: [
    {
      id: 'inc-1',
      tanggal: '2026-07-03',
      kategori: 'Infaq Jumat',
      deskripsi: 'Infaq kotak amal jumat pekan pertama Juli',
      nominal: 4750000,
      bukti: ''
    },
    {
      id: 'inc-2',
      tanggal: '2026-07-05',
      kategori: 'Zakat',
      deskripsi: 'Zakat mal hamba Allah',
      nominal: 3000000,
      bukti: ''
    },
    {
      id: 'inc-3',
      tanggal: '2026-07-10',
      kategori: 'Infaq Jumat',
      deskripsi: 'Infaq kotak amal jumat pekan kedua Juli',
      nominal: 5120000,
      bukti: ''
    },
    {
      id: 'inc-4',
      tanggal: '2026-07-12',
      kategori: 'Sponsorship',
      deskripsi: 'Donasi CSR Bank Syariah untuk pengajian akbar',
      nominal: 8000000,
      bukti: ''
    },
    {
      id: 'inc-5',
      tanggal: '2026-07-17',
      kategori: 'Waqaf',
      deskripsi: 'Waqaf karpet sajadah tambahan',
      nominal: 2500000,
      bukti: ''
    }
  ],
  expenses: [
    {
      id: 'exp-1',
      tanggal: '2026-07-04',
      kategori: 'Operasional',
      deskripsi: 'Insentif ustadz khotib jumat',
      nominal: 750000,
      bukti: ''
    },
    {
      id: 'exp-2',
      tanggal: '2026-07-06',
      kategori: 'Kebersihan',
      deskripsi: 'Belanja sapu, pewangi ruangan, cairan pel',
      nominal: 320000,
      bukti: ''
    },
    {
      id: 'exp-3',
      tanggal: '2026-07-08',
      kategori: 'Pemeliharaan',
      deskripsi: 'Servis AC ruang sholat utama (2 unit)',
      nominal: 450000,
      bukti: ''
    },
    {
      id: 'exp-4',
      tanggal: '2026-07-15',
      kategori: 'Kegiatan Sosial',
      deskripsi: 'Santunan anak yatim & jompo bulanan',
      nominal: 3500000,
      bukti: ''
    }
  ],
  inventory: [
    {
      id: 'inv-1',
      namaBarang: 'AC Split Panasonic 2 PK',
      kategori: 'Elektronik',
      lokasi: 'Ruang Sholat Utama',
      jumlah: 6,
      kondisi: 'Baik',
      keterangan: 'Suhu dingin terjaga baik'
    },
    {
      id: 'inv-2',
      namaBarang: 'Karpet Sajadah Import',
      kategori: 'Perlengkapan',
      lokasi: 'Ruang Sholat Utama',
      jumlah: 15,
      kondisi: 'Baik',
      keterangan: 'Pencucian rutin 3 bulan sekali'
    },
    {
      id: 'inv-3',
      namaBarang: 'Vacuum Cleaner Sharp',
      kategori: 'Peralatan',
      lokasi: 'Gudang Inventaris',
      jumlah: 2,
      kondisi: 'Baik',
      keterangan: 'Satu unit dalam kondisi kabel agak longgar'
    },
    {
      id: 'inv-4',
      namaBarang: 'Mikrofon Shure Wireless',
      kategori: 'Audio',
      lokasi: 'Ruang Operator',
      jumlah: 3,
      kondisi: 'Baik',
      keterangan: 'Sangat sensitif & jernih'
    },
    {
      id: 'inv-5',
      namaBarang: 'Genset Honda 5000 Watt',
      kategori: 'Mesin',
      lokasi: 'Halaman Belakang',
      jumlah: 1,
      kondisi: 'Baik',
      keterangan: 'Bahan bakar bensin penuh'
    }
  ],
  announcements: [
    {
      id: 'ann-1',
      judul: 'Tabligh Akbar Muharram',
      isi: 'Sambut tahun baru Islam 1448 H dengan Tabligh Akbar bertema "Hijrah Menuju Pribadi Muttaqin" bersama Ust. Adi Hidayat, Lc., MA. Hari Sabtu pukul 09.00 - Selesai.',
      tanggal: '2026-07-18',
      status: 'Publish'
    },
    {
      id: 'ann-2',
      judul: 'Latihan Panahan & Renang Santri',
      isi: 'DKM membuka pendaftaran ekstrakurikuler sunnah memanah dan berenang untuk anak-anak jamaah usia 7-15 tahun setiap sore hari Ahad.',
      tanggal: '2026-07-16',
      status: 'Publish'
    },
    {
      id: 'ann-3',
      judul: 'Penggalangan Dana Ambulans Ummat',
      isi: 'Dibutuhkan total dana Rp 180.000.000 untuk pengadaan mobil ambulans gratis bagi masyarakat kurang mampu. Salurkan infaq terbaik Anda.',
      tanggal: '2026-07-14',
      status: 'Publish'
    }
  ],
  categories: [
    { tipe: 'Income', nama: 'Infaq Jumat' },
    { tipe: 'Income', nama: 'Zakat' },
    { tipe: 'Income', nama: 'Waqaf' },
    { tipe: 'Income', nama: 'Sponsorship' },
    { tipe: 'Income', nama: 'Infaq Khusus' },
    { tipe: 'Expense', nama: 'Operasional' },
    { tipe: 'Expense', nama: 'Kebersihan' },
    { tipe: 'Expense', nama: 'Pemeliharaan' },
    { tipe: 'Expense', nama: 'Kegiatan Sosial' },
    { tipe: 'Expense', nama: 'Perlengkapan' }
  ],
  feedbacks: []
};
