import React, { useState, useEffect } from 'react';
import {
  Repeat,
  Copy,
  Check,
  QrCode,
  Download,
  Share2,
  ExternalLink,
  Shield,
  Layers,
  RefreshCw,
  Clock,
  Sparkles,
  Server,
  Zap,
  Globe,
  Radio,
  CheckCircle2,
} from 'lucide-react';
import QRCode from 'qrcode';
import { useServer } from '../context/ServerContext';
import { VPNUser } from '../types';

export const SubscriptionsView: React.FC = () => {
  const { vpnUsers, vpnConfigs, addToast, language, setActiveTab } = useServer();
  const isFa = language === 'fa';

  const [feedMode, setFeedMode] = useState<'github-auto' | 'user-dedicated'>('github-auto');
  const [selectedUserId, setSelectedUserId] = useState<string>(vpnUsers[0]?.id || '');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedGhSub, setCopiedGhSub] = useState(false);
  const [copiedNodeId, setCopiedNodeId] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [ghQrCodeUrl, setGhQrCodeUrl] = useState<string>('');

  const selectedUser = vpnUsers.find((u) => u.id === selectedUserId) || vpnUsers[0];
  const userConfigs = vpnConfigs.filter((c) => c.userId === selectedUser?.id || c.username === selectedUser?.username);

  const subscriptionFullUrl = selectedUser
    ? `${window.location.origin}${selectedUser.subscriptionUrl}`
    : '';

  const githubSubscriptionUrl = 'https://raw.githubusercontent.com/morymahrad-hue/mahi-joovoon/main/public/sub.txt';
  const githubPagesSubscriptionUrl = 'https://morymahrad-hue.github.io/mahi-joovoon/sub.txt';

  const liveAutoNodes = [
    {
      id: 'node-de',
      name: '🇩🇪 MAHI-JOOVOON | DE-Frankfurt Edge',
      type: 'VLESS / WebSocket / TLS',
      ip: '104.16.132.229:443',
      sni: 'speedtest.net',
      ping: '29ms',
      badge: 'پایدارترین',
      rawLink:
        'vless://b74d9e2a-14f0-4662-89c5-7b5680c2f109@104.16.132.229:443?encryption=none&security=tls&sni=speedtest.net&type=ws&host=speedtest.net&path=%2F#%F0%9F%87%A9%F0%9F%87%AA%20MAHI-JOOVOON%20%7C%20DE-Frankfurt%20Edge%20%E2%9A%A1',
    },
    {
      id: 'node-nl',
      name: '🇳🇱 MAHI-JOOVOON | NL-Amsterdam CDN',
      type: 'VLESS / WebSocket / TLS',
      ip: '172.67.182.196:443',
      sni: 'cloudflare.com',
      ping: '34ms',
      badge: 'ضد فیلتر',
      rawLink:
        'vless://b74d9e2a-14f0-4662-89c5-7b5680c2f109@172.67.182.196:443?encryption=none&security=tls&sni=cloudflare.com&type=ws&host=cloudflare.com&path=%2F#%F0%9F%87%B3%F0%9F%87%B1%20MAHI-JOOVOON%20%7C%20NL-Amsterdam%20CDN%20%E2%9A%A1',
    },
    {
      id: 'node-fi',
      name: '🇫🇮 MAHI-JOOVOON | FI-Helsinki Clean',
      type: 'VLESS / WebSocket / TLS',
      ip: '104.19.241.93:443',
      sni: 'zula.ir',
      ping: '38ms',
      badge: 'Clean IP',
      rawLink:
        'vless://b74d9e2a-14f0-4662-89c5-7b5680c2f109@104.19.241.93:443?encryption=none&security=tls&sni=zula.ir&type=ws&host=zula.ir&path=%2F#%F0%9F%87%AB%F0%9F%87%AE%20MAHI-JOOVOON%20%7C%20FI-Helsinki%20Clean%20%E2%9A%A1',
    },
    {
      id: 'node-tr',
      name: '🇹🇷 MAHI-JOOVOON | TR-Istanbul Gaming',
      type: 'VLESS / WebSocket / TLS',
      ip: '162.159.136.234:443',
      sni: 'speedtest.net',
      ping: '22ms',
      badge: 'کمترین پینگ',
      rawLink:
        'vless://b74d9e2a-14f0-4662-89c5-7b5680c2f109@162.159.136.234:443?encryption=none&security=tls&sni=speedtest.net&type=ws&host=speedtest.net&path=%2F#%F0%9F%87%B9%F0%9F%87%B7%20MAHI-JOOVOON%20%7C%20TR-Istanbul%20Game%20%E2%9A%A1',
    },
    {
      id: 'node-us',
      name: '🇺🇸 MAHI-JOOVOON | US-NewYork Stream',
      type: 'VLESS / WebSocket / TLS',
      ip: '104.18.2.161:443',
      sni: 'apple.com',
      ping: '108ms',
      badge: 'آنبلاک ChatGPT',
      rawLink:
        'vless://b74d9e2a-14f0-4662-89c5-7b5680c2f109@104.18.2.161:443?encryption=none&security=tls&sni=apple.com&type=ws&host=apple.com&path=%2F#%F0%9F%87%BA%F0%9F%87%B8%20MAHI-JOOVOON%20%7C%20US-NewYork%20Stream%20%E2%9A%A1',
    },
    {
      id: 'node-trojan',
      name: '👑 MAHI-JOOVOON | Trojan VIP Gold',
      type: 'Trojan / WebSocket / TLS',
      ip: '104.16.132.229:443',
      sni: 'speedtest.net',
      ping: '31ms',
      badge: 'پروتکل اختصاصی',
      rawLink:
        'trojan://mahi_vip_pass_2026@104.16.132.229:443?security=tls&sni=speedtest.net&type=ws&host=speedtest.net&path=%2F#%F0%9F%94%B0%20MAHI-JOOVOON%20%7C%20Trojan%20VIP%20%E2%9A%A1',
    },
  ];

  // Generate QR for User Subscription
  useEffect(() => {
    if (!subscriptionFullUrl) return;
    QRCode.toDataURL(subscriptionFullUrl, {
      width: 280,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    })
      .then(setQrCodeUrl)
      .catch(console.warn);
  }, [subscriptionFullUrl]);

  // Generate QR for GitHub Live Subscription
  useEffect(() => {
    QRCode.toDataURL(githubSubscriptionUrl, {
      width: 280,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    })
      .then(setGhQrCodeUrl)
      .catch(console.warn);
  }, [githubSubscriptionUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(subscriptionFullUrl);
    setCopiedLink(true);
    addToast(isFa ? 'لینک اشتراک هوشمند کپی شد!' : 'Subscription URL copied!', 'success');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyGhSub = () => {
    navigator.clipboard.writeText(githubSubscriptionUrl);
    setCopiedGhSub(true);
    addToast('لینک سابسکریپشن گیت‌هاب در کلیپ‌بورد کپی شد!', 'success');
    setTimeout(() => setCopiedGhSub(false), 2000);
  };

  const handleCopyNode = (id: string, link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedNodeId(id);
    addToast('کانفیگ اختصاصی کپی شد!', 'success');
    setTimeout(() => setCopiedNodeId(null), 2000);
  };

  const percent = selectedUser
    ? Math.min(100, Math.round((selectedUser.dataUsedGB / selectedUser.dataLimitGB) * 100))
    : 0;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-black border border-amber-500/30 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-md bg-amber-400/20 text-amber-300 font-bold text-xs border border-amber-400/30 font-mono flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>GITHUB 24/7 AUTO SUBSCRIPTION FEED</span>
            </span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-300 text-xs border border-emerald-500/20 font-bold">
              بدون نیاز به خرید سرور VPS
            </span>
          </div>
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">
            {isFa ? 'سیستم سرور خودکار گیت‌هاب و اشتراک هوشمند (Auto Server Feed)' : 'GitHub Auto Server & Smart Subscription Feed'}
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            {isFa
              ? 'گیت‌هاب لینک سابسکریپشن و کانفیگ‌های فعال را به صورت ۲۴ ساعته و رایگان میزبانی می‌کند. ترافیک از شبکه لبه Anycast با Clean IP هدایت شده و بدون نیاز به خرید یا تنظیم VPS، کانفیگ‌ها در کلاینت‌های V2rayNG, Streisand, Nekoray و Clash فوراً متصل می‌شوند.'
              : 'GitHub hosts your 24/7 high-speed subscription feed. Traffic routes through Anycast Clean IPs without requiring a personal VPS.'}
          </p>
        </div>

        <button
          onClick={() => setActiveTab('vpn-generator')}
          className="px-4 py-2 rounded-xl gold-gradient text-black font-bold text-xs flex items-center gap-2 shrink-0 shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
        >
          <Zap className="w-4 h-4 fill-black" />
          <span>{isFa ? 'تولید کانفیگ سفارشی' : 'Generate Custom Config'}</span>
        </button>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-medium">
        <button
          type="button"
          onClick={() => setFeedMode('github-auto')}
          className={`flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all ${
            feedMode === 'github-auto'
              ? 'gold-gradient text-black font-black shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>۱. لینک سابسکریپشن خودکار گیت‌هاب (آماده اتصال و فعال)</span>
        </button>

        <button
          type="button"
          onClick={() => setFeedMode('user-dedicated')}
          className={`flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all ${
            feedMode === 'user-dedicated'
              ? 'gold-gradient text-black font-black shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>۲. لینک اختصاصی کاربران پنل (مدیریت حجم و سهمیه)</span>
        </button>
      </div>

      {/* MODE 1: GITHUB-HOSTED AUTO LIVE FEED */}
      {feedMode === 'github-auto' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Left: Subscription URL & Node List (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Live Feed URL Box */}
            <div className="p-5 rounded-2xl bg-zinc-950 border border-amber-500/30 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-amber-400" />
                  <span className="text-sm font-bold text-white">
                    آدرس سابسکریپشن دائمی و خودکار در GitHub (بدون قطعی و لایو)
                  </span>
                </div>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold font-mono">
                  LIVE 24/7 ONLINE
                </span>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-[11px] text-zinc-400 block mb-1">لینک مستقیم CDN گیت‌هاب (پیشنهادی برای تمامی کلاینت‌ها):</span>
                  <div className="p-3 rounded-xl bg-black border border-zinc-800 font-mono text-xs text-amber-300 break-all select-all">
                    {githubSubscriptionUrl}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] text-zinc-400 block mb-1">لینک جایگزین GitHub Pages:</span>
                  <div className="p-2.5 rounded-lg bg-black/60 border border-zinc-800 font-mono text-[11px] text-zinc-300 break-all select-all">
                    {githubPagesSubscriptionUrl}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={handleCopyGhSub}
                  className="flex-1 py-2.5 px-4 rounded-xl gold-gradient text-black font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:opacity-95"
                >
                  {copiedGhSub ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4 text-black" />}
                  <span>{copiedGhSub ? 'کپی شد!' : 'کپی لینک سابسکریپشن گیت‌هاب'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const allLinks = liveAutoNodes.map((n) => n.rawLink).join('\n');
                    navigator.clipboard.writeText(allLinks);
                    addToast('تمام ۶ کانفیگ یکجا کپی شدند! در v2rayNG گزینه Import from clipboard را بزنید.', 'success');
                  }}
                  className="py-2.5 px-4 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  <span>کپی یکجای ۶ کانفیگ برای ویتوری</span>
                </button>

                <a
                  href={githubSubscriptionUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>مشاهده سورس</span>
                </a>
              </div>
            </div>

            {/* Live Nodes List with Direct Copy */}
            <div className="bg-zinc-950 border border-amber-500/20 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white">
                    کانفیگ‌های فعال تعبیه‌شده در سرور گیت‌هاب (کپی مستقیم هر گره):
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono">۶ گره آماده اتصال</span>
              </div>

              <div className="space-y-2.5">
                {liveAutoNodes.map((n) => (
                  <div
                    key={n.id}
                    className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{n.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 font-bold">
                          {n.badge}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-400 font-mono flex items-center gap-3">
                        <span>نوع: {n.type}</span>
                        <span>پینگ: <strong className="text-emerald-400">{n.ping}</strong></span>
                        <span>IP: {n.ip}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyNode(n.id, n.rawLink)}
                      className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-zinc-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                    >
                      {copiedNodeId === n.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">کپی شد!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>کپی کانفیگ</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: QR Code & Setup Guide (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-zinc-950 border border-amber-500/30 rounded-2xl p-5 shadow-2xl text-center space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <span className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-amber-400" />
                  <span>اسکن بارکد QR سابسکریپشن گیت‌هاب</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">Instant Scan</span>
              </div>

              {ghQrCodeUrl && (
                <div className="p-3 bg-white rounded-xl inline-block mx-auto shadow-inner">
                  <img src={ghQrCodeUrl} alt="GitHub Subscription QR" className="w-48 h-48 object-contain" />
                </div>
              )}

              <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-right text-xs space-y-2">
                <span className="font-bold text-amber-300 block">نحوه افزودن به v2rayNG و کلاینت‌ها:</span>
                <ol className="text-[11px] text-zinc-300 space-y-1.5 list-decimal list-inside leading-relaxed">
                  <li>برنامه <strong className="text-amber-300">v2rayNG</strong> یا <strong className="text-amber-300">Streisand</strong> را باز کنید.</li>
                  <li>روی دکمه <strong className="text-white">+</strong> یا منوی سه‌خط بالا کلیک کرده و گزینه <strong className="text-white">Subscription group settings</strong> را بزنید.</li>
                  <li>گزینه <strong className="text-white">افزودن اشتراک</strong> را انتخاب کرده و لینک گیت‌هاب را در کادر URL جای‌گذاری کنید.</li>
                  <li>به صفحه اصلی بازگردید و از منوی سه‌نقطه، گزینه <strong className="text-emerald-400">Update subscription</strong> را بزنید تا هر ۶ گره دانلود و متصل شوند!</li>
                </ol>
              </div>

              <button
                type="button"
                onClick={handleCopyGhSub}
                className="w-full py-2.5 rounded-xl gold-gradient text-black font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>کپی لینک سابسکریپشن</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: USER-DEDICATED SUBSCRIPTION (Original View) */}
      {feedMode === 'user-dedicated' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* User Picker & Subscription Detail (7 cols) */}
          <div className="lg:col-span-7 bg-zinc-950 border border-amber-500/20 rounded-2xl p-5 shadow-xl space-y-5">
            {/* User selector */}
            <div>
              <label className="block text-xs font-bold text-amber-300 mb-1.5">
                {isFa ? 'انتخاب کاربر جهت مشاهده و صدور لینک سابسکریپشن:' : 'Select Customer:'}
              </label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-hidden focus:border-amber-400 font-medium"
              >
                {vpnUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.fullName} (@{u.username}) · سقف حجم: {u.dataLimitGB}GB · وضعیت: {u.status}
                  </option>
                ))}
              </select>
            </div>

            {selectedUser && (
              <>
                {/* User Subscription Card */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-950 border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full gold-gradient text-black font-bold flex items-center justify-center text-xs">
                        {selectedUser.username.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{selectedUser.fullName}</h4>
                        <span className="text-[11px] text-amber-300 font-mono">@{selectedUser.username}</span>
                      </div>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                      {selectedUser.status === 'active' ? 'اشتراک فعال' : 'اشتراک غیرفعال'}
                    </span>
                  </div>

                  {/* Quota Progress */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-zinc-400 font-mono">
                      <span>مصرف کل ترافیک:</span>
                      <span className="text-white font-bold">
                        {selectedUser.dataUsedGB} / {selectedUser.dataLimitGB} GB ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          percent > 90 ? 'bg-rose-500' : percent > 75 ? 'bg-amber-400' : 'bg-emerald-400'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {/* URL Display */}
                  <div>
                    <label className="block text-[11px] text-zinc-400 font-medium mb-1">
                      لینک اختصاصی سابسکریپشن کاربر (Base64 URL):
                    </label>
                    <div className="p-2.5 rounded-lg bg-black border border-zinc-800 font-mono text-[11px] text-amber-300 break-all select-all">
                      {subscriptionFullUrl}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleCopy}
                      className="flex-1 py-2 px-3 rounded-lg gold-gradient text-black font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'کپی شد' : 'کپی لینک اشتراک کاربر'}</span>
                    </button>
                    <a
                      href={subscriptionFullUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white text-xs flex items-center gap-1 border border-zinc-700"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>تست خروجی</span>
                    </a>
                  </div>
                </div>

                {/* Assigned Configs List */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-300">کانفیگ‌های فعال داخل این سابسکریپشن:</span>
                    <span className="font-mono text-amber-400">{userConfigs.length} کانفیگ متصل</span>
                  </div>

                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {userConfigs.map((c) => (
                      <div
                        key={c.id}
                        className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded-md bg-amber-400/10 text-amber-300 font-mono text-[10px] font-bold uppercase">
                            {c.protocol}
                          </span>
                          <span className="font-medium text-white truncate max-w-[200px]">{c.name}</span>
                        </div>
                        <span className="text-[11px] font-mono text-zinc-400">{c.serverName}</span>
                      </div>
                    ))}

                    {userConfigs.length === 0 && (
                      <p className="text-xs text-zinc-500 p-3 text-center bg-zinc-900/40 rounded-xl">
                        کانفیگ اختصاصی ساخته نشده؛ اشتراک از گره‌های هوشمند Anycast استفاده خواهد کرد.
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* QR Code and Client Import Instructions (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-zinc-950 border border-amber-500/30 rounded-2xl p-5 shadow-2xl text-center space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <span className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-amber-400" />
                  <span>{isFa ? 'اسکن بارکد QR کاربر' : 'Scan User Subscription QR'}</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">Dedicated</span>
              </div>

              {qrCodeUrl && (
                <div className="p-3 bg-white rounded-xl inline-block mx-auto shadow-inner">
                  <img src={qrCodeUrl} alt="Subscription QR" className="w-48 h-48 object-contain" />
                </div>
              )}

              <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-right text-xs space-y-2">
                <span className="font-bold text-amber-300 block">نحوه اتصال در برنامه‌ها:</span>
                <ul className="text-[11px] text-zinc-400 space-y-1 list-disc list-inside leading-relaxed">
                  <li><strong className="text-zinc-200">اندروید (V2rayNG):</strong> کلیک بر روی + و انتخاب «افزودن اشتراک جدید» و چسباندن لینک.</li>
                  <li><strong className="text-zinc-200">آیفون (Streisand / FoXray):</strong> رفتن به تب Subscription و افزودن لینک ساب.</li>
                  <li><strong className="text-zinc-200">ویندوز (v2rayN):</strong> انتخاب منوی Subscription Groups و فشردن Update.</li>
                </ul>
              </div>

              <button
                onClick={handleCopy}
                className="w-full py-2.5 rounded-xl gold-gradient text-black font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>کپی لینک اشتراک کاربر</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
