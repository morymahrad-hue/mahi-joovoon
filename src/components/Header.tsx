import React, { useState } from 'react';
import {
  Bell,
  Copy,
  Check,
  Menu,
  Power,
  RotateCw,
  Server,
  Terminal,
  Activity,
  Zap,
  Globe,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useServer } from '../context/ServerContext';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar }) => {
  const {
    vpsStatus,
    metrics,
    subscription,
    triggerReboot,
    setActiveTab,
    notifications,
    markNotificationAsRead,
    clearNotifications,
    addToast,
    language,
    setLanguage,
    vpnConfigs,
  } = useServer();

  const isFa = language === 'fa';
  const [copiedIp, setCopiedIp] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRebootConfirm, setShowRebootConfirm] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const copyIpAddress = () => {
    navigator.clipboard.writeText(subscription.ipAddress);
    setCopiedIp(true);
    addToast(isFa ? `آدرس آی‌پی ${subscription.ipAddress} در کلیپ‌بورد کپی شد.` : `IP ${subscription.ipAddress} copied.`, 'info');
    setTimeout(() => setCopiedIp(false), 2000);
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    return isFa ? `${days} روز و ${hours} ساعت` : `${days}d ${hours}h`;
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-black/90 backdrop-blur-md border-b border-amber-500/20 px-4 lg:px-6 py-2.5 transition-colors">
        <div className="flex items-center justify-between gap-4">
          {/* Right Section (in RTL: Start of header) */}
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Hamburger */}
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-lg bg-zinc-900 border border-amber-500/30 text-amber-300 hover:text-white transition-colors cursor-pointer"
              aria-label="باز کردن منو"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Platform & Server Identity */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center text-black font-black shadow-md ring-1 ring-amber-300/40">
                <Sparkles className="w-5 h-5 text-black" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-amber-300 text-sm tracking-wider font-mono">
                    MAHI JOOVOON
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold font-mono">
                    Xray / Marzban Node 1
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {isFa ? 'آنلاین' : 'Online'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <span className="font-mono text-zinc-300">{vpsStatus.username}@{vpsStatus.port}</span>
                  <span aria-hidden="true" className="text-zinc-600">·</span>
                  <button
                    onClick={copyIpAddress}
                    className="font-mono text-amber-300 hover:text-amber-100 flex items-center gap-1 transition-colors group cursor-pointer"
                    title="کپی آدرس IP"
                  >
                    <span>{vpsStatus.host || '185.190.142.88'}</span>
                    {copiedIp ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-zinc-500 group-hover:text-amber-300" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Left Section (in RTL: End of header) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Generator Shortcut */}
            <button
              onClick={() => setActiveTab('vpn-generator')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-black" />
              <span>{isFa ? 'تولید کانفیگ سریع' : 'Quick Generator'}</span>
            </button>

            {/* Language Switch */}
            <button
              onClick={() => setLanguage(language === 'fa' ? 'en' : 'fa')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-amber-500/30 text-amber-300 hover:text-white text-xs font-mono font-bold transition-colors cursor-pointer"
              title="تغییر زبان"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{language.toUpperCase()}</span>
            </button>

            {/* Quick Terminal Button */}
            <button
              onClick={() => setActiveTab('terminal')}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-200 transition-colors cursor-pointer"
              title="ترمینال خط فرمان لینوکس"
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>ترمینال</span>
            </button>

            {/* Reboot Server Action Button */}
            <button
              onClick={() => setShowRebootConfirm(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-medium text-rose-300 transition-colors cursor-pointer"
              title="راه‌اندازی مجدد سرویس"
            >
              <RotateCw className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">{isFa ? 'ری‌استارت' : 'Reboot'}</span>
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition-colors cursor-pointer"
                aria-label="اعلان‌ها"
              >
                <Bell className="w-4 h-4 text-amber-300" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-black text-[10px] flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-80 sm:w-96 rounded-xl bg-zinc-950 border border-amber-500/30 shadow-2xl p-3 z-50 text-right animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-2">
                    <span className="text-xs font-bold text-amber-200">
                      {isFa ? 'اعلان‌های MAHI JOOVOON' : 'System Notifications'}
                    </span>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearNotifications}
                        className="text-[11px] text-zinc-400 hover:text-amber-300 transition-colors cursor-pointer"
                      >
                        {isFa ? 'پاک کردن همه' : 'Clear All'}
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-zinc-500 py-6 text-center">
                        {isFa ? 'هیچ اعلان جدیدی وجود ندارد.' : 'No new notifications.'}
                      </p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationAsRead(n.id)}
                          className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                            n.read
                              ? 'bg-zinc-900/40 border-zinc-800/50 text-zinc-400'
                              : 'bg-zinc-900 border-amber-500/30 text-zinc-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-amber-200">{n.title}</span>
                            <span className="text-[10px] text-zinc-500">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-zinc-400 leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Reboot Confirm Modal */}
      {showRebootConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-zinc-950 border border-amber-500/30 rounded-2xl p-5 max-w-sm w-full shadow-2xl text-right animate-in fade-in">
            <div className="flex items-center gap-3 mb-3 text-rose-400">
              <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <Power className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">
                {isFa ? 'تأیید راه‌اندازی مجدد سرور و هسته Xray' : 'Confirm Reboot & Xray Reload'}
              </h3>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed mb-4">
              {isFa
                ? 'آیا از راه‌اندازی مجدد سرور مطمئن هستید؟ دیمن‌های VPN به صورت خودکار توسط Systemd فعال باقی خواهند ماند.'
                : 'Are you sure you want to reload the server and restart Xray services? Systemd will ensure zero downtime.'}
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowRebootConfirm(false)}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-medium text-zinc-300 transition-colors cursor-pointer"
              >
                {isFa ? 'انصراف' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  setShowRebootConfirm(false);
                  triggerReboot();
                }}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                {isFa ? 'بله، ری‌استارت کن' : 'Yes, Reboot'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
