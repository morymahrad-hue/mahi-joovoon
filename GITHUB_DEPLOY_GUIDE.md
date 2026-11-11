# 🚀 راهنمای جامع اتصال و دپلوی خودکار MAHI JOOVOON به GitHub و Railway

این پروژه به‌گونه‌ای آماده شده است که با هر `git push` به مخزن گیت‌هاب شما، فایل‌های تست، ساخت و دپلوی به صورت **کاملاً خودکار (CI/CD)** اجرا شوند.

---

## 📌 گام اول: ساخت مخزن در GitHub و ارسال کدها

اگر Git روی سیستم شما نصب است، در پوشه پروژه ترمینال را باز کرده و مراحل زیر را انجام دهید:

### ۱. مقداردهی اولیه Git (در صورت انجام نشدن)
```bash
git init
git add .
git commit -m "feat: initial commit for MAHI JOOVOON platform"
git branch -M main
```

### ۲. اتصال به ریپازیتوری گیت‌هاب شما
در گیت‌هاب یک مخزن جدید با نام مثلاً `mahi-joovoon` بسازید (می‌تواند Public یا Private باشد). سپس:
```bash
# آدرس ریپازیتوری خود را جایگزین کنید:
git remote add origin https://github.com/YOUR_USERNAME/mahi-joovoon.git
git push -u origin main
```

---

## ⚡ گام دوم: پایپ‌لاین خودکار GitHub Actions (فعال شده)

یک فایل اختصاصی در مسیر `.github/workflows/deploy.yml` درون پروژه قرار داده شده است.
به محض اجرای دستور `git push`، گیت‌هاب به صورت خودکار:
1. پکیج‌های پروژه را با Node.js 20 نصب می‌کند (`npm ci`).
2. بررسی نوع‌ها و عدم وجود خطای کامپایلر را تست می‌کند (`npm run lint`).
3. فرانت‌اند و کدها را به صورت بهینه بیلد می‌کند (`npm run build`).
4. کانتینر Docker را تست و آماده‌سازی می‌کند.

---

## ☁️ گام سوم: اتصال و دیپلوی خودکار به Railway (Continuous Deployment)

سایت **Railway.app** بهترین پلتفرم ابری برای میزبانی پروژه‌های Full-Stack متصل به GitHub است.

### مراحل فعال‌سازی دیپلوی اتوماتیک:
1. وارد سایت [railway.com](https://railway.com) شوید و با اکانت **GitHub** خود لاگین کنید.
2. روی دکمه **New Project** کلیک کنید.
3. گزینه **Deploy from GitHub repo** را انتخاب نمایید.
4. ریپازیتوری `mahi-joovoon` را انتخاب کنید.
5. به تب **Variables** بروید و متغیرهای زیر را اضافه کنید:
   * `NODE_ENV` = `production`
   * `PORT` = `3000`
   * `GEMINI_API_KEY` = (کلید API اختیاری)
6. به تب **Settings** بروید و در بخش **Networking**، روی **Generate Domain** کلیک کنید تا یک آدرس اینترنتی عمومی رایگان (مثلاً `mahi-joovoon.up.railway.app`) به شما اختصاص یابد.

> 💡 **ویژگی فوق‌العاده:** از این پس هر تغییری در کد بدهید و دستور `git push` را بزنید، Railway در عرض چند ثانیه تغییرات را دریافت کرده، دوباره پروژه را بیلد و سایت زنده را به‌روزرسانی می‌کند!

---

## 🐳 روش جایگزین: اجرای دستی با Docker
```bash
# بیلد کانتینر
docker build -t mahi-joovoon:latest .

# اجرای کانتینر روی پورت ۳۰۰۰
docker run -d -p 3000:3000 --name mahi-joovoon mahi-joovoon:latest
```
سپس پنل در مرورگر در آدرس `http://localhost:3000` در دسترس خواهد بود.
