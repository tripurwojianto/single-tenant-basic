import React, { useState } from 'react';
import { 
  Home, 
  Megaphone, 
  Plus, 
  BarChart3, 
  Grid, 
  Building, 
  RefreshCw, 
  Rocket, 
  Headphones, 
  Award, 
  MessageSquare, 
  LogOut, 
  X,
  TrendingUp,
  TrendingDown,
  Box,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

interface BottomNavbarProps {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
  onOpenQuickAction: (action: 'income' | 'expense' | 'inventory' | 'announcement') => void;
  spreadsheetId?: string | null;
  isDemoMode?: boolean;
  syncError?: string | null;
  onReauthenticate?: () => void;
  onOpenGuide?: () => void;
  onOpenContact?: () => void;
  onOpenDeploy?: () => void;
  onLogout: () => void;
}

export default function BottomNavbar({
  activeMenu,
  setActiveMenu,
  onOpenQuickAction,
  spreadsheetId,
  isDemoMode,
  syncError,
  onReauthenticate,
  onOpenGuide,
  onOpenContact,
  onOpenDeploy,
  onLogout
}: BottomNavbarProps) {
  const [isPlusSheetOpen, setIsPlusSheetOpen] = useState(false);
  const [isLainnyaSheetOpen, setIsLainnyaSheetOpen] = useState(false);

  const handleSelectQuickAction = (action: 'income' | 'expense' | 'inventory' | 'announcement') => {
    setIsPlusSheetOpen(false);
    onOpenQuickAction(action);
  };

  const handleNavigateMenu = (menuKey: string) => {
    setActiveMenu(menuKey);
    setIsLainnyaSheetOpen(false);
    setIsPlusSheetOpen(false);
  };

  return (
    <>
      {/* STICKY BOTTOM NAVIGATION BAR (MATERIAL 3 DESIGN) */}
      <nav 
        id="bottom-navigation-bar"
        className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_25px_rgba(0,0,0,0.06)] no-print pb-safe"
      >
        <div className="max-w-md mx-auto h-16 px-3 flex items-center justify-between relative">
          
          {/* 1. DASHBOARD */}
          <button
            onClick={() => handleNavigateMenu('dashboard')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-1 transition-all cursor-pointer ${
              activeMenu === 'dashboard' ? 'text-emerald-600 font-extrabold' : 'text-slate-400 font-medium hover:text-slate-600'
            }`}
            id="bottom-nav-dashboard"
          >
            <Home className={`w-5 h-5 transition-transform ${activeMenu === 'dashboard' ? 'scale-110 text-emerald-600' : ''}`} />
            <span className="text-[10px] tracking-tight leading-none">Dashboard</span>
            {activeMenu === 'dashboard' && (
              <span className="w-1 h-1 rounded-full bg-emerald-600 mt-0.5 animate-pulse" />
            )}
          </button>

          {/* 2. INFO */}
          <button
            onClick={() => handleNavigateMenu('announcements')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-1 transition-all cursor-pointer ${
              activeMenu === 'announcements' || activeMenu === 'public-info' ? 'text-emerald-600 font-extrabold' : 'text-slate-400 font-medium hover:text-slate-600'
            }`}
            id="bottom-nav-info"
          >
            <Megaphone className={`w-5 h-5 transition-transform ${activeMenu === 'announcements' ? 'scale-110 text-emerald-600' : ''}`} />
            <span className="text-[10px] tracking-tight leading-none">Info</span>
            {activeMenu === 'announcements' && (
              <span className="w-1 h-1 rounded-full bg-emerald-600 mt-0.5 animate-pulse" />
            )}
          </button>

          {/* 3. TOMBOL TENGAH (+) - FLOATING ACTION BUTTON */}
          <div className="flex-1 flex items-center justify-center relative -top-5">
            <button
              onClick={() => {
                setIsLainnyaSheetOpen(false);
                setIsPlusSheetOpen(!isPlusSheetOpen);
              }}
              className="w-13 h-13 sm:w-14 sm:h-14 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-full shadow-lg shadow-emerald-600/35 ring-4 ring-white flex items-center justify-center transition-all cursor-pointer"
              title="Aksi Cepat Admin (+)"
              id="bottom-nav-fab"
            >
              <Plus className={`w-7 h-7 transition-transform duration-300 ${isPlusSheetOpen ? 'rotate-45' : ''}`} />
            </button>
          </div>

          {/* 4. LAPORAN */}
          <button
            onClick={() => handleNavigateMenu('reports')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-1 transition-all cursor-pointer ${
              activeMenu === 'reports' || activeMenu === 'cash-flow' ? 'text-emerald-600 font-extrabold' : 'text-slate-400 font-medium hover:text-slate-600'
            }`}
            id="bottom-nav-reports"
          >
            <BarChart3 className={`w-5 h-5 transition-transform ${activeMenu === 'reports' ? 'scale-110 text-emerald-600' : ''}`} />
            <span className="text-[10px] tracking-tight leading-none">Laporan</span>
            {activeMenu === 'reports' && (
              <span className="w-1 h-1 rounded-full bg-emerald-600 mt-0.5 animate-pulse" />
            )}
          </button>

          {/* 5. LAINNYA */}
          <button
            onClick={() => {
              setIsPlusSheetOpen(false);
              setIsLainnyaSheetOpen(!isLainnyaSheetOpen);
            }}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-1 transition-all cursor-pointer ${
              isLainnyaSheetOpen || ['mosque-info', 'feedback', 'inventory', 'portal-jamaah'].includes(activeMenu)
                ? 'text-emerald-600 font-extrabold' 
                : 'text-slate-400 font-medium hover:text-slate-600'
            }`}
            id="bottom-nav-more"
          >
            <Grid className={`w-5 h-5 transition-transform ${isLainnyaSheetOpen ? 'scale-110 text-emerald-600' : ''}`} />
            <span className="text-[10px] tracking-tight leading-none">Lainnya</span>
            {isLainnyaSheetOpen && (
              <span className="w-1 h-1 rounded-full bg-emerald-600 mt-0.5 animate-pulse" />
            )}
          </button>

        </div>
      </nav>

      {/* ------------------------------------------------------------- */}
      {/* 3A. BOTTOM SHEET MODERN: AKSI CEPAT (+ FAB SHEET) */}
      {/* ------------------------------------------------------------- */}
      {isPlusSheetOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/60 backdrop-blur-xs no-print animate-fade-in">
          {/* Backdrop Click */}
          <div className="flex-1" onClick={() => setIsPlusSheetOpen(false)} />

          <div className="bg-white rounded-t-[32px] p-6 shadow-2xl border-t border-slate-100 max-w-lg mx-auto w-full animate-slide-up">
            {/* Sheet Handle Indicator */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-5" />

            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-display font-black text-lg text-slate-900">Aksi Cepat Admin</h3>
                <p className="text-xs text-slate-500">Pilih jenis transaksi atau entri data baru</p>
              </div>
              <button
                onClick={() => setIsPlusSheetOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Action Options Grid */}
            <div className="grid grid-cols-2 gap-3.5 mb-2">
              {/* Option 1: Tambah Pemasukan */}
              <button
                onClick={() => handleSelectQuickAction('income')}
                className="p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-100 text-left transition-all active:scale-[0.98] cursor-pointer group flex flex-col justify-between min-h-[100px]"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform mb-3">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-emerald-950">Tambah Pemasukan</h4>
                  <p className="text-[10px] text-emerald-700/80 leading-tight mt-0.5">Infaq, sedekah, & donasi</p>
                </div>
              </button>

              {/* Option 2: Tambah Pengeluaran */}
              <button
                onClick={() => handleSelectQuickAction('expense')}
                className="p-4 rounded-2xl bg-rose-50 hover:bg-rose-100/80 border border-rose-100 text-left transition-all active:scale-[0.98] cursor-pointer group flex flex-col justify-between min-h-[100px]"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform mb-3">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-rose-950">Tambah Pengeluaran</h4>
                  <p className="text-[10px] text-rose-700/80 leading-tight mt-0.5">Operasional & belanja</p>
                </div>
              </button>

              {/* Option 3: Tambah Inventaris */}
              <button
                onClick={() => handleSelectQuickAction('inventory')}
                className="p-4 rounded-2xl bg-amber-50 hover:bg-amber-100/80 border border-amber-100 text-left transition-all active:scale-[0.98] cursor-pointer group flex flex-col justify-between min-h-[100px]"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform mb-3">
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-amber-950">Tambah Inventaris</h4>
                  <p className="text-[10px] text-amber-700/80 leading-tight mt-0.5">Aset & barang fasilitas</p>
                </div>
              </button>

              {/* Option 4: Tambah Pengumuman */}
              <button
                onClick={() => handleSelectQuickAction('announcement')}
                className="p-4 rounded-2xl bg-sky-50 hover:bg-sky-100/80 border border-sky-100 text-left transition-all active:scale-[0.98] cursor-pointer group flex flex-col justify-between min-h-[100px]"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform mb-3">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-sky-950">Tambah Pengumuman</h4>
                  <p className="text-[10px] text-sky-700/80 leading-tight mt-0.5">Kabar DKM & agenda jemaah</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5A. BOTTOM SHEET MODERN: MENU LAINNYA */}
      {/* ------------------------------------------------------------- */}
      {isLainnyaSheetOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/60 backdrop-blur-xs no-print animate-fade-in">
          {/* Backdrop Click */}
          <div className="flex-1" onClick={() => setIsLainnyaSheetOpen(false)} />

          <div className="bg-white rounded-t-[32px] p-6 shadow-2xl border-t border-slate-100 max-w-lg mx-auto w-full max-h-[85vh] overflow-y-auto animate-slide-up">
            {/* Sheet Handle Indicator */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-5" />

            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-display font-black text-lg text-slate-900">Menu & Pengaturan</h3>
                <p className="text-xs text-slate-500">Kelola akun, sinkronisasi, dan fitur tambahan</p>
              </div>
              <button
                onClick={() => setIsLainnyaSheetOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List Menu Sekunder */}
            <div className="space-y-2">
              
              {/* 1. Profil Tempat Ibadah */}
              <button
                onClick={() => handleNavigateMenu('mosque-info')}
                className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/80 border border-slate-100 hover:border-emerald-200 flex items-center justify-between transition-all active:scale-[0.99] cursor-pointer text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-950">Profil Tempat Ibadah</h4>
                    <p className="text-[11px] text-slate-500">Identitas, pengurus, & alamat masjid</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
              </button>

              {/* 2. Sinkronisasi Google Sheets */}
              <button
                onClick={() => {
                  setIsLainnyaSheetOpen(false);
                  if (syncError && onReauthenticate) {
                    onReauthenticate();
                  } else if (spreadsheetId) {
                    window.open(`https://docs.google.com/spreadsheets/d/${spreadsheetId}`, '_blank');
                  } else if (onOpenDeploy) {
                    onOpenDeploy();
                  }
                }}
                className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/80 border border-slate-100 hover:border-emerald-200 flex items-center justify-between transition-all active:scale-[0.99] cursor-pointer text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    syncError ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {syncError ? <AlertTriangle className="w-5 h-5 text-amber-600" /> : <FileSpreadsheet className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-950">
                      Sinkronisasi Google Sheets
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {syncError ? 'Perlu diperbarui (Klik untuk hubungkan kembali)' : spreadsheetId ? 'Terhubung (Buka Google Drive)' : 'Menggunakan Penyimpanan Lokal'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
              </button>

              {/* 3. Deploy Mandiri */}
              <button
                onClick={() => {
                  setIsLainnyaSheetOpen(false);
                  if (onOpenDeploy) onOpenDeploy();
                }}
                className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/80 border border-slate-100 hover:border-emerald-200 flex items-center justify-between transition-all active:scale-[0.99] cursor-pointer text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                    <Rocket className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-950">Deploy Mandiri</h4>
                    <p className="text-[11px] text-slate-500">Panduan & aktivasi gratis selamanya</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
              </button>

              {/* 4. Pendampingan Deployment */}
              <button
                onClick={() => {
                  setIsLainnyaSheetOpen(false);
                  if (onOpenContact) onOpenContact();
                }}
                className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/80 border border-slate-100 hover:border-emerald-200 flex items-center justify-between transition-all active:scale-[0.99] cursor-pointer text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-950">Pendampingan Deployment</h4>
                    <p className="text-[11px] text-slate-500">Bantuan teknis dari tim pengembang</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
              </button>

              {/* 5. Membership & Fitur Tambahan */}
              <button
                onClick={() => handleNavigateMenu('portal-jamaah')}
                className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/80 border border-slate-100 hover:border-emerald-200 flex items-center justify-between transition-all active:scale-[0.99] cursor-pointer text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-950">Membership & Pro Features</h4>
                    <p className="text-[11px] text-slate-500">QRIS, WhatsApp, & Portal Jamaah</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
              </button>

              {/* 6. Feedback */}
              <button
                onClick={() => handleNavigateMenu('feedback')}
                className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/80 border border-slate-100 hover:border-emerald-200 flex items-center justify-between transition-all active:scale-[0.99] cursor-pointer text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-950">Feedback & Saran</h4>
                    <p className="text-[11px] text-slate-500">Kirim masukan untuk pengembangan app</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
              </button>

              {/* 7. Logout */}
              <div className="pt-3 border-t border-slate-100 mt-2">
                <button
                  onClick={() => {
                    setIsLainnyaSheetOpen(false);
                    onLogout();
                  }}
                  className="w-full p-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-700 font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>Logout dari Sesi</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
