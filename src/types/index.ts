// Common navigation tabs across the platform
export type PageTab =
  | 'dashboard'
  | 'vpn-configs'
  | 'vpn-generator'
  | 'vpn-users'
  | 'vpn-subscriptions'
  | 'vpn-servers'
  | 'vpn-payments'
  | 'vpn-support'
  | 'vpn-analytics'
  | 'terminal'
  | 'files'
  | 'projects'
  | 'bale-bot'
  | 'status'
  | 'settings';

export type Language = 'fa' | 'en';

// --- MAHI JOOVOON VPN TYPES ---

export type VPNProtocol = 'vless' | 'vmess' | 'trojan' | 'shadowsocks';
export type VPNTransport = 'ws' | 'grpc' | 'tcp';
export type VPNTLS = 'none' | 'tls' | 'reality';
export type VPNFlow = 'none' | 'xtls-rprx-vision';

export interface VPNServerNode {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  flag: string;
  host: string;
  ip: string;
  vlessPort: number;
  vmessPort: number;
  trojanPort: number;
  ssPort: number;
  status: 'online' | 'offline' | 'maintenance';
  pingMs: number;
  cpuPercent: number;
  ramPercent: number;
  diskPercent: number;
  bandwidthUsedGB: number;
  bandwidthTotalGB: number;
  maxUsers: number;
  activeUsers: number;
  sni: string;
  publicKey?: string;
  shortId?: string;
  wsPath: string;
  grpcServiceName: string;
  isDefault?: boolean;
}

export interface VPNConfig {
  id: string;
  name: string;
  userId?: string;
  username: string;
  serverId: string;
  serverName: string;
  protocol: VPNProtocol;
  port: number;
  uuid: string; // for vless / vmess
  password?: string; // for trojan / shadowsocks
  transport: VPNTransport;
  tls: VPNTLS;
  sni: string;
  wsPath: string;
  grpcService: string;
  flow?: VPNFlow;
  publicKey?: string;
  shortId?: string;
  dataLimitGB: number;
  dataUsedGB: number;
  expiresAt: string;
  maxDevices: number;
  status: 'active' | 'expired' | 'disabled' | 'limited';
  createdAt: string;
  rawLink: string;
  fingerprint?: string;
  alpn?: string;
  fragment?: {
    enabled: boolean;
    packets: string;
    length: string;
    interval: string;
  };
  mux?: {
    enabled: boolean;
    concurrency: number;
  };
  noise?: {
    enabled: boolean;
    packets: string;
    delay: string;
  };
  clashYaml?: string;
  singboxJson?: string;
  xrayJson?: string;
}

export interface VPNUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  status: 'active' | 'expired' | 'blocked' | 'trial';
  registeredAt: string;
  expiresAt: string;
  dataLimitGB: number;
  dataUsedGB: number;
  maxDevices: number;
  connectedDevices: number;
  subscriptionToken: string;
  subscriptionUrl: string;
  assignedServerIds: string[];
  configCount: number;
  notes?: string;
  totalSpentToman: number;
}

export interface VPNSubscriptionPlan {
  id: string;
  name: string;
  persianName: string;
  durationDays: number;
  trafficGB: number;
  priceToman: number;
  discountPriceToman?: number;
  maxDevices: number;
  popular?: boolean;
  features: string[];
  protocols: VPNProtocol[];
}

export interface VPNTransaction {
  id: string;
  userId: string;
  username: string;
  planId: string;
  planName: string;
  amountToman: number;
  discountCode?: string;
  discountAmountToman?: number;
  finalAmountToman: number;
  gateway: 'zarinpal' | 'idpay' | 'card_to_card' | 'crypto' | 'bale_pay';
  status: 'paid' | 'pending' | 'failed';
  trackingCode: string;
  createdAt: string;
  paidAt?: string;
}

export interface VPNSupportTicket {
  id: string;
  userId: string;
  username: string;
  subject: string;
  category: 'connection' | 'payment' | 'speed' | 'setup' | 'other';
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'answered' | 'closed';
  createdAt: string;
  updatedAt: string;
  messages: Array<{
    id: string;
    sender: 'user' | 'admin';
    senderName: string;
    message: string;
    imageUrl?: string;
    timestamp: string;
  }>;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  expiredUsers: number;
  totalConfigs: number;
  activeServers: number;
  totalBandwidthGB: number;
  usedBandwidthGB: number;
  totalRevenueToman: number;
  todayRevenueToman: number;
  weeklyRevenueToman: number;
  monthlyRevenueToman: number;
  expiringUsersCount: number;
  lowTrafficUsersCount: number;
}

// --- VPS & SYSTEM TYPES ---

export interface BaleGeminiConfig {
  enabled: boolean;
  model: string;
  systemInstruction: string;
  temperature: number;
  autoReplyToUsers: boolean;
  lastAiResponse?: string;
  totalTokensUsed: number;
}

export interface BaleBotConfig {
  botName: string;
  botUsername: string;
  botToken: string;
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  mode: 'polling' | 'webhook';
  webhookUrl: string;
  webhookPort: number;
  runtime: 'python' | 'nodejs';
  framework: 'balethon' | 'python-bale-bot' | 'bale-bot-nodejs';
  pid: number | null;
  autoRestart: boolean;
  messagesReceived: number;
  messagesSent: number;
  lastPingMs: number;
  sslEnabled: boolean;
  bankingEnabled: boolean;
  templateType: 'customer-service' | 'ecommerce' | 'form-survey' | 'custom';
  gemini: BaleGeminiConfig;
  logs: string[];
}

export type ProjectFramework = 'FastAPI' | 'Flask' | 'Django' | 'Express' | 'Next.js' | 'NestJS';
export type ProjectRuntime = 'python' | 'nodejs';
export type ProjectStatus = 'running' | 'stopped' | 'restarting' | 'error';

export interface Project {
  id: string;
  name: string;
  persianTitle: string;
  runtime: ProjectRuntime;
  framework: ProjectFramework;
  status: ProjectStatus;
  port: number;
  pid: number | null;
  cpu: number;
  memory: number;
  autoRestart: boolean;
  gitBranch: string;
  gitCommit: string;
  lastDeployed: string;
  rootPath: string;
  startCommand: string;
  envVars: Record<string, string>;
  logs: string[];
}

export interface ServerMetrics {
  cpuUsage: number;
  cpuCores: number[];
  ramUsedGB: number;
  ramTotalGB: number;
  ramCachedGB: number;
  swapUsedGB: number;
  swapTotalGB: number;
  diskUsedGB: number;
  diskTotalGB: number;
  diskReadMBs: number;
  diskWriteMBs: number;
  netInKbps: number;
  netOutKbps: number;
  uptimeSeconds: number;
  loadAverage: [number, number, number];
  temperatureC: number;
}

export interface FileItem {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  size: string;
  permissions: string;
  owner: string;
  group: string;
  modified: string;
  extension?: string;
  content?: string;
}

export interface TerminalLog {
  id: string;
  command: string;
  output: string;
  timestamp: string;
  isError?: boolean;
}

export interface SystemService {
  name: string;
  displayName: string;
  description: string;
  status: 'active' | 'inactive' | 'failed';
  port?: number;
  memoryMB: number;
  enabled: boolean;
}

export interface ProcessItem {
  pid: number;
  user: string;
  cpu: number;
  mem: number;
  command: string;
  uptime: string;
}

export interface SSHSettings {
  host: string;
  port: number;
  username: string;
  authMethod: 'key' | 'password' | 'both';
  passwordAuthEnabled: boolean;
  twoFactorEnabled: boolean;
  activeKeys: Array<{
    id: string;
    name: string;
    fingerprint: string;
    type: string;
    createdAt: string;
  }>;
  lastLoginIp: string;
  lastLoginTime: string;
}

export interface ServerSubscription {
  planName: string;
  datacenter: string;
  datacenterCity: string;
  datacenterFlag: string;
  ipAddress: string;
  ipv6Address: string;
  os: string;
  kernel: string;
  expiresAtShamsi: string;
  expiresAtGregorian: string;
  daysRemaining: number;
  autoRenew: boolean;
  bandwidthUsedGB: number;
  bandwidthTotalGB: number;
  costMonthlyToman: number;
}

export interface FirewallRule {
  id: string;
  port: string;
  protocol: 'tcp' | 'udp' | 'both';
  action: 'ALLOW' | 'DENY';
  from: string;
  comment: string;
}

export interface RealVPSState {
  isConnected: boolean;
  host: string | null;
  port: number;
  username: string | null;
  osInfo: string | null;
  uptime: string | null;
  lastConnectedAt: string | null;
  lastError: string | null;
}

export interface ConnectVPSParams {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  privateKey?: string;
  useDefaultCloud?: boolean;
}

export interface DeployResult {
  success: boolean;
  message: string;
  output?: string;
  unitPath?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'warning' | 'success' | 'danger';
  read: boolean;
}
