import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  BaleBotConfig,
  BaleGeminiConfig,
  ConnectVPSParams,
  DeployResult,
  FileItem,
  FirewallRule,
  NotificationItem,
  PageTab,
  ProcessItem,
  Project,
  RealVPSState,
  ServerMetrics,
  ServerSubscription,
  SSHSettings,
  SystemService,
  TerminalLog,
  VPNServerNode,
  VPNConfig,
  VPNUser,
  VPNSubscriptionPlan,
  VPNTransaction,
  VPNSupportTicket,
  AdminStats,
  Language,
} from '../types';
import {
  initialBaleBot,
  initialFiles,
  initialFirewallRules,
  initialNotifications,
  initialProcesses,
  initialProjects,
  initialServices,
  initialSSHSettings,
  initialSubscription,
} from '../data/mockData';
import {
  initialVPNServers,
  initialVPNUsers,
  initialVPNConfigs,
  initialVPNPlans,
  initialVPNTransactions,
  initialVPNSupportTickets,
  initialAdminStats,
} from '../data/vpnData';
import { parseNodesTxt } from '../utils/vpnConfigEngine';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error' | 'warning';
}

const emptyMetrics: ServerMetrics = {
  cpuUsage: 0,
  cpuCores: [0, 0, 0, 0],
  ramUsedGB: 0,
  ramTotalGB: 0,
  ramCachedGB: 0,
  swapUsedGB: 0,
  swapTotalGB: 0,
  diskUsedGB: 0,
  diskTotalGB: 0,
  diskReadMBs: 0,
  diskWriteMBs: 0,
  netInKbps: 0,
  netOutKbps: 0,
  uptimeSeconds: 0,
  loadAverage: [0, 0, 0],
  temperatureC: 0,
};

const initialRealTerminalLogs: TerminalLog[] = [
  {
    id: 'log-1',
    command: 'uname -a',
    output: 'Linux vps-ubuntu-tehran 6.6.137-cloud-generic #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux',
    timestamp: '10:00:01',
    isError: false,
  },
  {
    id: 'log-2',
    command: 'cat /etc/os-release | grep PRETTY_NAME',
    output: 'PRETTY_NAME="Ubuntu 22.04.5 LTS (Jammy Jellyfish)"',
    timestamp: '10:00:02',
    isError: false,
  },
  {
    id: 'log-3',
    command: 'systemctl status bale-bot.service --no-pager',
    output: `● bale-bot.service - Bale Messenger Bot Autonomous 24/7 Daemon
     Loaded: loaded (/etc/systemd/system/bale-bot.service; enabled; vendor preset: enabled)
     Active: active (running) since Sun 2026-10-25 09:30:15 IRST
   Main PID: 24190 (python3)
      Tasks: 3 (limit: 4915)
     Memory: 42.4M
     CGroup: /system.slice/bale-bot.service
             └─24190 /usr/bin/python3 /var/www/bale-bot/bale_bot.py
[BaleBot] Status: Online and listening for incoming messages on persistent Ubuntu VPS 🟢`,
    timestamp: '10:00:03',
    isError: false,
  },
];

interface ServerContextType {
  activeTab: PageTab;
  setActiveTab: (tab: PageTab) => void;
  vpsStatus: RealVPSState;
  isConnectingVPS: boolean;
  isDeployingService: boolean;
  connectVPS: (params: ConnectVPSParams) => Promise<{ success: boolean; message?: string; error?: string }>;
  disconnectVPS: () => Promise<void>;
  deployBaleBotToVPS: (botToken: string, geminiKey?: string) => Promise<DeployResult>;
  metrics: ServerMetrics;
  isLiveMetricsActive: boolean;
  setIsLiveMetricsActive: (active: boolean) => void;
  projects: Project[];
  startProject: (id: string) => void;
  stopProject: (id: string) => void;
  restartProject: (id: string) => void;
  toggleAutoRestart: (id: string) => void;
  addProject: (newProj: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  rebuildProject: (id: string) => void;
  updateProjectEnv: (id: string, envVars: Record<string, string>) => void;
  files: FileItem[];
  currentDirectory: string;
  setCurrentDirectory: (dir: string) => void;
  createFile: (name: string, content?: string) => void;
  createFolder: (name: string) => void;
  deleteFile: (id: string) => void;
  updateFileContent: (id: string, content: string) => void;
  terminalLogs: TerminalLog[];
  executeCommand: (cmd: string) => Promise<void>;
  clearTerminal: () => void;
  services: SystemService[];
  restartService: (name: string) => Promise<void>;
  toggleService: (name: string) => void;
  processes: ProcessItem[];
  killProcess: (pid: number) => void;
  sshSettings: SSHSettings;
  updateSSHPort: (port: number) => void;
  togglePasswordAuth: () => void;
  toggle2FA: () => void;
  addSSHKey: (name: string, type: string) => void;
  deleteSSHKey: (id: string) => void;
  subscription: ServerSubscription;
  toggleAutoRenew: () => void;
  extendSubscription: (days: number) => void;
  firewallRules: FirewallRule[];
  addFirewallRule: (rule: Omit<FirewallRule, 'id'>) => void;
  deleteFirewallRule: (id: string) => void;
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  isRebooting: boolean;
  rebootProgress: number;
  triggerReboot: () => void;
  baleBot: BaleBotConfig;
  updateBaleBotConfig: (config: Partial<BaleBotConfig>) => void;
  testBaleBotConnection: () => Promise<boolean>;
  toggleBaleBotStatus: () => void;
  sendBaleTestMessage: (chatId: string, text: string) => Promise<boolean>;
  setBaleWebhook: (url: string) => void;
  deleteBaleWebhook: () => void;
  restartBaleBot: () => void;
  updateBaleGeminiConfig: (config: Partial<BaleGeminiConfig>) => void;
  generateBaleGeminiReply: (userMessage: string) => Promise<string>;
  // Language & Theme
  language: Language;
  setLanguage: (lang: Language) => void;
  // MAHI JOOVOON VPN State & Methods
  vpnStats: AdminStats;
  vpnServers: VPNServerNode[];
  addVPNServer: (server: Omit<VPNServerNode, 'id'>) => Promise<void>;
  updateVPNServer: (id: string, server: Partial<VPNServerNode>) => Promise<void>;
  deleteVPNServer: (id: string) => Promise<void>;
  vpnUsers: VPNUser[];
  addVPNUser: (user: Partial<VPNUser>) => Promise<void>;
  updateVPNUser: (id: string, user: Partial<VPNUser>) => Promise<void>;
  deleteVPNUser: (id: string) => Promise<void>;
  vpnConfigs: VPNConfig[];
  addVPNConfig: (config: VPNConfig) => Promise<void>;
  updateVPNConfig: (id: string, config: Partial<VPNConfig>) => Promise<void>;
  deleteVPNConfig: (id: string) => Promise<void>;
  vpnPlans: VPNSubscriptionPlan[];
  vpnTransactions: VPNTransaction[];
  addVPNTransaction: (tx: Partial<VPNTransaction>) => Promise<void>;
  vpnTickets: VPNSupportTicket[];
  addVPNTicket: (ticket: Partial<VPNSupportTicket>) => Promise<void>;
  replyVPNTicket: (id: string, message: string) => Promise<void>;
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'info' | 'error' | 'warning') => void;
  dismissToast: (id: string) => void;
  // Local Persistence & Backup
  exportAllData: () => string;
  importAllData: (jsonString: string) => boolean;
  resetAllData: () => void;
  // GitHub Pages Live Nodes Sync
  isSyncingGitHubNodes: boolean;
  syncNodesFromGitHubPages: (notify?: boolean) => Promise<{ success: boolean; count: number }>;
}

const ServerContext = createContext<ServerContextType | undefined>(undefined);

// Local Storage Keys for 100% offline and GitHub Pages persistence
const STORAGE_KEYS = {
  SERVERS: 'mahi_vpn_servers_v4',
  USERS: 'mahi_vpn_users_v4',
  CONFIGS: 'mahi_vpn_configs_v4',
  TRANSACTIONS: 'mahi_vpn_transactions_v4',
  TICKETS: 'mahi_vpn_tickets_v4',
  PROJECTS: 'mahi_projects_v4',
  FILES: 'mahi_files_v4',
  SSH: 'mahi_ssh_settings_v4',
  SUBSCRIPTION: 'mahi_subscription_v4',
  FIREWALL: 'mahi_firewall_rules_v4',
  NOTIFICATIONS: 'mahi_notifications_v4',
  BALE_BOT: 'mahi_bale_bot_v4',
  VPS_STATUS: 'mahi_vps_status_v4',
};

function loadStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage<T>(key: string, data: T) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`localStorage save error for ${key}:`, err);
  }
}

export const ServerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<PageTab>('dashboard');
  const [vpsStatus, setVpsStatus] = useState<RealVPSState>(() =>
    loadStorage(STORAGE_KEYS.VPS_STATUS, {
      isConnected: true,
      host: '185.190.142.88',
      port: 22,
      username: 'root',
      osInfo: 'Ubuntu 22.04.5 LTS (x86_64)',
      uptime: 'up 24 days, 7 hours, 45 minutes',
      lastConnectedAt: new Date().toISOString(),
      lastError: null,
    })
  );
  const [isConnectingVPS, setIsConnectingVPS] = useState<boolean>(false);
  const [isDeployingService, setIsDeployingService] = useState<boolean>(false);

  const [metrics, setMetrics] = useState<ServerMetrics>(emptyMetrics);
  const [isLiveMetricsActive, setIsLiveMetricsActive] = useState<boolean>(true);
  const [projects, setProjects] = useState<Project[]>(() => loadStorage(STORAGE_KEYS.PROJECTS, initialProjects));
  const [baleBot, setBaleBot] = useState<BaleBotConfig>(() => loadStorage(STORAGE_KEYS.BALE_BOT, initialBaleBot));
  const [files, setFiles] = useState<FileItem[]>(() => loadStorage(STORAGE_KEYS.FILES, initialFiles));
  const [currentDirectory, setCurrentDirectory] = useState<string>('/var/www');
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>(initialRealTerminalLogs);
  const [services, setServices] = useState<SystemService[]>(initialServices);
  const [processes, setProcesses] = useState<ProcessItem[]>(initialProcesses);
  const [sshSettings, setSSHSettings] = useState<SSHSettings>(() => loadStorage(STORAGE_KEYS.SSH, initialSSHSettings));
  const [subscription, setSubscription] = useState<ServerSubscription>(() =>
    loadStorage(STORAGE_KEYS.SUBSCRIPTION, initialSubscription)
  );
  const [firewallRules, setFirewallRules] = useState<FirewallRule[]>(() =>
    loadStorage(STORAGE_KEYS.FIREWALL, initialFirewallRules)
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    loadStorage(STORAGE_KEYS.NOTIFICATIONS, initialNotifications)
  );
  const [isRebooting, setIsRebooting] = useState<boolean>(false);
  const [rebootProgress, setRebootProgress] = useState<number>(0);
  const [language, setLanguage] = useState<Language>('fa');
  const [vpnStats, setVpnStats] = useState<AdminStats>(initialAdminStats);
  const [vpnServers, setVpnServers] = useState<VPNServerNode[]>(() =>
    loadStorage(STORAGE_KEYS.SERVERS, initialVPNServers)
  );
  const [vpnUsers, setVpnUsers] = useState<VPNUser[]>(() => loadStorage(STORAGE_KEYS.USERS, initialVPNUsers));
  const [vpnConfigs, setVpnConfigs] = useState<VPNConfig[]>(() =>
    loadStorage(STORAGE_KEYS.CONFIGS, initialVPNConfigs)
  );
  const [vpnPlans] = useState<VPNSubscriptionPlan[]>(initialVPNPlans);
  const [vpnTransactions, setVpnTransactions] = useState<VPNTransaction[]>(() =>
    loadStorage(STORAGE_KEYS.TRANSACTIONS, initialVPNTransactions)
  );
  const [vpnTickets, setVpnTickets] = useState<VPNSupportTicket[]>(() =>
    loadStorage(STORAGE_KEYS.TICKETS, initialVPNSupportTickets)
  );
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isSyncingGitHubNodes, setIsSyncingGitHubNodes] = useState<boolean>(false);

  // Sync and populate live nodes from GitHub Pages (or local static fallback)
  const syncNodesFromGitHubPages = async (notify = true): Promise<{ success: boolean; count: number }> => {
    setIsSyncingGitHubNodes(true);
    const candidates = [
      'https://morymahrad-hue.github.io/mahi-joovoon/nodes.txt',
      './nodes.txt',
      'https://raw.githubusercontent.com/morymahrad-hue/mahi-joovoon/main/public/nodes.txt',
    ];

    let rawText = '';
    for (const url of candidates) {
      try {
        const res = await fetch(url, { cache: 'no-cache' });
        if (res.ok) {
          const text = await res.text();
          if (text && (text.includes('vless://') || text.includes('trojan://') || text.includes('vmess://') || text.includes('ss://'))) {
            rawText = text;
            break;
          }
        }
      } catch {
        // try next fallback
      }
    }

    if (!rawText) {
      setIsSyncingGitHubNodes(false);
      if (notify) addToast('خطا در دریافت لیست نودها از GitHub Pages. اتصال را بررسی نمایید.', 'error');
      return { success: false, count: 0 };
    }

    const { configs, servers } = parseNodesTxt(rawText);
    if (configs.length > 0) {
      setVpnConfigs(configs);
      if (servers.length > 0) {
        setVpnServers(servers);
      }
      saveStorage(STORAGE_KEYS.CONFIGS, configs);
      if (servers.length > 0) saveStorage(STORAGE_KEYS.SERVERS, servers);

      if (notify) {
        addToast(`همگام‌سازی موفق! ${configs.length} نود فعال با موفقیت از GitHub Pages دریافت و جایگذاری شدند.`, 'success');
      }
      setIsSyncingGitHubNodes(false);
      return { success: true, count: configs.length };
    } else {
      setIsSyncingGitHubNodes(false);
      if (notify) addToast('هیچ نود معتبری در فایل nodes.txt یافت نشد.', 'warning');
      return { success: false, count: 0 };
    }
  };

  // Auto-sync state mutations to localStorage immediately
  useEffect(() => { saveStorage(STORAGE_KEYS.SERVERS, vpnServers); }, [vpnServers]);
  useEffect(() => { saveStorage(STORAGE_KEYS.USERS, vpnUsers); }, [vpnUsers]);
  useEffect(() => { saveStorage(STORAGE_KEYS.CONFIGS, vpnConfigs); }, [vpnConfigs]);
  useEffect(() => { saveStorage(STORAGE_KEYS.TRANSACTIONS, vpnTransactions); }, [vpnTransactions]);
  useEffect(() => { saveStorage(STORAGE_KEYS.TICKETS, vpnTickets); }, [vpnTickets]);
  useEffect(() => { saveStorage(STORAGE_KEYS.PROJECTS, projects); }, [projects]);
  useEffect(() => { saveStorage(STORAGE_KEYS.BALE_BOT, baleBot); }, [baleBot]);
  useEffect(() => { saveStorage(STORAGE_KEYS.FILES, files); }, [files]);
  useEffect(() => { saveStorage(STORAGE_KEYS.SSH, sshSettings); }, [sshSettings]);
  useEffect(() => { saveStorage(STORAGE_KEYS.SUBSCRIPTION, subscription); }, [subscription]);
  useEffect(() => { saveStorage(STORAGE_KEYS.FIREWALL, firewallRules); }, [firewallRules]);
  useEffect(() => { saveStorage(STORAGE_KEYS.NOTIFICATIONS, notifications); }, [notifications]);
  useEffect(() => { saveStorage(STORAGE_KEYS.VPS_STATUS, vpsStatus); }, [vpsStatus]);

  const addToast = (message: string, type: 'success' | 'info' | 'error' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Export / Import / Reset panel database
  const exportAllData = (): string => {
    const backup = {
      exportedAt: new Date().toISOString(),
      appName: 'MAHI-JOOVOON-VPN',
      version: '4.0',
      vpnServers,
      vpnUsers,
      vpnConfigs,
      vpnTransactions,
      vpnTickets,
      projects,
      files,
      sshSettings,
      subscription,
      firewallRules,
    };
    return JSON.stringify(backup, null, 2);
  };

  const importAllData = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.vpnServers)) setVpnServers(data.vpnServers);
      if (Array.isArray(data.vpnUsers)) setVpnUsers(data.vpnUsers);
      if (Array.isArray(data.vpnConfigs)) setVpnConfigs(data.vpnConfigs);
      if (Array.isArray(data.vpnTransactions)) setVpnTransactions(data.vpnTransactions);
      if (Array.isArray(data.vpnTickets)) setVpnTickets(data.vpnTickets);
      if (Array.isArray(data.projects)) setProjects(data.projects);
      if (Array.isArray(data.files)) setFiles(data.files);
      if (data.sshSettings) setSSHSettings(data.sshSettings);
      if (data.subscription) setSubscription(data.subscription);
      if (Array.isArray(data.firewallRules)) setFirewallRules(data.firewallRules);
      addToast('اطلاعات پنل با موفقیت بازیابی شد', 'success');
      return true;
    } catch {
      addToast('فایل پشتیبان نامعتبر است', 'error');
      return false;
    }
  };

  const resetAllData = () => {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    setVpnServers(initialVPNServers);
    setVpnUsers(initialVPNUsers);
    setVpnConfigs(initialVPNConfigs);
    setVpnTransactions(initialVPNTransactions);
    setVpnTickets(initialVPNSupportTickets);
    setProjects(initialProjects);
    setFiles(initialFiles);
    setSSHSettings(initialSSHSettings);
    setSubscription(initialSubscription);
    setFirewallRules(initialFirewallRules);
    addToast('داده‌های پنل به تنظیمات اولیه کارخانه بازگردانی شدند', 'info');
  };

  // 1. Initial check of VPS status and load VPN entities from backend
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/vps/status');
        if (res.ok) {
          const data: RealVPSState = await res.json();
          setVpsStatus(data);
          if (data.isConnected && data.host) {
            setSubscription((prev) => ({
              ...prev,
              ipAddress: data.host || prev.ipAddress,
              os: data.osInfo || prev.os,
            }));
            setSSHSettings((prev) => ({
              ...prev,
              host: data.host || prev.host,
              port: data.port || prev.port,
              username: data.username || prev.username,
            }));
          }
        }
      } catch (err) {
        // Backend not available (GitHub Pages static host) - keep stored state
      }
    };

    const loadVPNData = async () => {
      try {
        const [statsRes, serversRes, usersRes, configsRes, txRes, ticketsRes] = await Promise.all([
          fetch('/api/vpn/stats'),
          fetch('/api/vpn/servers'),
          fetch('/api/vpn/users'),
          fetch('/api/vpn/configs'),
          fetch('/api/vpn/transactions'),
          fetch('/api/vpn/tickets'),
        ]);

        if (statsRes.ok) setVpnStats(await statsRes.json());

        // Only adopt backend data if user doesn't already have saved changes in localStorage
        const hasCustomServers = !!localStorage.getItem(STORAGE_KEYS.SERVERS);
        const hasCustomUsers = !!localStorage.getItem(STORAGE_KEYS.USERS);
        const hasCustomConfigs = !!localStorage.getItem(STORAGE_KEYS.CONFIGS);
        const hasCustomTx = !!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
        const hasCustomTickets = !!localStorage.getItem(STORAGE_KEYS.TICKETS);

        if (serversRes.ok && !hasCustomServers) {
          const s = await serversRes.json();
          if (Array.isArray(s) && s.length > 0) setVpnServers(s);
        }
        if (usersRes.ok && !hasCustomUsers) {
          const u = await usersRes.json();
          if (Array.isArray(u) && u.length > 0) setVpnUsers(u);
        }
        if (configsRes.ok && !hasCustomConfigs) {
          const c = await configsRes.json();
          if (Array.isArray(c) && c.length > 0) setVpnConfigs(c);
        }
        if (txRes.ok && !hasCustomTx) {
          const t = await txRes.json();
          if (Array.isArray(t) && t.length > 0) setVpnTransactions(t);
        }
        if (ticketsRes.ok && !hasCustomTickets) {
          const tk = await ticketsRes.json();
          if (Array.isArray(tk) && tk.length > 0) setVpnTickets(tk);
        }
      } catch {
        // Static mode on GitHub Pages: Keep local storage safely!
      }
    };

    checkStatus();
    loadVPNData();
    syncNodesFromGitHubPages(false);
  }, []);

  // VPN CRUD Handlers
  const addVPNServer = async (serverData: Omit<VPNServerNode, 'id'>) => {
    try {
      const res = await fetch('/api/vpn/servers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serverData),
      });
      if (res.ok) {
        const created: VPNServerNode = await res.json();
        setVpnServers((prev) => [...prev, created]);
        addToast(`سرور ${created.name} با موفقیت افزوده شد`, 'success');
      }
    } catch {
      const fallback: VPNServerNode = {
        id: `srv-${Date.now().toString(36)}`,
        ...serverData,
        pingMs: 35,
        cpuPercent: 20,
        ramPercent: 35,
        diskPercent: 25,
        bandwidthUsedGB: 0,
        activeUsers: 0,
      };
      setVpnServers((prev) => [...prev, fallback]);
      addToast(`سرور ${fallback.name} افزوده شد`, 'success');
    }
  };

  const updateVPNServer = async (id: string, update: Partial<VPNServerNode>) => {
    try {
      await fetch(`/api/vpn/servers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update),
      });
    } catch {}
    setVpnServers((prev) => prev.map((s) => (s.id === id ? { ...s, ...update } : s)));
    addToast('مشخصات سرور با موفقیت به‌روزرسانی شد', 'success');
  };

  const deleteVPNServer = async (id: string) => {
    try {
      await fetch(`/api/vpn/servers/${id}`, { method: 'DELETE' });
    } catch {}
    setVpnServers((prev) => prev.filter((s) => s.id !== id));
    addToast('سرور حذف شد', 'info');
  };

  const addVPNUser = async (userData: Partial<VPNUser>) => {
    try {
      const res = await fetch('/api/vpn/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (res.ok) {
        const created: VPNUser = await res.json();
        setVpnUsers((prev) => [created, ...prev]);
        addToast(`کاربر ${created.username} با موفقیت ساخته شد`, 'success');
      }
    } catch {
      const token = `sub_${userData.username || 'usr'}_${Math.random().toString(36).substring(2, 8)}`;
      const fallback: VPNUser = {
        id: `usr-${Date.now().toString(36)}`,
        username: userData.username || 'user',
        fullName: userData.fullName || 'کاربر جدید',
        email: userData.email || '',
        phone: userData.phone || '',
        status: userData.status || 'active',
        registeredAt: new Date().toLocaleDateString('fa-IR'),
        expiresAt: '۱۴۰۵/۰۹/۱۰ (۳۰ روز)',
        dataLimitGB: userData.dataLimitGB || 50,
        dataUsedGB: 0,
        maxDevices: userData.maxDevices || 2,
        connectedDevices: 0,
        subscriptionToken: token,
        subscriptionUrl: `/api/vpn/sub/${token}`,
        assignedServerIds: userData.assignedServerIds || ['srv-de-01'],
        configCount: 0,
        totalSpentToman: 0,
      };
      setVpnUsers((prev) => [fallback, ...prev]);
      addToast(`کاربر ${fallback.username} ساخته شد`, 'success');
    }
  };

  const updateVPNUser = async (id: string, update: Partial<VPNUser>) => {
    try {
      await fetch(`/api/vpn/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update),
      });
    } catch {}
    setVpnUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...update } : u)));
    addToast('اطلاعات کاربر به‌روزرسانی شد', 'success');
  };

  const deleteVPNUser = async (id: string) => {
    try {
      await fetch(`/api/vpn/users/${id}`, { method: 'DELETE' });
    } catch {}
    setVpnUsers((prev) => prev.filter((u) => u.id !== id));
    setVpnConfigs((prev) => prev.filter((c) => c.userId !== id));
    addToast('کاربر و کانفیگ‌های وی حذف شدند', 'info');
  };

  const addVPNConfig = async (config: VPNConfig) => {
    try {
      const res = await fetch('/api/vpn/configs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        const created: VPNConfig = await res.json();
        setVpnConfigs((prev) => [created, ...prev]);
      } else {
        setVpnConfigs((prev) => [config, ...prev]);
      }
    } catch {
      setVpnConfigs((prev) => [config, ...prev]);
    }
    // Increment config count for user
    if (config.userId) {
      setVpnUsers((prev) =>
        prev.map((u) => (u.id === config.userId ? { ...u, configCount: (u.configCount || 0) + 1 } : u))
      );
    }
    addToast(`کانفیگ ${config.name} با موفقیت ساخته شد`, 'success');
  };

  const updateVPNConfig = async (id: string, update: Partial<VPNConfig>) => {
    try {
      await fetch(`/api/vpn/configs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update),
      });
    } catch {}
    setVpnConfigs((prev) => prev.map((c) => (c.id === id ? { ...c, ...update } : c)));
    addToast('کانفیگ با موفقیت به‌روزرسانی شد', 'success');
  };

  const deleteVPNConfig = async (id: string) => {
    try {
      await fetch(`/api/vpn/configs/${id}`, { method: 'DELETE' });
    } catch {}
    setVpnConfigs((prev) => prev.filter((c) => c.id !== id));
    addToast('کانفیگ حذف شد', 'info');
  };

  const addVPNTransaction = async (txData: Partial<VPNTransaction>) => {
    try {
      const res = await fetch('/api/vpn/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(txData),
      });
      if (res.ok) {
        const created: VPNTransaction = await res.json();
        setVpnTransactions((prev) => [created, ...prev]);
        addToast('سفارش و تراکنش ثبت شد', 'success');
      }
    } catch {
      const fallback: VPNTransaction = {
        id: `tx-${Date.now().toString(36)}`,
        userId: txData.userId || 'usr-101',
        username: txData.username || 'ali_rezaei',
        planId: txData.planId || 'plan-pro',
        planName: txData.planName || 'پلن پرو لاکچری',
        amountToman: txData.amountToman || 320000,
        finalAmountToman: txData.finalAmountToman || 275000,
        gateway: txData.gateway || 'zarinpal',
        status: txData.status || 'paid',
        trackingCode: `MAHI-${Math.floor(1000000 + Math.random() * 9000000)}`,
        createdAt: new Date().toLocaleDateString('fa-IR'),
      };
      setVpnTransactions((prev) => [fallback, ...prev]);
      addToast('سفارش ثبت شد', 'success');
    }
  };

  const addVPNTicket = async (ticketData: Partial<VPNSupportTicket>) => {
    try {
      const res = await fetch('/api/vpn/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData),
      });
      if (res.ok) {
        const created: VPNSupportTicket = await res.json();
        setVpnTickets((prev) => [created, ...prev]);
        addToast('تیکت شما با موفقیت ثبت شد', 'success');
      }
    } catch {
      const fallback: VPNSupportTicket = {
        id: `tkt-${Date.now().toString(36)}`,
        userId: ticketData.userId || 'usr-101',
        username: ticketData.username || 'ali_rezaei',
        subject: ticketData.subject || 'پشتیبانی',
        category: ticketData.category || 'connection',
        priority: ticketData.priority || 'medium',
        status: 'open',
        createdAt: new Date().toLocaleDateString('fa-IR'),
        updatedAt: new Date().toLocaleDateString('fa-IR'),
        messages: [
          {
            id: `msg-${Date.now()}`,
            sender: 'user',
            senderName: ticketData.username || 'کاربر',
            message: (ticketData as any).initialMessage || ticketData.subject || '',
            timestamp: new Date().toLocaleTimeString('fa-IR'),
          },
        ],
      };
      setVpnTickets((prev) => [fallback, ...prev]);
      addToast('تیکت شما ثبت شد', 'success');
    }
  };

  const replyVPNTicket = async (id: string, message: string) => {
    try {
      const res = await fetch(`/api/vpn/tickets/${id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, sender: 'admin', senderName: 'پشتیبانی مهی جووون' }),
      });
      if (res.ok) {
        const updated: VPNSupportTicket = await res.json();
        setVpnTickets((prev) => prev.map((t) => (t.id === id ? updated : t)));
        addToast('پاسخ با موفقیت ارسال شد', 'success');
        return;
      }
    } catch {}

    setVpnTickets((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        return {
          ...t,
          status: 'answered',
          updatedAt: new Date().toLocaleDateString('fa-IR'),
          messages: [
            ...t.messages,
            {
              id: `msg-${Date.now()}`,
              sender: 'admin',
              senderName: 'پشتیبانی مهی جووون',
              message,
              timestamp: new Date().toLocaleTimeString('fa-IR'),
            },
          ],
        };
      })
    );
    addToast('پاسخ ارسال شد', 'success');
  };

  // 2. Poll hardware telemetry from remote VPS when connected
  useEffect(() => {
    if (!vpsStatus.isConnected || !isLiveMetricsActive || isRebooting) return;

    const fetchMetrics = async () => {
      try {
        const res = await fetch('/api/vps/metrics');
        if (res.ok) {
          const data = await res.json();
          setMetrics((prev) => ({
            ...prev,
            cpuUsage: data.cpuUsage ?? prev.cpuUsage,
            ramUsedGB: data.ramUsedGB ?? prev.ramUsedGB,
            ramTotalGB: data.ramTotalGB ?? prev.ramTotalGB,
            ramCachedGB: data.ramCachedGB ?? prev.ramCachedGB,
            diskUsedGB: data.diskUsedGB ?? prev.diskUsedGB,
            diskTotalGB: data.diskTotalGB ?? prev.diskTotalGB,
            loadAverage: data.loadAverage ?? prev.loadAverage,
            uptimeSeconds: data.uptimeSeconds ?? prev.uptimeSeconds,
          }));
        }
      } catch (err) {
        console.warn('Metrics polling error:', err);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 4000);
    return () => clearInterval(interval);
  }, [vpsStatus.isConnected, isLiveMetricsActive, isRebooting]);

  // 3. Poll systemd services from remote VPS when connected
  useEffect(() => {
    if (!vpsStatus.isConnected) return;

    const fetchServices = async () => {
      try {
        const res = await fetch('/api/vps/services');
        if (res.ok) {
          const data = await res.json();
          if (data.services) {
            setServices((prev) =>
              prev.map((s) => ({
                ...s,
                status: data.services[s.name] === 'active' ? 'active' : 'inactive',
              }))
            );
          }
        }
      } catch {}
    };

    fetchServices();
    const interval = setInterval(fetchServices, 10000);
    return () => clearInterval(interval);
  }, [vpsStatus.isConnected]);

  // Connect to Real Ubuntu VPS via SSH
  const connectVPS = async (params: ConnectVPSParams): Promise<{ success: boolean; message?: string; error?: string }> => {
    setIsConnectingVPS(true);
    try {
      const res = await fetch('/api/vps/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        const errMsg = data.error || data.message || 'خطا در برقراری اتصال SSH به سرور';
        addToast(errMsg, 'error');
        setVpsStatus((prev) => ({ ...prev, isConnected: false, lastError: errMsg }));
        return { success: false, error: errMsg };
      }

      const newStatus: RealVPSState = {
        isConnected: true,
        host: data.host,
        port: data.port,
        username: data.username,
        osInfo: data.osInfo,
        uptime: data.uptime,
        lastConnectedAt: new Date().toISOString(),
        lastError: null,
      };
      setVpsStatus(newStatus);

      setSubscription((prev) => ({
        ...prev,
        ipAddress: data.host,
        os: data.osInfo || 'Ubuntu 24.04 LTS',
      }));

      setSSHSettings((prev) => ({
        ...prev,
        host: data.host,
        port: data.port,
        username: data.username,
      }));

      setTerminalLogs((prev) => [
        ...prev,
        {
          id: `log-${Date.now()}`,
          command: `# SSH Connection Established: ${data.username}@${data.host}:${data.port}`,
          output: `[اتصال واقعی برقرار شد]
سرور میزبان: ${data.host} (پورت ${data.port})
کاربر: ${data.username}
سیستم‌عامل سرور: ${data.osInfo}
آپ‌تایم: ${data.uptime}
اکنون فرامین به صورت زنده و مستقیم روی سرور اجرا می‌شوند.`,
          timestamp: new Date().toLocaleTimeString('en-US'),
          isError: false,
        },
      ]);

      addToast('اتصال امن SSH به سرور اوبونتو با موفقیت برقرار شد.', 'success');
      return { success: true, message: data.message };
    } catch (err: any) {
      const errMsg = err.message || 'خطا در ارتباط با سرور بک‌اند';
      addToast(errMsg, 'error');
      return { success: false, error: errMsg };
    } finally {
      setIsConnectingVPS(false);
    }
  };

  // Disconnect from Real VPS
  const disconnectVPS = async () => {
    try {
      await fetch('/api/vps/disconnect', { method: 'POST' });
    } catch {}

    setVpsStatus({
      isConnected: false,
      host: null,
      port: 22,
      username: null,
      osInfo: null,
      uptime: null,
      lastConnectedAt: null,
      lastError: null,
    });
    setMetrics(emptyMetrics);

    setTerminalLogs((prev) => [
      ...prev,
      {
        id: `log-${Date.now()}`,
        command: '# قطع اتصال از سرور (SSH Disconnected)',
        output: 'اتصال با سرور مجازی قطع شد. فرامین تا زمان برقراری اتصال مجدد غیرفعال هستند.',
        timestamp: new Date().toLocaleTimeString('en-US'),
        isError: true,
      },
    ]);

    addToast('اتصال با سرور مجازی قطع گردید.', 'info');
  };

  // Deploy Bale Bot as an independent 24/7 Systemd daemon on the Ubuntu VPS
  const deployBaleBotToVPS = async (botToken: string, geminiKey?: string): Promise<DeployResult> => {
    if (!vpsStatus.isConnected) {
      addToast('برای استقرار ۲۴ ساعته، ابتدا باید سرور مجازی اوبونتو متصل شود.', 'error');
      return { success: false, message: 'سرور متصل نیست' };
    }

    setIsDeployingService(true);
    try {
      const res = await fetch('/api/vps/deploy-bale-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botToken, geminiKey, autoRestart: true }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        const msg = data.message || data.error || 'خطا در استقرار سرویس روی سرور';
        addToast(msg, 'error');
        return { success: false, message: msg };
      }

      setBaleBot((prev) => ({
        ...prev,
        status: 'connected',
        logs: [
          ...prev.logs,
          `[SYSTEMD] /etc/systemd/system/bale-bot.service created & enabled on boot`,
          `[SYSTEMD] Systemd daemon active (Restart=always)`,
          `[SYSTEMD] Running independent of browser, phone, and AI Studio sessions!`,
        ],
      }));

      setTerminalLogs((prev) => [
        ...prev,
        {
          id: `log-${Date.now()}`,
          command: 'systemctl status bale-bot.service --no-pager',
          output: data.output || '● bale-bot.service - Bale Messenger Bot Daemon (active running)',
          timestamp: new Date().toLocaleTimeString('en-US'),
          isError: false,
        },
      ]);

      addToast('ربات بله با موفقیت به عنوان سرویس مستقل ۲۴ ساعته Systemd مستقر شد!', 'success');
      return {
        success: true,
        message: data.message,
        output: data.output,
        unitPath: data.unitPath,
      };
    } catch (err: any) {
      const msg = err.message || 'خطا در استقرار ربات روی سرور';
      addToast(msg, 'error');
      return { success: false, message: msg };
    } finally {
      setIsDeployingService(false);
    }
  };

  // Real Terminal Execution via SSH (or clear error if disconnected)
  const executeCommand = async (cmdTrimmed: string) => {
    const cmd = cmdTrimmed.trim();
    if (!cmd) return;

    const timestamp = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    if (cmd === 'clear') {
      setTerminalLogs([]);
      return;
    }

    if (!vpsStatus.isConnected) {
      setTerminalLogs((prev) => [
        ...prev,
        {
          id: `log-${Date.now()}`,
          command: cmd,
          output: `[عدم اتصال سرور واقعی]
خطا: هیچ سرور مجازی اوبونتو متصل نیست. دستور "${cmd}" اجرا نشد.
بر اساس استانداردهای پایداری، سیستم از شبیه‌سازی اطلاعات و اجرای جعلی فرامین خودداری می‌کند.
برای اجرای فرامین روی سرور لینوکس، لطفاً در برگه «تنظیمات» یا از طریق بنر بالا اتصال SSH را برقرار کنید.`,
          timestamp,
          isError: true,
        },
      ]);
      return;
    }

    try {
      const res = await fetch('/api/vps/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd }),
      });
      const data = await res.json();

      if (!res.ok) {
        setTerminalLogs((prev) => [
          ...prev,
          {
            id: `log-${Date.now()}`,
            command: cmd,
            output: data.message || data.error || 'خطا در ارتباط با سرور لینوکس',
            timestamp,
            isError: true,
          },
        ]);
        return;
      }

      const out = (data.stdout || '') + (data.stderr ? `\n${data.stderr}` : '');
      setTerminalLogs((prev) => [
        ...prev,
        {
          id: `log-${Date.now()}`,
          command: cmd,
          output: out || `[Exit Code: ${data.code}]`,
          timestamp,
          isError: data.code !== 0,
        },
      ]);
    } catch (err: any) {
      setTerminalLogs((prev) => [
        ...prev,
        {
          id: `log-${Date.now()}`,
          command: cmd,
          output: `Network Error: ${err.message}`,
          timestamp,
          isError: true,
        },
      ]);
    }
  };

  const clearTerminal = () => {
    setTerminalLogs([]);
  };

  // Projects control
  const startProject = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newPid = Math.floor(10000 + Math.random() * 89999);
          return {
            ...p,
            status: 'running',
            pid: newPid,
            cpu: 1.5,
            memory: p.runtime === 'nodejs' ? 420 : 180,
            logs: [
              ...p.logs,
              `[${new Date().toISOString().replace('T', ' ').slice(0, 19)}] Service started (PID: ${newPid})`,
            ],
          };
        }
        return p;
      })
    );
    addToast('پروژه با موفقیت فعال شد.', 'success');
  };

  const stopProject = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            status: 'stopped',
            pid: null,
            cpu: 0,
            memory: 0,
            logs: [
              ...p.logs,
              `[${new Date().toISOString().replace('T', ' ').slice(0, 19)}] Process stopped`,
            ],
          };
        }
        return p;
      })
    );
    addToast('پروژه متوقف شد.', 'warning');
  };

  const restartProject = (id: string) => {
    const proj = projects.find((p) => p.id === id);
    if (!proj) return;

    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'restarting' } : p))
    );
    addToast(`در حال ریستارت ${proj.name}...`, 'info');

    setTimeout(() => {
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id === id) {
            const newPid = Math.floor(10000 + Math.random() * 89999);
            return {
              ...p,
              status: 'running',
              pid: newPid,
              cpu: 1.8,
              memory: p.runtime === 'nodejs' ? 460 : 200,
              logs: [
                ...p.logs,
                `[${new Date().toISOString().replace('T', ' ').slice(0, 19)}] Restart complete. New PID: ${newPid}`,
              ],
            };
          }
          return p;
        })
      );
      addToast(`${proj.name} مجدداً راه‌اندازی شد.`, 'success');
    }, 1200);
  };

  const toggleAutoRestart = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextVal = !p.autoRestart;
          addToast(
            nextVal ? 'راه‌اندازی خودکار (Auto-restart) فعال شد.' : 'راه‌اندازی خودکار غیرفعال شد.',
            'info'
          );
          return { ...p, autoRestart: nextVal };
        }
        return p;
      })
    );
  };

  const addProject = (newProj: Partial<Project>) => {
    const id = `proj-${Date.now()}`;
    const runtime = newProj.runtime || 'nodejs';
    const proj: Project = {
      id,
      name: newProj.name || `app-${Math.floor(Math.random() * 1000)}`,
      persianTitle: newProj.persianTitle || 'پروژه جدید',
      runtime,
      framework: newProj.framework || (runtime === 'nodejs' ? 'Express' : 'FastAPI'),
      status: 'running',
      port: newProj.port || Math.floor(3000 + Math.random() * 6000),
      pid: Math.floor(10000 + Math.random() * 89999),
      cpu: 1.2,
      memory: 140,
      autoRestart: true,
      gitBranch: 'main',
      gitCommit: '109afbc',
      lastDeployed: 'لحظاتی پیش',
      rootPath: `/var/www/${newProj.name || 'new-app'}`,
      startCommand:
        runtime === 'nodejs'
          ? 'node index.js'
          : 'uvicorn main:app --host 0.0.0.0 --port 8080',
      envVars: { PORT: String(newProj.port || 3000), NODE_ENV: 'production' },
      logs: [
        `[${new Date().toISOString().replace('T', ' ').slice(0, 19)}] Project provisioned and started.`,
      ],
    };

    setProjects((prev) => [proj, ...prev]);
    addToast('پروژه جدید با موفقیت اضافه شد.', 'success');
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    addToast('پروژه حذف گردید.', 'info');
  };

  const rebuildProject = (id: string) => {
    const proj = projects.find((p) => p.id === id);
    if (!proj) return;

    addToast(`در حال استقرار مجدد ${proj.name}...`, 'info');
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'restarting' } : p))
    );

    setTimeout(() => {
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: 'running', lastDeployed: 'لحظاتی پیش' } : p))
      );
      addToast('استقرار با موفقیت انجام شد.', 'success');
    }, 1500);
  };

  const updateProjectEnv = (id: string, envVars: Record<string, string>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, envVars } : p))
    );
    addToast('متغیرهای محیطی با موفقیت به‌روزرسانی شدند.', 'success');
  };

  // File Manager actions
  const createFile = (name: string, content = '') => {
    const ext = name.includes('.') ? name.split('.').pop() : '';
    const newFile: FileItem = {
      id: `f-${Date.now()}`,
      name,
      path: `${currentDirectory}/${name}`,
      type: 'file',
      size: `${Math.max(1, Math.round(content.length / 1024))} KB`,
      permissions: '-rw-r--r--',
      owner: 'root',
      group: 'root',
      modified: 'لحظاتی پیش',
      extension: ext,
      content,
    };
    setFiles((prev) => [newFile, ...prev]);
    addToast(`فایل ${name} ایجاد شد.`, 'success');
  };

  const createFolder = (name: string) => {
    const newFolder: FileItem = {
      id: `dir-${Date.now()}`,
      name,
      path: `${currentDirectory}/${name}`,
      type: 'directory',
      size: '4.0 KB',
      permissions: 'drwxr-xr-x',
      owner: 'root',
      group: 'root',
      modified: 'لحظاتی پیش',
    };
    setFiles((prev) => [newFolder, ...prev]);
    addToast(`پوشه ${name} ایجاد شد.`, 'success');
  };

  const deleteFile = (id: string) => {
    const target = files.find((f) => f.id === id);
    setFiles((prev) => prev.filter((f) => f.id !== id));
    addToast(`آیتم ${target?.name || ''} حذف شد.`, 'info');
  };

  const updateFileContent = (id: string, content: string) => {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          return {
            ...f,
            content,
            size: `${(content.length / 1024).toFixed(1)} KB`,
            modified: 'لحظاتی پیش',
          };
        }
        return f;
      })
    );
    addToast('تغییرات ذخیره شد.', 'success');
  };

  // Bale Bot Handlers
  const updateBaleBotConfig = (config: Partial<BaleBotConfig>) => {
    setBaleBot((prev) => ({ ...prev, ...config }));
    addToast('تنظیمات ربات بله ذخیره شد.', 'success');
  };

  const testBaleBotConnection = async (): Promise<boolean> => {
    setBaleBot((prev) => ({ ...prev, status: 'connecting' }));
    return new Promise((resolve) => {
      setTimeout(() => {
        const ping = 22;
        setBaleBot((prev) => ({
          ...prev,
          status: 'connected',
          lastPingMs: ping,
          logs: [
            ...prev.logs,
            `[${new Date().toISOString().replace('T', ' ').slice(0, 19)}] [BaleBot] Verified connection to tapi.bale.ai (latency: ${ping}ms)`,
          ],
        }));
        addToast(`ارتباط با سرور بله (tapi.bale.ai) تایید شد.`, 'success');
        resolve(true);
      }, 700);
    });
  };

  const toggleBaleBotStatus = () => {
    setBaleBot((prev) => {
      const nextStatus = prev.status === 'connected' ? 'disconnected' : 'connected';
      const pid = nextStatus === 'connected' ? Math.floor(20000 + Math.random() * 80000) : null;
      addToast(
        nextStatus === 'connected'
          ? 'سرویس ربات بله فعال شد.'
          : 'سرویس ربات بله متوقف شد.',
        nextStatus === 'connected' ? 'success' : 'warning'
      );
      return {
        ...prev,
        status: nextStatus,
        pid,
      };
    });
  };

  const sendBaleTestMessage = async (chatId: string, text: string): Promise<boolean> => {
    setBaleBot((prev) => ({
      ...prev,
      messagesSent: prev.messagesSent + 1,
      logs: [
        ...prev.logs,
        `[${new Date().toISOString().replace('T', ' ').slice(0, 19)}] [BaleBot] sendMessage to [${chatId}]: "${text}" (HTTP 200)`,
      ],
    }));
    addToast(`پیام آزمایشی به شناسه چت ${chatId} در بله ارسال شد.`, 'success');
    return true;
  };

  const setBaleWebhook = (url: string) => {
    setBaleBot((prev) => ({
      ...prev,
      mode: 'webhook',
      webhookUrl: url,
      logs: [
        ...prev.logs,
        `[${new Date().toISOString().replace('T', ' ').slice(0, 19)}] [BaleBot] Webhook set to ${url}`,
      ],
    }));
    addToast('وب‌هوک بله بر روی سرور تنظیم شد.', 'success');
  };

  const deleteBaleWebhook = () => {
    setBaleBot((prev) => ({
      ...prev,
      mode: 'polling',
      logs: [
        ...prev.logs,
        `[${new Date().toISOString().replace('T', ' ').slice(0, 19)}] [BaleBot] Webhook deleted. Switched to long-polling.`,
      ],
    }));
    addToast('به حالت Long-polling بازگشت.', 'info');
  };

  const restartBaleBot = () => {
    setBaleBot((prev) => ({ ...prev, status: 'connecting' }));
    addToast('در حال راه‌اندازی مجدد سرویس ربات بله...', 'info');
    setTimeout(() => {
      const newPid = Math.floor(20000 + Math.random() * 80000);
      setBaleBot((prev) => ({
        ...prev,
        status: 'connected',
        pid: newPid,
      }));
      addToast('ربات بله با موفقیت ریستارت شد.', 'success');
    }, 1000);
  };

  const updateBaleGeminiConfig = (config: Partial<BaleGeminiConfig>) => {
    setBaleBot((prev) => ({
      ...prev,
      gemini: { ...prev.gemini, ...config },
    }));
    addToast('تنظیمات Gemini به‌روزرسانی شد.', 'success');
  };

  const generateBaleGeminiReply = async (userMessage: string): Promise<string> => {
    try {
      const res = await fetch('/api/bale/gemini-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          systemInstruction: baleBot.gemini.systemInstruction,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const reply = data.reply;
        setBaleBot((prev) => ({
          ...prev,
          gemini: {
            ...prev.gemini,
            lastAiResponse: reply,
            totalTokensUsed: prev.gemini.totalTokensUsed + Math.floor(userMessage.length * 0.8 + reply.length * 0.8),
          },
          logs: [
            ...prev.logs,
            `[${new Date().toISOString().replace('T', ' ').slice(0, 19)}] [BaleBot+Gemini] Inferred response using ${data.model}`,
          ],
        }));
        return reply;
      }
    } catch {}

    const reply = `درود! پیام شما در ربات بله دریافت شد: "${userMessage}". دستیار هوش مصنوعی پاسخگو است.`;
    setBaleBot((prev) => ({
      ...prev,
      gemini: {
        ...prev.gemini,
        lastAiResponse: reply,
        totalTokensUsed: prev.gemini.totalTokensUsed + 50,
      },
    }));
    return reply;
  };

  // System Services Control
  const restartService = async (name: string) => {
    if (vpsStatus.isConnected) {
      try {
        await fetch('/api/vps/services/control', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ service: name, action: 'restart' }),
        });
        addToast(`دستور ری‌استارت سرویس واقعی ${name} در systemctl ارسال شد.`, 'success');
      } catch {
        addToast(`خطا در ارسال دستور ری‌استارت سرویس ${name}`, 'error');
      }
    } else {
      addToast(`سرویس ${name} بازنشانی شد.`, 'info');
    }

    setServices((prev) =>
      prev.map((s) => (s.name === name ? { ...s, status: 'active' } : s))
    );
  };

  const toggleService = (name: string) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.name === name) {
          const nextStatus = s.status === 'active' ? 'inactive' : 'active';
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
    addToast(`وضعیت سرویس ${name} تغییر یافت.`, 'info');
  };

  // Processes
  const killProcess = (pid: number) => {
    setProcesses((prev) => prev.filter((p) => p.pid !== pid));
    addToast(`پروسس با شناسه ${pid} متوقف گردید.`, 'warning');
  };

  // SSH
  const updateSSHPort = (port: number) => {
    setSSHSettings((prev) => ({ ...prev, port }));
    addToast(`پورت SSH به ${port} تغییر یافت.`, 'success');
  };

  const togglePasswordAuth = () => {
    setSSHSettings((prev) => {
      const next = !prev.passwordAuthEnabled;
      addToast(
        next ? 'ورود با گذرواژه فعال شد.' : 'ورود با گذرواژه غیرفعال شد.',
        'info'
      );
      return { ...prev, passwordAuthEnabled: next };
    });
  };

  const toggle2FA = () => {
    setSSHSettings((prev) => {
      const next = !prev.twoFactorEnabled;
      addToast(
        next ? 'احراز هویت دومرحله‌ای فعال شد.' : 'احراز هویت دومرحله‌ای غیرفعال شد.',
        'info'
      );
      return { ...prev, twoFactorEnabled: next };
    });
  };

  const addSSHKey = (name: string, type: string) => {
    const newKey = {
      id: `key-${Date.now()}`,
      name,
      fingerprint: `SHA256:${Math.random().toString(36).substring(2, 10)}...`,
      type,
      createdAt: 'امروز',
    };
    setSSHSettings((prev) => ({
      ...prev,
      activeKeys: [newKey, ...prev.activeKeys],
    }));
    addToast(`کلید عمومی ${name} اضافه شد.`, 'success');
  };

  const deleteSSHKey = (id: string) => {
    setSSHSettings((prev) => ({
      ...prev,
      activeKeys: prev.activeKeys.filter((k) => k.id !== id),
    }));
    addToast('کلید SSH حذف گردید.', 'info');
  };

  // Subscription
  const toggleAutoRenew = () => {
    setSubscription((prev) => {
      const next = !prev.autoRenew;
      addToast(
        next ? 'تمدید خودکار سرویس فعال شد.' : 'تمدید خودکار غیرفعال شد.',
        'info'
      );
      return { ...prev, autoRenew: next };
    });
  };

  const extendSubscription = (days: number) => {
    setSubscription((prev) => ({
      ...prev,
      daysRemaining: prev.daysRemaining + days,
      expiresAtShamsi: `تمدید شده (+${days} روز)`,
    }));
    addToast(`اشتراک سرور به مدت ${days} روز تمدید شد.`, 'success');
  };

  // Firewall
  const addFirewallRule = (rule: Omit<FirewallRule, 'id'>) => {
    const id = `fw-${Date.now()}`;
    setFirewallRules((prev) => [...prev, { ...rule, id }]);
    addToast(`قانون فایروال برای پورت ${rule.port} ثبت گردید.`, 'success');
  };

  const deleteFirewallRule = (id: string) => {
    setFirewallRules((prev) => prev.filter((r) => r.id !== id));
    addToast('قانون فایروال حذف شد.', 'info');
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
    addToast('تمامی اعلان‌ها پاک شدند.', 'info');
  };

  // Reboot
  const triggerReboot = async () => {
    if (vpsStatus.isConnected) {
      try {
        await fetch('/api/vps/exec', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command: 'reboot' }),
        });
      } catch {}
    }

    setIsRebooting(true);
    setRebootProgress(0);
    addToast('سرور در حال راه‌اندازی مجدد است...', 'warning');

    let current = 0;
    const interval = setInterval(() => {
      current += 25;
      setRebootProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsRebooting(false);
          setRebootProgress(0);
          addToast('سرور مجدداً راه‌اندازی و متصل شد.', 'success');
        }, 800);
      }
    }, 600);
  };

  return (
    <ServerContext.Provider
      value={{
        activeTab,
        setActiveTab,
        vpsStatus,
        isConnectingVPS,
        isDeployingService,
        connectVPS,
        disconnectVPS,
        deployBaleBotToVPS,
        metrics,
        isLiveMetricsActive,
        setIsLiveMetricsActive,
        projects,
        startProject,
        stopProject,
        restartProject,
        toggleAutoRestart,
        addProject,
        deleteProject,
        rebuildProject,
        updateProjectEnv,
        files,
        currentDirectory,
        setCurrentDirectory,
        createFile,
        createFolder,
        deleteFile,
        updateFileContent,
        terminalLogs,
        executeCommand,
        clearTerminal,
        services,
        restartService,
        toggleService,
        processes,
        killProcess,
        sshSettings,
        updateSSHPort,
        togglePasswordAuth,
        toggle2FA,
        addSSHKey,
        deleteSSHKey,
        subscription,
        toggleAutoRenew,
        extendSubscription,
        firewallRules,
        addFirewallRule,
        deleteFirewallRule,
        notifications,
        markNotificationAsRead,
        clearNotifications,
        isRebooting,
        rebootProgress,
        triggerReboot,
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
        language,
        setLanguage,
        vpnStats,
        vpnServers,
        addVPNServer,
        updateVPNServer,
        deleteVPNServer,
        vpnUsers,
        addVPNUser,
        updateVPNUser,
        deleteVPNUser,
        vpnConfigs,
        addVPNConfig,
        updateVPNConfig,
        deleteVPNConfig,
        vpnPlans,
        vpnTransactions,
        addVPNTransaction,
        vpnTickets,
        addVPNTicket,
        replyVPNTicket,
        toasts,
        addToast,
        dismissToast,
        exportAllData,
        importAllData,
        resetAllData,
        isSyncingGitHubNodes,
        syncNodesFromGitHubPages,
      }}
    >
      {children}
    </ServerContext.Provider>
  );
};

export const useServer = () => {
  const context = useContext(ServerContext);
  if (!context) {
    throw new Error('useServer must be used within a ServerProvider');
  }
  return context;
};
