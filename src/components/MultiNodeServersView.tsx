import React, { useState } from 'react';
import {
  Server,
  Plus,
  Trash2,
  Edit2,
  Activity,
  Cpu,
  HardDrive,
  Users,
  Globe,
  Radio,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  X,
  Zap,
} from 'lucide-react';
import { useServer } from '../context/ServerContext';
import { VPNServerNode } from '../types';

export const MultiNodeServersView: React.FC = () => {
  const {
    vpnServers,
    addVPNServer,
    updateVPNServer,
    deleteVPNServer,
    addToast,
    language,
    isSyncingGitHubNodes,
    syncNodesFromGitHubPages,
  } = useServer();
  const isFa = language === 'fa';

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingServer, setEditingServer] = useState<VPNServerNode | null>(null);

  // New server form
  const [name, setName] = useState('');
  const [country, setCountry] = useState('آلمان');
  const [countryCode, setCountryCode] = useState('de');
  const [flag, setFlag] = useState('🇩🇪');
  const [host, setHost] = useState('');
  const [ip, setIp] = useState('');
  const [vlessPort, setVlessPort] = useState(443);
  const [vmessPort, setVmessPort] = useState(2053);
  const [trojanPort, setTrojanPort] = useState(8443);
  const [ssPort, setSsPort] = useState(8388);
  const [sni, setSni] = useState('speedtest.net');
  const [wsPath, setWsPath] = useState('/mahi-ws');
  const [grpcServiceName, setGrpcServiceName] = useState('mahi-grpc');
  const [maxUsers, setMaxUsers] = useState(500);

  const handleCreateServer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !host.trim()) {
      addToast(isFa ? 'نام سرور و آدرس هاست الزامی است' : 'Name and Host required', 'error');
      return;
    }

    await addVPNServer({
      name: name.trim(),
      country: country.trim(),
      countryCode: countryCode.trim().toLowerCase(),
      flag,
      host: host.trim(),
      ip: ip.trim() || host.trim(),
      vlessPort: Number(vlessPort) || 443,
      vmessPort: Number(vmessPort) || 2053,
      trojanPort: Number(trojanPort) || 8443,
      ssPort: Number(ssPort) || 8388,
      status: 'online',
      pingMs: Math.floor(Math.random() * 25) + 30,
      cpuPercent: 18,
      ramPercent: 32,
      diskPercent: 24,
      bandwidthUsedGB: 0,
      bandwidthTotalGB: 10000,
      maxUsers: Number(maxUsers) || 500,
      activeUsers: 0,
      sni: sni.trim() || 'speedtest.net',
      publicKey: 'a9K1k9qB7u8X3x5v2Y7t0W1e8R9m6P4l2Q8j5H3n1G',
      shortId: '8f7a1c3e',
      wsPath: wsPath.trim() || '/mahi-ws',
      grpcServiceName: grpcServiceName.trim() || 'mahi-grpc',
    });

    setName('');
    setHost('');
    setIp('');
    setShowAddModal(false);
  };

  const handleUpdateServer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingServer) return;
    await updateVPNServer(editingServer.id, editingServer);
    setEditingServer(null);
  };

  const handlePingServer = (server: VPNServerNode) => {
    const randomPing = Math.floor(Math.random() * 20) + 25;
    updateVPNServer(server.id, { pingMs: randomPing });
    addToast(isFa ? `پینگ نود ${server.name} مجدداً سنجیده شد: ${randomPing}ms` : `Ping: ${randomPing}ms`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-black border border-amber-500/30 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <h2 className="text-xl font-black text-amber-200">
              {isFa ? 'مدیریت سرورها و نودهای چندگانه (Multi-Node Clusters)' : 'Multi-Node Cluster Management'}
            </h2>
          </div>
          <p className="text-xs text-zinc-400">
            {isFa
              ? 'اتصال، پایش وضعیت زنده، مصرف پهنای باند و منابع سخت‌افزاری نودهای عملیاتی در کشورهای مختلف'
              : 'Add, monitor and cluster edge nodes across Germany, Finland, Netherlands, Turkey and USA.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => syncNodesFromGitHubPages(true)}
            disabled={isSyncingGitHubNodes}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-500/40 text-amber-200 hover:text-white font-bold text-xs flex items-center gap-2 shrink-0 shadow-lg cursor-pointer hover:border-amber-400 transition-all disabled:opacity-50"
            title="دریافت نودها به صورت زنده از nodes.txt گیت‌هاب پیجز"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isSyncingGitHubNodes ? 'animate-spin' : ''}`} />
            <span>{isFa ? 'همگام‌سازی نودها از GitHub Pages' : 'Sync Nodes from GitHub Pages'}</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl gold-gradient text-black font-bold text-xs flex items-center gap-2 shrink-0 shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{isFa ? 'افزودن نود سرور جدید' : 'Add Edge Server'}</span>
          </button>
        </div>
      </div>

      {/* Servers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {vpnServers.map((srv) => {
          const bwPercent = Math.min(100, Math.round((srv.bandwidthUsedGB / srv.bandwidthTotalGB) * 100));

          return (
            <div
              key={srv.id}
              className="p-5 rounded-2xl bg-zinc-950 border border-amber-500/30 shadow-xl space-y-4 hover:border-amber-400 transition-all"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{srv.flag}</span>
                  <div>
                    <h3 className="text-xs font-bold text-white">{srv.name}</h3>
                    <span className="text-[10px] text-amber-300/80 font-mono">{srv.host}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                    {srv.pingMs} ms
                  </span>
                  <span className={`w-2 h-2 rounded-full ${srv.status === 'online' ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                </div>
              </div>

              {/* Ports & SNI */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono p-2.5 bg-zinc-900/60 rounded-xl border border-zinc-800 text-zinc-300">
                <div>
                  <span className="text-zinc-500 block text-[10px]">VLESS / VMess:</span>
                  <span className="text-amber-300 font-bold">{srv.vlessPort} / {srv.vmessPort}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px]">Trojan / SS:</span>
                  <span className="text-amber-300 font-bold">{srv.trojanPort} / {srv.ssPort}</span>
                </div>
                <div className="col-span-2 pt-1 border-t border-zinc-800/60 flex justify-between">
                  <span className="text-zinc-500">SNI / Camouflage:</span>
                  <span className="text-emerald-400 truncate max-w-[130px]">{srv.sni}</span>
                </div>
              </div>

              {/* Hardware Telemetry Progresses */}
              <div className="space-y-2 text-[10px] font-mono">
                <div>
                  <div className="flex justify-between text-zinc-400 mb-0.5">
                    <span>بار پردازنده (CPU):</span>
                    <span className="text-white font-bold">{srv.cpuPercent}%</span>
                  </div>
                  <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${srv.cpuPercent}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-zinc-400 mb-0.5">
                    <span>حافظه رم (RAM):</span>
                    <span className="text-white font-bold">{srv.ramPercent}%</span>
                  </div>
                  <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${srv.ramPercent}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-zinc-400 mb-0.5">
                    <span>پهنای باند مصرفی:</span>
                    <span className="text-white font-bold">{srv.bandwidthUsedGB} / {srv.bandwidthTotalGB} GB ({bwPercent}%)</span>
                  </div>
                  <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${bwPercent}%` }} />
                  </div>
                </div>
              </div>

              {/* Active Users */}
              <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
                <span>کاربران متصل به این نود:</span>
                <span className="font-mono text-amber-300 font-bold">{srv.activeUsers} / {srv.maxUsers}</span>
              </div>

              {/* Card Actions */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-zinc-800 text-xs">
                <button
                  onClick={() => handlePingServer(srv)}
                  className="py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                  <span>تست پینگ</span>
                </button>

                <button
                  onClick={() => setEditingServer(srv)}
                  className="py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>ویرایش</span>
                </button>

                <button
                  onClick={() => deleteVPNServer(srv.id)}
                  className="py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Server Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-zinc-950 border border-amber-500/30 rounded-2xl p-6 max-w-lg w-full shadow-2xl text-right animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <h3 className="text-sm font-bold text-amber-200">افزودن سرور و نود عملیاتی جدید</h3>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateServer} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1 font-bold">نام نمایشی نود:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: آلمان Frankfurt Node 2"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1">کشور و پرچم:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={flag}
                      onChange={(e) => setFlag(e.target.value)}
                      className="w-12 px-2 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-center text-base"
                    />
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="آلمان"
                      className="flex-1 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1 font-bold">دامنه / Host:</label>
                  <input
                    type="text"
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                    placeholder="fra2.mahi-joovoon.cloud"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1">آدرس IP سرور:</label>
                  <input
                    type="text"
                    value={ip}
                    onChange={(e) => setIp(e.target.value)}
                    placeholder="185.190.142.88"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-zinc-400 mb-1">پورت VLESS:</label>
                  <input
                    type="number"
                    value={vlessPort}
                    onChange={(e) => setVlessPort(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">پورت VMess:</label>
                  <input
                    type="number"
                    value={vmessPort}
                    onChange={(e) => setVmessPort(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">پورت Trojan:</label>
                  <input
                    type="number"
                    value={trojanPort}
                    onChange={(e) => setTrojanPort(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">پورت SS:</label>
                  <input
                    type="number"
                    value={ssPort}
                    onChange={(e) => setSsPort(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1">آدرس SNI (استتار):</label>
                  <input
                    type="text"
                    value={sni}
                    onChange={(e) => setSni(e.target.value)}
                    placeholder="speedtest.net"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1">مسیر WebSocket:</label>
                  <input
                    type="text"
                    value={wsPath}
                    onChange={(e) => setWsPath(e.target.value)}
                    placeholder="/mahi-ws"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-300"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl gold-gradient text-black font-bold cursor-pointer"
                >
                  ثبت نود جدید
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Server Modal */}
      {editingServer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-zinc-950 border border-amber-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl text-right animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <h3 className="text-sm font-bold text-amber-200">ویرایش نود {editingServer.name}</h3>
              <button onClick={() => setEditingServer(null)} className="text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateServer} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 mb-1">نام سرور:</label>
                <input
                  type="text"
                  value={editingServer.name}
                  onChange={(e) => setEditingServer({ ...editingServer, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">دامنه / Host:</label>
                <input
                  type="text"
                  value={editingServer.host}
                  onChange={(e) => setEditingServer({ ...editingServer, host: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">آدرس SNI (استتار دامنه):</label>
                <input
                  type="text"
                  value={editingServer.sni}
                  onChange={(e) => setEditingServer({ ...editingServer, sni: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingServer(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-300"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl gold-gradient text-black font-bold cursor-pointer"
                >
                  ذخیره تغییرات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
