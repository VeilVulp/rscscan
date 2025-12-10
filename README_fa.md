# RscScan - اسکنر آسیب‌پذیری Next.js Server Actions

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)
![Electron](https://img.shields.io/badge/Electron-28.0-47848F?logo=electron)
![Security](https://img.shields.io/badge/Security-Scanner-red)

**اسکنر حرفه‌ای و چندلتفرمی برای شناسایی آسیب‌پذیری RCE در Next.js Server Actions**

[ویژگی‌ها](#-ویژگی‌ها) • [نصب](#-نصب) • [استفاده](#-استفاده) • [ویدیو دمو](#-ویدیو-دمو) • [تصاویر](#-تصاویر)

</div>

---

## ⚠️ سلب مسئولیت قانونی

**این ابزار صرفاً برای اهداف آموزشی و تست نفوذ مجاز است.**

- ❌ **هرگز** از این ابزار بر روی سیستم‌هایی که مالک آن نیستید یا اجازه کتبی ندارید، استفاده نکنید.
- ❌ **هرگز** از این ابزار برای مقاصد مخرب استفاده نکنید.
- ✅ **فقط** در پروژه‌های تست نفوذ مجاز از آن استفاده کنید.
- ✅ **فقط** برای تحقیق و یادگیری از آن استفاده کنید.

**دسترسی غیرمجاز به سیستم‌های رایانه‌ای جرم است.** سوءاستفاده از این ابزار ممکن است منجر به پیگرد قانونی شود.

**با استفاده از این ابزار، شما موافقت می‌کنید که از آن به صورت مسئولانه و قانونی استفاده کنید.**

---

## 📋 فهرست مطالب

- [درباره پروژه](#-درباره-پروژه)
- [ویژگی‌ها](#-ویژگی‌ها)
- [تکنولوژی‌های استفاده شده](#-تکنولوژی‌های-استفاده-شده)
- [دانلود](#-دانلود)
- [نصب](#-نصب)
- [استفاده](#-استفاده)
- [ویدیو دمو](#-ویدیو-دمو)
- [تصاویر](#-تصاویر)
- [پشتیبانی از چند زبان](#-پشتیبانی-از-چند-زبان)
- [ساخت پروژه](#-ساخت-پروژه)
- [تست](#-تست)
- [ساختار پروژه](#-ساختار-پروژه)
- [مشارکت](#-مشارکت)
- [لایسنس](#-لایسنس)

---

## 🔍 درباره پروژه

**RscScan** یک ابزار امنیتی حرفه‌ای است که برای شناسایی CVE-2025-55182 طراحی شده است، یک آسیب‌پذیری حیاتی اجرای کد از راه دور (RCE) در Next.js Server Actions. این آسیب‌پذیری ناشی از مشکل Prototype Pollution است که به مهاجمان اجازه می‌دهد کدهای دلخواه را روی سرور اجرا کنند.

### جزئیات آسیب‌پذیری

| ویژگی | مقدار |
|----------|-------|
| **شناسیه CVE** | CVE-2025-55182 |
| **امتیاز CVSS** | 9.8 (Critical) |
| **سرویس آسیب‌پذیر** | Next.js Server Actions |
| **نوع** | Prototype Pollution (CVE-2025-55182) → Remote Code Execution |
| **بردار حمله** | درخواست HTTP POST با داده‌های مخرب multipart form |

---

## ✨ ویژگی‌ها

### قابلیت‌های اصلی
- 🎯 **اسکن چندرشته‌ای** - اسکن همزمان تا ۳۰ هدف
- 📊 **ردیابی پیشرفت لحظه‌ای** - نوار پیشرفت زنده با درصد تکمیل
- 📈 **داشبورد آمار** - نمایش بصری نتایج آسیب‌پذیر، امن و خطاها
- 🔍 **فیلترینگ پیشرفته** - جستجو و فیلتر نتایج بر اساس وضعیت، URL یا پیام
- 📤 **فرمت‌های خروجی متعدد** - خروجی گرفتن به صورت JSON یا CSV
- 🎭 **حالت دمو** - حالت تست امن با نتایج شبیه‌سازی شده

### ویژگی‌های نرم‌افزار دسکتاپ
- 🖥️ **چندپلتفرمی** - پشتیبانی از ویندوز، مک‌اواس و لینوکس
- 📁 **دیالوگ فایل بومی** - انتخاب فایل هدف با فایل‌پیگر سیستم
- 💾 **ذخیره‌سازی بومی** - ذخیره خروجی‌ها با دیالوگ سیستم
- 🔔 **اعلان‌های درون‌برنامه‌ای** - نمایش اعلان‌های زیبا پس از اتمام اسکن
- 🪟 **ذخیره وضعیت پنجره** - به یاد سپردن اندازه و موقعیت پنجره
- 🎨 **یکپارچگی با System Tray** - قابلیت مینیمایز شدن در نوار وظیفه

### رابط کاربری
- 🌍 **رابط چندزبانه** - پشتیبانی از انگلیسی، فارسی، روسی، آلمانی و چینی
- 🌓 **تم تاریک/روشن** - تغییر تم با تشخیص تنظیمات سیستم
- 📱 **طراحی واکنش‌گرا** - عملکرد عالی در دسکتاپ، تبلت و موبایل
- ⌨️ **میانبرهای صفحه کلید** - دسترسی سریع با کلیدهای میانبر
- 🎨 **طراحی حرفه‌ای** - رابط کاربری مدرن و تمیز با انیمیشن‌های روان
- 🔤 **فونت‌های اختصاصی** - فونت وزیرمتن برای فارسی

---

## 🛠 تکنولوژی‌های استفاده شده

### فرانت‌اند
- **React 19.2.1**
- **Vite 5.3**
- **Tailwind CSS 4.1**
- **Lucide React**

### بین‌المللی‌سازی
- **i18next 25.x**
- **react-i18next 16.x**
- **i18next-browser-languagedetector**

### فریم‌ورک دسکتاپ
- **Electron 28**
- **Electron Builder 24.9**

### کلاینت HTTP
- **Axios 1.13**

---

## 📥 دانلود

<div align="right" dir="rtl">
<table>
    <thead align="right">
        <tr>
            <th>سیستم عامل</th>
            <th>دانلود</th>
        </tr>
    </thead>
    <tbody align="right">
        <tr>
            <td>ویندوز (Windows)</td>
            <td>
                <b>64-bit (x64)</b><br>
                <a href="https://github.com/VeilVulp/Rscscan/releases/latest/download/RscScan-Setup-1.0.0-x64.exe"><img src="https://img.shields.io/badge/Setup-x64-2d7d9a.svg?logo=windows"></a>
                <a href="https://github.com/VeilVulp/Rscscan/releases/latest/download/RscScan-Portable-1.0.0-x64.zip"><img src="https://img.shields.io/badge/Portable-x64-67b7d1.svg?logo=windows"></a><br><br>
                <b>32-bit (x86)</b><br>
                <a href="https://github.com/VeilVulp/Rscscan/releases/latest/download/RscScan-Setup-1.0.0-ia32.exe"><img src="https://img.shields.io/badge/Setup-x86-0078d7.svg?logo=windows"></a>
                <a href="https://github.com/VeilVulp/Rscscan/releases/latest/download/RscScan-Portable-1.0.0-ia32.zip"><img src="https://img.shields.io/badge/Portable-x86-67b7d1.svg?logo=windows"></a>
            </td>
        </tr>
        <tr>
            <td>مک (macOS)</td>
            <td>
                <a href="https://github.com/VeilVulp/Rscscan/releases/latest/download/Rscscan-MacOS.dmg"><img src="https://img.shields.io/badge/DMG-Universal-ea005e.svg?logo=apple"></a><br>
                <a href="https://github.com/VeilVulp/Rscscan/releases/latest/download/Rscscan-MacOS-Installer.pkg"><img src="https://img.shields.io/badge/PKG-Universal-bc544b.svg?logo=apple" /></a>
            </td>
        </tr>
        <tr>
            <td>لینوکس (Linux)</td>
            <td>
                <a href="https://github.com/VeilVulp/Rscscan/releases/latest/download/Rscscan-Linux-x64.AppImage"><img src="https://img.shields.io/badge/AppImage-x64-f84e29.svg?logo=linux"> </a><br>
                <a href="https://github.com/VeilVulp/Rscscan/releases/latest/download/Rscscan-Debian-x64.deb"><img src="https://img.shields.io/badge/DebPackage-x64-FF9966.svg?logo=debian"> </a><br>
                <a href="https://github.com/VeilVulp/Rscscan/releases/latest/download/Rscscan-rpm-x64.rpm"><img src="https://img.shields.io/badge/RpmPackage-x64-F1B42F.svg?logo=redhat"> </a>
            </td>
        </tr>
    </tbody>
</table>

</div>

---

## 📦 نصب

### پیش‌نیازها

- **Node.js** نسخه 18.x یا بالاتر
- **npm** نسخه 9.x یا بالاتر
- **Git**

### کلون کردن مخزن

```bash
git clone https://github.com/VeilVulp/Rscscan.git
cd Rscscan
```

### نصب وابستگی‌ها

```bash
npm install
```

---

## 🚀 استفاده

### نسخه وب (حالت توسعه)

برای توسعه رابط کاربری:

```bash
npm run dev
```
برنامه در آدرس `http://localhost:5173` باز می‌شود.

**نکته:** نسخه وب محدودیت CORS دارد. برای اسکن واقعی از نسخه دسکتاپ استفاده کنید.

### نسخه دسکتاپ

#### حالت توسعه

```bash
npm run electron:dev
```

#### بیلد نهایی

برای راهنمای کامل بیلد، فایل [BUILD_GUIDE.md](BUILD_GUIDE.md) را ببینید.

---

## 🎥 ویدیو دمو

<video src="screenshots/demo.mp4" controls="controls" style="max-width: 100%;">
</video>

**[🎬 مشاهده ویدیو با کیفیت بالا](screenshots/demo.mp4)**

*راهنمای کامل: نصب ← پیکربندی ← چندزبانه ← اسکن ← خروجی*

---

## 📸 تصاویر

<div align="center">

### گالری رابط کاربری

<table width="100%">
  <tbody>
    <tr>
      <td align="center" width="50%">
        <h4>🌙 حالت تاریک</h4>
        <img src="screenshots/dark-mode.png" width="95%" alt="Dark Mode">
      </td>
      <td align="center" width="50%">
        <h4>☀️ حالت روشن</h4>
        <img src="screenshots/light-mode.png" width="95%" alt="Light Mode">
      </td>
    </tr>
  </tbody>
</table>

</div>

---

## 🏗️ ساخت پروژه

```bash
# بیلد برای پلتفرم فعلی
npm run electron:build
```

---

## 📁 ساختار پروژه

```text
rscscan/
├── electron/                    # Electron main process files
│   ├── main.cjs                 # Main process entry point
│   ├── preload.cjs              # Preload script (IPC bridge)
│   └── builder.config.cjs       # Electron Builder configuration
├── src/
│   ├── main.jsx                 # React entry point
│   ├── App.jsx                  # Main application component
│   ├── index.css                # Global styles and Tailwind
│   ├── i18n.js                  # i18next configuration
│   ├── components/              # React components
│   ├── services/                # Business logic
│   ├── hooks/                   # Custom React hooks
│   ├── utils/                   # Utility functions
│   ├── locales/                 # Translation files
│   │   ├── en/                  # English translations
│   │   ├── fa/                  # Persian translations
│   │   ├── ru/                  # Russian translations
│   │   ├── de/                  # German translations
│   │   └── zh/                  # Chinese translations
│   └── tests/                   # Unit tests
├── screenshots/                 # Application screenshots
├── build/                       # Build resources
├── public/                      # Public assets
└── release/                     # Built applications (generated)
```

---

## 🤝 مشارکت

مشارکت‌ها استقبال می‌شود! لطفاً فایل [CONTRIBUTING.md](CONTRIBUTING.md) را مطالعه کنید.

---

## 📄 لایسنس

MIT License

Copyright (c) 2025 VeilVulp

---

## 📞 پشتیبانی

- **Issues:** [GitHub Issues](https://github.com/VeilVulp/Rscscan/issues)
- **Email:** veilvulp@outlook.com
- **Instagram:** [@VeilVulp](https://www.instagram.com/veilvulp)
- **YouTube:** [@VeilVulp](https://www.youtube.com/@VeilVulp)

---

<div align="center">

**به یاد داشته باشید: از این ابزار مسئولانه و قانونی استفاده کنید.**

[⬆ بازگشت به بالا](#rscscan---اسکنر-آسیب‌پذیری-nextjs-server-actions)

</div>
