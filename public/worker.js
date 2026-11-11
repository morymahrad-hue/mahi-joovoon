/**
 * MAHI JOOVOON - Cloudflare Worker VLESS Proxy Engine
 * Serverless Zero-VPS VLESS over WebSocket Implementation
 * Deploy for free at https://dash.cloudflare.com/ (Workers & Pages)
 */

import { connect } from 'cloudflare:sockets';

const userID = 'b74d9e2a-14f0-4662-89c5-7b5680c2f109';
const proxyIP = '';

export default {
  async fetch(request, env, ctx) {
    try {
      const upgradeHeader = request.headers.get('Upgrade');
      if (!upgradeHeader || upgradeHeader !== 'websocket') {
        const url = new URL(request.url);
        switch (url.pathname) {
          case '/sub':
          case '/sub.txt':
            return new Response(
              btoa(
                `vless://${userID}@${url.hostname}:443?encryption=none&security=tls&sni=${url.hostname}&type=ws&host=${url.hostname}&path=%2F#MAHI-JOOVOON-CF-WORKER`
              ),
              {
                headers: {
                  'content-type': 'text/plain; charset=utf-8',
                },
              }
            );
          default:
            return new Response(
              JSON.stringify({
                status: 'online',
                platform: 'MAHI JOOVOON Cloudflare Edge Worker',
                engine: 'VLESS WebSocket Reverse Proxy',
                time: new Date().toISOString(),
              }, null, 2),
              {
                headers: { 'content-type': 'application/json; charset=utf-8' },
              }
            );
        }
      } else {
        return await vlessOverWSHandler(request);
      }
    } catch (err) {
      return new Response(err.toString(), { status: 500 });
    }
  },
};

async function vlessOverWSHandler(request) {
  const webSocketPair = new WebSocketPair();
  const [client, server] = Object.values(webSocketPair);
  server.accept();

  let address = '';
  let portWithHeader = 0;
  let remoteSocket = null;

  server.addEventListener('message', async (event) => {
    try {
      const rawData = event.data;
      if (typeof rawData === 'string') return;
      const buffer = new Uint8Array(rawData);

      if (!remoteSocket) {
        // Parse VLESS header
        if (buffer.byteLength < 24) return;
        const version = buffer[0];
        const clientUUID = Array.from(buffer.slice(1, 17))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');

        const formattedUUID = `${clientUUID.slice(0, 8)}-${clientUUID.slice(8, 12)}-${clientUUID.slice(12, 16)}-${clientUUID.slice(16, 20)}-${clientUUID.slice(20)}`;
        if (formattedUUID.toLowerCase() !== userID.toLowerCase()) {
          server.close(1008, 'Unauthorized UUID');
          return;
        }

        const optLength = buffer[17];
        const command = buffer[18 + optLength];
        if (command !== 1) {
          // Only TCP CONNECT supported
          server.close(1003, 'Unsupported command');
          return;
        }

        const portIndex = 19 + optLength;
        const port = (buffer[portIndex] << 8) | buffer[portIndex + 1];
        const addressType = buffer[portIndex + 2];
        let addressLength = 0;
        let addressValueIndex = portIndex + 3;

        if (addressType === 1) {
          // IPv4
          addressLength = 4;
          address = Array.from(buffer.slice(addressValueIndex, addressValueIndex + addressLength)).join('.');
        } else if (addressType === 2) {
          // Domain
          addressLength = buffer[addressValueIndex];
          addressValueIndex += 1;
          address = new TextDecoder().decode(buffer.slice(addressValueIndex, addressValueIndex + addressLength));
        } else if (addressType === 3) {
          // IPv6
          addressLength = 16;
          const dataView = new DataView(buffer.buffer, addressValueIndex, 16);
          const ipv6 = [];
          for (let i = 0; i < 8; i++) {
            ipv6.push(dataView.getUint16(i * 2).toString(16));
          }
          address = ipv6.join(':');
        }

        const rawClientData = buffer.slice(addressValueIndex + addressLength);
        remoteSocket = connect({
          hostname: proxyIP || address,
          port: port,
        });

        const writer = remoteSocket.writable.getWriter();
        if (rawClientData.byteLength > 0) {
          await writer.write(rawClientData);
        }

        // Send VLESS response header (version 0, addon 0)
        server.send(new Uint8Array([version, 0]));

        // Pipe remote socket to WebSocket
        remoteSocket.readable.pipeTo(
          new WritableStream({
            write(chunk) {
              if (server.readyState === WebSocket.OPEN) {
                server.send(chunk);
              }
            },
            close() {
              server.close();
            },
            abort() {
              server.close();
            },
          })
        ).catch(() => {});
      } else {
        // Forward subsequent packets to TCP remote socket
        const writer = remoteSocket.writable.getWriter();
        await writer.write(buffer);
        writer.releaseLock();
      }
    } catch (err) {
      server.close(1011, err.message);
    }
  });

  return new Response(null, {
    status: 101,
    webSocket: client,
  });
}
