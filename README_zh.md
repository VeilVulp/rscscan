# RscScan - Next.js Server Actions 漏洞扫描器

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)
![Electron](https://img.shields.io/badge/Electron-28.0-47848F?logo=electron)
![Security](https://img.shields.io/badge/Security-Scanner-red)

**专业的跨平台 Next.js Server Actions RCE 漏洞扫描工具**

[功能](#-功能) • [安装](#-安装) • [使用](#-使用) • [视频演示](#-视频演示) • [截图](#-截图)

</div>

---

## ⚠️ 法律免责声明

**本工具仅用于教育和授权的安全测试目的。**

- ❌ **请勿** 在您不拥有或未获得明确书面许可的系统上使用此工具
- ❌ **请勿** 将此工具用于恶意目的
- ✅ **请** 仅在授权的渗透测试任务中使用此工具
- ✅ **请** 仅将此工具用于教育研究和学习

**未经授权访问计算机系统是违法的。** 滥用此工具可能会根据《计算机欺诈和滥用法案》（CFAA）及全球类似法律导致刑事起诉。

**使用此工具即表示您同意负责任且合法地使用它。**

---

## 📋 目录

- [关于](#-关于)
- [功能](#-功能)
- [技术栈](#-技术栈)
- [下载](#-下载)
- [安装](#-安装)
- [使用](#-使用)
- [视频演示](#-视频演示)
- [截图](#-截图)
- [多语言支持](#-多语言支持)
- [构建](#-构建)
- [测试](#-测试)
- [项目结构](#-项目结构)
- [贡献](#-贡献)
- [许可证](#-许可证)

---

## 🔍 关于

**RscScan** 是一款专业的安全工具，旨在检测 CVE-2025-55182，这是 Next.js Server Actions 中的一个严重远程代码执行（RCE）漏洞。该漏洞源于原型污染问题，允许攻击者在服务器上执行任意代码。

### 漏洞详情

| 属性 | 值 |
|----------|-------|
| **CVE ID** | CVE-2025-55182 |
| **CVSS 评分** | 9.8 (严重) |
| **受影响组件** | Next.js Server Actions |
| **类型** | 原型污染 (CVE-2025-55182) → 远程代码执行 |
| **向量** | 带有恶意多部分表单数据的 HTTP POST 请求 |

---

## ✨ 功能

### 核心功能
- 🎯 **多线程扫描** - 同时并发扫描多达 30 个目标
- 📊 **实时进度跟踪** - 带有完成百分比的实时进度条
- 📈 **统计仪表板** - 易受攻击、安全和错误结果的可视化统计
- 🔍 **高级过滤** - 按状态、URL 或消息搜索和过滤结果
- 📤 **多种导出格式** - 将结果导出为 JSON 或 CSV
- 🎭 **演示模式** - 带有模拟结果的安全测试模式

### 桌面应用程序功能
- 🖥️ **跨平台** - 支持 Windows、macOS 和 Linux
- 📁 **原生文件对话框** - 用于目标列表的系统文件选择器
- 💾 **原生保存对话框** - 使用系统对话框保存导出
- 🔔 **应用内通知** - 扫描完成后的美观 Toast 通知
- 🪟 **窗口状态持久化** - 记住窗口大小和位置
- 🎨 **系统托盘集成** - 最小化到系统托盘

### 用户界面
- 🌍 **多语言界面** - 支持英语、波斯语、俄语、德语和中文
- 🌓 **深色/浅色主题** - 根据系统偏好切换主题
- 📱 **响应式设计** - 在桌面、平板和移动设备上无缝工作
- ⌨️ **键盘快捷键** - 使用快捷键快速操作
- 🎨 **专业设计** - 简洁现代的界面和流畅的动画
- 🔤 **自定义字体** - 特定语言字体（中文使用 Noto Sans SC）

---

## 🛠 技术栈

### 前端
- **React 19.2.1**
- **Vite 5.3**
- **Tailwind CSS 4.1**
- **Lucide React**

### 国际化
- **i18next 25.x**
- **react-i18next 16.x**
- **i18next-browser-languagedetector**

### 桌面框架
- **Electron 28**
- **Electron Builder 24.9**

### HTTP 客户端
- **Axios 1.13**

---

## 📥 下载

<div align="left">
<table>
    <thead align="left">
        <tr>
            <th>操作系统</th>
            <th>下载链接</th>
        </tr>
    </thead>
    <tbody align="left">
        <tr>
            <td>Windows</td>
            <td>
                <a href="https://github.com/VeilVulp/Rscscan/releases/latest/download/Rscscan-Windows-Setup-x64.Msix"><img src="https://img.shields.io/badge/OfficialSetup-x64-0078d7.svg?logo=windows"></a><br>
                <a href="https://github.com/VeilVulp/Rscscan/releases/latest/download/Rscscan-Windows-Setup-x64.exe"><img src="https://img.shields.io/badge/Setup-x64-2d7d9a.svg?logo=windows"></a><br>
                <a href="https://github.com/VeilVulp/Rscscan/releases/latest/download/Rscscan-Windows-Portable-x64.zip"><img src="https://img.shields.io/badge/Portable-x64-67b7d1.svg?logo=windows"></a>
            </td>
        </tr>
        <tr>
            <td>macOS</td>
            <td>
                <a href="https://github.com/VeilVulp/Rscscan/releases/latest/download/Rscscan-MacOS.dmg"><img src="https://img.shields.io/badge/DMG-Universal-ea005e.svg?logo=apple"></a><br>
                <a href="https://github.com/VeilVulp/Rscscan/releases/latest/download/Rscscan-MacOS-Installer.pkg"><img src="https://img.shields.io/badge/PKG-Universal-bc544b.svg?logo=apple" /></a>
            </td>
        </tr>
        <tr>
            <td>Linux</td>
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

## 📦 安装

###先决条件

- **Node.js** 18.x 或更高版本
- **npm** 9.x 或更高版本
- **Git**

### 克隆仓库

```bash
git clone https://github.com/VeilVulp/Rscscan.git
cd Rscscan
```

### 安装依赖

```bash
npm install
```

---

## 🚀 使用

### Web 应用程序（开发模式）

适合 UI 开发和测试：

```bash
npm run dev
```
应用程序将在 `http://localhost:5173` 打开。

### 桌面应用程序

#### 开发模式

```bash
npm run electron:dev
```

#### 生产构建

请参阅 [BUILD_GUIDE.md](BUILD_GUIDE.md) 获取详细的构建说明。

---

## 🎥 视频演示

<video src="screenshots/demo.mp4" controls="controls" style="max-width: 100%;">
</video>

**[🎬 观看高清视频](screenshots/demo.mp4)**

*完整演示：安装 → 配置 → 多语言 → 扫描 → 导出*

</div>

---

## 📸 截图

<div align="center">

<table width="100%">
  <tbody>
    <tr>
      <td align="center" width="50%">
        <h4>🌙 深色模式</h4>
        <img src="screenshots/dark-mode.png" width="95%" alt="Dark Mode">
      </td>
      <td align="center" width="50%">
        <h4>☀️ 浅色模式</h4>
        <img src="screenshots/light-mode.png" width="95%" alt="Light Mode">
      </td>
    </tr>
  </tbody>
</table>

</div>

---

## 🏗️ 构建

```bash
# 为当前平台构建
npm run electron:build
```

---

## 📁 项目结构

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

## 🤝 贡献

欢迎贡献！请参阅 [CONTRIBUTING.md](CONTRIBUTING.md) 了解指南。

---

## 📄 许可证

MIT License

Copyright (c) 2025 VeilVulp

---

## 📞 支持

- **Issues:** [GitHub Issues](https://github.com/VeilVulp/Rscscan/issues)
- **邮箱:** veilvulp@outlook.com
- **Instagram:** [@VeilVulp](https://www.instagram.com/veilvulp)
- **YouTube:** [@VeilVulp](https://www.youtube.com/@VeilVulp)

---

<div align="center">

**请记住：负责任且合法地使用此工具。**

[⬆ 返回顶部](#rscscan---nextjs-server-actions-漏洞扫描器)

</div>
