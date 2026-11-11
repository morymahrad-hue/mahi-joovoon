import { VPNConfig, VPNProtocol, VPNServerNode, VPNTransport, VPNTLS, VPNFlow } from '../types';

/**
 * Generate standard UUID v4
 */
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generate secure random password for Trojan / Shadowsocks
 */
export function generatePassword(length = 16): string {
  const chars = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate Reality Short ID
 */
export function generateShortId(): string {
  return Math.random().toString(16).substring(2, 10);
}

/**
 * Generate a VLESS URI link
 * vless://uuid@host:port?type=ws&security=tls&path=%2Fws&sni=example.com#Remark
 */
export function buildVlessLink(params: {
  uuid: string;
  host: string;
  port: number;
  transport: VPNTransport;
  tls: VPNTLS;
  sni: string;
  wsPath: string;
  grpcService: string;
  flow?: VPNFlow;
  publicKey?: string;
  shortId?: string;
  remark: string;
}): string {
  const urlParams = new URLSearchParams();
  urlParams.set('type', params.transport === 'ws' ? 'ws' : params.transport === 'grpc' ? 'grpc' : 'tcp');
  urlParams.set('encryption', 'none');

  if (params.tls === 'tls') {
    urlParams.set('security', 'tls');
    urlParams.set('sni', params.sni);
    urlParams.set('fp', 'chrome');
    urlParams.set('alpn', 'h2,http/1.1');
    if (params.flow && params.flow !== 'none') {
      urlParams.set('flow', params.flow);
    }
  } else if (params.tls === 'reality') {
    urlParams.set('security', 'reality');
    urlParams.set('sni', params.sni);
    if (params.publicKey) urlParams.set('pbk', params.publicKey);
    if (params.shortId) urlParams.set('sid', params.shortId);
    if (params.flow && params.flow !== 'none') {
      urlParams.set('flow', params.flow);
    }
    urlParams.set('fp', 'chrome');
  } else {
    urlParams.set('security', 'none');
  }

  if (params.transport === 'ws') {
    urlParams.set('path', params.wsPath || '/');
    urlParams.set('host', params.sni);
  } else if (params.transport === 'grpc') {
    urlParams.set('serviceName', params.grpcService || 'gun');
    urlParams.set('mode', 'gun');
  }

  const encodedRemark = encodeURIComponent(params.remark);
  return `vless://${params.uuid}@${params.host}:${params.port}?${urlParams.toString()}#${encodedRemark}`;
}

/**
 * Generate a VMess URI link (base64 JSON)
 */
export function buildVmessLink(params: {
  uuid: string;
  host: string;
  port: number;
  transport: VPNTransport;
  tls: VPNTLS;
  sni: string;
  wsPath: string;
  grpcService: string;
  remark: string;
}): string {
  const vmessObj = {
    v: '2',
    ps: params.remark,
    add: params.host,
    port: String(params.port),
    id: params.uuid,
    aid: '0',
    scy: 'auto',
    net: params.transport === 'grpc' ? 'grpc' : params.transport === 'ws' ? 'ws' : 'tcp',
    type: 'none',
    host: params.sni,
    path: params.transport === 'ws' ? params.wsPath : params.grpcService,
    tls: params.tls !== 'none' ? 'tls' : '',
    sni: params.sni,
    alpn: '',
  };

  const jsonStr = JSON.stringify(vmessObj);
  const base64Str = typeof btoa !== 'undefined'
    ? btoa(unescape(encodeURIComponent(jsonStr)))
    : Buffer.from(jsonStr).toString('base64');

  return `vmess://${base64Str}`;
}

/**
 * Generate a Trojan URI link
 * trojan://password@host:port?security=tls&sni=example.com&type=ws&path=%2F#Remark
 */
export function buildTrojanLink(params: {
  password: string;
  host: string;
  port: number;
  transport: VPNTransport;
  tls: VPNTLS;
  sni: string;
  wsPath: string;
  grpcService: string;
  remark: string;
}): string {
  const urlParams = new URLSearchParams();
  urlParams.set('security', params.tls !== 'none' ? 'tls' : 'none');
  urlParams.set('sni', params.sni);
  urlParams.set('fp', 'chrome');
  urlParams.set('alpn', 'h2,http/1.1');
  urlParams.set('type', params.transport === 'ws' ? 'ws' : params.transport === 'grpc' ? 'grpc' : 'tcp');

  if (params.transport === 'ws') {
    urlParams.set('path', params.wsPath || '/');
    urlParams.set('host', params.sni);
  } else if (params.transport === 'grpc') {
    urlParams.set('serviceName', params.grpcService || 'gun');
  }

  const encodedRemark = encodeURIComponent(params.remark);
  return `trojan://${params.password}@${params.host}:${params.port}?${urlParams.toString()}#${encodedRemark}`;
}

/**
 * Generate Shadowsocks URI link
 * ss://base64(method:password)@host:port#Remark
 */
export function buildShadowsocksLink(params: {
  password: string;
  host: string;
  port: number;
  method?: string;
  remark: string;
}): string {
  const method = params.method || 'aes-256-gcm';
  const creds = `${method}:${params.password}`;
  const base64Creds = typeof btoa !== 'undefined'
    ? btoa(unescape(encodeURIComponent(creds)))
    : Buffer.from(creds).toString('base64');

  const encodedRemark = encodeURIComponent(params.remark);
  return `ss://${base64Creds}@${params.host}:${params.port}#${encodedRemark}`;
}

/**
 * Generate Clash Meta / Mihomo compatible YAML fragment for a proxy config
 */
export function generateClashYaml(config: VPNConfig): string {
  if (config.protocol === 'vless') {
    return `- name: "${config.name}"
  type: vless
  server: ${config.serverId}
  port: ${config.port}
  uuid: ${config.uuid}
  network: ${config.transport}
  tls: ${config.tls !== 'none'}
  udp: true
  sni: ${config.sni}
  client-fingerprint: chrome
  ${config.flow && config.flow !== 'none' ? `flow: ${config.flow}` : ''}
  ${config.transport === 'ws' ? `ws-opts:
    path: ${config.wsPath}
    headers:
      Host: ${config.sni}` : ''}
  ${config.transport === 'grpc' ? `grpc-opts:
    grpc-service-name: ${config.grpcService}` : ''}
  ${config.tls === 'reality' ? `reality-opts:
    public-key: ${config.publicKey || ''}
    short-id: ${config.shortId || ''}` : ''}`;
  }

  if (config.protocol === 'vmess') {
    return `- name: "${config.name}"
  type: vmess
  server: ${config.serverId}
  port: ${config.port}
  uuid: ${config.uuid}
  alterId: 0
  cipher: auto
  udp: true
  tls: ${config.tls !== 'none'}
  sni: ${config.sni}
  network: ${config.transport}
  ${config.transport === 'ws' ? `ws-opts:
    path: ${config.wsPath}
    headers:
      Host: ${config.sni}` : ''}`;
  }

  if (config.protocol === 'trojan') {
    return `- name: "${config.name}"
  type: trojan
  server: ${config.serverId}
  port: ${config.port}
  password: ${config.password || ''}
  udp: true
  sni: ${config.sni}
  network: ${config.transport}
  ${config.transport === 'ws' ? `ws-opts:
    path: ${config.wsPath}
    headers:
      Host: ${config.sni}` : ''}`;
  }

  return `- name: "${config.name}"
  type: ss
  server: ${config.serverId}
  port: ${config.port}
  cipher: aes-256-gcm
  password: ${config.password || ''}
  udp: true`;
}

/**
 * Generate Sing-box outbound JSON object
 */
export function generateSingboxJson(config: VPNConfig): string {
  const outbound: Record<string, any> = {
    tag: config.name,
    type: config.protocol,
    server: config.serverId,
    server_port: config.port,
  };

  if (config.protocol === 'vless' || config.protocol === 'vmess') {
    outbound.uuid = config.uuid;
  }
  if (config.protocol === 'trojan' || config.protocol === 'shadowsocks') {
    outbound.password = config.password;
    if (config.protocol === 'shadowsocks') {
      outbound.method = 'aes-256-gcm';
    }
  }

  if (config.tls !== 'none') {
    outbound.tls = {
      enabled: true,
      server_name: config.sni,
      insecure: false,
      utls: {
        enabled: true,
        fingerprint: config.fingerprint || 'chrome',
      },
      alpn: ['h2', 'http/1.1'],
    };
    if (config.tls === 'reality') {
      outbound.tls.reality = {
        enabled: true,
        public_key: config.publicKey || '',
        short_id: config.shortId || '',
      };
    }
  }

  if (config.transport === 'ws') {
    outbound.transport = {
      type: 'ws',
      path: config.wsPath,
      headers: {
        Host: config.sni,
      },
    };
  } else if (config.transport === 'grpc') {
    outbound.transport = {
      type: 'grpc',
      service_name: config.grpcService,
    };
  }

  // Fragment & Multiplexing in Sing-box
  if (config.mux?.enabled) {
    outbound.multiplex = {
      enabled: true,
      protocol: 'h2mux',
      max_connections: config.mux.concurrency || 8,
      min_streams: 4,
    };
  }

  return JSON.stringify(outbound, null, 2);
}

/**
 * Generate Xray core inbound / outbound json with Fragment & Mux support
 */
export function generateXrayJson(config: VPNConfig): string {
  const xrayOutbound: Record<string, any> = {
    protocol: config.protocol,
    settings: {
      vnext: config.protocol === 'vless' || config.protocol === 'vmess' ? [
        {
          address: config.serverId,
          port: config.port,
          users: [
            {
              id: config.uuid,
              encryption: 'none',
              flow: config.flow || undefined,
            },
          ],
        },
      ] : undefined,
      servers: config.protocol === 'trojan' ? [
        {
          address: config.serverId,
          port: config.port,
          password: config.password,
        },
      ] : undefined,
    },
    streamSettings: {
      network: config.transport,
      security: config.tls === 'reality' ? 'reality' : config.tls === 'tls' ? 'tls' : 'none',
      realitySettings: config.tls === 'reality' ? {
        serverName: config.sni,
        fingerprint: config.fingerprint || 'chrome',
        publicKey: config.publicKey || '',
        shortId: config.shortId || '',
      } : undefined,
      tlsSettings: config.tls === 'tls' ? {
        serverName: config.sni,
        allowInsecure: false,
        fingerprint: config.fingerprint || 'chrome',
        alpn: ['h2', 'http/1.1'],
      } : undefined,
      wsSettings: config.transport === 'ws' ? {
        path: config.wsPath,
        headers: {
          Host: config.sni,
        },
      } : undefined,
      grpcSettings: config.transport === 'grpc' ? {
        serviceName: config.grpcService,
      } : undefined,
      sockopt: {
        tcpKeepAliveInterval: 15,
        ...(config.fragment?.enabled ? {
          fragment: {
            packets: config.fragment.packets || 'tlshello',
            length: config.fragment.length || '100-200',
            interval: config.fragment.interval || '10-20',
          },
        } : {}),
      },
    },
    mux: {
      enabled: config.mux?.enabled ?? false,
      concurrency: config.mux?.concurrency ?? 8,
    },
  };

  return JSON.stringify(xrayOutbound, null, 2);
}

/**
 * Main helper to construct complete VPNConfig with all formats
 */
export function buildFullConfig(
  server: VPNServerNode,
  protocol: VPNProtocol,
  options: {
    name: string;
    username: string;
    userId?: string;
    transport?: VPNTransport;
    tls?: VPNTLS;
    flow?: VPNFlow;
    dataLimitGB?: number;
    durationDays?: number;
    maxDevices?: number;
    customUuid?: string;
    customPassword?: string;
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
  }
): VPNConfig {
  const uuid = options.customUuid || generateUUID();
  const password = options.customPassword || generatePassword(16);
  const transport = options.transport || 'ws';
  const tls = options.tls || 'tls';
  const flow = options.flow || (tls === 'reality' ? 'xtls-rprx-vision' : 'none');
  const fingerprint = options.fingerprint || 'chrome';
  const alpn = options.alpn || 'h2,http/1.1';

  let port = server.vlessPort;
  if (protocol === 'vmess') port = server.vmessPort;
  if (protocol === 'trojan') port = server.trojanPort;
  if (protocol === 'shadowsocks') port = server.ssPort;

  const remark = `MAHI-JOOVOON | ${server.countryCode.toUpperCase()} - ${options.name}`;

  let rawLink = '';
  if (protocol === 'vless') {
    rawLink = buildVlessLink({
      uuid,
      host: server.host,
      port,
      transport,
      tls,
      sni: server.sni,
      wsPath: server.wsPath,
      grpcService: server.grpcServiceName,
      flow,
      publicKey: server.publicKey,
      shortId: server.shortId || generateShortId(),
      remark,
    });
  } else if (protocol === 'vmess') {
    rawLink = buildVmessLink({
      uuid,
      host: server.host,
      port,
      transport,
      tls,
      sni: server.sni,
      wsPath: server.wsPath,
      grpcService: server.grpcServiceName,
      remark,
    });
  } else if (protocol === 'trojan') {
    rawLink = buildTrojanLink({
      password,
      host: server.host,
      port,
      transport,
      tls,
      sni: server.sni,
      wsPath: server.wsPath,
      grpcService: server.grpcServiceName,
      remark,
    });
  } else {
    rawLink = buildShadowsocksLink({
      password,
      host: server.host,
      port,
      remark,
    });
  }

  const durationDays = options.durationDays || 30;
  const expires = new Date();
  expires.setDate(expires.getDate() + durationDays);

  const configObj: VPNConfig = {
    id: `cfg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: options.name,
    userId: options.userId,
    username: options.username,
    serverId: server.id,
    serverName: `${server.flag} ${server.name}`,
    protocol,
    port,
    uuid,
    password,
    transport,
    tls,
    sni: server.sni,
    wsPath: server.wsPath,
    grpcService: server.grpcServiceName,
    flow,
    publicKey: server.publicKey,
    shortId: server.shortId,
    dataLimitGB: options.dataLimitGB || 50,
    dataUsedGB: 0,
    expiresAt: expires.toISOString(),
    maxDevices: options.maxDevices || 2,
    status: 'active',
    createdAt: new Date().toISOString(),
    rawLink,
    fingerprint,
    alpn,
    fragment: options.fragment,
    mux: options.mux,
    noise: options.noise,
  };

  configObj.clashYaml = generateClashYaml(configObj);
  configObj.singboxJson = generateSingboxJson(configObj);
  configObj.xrayJson = generateXrayJson(configObj);

  return configObj;
}

/**
 * Parse an individual VPN URI (VLESS, Trojan, VMess, Shadowsocks)
 * into a typed VPNConfig and VPNServerNode pair.
 */
export function parseVpnUri(
  rawUri: string,
  index = 0
): { config: VPNConfig; server: VPNServerNode } | null {
  const uri = rawUri.trim();
  if (!uri || uri.startsWith('#') || uri.startsWith('//')) return null;

  try {
    let protocol: VPNProtocol = 'vless';
    let host = '';
    let port = 443;
    let uuid = '';
    let password = '';
    let remark = `Node-${index + 1}`;
    let transport: VPNTransport = 'ws';
    let tls: VPNTLS = 'tls';
    let sni = 'speedtest.net';
    let wsPath = '/';
    let grpcService = 'mahi-grpc';
    let flow: VPNFlow = 'none';
    let fingerprint = 'chrome';
    let alpn = 'h2,http/1.1';
    let publicKey = '';
    let shortId = '';

    if (uri.startsWith('vless://') || uri.startsWith('trojan://')) {
      protocol = uri.startsWith('vless://') ? 'vless' : 'trojan';
      const cleanUri = uri.replace(/^(vless|trojan):\/\//, '');

      // Separate hash fragment (remark)
      const hashSplit = cleanUri.split('#');
      if (hashSplit.length > 1) {
        try {
          remark = decodeURIComponent(hashSplit.slice(1).join('#')).trim();
        } catch {
          remark = hashSplit.slice(1).join('#').trim();
        }
      }

      // Separate query params
      const querySplit = hashSplit[0].split('?');
      const credsAndHost = querySplit[0];
      const queryString = querySplit[1] || '';

      const atSplit = credsAndHost.split('@');
      if (atSplit.length === 2) {
        if (protocol === 'vless') {
          uuid = atSplit[0];
        } else {
          password = atSplit[0];
        }
        const hostPort = atSplit[1].split(':');
        host = hostPort[0];
        port = hostPort[1] ? parseInt(hostPort[1], 10) : 443;
      } else {
        host = credsAndHost;
      }

      const params = new URLSearchParams(queryString);
      if (params.get('type') === 'grpc') transport = 'grpc';
      else if (params.get('type') === 'tcp') transport = 'tcp';
      else transport = 'ws';

      const sec = params.get('security');
      if (sec === 'reality') tls = 'reality';
      else if (sec === 'none') tls = 'none';
      else tls = 'tls';

      sni = params.get('sni') || params.get('host') || host;
      wsPath = params.get('path') ? decodeURIComponent(params.get('path')!) : '/';
      grpcService = params.get('serviceName') || 'mahi-grpc';
      flow = (params.get('flow') as VPNFlow) || 'none';
      fingerprint = params.get('fp') || 'chrome';
      alpn = params.get('alpn') ? decodeURIComponent(params.get('alpn')!) : 'h2,http/1.1';
      publicKey = params.get('pbk') || '';
      shortId = params.get('sid') || '';
    } else if (uri.startsWith('vmess://')) {
      protocol = 'vmess';
      const b64 = uri.replace('vmess://', '').trim();
      const decoded = typeof atob !== 'undefined'
        ? atob(b64)
        : Buffer.from(b64, 'base64').toString('utf-8');
      const vobj = JSON.parse(decoded);
      host = vobj.add;
      port = parseInt(vobj.port || '443', 10);
      uuid = vobj.id;
      remark = vobj.ps || `VMess-${host}`;
      transport = vobj.net === 'grpc' ? 'grpc' : vobj.net === 'tcp' ? 'tcp' : 'ws';
      tls = vobj.tls === 'tls' ? 'tls' : 'none';
      sni = vobj.sni || vobj.host || host;
      wsPath = vobj.path || '/';
      fingerprint = 'chrome';
    } else if (uri.startsWith('ss://')) {
      protocol = 'shadowsocks';
      const cleanUri = uri.replace('ss://', '');
      const hashSplit = cleanUri.split('#');
      if (hashSplit.length > 1) {
        try {
          remark = decodeURIComponent(hashSplit.slice(1).join('#')).trim();
        } catch {
          remark = hashSplit.slice(1).join('#').trim();
        }
      }
      const atSplit = hashSplit[0].split('@');
      if (atSplit.length === 2) {
        const hostPort = atSplit[1].split(':');
        host = hostPort[0];
        port = hostPort[1] ? parseInt(hostPort[1], 10) : 8388;
        password = atSplit[0];
      }
    } else {
      return null;
    }

    // Determine Country & Flag from remark or host
    let country = 'شبکه جهانی Anycast';
    let countryCode = 'eu';
    let flag = '⚡';
    let pingMs = 32;

    const lowerRemark = remark.toLowerCase();
    if (lowerRemark.includes('de') || lowerRemark.includes('frankfurt') || remark.includes('🇩🇪') || remark.includes('آلمان')) {
      country = 'آلمان';
      countryCode = 'de';
      flag = '🇩🇪';
      pingMs = 29;
    } else if (lowerRemark.includes('nl') || lowerRemark.includes('amsterdam') || remark.includes('🇳🇱') || remark.includes('هلند')) {
      country = 'هلند';
      countryCode = 'nl';
      flag = '🇳🇱';
      pingMs = 34;
    } else if (lowerRemark.includes('fi') || lowerRemark.includes('helsinki') || remark.includes('🇫🇮') || remark.includes('فنلاند')) {
      country = 'فنلاند';
      countryCode = 'fi';
      flag = '🇫🇮';
      pingMs = 38;
    } else if (lowerRemark.includes('tr') || lowerRemark.includes('istanbul') || remark.includes('🇹🇷') || remark.includes('ترکیه')) {
      country = 'ترکیه';
      countryCode = 'tr';
      flag = '🇹🇷';
      pingMs = 22;
    } else if (lowerRemark.includes('us') || lowerRemark.includes('newyork') || remark.includes('🇺🇸') || remark.includes('آمریکا')) {
      country = 'آمریکا';
      countryCode = 'us';
      flag = '🇺🇸';
      pingMs = 108;
    } else if (lowerRemark.includes('trojan') || lowerRemark.includes('vip') || remark.includes('👑')) {
      country = 'سرور اختصاصی VIP';
      countryCode = 'eu';
      flag = '👑';
      pingMs = 31;
    }

    const serverId = `srv-node-${countryCode}-${index + 1}`;
    const serverName = `${flag} ${remark.replace(/^[^\w\s\u0600-\u06FF]+/, '').trim() || `${country} Edge`}`;

    const server: VPNServerNode = {
      id: serverId,
      name: serverName,
      country,
      countryCode,
      flag,
      host,
      ip: host,
      vlessPort: protocol === 'vless' ? port : 443,
      vmessPort: 2053,
      trojanPort: protocol === 'trojan' ? port : 8443,
      ssPort: 8388,
      status: 'online',
      pingMs,
      cpuPercent: 18 + (index % 4) * 5,
      ramPercent: 32 + (index % 5) * 6,
      diskPercent: 22 + (index % 3) * 4,
      bandwidthUsedGB: 750 + index * 420,
      bandwidthTotalGB: 25000,
      maxUsers: 1000,
      activeUsers: 240 + index * 55,
      sni,
      publicKey: publicKey || 'a9K1k9qB7u8X3x5v2Y7t0W1e8R9m6P4l2Q8j5H3n1G',
      shortId: shortId || '8f7a1c3e',
      wsPath,
      grpcServiceName: grpcService,
      isDefault: index === 0,
    };

    const expires = new Date();
    expires.setDate(expires.getDate() + 90);

    const config: VPNConfig = {
      id: `cfg-ghp-${index + 1}`,
      name: remark,
      userId: 'usr-101',
      username: 'ali_rezaei',
      serverId,
      serverName,
      protocol,
      port,
      uuid,
      password,
      transport,
      tls,
      sni,
      wsPath,
      grpcService,
      flow,
      publicKey,
      shortId,
      dataLimitGB: 100,
      dataUsedGB: +(10.5 + index * 4.3).toFixed(1),
      expiresAt: expires.toISOString(),
      maxDevices: 3,
      status: 'active',
      createdAt: new Date().toISOString(),
      rawLink: uri,
      fingerprint,
      alpn,
    };

    config.clashYaml = generateClashYaml(config);
    config.singboxJson = generateSingboxJson(config);
    config.xrayJson = generateXrayJson(config);

    return { config, server };
  } catch (err) {
    console.warn(`Error parsing URI: ${uri}`, err);
    return null;
  }
}

/**
 * Parse an entire multiline nodes.txt file content into configs and servers
 */
export function parseNodesTxt(content: string): { configs: VPNConfig[]; servers: VPNServerNode[] } {
  const lines = content.split(/\r?\n/).map((l) => l.trim()).filter((l) => Boolean(l) && !l.startsWith('#'));
  const configs: VPNConfig[] = [];
  const servers: VPNServerNode[] = [];
  const seenServerHosts = new Set<string>();

  lines.forEach((line, idx) => {
    const parsed = parseVpnUri(line, idx);
    if (parsed) {
      configs.push(parsed.config);
      // Deduplicate servers by host/IP or unique name
      const serverKey = `${parsed.server.host}-${parsed.server.countryCode}`;
      if (!seenServerHosts.has(serverKey)) {
        seenServerHosts.add(serverKey);
        servers.push(parsed.server);
      }
    }
  });

  return { configs, servers };
}
