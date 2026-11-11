import React, { useState } from 'react';
import {
  Shield,
  Search,
  Plus,
  Trash2,
  Copy,
  Check,
  QrCode,
  Download,
  ExternalLink,
  Power,
  RotateCw,
  Clock,
  HardDrive,
  Users,
  Smartphone,
  Eye,
  X,
  Zap,
  RefreshCw,
} from 'lucide-react';
import QRCode from 'qrcode';
import { useServer } from '../context/ServerContext';
import { VPNConfig } from '../types';

export const ConfigsManagementView: React.FC = () => {
  const {
    vpnConfigs,
    deleteVPNConfig,
    updateVPNConfig,
    addToast,
    setActiveTab,
    language,
    isSyncingGitHubNodes,
    syncNodesFromGitHubPages,
  } = useServer();
  const isFa = language === 'fa';

  const [searchTerm, setSearchTerm] = useState('');
  const [protocolFilter, setProtocolFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // QR Modal
  const [activeModalConfig, setActiveModalConfig] = useState<VPNConfig | null>(null);
  const [modalQrUrl, setModalQrUrl] = useState<string>('');

  const filteredConfigs = vpnConfigs.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.serverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.protocol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProtocol = protocolFilter === 'all' || c.protocol === protocolFilter;
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesProtocol && matchesStatus;
  });

  const handleCopyLink = (config: VPNConfig) => {
    navigator.clipboard.writeText(config.rawLink);
    setCopiedId(config.id);
    addToast(isFa ? `کانفیگ ${config.name} در کلیپ‌بورد کپی شد` : 'Link copied', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShowQrModal = async (config: VPNConfig) => {
    setActiveModalConfig(config);
    try {
      const qr = await QRCode.toDataURL(config.rawLink, {
        width: 320,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' },
      });
      setModalQrUrl(qr);
    } catch (err) {
      console.warn('QR error:', err);
    }
  };

  const handleToggleStatus = (config: VPNConfig) => {
    const newStatus = config.status === 'active' ? 'disabled' : 'active';
    updateVPNConfig(config.id, { status: newStatus });
    addToast(
      isFa
        ? `وضعیت کانفیگ به ${newStatus === 'active' ? 'فعال' : 'غیرفعال'} تغییر یافت`
        : `Status changed to ${newStatus}`,
      'info'
    );
  };

  const handleRenewConfig = (config: VPNConfig) => {
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);
    updateVPNConfig(config.id, {
      expiresAt: expires.toISOString(),
      status: 'active',
    });
    addToast(isFa ? `کانفیگ ${config.name} به مدت ۳۰ روز تمدید شد` : 'Config renewed for 30 days', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-black border border-amber-500/30 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <h2 className="text-xl font-black text-amber-200">
              {isFa ? 'مدیریت و پایش کانفیگ‌های فعال (Configurations)' : 'VPN Configurations Management'}
            </h2>
          </div>
          <p className="text-xs text-zinc-400">
            {isFa
              ? 'مشاهده، ویرایش، حذف، تمدید، دریافت QR کد و کنترل سقف مصرف کانفیگ‌های متصل به سرورها'
              : 'Monitor, edit, delete, renew, and export client links across all operational nodes.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => syncNodesFromGitHubPages(true)}
            disabled={isSyncingGitHubNodes}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-500/40 text-amber-200 hover:text-white font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-lg cursor-pointer hover:border-amber-400 transition-all disabled:opacity-50"
            title="دریافت زنده و به‌روزرسانی نودها از nodes.txt گیت‌هاب پیجز"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isSyncingGitHubNodes ? 'animate-spin' : ''}`} />
            <span>{isFa ? 'همگام‌سازی از GitHub Pages' : 'Sync from GitHub Pages'}</span>
          </button>

          <button
            onClick={() => {
              const activeLinks = vpnConfigs.filter((c) => c.status === 'active').map((c) => c.rawLink).join('\n');
              navigator.clipboard.writeText(activeLinks);
              addToast('تمام کانفیگ‌های فعال یکجا کپی شدند! در v2rayNG گزینه Import from clipboard را بزنید.', 'success');
            }}
            className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
          >
            <Copy className="w-4 h-4" />
            <span>کپی همه کانفیگ‌ها برای ویتوری</span>
          </button>

          <button
            onClick={() => setActiveTab('vpn-generator')}
            className="px-4 py-2 rounded-xl gold-gradient text-black font-bold text-xs flex items-center gap-2 shrink-0 shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{isFa ? 'تولید کانفیگ جدید' : 'Generate New Config'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isFa ? 'جستجو در نام کانفیگ، نام کاربری یا سرور...' : 'Search configs, users or nodes...'}
            className="w-full pr-9 pl-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Protocol filter */}
          <select
            value={protocolFilter}
            onChange={(e) => setProtocolFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 focus:outline-hidden focus:border-amber-400"
          >
            <option value="all">{isFa ? 'همه پروتکل‌ها' : 'All Protocols'}</option>
            <option value="vless">VLESS</option>
            <option value="vmess">VMess</option>
            <option value="trojan">Trojan</option>
            <option value="shadowsocks">Shadowsocks</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 focus:outline-hidden focus:border-amber-400"
          >
            <option value="all">{isFa ? 'همه وضعیت‌ها' : 'All Statuses'}</option>
            <option value="active">{isFa ? 'فعال' : 'Active'}</option>
            <option value="expired">{isFa ? 'منقضی شده' : 'Expired'}</option>
            <option value="disabled">{isFa ? 'غیرفعال' : 'Disabled'}</option>
          </select>
        </div>
      </div>

      {/* Config Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredConfigs.map((cfg) => {
          const isCopied = copiedId === cfg.id;
          const usagePercent = Math.min(100, Math.round((cfg.dataUsedGB / cfg.dataLimitGB) * 100));

          return (
            <div
              key={cfg.id}
              className={`p-4 rounded-2xl border transition-all ${
                cfg.status === 'active'
                  ? 'bg-zinc-950 border-amber-500/30 hover:border-amber-400 shadow-lg'
                  : 'bg-zinc-950/60 border-zinc-800 opacity-75'
              }`}
            >
              {/* Header: Name & Badge */}
              <div className="flex items-start justify-between gap-2 mb-2 pb-2 border-b border-zinc-800/80">
                <div>
                  <h4 className="text-xs font-bold text-white truncate max-w-[180px]">{cfg.name}</h4>
                  <span className="text-[10px] text-zinc-400 font-mono">کاربر: @{cfg.username}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold uppercase ${
                      cfg.protocol === 'vless'
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                        : cfg.protocol === 'vmess'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : cfg.protocol === 'trojan'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {cfg.protocol}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      cfg.status === 'active' ? 'bg-emerald-400' : 'bg-rose-500'
                    }`}
                    title={cfg.status}
                  />
                </div>
              </div>

              {/* Server & Transport Info */}
              <div className="space-y-1.5 text-[11px] text-zinc-300 font-mono mb-3">
                <div className="flex justify-between">
                  <span className="text-zinc-500">سرور:</span>
                  <span className="text-zinc-200 truncate max-w-[160px]">{cfg.serverName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">پورت / رمزنگاری:</span>
                  <span className="text-amber-300 font-bold">{cfg.port} / {cfg.tls.toUpperCase()} ({cfg.transport})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">دستگاه همزمان:</span>
                  <span className="text-zinc-200">{cfg.maxDevices} کاربر</span>
                </div>
              </div>

              {/* Traffic Progress */}
              <div className="space-y-1 mb-4">
                <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                  <span>مصرف حجم:</span>
                  <span>
                    {cfg.dataUsedGB} / {cfg.dataLimitGB} GB ({usagePercent}%)
                  </span>
                </div>
                <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      usagePercent > 80 ? 'bg-rose-500' : 'bg-amber-400'
                    }`}
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-zinc-800 text-xs">
                <button
                  onClick={() => handleCopyLink(cfg)}
                  className="py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-amber-300 font-medium flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  title="کپی لینک مستقیم"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="text-[10px]">{isCopied ? 'کپی شد' : 'کپی'}</span>
                </button>

                <button
                  onClick={() => handleShowQrModal(cfg)}
                  className="py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  title="نمایش کد QR"
                >
                  <QrCode className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10px]">QR</span>
                </button>

                <button
                  onClick={() => handleRenewConfig(cfg)}
                  className="py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  title="تمدید ۳۰ روزه"
                >
                  <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[10px]">تمدید</span>
                </button>

                <button
                  onClick={() => deleteVPNConfig(cfg.id)}
                  className="py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-medium flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  title="حذف کانفیگ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="text-[10px]">حذف</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredConfigs.length === 0 && (
        <div className="text-center py-12 p-6 bg-zinc-950 rounded-2xl border border-zinc-800 text-zinc-400">
          <Shield className="w-10 h-10 mx-auto mb-2 text-zinc-600" />
          <p className="text-xs font-bold">هیچ کانفیگی با فیلتر انتخابی شما یافت نشد.</p>
        </div>
      )}

      {/* QR Code Modal */}
      {activeModalConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-zinc-950 border border-amber-500/40 rounded-2xl p-5 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="text-xs font-bold text-amber-300 truncate max-w-[220px]">
                {activeModalConfig.name}
              </span>
              <button
                onClick={() => setActiveModalConfig(null)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {modalQrUrl && (
              <div className="p-3 bg-white rounded-xl mx-auto inline-block shadow-lg">
                <img src={modalQrUrl} alt="QR Code" className="w-48 h-48 object-contain" />
              </div>
            )}

            <p className="text-[11px] text-zinc-400 leading-relaxed font-mono">
              پروتکل: {activeModalConfig.protocol.toUpperCase()} · سرور: {activeModalConfig.serverName}
            </p>

            <button
              onClick={() => handleCopyLink(activeModalConfig)}
              className="w-full py-2.5 rounded-xl gold-gradient text-black font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>کپی لینک مستقیم اتصال</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
