import React from 'react';
import {
  Users,
  Shield,
  Zap,
  Server,
  DollarSign,
  HardDrive,
  TrendingUp,
  Activity,
  Flame,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Repeat,
  Radio,
  Clock,
  Terminal,
} from 'lucide-react';
import { useServer } from '../context/ServerContext';

export const DashboardView: React.FC = () => {
  const {
    vpnStats,
    vpnServers,
    vpnConfigs,
    vpnUsers,
    vpnTransactions,
    metrics,
    setActiveTab,
    language,
    addToast,
  } = useServer();

  const isFa = language === 'fa';

  const lowTrafficCount = vpnUsers.filter(
    (u) => (u.dataUsedGB / u.dataLimitGB) >= 0.8
  ).length;

  return (
    <div className="space-y-6">
      {/* Top Brand Banner */}
      <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r from-zinc-950 via-zinc-900 to-black border border-amber-500/30 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
              <span className="px-2.5 py-0.5 rounded-md gold-gradient text-black font-black text-xs shadow-md tracking-wider">
                MAHI JOOVOON · مهی جووون
              </span>
              <span className="text-xs text-zinc-400 font-mono">Xray Core v2.4 + Marzban API</span>
            </div>
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">
              {isFa ? 'داشبورد جامع مدیریت و تولید کانفیگ VPN' : 'Enterprise VPN Generator & Management Dashboard'}
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              {isFa
                ? 'پلتفرم اختصاصی مهی جووون برای تولید کانفیگ‌های بدون محدودیت VLESS, VMess, Trojan, Shadowsocks، مدیریت ترافیک، نودهای ابری بین‌المللی و پرداخت‌های ریالی.'
                : 'Commercial multi-node VPN orchestrator with instant client configs, subscriptions, user quota limits and financial reporting.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('vpn-generator')}
              className="px-4 py-2.5 rounded-xl gold-gradient text-black font-black text-xs flex items-center gap-2 shadow-xl cursor-pointer hover:opacity-95 transition-all"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>{isFa ? 'تولید کانفیگ فوری' : 'Generate Config'}</span>
            </button>
            <button
              onClick={() => setActiveTab('vpn-users')}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>{isFa ? 'کاربران' : 'Users'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-amber-500/30 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>تعداد کل کاربران</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {vpnUsers.length} <span className="text-xs text-zinc-400 font-normal">کاربر</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
            <span className="text-emerald-400 font-bold">{vpnUsers.filter((u) => u.status === 'active').length} فعال</span>
            <span className="text-rose-400">{vpnUsers.filter((u) => u.status === 'expired').length} منقضی</span>
          </div>
        </div>

        {/* Total Configs */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-amber-500/30 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>کانفیگ‌های فعال</span>
            <Shield className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300 font-mono">
            {vpnConfigs.length} <span className="text-xs text-zinc-400 font-normal">کانفیگ</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
            <span>VLESS, VMess, Trojan, SS</span>
            <span className="text-emerald-400 font-bold">۱۰۰٪ آنلاین</span>
          </div>
        </div>

        {/* Active Nodes */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-amber-500/30 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>سرورها و نودهای فعال</span>
            <Server className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {vpnServers.length} <span className="text-xs text-zinc-400 font-normal">نود اختصاصی</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
            <span>🇩🇪 🇫🇮 🇳🇱 🇹🇷 🇺🇸</span>
            <span className="text-emerald-400 font-bold">میانگین پینگ: ۳۶ms</span>
          </div>
        </div>

        {/* Revenue */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-amber-500/30 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>درآمد کل فروش</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-300 font-mono">
            {vpnStats.totalRevenueToman.toLocaleString('fa-IR')} <span className="text-xs text-zinc-400 font-normal">تومان</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>امروز: {vpnStats.todayRevenueToman.toLocaleString('fa-IR')} ت</span>
          </div>
        </div>
      </div>

      {/* Warnings & Alerts */}
      {lowTrafficCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              <strong>هشدار هوشمند مهی جووون:</strong> تعداد {lowTrafficCount} کاربر بیش از ۸۰٪ سقف حجم مجاز خود را مصرف کرده‌اند.
            </span>
          </div>
          <button
            onClick={() => setActiveTab('vpn-users')}
            className="px-3 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 font-bold border border-amber-400/30 cursor-pointer"
          >
            مشاهده و تمدید
          </button>
        </div>
      )}

      {/* Operational Nodes & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Clustered Server Nodes (7 cols) */}
        <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-white">وضعیت نودهای بین‌المللی MAHI JOOVOON</h3>
            </div>
            <button
              onClick={() => setActiveTab('vpn-servers')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium"
            >
              مدیریت نودها
            </button>
          </div>

          <div className="space-y-2.5">
            {vpnServers.map((s) => (
              <div
                key={s.id}
                className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{s.flag}</span>
                  <div>
                    <span className="font-bold text-white block">{s.name}</span>
                    <span className="text-[10px] text-zinc-400 font-mono">{s.host}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 font-mono">
                  <span className="text-zinc-400 text-[11px]">{s.activeUsers} کاربر</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                    {s.pingMs}ms
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Config Generator Shortcut & Latest Configs (5 cols) */}
        <div className="lg:col-span-5 bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-white">آخرین کانفیگ‌های تولیدشده</h3>
            </div>
            <button
              onClick={() => setActiveTab('vpn-configs')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium"
            >
              مشاهده همه
            </button>
          </div>

          <div className="space-y-2.5">
            {vpnConfigs.slice(0, 4).map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-white block truncate max-w-[170px]">{c.name}</span>
                  <span className="text-[10px] text-zinc-400 font-mono">کاربر: @{c.username}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold uppercase">
                    {c.protocol}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveTab('vpn-generator')}
            className="w-full py-2.5 rounded-xl gold-gradient text-black font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md mt-2"
          >
            <Zap className="w-3.5 h-3.5 fill-black" />
            <span>تولید کانفیگ جدید با لینک و بارکد QR</span>
          </button>
        </div>
      </div>
    </div>
  );
};
