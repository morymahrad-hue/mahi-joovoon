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
    };
    if (config.tls === 'reality') {
      outbound.tls.reality = {
        enabled: true,
        public_key: config.publicKey || '',
        short_id: config.shortId || '',
      };
      outbound.tls.utls = {
        enabled: true,
        fingerprint: 'chrome',
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

  return JSON.stringify(outbound, null, 2);
}

/**
 * Generate Xray core inbound / outbound json
 */
export function generateXrayJson(config: VPNConfig): string {
  const xrayOutbound = {
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
        fingerprint: 'chrome',
        publicKey: config.publicKey || '',
        shortId: config.shortId || '',
      } : undefined,
      tlsSettings: config.tls === 'tls' ? {
        serverName: config.sni,
        allowInsecure: false,
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
  }
): VPNConfig {
  const uuid = options.customUuid || generateUUID();
  const password = options.customPassword || generatePassword(16);
  const transport = options.transport || 'ws';
  const tls = options.tls || 'tls';
  const flow = options.flow || (tls === 'reality' ? 'xtls-rprx-vision' : 'none');

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
  };

  configObj.clashYaml = generateClashYaml(configObj);
  configObj.singboxJson = generateSingboxJson(configObj);
  configObj.xrayJson = generateXrayJson(configObj);

  return configObj;
}
