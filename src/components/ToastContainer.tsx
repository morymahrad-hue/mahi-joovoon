import React from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { useServer } from '../context/ServerContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useServer();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border shadow-xl backdrop-blur-md transition-all text-xs font-medium animate-in fade-in slide-in-from-bottom-2 ${
            toast.type === 'success'
              ? 'bg-slate-900/95 border-emerald-500/40 text-emerald-200'
              : toast.type === 'error'
              ? 'bg-slate-900/95 border-rose-500/40 text-rose-200'
              : toast.type === 'warning'
              ? 'bg-slate-900/95 border-amber-500/40 text-amber-200'
              : 'bg-slate-900/95 border-cyan-500/40 text-cyan-200'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {toast.type === 'error' && <XCircle className="w-4 h-4 text-rose-400" />}
            {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-cyan-400" />}
          </div>
          <div className="flex-1 leading-relaxed">{toast.message}</div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="text-slate-400 hover:text-slate-200 transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
