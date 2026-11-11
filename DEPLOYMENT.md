# MAHI JOOVOON (مهی جووون)
## Advanced VPN Configuration Generator & Multi-Node Management Platform

### Architecture Overview
MAHI JOOVOON is an enterprise-grade VPN orchestrator and management platform built with React, TypeScript, Tailwind CSS, and a Node.js Express backend. It provides end-to-end cryptographic link generation for VLESS (Reality/TLS), VMess (WS/gRPC), Trojan, and Shadowsocks, alongside dynamic Base64 subscription feeds compatible with all modern VPN clients (V2rayNG, Sing-box, Clash Meta, Streisand, v2rayN).

---

### Deployment Target: GitHub + Railway / Ubuntu Cloud VPS

#### 1. Deployment via Railway
1. Push repository directly to **GitHub**.
2. Create a new service on **Railway** via "Deploy from GitHub repo".
3. Configure Environment Variables:
   ```env
   NODE_ENV=production
   PORT=3000
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. Build & Start Commands (handled automatically via Dockerfile or package.json):
   - **Build Command:** `npm run build`
   - **Start Command:** `npm run start`

> **Architectural Note regarding Railway Free Plan:**
> The web management panel runs seamlessly on Railway. Actual Xray / Marzban VPN core services require dedicated Linux compute nodes (Ubuntu 22.04 LTS / 24.04 LTS) with open ports (443, 2053, 8443, 8388) and direct network stack privileges. The panel connects to multiple edge nodes via the REST and SSH cluster interfaces configured in the "Multi-Node Servers" section.

---

### Docker Deployment
```bash
docker build -t mahi-joovoon:latest .
docker run -d -p 3000:3000 --name mahi-joovoon mahi-joovoon:latest
```

---

### Features Summary
- **Dark Luxury Visual Identity:** Jet black background with metallic gold accents and subtle amber glows.
- **Protocol Matrix:** VLESS (with XTLS Vision & Reality), VMess (WebSocket & gRPC), Trojan (TLS), Shadowsocks (AEAD).
- **Client Exports:** Direct URI link, QR Code Canvas, Clash Meta YAML, Sing-box Outbounds JSON, Xray JSON.
- **Universal Subscription Feed:** `/api/vpn/sub/:token` returning Base64 encoded payload with `Subscription-Userinfo` quota headers.
- **Billing & Gateways:** Zarinpal, IDPay, Bale Messenger Gateway, and Card-to-Card verification.
- **Multi-Node Clusters:** Real-time ping, telemetry, and load balancing across Germany, Finland, Netherlands, Turkey, and USA.
- **Support System:** 24/7 ticket messaging desk.
