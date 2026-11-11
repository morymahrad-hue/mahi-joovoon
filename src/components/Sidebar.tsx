import React from 'react';
import {
  LayoutDashboard,
  Shield,
  Zap,
  Users,
  Repeat,
  Server,
  CreditCard,
  Headphones,
  BarChart3,
  Terminal,
  FolderTree,
  Boxes,
  Bot,
  Activity,
  Settings,
  X,
  ChevronLeft,
  Flame,
} from 'lucide-react';
import { PageTab } from '../types';
import { useServer } from '../context/ServerContext';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { activeTab, setActiveTab, vpnConfigs, vpnUsers, vpnServers, language, setLanguage } = useServer();

  const isFa = language === 'fa';

  const vpnNavItems: Array<{
    id: PageTab;
    titleFa: string;
    titleEn: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    badgeColor?: string;
  }> = [
    {
      id: 'dashboard',
      titleFa: 'داشبورد مدیریتی',
      titleEn: 'Admin Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'vpn-generator',
      titleFa: 'موتور تولید کانفیگ',
      titleEn: 'Config Generator',
      icon: Zap,
      badge: isFa ? 'طلایی' : 'VIP',
      badgeColor: 'bg-amber-400/20 text-amber-300 border border-amber-400/40',
    },
    {
      id: 'vpn-configs',
      titleFa: 'مدیریت کانفیگ‌ها',
      titleEn: 'Configs Management',
      icon: Shield,
      badge: vpnConfigs.length,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    },
    {
      id: 'vpn-users',
      titleFa: 'مدیریت کاربران',
      titleEn: 'User Management',
      icon: Users,
      badge: vpnUsers.length,
      badgeColor: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
    },
    {
      id: 'vpn-subscriptions',
      titleFa: 'سیستم اشتراک و لینک',
      titleEn: 'Subscriptions',
      icon: Repeat,
    },
    {
      id: 'vpn-servers',
      titleFa: 'مدیریت سرورها و نودها',
      titleEn: 'Multi-Node Servers',
      icon: Server,
      badge: `${vpnServers.length} نود`,
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    },
    {
      id: 'vpn-payments',
      titleFa: 'سیستم مالی و پرداخت',
      titleEn: 'Billing & Payments',
      icon: CreditCard,
    },
    {
      id: 'vpn-support',
      titleFa: 'سیستم تیکت و پشتیبانی',
      titleEn: 'Support Tickets',
      icon: Headphones,
      badge: '۲۴/۷',
      badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    },
    {
      id: 'vpn-analytics',
      titleFa: 'آنالیز ترافیک و فروش',
      titleEn: 'Traffic & Sales',
      icon: BarChart3,
    },
  ];

  const sysNavItems: Array<{
    id: PageTab;
    titleFa: string;
    titleEn: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    badgeColor?: string;
  }> = [
    {
      id: 'terminal',
      titleFa: 'ترمینال زنده لینوکس',
      titleEn: 'SSH Web Terminal',
      icon: Terminal,
      badge: 'root',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    },
    {
      id: 'files',
      titleFa: 'مدیریت فایل‌های سرور',
      titleEn: 'File Manager',
      icon: FolderTree,
    },
    {
      id: 'projects',
      titleFa: 'سرویس‌های پایتون و نود',
      titleEn: 'Services & Daemons',
      icon: Boxes,
    },
    {
      id: 'bale-bot',
      titleFa: 'ربات هوشمند بله',
      titleEn: 'Bale Messenger Bot',
      icon: Bot,
      badge: 'آنلاین',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    },
    {
      id: 'status',
      titleFa: 'پایش سخت‌افزار سرور',
      titleEn: 'Hardware Telemetry',
      icon: Activity,
    },
    {
      id: 'settings',
      titleFa: 'تنظیمات و امنیت نودها',
      titleEn: 'Settings & Security',
      icon: Settings,
    },
  ];

  const handleSelectTab = (tab: PageTab) => {
    setActiveTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 ${isFa ? 'right-0 border-l' : 'left-0 border-r'} z-40 w-72 bg-gradient-to-b from-black via-zinc-950 to-black border-amber-500/20 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : isFa ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Header in Sidebar */}
        <div className="flex items-center justify-between p-4 border-b border-amber-500/20 lg:hidden">
          <div className="flex items-center gap-2">
            <span className="font-black text-amber-400 text-sm tracking-wider">MAHI JOOVOON</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Brand / Logo Section (Desktop & Mobile) */}
        <div className="p-4 border-b border-amber-500/20 bg-gradient-to-r from-zinc-950 via-zinc-900 to-black">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Luxury Gold Metallic Logo Icon */}
              <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center text-black font-black text-lg shadow-lg ring-1 ring-amber-300/40">
                <Flame className="w-6 h-6 text-black fill-black" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="font-black text-sm tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">
                    MAHI JOOVOON
                  </h1>
                </div>
                <p className="text-[10px] text-amber-300/80 font-medium">
                  {isFa ? 'مهی جووون · پلتفرم تولید کانفیگ' : 'Luxury VPN Generator'}
                </p>
              </div>
            </div>

            {/* Language Switcher Button */}
            <button
              onClick={() => setLanguage(language === 'fa' ? 'en' : 'fa')}
              className="px-2 py-1 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-[10px] font-mono text-amber-300 font-bold transition-all cursor-pointer"
              title="تغییر زبان / Switch Language"
            >
              {language === 'fa' ? 'EN' : 'فا'}
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {/* SECTION 1: MAHI JOOVOON VPN SUITE */}
          <div>
            <div className="px-3 pb-1.5 text-[10px] font-bold text-amber-400/90 tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
              <span>{isFa ? 'مدیریت و تولید کانفیگ مهی جووون' : 'MAHI JOOVOON VPN ENGINE'}</span>
            </div>

            <div className="space-y-0.5">
              {vpnNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent text-amber-200 border border-amber-500/40 shadow-xs'
                        : 'text-zinc-400 hover:text-amber-200 hover:bg-zinc-900/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive ? 'text-amber-400' : 'text-zinc-500 group-hover:text-amber-300'
                        }`}
                      />
                      <span>{isFa ? item.titleFa : item.titleEn}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono ${
                            item.badgeColor || 'bg-zinc-800 text-zinc-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {isActive && <ChevronLeft className={`w-3.5 h-3.5 text-amber-400 ${!isFa ? 'rotate-180' : ''}`} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: HOSTING & LINUX INFRASTRUCTURE */}
          <div className="pt-2 border-t border-zinc-800/80">
            <div className="px-3 pb-1.5 text-[10px] font-bold text-zinc-400 tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
              <span>{isFa ? 'زیرساخت سرور ابری و لینوکس' : 'CLOUD & VPS INFRASTRUCTURE'}</span>
            </div>

            <div className="space-y-0.5">
              {sysNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-200 border border-cyan-500/40 shadow-xs'
                        : 'text-zinc-400 hover:text-cyan-200 hover:bg-zinc-900/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive ? 'text-cyan-400' : 'text-zinc-500 group-hover:text-cyan-300'
                        }`}
                      />
                      <span>{isFa ? item.titleFa : item.titleEn}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono ${
                            item.badgeColor || 'bg-zinc-800 text-zinc-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {isActive && <ChevronLeft className={`w-3.5 h-3.5 text-cyan-400 ${!isFa ? 'rotate-180' : ''}`} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Brand Seal & Persistence Badge */}
        <div className="p-3 border-t border-amber-500/20 bg-gradient-to-t from-black via-zinc-950 to-zinc-950 space-y-2">
          <div className="flex items-center justify-between px-1 text-[10px] text-zinc-400 font-medium">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>ذخیره خودکار: فعال</span>
            </span>
            <span className="text-zinc-500 font-mono">Auto-Saved</span>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-amber-500/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <div>
                <span className="font-bold text-amber-200 block text-[11px]">MAHI JOOVOON VIP</span>
                <span className="text-[9px] text-zinc-400">Xray & GitHub Cloud v4.2</span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
              100% SAVE
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
