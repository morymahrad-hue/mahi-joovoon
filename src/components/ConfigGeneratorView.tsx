import React, { useState } from 'react';
import {
  Zap,
  Copy,
  Check,
  QrCode,
  Download,
  Share2,
  RefreshCw,
  Server,
  Layers,
  Shield,
  Key,
  Globe,
  Smartphone,
  Cpu,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import QRCode from 'qrcode';
import { useServer } from '../context/ServerContext';
import { VPNProtocol, VPNTransport, VPNTLS, VPNFlow, VPNConfig } from '../types';
import { buildFullConfig, generateUUID, generatePassword } from '../utils/vpnConfigEngine';

export const ConfigGeneratorView: React.FC = () => {
  const { vpnServers, vpnUsers, addVPNConfig, addToast, setActiveTab, language } = useServer();
  const isFa = language === 'fa';

  // Generator form states
  const [name, setName] = useState('کانفیگ طلایی مهی');
  const [selectedProtocol, setSelectedProtocol] = useState<VPNProtocol>('vless');
  const [selectedServerId, setSelectedServerId] = useState<string>(vpnServers[0]?.id || 'srv-de-01');
  const [selectedUserId, setSelectedUserId] = useState<string>(vpnUsers[0]?.id || '');
  const [transport, setTransport] = useState<VPNTransport>('tcp');
  const [tls, setTls] = useState<VPNTLS>('reality');
  const [flow, setFlow] = useState<VPNFlow>('xtls-rprx-vision');
  const [dataLimitGB, setDataLimitGB] = useState<number>(50);
  const [durationDays, setDurationDays] = useState<number>(30);
  const [maxDevices, setMaxDevices] = useState<number>(2);

  // Advanced overrides & Iran Anti-Censorship Tuning
  const [showAdvanced, setShowAdvanced] = useState(true);
  const [customUuid, setCustomUuid] = useState(generateUUID());
  const [customPassword, setCustomPassword] = useState(generatePassword(16));
  const [fragmentEnabled, setFragmentEnabled] = useState(true);
  const [fragmentPackets, setFragmentPackets] = useState('tlshello');
  const [fragmentLength, setFragmentLength] = useState('100-200');
  const [fragmentInterval, setFragmentInterval] = useState('10-20');
  const [muxEnabled, setMuxEnabled] = useState(false);
  const [muxConcurrency, setMuxConcurrency] = useState(8);
  const [fingerprint, setFingerprint] = useState('chrome');
  const [alpn, setAlpn] = useState('h2,http/1.1');
  const [presetMode, setPresetMode] = useState<'mci' | 'irancell' | 'gaming' | 'custom'>('mci');

  // Generated config result
  const [generatedConfig, setGeneratedConfig] = useState<VPNConfig | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [exportTab, setExportTab] = useState<'link' | 'clash' | 'singbox' | 'xray'>('link');
  const [copiedFormat, setCopiedFormat] = useState(false);

  // Protocols List
  const protocols: Array<{ id: VPNProtocol; name: string; desc: string; badge: string; popular?: boolean }> = [
    {
      id: 'vless',
      name: 'VLESS (Reality / TLS)',
      desc: isFa ? 'پرسرعت‌ترین و امن‌ترین پروتکل ضد فیلترینگ با پینگ فوق‌العاده پایین' : 'Fastest anti-censorship protocol with Reality handshake',
      badge: isFa ? 'پیشنهاد طلایی' : 'Top Choice',
      popular: true,
    },
    {
      id: 'vmess',
      name: 'VMess (WebSocket / gRPC)',
      desc: isFa ? 'سازگاری ۱۰۰٪ با تمامی اپراتورهای همراه اول، ایرانسل و رایتل' : 'Universal compatibility across mobile and broadband networks',
      badge: 'Popular',
    },
    {
      id: 'trojan',
      name: 'Trojan (TLS WebSocket)',
      desc: isFa ? 'شبیه‌سازی کامل وب‌سایت‌های بین‌المللی HTTPS برای پایداری مطلق' : 'Perfect HTTPS camouflage for strict firewalls',
      badge: 'Secure',
    },
    {
      id: 'shadowsocks',
      name: 'Shadowsocks (AEAD)',
      desc: isFa ? 'سبک‌ترین پروتکل برای انواع روترها و سیستم‌های ترید و گیمینگ' : 'Lightweight AEAD cipher for low latency gaming & routers',
      badge: 'Gaming',
    },
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const server = vpnServers.find((s) => s.id === selectedServerId) || vpnServers[0];
    const user = vpnUsers.find((u) => u.id === selectedUserId);

    if (!server) {
      addToast(isFa ? 'لطفاً یک سرور انتخاب کنید' : 'Please select a server', 'error');
      return;
    }

    const newConfig = buildFullConfig(server, selectedProtocol, {
      name: name.trim() || 'MAHI-JOOVOON-VIP',
      username: user ? user.username : 'guest_vip',
      userId: user ? user.id : undefined,
      transport,
      tls,
      flow,
      dataLimitGB: Number(dataLimitGB) || 50,
      durationDays: Number(durationDays) || 30,
      maxDevices: Number(maxDevices) || 2,
      customUuid: selectedProtocol === 'vless' || selectedProtocol === 'vmess' ? customUuid : undefined,
      customPassword: selectedProtocol === 'trojan' || selectedProtocol === 'shadowsocks' ? customPassword : undefined,
      fingerprint,
      alpn,
      fragment: {
        enabled: fragmentEnabled,
        packets: fragmentPackets,
        length: fragmentLength,
        interval: fragmentInterval,
      },
      mux: {
        enabled: muxEnabled,
        concurrency: Number(muxConcurrency) || 8,
      },
    });

    // Generate QR Code
    try {
      const qr = await QRCode.toDataURL(newConfig.rawLink, {
        width: 320,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      setQrCodeDataUrl(qr);
    } catch (err) {
      console.warn('QR Code generation error:', err);
    }

    setGeneratedConfig(newConfig);
    await addVPNConfig(newConfig);
  };

  const handleCopyLink = () => {
    if (!generatedConfig) return;
    navigator.clipboard.writeText(generatedConfig.rawLink);
    setCopiedLink(true);
    addToast(isFa ? 'لینک کانفیگ با موفقیت کپی شد!' : 'Config URI copied to clipboard!', 'success');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyExport = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFormat(true);
    addToast(isFa ? 'محتوا در کلیپ‌بورد کپی شد!' : 'Export copied to clipboard!', 'info');
    setTimeout(() => setCopiedFormat(false), 2000);
  };

  const handleDownloadClash = () => {
    if (!generatedConfig?.clashYaml) return;
    const blob = new Blob([generatedConfig.clashYaml], { type: 'text/yaml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${generatedConfig.name.replace(/\s+/g, '_')}_clash.yaml`;
    link.click();
    URL.revokeObjectURL(url);
    addToast(isFa ? 'فایل کانفیگ Clash دانلود شد' : 'Clash YAML downloaded', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r from-zinc-950 via-zinc-900 to-black border border-amber-500/30 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-md bg-amber-400/20 text-amber-300 font-bold text-xs border border-amber-400/30 flex items-center gap-1 font-mono">
                <Flame className="w-3.5 h-3.5 fill-amber-300" />
                MAHI JOOVOON CORE ENGINE
              </span>
              <span className="text-xs text-zinc-400">Xray & Sing-Box Native</span>
            </div>
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">
              {isFa ? 'موتور قدرتمند تولید کانفیگ اختصاصی VPN' : 'Advanced VPN Configuration Generator'}
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              {isFa
                ? 'تولید کانفیگ‌های بدون محدودیت با رمزنگاری پیشرفته بر اساس پروتکل‌های VLESS Reality, VMess, Trojan و Shadowsocks سازگار با تمام اپراتورها و کلاینت‌های V2rayNG, v2rayN, Sing-box, Clash و Streisand.'
                : 'Generate unlimited cryptographic configurations for VLESS, VMess, Trojan, and Shadowsocks fully compliant with Xray-core standards.'}
            </p>
          </div>

          <button
            onClick={() => setActiveTab('vpn-configs')}
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Shield className="w-4 h-4 text-amber-400" />
            <span>{isFa ? 'مشاهده همه کانفیگ‌ها' : 'View All Configs'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Configuration Builder (7 cols) */}
        <div className="lg:col-span-7 bg-zinc-950/90 border border-amber-500/20 rounded-2xl p-5 shadow-xl">
          <form onSubmit={handleGenerate} className="space-y-5">
            {/* 1. Protocol Selector */}
            <div>
              <label className="block text-xs font-bold text-amber-300 mb-2">
                {isFa ? '۱. انتخاب پروتکل ارتباطی (Protocol):' : '1. Select VPN Protocol:'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {protocols.map((proto) => {
                  const isSelected = selectedProtocol === proto.id;
                  return (
                    <div
                      key={proto.id}
                      onClick={() => {
                        setSelectedProtocol(proto.id);
                        if (proto.id === 'vless') {
                          setTls('reality');
                          setTransport('tcp');
                          setFlow('xtls-rprx-vision');
                        } else if (proto.id === 'vmess') {
                          setTls('tls');
                          setTransport('ws');
                          setFlow('none');
                        } else if (proto.id === 'trojan') {
                          setTls('tls');
                          setTransport('ws');
                          setFlow('none');
                        } else {
                          setTls('none');
                          setTransport('tcp');
                          setFlow('none');
                        }
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border-amber-400 text-white shadow-md'
                          : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold ${isSelected ? 'text-amber-300' : 'text-zinc-200'}`}>
                          {proto.name}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono ${
                            proto.popular
                              ? 'bg-amber-400/30 text-amber-200 border border-amber-400/40'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {proto.badge}
                        </span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-zinc-400">{proto.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Config Name & User Assignment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  {isFa ? 'نام و عنوان کانفیگ (Remark):' : 'Config Name / Remark:'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: آلمان VIP پرسرعت"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-hidden focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  {isFa ? 'تخصیص به کاربر (اختیاری):' : 'Assign to User (Optional):'}
                </label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-hidden focus:border-amber-400"
                >
                  <option value="">{isFa ? '— بدون اتصال (کانفیگ عمومی) —' : '— Unassigned (Public) —'}</option>
                  {vpnUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.fullName} (@{u.username})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. Server Node Selector */}
            <div>
              <label className="block text-xs font-bold text-amber-300 mb-1">
                {isFa ? '۲. انتخاب سرور میزبان (Server Node):' : '2. Select Host Server Node:'}
              </label>
              <select
                value={selectedServerId}
                onChange={(e) => setSelectedServerId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-hidden focus:border-amber-400"
              >
                {vpnServers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.flag} {s.country} - {s.name} ({s.host}:{selectedProtocol === 'vless' ? s.vlessPort : selectedProtocol === 'vmess' ? s.vmessPort : selectedProtocol === 'trojan' ? s.trojanPort : s.ssPort}) · پینگ: {s.pingMs}ms
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Limits: Traffic & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  {isFa ? 'سقف حجم (گیگابایت):' : 'Traffic Limit (GB):'}
                </label>
                <input
                  type="number"
                  min={1}
                  max={2000}
                  value={dataLimitGB}
                  onChange={(e) => setDataLimitGB(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white font-mono focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  {isFa ? 'مدت اعتبار (روز):' : 'Duration (Days):'}
                </label>
                <input
                  type="number"
                  min={1}
                  max={365}
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white font-mono focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  {isFa ? 'تعداد دستگاه مجاز:' : 'Max Devices:'}
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={maxDevices}
                  onChange={(e) => setMaxDevices(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white font-mono focus:outline-hidden focus:border-amber-400"
                />
              </div>
            </div>

            {/* Toggle Advanced */}
            <div className="pt-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center justify-between w-full cursor-pointer py-1"
              >
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isFa ? 'تنظیمات پیشرفته دور زدن فیلترینگ ایران (Fragment, Mux, uTLS)' : 'Advanced Anti-Censorship (Fragment, Mux, uTLS)'}</span>
                </span>
                <span className="text-[11px] text-zinc-500 font-mono">{showAdvanced ? '▲ بستن' : '▼ باز کردن و تنظیم'}</span>
              </button>

              {showAdvanced && (
                <div className="mt-3 p-4 rounded-xl bg-zinc-900/95 border border-amber-500/20 space-y-4 animate-in fade-in text-xs">
                  {/* Preset Selector */}
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1.5 font-bold">
                      {isFa ? 'پریست‌های آماده بر اساس اپراتور سیم‌کارت:' : 'Quick Operator Presets:'}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setPresetMode('mci');
                          setFragmentEnabled(true);
                          setFragmentPackets('tlshello');
                          setFragmentLength('100-200');
                          setFragmentInterval('10-20');
                          setFingerprint('chrome');
                          setAlpn('h2,http/1.1');
                          setMuxEnabled(false);
                          addToast('پریست بهینه‌شده ویژه همراه اول اعمال شد', 'info');
                        }}
                        className={`p-2 rounded-lg border text-right transition-all cursor-pointer ${
                          presetMode === 'mci'
                            ? 'bg-amber-400/20 border-amber-400/40 text-amber-200 font-bold'
                            : 'bg-black/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <div className="text-[11px] font-bold">📱 همراه اول (MCI)</div>
                        <div className="text-[9px] text-zinc-500 font-mono">Fragment 100-200</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setPresetMode('irancell');
                          setFragmentEnabled(true);
                          setFragmentPackets('tlshello');
                          setFragmentLength('50-100');
                          setFragmentInterval('10-15');
                          setFingerprint('chrome');
                          setAlpn('h2,http/1.1');
                          setMuxEnabled(false);
                          addToast('پریست بهینه‌شده ویژه ایرانسل اعمال شد', 'info');
                        }}
                        className={`p-2 rounded-lg border text-right transition-all cursor-pointer ${
                          presetMode === 'irancell'
                            ? 'bg-amber-400/20 border-amber-400/40 text-amber-200 font-bold'
                            : 'bg-black/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <div className="text-[11px] font-bold">📱 ایرانسل (MTN)</div>
                        <div className="text-[9px] text-zinc-500 font-mono">Fragment 50-100</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setPresetMode('gaming');
                          setFragmentEnabled(false);
                          setMuxEnabled(true);
                          setMuxConcurrency(8);
                          setFingerprint('chrome');
                          setAlpn('h2');
                          addToast('پریست گیمینگ و کاهش تاخیر پینگ اعمال شد', 'info');
                        }}
                        className={`p-2 rounded-lg border text-right transition-all cursor-pointer ${
                          presetMode === 'gaming'
                            ? 'bg-amber-400/20 border-amber-400/40 text-amber-200 font-bold'
                            : 'bg-black/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <div className="text-[11px] font-bold">⚡ پینگ پایین / گیم</div>
                        <div className="text-[9px] text-zinc-500 font-mono">Mux Concurrency 8</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPresetMode('custom')}
                        className={`p-2 rounded-lg border text-right transition-all cursor-pointer ${
                          presetMode === 'custom'
                            ? 'bg-amber-400/20 border-amber-400/40 text-amber-200 font-bold'
                            : 'bg-black/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <div className="text-[11px] font-bold">🛠 سفارشی دستی</div>
                        <div className="text-[9px] text-zinc-500 font-mono">Custom Tuning</div>
                      </button>
                    </div>
                  </div>

                  {/* Section: Fragmenting Feature */}
                  <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="font-bold text-white text-[11px]">
                          تکه‌تکه کردن پکت هندشیک (Fragment Anti-DPI)
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={fragmentEnabled}
                          onChange={(e) => setFragmentEnabled(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-400"></div>
                      </label>
                    </div>

                    {fragmentEnabled && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-zinc-800/60">
                        <div>
                          <label className="block text-[10px] text-zinc-400 mb-1">نوع پکت‌ها (Packets):</label>
                          <select
                            value={fragmentPackets}
                            onChange={(e) => setFragmentPackets(e.target.value)}
                            className="w-full px-2 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white"
                          >
                            <option value="tlshello">tlshello (توصیه اکید)</option>
                            <option value="1-3">1-3 (۳ پکت اول)</option>
                            <option value="all">all (تمام بسته‌ها)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] text-zinc-400 mb-1">طول قطعات (Length):</label>
                          <input
                            type="text"
                            value={fragmentLength}
                            onChange={(e) => setFragmentLength(e.target.value)}
                            placeholder="100-200"
                            className="w-full px-2 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-amber-300 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-zinc-400 mb-1">فاصله زمانی (Interval ms):</label>
                          <input
                            type="text"
                            value={fragmentInterval}
                            onChange={(e) => setFragmentInterval(e.target.value)}
                            placeholder="10-20"
                            className="w-full px-2 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-amber-300 font-mono"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Section: Mux Multiplexing */}
                  <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        <span className="font-bold text-white text-[11px]">
                          مالتی‌پلکسینگ (Multiplexing / Mux)
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={muxEnabled}
                          onChange={(e) => setMuxEnabled(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                      </label>
                    </div>

                    {muxEnabled && (
                      <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
                        <span className="text-[10px] text-zinc-400">تعداد اتصالات هم‌زمان (Concurrency):</span>
                        <select
                          value={muxConcurrency}
                          onChange={(e) => setMuxConcurrency(Number(e.target.value))}
                          className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs text-cyan-300 font-mono"
                        >
                          <option value={4}>4 Streams</option>
                          <option value={8}>8 Streams (استاندارد)</option>
                          <option value={16}>16 Streams (فوق‌سریع)</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Section: TLS, Fingerprint & Flow */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1">فینگرپرینت (uTLS):</label>
                      <select
                        value={fingerprint}
                        onChange={(e) => setFingerprint(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg bg-black border border-zinc-800 text-xs text-white"
                      >
                        <option value="chrome">Chrome (گوگل کروم)</option>
                        <option value="ios">iOS (آیفون سافاری)</option>
                        <option value="firefox">Firefox (فایرفاکس)</option>
                        <option value="safari">Safari (مک)</option>
                        <option value="random">Randomized</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1">مذاکره ALPN:</label>
                      <select
                        value={alpn}
                        onChange={(e) => setAlpn(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg bg-black border border-zinc-800 text-xs text-white"
                      >
                        <option value="h2,http/1.1">h2,http/1.1 (ترکیبی)</option>
                        <option value="http/1.1">http/1.1 (پایدار)</option>
                        <option value="h2">h2 (فقط HTTP/2)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1">شبکه انتقال (Transport):</label>
                      <select
                        value={transport}
                        onChange={(e) => setTransport(e.target.value as VPNTransport)}
                        className="w-full px-2 py-1.5 rounded-lg bg-black border border-zinc-800 text-xs text-white"
                      >
                        <option value="ws">WebSocket (WS - پیشنهادی)</option>
                        <option value="tcp">TCP (Reality)</option>
                        <option value="grpc">gRPC (Gun / Multi)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1">امنیت (TLS):</label>
                      <select
                        value={tls}
                        onChange={(e) => setTls(e.target.value as VPNTLS)}
                        className="w-full px-2 py-1.5 rounded-lg bg-black border border-zinc-800 text-xs text-white"
                      >
                        <option value="tls">Standard TLS (پورت 443)</option>
                        <option value="reality">Reality (Vision)</option>
                        <option value="none">بدون TLS (ساده)</option>
                      </select>
                    </div>
                  </div>

                  {/* UUID & Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-800">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] text-zinc-400 font-mono">شناسه کاربری (UUID):</label>
                        <button
                          type="button"
                          onClick={() => setCustomUuid(generateUUID())}
                          className="text-[10px] text-amber-400 hover:underline cursor-pointer"
                        >
                          تولید مجدد
                        </button>
                      </div>
                      <input
                        type="text"
                        value={customUuid}
                        onChange={(e) => setCustomUuid(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-black border border-zinc-800 text-xs text-amber-300 font-mono"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] text-zinc-400 font-mono">گذرواژه امن (Password):</label>
                        <button
                          type="button"
                          onClick={() => setCustomPassword(generatePassword(16))}
                          className="text-[10px] text-amber-400 hover:underline cursor-pointer"
                        >
                          تولید مجدد
                        </button>
                      </div>
                      <input
                        type="text"
                        value={customPassword}
                        onChange={(e) => setCustomPassword(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-black border border-zinc-800 text-xs text-amber-300 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-sm tracking-wide shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>{isFa ? 'تولید فوری کانفیگ اختصاصی MAHI JOOVOON' : 'GENERATE MAHI JOOVOON CONFIG'}</span>
            </button>
          </form>
        </div>

        {/* Right Output: QR Code & Formats (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-zinc-950 border border-amber-500/30 rounded-2xl p-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold">
                  <QrCode className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-amber-200">
                  {isFa ? 'خروجی کانفیگ و اسکن سریع' : 'Live Config Output & QR'}
                </h3>
              </div>

              {generatedConfig && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                  {generatedConfig.protocol.toUpperCase()}
                </span>
              )}
            </div>

            {generatedConfig ? (
              <div className="space-y-4">
                {/* QR Code Canvas */}
                {qrCodeDataUrl && (
                  <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white shadow-inner">
                    <img src={qrCodeDataUrl} alt="VPN QR Code" className="w-48 h-48 object-contain" />
                    <span className="text-[10px] text-zinc-700 font-mono font-bold mt-1 text-center">
                      Scan with V2rayNG, Sing-box, or Streisand
                    </span>
                  </div>
                )}

                {/* Quick Copy Link Box */}
                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                    {isFa ? 'لینک مستقیم کانفیگ (URI):' : 'Direct Config URI:'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={generatedConfig.rawLink}
                      className="w-full pl-20 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] text-amber-300 font-mono"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="absolute left-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-black text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedLink ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedLink ? (isFa ? 'کپی شد' : 'Copied') : (isFa ? 'کپی' : 'Copy')}</span>
                    </button>
                  </div>
                </div>

                {/* Export Tabs: Link / Clash / Sing-box / Xray */}
                <div className="pt-2 border-t border-zinc-800">
                  <div className="flex items-center gap-1 p-1 bg-zinc-900 rounded-xl mb-2 text-[11px]">
                    <button
                      onClick={() => setExportTab('link')}
                      className={`flex-1 py-1 rounded-lg font-medium cursor-pointer transition-colors ${
                        exportTab === 'link' ? 'bg-amber-400/20 text-amber-300 font-bold' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      خلاصه کانفیگ
                    </button>
                    <button
                      onClick={() => setExportTab('clash')}
                      className={`flex-1 py-1 rounded-lg font-medium cursor-pointer transition-colors ${
                        exportTab === 'clash' ? 'bg-amber-400/20 text-amber-300 font-bold' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Clash Meta
                    </button>
                    <button
                      onClick={() => setExportTab('singbox')}
                      className={`flex-1 py-1 rounded-lg font-medium cursor-pointer transition-colors ${
                        exportTab === 'singbox' ? 'bg-amber-400/20 text-amber-300 font-bold' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Sing-box
                    </button>
                    <button
                      onClick={() => setExportTab('xray')}
                      className={`flex-1 py-1 rounded-lg font-medium cursor-pointer transition-colors ${
                        exportTab === 'xray' ? 'bg-amber-400/20 text-amber-300 font-bold' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Xray JSON
                    </button>
                  </div>

                  {exportTab === 'link' && (
                    <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-[11px] space-y-1.5 font-mono">
                      <div className="flex justify-between">
                        <span className="text-zinc-400 font-sans">سرور:</span>
                        <span className="text-white font-bold">{generatedConfig.serverName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400 font-sans">پروتکل / پورت:</span>
                        <span className="text-amber-300">{generatedConfig.protocol.toUpperCase()} : {generatedConfig.port}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400 font-sans">رمزنگاری:</span>
                        <span className="text-emerald-400">{generatedConfig.tls.toUpperCase()} ({generatedConfig.transport})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400 font-sans">فینگرپرینت uTLS:</span>
                        <span className="text-amber-300 font-bold">{generatedConfig.fingerprint || 'chrome'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400 font-sans">وضعیت Fragment:</span>
                        <span className="text-emerald-400 font-bold">
                          {generatedConfig.fragment?.enabled ? `فعال (${generatedConfig.fragment.length}, ${generatedConfig.fragment.interval}ms)` : 'غیرفعال'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400 font-sans">سقف حجم / اعتبار:</span>
                        <span className="text-zinc-200">{generatedConfig.dataLimitGB} GB ({durationDays} روز)</span>
                      </div>
                    </div>
                  )}

                  {exportTab === 'clash' && (
                    <div className="relative">
                      <pre className="p-2.5 rounded-xl bg-black border border-zinc-800 text-[10px] text-zinc-300 overflow-x-auto max-h-36 font-mono">
                        {generatedConfig.clashYaml}
                      </pre>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleCopyExport(generatedConfig.clashYaml || '')}
                          className="flex-1 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs text-amber-300 font-medium cursor-pointer"
                        >
                          کپی کد Clash
                        </button>
                        <button
                          onClick={handleDownloadClash}
                          className="px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>دانلود فایل</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {exportTab === 'singbox' && (
                    <div className="relative">
                      <pre className="p-2.5 rounded-xl bg-black border border-zinc-800 text-[10px] text-zinc-300 overflow-x-auto max-h-36 font-mono">
                        {generatedConfig.singboxJson}
                      </pre>
                      <button
                        onClick={() => handleCopyExport(generatedConfig.singboxJson || '')}
                        className="w-full mt-2 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs text-amber-300 font-medium cursor-pointer"
                      >
                        کپی JSON برای Sing-box
                      </button>
                    </div>
                  )}

                  {exportTab === 'xray' && (
                    <div className="relative">
                      <pre className="p-2.5 rounded-xl bg-black border border-zinc-800 text-[10px] text-zinc-300 overflow-x-auto max-h-36 font-mono">
                        {generatedConfig.xrayJson}
                      </pre>
                      <button
                        onClick={() => handleCopyExport(generatedConfig.xrayJson || '')}
                        className="w-full mt-2 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs text-amber-300 font-medium cursor-pointer"
                      >
                        کپی خروجی Xray Core
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 px-4">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Zap className="w-7 h-7" />
                </div>
                <h4 className="text-xs font-bold text-zinc-200">
                  {isFa ? 'کانفیگی هنوز تولید نشده است' : 'No Config Generated Yet'}
                </h4>
                <p className="text-[11px] text-zinc-500 mt-1 max-w-xs mx-auto">
                  {isFa
                    ? 'مشخصات مورد نظر خود را در فرم سمت راست تعیین نموده و بر روی دکمه تولید کلیک نمایید.'
                    : 'Select your preferred protocol and click Generate to see live QR code and client links.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
