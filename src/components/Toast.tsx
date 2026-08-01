import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, X, CloudCheck, Clock } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error';
  title: string;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full px-4 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const isSuccess = toast.type === 'success';
  const isWarning = toast.type === 'warning';
  const isError = toast.type === 'error';

  return (
    <div
      className={`pointer-events-auto p-4 rounded-2xl border shadow-xl backdrop-blur-md transition-all transform animate-slide-in flex items-start gap-3 ${
        isSuccess
          ? 'bg-emerald-900/90 text-white border-emerald-700 shadow-emerald-950/20'
          : isWarning
          ? 'bg-amber-900/90 text-white border-amber-700 shadow-amber-950/20'
          : 'bg-rose-900/90 text-white border-rose-700 shadow-rose-950/20'
      }`}
    >
      <div className="mt-0.5 shrink-0">
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
        {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
        {isError && <XCircle className="w-5 h-5 text-rose-400" />}
      </div>

      <div className="flex-1 pr-2">
        <div className="font-bold text-sm leading-snug">{toast.title}</div>
        <div className="text-xs opacity-90 mt-1 leading-relaxed">{toast.message}</div>
      </div>

      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 hover:bg-white/20 rounded-lg text-white/70 hover:text-white transition-colors cursor-pointer shrink-0"
        aria-label="Tutup"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
