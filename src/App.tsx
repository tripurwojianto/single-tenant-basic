/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { MosqueState, MosqueInfo, CashTransaction, InventoryItem, Announcement, Category, FeedbackData } from './types';
import { initAuth, googleSignIn, logout, setAccessToken } from './lib/firebase';
import { findSpreadsheet, createSpreadsheet, fetchSpreadsheetData, saveMosqueInfo, saveIncomes, saveExpenses, saveInventory, saveAnnouncements, saveCategories, saveFeedback } from './lib/googleSheets';
import { INITIAL_MOCK_DATA } from './data/mockData';

// Views
import LandingPage from './components/LandingPage';
import OnboardingWizard from './components/OnboardingWizard';
import DashboardView from './components/DashboardView';
import MosqueInfoView from './components/MosqueInfoView';
import CashFlowView from './components/CashFlowView';
import InventoryView from './components/InventoryView';
import AnnouncementsView from './components/AnnouncementsView';
import ReportsView from './components/ReportsView';
import FeedbackView from './components/FeedbackView';
import FeaturePreviewView from './components/FeaturePreviewView';

// Icons
import { 
  LayoutGrid, Building, TrendingUp, Box, Megaphone, FileText, 
  MessageSquare, LogOut, Menu, X, User as UserIcon, Loader2,
  FileSpreadsheet, AlertCircle, Info, Sparkles,
  Users, Smartphone, Receipt, Globe, HeartHandshake, QrCode
} from 'lucide-react';

export default function App() {
  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);

  // App data state
  const [state, setState] = useState<MosqueState>({
    info: { namaMasjid: '', logo: '', tagline: '', alamat: '', kota: '', whatsApp: '', email: '', website: '', profilSingkat: '' },
    incomes: [],
    expenses: [],
    inventory: [],
    announcements: [],
    categories: [],
    feedbacks: []
  });

  // Spreadsheet state
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(null);
  const [isInitializingSheet, setIsInitializingSheet] = useState(false);
  const [sheetLoadingError, setSheetLoadingError] = useState<string | null>(null);

  // UI state
  const [activeMenu, setActiveMenu] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Initial Auth listener on app mount
  useEffect(() => {
    initAuth(
      (currentUser, cachedToken) => {
        setUser(currentUser);
        setToken(cachedToken);
        setNeedsAuth(false);
        handleSpreadsheetSync(cachedToken);
        const onboarded = localStorage.getItem(`kasmasjid_onboarded_${currentUser.uid}`);
        if (onboarded !== 'true') {
          setIsOnboarding(true);
        }
      },
      () => {
        setNeedsAuth(true);
      }
    );
  }, []);

  // Sync / find Google Sheet
  const handleSpreadsheetSync = async (accessToken: string) => {
    setIsInitializingSheet(true);
    setSheetLoadingError(null);
    try {
      let sheetId = await findSpreadsheet(accessToken);
      if (!sheetId) {
        // Automatic creation
        sheetId = await createSpreadsheet(accessToken);
      }
      setSpreadsheetId(sheetId);
      
      // Load data
      const data = await fetchSpreadsheetData(accessToken, sheetId);
      setState(data);
    } catch (err: any) {
      console.error(err);
      setSheetLoadingError(err.message || 'Gagal menyinkronkan database dengan Google Sheets');
    } finally {
      setIsInitializingSheet(false);
    }
  };

  // Google Login click
  const handleLogin = async () => {
    setIsLoggingIn(true);
    setSheetLoadingError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        setNeedsAuth(false);
        setIsDemoMode(false);
        setIsOnboarding(true);
        await handleSpreadsheetSync(result.accessToken);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      alert('Login Gagal: ' + (err.message || 'Periksa koneksi internet Anda'));
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Demo mode click
  const handleStartDemo = () => {
    setIsDemoMode(true);
    setNeedsAuth(false);
    setState(INITIAL_MOCK_DATA);
  };

  // Logout click
  const handleLogout = async () => {
    if (isDemoMode) {
      setIsDemoMode(false);
      setNeedsAuth(true);
      return;
    }
    const confirmLogout = window.confirm('Apakah Anda yakin ingin keluar dari akun administrasi?');
    if (!confirmLogout) return;

    try {
      await logout();
      setUser(null);
      setToken(null);
      setSpreadsheetId(null);
      setNeedsAuth(true);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleCancelOnboarding = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout during onboarding cancel failed:', err);
    }
    setUser(null);
    setToken(null);
    setSpreadsheetId(null);
    setIsOnboarding(false);
    setNeedsAuth(true);
  };

  const handleOnboardingComplete = async (info: MosqueInfo, deploymentMode: string) => {
    try {
      await handleSaveMosqueInfo(info);
      if (user) {
        localStorage.setItem(`kasmasjid_onboarded_${user.uid}`, 'true');
      }
      setIsOnboarding(false);
    } catch (err) {
      console.error('Failed to complete onboarding:', err);
      setIsOnboarding(false);
    }
  };

  // --- DATA MUTATION ACTIONS ---

  // Update Mosque profile
  const handleSaveMosqueInfo = async (info: MosqueInfo) => {
    if (isDemoMode) {
      setState(prev => ({ ...prev, info }));
      return;
    }
    if (!token || !spreadsheetId) throw new Error('Akses Google Sheets tidak valid');
    await saveMosqueInfo(token, spreadsheetId, info);
    setState(prev => ({ ...prev, info }));
  };

  // Add category
  const handleAddCategory = async (category: Category) => {
    const updatedCategories = [...state.categories, category];
    if (isDemoMode) {
      setState(prev => ({ ...prev, categories: updatedCategories }));
      return;
    }
    if (!token || !spreadsheetId) throw new Error('Akses Google Sheets tidak valid');
    await saveCategories(token, spreadsheetId, updatedCategories);
    setState(prev => ({ ...prev, categories: updatedCategories }));
  };

  // Add Cash Transaction
  const handleAddTransaction = async (tipe: 'Income' | 'Expense', data: Omit<CashTransaction, 'id'>) => {
    const newTx: CashTransaction = {
      id: `${tipe.toLowerCase()}-${Date.now()}`,
      ...data
    };

    if (tipe === 'Income') {
      const updated = [...state.incomes, newTx];
      if (isDemoMode) {
        setState(prev => ({ ...prev, incomes: updated }));
        return;
      }
      if (!token || !spreadsheetId) throw new Error('Akses Google Sheets tidak valid');
      await saveIncomes(token, spreadsheetId, updated);
      setState(prev => ({ ...prev, incomes: updated }));
    } else {
      const updated = [...state.expenses, newTx];
      if (isDemoMode) {
        setState(prev => ({ ...prev, expenses: updated }));
        return;
      }
      if (!token || !spreadsheetId) throw new Error('Akses Google Sheets tidak valid');
      await saveExpenses(token, spreadsheetId, updated);
      setState(prev => ({ ...prev, expenses: updated }));
    }
  };

  // Edit Cash Transaction
  const handleEditTransaction = async (tipe: 'Income' | 'Expense', id: string, data: Omit<CashTransaction, 'id'>) => {
    if (tipe === 'Income') {
      const updated = state.incomes.map(item => item.id === id ? { id, ...data } : item);
      if (isDemoMode) {
        setState(prev => ({ ...prev, incomes: updated }));
        return;
      }
      if (!token || !spreadsheetId) throw new Error('Akses Google Sheets tidak valid');
      await saveIncomes(token, spreadsheetId, updated);
      setState(prev => ({ ...prev, incomes: updated }));
    } else {
      const updated = state.expenses.map(item => item.id === id ? { id, ...data } : item);
      if (isDemoMode) {
        setState(prev => ({ ...prev, expenses: updated }));
        return;
      }
      if (!token || !spreadsheetId) throw new Error('Akses Google Sheets tidak valid');
      await saveExpenses(token, spreadsheetId, updated);
      setState(prev => ({ ...prev, expenses: updated }));
    }
  };

  // Delete Cash Transaction
  const handleDeleteTransaction = async (tipe: 'Income' | 'Expense', id: string) => {
    if (tipe === 'Income') {
      const updated = state.incomes.filter(item => item.id !== id);
      if (isDemoMode) {
        setState(prev => ({ ...prev, incomes: updated }));
        return;
      }
      if (!token || !spreadsheetId) throw new Error('Akses Google Sheets tidak valid');
      await saveIncomes(token, spreadsheetId, updated);
      setState(prev => ({ ...prev, incomes: updated }));
    } else {
      const updated = state.expenses.filter(item => item.id !== id);
      if (isDemoMode) {
        setState(prev => ({ ...prev, expenses: updated }));
        return;
      }
      if (!token || !spreadsheetId) throw new Error('Akses Google Sheets tidak valid');
      await saveExpenses(token, spreadsheetId, updated);
      setState(prev => ({ ...prev, expenses: updated }));
    }
  };

  // Add Inventory
  const handleAddInventory = async (item: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      ...item
    };
    const updated = [...state.inventory, newItem];
    if (isDemoMode) {
      setState(prev => ({ ...prev, inventory: updated }));
      return;
    }
    if (!token || !spreadsheetId) throw new Error('Akses Google Sheets tidak valid');
    await saveInventory(token, spreadsheetId, updated);
    setState(prev => ({ ...prev, inventory: updated }));
  };

  // Edit Inventory
  const handleEditInventory = async (id: string, item: Omit<InventoryItem, 'id'>) => {
    const updated = state.inventory.map(old => old.id === id ? { id, ...item } : old);
    if (isDemoMode) {
      setState(prev => ({ ...prev, inventory: updated }));
      return;
    }
    if (!token || !spreadsheetId) throw new Error('Akses Google Sheets tidak valid');
    await saveInventory(token, spreadsheetId, updated);
    setState(prev => ({ ...prev, inventory: updated }));
  };

  // Delete Inventory
  const handleDeleteInventory = async (id: string) => {
    const updated = state.inventory.filter(old => old.id !== id);
    if (isDemoMode) {
      setState(prev => ({ ...prev, inventory: updated }));
      return;
    }
    if (!token || !spreadsheetId) throw new Error('Akses Google Sheets tidak valid');
    await saveInventory(token, spreadsheetId, updated);
    setState(prev => ({ ...prev, inventory: updated }));
  };

  // Add Announcement
  const handleAddAnnouncement = async (ann: Omit<Announcement, 'id'>) => {
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      ...ann
    };
    const updated = [...state.announcements, newAnn];
    if (isDemoMode) {
      setState(prev => ({ ...prev, announcements: updated }));
      return;
    }
    if (!token || !spreadsheetId) throw new Error('Akses Google Sheets tidak valid');
    await saveAnnouncements(token, spreadsheetId, updated);
    setState(prev => ({ ...prev, announcements: updated }));
  };

  // Edit Announcement
  const handleEditAnnouncement = async (id: string, ann: Omit<Announcement, 'id'>) => {
    const updated = state.announcements.map(old => old.id === id ? { id, ...ann } : old);
    if (isDemoMode) {
      setState(prev => ({ ...prev, announcements: updated }));
      return;
    }
    if (!token || !spreadsheetId) throw new Error('Akses Google Sheets tidak valid');
    await saveAnnouncements(token, spreadsheetId, updated);
    setState(prev => ({ ...prev, announcements: updated }));
  };

  // Delete Announcement
  const handleDeleteAnnouncement = async (id: string) => {
    const updated = state.announcements.filter(old => old.id !== id);
    if (isDemoMode) {
      setState(prev => ({ ...prev, announcements: updated }));
      return;
    }
    if (!token || !spreadsheetId) throw new Error('Akses Google Sheets tidak valid');
    await saveAnnouncements(token, spreadsheetId, updated);
    setState(prev => ({ ...prev, announcements: updated }));
  };

  // Send Feedback
  const handleSendFeedback = async (feedback: FeedbackData) => {
    if (isDemoMode) {
      setState(prev => ({ ...prev, feedbacks: [...prev.feedbacks, feedback] }));
      return;
    }
    if (!token || !spreadsheetId) throw new Error('Akses Google Sheets tidak valid');
    await saveFeedback(token, spreadsheetId, feedback);
    setState(prev => ({ ...prev, feedbacks: [...prev.feedbacks, feedback] }));
  };

  // --- RENDERING ROUTER ---

  if (needsAuth) {
    return (
      <LandingPage 
        onStartDemo={handleStartDemo} 
        onLogin={handleLogin} 
        isLoggingIn={isLoggingIn} 
      />
    );
  }

  if (isOnboarding && user) {
    return (
      <OnboardingWizard
        user={user}
        onComplete={handleOnboardingComplete}
        onCancel={handleCancelOnboarding}
        syncSpreadsheet={() => handleSpreadsheetSync(token!)}
        isSyncing={isInitializingSheet}
        syncError={sheetLoadingError}
      />
    );
  }

  const menuItems = [
    // BASIC
    { key: 'dashboard', label: 'Dashboard', icon: LayoutGrid, tier: 'BASIC' },
    { key: 'mosque-info', label: 'Informasi Masjid', icon: Building, tier: 'BASIC' },
    { key: 'cash-flow', label: 'Arus Kas Ledger', icon: TrendingUp, tier: 'BASIC' },
    { key: 'inventory', label: 'Daftar Inventaris', icon: Box, tier: 'BASIC' },
    { key: 'announcements', label: 'Komposer Pengumuman', icon: Megaphone, tier: 'BASIC' },
    { key: 'reports', label: 'Ringkasan Laporan', icon: FileText, tier: 'BASIC' },
    { key: 'feedback', label: 'Kirim Feedback', icon: MessageSquare, tier: 'BASIC' },
    
    // PRO
    { key: 'whatsapp-notif', label: 'Notifikasi WhatsApp', icon: Smartphone, tier: 'PRO' },
    { key: 'thermal-print', label: 'Cetak Struk Termal', icon: Receipt, tier: 'PRO' },
    { key: 'multi-admin', label: 'Multi-Admin Kolaborasi', icon: Users, tier: 'PRO' },

    // MEMBERSHIP
    { key: 'portal-jamaah', label: 'Portal Jamaah', icon: Globe, tier: 'MEMBERSHIP' },
    { key: 'zakat-digital', label: 'Zakat & Shodaqoh', icon: HeartHandshake, tier: 'MEMBERSHIP' },
    { key: 'infaq-qris', label: 'Infaq QRIS Mandiri', icon: QrCode, tier: 'MEMBERSHIP' },
  ] as const;

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col font-sans selection:bg-emerald-100">
      
      {/* Demo Mode Notification Bar */}
      {isDemoMode && (
        <div className="bg-slate-900 text-slate-100 px-4 sm:px-8 py-3.5 text-xs font-semibold flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md z-50 sticky top-0 shrink-0 no-print border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <span className="text-slate-300">
              Anda sedang berada di <strong className="text-white">Mode Demo</strong>. Data yang Anda ubah hanya disimpan sementara di memori browser.
            </span>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <button 
              onClick={() => {
                setIsDemoMode(false);
                setNeedsAuth(true);
              }}
              className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 font-bold cursor-pointer"
            >
              ← Kembali ke Landing
            </button>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <button 
              onClick={handleLogin}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              Mulai Gunakan →
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex min-w-0">
        {/* Sidebar Wrapper Desktop */}
        <aside 
          id="sidebar"
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-emerald-900 border-r border-emerald-800 flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static shrink-0 no-print ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div>
          {/* Logo brand */}
          <div className="h-20 px-6 border-b border-emerald-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-emerald-400 rounded-lg flex items-center justify-center font-bold text-emerald-900 italic">KM</div>
              <div>
                <span className="font-display font-bold text-base text-white tracking-tight uppercase block">KasMasjid</span>
                <span className="text-[9px] font-semibold text-emerald-400 uppercase tracking-[0.2em] block leading-none">Basic Edition</span>
              </div>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="w-7 h-7 rounded-lg hover:bg-emerald-800 text-emerald-200 flex items-center justify-center lg:hidden cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Menus */}
          <nav className="p-4 space-y-2 mt-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeMenu === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setActiveMenu(item.key);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-emerald-800 text-white font-bold shadow-xs'
                      : 'text-emerald-100/80 hover:text-white hover:bg-emerald-800/50'
                  }`}
                >
                  <IconComponent className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-emerald-300' : 'text-emerald-400'}`} />
                  <span className="truncate text-left flex-1">{item.label}</span>
                  {item.tier !== 'BASIC' && (
                    <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider shrink-0 border ${
                      item.tier === 'PRO' 
                        ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' 
                        : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                    }`}>
                      {item.tier === 'MEMBERSHIP' ? 'MEMB' : item.tier}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User context footer in sidebar */}
        <div className="p-4 mt-auto border-t border-emerald-800">
          <div className="bg-emerald-800/50 p-4 rounded-2xl flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-900 font-bold uppercase text-xs border border-emerald-200 shrink-0">
              {isDemoMode ? 'D' : (user?.email ? user.email.substring(0, 2).toUpperCase() : 'BA')}
            </div>
            <div className="truncate min-w-0">
              <p className="text-xs font-semibold text-white leading-none truncate">
                {isDemoMode ? 'Bendahara Demo' : (user?.displayName || 'Bendahara Masjid')}
              </p>
              <p className="text-[10px] text-emerald-400 mt-1 uppercase truncate leading-none">
                {isDemoMode ? 'Administrator' : (user?.email || 'Administrator')}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-4 text-xs font-bold text-emerald-200 hover:text-white hover:bg-emerald-800 border border-emerald-800 hover:border-emerald-700 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-emerald-300" />
            Keluar Panel
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* Top Navbar */}
        <header className="h-20 border-b border-slate-200 bg-white flex items-center justify-between px-6 sm:px-8 shrink-0 no-print">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-600 lg:hidden cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-slate-800 tracking-tight font-display">
                {state.info.namaMasjid || 'Masjid Al-Ikhlas'}
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider truncate max-w-[160px] sm:max-w-md">
                {state.info.alamat ? `${state.info.alamat}${state.info.kota ? ', ' + state.info.kota : ''}` : 'Jl. Merdeka No. 45, Bandung'} • Basic Edition
              </p>
            </div>
          </div>

          {/* Mode Badge & Google Sheets Link */}
          <div className="flex items-center gap-4">
            {isDemoMode ? (
              <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-amber-600" />
                Mode Demo
              </div>
            ) : spreadsheetId ? (
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Status Sinkronisasi</span>
                <a 
                  href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}`}
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Buka Berkas Google Sheets Databasenya"
                >
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  Google Sheets Connected
                </a>
              </div>
            ) : (
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-sans">Status Sinkron</span>
                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span> Disconnected
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          
          {/* Main Loading states */}
          {isInitializingSheet ? (
            <div className="h-96 flex flex-col items-center justify-center text-slate-500 space-y-4">
              <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
              <div className="text-center">
                <p className="font-semibold text-slate-700">Menyinkronkan Basis Data Google Sheets...</p>
                <p className="text-xs text-slate-400 mt-0.5">Memeriksa struktur spreadsheet 'KasMasjid Database' di Google Drive Anda.</p>
              </div>
            </div>
          ) : sheetLoadingError ? (
            <div className="max-w-md mx-auto py-12 text-center bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-bold text-lg text-slate-900">Sinkronisasi Database Gagal</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Gagal menghubungi Google Drive API. Hal ini biasanya terjadi karena token akses Google telah kedaluwarsa atau izin Drive ditarik.
                </p>
                <div className="p-3 bg-slate-50 rounded-xl text-left border border-slate-100 font-mono text-[10px] text-slate-600 overflow-x-auto max-h-24">
                  {sheetLoadingError}
                </div>
              </div>
              <button
                onClick={() => handleSpreadsheetSync(token!)}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-all cursor-pointer shadow-sm"
              >
                Coba Sinkron Ulang
              </button>
            </div>
          ) : (
            // VIEW CONTROLLER
            <>
              {activeMenu === 'dashboard' && (
                <DashboardView 
                  state={state} 
                  onAddIncome={(income) => handleAddTransaction('Income', income)}
                  onAddExpense={(expense) => handleAddTransaction('Expense', expense)}
                  onAddInventory={handleAddInventory}
                  onAddAnnouncement={handleAddAnnouncement}
                />
              )}

              {activeMenu === 'mosque-info' && (
                <MosqueInfoView 
                  info={state.info} 
                  onSave={handleSaveMosqueInfo} 
                />
              )}

              {activeMenu === 'cash-flow' && (
                <CashFlowView 
                  state={state} 
                  onAddTransaction={handleAddTransaction}
                  onEditTransaction={handleEditTransaction}
                  onDeleteTransaction={handleDeleteTransaction}
                  onAddCategory={handleAddCategory}
                />
              )}

              {activeMenu === 'inventory' && (
                <InventoryView 
                  state={state} 
                  onAddInventory={handleAddInventory}
                  onEditInventory={handleEditInventory}
                  onDeleteInventory={handleDeleteInventory}
                />
              )}

              {activeMenu === 'announcements' && (
                <AnnouncementsView 
                  state={state} 
                  onAddAnnouncement={handleAddAnnouncement}
                  onEditAnnouncement={handleEditAnnouncement}
                  onDeleteAnnouncement={handleDeleteAnnouncement}
                />
              )}

              {activeMenu === 'reports' && (
                <ReportsView state={state} />
              )}

              {activeMenu === 'feedback' && (
                <FeedbackView onSendFeedback={handleSendFeedback} />
              )}

              {['whatsapp-notif', 'thermal-print', 'multi-admin', 'portal-jamaah', 'zakat-digital', 'infaq-qris'].includes(activeMenu) && (
                <FeaturePreviewView 
                  featureKey={activeMenu}
                  onBackToDemo={() => setActiveMenu('dashboard')}
                  onUpgradeClick={handleLogin}
                />
              )}
            </>
          )}

        </main>

        {/* Simplified Dashboard Footer */}
        <footer className="py-6 px-8 border-t border-slate-200/60 bg-white text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 no-print">
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
      </div>

    </div>
  </div>
  );
}
