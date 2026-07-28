/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  fetchMasterRegistryRows, 
  updateTenantInMasterRegistry, 
  TenantRegistry 
} from '../lib/googleSheets';
import { BrandConfig, getActiveBrand } from '../brandConfig';
import { 
  Users, Search, RefreshCw, Calendar, Shield, CreditCard, 
  CheckCircle, AlertTriangle, Eye, Settings, Clock, Check, X, Edit, ArrowUpRight
} from 'lucide-react';

interface DeveloperDashboardProps {
  token: string;
  masterSpreadsheetId: string;
  brand?: BrandConfig;
  onClose?: () => void;
}

export default function DeveloperDashboard({ 
  token, 
  masterSpreadsheetId, 
  brand = getActiveBrand(),
  onClose 
}: DeveloperDashboardProps) {
  const [tenants, setTenants] = useState<TenantRegistry[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTenant, setSelectedTenant] = useState<TenantRegistry | null>(null);
  const [extendDays, setExtendDays] = useState(30);

  // Form states for selected tenant
  const [editStatus, setEditStatus] = useState<'Trial' | 'Active' | 'Suspended' | 'Expired'>('Trial');
  const [editPlan, setEditPlan] = useState('Free');
  const [editEdition, setEditEdition] = useState('Basic');
  const [editNotes, setEditNotes] = useState('');

  const loadData = async () => {
    if (!token || !masterSpreadsheetId) return;
    setLoading(true);
    setError(null);
    try {
      const rows = await fetchMasterRegistryRows(token, masterSpreadsheetId);
      setTenants(rows);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Gagal memuat data Master Registry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token, masterSpreadsheetId]);

  const handleSelectTenant = (tenant: TenantRegistry) => {
    setSelectedTenant(tenant);
    setEditStatus(tenant.Status);
    setEditPlan(tenant.Plan);
    setEditEdition(tenant.Edition);
    setEditNotes(tenant.Notes || '');
  };

  const handleSaveTenant = async () => {
    if (!selectedTenant || !token || !masterSpreadsheetId) return;
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await updateTenantInMasterRegistry(token, masterSpreadsheetId, selectedTenant.TenantID, {
        Status: editStatus,
        Plan: editPlan,
        Edition: editEdition,
        Notes: editNotes
      });
      setSuccessMessage(`Tenant "${selectedTenant.OrganizationName}" berhasil diperbarui.`);
      setSelectedTenant(null);
      await loadData();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Gagal menyimpan pembaruan tenant.');
    } finally {
      setSaving(false);
    }
  };

  const handleExtendTrialDirect = async (tenant: TenantRegistry, days: number) => {
    if (!token || !masterSpreadsheetId) return;
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const currentEnd = tenant.TrialEndAt ? new Date(tenant.TrialEndAt) : new Date();
      currentEnd.setDate(currentEnd.getDate() + days);
      const newEndStr = currentEnd.toISOString().split('T')[0] + ' 12:00:00'; // formatting

      await updateTenantInMasterRegistry(token, masterSpreadsheetId, tenant.TenantID, {
        TrialEndAt: newEndStr,
        Status: tenant.Status === 'Suspended' || tenant.Status === 'Expired' ? 'Trial' : tenant.Status
      });

      setSuccessMessage(`Masa uji coba "${tenant.OrganizationName}" berhasil diperpanjang ${days} hari.`);
      setSelectedTenant(null);
      await loadData();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Gagal memperpanjang masa uji coba.');
    } finally {
      setSaving(false);
    }
  };

  const handleQuickActivate = async (tenant: TenantRegistry) => {
    if (!token || !masterSpreadsheetId) return;
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await updateTenantInMasterRegistry(token, masterSpreadsheetId, tenant.TenantID, {
        Status: 'Active'
      });
      setSuccessMessage(`Tenant "${tenant.OrganizationName}" telah diaktifkan secara manual.`);
      await loadData();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Gagal mengaktifkan tenant.');
    } finally {
      setSaving(false);
    }
  };

  // Filtered list
  const filteredTenants = tenants.filter(t => {
    const s = searchTerm.toLowerCase();
    return (
      t.OrganizationName?.toLowerCase().includes(s) ||
      t.OwnerName?.toLowerCase().includes(s) ||
      t.OwnerEmail?.toLowerCase().includes(s) ||
      t.City?.toLowerCase().includes(s) ||
      t.TenantID?.toLowerCase().includes(s)
    );
  });

  // Simple statistics
  const stats = {
    total: tenants.length,
    active: tenants.filter(t => t.Status === 'Active').length,
    trial: tenants.filter(t => t.Status === 'Trial').length,
    suspended: tenants.filter(t => t.Status === 'Suspended' || t.Status === 'Expired').length,
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6" id="dev-dashboard-root">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-slate-900 text-white">
              <Users className="w-5 h-5" />
            </span>
            <h1 className="font-display font-black text-2xl text-slate-900 tracking-tight">
              Developer Registry Dashboard
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-sans">
            Kelola seluruh tenant {brand.appName} yang terdaftar di Master Registry Google Sheets.
          </p>
        </div>
        
        <div className="flex items-center gap-2 self-stretch md:self-auto">
          <button
            onClick={loadData}
            disabled={loading}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-xs font-bold text-slate-600 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Segarkan
          </button>
          
          <a
            href={`https://docs.google.com/spreadsheets/d/${masterSpreadsheetId}/edit`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 transition-all flex items-center gap-1.5 cursor-pointer no-underline"
          >
            Buka Spreadsheet <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-extrabold text-rose-800 uppercase tracking-wider">Terjadi Kesalahan</h4>
            <p className="text-xs text-rose-600 mt-0.5 font-medium">{error}</p>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3 animate-fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-800 font-bold mt-0.5">{successMessage}</p>
        </div>
      )}

      {/* Stats Bento */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Registrasi', val: stats.total, color: 'text-slate-900 bg-slate-50 border-slate-100' },
          { label: 'Sesi Aktif', val: stats.active, color: 'text-emerald-700 bg-emerald-50/50 border-emerald-100/60' },
          { label: 'Masa Uji Coba (Trial)', val: stats.trial, color: 'text-amber-700 bg-amber-50/50 border-amber-100/60' },
          { label: 'Ditangguhkan (Suspended)', val: stats.suspended, color: 'text-rose-700 bg-rose-50/50 border-rose-100/60' },
        ].map((s, idx) => (
          <div key={idx} className={`p-4 rounded-2xl border ${s.color}`}>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">{s.label}</span>
            <span className="text-2xl font-display font-black block mt-1">{s.val}</span>
          </div>
        ))}
      </div>

      {/* Main Panel */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs">
        {/* Search */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Cari berdasarkan nama ${brand.orgLabel.toLowerCase()}, email owner, kota, atau Tenant ID...`}
            className="w-full bg-transparent text-xs outline-hidden font-medium text-slate-700 placeholder:text-slate-400"
          />
        </div>

        {/* Table / List */}
        {loading && tenants.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-slate-300" />
            Mengambil data dari Google Sheets...
          </div>
        ) : filteredTenants.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs font-medium">
            Tidak ada tenant yang cocok dengan pencarian Anda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  <th className="p-4">{brand.orgLabel} / Tenant ID</th>
                  <th className="p-4">Pemilik (Email)</th>
                  <th className="p-4">Kota & WA</th>
                  <th className="p-4">Edisi / Plan</th>
                  <th className="p-4">Status & Masa Uji Coba</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredTenants.map((tenant) => {
                  const isTrial = tenant.Status === 'Trial';
                  const isActive = tenant.Status === 'Active';
                  const isSuspended = tenant.Status === 'Suspended' || tenant.Status === 'Expired';
                  
                  // Calculate days remaining
                  let daysLeft = 0;
                  if (tenant.TrialEndAt) {
                    const diffTime = new Date(tenant.TrialEndAt).getTime() - Date.now();
                    daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  }

                  return (
                    <tr key={tenant.TenantID} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <div className="font-extrabold text-slate-800">{tenant.OrganizationName}</div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">{tenant.TenantID}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-700">{tenant.OwnerName}</div>
                        <div className="text-[10px] text-slate-400">{tenant.OwnerEmail}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-slate-700">{tenant.City || '-'}</div>
                        <div className="text-[10px] text-slate-400">{tenant.WhatsApp || '-'}</div>
                      </td>
                      <td className="p-4">
                        <div className="inline-flex items-center gap-1">
                          <span className="px-2 py-0.5 font-bold text-[9px] bg-slate-100 rounded text-slate-600">
                            {tenant.Edition}
                          </span>
                          <span className="px-2 py-0.5 font-bold text-[9px] bg-indigo-50 text-indigo-700 rounded border border-indigo-100">
                            {tenant.Plan}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <div>
                            {isActive ? (
                              <span className="px-2 py-0.5 rounded-full font-black text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                                ACTIVE
                              </span>
                            ) : isTrial ? (
                              <span className="px-2 py-0.5 rounded-full font-black text-[9px] bg-amber-50 text-amber-700 border border-amber-200">
                                TRIAL ({daysLeft > 0 ? `${daysLeft} hari lagi` : 'Habis'})
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full font-black text-[9px] bg-rose-50 text-rose-700 border border-rose-200">
                                SUSPENDED
                              </span>
                            )}
                          </div>
                          {isTrial && tenant.TrialEndAt && (
                            <span className="text-[9px] text-slate-400 font-medium">
                              Selesai: {tenant.TrialEndAt.split(' ')[0]}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Activate */}
                          {!isActive && (
                            <button
                              onClick={() => handleQuickActivate(tenant)}
                              title="Aktifkan Akun"
                              className="p-1.5 rounded-lg border border-emerald-100 hover:border-emerald-300 bg-emerald-50 text-emerald-800 transition-colors cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Extend Trial */}
                          {isTrial && (
                            <button
                              onClick={() => handleExtendTrialDirect(tenant, 15)}
                              title="Perpanjang Trial +15 Hari"
                              className="p-1.5 rounded-lg border border-amber-100 hover:border-amber-300 bg-amber-50 text-amber-800 transition-colors cursor-pointer"
                            >
                              <Calendar className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Full Edit */}
                          <button
                            onClick={() => handleSelectTenant(tenant)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold">Edit</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* EDIT MODAL DIALOG */}
      {selectedTenant && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] border border-slate-100 w-full max-w-lg overflow-hidden shadow-xl animate-fade-in">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-display font-black text-lg text-slate-900">
                  Ubah Tenant
                </h3>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                  ID: {selectedTenant.TenantID}
                </p>
              </div>
              <button
                onClick={() => setSelectedTenant(null)}
                className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Org & Owner info read-only */}
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Tenant Info</div>
                <div className="text-xs font-bold text-slate-800">{selectedTenant.OrganizationName}</div>
                <div className="text-[11px] text-slate-500">{selectedTenant.OwnerName} ({selectedTenant.OwnerEmail})</div>
              </div>

              {/* Status Selector */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Status Akun</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Trial', 'Active', 'Suspended', 'Expired'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setEditStatus(st)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                        editStatus === st
                          ? 'bg-slate-900 border-slate-900 text-white'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Plan and Edition */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Model Plan</label>
                  <select
                    value={editPlan}
                    onChange={(e) => setEditPlan(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl text-slate-700 outline-hidden"
                  >
                    <option value="Free">Free</option>
                    <option value="Trial">Trial</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Lifetime">Lifetime</option>
                  </select>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Edisi Aplikasi</label>
                  <select
                    value={editEdition}
                    onChange={(e) => setEditEdition(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl text-slate-700 outline-hidden"
                  >
                    <option value="Basic">Basic</option>
                    <option value="Pro">Pro</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>
              </div>

              {/* Quick Extend days */}
              {editStatus === 'Trial' && (
                <div className="p-4 border border-amber-100 bg-amber-50/40 rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    Perpanjang Masa Trial
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={extendDays}
                      onChange={(e) => setExtendDays(parseInt(e.target.value, 10) || 0)}
                      className="w-20 px-2 py-1 bg-white border border-slate-200 text-xs font-bold rounded-lg"
                    />
                    <span className="text-xs text-slate-500 font-medium">Hari</span>
                    
                    <button
                      type="button"
                      onClick={() => handleExtendTrialDirect(selectedTenant, extendDays)}
                      className="ml-auto px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-extrabold cursor-pointer"
                    >
                      Terapkan Perpanjangan
                    </button>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Catatan Internal / Logs</label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Masukkan catatan mengenai pendampingan atau status langganan..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-hidden min-h-20 text-slate-700 font-medium"
                />
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedTenant(null)}
                className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 cursor-pointer"
              >
                Batal
              </button>
              
              <button
                onClick={handleSaveTenant}
                disabled={saving}
                className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
