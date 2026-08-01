import { Category } from '../types';

export interface CategoryGroup {
  groupName: string;
  categories: string[];
}

export const INCOME_CATEGORY_GROUPS: CategoryGroup[] = [
  {
    groupName: 'Penerimaan Infaq & Donasi',
    categories: [
      'Infaq Umum',
      'Infaq Terikat',
      'Kotak Amal',
      'Donasi Program',
      'Hibah',
    ],
  },
  {
    groupName: 'Zakat, Wakaf & Qurban',
    categories: [
      'Zakat Fitrah',
      'Zakat Mal',
      'Wakaf Tunai',
      'Tabungan Qurban',
    ],
  },
  {
    groupName: 'Lainnya',
    categories: ['Lainnya'],
  },
];

export const EXPENSE_CATEGORY_GROUPS: CategoryGroup[] = [
  {
    groupName: 'Operasional Rutin',
    categories: [
      'Air',
      'Listrik',
      'Internet',
      'ATK',
      'BBM',
      'Transport',
      'Konsumsi Rapat',
      'Administrasi Bank',
    ],
  },
  {
    groupName: 'SDM',
    categories: [
      'Gaji Imam',
      'Gaji Marbot',
      'Honor Penceramah',
      'Honor Guru TPA',
      'Honor Petugas Kebersihan',
    ],
  },
  {
    groupName: 'Perawatan & Inventaris',
    categories: [
      'Perbaikan Bangunan',
      'Servis Sound System',
      'Servis AC',
      'Peralatan Kebersihan',
      'Pembelian Inventaris',
      'Kerja Bakti',
      'Cat Bangunan',
    ],
  },
  {
    groupName: 'Program Ibadah & Dakwah',
    categories: [
      'Kajian',
      'PHBI',
      'Ramadhan',
      'Idul Adha',
      'TPA',
      'Pesantren Kilat',
      'Safari Dakwah',
    ],
  },
  {
    groupName: 'Sosial & Kemanusiaan',
    categories: [
      'Santunan Fakir Miskin',
      'Santunan Anak Yatim',
      'Bantuan Pendidikan',
      'Bantuan Bencana',
      'Bantuan Kesehatan',
    ],
  },
  {
    groupName: 'Penyaluran Dana Amanah',
    categories: [
      'Penyaluran Zakat',
      'Penyaluran Infaq Terikat',
      'Penyaluran Wakaf',
      'Penyaluran Qurban',
    ],
  },
  {
    groupName: 'Lainnya',
    categories: ['Lainnya'],
  },
];

export const DEFAULT_INCOME_CATEGORIES: string[] = INCOME_CATEGORY_GROUPS.flatMap((g) => g.categories);

export const DEFAULT_EXPENSE_CATEGORIES: string[] = EXPENSE_CATEGORY_GROUPS.flatMap((g) => g.categories);

export const DEFAULT_CATEGORIES: Category[] = [
  ...DEFAULT_INCOME_CATEGORIES.map((nama) => ({ tipe: 'Income' as const, nama })),
  ...DEFAULT_EXPENSE_CATEGORIES.map((nama) => ({ tipe: 'Expense' as const, nama })),
];

export function getGroupedIncomeCategories(categoriesFromState?: Category[]): CategoryGroup[] {
  const groups: CategoryGroup[] = INCOME_CATEGORY_GROUPS.map((g) => ({
    groupName: g.groupName,
    categories: [...g.categories],
  }));

  if (!categoriesFromState || categoriesFromState.length === 0) {
    return groups;
  }

  const stateCats = categoriesFromState.filter((c) => c.tipe === 'Income').map((c) => c.nama);
  if (stateCats.length === 0) return groups;

  const stateCatSet = new Set(stateCats);
  const knownSet = new Set<string>();

  const filteredGroups: CategoryGroup[] = groups.map((g) => {
    const presentInState = g.categories.filter((c) => stateCatSet.has(c));
    presentInState.forEach((c) => knownSet.add(c));
    return {
      groupName: g.groupName,
      categories: presentInState,
    };
  }).filter((g) => g.categories.length > 0);

  const customCats = stateCats.filter((c) => !knownSet.has(c));
  if (customCats.length > 0) {
    let lainnyaGroup = filteredGroups.find((g) => g.groupName === 'Lainnya');
    if (!lainnyaGroup) {
      lainnyaGroup = { groupName: 'Lainnya', categories: [] };
      filteredGroups.push(lainnyaGroup);
    }
    customCats.forEach((c) => {
      if (!lainnyaGroup!.categories.includes(c)) {
        lainnyaGroup!.categories.push(c);
      }
    });
  }

  return filteredGroups.length > 0 ? filteredGroups : groups;
}

export function getGroupedExpenseCategories(categoriesFromState?: Category[]): CategoryGroup[] {
  const groups: CategoryGroup[] = EXPENSE_CATEGORY_GROUPS.map((g) => ({
    groupName: g.groupName,
    categories: [...g.categories],
  }));

  if (!categoriesFromState || categoriesFromState.length === 0) {
    return groups;
  }

  const stateCats = categoriesFromState.filter((c) => c.tipe === 'Expense').map((c) => c.nama);
  if (stateCats.length === 0) return groups;

  const stateCatSet = new Set(stateCats);
  const knownSet = new Set<string>();

  const filteredGroups: CategoryGroup[] = groups.map((g) => {
    const presentInState = g.categories.filter((c) => stateCatSet.has(c));
    presentInState.forEach((c) => knownSet.add(c));
    return {
      groupName: g.groupName,
      categories: presentInState,
    };
  }).filter((g) => g.categories.length > 0);

  const customCats = stateCats.filter((c) => !knownSet.has(c));
  if (customCats.length > 0) {
    let lainnyaGroup = filteredGroups.find((g) => g.groupName === 'Lainnya');
    if (!lainnyaGroup) {
      lainnyaGroup = { groupName: 'Lainnya', categories: [] };
      filteredGroups.push(lainnyaGroup);
    }
    customCats.forEach((c) => {
      if (!lainnyaGroup!.categories.includes(c)) {
        lainnyaGroup!.categories.push(c);
      }
    });
  }

  return filteredGroups.length > 0 ? filteredGroups : groups;
}

export function getIncomeCategories(categoriesFromState?: Category[]): string[] {
  const groups = getGroupedIncomeCategories(categoriesFromState);
  return groups.flatMap((g) => g.categories);
}

export function getExpenseCategories(categoriesFromState?: Category[]): string[] {
  const groups = getGroupedExpenseCategories(categoriesFromState);
  return groups.flatMap((g) => g.categories);
}
