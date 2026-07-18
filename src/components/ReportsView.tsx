/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { MosqueState } from '../types';
import { Printer, Calendar, FileText, Download, PieChart, CheckSquare, Award } from 'lucide-react';

interface ReportsViewProps {
  state: MosqueState;
}

export default function ReportsView({ state }: ReportsViewProps) {
  const [periodType, setPeriodType] = useState<'daily' | 'monthly' | 'yearly'>('monthly');
  
  // Defaults
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState('2026-07');
  const [selectedYear, setSelectedYear] = useState('2026');

  // Filter transactions based on selected period
  const filteredIncomes = state.incomes.filter((item) => {
    if (periodType === 'daily') return item.tanggal === selectedDate;
    if (periodType === 'monthly') return item.tanggal.startsWith(selectedMonth);
    return item.tanggal.startsWith(selectedYear);
  });

  const filteredExpenses = state.expenses.filter((item) => {
    if (periodType === 'daily') return item.tanggal === selectedDate;
    if (periodType === 'monthly') return item.tanggal.startsWith(selectedMonth);
    return item.tanggal.startsWith(selectedYear);
  });

  // Calculate totals
  const totalIncome = filteredIncomes.reduce((sum, item) => sum + item.nominal, 0);
  const totalExpense = filteredExpenses.reduce((sum, item) => sum + item.nominal, 0);
  const netBalance = totalIncome - totalExpense;

  // Aggregate Category breakdown for visual display
  const incomeCategoryBreakdown: { [key: string]: number } = {};
  const expenseCategoryBreakdown: { [key: string]: number } = {};

  filteredIncomes.forEach((item) => {
    incomeCategoryBreakdown[item.kategori] = (incomeCategoryBreakdown[item.kategori] || 0) + item.nominal;
  });

  filteredExpenses.forEach((item) => {
    expenseCategoryBreakdown[item.kategori] = (expenseCategoryBreakdown[item.kategori] || 0) + item.nominal;
  });

  const incomeBreakdownArray = Object.keys(incomeCategoryBreakdown).map((name) => ({
    name,
    value: incomeCategoryBreakdown[name],
    percentage: totalIncome > 0 ? (incomeCategoryBreakdown[name] / totalIncome) * 100 : 0
  })).sort((a, b) => b.value - a.value);

  const expenseBreakdownArray = Object.keys(expenseCategoryBreakdown).map((name) => ({
    name,
    value: expenseCategoryBreakdown[name],
    percentage: totalExpense > 0 ? (expenseCategoryBreakdown[name] / totalExpense) * 100 : 0
  })).sort((a, b) => b.value - a.value);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const csvRows: string[] = [];
    
    // Header Info
    csvRows.push(`"LAPORAN REALISASI ARUS KAS KEUANGAN"`);
    csvRows.push(`"Masjid:","${state.info.namaMasjid || 'Masjid Tanpa Nama'}"`);
    csvRows.push(`"Motto:","${state.info.tagline || 'Mengabdi untuk Kemaslahatan Ummat'}"`);
    csvRows.push(`"Periode:","${getPeriodLabel()}"`);
    csvRows.push('');
    
    // Balances
    csvRows.push(`"RINGKASAN NERACA"`);
    csvRows.push(`"Total Penerimaan",${totalIncome}`);
    csvRows.push(`"Total Pengeluaran",${totalExpense}`);
    csvRows.push(`"Saldo Bersih (Net)",${netBalance}`);
    csvRows.push('');
    
    // Incomes
    csvRows.push(`"1. RINCIAN PENERIMAAN (INCOME)"`);
    csvRows.push(`"Tanggal","Kategori","Deskripsi","Nominal"`);
    if (filteredIncomes.length > 0) {
      filteredIncomes.forEach(item => {
        const desc = (item.deskripsi || '').replace(/"/g, '""');
        const cat = (item.kategori || '').replace(/"/g, '""');
        csvRows.push(`"${item.tanggal}","${cat}","${desc}",${item.nominal}`);
      });
    } else {
      csvRows.push(`"Tidak ada penerimaan terdaftar pada periode ini"`);
    }
    csvRows.push(`"TOTAL PENERIMAAN",,,${totalIncome}`);
    csvRows.push('');
    
    // Expenses
    csvRows.push(`"2. RINCIAN BELANJA (EXPENSE)"`);
    csvRows.push(`"Tanggal","Kategori","Deskripsi","Nominal"`);
    if (filteredExpenses.length > 0) {
      filteredExpenses.forEach(item => {
        const desc = (item.deskripsi || '').replace(/"/g, '""');
        const cat = (item.kategori || '').replace(/"/g, '""');
        csvRows.push(`"${item.tanggal}","${cat}","${desc}",${item.nominal}`);
      });
    } else {
      csvRows.push(`"Tidak ada pengeluaran terdaftar pada periode ini"`);
    }
    csvRows.push(`"TOTAL PENGELUARAN",,,${totalExpense}`);
    
    // Combine to string with BOM for Excel UTF-8 compatibility
    const csvContent = "\uFEFF" + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    const cleanMosqueName = (state.info.namaMasjid || 'Masjid').replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `Laporan_Kas_${cleanMosqueName}_${periodType}_${new Date().toISOString().split('T')[0]}.csv`;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 210;
    const leftMargin = 20;
    const rightMargin = 20;
    const contentWidth = pageWidth - leftMargin - rightMargin; // 170

    let y = 20;

    const checkPageBreak = (neededHeight: number) => {
      if (y + neededHeight > 270) {
        doc.addPage();
        y = 20;
        return true;
      }
      return false;
    };

    // Header / Kop Surat
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    const mosqueName = (state.info.namaMasjid || 'Masjid Raya Baiturrahman').toUpperCase();
    doc.text(mosqueName, pageWidth / 2, y, { align: 'center' });
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // slate-500
    const tagline = state.info.tagline || 'Mengabdi untuk Kemaslahatan Ummat';
    doc.text(tagline, pageWidth / 2, y, { align: 'center' });
    y += 5;

    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // slate-400
    const addressParts = [];
    if (state.info.alamat) addressParts.push(state.info.alamat);
    if (state.info.kota) addressParts.push(state.info.kota);
    let addressStr = addressParts.join(', ');
    if (state.info.whatsApp) addressStr += ` | WA: ${state.info.whatsApp}`;
    if (state.info.email) addressStr += ` | Email: ${state.info.email}`;
    doc.text(addressStr, pageWidth / 2, y, { align: 'center' });
    y += 4;

    // Double line divider
    doc.setDrawColor(30, 41, 59); // slate-800
    doc.setLineWidth(0.8);
    doc.line(leftMargin, y, pageWidth - rightMargin, y);
    y += 1.5;
    doc.setLineWidth(0.2);
    doc.line(leftMargin, y, pageWidth - rightMargin, y);
    y += 8;

    // Document Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text("LAPORAN REALISASI ARUS KAS KEUANGAN", pageWidth / 2, y, { align: 'center' });
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105); // slate-600
    doc.text(`Periode Laporan - ${getPeriodLabel()}`, pageWidth / 2, y, { align: 'center' });
    y += 10;

    // Balances Board (Draw 3 elegant columns in a box)
    checkPageBreak(25);
    doc.setFillColor(248, 250, 252); // slate-50 bg
    doc.rect(leftMargin, y, contentWidth, 20, "F");
    doc.setDrawColor(203, 213, 225); // slate-300
    doc.rect(leftMargin, y, contentWidth, 20, "D");

    const colWidth = contentWidth / 3;
    
    // Draw column lines
    doc.line(leftMargin + colWidth, y, leftMargin + colWidth, y + 20);
    doc.line(leftMargin + colWidth * 2, y, leftMargin + colWidth * 2, y + 20);

    // Box 1: Total Penerimaan
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text("TOTAL PENERIMAAN", leftMargin + colWidth / 2, y + 6, { align: 'center' });
    doc.setFontSize(10);
    doc.setTextColor(4, 120, 87); // emerald-700
    doc.text(formatRupiah(totalIncome), leftMargin + colWidth / 2, y + 14, { align: 'center' });

    // Box 2: Total Pengeluaran
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text("TOTAL PENGELUARAN", leftMargin + colWidth + colWidth / 2, y + 6, { align: 'center' });
    doc.setFontSize(10);
    doc.setTextColor(225, 29, 72); // rose-600
    doc.text(formatRupiah(totalExpense), leftMargin + colWidth + colWidth / 2, y + 14, { align: 'center' });

    // Box 3: Saldo Bersih
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text("SALDO BERSIH (NET)", leftMargin + colWidth * 2 + colWidth / 2, y + 6, { align: 'center' });
    doc.setFontSize(10);
    doc.setTextColor(6, 95, 70); // emerald-800
    doc.text(formatRupiah(netBalance), leftMargin + colWidth * 2 + colWidth / 2, y + 14, { align: 'center' });

    y += 28;

    // Function to render table
    const renderTable = (title: string, data: any[], isIncome: boolean) => {
      checkPageBreak(25);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text(title, leftMargin, y);
      y += 5;

      // Draw table header underline
      doc.setDrawColor(30, 41, 59); // slate-800
      doc.setLineWidth(0.4);
      doc.line(leftMargin, y, pageWidth - rightMargin, y);
      y += 4;

      // Header labels
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105); // slate-600
      doc.text("Tanggal", leftMargin, y);
      doc.text("Kategori", leftMargin + 25, y);
      doc.text("Deskripsi Rincian", leftMargin + 65, y);
      doc.text("Nominal", pageWidth - rightMargin, y, { align: 'right' });
      y += 2;

      doc.setDrawColor(226, 232, 240); // slate-200
      doc.setLineWidth(0.2);
      doc.line(leftMargin, y, pageWidth - rightMargin, y);
      y += 4;

      // Table rows
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85); // slate-700

      if (data.length > 0) {
        data.forEach((item) => {
          checkPageBreak(10);
          doc.text(item.tanggal, leftMargin, y);
          doc.text(item.kategori, leftMargin + 25, y);
          
          // Truncate long descriptions to prevent text overlapping
          const desc = item.deskripsi || '';
          const maxDescWidth = 65; // mm
          const splitDesc = doc.splitTextToSize(desc, maxDescWidth);
          doc.text(splitDesc[0] || '', leftMargin + 65, y);

          doc.setFont("helvetica", "bold");
          if (!isIncome) {
            doc.setTextColor(225, 29, 72); // rose-600
          } else {
            doc.setTextColor(4, 120, 87); // emerald-700
          }
          doc.text(formatRupiah(item.nominal), pageWidth - rightMargin, y, { align: 'right' });
          
          doc.setFont("helvetica", "normal");
          doc.setTextColor(51, 65, 85);

          y += 6;
          doc.line(leftMargin, y - 2, pageWidth - rightMargin, y - 2);
        });
      } else {
        checkPageBreak(10);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(148, 163, 184); // slate-400
        doc.text("Tidak ada data terdaftar pada periode ini", leftMargin, y);
        y += 6;
      }

      // Table total row
      checkPageBreak(10);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text("TOTAL:", leftMargin, y);
      const totalText = isIncome ? formatRupiah(totalIncome) : formatRupiah(totalExpense);
      doc.text(totalText, pageWidth - rightMargin, y, { align: 'right' });
      y += 4;
      doc.setLineWidth(0.4);
      doc.line(leftMargin, y, pageWidth - rightMargin, y);
      y += 12;
    };

    // Render Incomes Table
    renderTable("1. Rincian Pemasukan Kas (Penerimaan)", filteredIncomes, true);

    // Render Expenses Table
    renderTable("2. Rincian Pengeluaran Kas (Belanja)", filteredExpenses, false);

    // Signature Block
    checkPageBreak(40);
    const sigY = y;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105); // slate-600

    // Disusun oleh (left side)
    doc.text("Disusun oleh,", leftMargin + 25, sigY, { align: 'center' });
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Bendahara DKM", leftMargin + 25, sigY + 5, { align: 'center' });
    doc.line(leftMargin + 5, sigY + 25, leftMargin + 45, sigY + 25);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text("(Tanda Tangan & Nama Terang)", leftMargin + 25, sigY + 29, { align: 'center' });

    // Menyetujui (right side)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text("Mengetahui & Menyetujui,", pageWidth - rightMargin - 25, sigY, { align: 'center' });
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Ketua Umum DKM", pageWidth - rightMargin - 25, sigY + 5, { align: 'center' });
    doc.line(pageWidth - rightMargin - 45, sigY + 25, pageWidth - rightMargin - 5, sigY + 25);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text("(Stempel DKM & Nama Terang)", pageWidth - rightMargin - 25, sigY + 29, { align: 'center' });

    y = sigY + 38;

    // Footer note
    checkPageBreak(15);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text("KASMASJID BASIC COMMUNITY EDITION | LAPORAN TERVERIFIKASI VIA GOOGLE SHEETS DATABASE", pageWidth / 2, y, { align: 'center' });

    // Save/Download PDF
    const cleanMosqueName = (state.info.namaMasjid || 'Masjid').replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `Laporan_Kas_${cleanMosqueName}_${periodType}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  const getPeriodLabel = () => {
    if (periodType === 'daily') return `Hari: ${selectedDate}`;
    if (periodType === 'monthly') {
      const [year, month] = selectedMonth.split('-');
      const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      return `Bulan: ${monthNames[parseInt(month) - 1]} ${year}`;
    }
    return `Tahun: ${selectedYear}`;
  };

  return (
    <div id="reports-view" className="space-y-6 animate-fade-in">
      {/* Printable Area Specific Style Block */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          /* Hide app wrappers */
          nav, aside, header, #sidebar, .no-print, button, select, input {
            display: none !important;
          }
          #printable-report-card {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          .print-full-width {
            width: 100% !important;
            max-width: 100% !important;
          }
        }
      `}</style>

      {/* Screen Controls (no-print) */}
      <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-slate-200/80 space-y-6 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 leading-tight">
                Generator Laporan Kas & Aset
              </h2>
              <p className="text-slate-500 text-sm mt-1.5">
                Tinjau ringkasan neraca kas masjid dan cetak lampiran laporan fisik.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start sm:self-center">
            <button
              onClick={handleExportCSV}
              className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm flex items-center gap-2 shadow-sm cursor-pointer transition-colors"
              title="Ekspor laporan ke format CSV"
            >
              <Download className="w-4.5 h-4.5 text-slate-500" />
              Ekspor CSV
            </button>
            <button
              onClick={handleExportPDF}
              className="px-5 py-2.5 rounded-xl border border-emerald-200 hover:bg-emerald-50 text-emerald-700 font-semibold text-sm flex items-center gap-2 shadow-sm cursor-pointer transition-colors"
              title="Unduh laporan formal dalam format PDF"
            >
              <FileText className="w-4.5 h-4.5 text-emerald-600" />
              Unduh PDF
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm flex items-center gap-2 shadow-sm cursor-pointer transition-colors"
              title="Cetak langsung menggunakan printer fisik atau browser PDF"
            >
              <Printer className="w-4.5 h-4.5" />
              Cetak Laporan
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Jenis Laporan</label>
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50">
              <button
                onClick={() => setPeriodType('daily')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  periodType === 'daily' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Harian
              </button>
              <button
                onClick={() => setPeriodType('monthly')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  periodType === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Bulanan
              </button>
              <button
                onClick={() => setPeriodType('yearly')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  periodType === 'yearly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Tahunan
              </button>
            </div>
          </div>

          {periodType === 'daily' && (
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Pilih Tanggal</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
              />
            </div>
          )}

          {periodType === 'monthly' && (
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Pilih Bulan & Tahun</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
              />
            </div>
          )}

          {periodType === 'yearly' && (
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Pilih Tahun</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
              >
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Categories breakdown visually on screen only (no-print) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 no-print">
        {/* Income Breakdown */}
        <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-slate-200/80">
          <h3 className="font-display font-bold text-slate-900 text-sm mb-5 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <PieChart className="w-4 h-4" />
            </div>
            Proporsi Pemasukan Kas
          </h3>
          <div className="space-y-4">
            {incomeBreakdownArray.length > 0 ? (
              incomeBreakdownArray.map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-700">{item.name}</span>
                    <span className="font-mono font-bold text-slate-900">{formatRupiah(item.value)} ({item.percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-8">Belum ada transaksi pemasukan pada periode ini</p>
            )}
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-slate-200/80">
          <h3 className="font-display font-bold text-slate-900 text-sm mb-5 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <PieChart className="w-4 h-4" />
            </div>
            Proporsi Pengeluaran Kas
          </h3>
          <div className="space-y-4">
            {expenseBreakdownArray.length > 0 ? (
              expenseBreakdownArray.map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-700">{item.name}</span>
                    <span className="font-mono font-bold text-slate-900">{formatRupiah(item.value)} ({item.percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-8">Belum ada transaksi pengeluaran pada periode ini</p>
            )}
          </div>
        </div>
      </div>

      {/* REPORT PRINTABLE SHEET CARD */}
      <div 
        id="printable-report-card" 
        className="bg-white p-8 sm:p-12 rounded-[32px] border border-slate-200 shadow-sm max-w-4xl mx-auto print-full-width"
      >
        {/* Kop Surat / Header */}
        <div className="text-center pb-6 border-b-2 border-double border-slate-800 space-y-2">
          {state.info.logo && (
            <img 
              src={state.info.logo} 
              alt="Logo" 
              className="w-16 h-16 mx-auto rounded-full object-cover mb-2 no-print"
              referrerPolicy="no-referrer"
            />
          )}
          <h1 className="font-display font-extrabold text-2xl tracking-tight text-slate-900 uppercase">
            {state.info.namaMasjid || 'Masjid Raya Baiturrahman'}
          </h1>
          <p className="text-slate-600 text-xs font-semibold tracking-wider">
            {state.info.tagline || 'Mengabdi untuk Kemaslahatan Ummat'}
          </p>
          <div className="text-slate-500 text-xs font-mono">
            {state.info.alamat && `${state.info.alamat}, `}{state.info.kota && state.info.kota}
            {state.info.whatsApp && ` | Telp/WA: ${state.info.whatsApp}`}
            {state.info.email && ` | Email: ${state.info.email}`}
          </div>
        </div>

        {/* Document Title */}
        <div className="text-center py-6 space-y-1">
          <h2 className="font-display font-bold text-lg text-slate-900 uppercase tracking-widest">
            Laporan Realisasi Arus Kas Keuangan
          </h2>
          <span className="text-sm font-semibold text-slate-600 font-mono">
            Periode Laporan - {getPeriodLabel()}
          </span>
        </div>

        {/* Balances Board */}
        <div className="grid grid-cols-3 border border-slate-800 text-center divide-x divide-slate-800 mb-8 rounded-xl overflow-hidden bg-slate-50">
          <div className="p-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Penerimaan</span>
            <span className="font-mono font-bold text-emerald-700 text-sm sm:text-base mt-1 block">
              {formatRupiah(totalIncome)}
            </span>
          </div>
          <div className="p-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Pengeluaran</span>
            <span className="font-mono font-bold text-rose-700 text-sm sm:text-base mt-1 block">
              {formatRupiah(totalExpense)}
            </span>
          </div>
          <div className="p-4 bg-emerald-50">
            <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block">Saldo Bersih (Net)</span>
            <span className="font-mono font-bold text-emerald-800 text-sm sm:text-base mt-1 block">
              {formatRupiah(netBalance)}
            </span>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="space-y-6">
          <div>
            <h3 className="font-display font-bold text-xs text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1.5 mb-3">
              1. Rincian Pemasukan Kas (Penerimaan)
            </h3>
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 font-bold text-slate-700">
                  <th className="py-2 pr-4">Tanggal</th>
                  <th className="py-2 px-4">Kategori</th>
                  <th className="py-2 px-4">Deskripsi Rincian</th>
                  <th className="py-2 pl-4 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredIncomes.length > 0 ? (
                  filteredIncomes.map((item, i) => (
                    <tr key={i}>
                      <td className="py-2 pr-4 font-mono text-slate-500">{item.tanggal}</td>
                      <td className="py-2 px-4">{item.kategori}</td>
                      <td className="py-2 px-4 italic text-slate-600">{item.deskripsi}</td>
                      <td className="py-2 pl-4 text-right font-mono font-semibold">{formatRupiah(item.nominal)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-3 text-center text-slate-400">Tidak ada penerimaan terdaftar pada periode ini</td>
                  </tr>
                )}
                <tr className="border-t border-slate-800 font-bold">
                  <td colSpan={3} className="py-2 text-right uppercase">Total Penerimaan:</td>
                  <td className="py-2 text-right font-mono">{formatRupiah(totalIncome)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="pt-4">
            <h3 className="font-display font-bold text-xs text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1.5 mb-3">
              2. Rincian Pengeluaran Kas (Belanja)
            </h3>
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 font-bold text-slate-700">
                  <th className="py-2 pr-4">Tanggal</th>
                  <th className="py-2 px-4">Kategori</th>
                  <th className="py-2 px-4">Deskripsi Rincian</th>
                  <th className="py-2 pl-4 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredExpenses.length > 0 ? (
                  filteredExpenses.map((item, i) => (
                    <tr key={i}>
                      <td className="py-2 pr-4 font-mono text-slate-500">{item.tanggal}</td>
                      <td className="py-2 px-4">{item.kategori}</td>
                      <td className="py-2 px-4 italic text-slate-600">{item.deskripsi}</td>
                      <td className="py-2 pl-4 text-right font-mono font-semibold text-rose-700">{formatRupiah(item.nominal)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-3 text-center text-slate-400">Tidak ada pengeluaran terdaftar pada periode ini</td>
                  </tr>
                )}
                <tr className="border-t border-slate-800 font-bold">
                  <td colSpan={3} className="py-2 text-right uppercase">Total Pengeluaran:</td>
                  <td className="py-2 text-right font-mono text-rose-700">{formatRupiah(totalExpense)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Kop Tanda Tangan (Signature Block) - Incredibly vital for Indonesian Mosques */}
        <div className="mt-16 pt-12 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
          <div className="space-y-12">
            <div>
              <span className="block text-slate-500">Disusun oleh,</span>
              <span className="block font-bold text-slate-800 uppercase mt-0.5">Bendahara DKM</span>
            </div>
            <div className="w-36 border-b border-slate-800 mx-auto"></div>
            <span className="block font-mono text-slate-400">(Tanda Tangan & Nama Terang)</span>
          </div>

          <div className="space-y-12">
            <div>
              <span className="block text-slate-500">Mengetahui & Menyetujui,</span>
              <span className="block font-bold text-slate-800 uppercase mt-0.5">Ketua Umum DKM</span>
            </div>
            <div className="w-36 border-b border-slate-800 mx-auto"></div>
            <span className="block font-mono text-slate-400">(Stempel DKM & Nama Terang)</span>
          </div>
        </div>

        {/* Printable Footer notes */}
        <div className="mt-12 text-center text-[10px] text-slate-400 font-mono uppercase tracking-wider pt-6 border-t border-dashed border-slate-100">
          KasMasjid Basic Community Edition | Laporan terverifikasi via Google Sheets Database.
        </div>
      </div>
    </div>
  );
}
