import React from 'react';
import { RefreshCw, Server, CheckCircle2, Terminal } from 'lucide-react';
import { useServer } from '../context/ServerContext';

export const RebootModal: React.FC = () => {
  const { isRebooting, rebootProgress } = useServer();

  if (!isRebooting) return null;

  const getStep = () => {
    if (rebootProgress < 25) return 'ارسال سیگنال SIGTERM به پروسس‌های فعال و آزادسازی حافظه...';
    if (rebootProgress < 50) return 'خاموش‌سازی امن کرنل لینوکس و سینک دیسک‌های NVMe...';
    if (rebootProgress < 75) return 'راه‌اندازی مجدد ماژول مجازی KVM و لود گراب (GRUB)...';
    if (rebootProgress < 95) return 'بارگذاری سرویس‌های Systemd، Nginx، پایگاه‌داده و شبکه...';
    return 'اتصال مجدد شل امن و برقراری ارتباط با پنل سرور...';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-6 max-w-md w-full shadow-2xl text-center">
        <div className="relative mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
          <Server className="w-8 h-8 animate-pulse" />
          <RefreshCw className="w-5 h-5 absolute -top-1 -right-1 text-cyan-300 animate-spin" />
        </div>

        <h3 className="text-lg font-bold text-white mb-1">راه‌اندازی مجدد سرور مجازی (Reboot)</h3>
        <p className="text-xs text-slate-400 mb-6">سرور vps-tehran-01 در حال ری‌استارت نرم‌افزاری است.</p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-2 mb-3 overflow-hidden border border-slate-700">
          <div
            className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-full transition-all duration-500 ease-out"
            style={{ width: `${rebootProgress}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[11px] text-slate-400 mb-4 font-mono">
          <span>{rebootProgress}% Completed</span>
          <span>vps-tehran-01</span>
        </div>

        {/* Current sub-action log */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 text-right">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-1">
            <Terminal className="w-3.5 h-3.5" />
            <span>گزارش وضعیت سیستم:</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">{getStep()}</p>
        </div>
      </div>
    </div>
  );
};
