import React, { useState } from 'react';
import {
  Activity,
  Cpu,
  Database,
  HardDrive,
  Network,
  RotateCw,
  Power,
  ShieldCheck,
  Search,
  Flame,
  Clock,
  Layers,
  Thermometer,
  Zap,
} from 'lucide-react';
import { useServer } from '../context/ServerContext';

export const ServerStatusView: React.FC = () => {
  const {
    metrics,
    services,
    restartService,
    toggleService,
    processes,
    killProcess,
    subscription,
  } = useServer();

  const [procSearch, setProcSearch] = useState('');
  const [procSort, setProcSort] = useState<'cpu' | 'mem'>('cpu');

  const filteredProcesses = processes
    .filter(
      (p) =>
        p.command.toLowerCase().includes(procSearch.toLowerCase()) ||
        String(p.pid).includes(procSearch)
    )
    .sort((a, b) => (procSort === 'cpu' ? b.cpu - a.cpu : b.mem - a.mem));

  const formatUptimeFull = (seconds: number) => {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${d} روز، ${h} ساعت، ${m} دقیقه و ${s} ثانیه`;
  };

  return (
    <div className="space-y-6">
      {/* Header Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">وضعیت جامع سخت‌افزار و منابع سرور</h2>
          </div>
          <p className="text-xs text-slate-400">
            مانیتورینگ بلادرنگ هسته‌های پردازنده، تخصیص رم، پارتیشن‌های دیسک و پراسس‌های سطح سیستم‌عامل لینوکس.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-400 font-sans">آپ‌تایم:</span>
          <span className="text-white font-medium">{formatUptimeFull(metrics.uptimeSeconds)}</span>
        </div>
      </div>

      {/* Grid: CPU Core Breakdown + RAM Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CPU Cores Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>پردازشگر: Intel Xeon Gold (4 هسته مجازی)</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Thermometer className="w-3.5 h-3.5 text-amber-400" />
              <span>دمای CPU: {metrics.temperatureC}°C</span>
            </div>
          </div>

          <div className="space-y-3">
            {metrics.cpuCores.map((coreUsage, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">هسته {index} (Core {index})</span>
                  <span className="text-white font-bold">{coreUsage}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      coreUsage > 75 ? 'bg-rose-500' : coreUsage > 50 ? 'bg-amber-500' : 'bg-cyan-500'
                    }`}
                    style={{ width: `${coreUsage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400 font-mono">
            <span>میانگین بارگذاری (Load Avg):</span>
            <span className="text-cyan-300 font-bold">{metrics.loadAverage.join(' · ')}</span>
          </div>
        </div>

        {/* RAM & Swap Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>تخصیص حافظه اصلی و حافظه مجازی (RAM / SWAP)</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">8.0 GB RAM</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">حافظه فیزیکی (RAM Used)</span>
                <span className="text-emerald-400 font-mono font-bold">
                  {metrics.ramUsedGB} GB / {metrics.ramTotalGB} GB (
                  {Math.round((metrics.ramUsedGB / metrics.ramTotalGB) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${(metrics.ramUsedGB / metrics.ramTotalGB) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">بافر و فایل‌کش لینوکس (Cached Memory)</span>
                <span className="text-cyan-400 font-mono font-bold">
                  {metrics.ramCachedGB} GB / {metrics.ramTotalGB} GB
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-cyan-500 transition-all duration-300"
                  style={{ width: `${(metrics.ramCachedGB / metrics.ramTotalGB) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">فضای حافظه مجازی (Swap File)</span>
                <span className="text-amber-400 font-mono font-bold">
                  {metrics.swapUsedGB} GB / {metrics.swapTotalGB} GB (3%)
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-500"
                  style={{ width: '3%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Disk Partitions & Network Throughput */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Disk Partitions */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <HardDrive className="w-4 h-4 text-amber-400" />
              <span>پارتیشن‌های ذخیره‌سازی NVMe</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">ext4 filesystem</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1 font-mono">
                <span className="text-slate-300">/ (Root Partition - NVMe)</span>
                <span className="text-amber-300 font-bold">
                  {metrics.diskUsedGB} GB / {metrics.diskTotalGB} GB (31%)
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="h-full rounded-full bg-amber-500" style={{ width: '31%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-mono">
                <span className="text-slate-300">/mnt/backups (Secondary Volume)</span>
                <span className="text-slate-400 font-bold">112 GB / 500 GB (22%)</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="h-full rounded-full bg-blue-500" style={{ width: '22%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Network & I/O Rate */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Network className="w-4 h-4 text-blue-400" />
              <span>ترافیک ورودی و خروجی شبکه (eth0)</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">1000 Mbps Port</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block mb-1">دانلود دریافتی (RX)</span>
              <span className="text-base font-bold font-mono text-white">{metrics.netInKbps} KB/s</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block mb-1">آپلود ارسالی (TX)</span>
              <span className="text-base font-bold font-mono text-cyan-300">{metrics.netOutKbps} KB/s</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
            <span>آی‌پی سرور:</span>
            <span className="text-slate-200">{subscription.ipAddress}</span>
          </div>
        </div>
      </div>

      {/* Running Linux Processes Table (HTOP Style) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">پروسس‌های فعال سرور (Process Table)</h3>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={procSearch}
                onChange={(e) => setProcSearch(e.target.value)}
                placeholder="فیلتر نام یا PID..."
                className="w-full pl-3 pr-8 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => setProcSort('cpu')}
                className={`px-2 py-1 rounded-md cursor-pointer ${
                  procSort === 'cpu' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                CPU%
              </button>
              <button
                onClick={() => setProcSort('mem')}
                className={`px-2 py-1 rounded-md cursor-pointer ${
                  procSort === 'mem' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                MEM%
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-medium">
              <tr>
                <th className="py-2.5 px-3">شناسه (PID)</th>
                <th className="py-2.5 px-3">کاربر (User)</th>
                <th className="py-2.5 px-3">مصرف CPU %</th>
                <th className="py-2.5 px-3">مصرف RAM %</th>
                <th className="py-2.5 px-3">مدت زمان اجرا</th>
                <th className="py-2.5 px-3">فرمان / سرویس (Command)</th>
                <th className="py-2.5 px-3 text-left">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {filteredProcesses.map((proc) => (
                <tr key={proc.pid} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 text-cyan-300 font-bold">{proc.pid}</td>
                  <td className="py-2.5 px-3 text-slate-400">{proc.user}</td>
                  <td className="py-2.5 px-3 text-white font-bold">{proc.cpu}%</td>
                  <td className="py-2.5 px-3 text-emerald-400 font-bold">{proc.mem}%</td>
                  <td className="py-2.5 px-3 text-slate-400">{proc.uptime}</td>
                  <td className="py-2.5 px-3 text-slate-200 truncate max-w-xs">{proc.command}</td>
                  <td className="py-2.5 px-3 text-left">
                    <button
                      onClick={() => killProcess(proc.pid)}
                      className="px-2 py-0.5 rounded-md bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer text-[10px]"
                      title="Kill Process (SIGKILL)"
                    >
                      Kill PID
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
