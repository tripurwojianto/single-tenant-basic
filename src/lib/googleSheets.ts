/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MosqueState, MosqueInfo, CashTransaction, InventoryItem, Announcement, Category, FeedbackData } from '../types';
import { DEFAULT_CATEGORIES } from '../constants/transactionCategories';

// Standard spreadsheet name
export const SPREADSHEET_NAME = 'KasMasjid Database';

/**
 * Helper to handle fetch responses and error logging
 */
async function handleResponse(res: Response, errorMessage: string) {
  if (!res.ok) {
    const text = await res.text();
    console.error(`Error details: ${text}`);
    if (res.status === 401) {
      throw new Error(`Sesi Google Sheets Anda telah kedaluwarsa (401 UNAUTHENTICATED). Silakan klik 'Masuk Kembali dengan Google' untuk memperbarui token akses.`);
    }
    throw new Error(`${errorMessage} (Status: ${res.status}): ${text}`);
  }
  return res.json();
}

/**
 * Checks if the Google Spreadsheet exists and is accessible (Database Health Check)
 */
export async function checkSpreadsheetHealth(accessToken: string, spreadsheetId: string): Promise<boolean> {
  try {
    const url = `https://www.googleapis.com/drive/v3/files/${spreadsheetId}?fields=id,name,trashed`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) {
      console.error('[SYNC ERROR] Health Check Failed - HTTP Status:', res.status);
      return false;
    }
    const data = await res.json();
    if (data.trashed) {
      console.error('[SYNC ERROR] Health Check Failed - Spreadsheet in Trash');
      return false;
    }
    return true;
  } catch (err: any) {
    console.error('[SYNC ERROR] Health Check Exception:', err?.message || String(err));
    return false;
  }
}

/**
 * Searches the user's Google Drive for the spreadsheet
 */
export async function findSpreadsheet(accessToken: string): Promise<string | null> {
  console.log('[SYNC 4] findSpreadsheet dimulai');
  const q = `name = '${SPREADSHEET_NAME}' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`;
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name)`;
  
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await handleResponse(res, 'Gagal mencari spreadsheet di Google Drive');
  console.log('[SYNC 5] findSpreadsheet selesai');
  
  if (data.files && data.files.length > 0) {
    console.log('[SYNC 6] Spreadsheet ditemukan:', data.files[0].id);
    return data.files[0].id;
  }
  console.log('[SYNC 7] Spreadsheet tidak ditemukan');
  return null;
}

/**
 * Creates a new spreadsheet with the required worksheets
 */
export async function createSpreadsheet(accessToken: string): Promise<string> {
  console.log('[SYNC 8] createSpreadsheet dimulai');
  const url = 'https://sheets.googleapis.com/v4/spreadsheets';
  const body = {
    properties: {
      title: SPREADSHEET_NAME,
    },
    sheets: [
      { properties: { title: 'MosqueInfo' } },
      { properties: { title: 'CashIncome' } },
      { properties: { title: 'CashExpense' } },
      { properties: { title: 'Inventory' } },
      { properties: { title: 'Announcements' } },
      { properties: { title: 'Categories' } },
      { properties: { title: 'Feedback' } },
    ],
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await handleResponse(res, 'Gagal membuat spreadsheet baru');
  const spreadsheetId = data.spreadsheetId;

  // Now, populate initial headers and default data
  await populateInitialData(accessToken, spreadsheetId);

  console.log('[SYNC 9] createSpreadsheet selesai:', spreadsheetId);
  return spreadsheetId;
}

/**
 * Populates initial headers and demo data
 */
async function populateInitialData(accessToken: string, spreadsheetId: string) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`;
  
  const initialData = {
    valueInputOption: 'USER_ENTERED',
    data: [
      {
        range: 'MosqueInfo!A1:I2',
        values: [
          ['namaMasjid', 'logo', 'tagline', 'alamat', 'kota', 'whatsApp', 'email', 'website', 'profilSingkat'],
          ['Masjid Raya Baiturrahman', 'https://images.unsplash.com/photo-1590076214537-1e3c7c97b744?q=80&w=150', 'Menuju Masyarakat Madani Berlandaskan Al-Qur\'an', 'Jl. Masjid Raya No. 1', 'Aceh', '081234567890', 'info@baiturrahman.or.id', 'www.baiturrahman.or.id', 'Masjid pusat kegiatan ibadah dan kajian keislaman utama di wilayah kota Banda Aceh.']
        ]
      },
      {
        range: 'CashIncome!A1:F4',
        values: [
          ['id', 'tanggal', 'kategori', 'deskripsi', 'nominal', 'bukti'],
          ['inc-1', '2026-07-10', 'Infaq Jumat', 'Infaq tromol jumat pekan ke-2', '5250000', ''],
          ['inc-2', '2026-07-12', 'Zakat', 'Zakat maal dari H. Ahmad', '2500000', ''],
          ['inc-3', '2026-07-15', 'Waqaf', 'Sumbangan pembangunan menara', '15000000', '']
        ]
      },
      {
        range: 'CashExpense!A1:F3',
        values: [
          ['id', 'tanggal', 'kategori', 'deskripsi', 'nominal', 'bukti'],
          ['exp-1', '2026-07-11', 'Operasional', 'Bisyarah Imam dan Muadzin jumat', '800000', ''],
          ['exp-2', '2026-07-14', 'Kebersihan', 'Pembelian sabun, pewangi karpet, sapu', '350000', '']
        ]
      },
      {
        range: 'Inventory!A1:G4',
        values: [
          ['id', 'namaBarang', 'kategori', 'lokasi', 'jumlah', 'kondisi', 'keterangan'],
          ['inv-1', 'Air Conditioner (AC) Daikin 2 PK', 'Elektronik', 'Ruang Utama', '4', 'Baik', 'Suhu dingin prima'],
          ['inv-2', 'Karpet Sajadah Turki', 'Perlengkapan', 'Ruang Utama', '12', 'Baik', 'Panjang 6 meter per roll'],
          ['inv-3', 'Sound System Mixer Yamaha 12 Ch', 'Audio', 'Ruang Operator', '1', 'Baik', 'Setting audio masjid']
        ]
      },
      {
        range: 'Announcements!A1:E4',
        values: [
          ['id', 'judul', 'isi', 'tanggal', 'status'],
          ['ann-1', 'Kajian Ahad Subuh', 'Mari hadiri kajian tafsir Al-Qur\'an Ahad subuh bersama Dr. KH. Muhammad Sholeh, MA. Disediakan sarapan gratis.', '2026-07-18', 'Publish'],
          ['ann-2', 'Penerimaan Hebat Zakat', 'Layanan UPZ Baiturrahman melayani pembayaran zakat mal, zakat fitrah, dan fidyah setiap hari pukul 08:00 - 21:00.', '2026-07-16', 'Publish'],
          ['ann-3', 'Rencana Renovasi Tempat Wudhu', 'Akan dilakukan renovasi tempat wudhu bagian timur mulai pekan depan untuk kenyamanan jamaah sekalian.', '2026-07-15', 'Draft']
        ]
      },
      {
        range: `Categories!A1:B${DEFAULT_CATEGORIES.length + 1}`,
        values: [
          ['tipe', 'nama'],
          ...DEFAULT_CATEGORIES.map(c => [c.tipe, c.nama])
        ]
      },
      {
        range: 'Feedback!A1:E2',
        values: [
          ['saran', 'bug', 'pertanyaan', 'permintaanFitur', 'tanggal'],
          ['Sangat bermanfaat untuk masjid kami.', '', 'Apakah ada tutorial video?', 'Ekspor ke format PDF laporan keuangan bulanan', '2026-07-18']
        ]
      }
    ]
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(initialData),
  });
  await handleResponse(res, 'Gagal menginisialisasi data spreadsheet');
}

/**
 * Fetches all sheets data from the spreadsheet and parses into MosqueState
 */
export async function fetchSpreadsheetData(accessToken: string, spreadsheetId: string): Promise<MosqueState> {
  const ranges = [
    'MosqueInfo!A1:I2',
    'CashIncome!A1:F1000',
    'CashExpense!A1:F1000',
    'Inventory!A1:G1000',
    'Announcements!A1:E1000',
    'Categories!A1:B200',
    'Feedback!A1:E1000'
  ];
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchGet?ranges=${ranges.map(encodeURIComponent).join('&ranges=')}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await handleResponse(res, 'Gagal mengambil data dari Google Sheets');
  const valueRanges = data.valueRanges || [];

  // Parse MosqueInfo (1 row expected)
  const infoValues = valueRanges[0]?.values || [];
  let info: MosqueInfo = {
    namaMasjid: '', logo: '', tagline: '', alamat: '', kota: '', whatsApp: '', email: '', website: '', profilSingkat: ''
  };
  if (infoValues.length > 1) {
    const row = infoValues[1];
    info = {
      namaMasjid: row[0] || '',
      logo: row[1] || '',
      tagline: row[2] || '',
      alamat: row[3] || '',
      kota: row[4] || '',
      whatsApp: row[5] || '',
      email: row[6] || '',
      website: row[7] || '',
      profilSingkat: row[8] || '',
    };
  }

  // Helper to parse arrays from rows with headers
  function parseRows<T>(values: any[][], mapper: (row: any[]) => T): T[] {
    if (!values || values.length <= 1) return [];
    return values.slice(1).map(mapper);
  }

  // Parse CashIncome
  const incomes = parseRows<CashTransaction>(valueRanges[1]?.values || [], (row) => ({
    id: row[0] || '',
    tanggal: row[1] || '',
    kategori: row[2] || '',
    deskripsi: row[3] || '',
    nominal: Number(row[4] || 0),
    bukti: row[5] || '',
  }));

  // Parse CashExpense
  const expenses = parseRows<CashTransaction>(valueRanges[2]?.values || [], (row) => ({
    id: row[0] || '',
    tanggal: row[1] || '',
    kategori: row[2] || '',
    deskripsi: row[3] || '',
    nominal: Number(row[4] || 0),
    bukti: row[5] || '',
  }));

  // Parse Inventory
  const inventory = parseRows<InventoryItem>(valueRanges[3]?.values || [], (row) => ({
    id: row[0] || '',
    namaBarang: row[1] || '',
    kategori: row[2] || '',
    lokasi: row[3] || '',
    jumlah: Number(row[4] || 1),
    kondisi: (row[5] as any) || 'Baik',
    keterangan: row[6] || '',
  }));

  // Parse Announcements
  const announcements = parseRows<Announcement>(valueRanges[4]?.values || [], (row) => ({
    id: row[0] || '',
    judul: row[1] || '',
    isi: row[2] || '',
    tanggal: row[3] || '',
    status: (row[4] as any) || 'Draft',
  }));

  // Parse Categories
  const categories = parseRows<Category>(valueRanges[5]?.values || [], (row) => ({
    tipe: (row[0] as any) || 'Income',
    nama: row[1] || '',
  }));

  // Parse Feedback
  const feedbacks = parseRows<FeedbackData>(valueRanges[6]?.values || [], (row) => ({
    saran: row[0] || '',
    bug: row[1] || '',
    pertanyaan: row[2] || '',
    permintaanFitur: row[3] || '',
    tanggal: row[4] || '',
  }));

  return { info, incomes, expenses, inventory, announcements, categories, feedbacks };
}

/**
 * Saves MosqueInfo back to spreadsheet
 */
export async function saveMosqueInfo(accessToken: string, spreadsheetId: string, info: MosqueInfo) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/MosqueInfo!A2:I2?valueInputOption=USER_ENTERED`;
  const body = {
    range: 'MosqueInfo!A2:I2',
    values: [[
      info.namaMasjid,
      info.logo,
      info.tagline,
      info.alamat,
      info.kota,
      info.whatsApp,
      info.email,
      info.website,
      info.profilSingkat
    ]]
  };

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  await handleResponse(res, 'Gagal menyimpan profil masjid');
}

/**
 * Overwrites a sheet from index A2 with rows of data
 */
async function overwriteSheet(
  accessToken: string,
  spreadsheetId: string,
  sheetName: string,
  rangeLetter: string,
  rows: any[][]
) {
  // First clear the existing data range
  const clearUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!A2:${rangeLetter}1000:clear`;
  const clearRes = await fetch(clearUrl, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  await handleResponse(clearRes, `Gagal membersihkan data sheet ${sheetName}`);

  if (rows.length === 0) return;

  // Then update with new rows
  const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!A2?valueInputOption=USER_ENTERED`;
  const body = {
    range: `${sheetName}!A2`,
    values: rows,
  };

  const res = await fetch(updateUrl, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  await handleResponse(res, `Gagal memperbarui data sheet ${sheetName}`);
}

/**
 * Updates the entire CashIncome list
 */
export async function saveIncomes(accessToken: string, spreadsheetId: string, incomes: CashTransaction[]) {
  const rows = incomes.map((item) => [
    item.id || `inc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    item.tanggal,
    item.kategori,
    item.deskripsi,
    item.nominal.toString(),
    item.bukti || '',
  ]);
  await overwriteSheet(accessToken, spreadsheetId, 'CashIncome', 'F', rows);
}

/**
 * Updates the entire CashExpense list
 */
export async function saveExpenses(accessToken: string, spreadsheetId: string, expenses: CashTransaction[]) {
  const rows = expenses.map((item) => [
    item.id || `exp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    item.tanggal,
    item.kategori,
    item.deskripsi,
    item.nominal.toString(),
    item.bukti || '',
  ]);
  await overwriteSheet(accessToken, spreadsheetId, 'CashExpense', 'F', rows);
}

/**
 * Updates the entire Inventory list
 */
export async function saveInventory(accessToken: string, spreadsheetId: string, inventory: InventoryItem[]) {
  const rows = inventory.map((item) => [
    item.id || `inv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    item.namaBarang,
    item.kategori,
    item.lokasi,
    item.jumlah.toString(),
    item.kondisi,
    item.keterangan || '',
  ]);
  await overwriteSheet(accessToken, spreadsheetId, 'Inventory', 'G', rows);
}

/**
 * Updates the entire Announcements list
 */
export async function saveAnnouncements(accessToken: string, spreadsheetId: string, announcements: Announcement[]) {
  const rows = announcements.map((item) => [
    item.id || `ann-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    item.judul,
    item.isi,
    item.tanggal,
    item.status,
  ]);
  await overwriteSheet(accessToken, spreadsheetId, 'Announcements', 'E', rows);
}

/**
 * Updates the entire Categories list
 */
export async function saveCategories(accessToken: string, spreadsheetId: string, categories: Category[]) {
  const rows = categories.map((item) => [
    item.tipe,
    item.nama,
  ]);
  await overwriteSheet(accessToken, spreadsheetId, 'Categories', 'B', rows);
}

/**
 * Sends feedback to the developer (stored in the spreadsheet for verification)
 */
export async function saveFeedback(accessToken: string, spreadsheetId: string, feedback: FeedbackData) {
  // Append a single row
  const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Feedback!A2:append?valueInputOption=USER_ENTERED`;
  const body = {
    range: 'Feedback!A2',
    majorDimension: 'ROWS',
    values: [[
      feedback.saran,
      feedback.bug,
      feedback.pertanyaan,
      feedback.permintaanFitur,
      feedback.tanggal
    ]]
  };

  const res = await fetch(appendUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  await handleResponse(res, 'Gagal mengirimkan masukan');
}

/**
 * Searches the user's Google Drive for the master registry spreadsheet
 */
export async function findMasterRegistry(accessToken: string, masterRegistryName: string): Promise<string | null> {
  const q = `name = '${masterRegistryName}' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`;
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name)`;
  
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await handleResponse(res, 'Gagal mencari master registry di Google Drive');
  
  if (data.files && data.files.length > 0) {
    return data.files[0].id;
  }
  return null;
}

/**
 * Creates a new master registry spreadsheet with 'MasterRegistry' worksheet
 */
export async function createMasterRegistry(accessToken: string, masterRegistryName: string): Promise<string> {
  const url = 'https://sheets.googleapis.com/v4/spreadsheets';
  const body = {
    properties: {
      title: masterRegistryName,
    },
    sheets: [
      { properties: { title: 'MasterRegistry' } },
    ],
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await handleResponse(res, 'Gagal membuat master registry spreadsheet baru');
  const spreadsheetId = data.spreadsheetId;

  // Populate initial headers
  const headersUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/MasterRegistry!A1:R1?valueInputOption=USER_ENTERED`;
  const headersBody = {
    range: 'MasterRegistry!A1:R1',
    values: [[
      'TenantID', 'OrganizationName', 'OwnerName', 'OwnerEmail', 'WhatsApp', 'City', 
      'Edition', 'Plan', 'Status', 'TrialStartAt', 'TrialEndAt', 'SpreadsheetID', 
      'SpreadsheetURL', 'InstanceURL', 'RegisteredAt', 'LastLoginAt', 'UpdatedAt', 'Notes'
    ]]
  };

  const headersRes = await fetch(headersUrl, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(headersBody),
  });
  await handleResponse(headersRes, 'Gagal menginisialisasi header master registry');

  return spreadsheetId;
}

export interface TenantRegistry {
  TenantID: string;
  OrganizationName: string;
  OwnerName: string;
  OwnerEmail: string;
  WhatsApp: string;
  City: string;
  Edition: string;
  Plan: string;
  Status: 'Trial' | 'Active' | 'Suspended' | 'Expired';
  TrialStartAt: string;
  TrialEndAt: string;
  SpreadsheetID: string;
  SpreadsheetURL: string;
  InstanceURL: string;
  RegisteredAt: string;
  LastLoginAt: string;
  UpdatedAt: string;
  Notes: string;
  rowIndex?: number; // 0-based index of row in data rows (exclude header, so actual row is rowIndex + 2)
}

/**
 * Fetches and parses all tenant records from MasterRegistry sheet
 */
export async function fetchMasterRegistryRows(accessToken: string, masterSpreadsheetId: string): Promise<TenantRegistry[]> {
  const range = 'MasterRegistry!A1:R2000';
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${masterSpreadsheetId}/values/${encodeURIComponent(range)}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await handleResponse(res, 'Gagal mengambil data master registry');
  const rows = data.values || [];
  if (rows.length <= 1) return [];

  const headers = rows[0];
  const headerMap: Record<string, number> = {};
  headers.forEach((h: string, idx: number) => {
    headerMap[h.trim()] = idx;
  });

  return rows.slice(1).map((row: any[], index: number) => {
    const getValue = (key: string, fallback: string = '') => {
      const idx = headerMap[key];
      return idx !== undefined && row[idx] !== undefined ? String(row[idx]) : fallback;
    };

    return {
      TenantID: getValue('TenantID'),
      OrganizationName: getValue('OrganizationName'),
      OwnerName: getValue('OwnerName'),
      OwnerEmail: getValue('OwnerEmail'),
      WhatsApp: getValue('WhatsApp'),
      City: getValue('City'),
      Edition: getValue('Edition'),
      Plan: getValue('Plan'),
      Status: getValue('Status', 'Trial') as any,
      TrialStartAt: getValue('TrialStartAt'),
      TrialEndAt: getValue('TrialEndAt'),
      SpreadsheetID: getValue('SpreadsheetID'),
      SpreadsheetURL: getValue('SpreadsheetURL'),
      InstanceURL: getValue('InstanceURL'),
      RegisteredAt: getValue('RegisteredAt'),
      LastLoginAt: getValue('LastLoginAt'),
      UpdatedAt: getValue('UpdatedAt'),
      Notes: getValue('Notes'),
      rowIndex: index // 0-based index of the data row
    };
  });
}

/**
 * Registers a new tenant by appending a row to the MasterRegistry sheet
 */
export async function registerTenantInMasterRegistry(accessToken: string, masterSpreadsheetId: string, tenant: TenantRegistry) {
  const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${masterSpreadsheetId}/values/MasterRegistry!A2:append?valueInputOption=USER_ENTERED`;
  const body = {
    range: 'MasterRegistry!A2',
    majorDimension: 'ROWS',
    values: [[
      tenant.TenantID,
      tenant.OrganizationName,
      tenant.OwnerName,
      tenant.OwnerEmail,
      tenant.WhatsApp,
      tenant.City,
      tenant.Edition,
      tenant.Plan,
      tenant.Status,
      tenant.TrialStartAt,
      tenant.TrialEndAt,
      tenant.SpreadsheetID,
      tenant.SpreadsheetURL,
      tenant.InstanceURL,
      tenant.RegisteredAt,
      tenant.LastLoginAt,
      tenant.UpdatedAt,
      tenant.Notes
    ]]
  };

  const res = await fetch(appendUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  await handleResponse(res, 'Gagal mendaftarkan tenant di master registry');
}

/**
 * Updates a tenant row in the MasterRegistry sheet
 */
export async function updateTenantInMasterRegistry(
  accessToken: string, 
  masterSpreadsheetId: string, 
  tenantId: string, 
  updatedFields: Partial<TenantRegistry>
) {
  // 1. Fetch current rows to find row index
  const tenants = await fetchMasterRegistryRows(accessToken, masterSpreadsheetId);
  const tenant = tenants.find(t => t.TenantID === tenantId);
  if (!tenant || tenant.rowIndex === undefined) {
    throw new Error(`Tenant dengan ID ${tenantId} tidak ditemukan di master registry.`);
  }

  const actualRowNumber = tenant.rowIndex + 2; // +1 for 1-based index, +1 for header row
  const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${masterSpreadsheetId}/values/MasterRegistry!A${actualRowNumber}:R${actualRowNumber}?valueInputOption=USER_ENTERED`;
  
  // Create full updated row payload
  const mergedTenant = { ...tenant, ...updatedFields, UpdatedAt: new Date().toISOString() };
  const rowValues = [
    mergedTenant.TenantID,
    mergedTenant.OrganizationName,
    mergedTenant.OwnerName,
    mergedTenant.OwnerEmail,
    mergedTenant.WhatsApp,
    mergedTenant.City,
    mergedTenant.Edition,
    mergedTenant.Plan,
    mergedTenant.Status,
    mergedTenant.TrialStartAt,
    mergedTenant.TrialEndAt,
    mergedTenant.SpreadsheetID,
    mergedTenant.SpreadsheetURL,
    mergedTenant.InstanceURL,
    mergedTenant.RegisteredAt,
    mergedTenant.LastLoginAt,
    mergedTenant.UpdatedAt,
    mergedTenant.Notes
  ];

  const res = await fetch(updateUrl, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      range: `MasterRegistry!A${actualRowNumber}:R${actualRowNumber}`,
      values: [rowValues]
    }),
  });
  await handleResponse(res, 'Gagal memperbarui tenant di master registry');
}
