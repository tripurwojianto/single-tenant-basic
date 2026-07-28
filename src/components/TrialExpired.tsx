/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrandConfig, getActiveBrand } from '../brandConfig';
import { 
  AlertTriangle, Laptop, Users, HeartHandshake, LogOut, ArrowRight, BookOpen, ExternalLink, MessageCircle
} from 'lucide-react';

interface TrialExpiredProps {
  brand?: BrandConfig;
  onLogout: () => void;
  orgName: string;
}

export default function TrialExpired({ brand = getActiveBrand(), onLogout, orgName }: TrialExpiredProps) {
  const waLink = "https://wa.me/6288973641682?text=Halo%20Admin%20KasMasjid,%20masa%20uji%20coba%20kami%20telah%20berakhir.%20Saya%20tertarik%20dengan%20Pendampingan%20atau%20Membership";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-emerald-100" id="trial-expired-root">
      {/* Mini header */}
      <header className="h-16 border-b border-slate-200/80 bg-white flex items-center justify-between px-6 sm:px-8 shrink-0">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl ${brand.accentBgClass} flex items-center justify-center`}>
            <span className="font-display font-black text-sm text-white">
              {brand.id === 'masjid' ? 'KM' : brand.id === 'sekolah' ? 'SH' : brand.id === 'warga' ? 'WH' : 'KH'}
            </span>
          </div>
          <div>
            <span className="font-display font-extrabold text-sm text-slate-900 leading-none block">{brand.appName}</span>
            <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Masa Percobaan</span>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          Keluar
        </button>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-4xl w-full text-center space-y-8 py-8">
          
          {/* Main Block */}
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-rose-50/50">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h1 className="font-display font-black text-3xl text-slate-900 tracking-tight sm:text-4xl">
                Masa Uji Coba Telah Berakhir
              </h1>
              <p className="text-sm text-slate-500 font-bold font-mono uppercase tracking-wider">
                {orgName}
              </p>
            </div>
            
            <p className="text-sm text-slate-500 leading-relaxed font-medium px-4">
              Terima kasih telah mencoba <strong className="text-slate-800">{brand.appName}</strong>. 
              Untuk melanjutkan penggunaan aplikasi dan tetap menggunakan database Google Sheets yang telah dibuat, silakan pilih salah satu opsi di bawah ini. Data Anda sepenuhnya aman dan tidak akan dihapus.
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid md:grid-cols-3 gap-6 text-left">
            
            {/* OPTION 1: DEPLOYMENT MANDIRI */}
            <div className="bg-white rounded-[24px] border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className={`w-10 h-10 rounded-xl bg-slate-50 ${brand.accentTextClass} flex items-center justify-center`}>
                  <Laptop className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-display font-extrabold text-sm text-slate-900">
                    Deployment Mandiri
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Deploy aplikasi ke akun Vercel Anda sendiri menggunakan panduan resmi repository KasMasjid Basic secara gratis selamanya.
                  </p>
                </div>
              </div>
              
              <a
                href="https://github.com/KUKAS-ID"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-xs text-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer no-underline"
              >
                <BookOpen className="w-4 h-4 text-slate-400" />
                Panduan Deployment
              </a>
            </div>

            {/* OPTION 2: PENDAMPINGAN */}
            <div className="bg-white rounded-[24px] border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-display font-extrabold text-sm text-slate-900">
                    Pendampingan Implementasi
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Tim KUKAS membantu proses setup, konfigurasi Google Sheets, dan deployment ke akun Vercel Anda dengan biaya satu kali.
                  </p>
                </div>
              </div>

              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold text-xs text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer no-underline shadow-xs shadow-indigo-100"
              >
                <MessageCircle className="w-4 h-4" />
                Hubungi Admin
              </a>
            </div>

            {/* OPTION 3: MEMBERSHIP */}
            <div className="bg-white rounded-[24px] border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-display font-extrabold text-sm text-slate-900">
                    Membership / Cloud
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Ingin siap pakai instan tanpa repot? Kami yang mengelola seluruh server, deployment, dan dukungan teknis 24/7 untuk Anda.
                  </p>
                </div>
              </div>

              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 font-bold text-xs text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer no-underline shadow-xs shadow-amber-100"
              >
                <ExternalLink className="w-4 h-4" />
                Pelajari Membership
              </a>
            </div>

          </div>

          {/* Guarantee disclaimer */}
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl max-w-xl mx-auto text-[11px] text-slate-400 font-medium leading-relaxed">
            💡 <strong>Kebebasan Data Dijamin</strong>: Database Google Sheets Anda sepenuhnya milik Anda. Kami sama sekali tidak memiliki akses ke spreadsheet tersebut kecuali jika Anda mengotorisasinya secara manual. File dan data di Drive tetap utuh dan dapat digunakan selamanya.
          </div>

        </div>
      </div>
    </div>
  );
}
