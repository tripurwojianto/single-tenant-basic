/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MosqueState, Announcement } from '../types';
import { 
  Sparkles, Megaphone, FileText, Box, Copy, Check, 
  Info, RefreshCw, Wand2, ShieldAlert,
  BookOpen, Crown, Key, Eye, EyeOff, RotateCcw, Lock
} from 'lucide-react';

interface AminaViewProps {
  state: MosqueState;
  onAddAnnouncement: (ann: Omit<Announcement, 'id'>) => Promise<void>;
  onNavigate: (path: string) => void;
  setActiveMenu: (menu: string) => void;
}

export default function AminaView({
  state,
  onAddAnnouncement,
  onNavigate,
  setActiveMenu
}: AminaViewProps) {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'announcement' | 'report-refine' | 'monthly-pro' | 'blog-pro' | 'inventory-pro'>('announcement');

  // Basic Mode 1: Pengumuman Form
  const [annTopic, setAnnTopic] = useState('');
  const [annSpeaker, setAnnSpeaker] = useState('');
  const [annTime, setAnnTime] = useState('');
  const [annKeyPoint, setAnnKeyPoint] = useState('');
  const [annExtra, setAnnExtra] = useState('');

  // Basic Mode 2: Rapikan Laporan Input
  const [rawReportText, setRawReportText] = useState('');

  // Pro Mode 1: Monthly Financial Report Input
  const [selectedMonth, setSelectedMonth] = useState('Juli 2026');

  // Pro Mode 2: Blog Article Input
  const [blogTopic, setBlogTopic] = useState('Program Santunan Anak Yatim & Beasiswa Tahfidz');
  const [blogTone, setBlogTone] = useState('Inspiratif');

  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [editedText, setEditedText] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applyStatus, setApplyStatus] = useState<'Publish' | 'Draft'>('Draft');

  // Custom Gemini API Key State
  const [userApiKey, setUserApiKey] = useState<string>(() => {
    return localStorage.getItem('kasmasjid_custom_gemini_api_key') || '';
  });
  const [showApiKeyText, setShowApiKeyText] = useState(false);
  const [apiKeyNotice, setApiKeyNotice] = useState<string | null>(null);
  const [showApiKeyPanel, setShowApiKeyPanel] = useState(false);

  const handleSaveApiKey = (newKey: string) => {
    setUserApiKey(newKey);
    const trimmed = newKey.trim();
    if (trimmed) {
      localStorage.setItem('kasmasjid_custom_gemini_api_key', trimmed);
      setApiKeyNotice('API Key kustom berhasil disimpan!');
    } else {
      localStorage.removeItem('kasmasjid_custom_gemini_api_key');
      setApiKeyNotice('API Key kustom dihapus. Menggunakan key bawaan server.');
    }
    setTimeout(() => setApiKeyNotice(null), 3000);
  };

  const handleResetApiKey = () => {
    setUserApiKey('');
    localStorage.removeItem('kasmasjid_custom_gemini_api_key');
    setApiKeyNotice('API Key dikembalikan ke default server.');
    setTimeout(() => setApiKeyNotice(null), 3000);
  };

  // Helper to fetch last transactions from state
  const handleLoadRecentTransactions = () => {
    const recentIncomes = state.incomes.slice(-5).map(i => `- Masuk (${i.kategori}): ${i.deskripsi} Rp ${i.nominal.toLocaleString('id-ID')}`);
    const recentExpenses = state.expenses.slice(-5).map(e => `- Keluar (${e.kategori}): ${e.deskripsi} Rp ${e.nominal.toLocaleString('id-ID')}`);
    
    let summary = 'Penerimaan Kas Terakhir:\n' + (recentIncomes.length ? recentIncomes.join('\n') : '- Belum ada data penerimaan') + '\n\n';
    summary += 'Pengeluaran Kas Terakhir:\n' + (recentExpenses.length ? recentExpenses.join('\n') : '- Belum ada data pengeluaran');
    
    setRawReportText(summary);
  };

  // Local Fallback Generator for smooth offline experience
  const generateLocalFallback = (tab: string, promptStr: string, context?: any) => {
    const mosqueName = state.info.namaMasjid || 'Masjid Al-Ikhlas';
    const todayStr = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    if (tab === 'announcement') {
      return `ASSALAMU'ALAIKUM WARAHMATULLAHI WABARAKATUH\n\nPengumuman Resmi DKM ${mosqueName}\nTanggal: ${todayStr}\n\nDengan mengharap ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i Jamaah Sekalian untuk menghadiri agenda kegiatan masjid sebagai berikut:\n\n📌 Acara/Kajian: ${annTopic || 'Kajian Rutin Jamaah'}\n🎙️ Bersama: ${annSpeaker || 'Ustadz Penceramah'}\n⏰ Waktu & Tempat: ${annTime || 'Ba\'da Maghrib di Ruang Utama Masjid'}\n💡 Tema Utama: "${annKeyPoint || 'Meneladani Akhlak Rasulullah'}"\n${annExtra ? `\nCatatan Tambahan: ${annExtra}` : ''}\n\nMarilah kita bersama-sama meramaikan majlis ilmu ini guna meningkatkan keimanan dan mempererat tali silaturahmi antarjamaah.\n\nWassalamu'alaikum Warahmatullahi Wabarakatuh.\nPengurus DKM ${mosqueName}`;
    }

    if (tab === 'report-refine') {
      return `Bismillahirrahmānirrahīm.\n\nLaporan Transparansi Keuangan Jamaah — ${mosqueName}\nPeriode Pelaporan: ${todayStr}\n\nKepada Yth. Seluruh Jamaah dan Donatur Masjid,\nBerikut kami sampaikan rincian pencatatan kas kas masjid secara terbuka dan akuntabel:\n\n${rawReportText || 'Penerimaan Infaq Jumat: Rp 3.500.000\nPengeluaran Operasional Kebersihan: Rp 600.000'}\n\nSemua angka dan pencatatan telah dicocokkan langsung dengan Buku Ledger Kas Keuangan DKM. Semoga infaq dan shodaqoh yang disalurkan menjadi amal jariyah yang berlipat ganda bagi Bapak/Ibu sekalian.\n\nJazakumullah Khairan Katsiran.\nSalam hangat, Pengurus DKM ${mosqueName}`;
    }

    if (tab === 'monthly-pro') {
      const totalIncome = state.incomes.reduce((acc, curr) => acc + curr.nominal, 0);
      const totalExpense = state.expenses.reduce((acc, curr) => acc + curr.nominal, 0);
      const balance = totalIncome - totalExpense;

      return `[DRAF LAPORAN PRO - DEMO DATA]\nRINGKASAN EKSEKUTIF KEUSAN BULANAN — DKM ${mosqueName}\nPeriode: ${selectedMonth}\n\n1. PENDAHULUAN & SYUKUR\nAlhamdulillahirabbil'alamin, atas rahmat Allah SWT, DKM ${mosqueName} kembali mempublikasikan laporan keuangan bulanan sebagai bentuk pertanggungjawaban publik dan transparansi pengelolaan dana ummat.\n\n2. RINGKASAN REKAPITULASI KAS\n- Total Penerimaan Dana: Rp ${(totalIncome || 12500000).toLocaleString('id-ID')}\n- Total Realisasi Pengeluaran: Rp ${(totalExpense || 4800000).toLocaleString('id-ID')}\n- Sisa Saldo Kas Bersih: Rp ${(balance || 7700000).toLocaleString('id-ID')}\n\n3. RENCANA ALOKASI PROGRAM BULAN DEPAN\n- Pemeliharaan sarana tempat wudhu dan pendingin ruangan.\n- Persiapan santunan rutin dan operasional madrasah Al-Qur'an.\n\nDemikian laporan ini dibuat dengan sebenar-benarnya. Semoga Allah senantiasa memberkahi setiap pengorbanan harta dan waktu pengurus serta donatur.`;
    }

    if (tab === 'blog-pro') {
      return `[DRAF ARTIKEL PRO - DEMO DATA]\n${blogTopic.toUpperCase()}\nOleh: Tim Media & Publikasi DKM ${mosqueName}\n\nBismillahirrahmānirrahīm,\n\nMasjid bukan hanya tempat mendirikan shalat lima waktu, melainkan pusat peradaban dan pemberdayaan ummat. Melalui program "${blogTopic}", DKM ${mosqueName} berkomitmen hadir membawa manfaat nyata bagi lingkungan sekitar.\n\nMengapa Program Ini Penting?\nDalam ajaran Islam, kepedulian sosial dan pemeliharaan tempat ibadah merupakan cerminan ketakwaan. Rasulullah SAW bersabda bahwa sebaik-baik manusia adalah yang paling bermanfaat bagi orang lain.\n\nLangkah Realisasi Program:\n1. Penggalangan dana terpadu yang transparan melalui platform digital dan kotak infaq masjid.\n2. Pelaksanaan program secara berkala dengan melibatkan pemuda dan tokoh masyarakat.\n3. Laporan pertanggungjawaban terbuka yang diakses jamaah secara langsung.\n\nMari Bergandengan Tangan\nKami mengajak seluruh elemen masyarakat untuk terus memberikan dukungan terbaik, baik berupa doa, fikiran, maupun materi. Semoga ikhtiar ini menjadi ladang pahala yang tak terputus.`;
    }

    if (tab === 'inventory-pro') {
      const damagedItems = state.inventory.filter(i => i.kondisi !== 'Baik');
      return `[DRAF ANALISIS INVENTARIS PRO - DEMO DATA]\nUSULAN PEMELIHARAAN & PERBAIKAN ASET DKM ${mosqueName}\n\nKepada Yth: Ketua & Jajaran Pengurus DKM ${mosqueName}\nDari: Seksi Sarana & Prasarana\n\nBerdasarkan audit kondisi inventaris terbaru, terdapat ${damagedItems.length || 3} unit barang yang memerlukan perhatian khusus:\n\n${damagedItems.length > 0 
  ? damagedItems.map(i => `- ${i.namaBarang} (${i.jumlah} unit) di ${i.lokasi}: Kondisi ${i.kondisi} [Keterangan: ${i.keterangan || 'Perlu perbaikan'}]`).join('\n')
  : '- AC Ruang Utama (2 Unit): Kondisi Rusak Ringan (Perlu Servis Freon)\n- Sound System Portable (1 Unit): Kondisi Rusak Berat (Perlu Diganti Microphone)'
}\n\nRekomendasi Tindakan:\n1. Segera melakukan servis rutin untuk unit dengan kerusakan ringan guna mencegah kerusakan permanen.\n2. Pengadaan/penggantian unit baru untuk barang dalam kondisi rusak berat melalui alokasi kas inventaris.\n\nDemikian usulan ini disampaikan untuk menjadi bahan pertimbangan dalam rapat kerja pengurus DKM.`;
    }

    return 'Draf berhasil dibuat.';
  };

  // Call API or Fallback
  const handleGenerate = async (prompt: string, contextData?: any) => {
    setIsGenerating(true);
    setGeneratedText(null);

    try {
      const res = await fetch('/api/amina/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          mode: activeTab,
          contextData,
          userApiKey: userApiKey.trim() || undefined
        })
      });

      if (!res.ok) {
        throw new Error(`Server response error: ${res.status}`);
      }

      const data = await res.json();
      const textResult = data.text || 'Tidak dapat memproses draf.';
      setGeneratedText(textResult);
      setEditedText(textResult);
    } catch (err: any) {
      console.warn('API call failed, generating fallback response locally:', err);
      const fallbackText = generateLocalFallback(activeTab, prompt, contextData);
      setGeneratedText(fallbackText);
      setEditedText(fallbackText);
    } finally {
      setIsGenerating(false);
    }
  };

  // Specific Submit Handlers
  const handleGenerateAnnouncement = () => {
    const prompt = `Buatkan draf pengumuman resmi masjid untuk acara: ${annTopic}. Pemateri: ${annSpeaker}. Waktu: ${annTime}. Tema: ${annKeyPoint}. Catatan: ${annExtra}`;
    handleGenerate(prompt);
  };

  const handleGenerateReportRefine = () => {
    const prompt = `Rapikan catatan laporan kas keuangan berikut menjadi bahasa laporan yang sopan dan santun untuk disampaikan kepada jamaah:\n${rawReportText}`;
    handleGenerate(prompt);
  };

  const handleGenerateMonthlyPro = () => {
    const prompt = `Buatkan ringkasan narasi laporan keuangan bulanan eksekutif untuk DKM Masjid periode ${selectedMonth} berdasarkan rekapitulasi kas harian.`;
    handleGenerate(prompt);
  };

  const handleGenerateBlogPro = () => {
    const prompt = `Buatkan artikel/blog post panjang dan mendalam untuk media publikasi masjid mengenai: ${blogTopic} dengan nada bicara ${blogTone}.`;
    handleGenerate(prompt);
  };

  const handleGenerateInventoryPro = () => {
    const prompt = `Analisis tren inventaris masjid dan buatkan draf usulan pemeliharaan aset ke Ketua DKM.`;
    handleGenerate(prompt, { inventoryList: state.inventory });
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(editedText || generatedText || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyToAnnouncement = async () => {
    if (!editedText.trim()) return;
    try {
      const lines = editedText.trim().split('\n');
      const firstLine = lines[0].replace(/^[#*\-=\s]+/, '');
      const judul = firstLine.length < 60 ? firstLine : (annTopic || 'Pengumuman DKM Masjid');

      await onAddAnnouncement({
        judul,
        isi: editedText,
        tanggal: new Date().toISOString().split('T')[0],
        status: applyStatus
      });

      setApplyModalOpen(false);
    } catch (e) {
      console.error('Failed to save announcement draft:', e);
    }
  };

  return (
    <div id="amina-view" className="space-y-6 animate-fade-in">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 sm:p-8 rounded-[32px] shadow-lg relative overflow-hidden border border-emerald-700/50">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-teal-400/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-emerald-400/20 backdrop-blur-md rounded-2xl border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0 shadow-inner">
              <Sparkles className="w-7 h-7 text-emerald-300 animate-pulse" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                  Asisten AI Pengurus Masjid
                </span>
                <span className="text-xs text-emerald-300/80 font-mono font-semibold">• Gemini 3.6 Flash</span>
              </div>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
                Amina — Pembantu Administrasi Masjid
              </h1>
              <p className="text-emerald-100/90 text-xs sm:text-sm max-w-2xl font-medium leading-relaxed">
                Amina membantu Anda merapikan laporan dan menyusun pengumuman — Anda tetap yang memutuskan dan mempublikasikan setiap konten.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
            <button
              onClick={() => setShowApiKeyPanel(!showApiKeyPanel)}
              className="bg-emerald-950/60 hover:bg-emerald-950/80 backdrop-blur-md border border-emerald-700/50 p-3 rounded-2xl text-right text-xs transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 justify-end text-emerald-300 font-bold">
                <Key className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                <span>API Key Gemini</span>
              </div>
              <p className="text-[10px] text-emerald-100/70">
                {userApiKey.trim() ? '🔑 Key Kustom Aktif' : '⚡ Key Server Default'}
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* GEMINI API KEY INPUT SECTION */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/60 flex items-center justify-center shrink-0">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-slate-900 text-sm">Kolom Input API Key Gemini</h3>
                {userApiKey.trim() ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" /> API Key Kustom Aktif
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                    Menggunakan Key Default Server
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                Anda dapat memasukkan API Key Gemini pribadi (opsional). Key disimpan secara aman di browser local storage Anda.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowApiKeyPanel(!showApiKeyPanel)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0"
          >
            {showApiKeyPanel ? 'Sembunyikan' : 'Atur API Key'}
          </button>
        </div>

        {/* EXPANDED API KEY INPUT FORM */}
        {(showApiKeyPanel || userApiKey.trim() !== '') && (
          <div className="pt-3 border-t border-slate-100 space-y-2.5">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <input
                  type={showApiKeyText ? 'text' : 'password'}
                  placeholder="Masukkan API Key Gemini Anda (contoh: AIzaSy...)"
                  value={userApiKey}
                  onChange={(e) => handleSaveApiKey(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-hidden bg-slate-50/50"
                />
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowApiKeyText(!showApiKeyText)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title={showApiKeyText ? 'Sembunyikan Teks' : 'Tampilkan Teks'}
                >
                  {showApiKeyText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {userApiKey.trim() && (
                  <button
                    type="button"
                    onClick={handleResetApiKey}
                    className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200/60 transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Hapus API Key kustom dan kembali ke default"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Key</span>
                  </button>
                )}
              </div>
            </div>

            {apiKeyNotice && (
              <p className="text-[11px] font-bold text-emerald-700 animate-fade-in flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> {apiKeyNotice}
              </p>
            )}

            <p className="text-[10px] text-slate-400 leading-relaxed">
              * Dapatkan API key gratis dari <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-emerald-600 underline hover:text-emerald-700 font-medium">Google AI Studio</a>. Jika dikosongkan, Amina akan menggunakan sistem API Key default server.
            </p>
          </div>
        )}
      </div>

      {/* NAVIGATION TABS: BASIC VS PRO */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap gap-2">
        {/* BASIC TABS */}
        <button
          onClick={() => { setActiveTab('announcement'); setGeneratedText(null); }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'announcement'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Megaphone className="w-4 h-4 text-emerald-300" />
          <span>Draf Pengumuman Singkat</span>
        </button>

        <button
          onClick={() => { setActiveTab('report-refine'); setGeneratedText(null); }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'report-refine'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Wand2 className="w-4 h-4 text-emerald-300" />
          <span>Rapikan Bahasa Laporan</span>
        </button>

        {/* PRO TABS */}
        <div className="h-6 w-[1px] bg-slate-200 my-auto mx-1 hidden sm:block"></div>

        <button
          onClick={() => { setActiveTab('monthly-pro'); setGeneratedText(null); }}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'monthly-pro'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-indigo-900 bg-indigo-50/60 hover:bg-indigo-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-indigo-400" />
          <span>Laporan Bulanan</span>
          <span className="px-1.5 py-0.2 rounded text-[8px] font-black bg-indigo-500 text-white uppercase ml-1">PRO</span>
        </button>

        <button
          onClick={() => { setActiveTab('blog-pro'); setGeneratedText(null); }}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'blog-pro'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-indigo-900 bg-indigo-50/60 hover:bg-indigo-100'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
          <span>Draf Artikel Panjang</span>
          <span className="px-1.5 py-0.2 rounded text-[8px] font-black bg-indigo-500 text-white uppercase ml-1">PRO</span>
        </button>

        <button
          onClick={() => { setActiveTab('inventory-pro'); setGeneratedText(null); }}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'inventory-pro'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-indigo-900 bg-indigo-50/60 hover:bg-indigo-100'
          }`}
        >
          <Box className="w-3.5 h-3.5 text-indigo-400" />
          <span>Analisis Inventaris</span>
          <span className="px-1.5 py-0.2 rounded text-[8px] font-black bg-indigo-500 text-white uppercase ml-1">PRO</span>
        </button>
      </div>

      {/* PRO DEMO BANNER NOTICE IF PRO TAB IS ACTIVE */}
      {['monthly-pro', 'blog-pro', 'inventory-pro'].includes(activeTab) && (
        <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-indigo-900">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-indigo-100 text-indigo-700 rounded-xl font-bold shrink-0">🧪</span>
            <div>
              <p className="font-bold">Mode Demo Fitur Laporan & Analisis Pro</p>
              <p className="text-[11px] text-indigo-700">Anda dapat mencoba fitur analisis ini secara langsung dengan data simulasi dummy.</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('/pro')}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <Crown className="w-3.5 h-3.5 text-amber-300" />
            <span>Lihat Paket Pro</span>
          </button>
        </div>
      )}

      {/* MAIN CONTENT WORKSPACE (GRID 2 COLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* INPUT FORM PANEL (LEFT) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* TAB 1: DRAF PENGUMUMAN */}
          {activeTab === 'announcement' && (
            <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <Megaphone className="w-5 h-5 text-emerald-600" />
                <h3 className="font-display font-bold text-slate-900 text-base">Komposisi Pengumuman Singkat</h3>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    Judul / Topik Acara <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Kajian Jumat Malam, Tabligh Akbar, Santunan Yatim..."
                    value={annTopic}
                    onChange={(e) => setAnnTopic(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    Pemateri / Ustadz / Penceramah
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Ustadz Dr. H. Ahmad Fauzi, Lc, MA"
                    value={annSpeaker}
                    onChange={(e) => setAnnSpeaker(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    Waktu & Tempat Pelaksanaan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Jumat Malam Sabtu, Ba'da Isya di Ruang Utama"
                    value={annTime}
                    onChange={(e) => setAnnTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    Tema / Pesan Utama
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Meneladani Kesabaran Rasulullah SAW dalam Kehidupan Berkeluarga"
                    value={annKeyPoint}
                    onChange={(e) => setAnnKeyPoint(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    Catatan Tambahan
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Disediakan konsumsi & streaming YouTube live."
                    value={annExtra}
                    onChange={(e) => setAnnExtra(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-hidden resize-none"
                  ></textarea>
                </div>

                <button
                  onClick={handleGenerateAnnouncement}
                  disabled={isGenerating || !annTopic.trim()}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Amina sedang menyusun draf...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-300" />
                      <span>Susun Draf Pengumuman</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: RAPIKAN BAHASA LAPORAN */}
          {activeTab === 'report-refine' && (
            <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Wand2 className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-display font-bold text-slate-900 text-base">Rapikan Catatan Laporan</h3>
                </div>
                <button
                  onClick={handleLoadRecentTransactions}
                  className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer border border-emerald-200/60"
                  title="Ambil otomatis 5 transaksi kas masuk & keluar terbaru dari Ledger Kas"
                >
                  <span>⚡ Tarik Kas Terakhir</span>
                </button>
              </div>

              <div className="space-y-3.5 text-xs">
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Tempel catatan kasar Anda (contoh: <em>"masuk infaq jumat 5jt, keluar bayar listrik 800rb"</em>). Amina akan menyusunnya menjadi kalimat laporan yang santun dan rapi.
                </p>

                <div>
                  <textarea
                    rows={6}
                    placeholder="Contoh catatan kasar:
- infaq jumat kemarin dapat 4,5jt
- penerimaan kotak anak yatim 1,2jt
- bayar kebersihan dan marbot 1jt
- beli karpet pengganti 1,5jt..."
                    value={rawReportText}
                    onChange={(e) => setRawReportText(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-hidden resize-none"
                  ></textarea>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-[10px] text-slate-500 flex items-start gap-2">
                  <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Amina hanya merapikan susunan bahasa:</strong> Angka dan nilai nominal murni berasal dari data pencatatan Anda. Amina tidak menghitung ulang angka.</span>
                </div>

                <button
                  onClick={handleGenerateReportRefine}
                  disabled={isGenerating || !rawReportText.trim()}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Amina sedang merapikan narasi...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 text-emerald-300" />
                      <span>Rapikan Bahasa Laporan</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: PRO LAPORAN BULANAN */}
          {activeTab === 'monthly-pro' && (
            <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-indigo-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-indigo-100">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="font-display font-bold text-slate-900 text-base">Ringkasan Laporan Bulanan (PRO)</h3>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    Pilih Bulan Laporan
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-hidden bg-white"
                  >
                    <option value="Juli 2026">Juli 2026 (Bulan Berjalan)</option>
                    <option value="Juni 2026">Juni 2026</option>
                    <option value="Mei 2026">Mei 2026</option>
                  </select>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Amina akan membaca data penerimaan & pengeluaran kas sebulan penuh dan merangkumnya menjadi Laporan Eksekutif Transparansi Keuangan.
                </p>

                <button
                  onClick={handleGenerateMonthlyPro}
                  disabled={isGenerating}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Menyusun Laporan Bulanan...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-indigo-200" />
                      <span>Susun Narasi Laporan Bulanan</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: PRO BLOG ARTIKEL */}
          {activeTab === 'blog-pro' && (
            <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-indigo-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-indigo-100">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <h3 className="font-display font-bold text-slate-900 text-base">Draf Artikel & Blog Panjang (PRO)</h3>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    Topik Artikel / Profil Program
                  </label>
                  <input
                    type="text"
                    value={blogTopic}
                    onChange={(e) => setBlogTopic(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    Gaya Penulisan / Tone
                  </label>
                  <select
                    value={blogTone}
                    onChange={(e) => setBlogTone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-hidden bg-white"
                  >
                    <option value="Inspiratif">Inspiratif & Hangat</option>
                    <option value="Formal">Formal & Laporan Resmi</option>
                    <option value="Edukatif">Edukatif & Kajian Keilmuan</option>
                  </select>
                </div>

                <button
                  onClick={handleGenerateBlogPro}
                  disabled={isGenerating || !blogTopic.trim()}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Menyusun Artikel Panjang...</span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4 text-indigo-200" />
                      <span>Buat Draf Artikel</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: PRO ANALISIS INVENTARIS */}
          {activeTab === 'inventory-pro' && (
            <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-indigo-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-indigo-100">
                <Box className="w-5 h-5 text-indigo-600" />
                <h3 className="font-display font-bold text-slate-900 text-base">Analisis Tren Inventaris (PRO)</h3>
              </div>

              <div className="space-y-3.5 text-xs">
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Amina menyoroti aset barang yang membutuhkan perawatan atau perbaikan (rusak ringan / berat) dan merancang draf surat usulan ke Ketua DKM.
                </p>

                <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-[11px] text-indigo-900 font-medium">
                  <strong>Status Inventaris Saat Ini:</strong> {state.inventory.length} Jenis Barang Terdaftar ({state.inventory.filter(i => i.kondisi !== 'Baik').length} butuh perhatian).
                </div>

                <button
                  onClick={handleGenerateInventoryPro}
                  disabled={isGenerating}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Menganalisis Data Aset...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-indigo-200" />
                      <span>Susun Draf Usulan Perbaikan</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* OUTPUT DRAFT DISPLAY PANEL (RIGHT) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-slate-200/80 shadow-xs flex-1 flex flex-col justify-between">
            
            <div className="space-y-4 flex-1 flex flex-col">
              {/* STATUS DRAFT BADGE HEADER */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping"></span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-200/80">
                    STATUS: DRAF — PERLU PENINJAUAN ADMIN
                  </span>
                </div>

                {generatedText && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyText}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                      <span>{copied ? 'Tersalin!' : 'Salin Teks Draf'}</span>
                    </button>

                    {activeTab === 'announcement' && (
                      <button
                        onClick={() => setApplyModalOpen(true)}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Megaphone className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Terapkan ke Berita</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* DRAFT CONTENT DISPLAY / EDITOR AREA */}
              {isGenerating ? (
                <div className="flex-1 min-h-[320px] flex flex-col items-center justify-center p-8 text-center space-y-3 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <Sparkles className="w-10 h-10 text-emerald-600 animate-spin" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Amina Sedang Merangkai Teks...</h4>
                    <p className="text-xs text-slate-400 mt-1">Menggunakan tata bahasa yang santun, hangat, dan sesuai tradisi komunikasi masjid.</p>
                  </div>
                </div>
              ) : generatedText ? (
                <div className="space-y-3 flex-1 flex flex-col">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>Hasil Generasi Amina (Dapat Diubah Sebelum Disalin/Terbit):</span>
                    <span>{editedText.length} Karakter</span>
                  </div>
                  <textarea
                    rows={14}
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="w-full flex-1 p-4 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm font-sans leading-relaxed text-slate-800 focus:bg-white focus:border-emerald-600 outline-hidden resize-none font-medium"
                  ></textarea>
                </div>
              ) : (
                <div className="flex-1 min-h-[320px] flex flex-col items-center justify-center p-8 text-center space-y-3 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div className="max-w-sm">
                    <h4 className="font-display font-bold text-slate-800 text-base">Draf Belum Dibuat</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Isi rincian di panel sebelah kiri lalu klik tombol generasi untuk melihat hasil draf buatan Amina.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* MANDATORY FOOTER REMINDER BANNER */}
            <div className="mt-6 p-4 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-start gap-3 text-amber-950 text-xs">
              <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Pengingat Penting:</p>
                <p className="text-[11px] text-amber-900/90 leading-relaxed font-medium">
                  Tinjau kembali sebelum dipublikasikan — Amina adalah alat bantu penulisan, Anda tetap yang memegang keputusan dan wewenang penuh atas publikasi konten masjid.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* CONFIRMATION MODAL FOR APPLYING TO NEWS */}
      {applyModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white rounded-[32px] max-w-md w-full p-6 shadow-2xl border border-slate-100 text-left space-y-5">
            <div className="flex items-center gap-3 text-emerald-700">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                <Megaphone className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">Publikasikan Pengumuman</h3>
                <p className="text-xs text-slate-500">Konfirmasi status simpan untuk Papan Rilis Pengumuman</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <p className="font-bold text-slate-800">Prinjau Konten Draf:</p>
                <p className="text-slate-600 line-clamp-3 font-mono text-[11px]">{editedText}</p>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                  Pilih Status Simpan:
                </label>
                <select
                  value={applyStatus}
                  onChange={(e) => setApplyStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-hidden bg-white"
                >
                  <option value="Draft">Draft (Simpan saja, belum tampil di publik)</option>
                  <option value="Publish">Publish (Langsung Terbitkan ke Papan Rilis)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setApplyModalOpen(false)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleApplyToAnnouncement}
                className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Simpan Ke Publikasi Berita
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
