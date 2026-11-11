import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Activity,
  Users,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  HardDrive,
  Globe,
  Radio,
  Zap,
} from 'lucide-react';
import { useServer } from '../context/ServerContext';

export const AnalyticsSalesView: React.FC = () => {
  const { vpnStats, vpnServers, vpnTransactions, language } = useServer();
  const isFa = language === 'fa';

  const trafficNodes = [
    { country: 'آلمان (Frankfurt)', flag: '🇩🇪', usageGB: 1840, totalGB: 10000, percent: 18.4, ping: 38 },
    { country: 'فنلاند (Helsinki)', flag: '🇫🇮', usageGB: 1220, totalGB: 10000, percent: 12.2, ping: 44 },
    { country: 'هلند (Amsterdam)', flag: '🇳🇱', usageGB: 2890, totalGB: 15000, percent: 19.2, ping: 48 },
    { country: 'ترکیه (Istanbul)', flag: '🇹🇷', usageGB: 3410, totalGB: 8000, percent: 42.6, ping: 22 },
    { country: 'آمریکا (New York)', flag: '🇺🇸', usageGB: 950, totalGB: 20000, percent: 4.7, ping: 110 },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-black border border-amber-500/30 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-md bg-amber-400/20 text-amber-300 font-bold text-xs border border-amber-400/30 font-mono">
              FINANCIAL & TRAFFIC METRICS
            </span>
          </div>
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">
            {isFa ? 'تحلیل و آمار ترافیک، فروش و درآمدهای پلتفرم' : 'Traffic Analytics & Financial Metrics'}
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            {isFa
              ? 'گزارش تجمیعی فروش روزانه، هفتگی و ماهانه، مصرف ترافیک به تفکیک نودها و نمودارهای رشد کاربران.'
              : 'Real-time telemetry and revenue tracking across nodes and active client sessions.'}
          </p>
        </div>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-950 border border-amber-500/30 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>درآمد کل پلتفرم</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-300 font-mono">
            {vpnStats.totalRevenueToman.toLocaleString('fa-IR')} <span className="text-xs text-zinc-400 font-normal">تومان</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+۲۴.۵٪ نسبت به ماه گذشته</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>درآمد ۲۴ ساعت گذشته</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">
            {vpnStats.todayRevenueToman.toLocaleString('fa-IR')} <span className="text-xs text-zinc-400 font-normal">تومان</span>
          </div>
          <span className="text-[11px] text-zinc-500 font-mono">۷ سفارش ثبت شده</span>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>درآمد ۷ روز گذشته</span>
            <BarChart3 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">
            {vpnStats.weeklyRevenueToman.toLocaleString('fa-IR')} <span className="text-xs text-zinc-400 font-normal">تومان</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-mono">+۱۲٪ رشد هفتگی</span>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>ترافیک کل رد و بدل شده</span>
            <HardDrive className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">
            {vpnStats.usedBandwidthGB.toLocaleString('fa-IR')} <span className="text-xs text-zinc-400 font-normal">GB</span>
          </div>
          <span className="text-[11px] text-zinc-400 font-mono">از {vpnStats.totalBandwidthGB.toLocaleString('fa-IR')} GB سهمیه کل</span>
        </div>
      </div>

      {/* Traffic Per Node Breakdown */}
      <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <h3 className="text-xs font-bold text-amber-200">میزان مصرف ترافیک به تفکیک نودهای کشورهای مختلف</h3>
          <span className="text-xs font-mono text-zinc-400">۵ نود فعال در شبکه</span>
        </div>

        <div className="space-y-4">
          {trafficNodes.map((n, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-2 text-white font-bold">
                  <span>{n.flag}</span>
                  <span>{n.country}</span>
                </span>
                <span className="text-zinc-400">
                  <strong className="text-amber-300">{n.usageGB} GB</strong> / {n.totalGB} GB ({n.percent}%) · پینگ: {n.ping}ms
                </span>
              </div>
              <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                  style={{ width: `${n.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
