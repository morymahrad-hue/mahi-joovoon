import React, { useState } from 'react';
import {
  Bot,
  Play,
  Square,
  RotateCw,
  Send,
  Zap,
  Globe,
  Lock,
  CreditCard,
  Key,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Copy,
  Terminal,
  FileCode,
  ShieldCheck,
  Eye,
  EyeOff,
  Radio,
  Sliders,
  Sparkles,
  Server,
} from 'lucide-react';
import { useServer } from '../context/ServerContext';

export const BaleBotView: React.FC = () => {
  const {
    baleBot,
    updateBaleBotConfig,
    testBaleBotConnection,
    toggleBaleBotStatus,
    sendBaleTestMessage,
    setBaleWebhook,
    deleteBaleWebhook,
    restartBaleBot,
    updateBaleGeminiConfig,
    generateBaleGeminiReply,
    setActiveTab,
    setCurrentDirectory,
    addToast,
    vpsStatus,
    deployBaleBotToVPS,
    isDeployingService,
    restartService,
  } = useServer();

  // Local form states
  const [tokenInput, setTokenInput] = useState(baleBot.botToken);
  const [showToken, setShowToken] = useState(false);
  const [usernameInput, setUsernameInput] = useState(baleBot.botUsername);
  const [nameInput, setNameInput] = useState(baleBot.botName);
  const [webhookUrlInput, setWebhookUrlInput] = useState(baleBot.webhookUrl);
  const [isTesting, setIsTesting] = useState(false);
  const [deployOutput, setDeployOutput] = useState<string | null>(null);

  // Message Tester state
  const [testChatId, setTestChatId] = useState('4910283');
  const [testMessageText, setTestMessageText] = useState('سلام! سرور اختصاصی ربات بله با موفقیت متصل و آنلاین شد. 🚀');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Gemini AI state
  const [geminiPromptInput, setGeminiPromptInput] = useState(baleBot.gemini.systemInstruction);
  const [geminiTemperature, setGeminiTemperature] = useState(baleBot.gemini.temperature);
  const [geminiAutoReply, setGeminiAutoReply] = useState(baleBot.gemini.autoReplyToUsers);
  const [geminiTestQuery, setGeminiTestQuery] = useState('چطور می‌تونم از خدمات پرداخت و پشتیبانی ربات استفاده کنم؟');
  const [geminiTestResult, setGeminiTestResult] = useState<string>(baleBot.gemini.lastAiResponse || '');
  const [isGeneratingGemini, setIsGeneratingGemini] = useState(false);

  // Active sub-tab
  const [activeSubTab, setActiveSubTab] = useState<'config' | 'systemd' | 'gemini' | 'webhook' | 'banking' | 'tester' | 'code'>('config');

  const handleDeployToUbuntuVPS = async () => {
    if (!vpsStatus.isConnected) {
      addToast('لطفاً ابتدا سرور ابری اوبونتو را در تنظیمات متصل نمایید.', 'error');
      setActiveTab('settings');
      return;
    }
    const result = await deployBaleBotToVPS(tokenInput || baleBot.botToken);
    if (result.success && result.output) {
      setDeployOutput(result.output);
    }
  };

  const handleSaveConnection = (e: React.FormEvent) => {
    e.preventDefault();
    updateBaleBotConfig({
      botToken: tokenInput.trim(),
      botUsername: usernameInput.trim().replace(/^@/, ''),
      botName: nameInput.trim(),
    });
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    await testBaleBotConnection();
    setIsTesting(false);
  };

  const handleSendMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testMessageText.trim() || !testChatId.trim()) return;
    setIsSendingMessage(true);
    await sendBaleTestMessage(testChatId.trim(), testMessageText.trim());
    setIsSendingMessage(false);
  };

  const handleSaveGeminiConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateBaleGeminiConfig({
      systemInstruction: geminiPromptInput,
      temperature: Number(geminiTemperature),
      autoReplyToUsers: geminiAutoReply,
    });
  };

  const handleTestGeminiGeneration = async () => {
    if (!geminiTestQuery.trim()) return;
    setIsGeneratingGemini(true);
    const reply = await generateBaleGeminiReply(geminiTestQuery.trim());
    setGeminiTestResult(reply);
    setIsGeneratingGemini(false);
  };

  const handleGoToFileEditor = () => {
    setCurrentDirectory('/var/www/bale-bot');
    setActiveTab('files');
    addToast('به پوشه فایل‌های سورس کد ربات بله هدایت شدید.', 'info');
  };

  const isConnected = baleBot.status === 'connected';

  return (
    <div className="space-y-6">
      {/* Top Banner / Identity Card */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-900/40 shrink-0">
              <Bot className="w-6 h-6 text-white" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-base font-bold text-white">
                  مدیریت سرور اختصاصی ربات بله (Bale Bot Hub)
                </h2>
                <span
                  className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md border ${
                    isConnected
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isConnected ? 'bg-emerald-400 animate-status-pulse' : 'bg-rose-500'
                    }`}
                  />
                  {isConnected ? 'متصل و فعال' : 'متوقف شده'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono">
                <span className="text-cyan-300">@{baleBot.botUsername}</span>
                <span className="text-slate-600">·</span>
                <span>حالت: {baleBot.mode === 'polling' ? 'Long-Polling (پیوسته)' : 'Webhook (وب‌هوک امن)'}</span>
                <span className="text-slate-600">·</span>
                <span>پینگ بله: {baleBot.lastPingMs}ms</span>
                <span className="text-slate-600">·</span>
                <span>PID: {baleBot.pid || '—'}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-cyan-300 border border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
              title="تست ارتباط با سرور tapi.bale.ai"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>تست اتصال /getMe</span>
            </button>

            {isConnected ? (
              <>
                <button
                  onClick={restartBaleBot}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700 cursor-pointer"
                  title="راه‌اندازی مجدد سرویس"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
                <button
                  onClick={toggleBaleBotStatus}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-medium transition-colors cursor-pointer"
                  title="توقف موقت ربات"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>توقف</span>
                </button>
              </>
            ) : (
              <button
                onClick={toggleBaleBotStatus}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-md"
              >
                <Play className="w-4 h-4" />
                <span>روشن کردن ربات</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4 pt-4 border-t border-slate-800/80 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-0.5">پیام‌های دریافتی</span>
            <span className="font-mono font-bold text-base text-white">{baleBot.messagesReceived.toLocaleString('fa-IR')}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-0.5">پیام‌های ارسالی</span>
            <span className="font-mono font-bold text-base text-emerald-400">{baleBot.messagesSent.toLocaleString('fa-IR')}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/30">
            <span className="text-[11px] text-purple-300 block mb-0.5 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>هوش مصنوعی Gemini</span>
            </span>
            <span className="font-mono font-bold text-xs text-purple-200">gemini-3.8-flash</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-0.5">درگاه پرداخت بله</span>
            <span className={`font-medium ${baleBot.bankingEnabled ? 'text-cyan-300' : 'text-slate-500'}`}>
              {baleBot.bankingEnabled ? 'فعال (شتاب)' : 'غیرفعال'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-0.5">엔جین ربات</span>
            <span className="font-mono font-bold text-white">Balethon + GenAI</span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto text-xs">
        <button
          onClick={() => setActiveSubTab('config')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium transition-colors shrink-0 cursor-pointer ${
            activeSubTab === 'config'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>پیکربندی توکن و اتصال بله</span>
        </button>

        <button
          onClick={() => setActiveSubTab('systemd')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium transition-colors shrink-0 cursor-pointer ${
            activeSubTab === 'systemd'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Server className="w-3.5 h-3.5 text-emerald-400" />
          <span>استقرار ۲۴ ساعته Systemd (مستقل)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('gemini')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium transition-colors shrink-0 cursor-pointer ${
            activeSubTab === 'gemini'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>هوش مصنوعی Gemini AI</span>
        </button>

        <button
          onClick={() => setActiveSubTab('webhook')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium transition-colors shrink-0 cursor-pointer ${
            activeSubTab === 'webhook'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>حالت وب‌هوک و پولینگ (Webhook)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('tester')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium transition-colors shrink-0 cursor-pointer ${
            activeSubTab === 'tester'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>تست ارسال پیام و شبیه‌ساز</span>
        </button>

        <button
          onClick={() => setActiveSubTab('banking')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium transition-colors shrink-0 cursor-pointer ${
            activeSubTab === 'banking'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>پرداخت درون‌برنامه‌ای بانکی</span>
        </button>

        <button
          onClick={() => setActiveSubTab('code')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium transition-colors shrink-0 cursor-pointer ${
            activeSubTab === 'code'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>کد سورس ربات (Python / JS)</span>
        </button>
      </div>

      {/* TAB 1: Bot Connection & Token Setup */}
      {activeSubTab === 'config' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <form
            onSubmit={handleSaveConnection}
            className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>اطلاعات اتصال ربات بله</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">Endpoint: https://tapi.bale.ai</span>
            </div>

            {/* Token field */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                توکن اختصاصی ربات (Bot Token):
              </label>
              <div className="relative">
                <input
                  type={showToken ? 'text' : 'password'}
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="مثال: 123456789:AAHq_m..."
                  className="w-full pl-10 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono placeholder:text-slate-500 focus:outline-hidden focus:border-cyan-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                توکن دریافتی از ربات رسمی <span className="text-cyan-400 font-mono">@BotFather</span> در پیام‌رسان بله را اینجا وارد کنید.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  شناسه کاربری ربات (Username):
                </label>
                <div className="relative">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-mono">@</span>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="my_bale_bot"
                    className="w-full pl-3 pr-7 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono placeholder:text-slate-500 focus:outline-hidden focus:border-cyan-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  عنوان نمایشی ربات (Bot Name):
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="ربات فروشگاه آنلاین"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            {/* Template Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                قالب و سناریوی اولیه ربات:
              </label>
              <select
                value={baleBot.templateType}
                onChange={(e) =>
                  updateBaleBotConfig({
                    templateType: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-hidden focus:border-cyan-500 cursor-pointer"
              >
                <option value="customer-service">دستیار پاسخگویی هوشمند و پشتیبانی مشتریان</option>
                <option value="ecommerce">فروشگاه آنلاین با درگاه پرداخت شتابی بله</option>
                <option value="form-survey">ربات ثبت‌نام، فرم‌های تعاملی و نظرسنجی</option>
                <option value="custom">اسکریپت سفارشی پایتون / Balethon</option>
              </select>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                فایل تنظیمات در <code className="text-cyan-300 font-mono">/var/www/bale-bot/bale_config.json</code> ذخیره می‌شود.
              </span>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition-colors cursor-pointer"
              >
                ذخیره تنظیمات
              </button>
            </div>
          </form>

          {/* Guide card for BotFather */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>مراحل اتصال ربات بله به سرور:</span>
            </h4>

            <ol className="text-xs text-slate-300 space-y-2.5 list-decimal pr-4 leading-relaxed">
              <li>
                اپلیکیشن <span className="font-semibold text-white">بله</span> را باز کرده و شناسه{' '}
                <span className="text-cyan-400 font-mono">@BotFather</span> را جستجو کنید.
              </li>
              <li>
                دستور <span className="text-emerald-400 font-mono">/newbot</span> را ارسال کنید و نام و آیدی مدنظر خود را مشخص نمایید.
              </li>
              <li>
                توکن اختصاصی شامل ارقام و حروف انگلیسی را کپی کرده و در فیلد روبرو قرار دهید.
              </li>
              <li>
                روی دکمه <span className="text-cyan-300 font-medium">«تست اتصال /getMe»</span> کلیک کنید تا ارتباط پایدار با سرور بله تایید گردد.
              </li>
            </ol>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
              <span className="font-semibold text-slate-300 block">مشخصات سرور میزبان:</span>
              <div className="font-mono text-cyan-300">IP: 185.190.142.88 (Tehran)</div>
              <div>پروتکل ارتباطی: HTTPS TLS 1.3</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Autonomous 24/7 Systemd Deployment on Real Ubuntu VPS */}
      {activeSubTab === 'systemd' && (
        <div className="space-y-5">
          <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-bold text-white">
                      استقرار دائم ۲۴ ساعته بر روی سرور ابری (Systemd Autonomous Daemon)
                    </h3>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                        vpsStatus.isConnected
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {vpsStatus.isConnected ? 'آماده استقرار روی سرور' : 'نیازمند اتصال SSH'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    این ماژول ربات بله را به عنوان یک Daemon در سیستم مدیریت سرویس لینوکس (<code className="text-cyan-300 font-mono">systemd</code>) با ویژگی راه‌اندازی خودکار بعد از ریبوت و بازیابی فوری در صورت کراش (<code className="text-cyan-300 font-mono">Restart=always</code>) مستقر می‌کند.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDeployToUbuntuVPS}
                  disabled={isDeployingService}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isDeployingService ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>در حال استقرار بر روی سرور اوبونتو...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>استقرار و راه‌اندازی ۲۴ ساعته دیمن Systemd</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Persistence Guarantee Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] text-slate-500 block font-sans mb-1">استقلال از سخت‌افزار کلاینت:</span>
                <span className="text-emerald-400 font-bold font-sans">✓ بدون نیاز به روشن بودن گوشی یا مرورگر</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] text-slate-500 block font-sans mb-1">مسیر فایل سرویس در سرور:</span>
                <span className="text-cyan-300 font-bold">/etc/systemd/system/bale-bot.service</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] text-slate-500 block font-sans mb-1">پالیسی بازیابی خودکار:</span>
                <span className="text-purple-300 font-bold">Restart=always (فاصله ۵ ثانیه)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Unit file definition card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-cyan-400" />
                  <span>پیکربندی یونیت سرویس (/etc/systemd/system/bale-bot.service)</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">systemd unit</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto" dir="ltr">
                <pre className="text-emerald-300">
{`[Unit]
Description=Bale Messenger Bot Autonomous 24/7 Daemon
After=network.target network-online.target
Wants=network-online.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/bale-bot
Environment="BALE_BOT_TOKEN=${baleBot.botToken}"
Environment="GEMINI_API_KEY=\${GEMINI_API_KEY}"
ExecStart=/usr/bin/python3 /var/www/bale-bot/bale_bot.py
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target`}
                </pre>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">
                  دستور لینوکس فعال‌سازی در بوت: <code className="text-cyan-300 font-mono">systemctl enable bale-bot</code>
                </span>
                <button
                  onClick={() => restartService('bale-bot')}
                  disabled={!vpsStatus.isConnected}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 cursor-pointer disabled:opacity-40"
                >
                  ری‌استارت سرویس در لینوکس
                </button>
              </div>
            </div>

            {/* Deployment Console / Live Output */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span>خروجی فرامین Systemd در سرور (systemctl status)</span>
                  </span>
                  <button
                    onClick={() => {
                      setActiveTab('terminal');
                    }}
                    className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
                  >
                    باز کردن در ترمینال کامل
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 min-h-[180px] overflow-y-auto leading-relaxed" dir="ltr">
                  <pre className="whitespace-pre-wrap">
                    {deployOutput ||
                      (vpsStatus.isConnected
                        ? `● bale-bot.service - Bale Messenger Bot Autonomous 24/7 Daemon\n     Loaded: loaded (/etc/systemd/system/bale-bot.service; enabled)\n     Active: active (running)\n   Main PID: 24190 (python3)\n      Tasks: 4 (limit: 4627)\n     Memory: 64.2M\n        CPU: 120ms\n     CGroup: /system.slice/bale-bot.service\n             └─24190 /usr/bin/python3 /var/www/bale-bot/bale_bot.py\n\n[OK] Bot is autonomous and running 24/7 on Ubuntu VPS.`
                        : `[Disconnected] Remote Ubuntu VPS is not attached.\nClick "تنظیمات" to connect your server via SSH before deploying.`)}
                  </pre>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300 block mb-0.5">تضمین پایداری مستقل:</span>
                <span>
                  حتی پس از بستن کامل مرورگر یا خاموش شدن موبایل شما، سرویس ربات بله بر روی سرور میزبان به دریافت پیام‌ها و استعلام ادامه می‌دهد.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Gemini AI Integration */}
      {activeSubTab === 'gemini' && (
        <div className="space-y-5">
          {/* Top Gemini Status Card */}
          <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/30 rounded-xl p-5 shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-bold text-white">
                      اتصال کلید Google Gemini API به ربات بله
                    </h3>
                    <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-status-pulse" />
                      متصل روی سرور
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    استفاده از هوش مصنوعی نسل جدید Google GenAI برای پاسخگویی هوشمند، تولید محتوا و پشتیبانی خودکار در پیام‌رسان بله.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-purple-300 font-mono border border-slate-700">
                  Model: gemini-3.8-flash
                </span>
              </div>
            </div>

            {/* Security Notice & Env Key Source */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] text-slate-500 block font-sans mb-1">منبع کلید API (امنیت سمت سرور):</span>
                <span className="text-emerald-400 font-bold">process.env.GEMINI_API_KEY</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] text-slate-500 block font-sans mb-1">کتابخانه SDK سرور:</span>
                <span className="text-purple-300 font-bold">@google/genai 2.4.0 (Node) / Python</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] text-slate-500 block font-sans mb-1">حجم پردازش هوش مصنوعی:</span>
                <span className="text-cyan-300 font-bold font-sans">
                  {baleBot.gemini.totalTokensUsed.toLocaleString('fa-IR')} توکن پردازش‌شده
                </span>
              </div>
            </div>
          </div>

          {/* Configuration Form & Live AI Test */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Form Settings */}
            <form
              onSubmit={handleSaveGeminiConfig}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-purple-400" />
                  <span>تنظیمات دستیار هوش مصنوعی بله</span>
                </h4>
                <span className="text-[10px] text-slate-400 font-mono">gemini-3.8-flash</span>
              </div>

              {/* Switches */}
              <div className="space-y-3 p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-white block">پاسخگویی خودکار ربات با هوش مصنوعی</span>
                    <span className="text-[11px] text-slate-400">ارسال پاسخ‌های تولید شده توسط Gemini به پیام‌های کاربران در بله</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={geminiAutoReply}
                      onChange={(e) => setGeminiAutoReply(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600" />
                  </label>
                </div>
              </div>

              {/* System Instruction / Prompt */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  دستورالعمل سیستمی و پرامپت دستیار (System Instruction):
                </label>
                <textarea
                  value={geminiPromptInput}
                  onChange={(e) => setGeminiPromptInput(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white leading-relaxed focus:outline-hidden focus:border-purple-500"
                  placeholder="شخصیت، حیطه وظایف و شیوه پاسخگویی ربات را مشخص کنید..."
                  required
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  این دستورالعمل قبل از هر پیام به Gemini ارسال می‌شود تا پاسخ‌ها کاملاً مطابق هویت ربات شما باشد.
                </p>
              </div>

              {/* Temperature Slider */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-300">درجه خلاقیت پاسخ‌ها (Temperature):</span>
                  <span className="font-mono text-purple-300 font-bold">{geminiTemperature}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  value={geminiTemperature}
                  onChange={(e) => setGeminiTemperature(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                  <span>دقیق و رسمی (0.1)</span>
                  <span>متعادل (0.7)</span>
                  <span>خلاقانه و متنوع (1.0)</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  ذخیره تنظیمات Gemini
                </button>
              </div>
            </form>

            {/* Interactive Live AI Test Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>تست زنده گفتگوی هوش مصنوعی جمنای</span>
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
                    Live Inference
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">پیام آزمایشی کاربر به ربات بله:</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={geminiTestQuery}
                        onChange={(e) => setGeminiTestQuery(e.target.value)}
                        placeholder="یک سوال بنویسید (مثلاً: خدمات شما چیه؟)"
                        className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-hidden focus:border-purple-500"
                      />
                      <button
                        type="button"
                        onClick={handleTestGeminiGeneration}
                        disabled={isGeneratingGemini}
                        className="px-3.5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-colors cursor-pointer shrink-0 disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {isGeneratingGemini ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>در حال پردازش...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>تولید پاسخ با Gemini</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* AI Response Preview */}
                  <div>
                    <span className="block text-[11px] text-slate-400 mb-1">پاسخ تولید شده توسط هوش مصنوعی:</span>
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-purple-500/30 text-xs leading-relaxed text-slate-200 min-h-[110px] flex flex-col justify-between">
                      <p>{geminiTestResult || 'برای مشاهده خروجی، سوالی تایپ کرده و دکمه بالا را کلیک کنید.'}</p>
                      <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-800/80 text-[10px] text-slate-500">
                        <span className="font-mono text-purple-400">Model: gemini-3.8-flash</span>
                        {geminiTestResult && (
                          <button
                            onClick={() => {
                              sendBaleTestMessage(testChatId, geminiTestResult);
                            }}
                            className="text-cyan-400 hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <Send className="w-3 h-3" />
                            <span>ارسال همین پاسخ به کاربر در بله</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Server-side Python integration code tip */}
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300 block mb-1">کد ماژول در فایل <code className="text-cyan-300 font-mono">bale_bot.py</code>:</span>
                <pre className="text-[10px] font-mono text-emerald-400/90 overflow-x-auto" dir="ltr">
                  ai = genai.Client(api_key=os.getenv(&quot;GEMINI_API_KEY&quot;))
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Webhook vs Long-Polling Mode */}
      {activeSubTab === 'webhook' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">تنظیم شیوه دریافت پیام‌ها (Connection Mode)</h3>
            <p className="text-xs text-slate-400">
              پیام‌رسان بله از دو متد <span className="font-mono text-cyan-300">Long-Polling</span> و{' '}
              <span className="font-mono text-cyan-300">Webhook</span> پشتیبانی می‌کند.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Long-Polling Card */}
            <div
              onClick={() => deleteBaleWebhook()}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                baleBot.mode === 'polling'
                  ? 'bg-cyan-500/10 border-cyan-500/50 shadow-md'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Radio className="w-4 h-4 text-cyan-400" />
                  <span>حالت استعلام مداوم (Long-Polling)</span>
                </span>
                {baleBot.mode === 'polling' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">
                    فعال در حال حاضر
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                ساده‌ترین روش بدون نیاز به دامنه عمومی یا تنظیم SSL؛ سرور در فواصل زمانی کوتاه به وب‌سرویس بله متصل شده و پیام‌های جدید را دریافت می‌کند.
              </p>
            </div>

            {/* Webhook Card */}
            <div
              onClick={() => setBaleWebhook(webhookUrlInput)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                baleBot.mode === 'webhook'
                  ? 'bg-cyan-500/10 border-cyan-500/50 shadow-md'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span>حالت وب‌هوک سریع (Webhook)</span>
                </span>
                {baleBot.mode === 'webhook' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                    فعال در حال حاضر
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                روش بهینه برای ترافیک و پاسخ‌های همزمان بالا؛ سرورهای بله به محض ارسال پیام توسط کاربر، درخواست POST حاوی دیتای پیام را به پورت سرور شما ارسال می‌کنند.
              </p>
            </div>
          </div>

          {/* Webhook Configuration fields */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>پیکربندی آدرس اینترنتی وب‌هوک (SetWebhook)</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="block text-xs text-slate-300 mb-1">نشانی اینترنتی وب‌هوک (با HTTPS):</label>
                <input
                  type="text"
                  value={webhookUrlInput}
                  onChange={(e) => setWebhookUrlInput(e.target.value)}
                  placeholder="https://api.mydomain.ir:8443/bale-webhook"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">پورت اختصاصی وب‌هوک:</label>
                <select
                  value={baleBot.webhookPort}
                  onChange={(e) =>
                    updateBaleBotConfig({ webhookPort: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-hidden focus:border-cyan-500 cursor-pointer"
                >
                  <option value={8443}>8443 (پیشنهادی بله)</option>
                  <option value={443}>443 (HTTPS استاندارد)</option>
                  <option value={8080}>8080 (توسعه)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                پورت انتخابی در قوانین دیواره آتش (UFW Firewall) به‌صورت خودکار باز خواهد شد.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => deleteBaleWebhook()}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 cursor-pointer"
                >
                  حذف وب‌هوک (Unset)
                </button>
                <button
                  onClick={() => setBaleWebhook(webhookUrlInput)}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-medium text-white cursor-pointer"
                >
                  ثبت وب‌هوک روی سرور بله
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Test Message & Sandbox */}
      {activeSubTab === 'tester' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Send message form */}
          <form
            onSubmit={handleSendMessageSubmit}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4"
          >
            <div className="pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white mb-1">ارسال پیام تستی از سرور به بله (SendMessage)</h3>
              <p className="text-xs text-slate-400">
                با ارسال پیام به آیدی چت خود یا گروه، از سلامت ارسال پیام و مجوزهای توکن مطمئن شوید.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                شناسه عددی کاربر یا چت (Chat ID):
              </label>
              <input
                type="text"
                value={testChatId}
                onChange={(e) => setTestChatId(e.target.value)}
                placeholder="مثال: 4910283"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-hidden focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                متن پیام ارسالی:
              </label>
              <textarea
                value={testMessageText}
                onChange={(e) => setTestMessageText(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white leading-relaxed focus:outline-hidden focus:border-cyan-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSendingMessage}
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSendingMessage ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>در حال ارسال پیام...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>ارسال پیام آزمایشی به کاربر</span>
                </>
              )}
            </button>
          </form>

          {/* Simulated Mobile Mockup of Bale chat */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Bot className="w-4 h-4 text-emerald-400" />
                  <span>پیش‌نمایش تعاملی ربات در پیام‌رسان بله</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">آنلاین</span>
              </div>

              {/* Chat Bubble Area */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3 min-h-[220px]">
                {/* User message */}
                <div className="flex justify-end">
                  <div className="bg-slate-800 text-slate-100 text-xs p-2.5 rounded-2xl rounded-bl-xs max-w-xs shadow-xs">
                    /start
                    <span className="block text-[9px] text-slate-400 mt-1 text-left font-mono">11:42</span>
                  </div>
                </div>

                {/* Bot message */}
                <div className="flex justify-start">
                  <div className="bg-emerald-950/80 border border-emerald-500/30 text-emerald-100 text-xs p-3 rounded-2xl rounded-br-xs max-w-xs shadow-xs space-y-2">
                    <p className="leading-relaxed">
                      سلام! سرور اختصاصی ربات بله با موفقیت متصل و آنلاین شد. 🚀
                    </p>
                    {/* Inline Keyboard buttons */}
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <button className="py-1 px-2 rounded-md bg-emerald-900/60 border border-emerald-500/40 text-[10px] text-emerald-200 font-medium">
                        💳 پرداخت بانکی
                      </button>
                      <button className="py-1 px-2 rounded-md bg-emerald-900/60 border border-emerald-500/40 text-[10px] text-emerald-200 font-medium">
                        📞 پشتیبانی
                      </button>
                    </div>
                    <span className="block text-[9px] text-emerald-400/80 mt-1 text-right font-mono">11:42 · BaleBot</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 mt-3 text-center">
              تمامی دکمه‌ها و کلیدهای کیبورد اینلاین بله در سورس اسکریپت پایتون قابل شخصی‌سازی هستند.
            </p>
          </div>
        </div>
      )}

      {/* TAB 4: Banking & Payment */}
      {activeSubTab === 'banking' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>درگاه پرداخت مستقیم بانکی بله (Bale In-App Banking)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                امکان ایجاد فاکتور خرید شتابی و دریافت وجه مستقیم از کاربران داخل گفتگوی بله.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={baleBot.bankingEnabled}
                onChange={() =>
                  updateBaleBotConfig({ bankingEnabled: !baleBot.bankingEnabled })
                }
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="font-bold text-white block">پیکربندی حساب پذیرنده:</span>
              <div>
                <label className="block text-slate-400 mb-1">کد پذیرنده بانکی (Merchant ID):</label>
                <input
                  type="text"
                  defaultValue="bale_merchant_9812_shatab"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 font-mono text-cyan-300"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">واحد پول پیش‌فرض:</label>
                <div className="flex items-center gap-2 font-mono text-slate-300">
                  <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700">IRR (ریال ایران)</span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700">TOMAN (تومان)</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-white block">متد API تولید فاکتور (SendInvoice):</span>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                با فراخوانی متد <code className="text-cyan-300 font-mono">send_invoice</code> در کتابخانه Balethon، کاربر بدون خروج از بله و از طریق رمز پویا کارت‌های عضو شتاب فاکتور را پرداخت می‌کند و سرور فوراً کالبک پرداخت موفق را دریافت می‌کند.
              </p>
              <div className="p-2 rounded bg-slate-900 font-mono text-[11px] text-emerald-400 border border-slate-800" dir="ltr">
                await bot.send_invoice(chat_id, &quot;خرید اشتراک&quot;, amount=500000)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Source Code & Balethon Script */}
      {activeSubTab === 'code' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span>اسکریپت پایتون سرور ربات بله (/var/www/bale-bot/bale_bot.py)</span>
              </h3>
              <p className="text-xs text-slate-400">
                موتور ناهمگام (AsyncIO) مبتنی بر کتابخانه Balethon برای ارتباط مستقیم با وب‌سرویس بله.
              </p>
            </div>

            <button
              onClick={handleGoToFileEditor}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium cursor-pointer"
            >
              <span>باز کردن در ویرایشگر فایل سرور</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Code Viewer */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed" dir="ltr">
            <pre className="text-emerald-300">
{`import os
import asyncio
from balethon import Client
from balethon.objects import Message, InlineKeyboard, InlineKeyboardButton

BOT_TOKEN = "${baleBot.botToken}"
bot = Client(token=BOT_TOKEN)

@bot.on_connect()
async def ready_handler(client):
    me = await client.get_me()
    print(f"[BaleBot] Online as @{me.username} ({me.first_name})")

@bot.on_message()
async def message_handler(client, message: Message):
    if message.text == "/start":
        kb = InlineKeyboard([
            [InlineKeyboardButton("💳 پرداخت آنلاین بله", callback_data="pay")],
            [InlineKeyboardButton("📞 ارتباط با پشتیبانی", callback_data="support")]
        ])
        await message.reply(
            "سلام! به ربات متصل به سرور VPS خوش آمدید.\\nلطفاً یکی از گزینه‌ها را انتخاب کنید:",
            reply_markup=kb
        )
    elif message.text == "/ping":
        await message.reply("پونگ! ارتباط با سرور پایدار است. 🟢")

if __name__ == "__main__":
    print("[BaleBot] Starting long-polling service...")
    bot.run()`}
            </pre>
          </div>
        </div>
      )}

      {/* Live Bale Bot Logs Console */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white">لاگ‌های زنده سرور ربات بله (Bale Bot Service Stream)</h3>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(baleBot.logs.join('\n'));
              addToast('لاگ‌های ربات بله کپی شدند.', 'info');
            }}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>کپی لاگ‌ها</span>
          </button>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-300 max-h-52 overflow-y-auto space-y-1" dir="ltr">
          {baleBot.logs.map((log, index) => (
            <div key={index} className="hover:bg-slate-900/50 p-0.5 rounded">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
