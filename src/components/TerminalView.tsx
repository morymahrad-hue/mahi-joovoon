import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import {
  Terminal as TerminalIcon,
  Trash2,
  Copy,
  Download,
  HelpCircle,
  Maximize2,
  Minimize2,
  Check,
  Key,
  AlertTriangle,
  Server,
  Zap,
} from 'lucide-react';
import { useServer } from '../context/ServerContext';

export const TerminalView: React.FC = () => {
  const {
    terminalLogs,
    executeCommand,
    clearTerminal,
    addToast,
    subscription,
    vpsStatus,
    setActiveTab,
  } = useServer();

  const [inputVal, setInputVal] = useState('');
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [historyList, setHistoryList] = useState<string[]>([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const logsEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to latest output
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  // Keep focus on input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (!inputVal.trim()) return;
      const cmd = inputVal;
      setHistoryList((prev) => [cmd, ...prev]);
      setHistoryIndex(-1);
      setInputVal('');
      executeCommand(cmd);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyList.length === 0) return;
      const nextIndex = Math.min(historyIndex + 1, historyList.length - 1);
      setHistoryIndex(nextIndex);
      setInputVal(historyList[nextIndex] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex <= 0) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInputVal(historyList[nextIndex] || '');
      }
    }
  };

  const handleQuickCommand = (cmd: string) => {
    setHistoryList((prev) => [cmd, ...prev]);
    executeCommand(cmd);
    inputRef.current?.focus();
  };

  const handleCopyLogs = () => {
    const promptStr = vpsStatus.isConnected
      ? `${vpsStatus.username}@${vpsStatus.host}:~#`
      : 'disconnected:~#';
    const text = terminalLogs
      .map((l) => `${promptStr} ${l.command}\n${l.output}`)
      .join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('خروجی ترمینال در کلیپ‌بورد کپی شد.', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadLogs = () => {
    const promptStr = vpsStatus.isConnected
      ? `${vpsStatus.username}@${vpsStatus.host}:~#`
      : 'disconnected:~#';
    const text = terminalLogs
      .map((l) => `[${l.timestamp}] ${promptStr} ${l.command}\n${l.output}`)
      .join('\n\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vps_terminal_${Date.now()}.log`;
    link.click();
    URL.revokeObjectURL(url);
    addToast('فایل لاگ ترمینال دانلود شد.', 'success');
  };

  const promptPrefix = vpsStatus.isConnected
    ? `${vpsStatus.username || 'root'}@${vpsStatus.host || 'vps'}:~#`
    : 'disconnected:~#';

  const quickCommands = [
    { label: 'uname -a', cmd: 'uname -a' },
    { label: 'uptime', cmd: 'uptime' },
    { label: 'free -m', cmd: 'free -m' },
    { label: 'df -h', cmd: 'df -h' },
    { label: 'systemctl status bale-bot', cmd: 'systemctl status bale-bot --no-pager' },
    { label: 'ps aux | grep python', cmd: 'ps aux | grep python' },
    { label: 'ufw status', cmd: 'ufw status verbose' },
    { label: 'ls -la /var/www', cmd: 'ls -la /var/www' },
  ];

  return (
    <div
      className={`flex flex-col rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl transition-all ${
        isFullScreen ? 'fixed inset-4 z-50 rounded-xl' : 'h-[calc(100vh-12rem)] min-h-[520px]'
      }`}
    >
      {/* Terminal Title Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs select-none">
        <div className="flex items-center gap-2">
          {/* Window status dots */}
          <div className="flex items-center gap-1.5 ml-2">
            <span
              className={`w-3 h-3 rounded-full inline-block ${
                vpsStatus.isConnected ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-cyan-500/80 inline-block" />
          </div>

          <div className="flex items-center gap-2 text-slate-300 font-mono text-xs">
            <TerminalIcon className={`w-4 h-4 ${vpsStatus.isConnected ? 'text-cyan-400' : 'text-slate-500'}`} />
            <span>
              {vpsStatus.isConnected
                ? `${vpsStatus.username}@${vpsStatus.host}:${vpsStatus.port} (OpenSSH Authenticated Tunnel)`
                : 'اتصال سرور برقرار نیست (SSH Disconnected)'}
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-sm font-sans font-medium border ${
                vpsStatus.isConnected
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
              }`}
            >
              {vpsStatus.isConnected ? 'ترمینال زنده سرور اوبونتو' : 'قطع ارتباط'}
            </span>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowHelpModal(true)}
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="راهنمای دستورات لینوکس"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          <button
            onClick={handleCopyLogs}
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="کپی لاگ‌ها"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={handleDownloadLogs}
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="دانلود لاگ جلسه"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={clearTerminal}
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
            title="پاک کردن صفحه (clear)"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title={isFullScreen ? 'خروج از تمام صفحه' : 'تمام صفحه'}
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Quick Command Chips Toolbar */}
      <div className="bg-slate-900/40 border-b border-slate-800/80 px-4 py-2 flex items-center gap-1.5 overflow-x-auto text-xs">
        <span className="text-[11px] text-slate-500 shrink-0 ml-1">فرمان‌های مستقیم سرور:</span>
        {quickCommands.map((item) => (
          <button
            key={item.cmd}
            onClick={() => handleQuickCommand(item.cmd)}
            disabled={!vpsStatus.isConnected}
            className="px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-slate-700 disabled:opacity-40 text-slate-300 hover:text-cyan-300 font-mono text-[11px] border border-slate-700/60 transition-colors shrink-0 cursor-pointer disabled:cursor-not-allowed"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Terminal Output Area */}
      <div
        dir="ltr"
        onClick={() => inputRef.current?.focus()}
        className="flex-1 p-4 font-mono text-xs sm:text-sm overflow-y-auto bg-slate-950 text-slate-200 select-text leading-relaxed cursor-text"
      >
        {/* Connection Notice in Terminal Screen */}
        {vpsStatus.isConnected ? (
          <div className="text-slate-500 mb-4 pb-3 border-b border-slate-800/60 space-y-1">
            <div className="text-emerald-400 font-bold">
              ✓ Connected to remote Ubuntu Host: {vpsStatus.host} (Port {vpsStatus.port})
            </div>
            <div>* OS Environment: {vpsStatus.osInfo || 'Ubuntu Linux x86_64'}</div>
            <div>* Execution Mode: Real SSH tunnel via authenticated backend (/api/vps/exec)</div>
            <div>* Process Manager: systemd (24/7 background persistence)</div>
            <div className="text-cyan-400/90 text-xs mt-1">
              Commands typed here are executed directly on your persistent cloud VPS.
            </div>
          </div>
        ) : (
          <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-4 mb-4 text-xs space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>[WARNING] REMOTE VPS DISCONNECTED</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              No remote VPS is currently attached. Real shell execution is paused.
              To execute bash commands on your persistent Ubuntu server, go to Settings to authenticate via SSH.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setActiveTab('settings')}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold font-sans transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Key className="w-3.5 h-3.5" />
                <span>اتصال به سرور مجازی (تنظیمات SSH)</span>
              </button>
            </div>
          </div>
        )}

        {/* Executed Logs */}
        {terminalLogs.map((log) => (
          <div key={log.id} className="mb-3 space-y-1">
            <div className="flex items-center gap-2 text-slate-400">
              <span
                className={`font-bold ${
                  vpsStatus.isConnected ? 'text-emerald-400' : 'text-slate-500'
                }`}
              >
                {promptPrefix}
              </span>
              <span className="text-slate-100 font-semibold">{log.command}</span>
              <span className="text-[10px] text-slate-600 ml-auto font-sans">{log.timestamp}</span>
            </div>
            <pre
              className={`whitespace-pre-wrap font-mono text-xs sm:text-[13px] leading-relaxed ${
                log.isError ? 'text-rose-400' : 'text-slate-300'
              }`}
            >
              {log.output}
            </pre>
          </div>
        ))}

        {/* Current Active Input Prompt */}
        <div className="flex items-center gap-2 pt-1">
          <span
            className={`font-bold shrink-0 ${
              vpsStatus.isConnected ? 'text-emerald-400' : 'text-slate-500'
            }`}
          >
            {promptPrefix}
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!vpsStatus.isConnected}
            className="flex-1 bg-transparent border-none outline-hidden text-slate-100 font-mono text-xs sm:text-sm focus:ring-0 p-0 disabled:opacity-40"
            autoFocus
            spellCheck={false}
            autoComplete="off"
            placeholder={
              vpsStatus.isConnected
                ? 'Type Linux bash command (e.g. uname -a, df -h, systemctl status bale-bot)...'
                : 'Server disconnected. Connect VPS in Settings to execute bash commands...'
            }
          />
        </div>

        <div ref={logsEndRef} />
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 max-w-lg w-full shadow-2xl text-right animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <span>فرمان‌های پرکاربرد مدیریت سرور ابری لینوکس</span>
              </h3>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                بستن
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 max-h-80 overflow-y-auto pr-1">
              <p className="text-slate-400 leading-relaxed">
                ترمینال وب دستورات را مستقیماً از طریق احراز هویت امن SSH بر روی سرور اوبونتو شما اجرا می‌کند:
              </p>

              <div className="grid grid-cols-1 gap-2 font-mono text-[11px]" dir="ltr">
                <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                  <span className="text-cyan-400 font-bold">systemctl status bale-bot</span>
                  <span className="text-slate-400">Check Bale Bot 24/7 daemon</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                  <span className="text-cyan-400 font-bold">journalctl -u bale-bot -n 50</span>
                  <span className="text-slate-400">Read live bot logs in systemd</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                  <span className="text-cyan-400 font-bold">systemctl restart bale-bot</span>
                  <span className="text-slate-400">Restart bot systemd service</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                  <span className="text-cyan-400 font-bold">free -m</span>
                  <span className="text-slate-400">Live RAM consumption</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                  <span className="text-cyan-400 font-bold">df -h /</span>
                  <span className="text-slate-400">Root disk space usage</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                  <span className="text-cyan-400 font-bold">ufw status</span>
                  <span className="text-slate-400">Check firewall open ports</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium cursor-pointer"
              >
                متوجه شدم
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
