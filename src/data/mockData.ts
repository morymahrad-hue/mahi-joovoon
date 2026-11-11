import {
  BaleBotConfig,
  FileItem,
  FirewallRule,
  NotificationItem,
  ProcessItem,
  Project,
  ServerMetrics,
  ServerSubscription,
  SSHSettings,
  SystemService,
  TerminalLog,
} from '../types';

export const initialProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'ecommerce-api-fastapi',
    persianTitle: 'وب‌سرویس فروشگاه (FastAPI)',
    runtime: 'python',
    framework: 'FastAPI',
    status: 'running',
    port: 8000,
    pid: 14205,
    cpu: 3.2,
    memory: 248,
    autoRestart: true,
    gitBranch: 'main',
    gitCommit: 'a4f912c (chore: optimize query)',
    lastDeployed: '۲ ساعت پیش',
    rootPath: '/var/www/ecommerce-api',
    startCommand: 'uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4',
    envVars: {
      DATABASE_URL: 'postgresql://db_user:s3cur3p@ss@127.0.0.1:5432/ecommerce',
      REDIS_HOST: '127.0.0.1',
      SECRET_KEY: 'jwt-sec-98471203875-production',
      PORT: '8000',
      ENVIRONMENT: 'production',
    },
    logs: [
      '[2026-10-25 09:12:01] INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)',
      '[2026-10-25 09:12:02] INFO:     Started parent process [14205]',
      '[2026-10-25 09:12:03] INFO:     Connected to PostgreSQL pool (max_size=20)',
      '[2026-10-25 09:12:03] INFO:     Connected to Redis cache on 127.0.0.1:6379',
      '[2026-10-25 10:45:21] INFO:     POST /api/v1/auth/login 200 OK in 14.2ms',
      '[2026-10-25 11:02:18] INFO:     GET /api/v1/products?limit=24 200 OK in 8.6ms',
      '[2026-10-25 11:30:40] INFO:     POST /api/v1/orders/checkout 201 Created in 42.1ms',
    ],
  },
  {
    id: 'proj-2',
    name: 'storefront-nextjs',
    persianTitle: 'فرانت‌اند فروشگاه (Next.js SSR)',
    runtime: 'nodejs',
    framework: 'Next.js',
    status: 'running',
    port: 3000,
    pid: 18932,
    cpu: 6.8,
    memory: 512,
    autoRestart: true,
    gitBranch: 'production',
    gitCommit: 'e710b24 (fix: cart checkout hydration)',
    lastDeployed: '۵ ساعت پیش',
    rootPath: '/var/www/storefront',
    startCommand: 'npm run start -- -p 3000',
    envVars: {
      NODE_ENV: 'production',
      NEXT_PUBLIC_API_URL: 'https://api.mydomain.ir/api/v1',
      PORT: '3000',
    },
    logs: [
      '[2026-10-25 08:00:10] ✓ Ready in 450ms',
      '[2026-10-25 08:00:10] ▲ Next.js 15.1.0 - Local: http://localhost:3000',
      '[2026-10-25 09:41:22] GET /fa/shop/categories 200 in 34ms',
      '[2026-10-25 10:15:02] GET /fa/products/laptop-pro 200 in 58ms',
      '[2026-10-25 12:20:19] POST /api/cart/sync 200 in 19ms',
    ],
  },
  {
    id: 'proj-3',
    name: 'telegram-bot-python',
    persianTitle: 'ربات تلگرام پردازش سفارشات',
    runtime: 'python',
    framework: 'Flask',
    status: 'running',
    port: 5000,
    pid: 22104,
    cpu: 1.1,
    memory: 110,
    autoRestart: true,
    gitBranch: 'main',
    gitCommit: '9c88210 (feat: add order status webhook)',
    lastDeployed: 'دیروز',
    rootPath: '/var/www/telegram-bot',
    startCommand: 'python3 bot_daemon.py',
    envVars: {
      BOT_TOKEN: '721839210:AAHq_m98FakeTelegramTokenForSimulation',
      ADMIN_CHAT_ID: '10928374',
      POLLING_INTERVAL: '1.5',
    },
    logs: [
      '[2026-10-24 18:20:00] [Bot] Initialized telegram webhook listener',
      '[2026-10-24 18:20:01] [Bot] Polling dispatcher active',
      '[2026-10-25 07:11:34] [Bot] Received command /start from user 991823',
      '[2026-10-25 11:42:01] [Bot] Sent order status update #4819',
    ],
  },
  {
    id: 'proj-4',
    name: 'notification-worker-node',
    persianTitle: 'ورکر ارسال پیامک و اعلان‌ها',
    runtime: 'nodejs',
    framework: 'Express',
    status: 'stopped',
    port: 4001,
    pid: null,
    cpu: 0,
    memory: 0,
    autoRestart: false,
    gitBranch: 'staging',
    gitCommit: '3318bdf (refactor: queue processor)',
    lastDeployed: '۳ روز پیش',
    rootPath: '/var/www/notification-worker',
    startCommand: 'node dist/index.js',
    envVars: {
      SMS_PROVIDER_API_KEY: 'sms-kavenegar-mock-key',
      RABBITMQ_URL: 'amqp://localhost',
    },
    logs: [
      '[2026-10-23 14:10:00] Process terminated gracefully via SIGTERM',
      '[2026-10-23 14:10:01] Service status: STOPPED',
    ],
  },
  {
    id: 'proj-5',
    name: 'bale-messenger-bot',
    persianTitle: 'ربات پیام‌رسان بله (Balethon)',
    runtime: 'python',
    framework: 'FastAPI',
    status: 'running',
    port: 8443,
    pid: 24190,
    cpu: 1.8,
    memory: 165,
    autoRestart: true,
    gitBranch: 'main',
    gitCommit: '7b80a1c (feat: connect to tapi.bale.ai endpoint)',
    lastDeployed: 'لحظاتی پیش',
    rootPath: '/var/www/bale-bot',
    startCommand: 'python3 bale_bot.py',
    envVars: {
      BALE_BOT_TOKEN: '1892048192:AAHqFakeTokenForBaleMessengerPreview_7X9b',
      BALE_API_ENDPOINT: 'https://tapi.bale.ai',
      CONNECTION_MODE: 'polling',
      WEBHOOK_PORT: '8443',
    },
    logs: [
      '[2026-10-25 09:30:15] [BaleBot] Connecting to tapi.bale.ai endpoint via HTTPS...',
      '[2026-10-25 09:30:16] [BaleBot] Handshake OK (24ms). Authorized as @bale_support_pro_bot',
      '[2026-10-25 09:30:16] [BaleBot] Long-polling dispatcher started successfully',
      '[2026-10-25 10:14:02] [BaleBot] Incoming message /start from user @reza_karimi',
    ],
  },
];

export const initialMetrics: ServerMetrics = {
  cpuUsage: 19.4,
  cpuCores: [24, 15, 21, 17],
  ramUsedGB: 3.42,
  ramTotalGB: 8.0,
  ramCachedGB: 1.85,
  swapUsedGB: 0.12,
  swapTotalGB: 4.0,
  diskUsedGB: 48.6,
  diskTotalGB: 160.0,
  diskReadMBs: 1.2,
  diskWriteMBs: 4.8,
  netInKbps: 420,
  netOutKbps: 890,
  uptimeSeconds: 3758400, // ~43.5 days
  loadAverage: [0.65, 0.48, 0.38],
  temperatureC: 44,
};

export const initialFiles: FileItem[] = [
  {
    id: 'f-1',
    name: 'www',
    path: '/var/www',
    type: 'directory',
    size: '4.0 KB',
    permissions: 'drwxr-xr-x',
    owner: 'www-data',
    group: 'www-data',
    modified: '۱۴۰۵/۰۸/۰۲ - ۱۱:۳۰',
  },
  {
    id: 'f-2',
    name: 'nginx',
    path: '/etc/nginx',
    type: 'directory',
    size: '4.0 KB',
    permissions: 'drwxr-xr-x',
    owner: 'root',
    group: 'root',
    modified: '۱۴۰۵/۰۷/۱۵ - ۰۹:۱۵',
  },
  {
    id: 'f-3',
    name: 'systemd',
    path: '/etc/systemd/system',
    type: 'directory',
    size: '4.0 KB',
    permissions: 'drwxr-xr-x',
    owner: 'root',
    group: 'root',
    modified: '۱۴۰۵/۰۷/۲۰ - ۱۴:۲۲',
  },
  {
    id: 'f-4',
    name: 'nginx.conf',
    path: '/etc/nginx/nginx.conf',
    type: 'file',
    size: '1.8 KB',
    permissions: '-rw-r--r--',
    owner: 'root',
    group: 'root',
    modified: '۱۴۰۵/۰۷/۱۵ - ۰۹:۱۵',
    extension: 'conf',
    content: `user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
    worker_connections 2048;
    multi_accept on;
}

http {
    sendfile on;
    tcp_nopush on;
    types_hash_max_size 2048;
    server_tokens off;

    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # SSL Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    # Logging
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/xml;

    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}`,
  },
  {
    id: 'f-5',
    name: 'ecommerce-api.conf',
    path: '/etc/nginx/sites-available/ecommerce-api.conf',
    type: 'file',
    size: '1.2 KB',
    permissions: '-rw-r--r--',
    owner: 'root',
    group: 'root',
    modified: '۱۴۰۵/۰۷/۲۵ - ۱۶:۴۰',
    extension: 'conf',
    content: `server {
    listen 80;
    server_name api.mydomain.ir;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}`,
  },
  {
    id: 'f-6',
    name: 'ecommerce-api.service',
    path: '/etc/systemd/system/ecommerce-api.service',
    type: 'file',
    size: '640 B',
    permissions: '-rw-r--r--',
    owner: 'root',
    group: 'root',
    modified: '۱۴۰۵/۰۷/۲۵ - ۱۶:۴۵',
    extension: 'service',
    content: `[Unit]
Description=FastAPI eCommerce Microservice
After=network.target postgresql.service redis.service

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/ecommerce-api
EnvironmentFile=/var/www/ecommerce-api/.env
ExecStart=/var/www/ecommerce-api/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target`,
  },
  {
    id: 'f-7',
    name: '.env.production',
    path: '/var/www/ecommerce-api/.env.production',
    type: 'file',
    size: '320 B',
    permissions: '-rw-------',
    owner: 'www-data',
    group: 'www-data',
    modified: '۱۴۰۵/۰۸/۰۱ - ۱۰:۱۴',
    extension: 'env',
    content: `ENVIRONMENT=production
DEBUG=False
PORT=8000
DATABASE_URL=postgresql://db_user:s3cur3p@ss@127.0.0.1:5432/ecommerce
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
SECRET_KEY=k92j8f9s8d7hf9283h4fkjsdf`,
  },
  {
    id: 'f-8',
    name: 'main.py',
    path: '/var/www/ecommerce-api/main.py',
    type: 'file',
    size: '2.4 KB',
    permissions: '-rw-r--r--',
    owner: 'www-data',
    group: 'www-data',
    modified: '۱۴۰۵/۰۸/۰۲ - ۱۰:۳۰',
    extension: 'py',
    content: `from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(
    title="VPS Backend API",
    description="High-performance Persian eCommerce Microservice",
    version="2.4.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "VPS Control Panel API is healthy", "status": "online"}

@app.get("/health")
def health_check():
    return {"status": "ok", "uptime_tier": "99.98%"}
`,
  },
  {
    id: 'f-9',
    name: 'ecosystem.config.js',
    path: '/var/www/storefront/ecosystem.config.js',
    type: 'file',
    size: '720 B',
    permissions: '-rw-r--r--',
    owner: 'www-data',
    group: 'www-data',
    modified: '۱۴۰۵/۰۷/۲۸ - ۱۸:۰۰',
    extension: 'js',
    content: `module.exports = {
  apps: [
    {
      name: 'storefront-nextjs',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      cwd: '/var/www/storefront',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};`,
  },
  {
    id: 'f-10',
    name: 'docker-compose.yml',
    path: '/var/www/docker-compose.yml',
    type: 'file',
    size: '880 B',
    permissions: '-rw-r--r--',
    owner: 'root',
    group: 'root',
    modified: '۱۴۰۵/۰۶/۱۰ - ۱۴:۱۵',
    extension: 'yml',
    content: `version: '3.8'

services:
  redis:
    image: redis:7-alpine
    restart: always
    ports:
      - "127.0.0.1:6379:6379"
    volumes:
      - redis_data:/data

  postgres:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_USER: db_user
      POSTGRES_PASSWORD: s3cur3p@ss
      POSTGRES_DB: ecommerce
    ports:
      - "127.0.0.1:5432:5432"
    volumes:
      - pg_data:/var/lib/postgresql/data

volumes:
  redis_data:
  pg_data:`,
  },
  {
    id: 'f-11',
    name: 'bale_bot.py',
    path: '/var/www/bale-bot/bale_bot.py',
    type: 'file',
    size: '3.1 KB',
    permissions: '-rw-r--r--',
    owner: 'www-data',
    group: 'www-data',
    modified: '۱۴۰۵/۰۸/۰۳ - ۰۹:۳۰',
    extension: 'py',
    content: `"""
Bale Messenger Bot Daemon with Google Gemini AI Integration
Library: Balethon + Google GenAI SDK (gemini-3.8-flash)
API Endpoint: https://tapi.bale.ai/bot<TOKEN>/
"""
import os
import asyncio
from balethon import Client
from balethon.objects import Message, InlineKeyboard, InlineKeyboardButton
from google import genai

BOT_TOKEN = os.getenv("BALE_BOT_TOKEN", "1892048192:AAHqFakeTokenForBaleMessengerPreview_7X9b")
GEMINI_KEY = os.getenv("GEMINI_API_KEY")

bot = Client(token=BOT_TOKEN)
ai = genai.Client(api_key=GEMINI_KEY) if GEMINI_KEY else None

@bot.on_connect()
async def ready_handler(client):
    me = await client.get_me()
    print(f"[BaleBot] Online as @{me.username} with Gemini 3.8 Flash AI active")

@bot.on_message()
async def message_handler(client, message: Message):
    if not message.text:
        return

    if message.text == "/start":
        kb = InlineKeyboard(
            [
                [InlineKeyboardButton("🤖 گفتگو با هوش مصنوعی جمنای", callback_data="ai_chat")],
                [InlineKeyboardButton("💳 پرداخت آنلاین بله", callback_data="pay")],
                [InlineKeyboardButton("📞 ارتباط با پشتیبانی", callback_data="support")]
            ]
        )
        await message.reply(
            "سلام! به ربات هوشمند متصل به سرور VPS و موتور هوش مصنوعی Gemini خوش آمدید.\\n"
            "می‌توانید هر سوالی در چت بپرسید تا با هوش مصنوعی جمنای پاسخ داده شود.",
            reply_markup=kb
        )
    elif message.text == "/ping":
        await message.reply("پونگ! سرور و موتور Gemini کاملاً آنلاین و پایدار هستند. 🟢")
    else:
        # Auto-reply with Gemini AI
        if ai:
            response = ai.models.generate_content(
                model="gemini-3.8-flash",
                contents=message.text,
                config={
                    "system_instruction": "شما دستیار رسمی و مودب در پیام‌رسان بله هستید. به فارسی روان و دقیق پاسخ دهید.",
                    "temperature": 0.7
                }
            )
            await message.reply(response.text)
        else:
            await message.reply("پیام دریافت شد. هوش مصنوعی در حال پردازش است...")

if __name__ == "__main__":
    print("[BaleBot+Gemini] Starting service daemon with Gemini AI...")
    bot.run()`,
  },
  {
    id: 'f-12',
    name: 'bale_config.json',
    path: '/var/www/bale-bot/bale_config.json',
    type: 'file',
    size: '512 B',
    permissions: '-rw-r--r--',
    owner: 'www-data',
    group: 'www-data',
    modified: '۱۴۰۵/۰۸/۰۳ - ۰۹:۳۰',
    extension: 'json',
    content: `{
  "bot_username": "bale_support_pro_bot",
  "api_endpoint": "https://tapi.bale.ai",
  "connection_mode": "polling",
  "webhook_url": "https://api.mydomain.ir:8443/bale-webhook",
  "webhook_port": 8443,
  "banking_gateway": {
    "enabled": true,
    "merchant_id": "bale_merchant_9812",
    "currency": "IRR"
  },
  "auto_restart": true
}`,
  },
];

export const initialTerminalLogs: TerminalLog[] = [
  {
    id: 'term-1',
    command: 'uname -a',
    output: 'Linux vps-tehran-01 6.8.0-45-generic #45-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux',
    timestamp: '10:40:12',
  },
  {
    id: 'term-2',
    command: 'pm2 status',
    output: `┌────┬────────────────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name                   │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │
├────┼────────────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ storefront-nextjs      │ default     │ 15.1.0  │ cluster │ 18932    │ 43d    │ 0    │ online    │ 6.8%     │ 512.0mb  │
│ 1  │ notification-worker    │ default     │ 1.0.0   │ fork    │ 0        │ 0      │ 0    │ stopped   │ 0%       │ 0b       │
└────┴────────────────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┘`,
    timestamp: '10:41:00',
  },
  {
    id: 'term-3',
    command: 'systemctl status uvicorn-ecommerce',
    output: `● ecommerce-api.service - FastAPI eCommerce Microservice
     Loaded: loaded (/etc/systemd/system/ecommerce-api.service; enabled; vendor preset: enabled)
     Active: active (running) since Sun 2026-10-25 09:12:01 IRST; 2h 19min ago
   Main PID: 14205 (uvicorn)
      Tasks: 5 (limit: 9482)
     Memory: 248.4M
        CPU: 18.291s
     CGroup: /system.slice/ecommerce-api.service
             ├─14205 /var/www/ecommerce-api/venv/bin/python3 -m uvicorn app.main:app
             ├─14210 worker [1]
             └─14211 worker [2]`,
    timestamp: '10:42:15',
  },
];

export const initialServices: SystemService[] = [
  {
    name: 'nginx',
    displayName: 'وب‌سرور Nginx',
    description: 'وب‌سرور اصلی و ریورس‌پروکسی پورت‌های ۸۰ و ۴۴۳',
    status: 'active',
    port: 80,
    memoryMB: 48,
    enabled: true,
  },
  {
    name: 'postgresql',
    displayName: 'پایگاه‌داده PostgreSQL 16',
    description: 'پایگاه داده رابطه‌ای اصلی پروژه‌ها',
    status: 'active',
    port: 5432,
    memoryMB: 412,
    enabled: true,
  },
  {
    name: 'redis-server',
    displayName: 'کش و صف این‌مموری Redis',
    description: 'سرویس کش حافظه موقت و سشن‌ها',
    status: 'active',
    port: 6379,
    memoryMB: 98,
    enabled: true,
  },
  {
    name: 'docker',
    displayName: 'موتور کانتینر Docker Daemon',
    description: 'مدیریت و اجرای کانتینرهای مستقل',
    status: 'active',
    port: 2375,
    memoryMB: 280,
    enabled: true,
  },
  {
    name: 'ssh',
    displayName: 'سرویس امن OpenSSH Daemon',
    description: 'اتصال راه دور امن شل لینوکس پورت ۲۲',
    status: 'active',
    port: 22,
    memoryMB: 18,
    enabled: true,
  },
  {
    name: 'ufw',
    displayName: 'دیواره آتش لینوکس UFW',
    description: 'مدیریت پورت‌ها و فیلترینگ ترافیک شبکه',
    status: 'active',
    memoryMB: 8,
    enabled: true,
  },
];

export const initialProcesses: ProcessItem[] = [
  { pid: 14205, user: 'www-data', cpu: 3.2, mem: 3.1, command: 'uvicorn app.main:app (FastAPI)', uptime: '02:19:12' },
  { pid: 18932, user: 'www-data', cpu: 6.8, mem: 6.4, command: 'node next-server (Storefront)', uptime: '43d 11h' },
  { pid: 22104, user: 'developer', cpu: 1.1, mem: 1.4, command: 'python3 bot_daemon.py', uptime: '1d 04h' },
  { pid: 981, user: 'postgres', cpu: 2.1, mem: 5.2, command: 'postgres: checkpointer & writer', uptime: '43d 12h' },
  { pid: 850, user: 'redis', cpu: 0.6, mem: 1.2, command: 'redis-server 127.0.0.1:6379', uptime: '43d 12h' },
  { pid: 1102, user: 'root', cpu: 0.8, mem: 0.6, command: 'nginx: master process /usr/sbin/nginx', uptime: '43d 12h' },
  { pid: 1104, user: 'www-data', cpu: 1.4, mem: 1.1, command: 'nginx: worker process', uptime: '43d 12h' },
  { pid: 612, user: 'root', cpu: 0.2, mem: 0.4, command: '/usr/sbin/sshd -D', uptime: '43d 12h' },
  { pid: 489, user: 'root', cpu: 0.1, mem: 3.5, command: 'dockerd --containerd=/run/containerd', uptime: '43d 12h' },
  { pid: 1, user: 'root', cpu: 0.0, mem: 0.2, command: '/sbin/init splash', uptime: '43d 12h' },
];

export const initialSSHSettings: SSHSettings = {
  host: '185.190.142.88',
  port: 22,
  username: 'root',
  authMethod: 'both',
  passwordAuthEnabled: true,
  twoFactorEnabled: false,
  activeKeys: [
    {
      id: 'key-1',
      name: 'MacBook Pro - Workstation (Ed25519)',
      fingerprint: 'SHA256:4X7mQW7p...2kL90aB',
      type: 'ed25519',
      createdAt: '۱۴۰۵/۰۶/۱۵',
    },
    {
      id: 'key-2',
      name: 'CI/CD GitHub Actions Deploy Key',
      fingerprint: 'SHA256:9vZ3pT4...rE81mK',
      type: 'rsa-4096',
      createdAt: '۱۴۰۵/۰۷/۰۱',
    },
  ],
  lastLoginIp: '5.120.89.44',
  lastLoginTime: 'امروز، ۱۰:۱۵ (تهران)',
};

export const initialSubscription: ServerSubscription = {
  planName: 'Cloud VPS Pro - Tier 3',
  datacenter: 'آسیاتک - برج میلاد (تهران)',
  datacenterCity: 'Tehran, IR',
  datacenterFlag: '🇮🇷',
  ipAddress: '185.190.142.88',
  ipv6Address: '2a01:4f8:1c1a:9b00::1',
  os: 'Ubuntu 24.04 LTS (Noble Numbat)',
  kernel: 'Linux 6.8.0-45-generic x86_64',
  expiresAtShamsi: '۱۴ آذر ۱۴۰۵ (۴۱ روز باقی‌مانده)',
  expiresAtGregorian: '2026-12-05',
  daysRemaining: 41,
  autoRenew: true,
  bandwidthUsedGB: 840,
  bandwidthTotalGB: 2000,
  costMonthlyToman: 450000,
};

export const initialFirewallRules: FirewallRule[] = [
  { id: 'fw-1', port: '22', protocol: 'tcp', action: 'ALLOW', from: 'هر نقطه‌ای (Anywhere)', comment: 'پورت امن SSH' },
  { id: 'fw-2', port: '80', protocol: 'tcp', action: 'ALLOW', from: 'هر نقطه‌ای (Anywhere)', comment: 'ترافیک وب HTTP' },
  { id: 'fw-3', port: '443', protocol: 'tcp', action: 'ALLOW', from: 'هر نقطه‌ای (Anywhere)', comment: 'ترافیک رمزنگاری‌شده HTTPS' },
  { id: 'fw-4', port: '3000', protocol: 'tcp', action: 'ALLOW', from: '127.0.0.1 (Localhost)', comment: 'سرویس Next.js داخلی' },
  { id: 'fw-5', port: '8000', protocol: 'tcp', action: 'ALLOW', from: '127.0.0.1 (Localhost)', comment: 'سرویس FastAPI داخلی' },
  { id: 'fw-6', port: '5432', protocol: 'tcp', action: 'DENY', from: 'ترافیک عمومی (Public)', comment: 'بستن دسترسی عمومی به دیتابیس' },
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'پشتیبان‌گیری خودکار موفق',
    message: 'بک‌آپ کامل از دیتابیس PostgreSQL و پوشه /var/www با موفقیت ذخیره شد.',
    time: '۱ ساعت پیش',
    type: 'success',
    read: false,
  },
  {
    id: 'n-2',
    title: 'به‌روزرسانی امنیتی لینوکس',
    message: '۳ بسته امنیتی آماده نصب از طریق apt-get upgrade هستند.',
    time: '۵ ساعت پیش',
    type: 'info',
    read: false,
  },
  {
    id: 'n-3',
    title: 'مصرف ترافیک ماهانه',
    message: 'شما بیش از ۴۰ درصد از سهمیه پهنای باند ماهانه (۸۴۰ گیگابایت) را مصرف کرده‌اید.',
    time: 'دیروز',
    type: 'warning',
    read: true,
  },
];

export const initialBaleBot: BaleBotConfig = {
  botName: 'ربات هوشمند پشتیبانی و پرداخت بله',
  botUsername: 'bale_support_pro_bot',
  botToken: '1892048192:AAHqFakeTokenForBaleMessengerPreview_7X9b',
  status: 'connected',
  mode: 'polling',
  webhookUrl: 'https://api.mydomain.ir:8443/bale-webhook',
  webhookPort: 8443,
  runtime: 'python',
  framework: 'balethon',
  pid: 24190,
  autoRestart: true,
  messagesReceived: 1248,
  messagesSent: 1192,
  lastPingMs: 24,
  sslEnabled: true,
  bankingEnabled: true,
  templateType: 'customer-service',
  gemini: {
    enabled: true,
    model: 'gemini-3.8-flash',
    systemInstruction: 'شما دستیار هوشمند و رسمی پیام‌رسان بله هستید. به سوالات کاربران به زبان فارسی روان، دقیق و مودبانه پاسخ دهید و در صورت نیاز راهنمایی پرداخت یا پشتیبانی ارائه نمایید.',
    temperature: 0.7,
    autoReplyToUsers: true,
    lastAiResponse: 'درود! ارتباط با سرور و هوش مصنوعی Gemini 3.8 Flash برقرار است. هر سوالی در رابطه با خدمات سرور یا سفارشات دارید بفرمایید.',
    totalTokensUsed: 14820,
  },
  logs: [
    '[2026-10-25 09:30:15] [BaleBot] Connecting to tapi.bale.ai endpoint via HTTPS...',
    '[2026-10-25 09:30:16] [BaleBot] Handshake OK (24ms). Authorized as @bale_support_pro_bot (ID: 102938475)',
    '[2026-10-25 09:30:16] [BaleBot+Gemini] Initialized Google GenAI SDK (Model: gemini-3.8-flash) with server key',
    '[2026-10-25 09:30:16] [BaleBot] Long-polling dispatcher started successfully on worker #1',
    '[2026-10-25 10:14:02] [BaleBot] Incoming message from user @reza_karimi (ID: 4910283): /start',
    '[2026-10-25 10:14:03] [BaleBot] Sent keyboard reply: سلام! به ربات خدمات و پرداخت بله خوش آمدید.',
    '[2026-10-25 10:55:12] [BaleBot+Gemini] User query received: "چطور می‌توانم حسابم را شارژ کنم؟"',
    '[2026-10-25 10:55:13] [BaleBot+Gemini] Gemini generated 48 tokens in 380ms -> Sent AI reply to @reza_karimi',
    '[2026-10-25 11:22:18] [BaleBot] Payment invoice generated: #INV-9812 (500,000 IRR) via Bale Banking Gateway',
    '[2026-10-25 11:24:05] [BaleBot] Callback received: Invoice #INV-9812 paid successfully (RefId: 8192736192)',
    '[2026-10-25 12:00:10] [BaleBot] System healthcheck OK. API response time: 19ms',
  ],
};
