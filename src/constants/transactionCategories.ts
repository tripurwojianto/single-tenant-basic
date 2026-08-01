import { Category } from '../types';

/**
 * Single source of truth for transaction categories in KasMasjid.
 * Prepares the foundation for KasMasjid Pro custom categories while providing
 * default categories optimized for DKM administration in KasMasjid Basic.
 */

export const DEFAULT_INCOME_CATEGORIES: string[] = [
  'Infaq Umum',
  'Infaq Terikat',
  'Kotak Amal',
  'Zakat Fitrah',
  'Zakat Mal',
  'Tabungan Qurban',
  'Donasi',
  'Lainnya',
];

export const DEFAULT_EXPENSE_CATEGORIES: string[] = [
  'Air & Listrik',
  'Gaji Imam',
  'Gaji Marbot',
  'Honor Penceramah',
  'Kegiatan Masjid',
  'Santunan Fakir Miskin',
  'Inventaris',
  'Lainnya',
];

export const DEFAULT_CATEGORIES: Category[] = [
  ...DEFAULT_INCOME_CATEGORIES.map((nama) => ({ tipe: 'Income' as const, nama })),
  ...DEFAULT_EXPENSE_CATEGORIES.map((nama) => ({ tipe: 'Expense' as const, nama })),
];

/**
 * Returns income categories in exact order.
 * Ensures DEFAULT_INCOME_CATEGORIES are listed first in exact sequence,
 * preserving any custom categories if supplied.
 */
export function getIncomeCategories(categoriesFromState?: Category[]): string[] {
  if (!categoriesFromState || categoriesFromState.length === 0) {
    return DEFAULT_INCOME_CATEGORIES;
  }
  const fromState = categoriesFromState.filter((c) => c.tipe === 'Income').map((c) => c.nama);
  if (fromState.length === 0) {
    return DEFAULT_INCOME_CATEGORIES;
  }

  // Preserve exact order of DEFAULT_INCOME_CATEGORIES, then append any additional custom ones
  const result = [...DEFAULT_INCOME_CATEGORIES];
  for (const cat of fromState) {
    if (!result.includes(cat)) {
      result.push(cat);
    }
  }
  return result;
}

/**
 * Returns expense categories in exact order.
 * Ensures DEFAULT_EXPENSE_CATEGORIES are listed first in exact sequence,
 * preserving any custom categories if supplied.
 */
export function getExpenseCategories(categoriesFromState?: Category[]): string[] {
  if (!categoriesFromState || categoriesFromState.length === 0) {
    return DEFAULT_EXPENSE_CATEGORIES;
  }
  const fromState = categoriesFromState.filter((c) => c.tipe === 'Expense').map((c) => c.nama);
  if (fromState.length === 0) {
    return DEFAULT_EXPENSE_CATEGORIES;
  }

  // Preserve exact order of DEFAULT_EXPENSE_CATEGORIES, then append any additional custom ones
  const result = [...DEFAULT_EXPENSE_CATEGORIES];
  for (const cat of fromState) {
    if (!result.includes(cat)) {
      result.push(cat);
    }
  }
  return result;
}
