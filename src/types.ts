/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MosqueInfo {
  namaMasjid: string;
  logo: string;
  tagline: string;
  alamat: string;
  kota: string;
  whatsApp: string;
  email: string;
  website: string;
  profilSingkat: string;
}

export interface CashTransaction {
  id?: string; // Optional row tracker
  tanggal: string;
  kategori: string;
  deskripsi: string;
  nominal: number;
  bukti?: string;
}

export interface InventoryItem {
  id?: string;
  namaBarang: string;
  kategori: string;
  lokasi: string;
  jumlah: number;
  kondisi: 'Baik' | 'Rusak Ringan' | 'Rusak Berat';
  keterangan: string;
}

export interface Announcement {
  id?: string;
  judul: string;
  isi: string;
  tanggal: string;
  status: 'Draft' | 'Publish';
}

export interface Category {
  tipe: 'Income' | 'Expense';
  nama: string;
}

export interface FeedbackData {
  saran: string;
  bug: string;
  pertanyaan: string;
  permintaanFitur: string;
  tanggal: string;
}

export interface MosqueState {
  info: MosqueInfo;
  incomes: CashTransaction[];
  expenses: CashTransaction[];
  inventory: InventoryItem[];
  announcements: Announcement[];
  categories: Category[];
  feedbacks: FeedbackData[];
}
