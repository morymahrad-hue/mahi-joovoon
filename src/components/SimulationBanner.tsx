import React, { useState } from 'react';
import {
  ShieldAlert,
  Server,
  Key,
  CheckCircle2,
  Terminal,
  ExternalLink,
  Copy,
  Check,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { useServer } from '../context/ServerContext';

export const SimulationBanner: React.FC = () => {
  const { vpsStatus, setActiveTab, disconnectVPS, addToast } = useServer();
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const bashScript = `curl -fsSL ${window.location.origin}/api/vps/install-script | bash`;

  const copyScript = () => {
    navigator.clipboard.writeText(bashScript);
    setCopied(true);
    addToast('دستور اسکریپت آماده‌سازی در کلیپ‌بورد کپی شد.', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  if (vpsStatus.isConnected) {
    return (
      <div className="bg-gradient-to-r from-emerald-500/15 via-emerald-500/10 to-transparent border-y sm:border sm:rounded-xl border-emerald-500/30 px-4 py-3 mb-5 text-xs text-emerald-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0 border border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-emerald-300">متصل به سرور ابری اوبونتو (Real Ubuntu Cloud VPS):</span>
              <span className="font-mono text-cyan-300 font-bold">{vpsStatus.username}@{vpsStatus.host}:{vpsStatus.port}</span>
            </div>
            <p className="text-emerald-200/80 mt-0.5">
              سیستم‌عامل: <span className="font-semibold text-white">{vpsStatus.osInfo || 'Ubuntu Linux'}</span> · تمامی برنامه‌ها و ربات بله از طریق Systemd به‌صورت ۲۴ ساعته مستقل از گوشی یا مرورگر شما در حال اجرا هستند.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          <button
            onClick={() => setActiveTab('terminal')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>ترمینال زنده</span>
          </button>
          <button
            onClick={disconnectVPS}
            className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-medium transition-colors cursor-pointer"
          >
            قطع اتصال
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-transparent border-y sm:border sm:rounded-xl border-amber-500/30 px-4 py-3 mb-5 text-xs text-amber-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 border border-amber-500/30">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-300">وضعیت: عدم اتصال به سرور مجازی واقعی (VPS Disconnected)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-medium">
                اجرای جعلی مسدود است
              </span>
            </div>
            <p className="text-amber-200/80 mt-0.5 leading-relaxed">
              برای اینکه سرور، پروژه‌ها و ربات بله مستقل از گوشی، مرورگر و پایان سشن به کار خود ادامه دهند، اتصال SSH به سرور اوبونتو لازم است. سیستم از تولید لاگ‌ها و داده‌های ساختگی خودداری می‌کند.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          <button
            onClick={() => setShowScriptModal(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>اسکریپت راه‌اندازی سریع</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Key className="w-3.5 h-3.5" />
            <span>اتصال SSH به سرور</span>
          </button>
        </div>
      </div>

      {/* Quick Setup Modal */}
      {showScriptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 max-w-lg w-full shadow-2xl text-right animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>اسکریپت خودکار آماده‌سازی سرور اوبونتو (One-Line Setup)</span>
              </h3>
              <button
                onClick={() => setShowScriptModal(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                بستن
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              اگر به تازگی سرور مجازی اوبونتو تهیه کرده‌اید، با اجرای این تک‌خط در ترمینال سرور خود، کلیه پیش‌نیازها شامل پایتون ۳، Balethon، کتابخانه هوش مصنوعی Google GenAI و فایروال UFW خودکار نصب می‌شوند:
            </p>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 flex items-center justify-between gap-2 mb-4" dir="ltr">
              <span className="truncate">{bashScript}</span>
              <button
                onClick={copyScript}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0 cursor-pointer"
                title="کپی دستور"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800 mb-4">
              <span className="font-semibold text-slate-300 block mb-1">اقدامات انجام‌شده توسط اسکریپت:</span>
              <div>✓ به‌روزرسانی مخازن لینوکس (`apt-get update`)</div>
              <div>✓ نصب مفسر Python3 و بسته‌های `balethon` و `google-genai`</div>
              <div>✓ پیکربندی فایروال UFW برای پورت‌های ۲۲، ۸۰، ۴۴۳ و ۸۴۴۳ وب‌هوک</div>
              <div>✓ ایجاد دایرکتوری پایدار `/var/www/bale-bot`</div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setShowScriptModal(false);
                  setActiveTab('settings');
                }}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                رفتن به فرم اتصال SSH
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
