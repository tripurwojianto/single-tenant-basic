/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi Tindakan',
  message,
  confirmText = 'Ya, Hapus',
  cancelText = 'Batal',
  isLoading = false
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      id="confirmation-modal-container"
    >
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={isLoading ? undefined : onClose}
      />

      {/* Modal Card */}
      <div 
        className="bg-white rounded-[32px] w-full max-w-sm shadow-2xl border border-slate-100 p-6 text-center relative z-10 animate-scale-in"
        id="confirmation-modal-card"
      >
        {/* Warning Icon Container */}
        <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100/50">
          <AlertTriangle className="w-6 h-6 animate-pulse" />
        </div>

        {/* Text */}
        <h3 className="font-display font-black text-lg text-slate-950 mb-2 tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-slate-600 mb-6 leading-relaxed font-semibold">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-xs font-black text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-2xl cursor-pointer transition-colors disabled:opacity-50"
            id="confirmation-cancel-btn"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className="flex-1 px-5 py-2.5 text-xs font-black text-white bg-rose-600 hover:bg-rose-700 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
            id="confirmation-confirm-btn"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
