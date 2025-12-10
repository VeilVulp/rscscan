# Build Guide - RscScan

Complete guide for building RscScan for all platforms (Windows, macOS, Linux).

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Development Build](#development-build)
- [Production Build](#production-build)
  - [Windows](#windows)
  - [macOS](#macos)
  - [Linux](#linux)
- [Build Configuration](#build-configuration)
- [Troubleshooting](#troubleshooting)
- [Advanced Topics](#advanced-topics)

---

## Prerequisites

### Required Software

1. **Node.js** (v18.x or higher)
   ```bash
   node --version  # Should be v18.0.0 or higher
   ```

2. **npm** (v9.x or higher)
   ```bash
   npm --version  # Should be 9.0.0 or higher
   ```

3. **Git**
   ```bash
   git --version
   ```

### Platform-Specific Requirements

#### Windows
- **Windows 10** or later
- **Visual Studio Build Tools** (for native modules)
  ```bash
  npm install --global windows-build-tools
  ```

#### macOS
- **macOS 10.13** or later
- **Xcode Command Line Tools**
  ```bash
  xcode-select --install
  ```
- **Code Signing Certificate** (for distribution)

#### Linux
- **glibc 2.28** or later
- **Build essentials**
  ```bash
  # Ubuntu/Debian
  sudo apt-get install build-essential

  # Fedora/RHEL
  sudo dnf install @development-tools
  ```

---

## Development Build

### 1. Clone and Install

```bash
# Clone repository
git clone https://github.com/VeilVulp/Rscscan.git
cd Rscscan

# Install dependencies
npm install
```

### 2. Run Development Server

#### Web Mode (React Only)
```bash
npm run dev
```
- Opens at `http://localhost:5173`
- Hot module replacement enabled
- Good for UI development

#### Electron Mode (Full Application)
```bash
npm run electron:dev
```
- Starts Vite dev server
- Launches Electron with DevTools
- Full native features available

---

## Production Build

### Build Commands Overview

```bash
# Build for current platform
npm run electron:build

# Build for specific platforms
npm run electron:build:win    # Windows (NSIS + Portable)
npm run electron:build:mac    # macOS (DMG + ZIP)
npm run electron:build:linux  # Linux (AppImage + DEB + RPM)
```

---

### Windows

#### Build Output
- **NSIS Installer** (`.exe`) - Full installer with auto-update
- **Portable** (`.exe`) - Standalone executable

#### Build Command
```bash
npm run electron:build:win
```

#### Build Process
1. Builds React app with Vite
2. Packages Electron app
3. Creates NSIS installer
4. Creates portable executable
5. Outputs to `release/` directory

#### Output Files
```
release/
├── RscScan Setup 1.0.0.exe          # NSIS Installer (x64)
├── RscScan Setup 1.0.0-ia32.exe     # NSIS Installer (32-bit)
└── RscScan 1.0.0.exe                # Portable (x64)
```

#### File Sizes (Approximate)
- NSIS Installer: ~80 MB
- Portable: ~120 MB

#### Installation
- **NSIS Installer:** Double-click to install
- **Portable:** Extract and run directly

---

### macOS

#### Build Output
- **DMG** (`.dmg`) - Disk image for distribution
- **ZIP** (`.zip`) - Archive for direct extraction

#### Build Command
```bash
npm run electron:build:mac
```

#### Build Process
1. Builds React app with Vite
2. Packages Electron app
3. Creates app bundle (`.app`)
4. Creates DMG with background image
5. Creates ZIP archive
6. Outputs to `release/` directory

#### Output Files
```
release/
├── RscScan-1.0.0-arm64.dmg          # Apple Silicon (M1/M2/M3)
├── RscScan-1.0.0-x64.dmg            # Intel Mac
├── RscScan-1.0.0-arm64-mac.zip      # Apple Silicon ZIP
└── RscScan-1.0.0-x64-mac.zip        # Intel Mac ZIP
```

#### File Sizes (Approximate)
- DMG: ~85 MB
- ZIP: ~80 MB

#### Installation
- **DMG:** Open and drag to Applications
- **ZIP:** Extract and move to Applications

#### Code Signing (Optional)
For distribution outside the App Store:

```bash
# Set environment variables
export APPLE_ID="your-apple-id@email.com"
export APPLE_ID_PASSWORD="app-specific-password"
export CSC_LINK="path/to/certificate.p12"
export CSC_KEY_PASSWORD="certificate-password"

# Build with signing
npm run electron:build:mac
```

#### Notarization (Required for macOS 10.15+)
```bash
# Notarization happens automatically if credentials are set
# Check notarization status
xcrun altool --notarization-history 0 -u "$APPLE_ID" -p "$APPLE_ID_PASSWORD"
```

---

### Linux

#### Build Output
- **AppImage** (`.AppImage`) - Universal Linux package
- **DEB** (`.deb`) - Debian/Ubuntu package
- **RPM** (`.rpm`) - Fedora/RHEL package

#### Build Command
```bash
npm run electron:build:linux
```

#### Build Process
1. Builds React app with Vite
2. Packages Electron app
3. Creates AppImage (universal)
4. Creates DEB package
5. Creates RPM package
6. Outputs to `release/` directory

#### Output Files
```
release/
├── RscScan-1.0.0.AppImage           # Universal (x64)
├── rscscan_1.0.0_amd64.deb          # Debian/Ubuntu
└── rscscan-1.0.0.x86_64.rpm         # Fedora/RHEL
```

#### File Sizes (Approximate)
- AppImage: ~95 MB
- DEB: ~85 MB
- RPM: ~85 MB

#### Installation

**AppImage:**
```bash
chmod +x RscScan-1.0.0.AppImage
./RscScan-1.0.0.AppImage
```

**DEB (Debian/Ubuntu):**
```bash
sudo dpkg -i rscscan_1.0.0_amd64.deb
sudo apt-get install -f  # Fix dependencies if needed
```

**RPM (Fedora/RHEL):**
```bash
sudo rpm -i rscscan-1.0.0.x86_64.rpm
# Or
sudo dnf install rscscan-1.0.0.x86_64.rpm
```

---

## Build Configuration

### Electron Builder Configuration

Configuration is in `electron/builder.config.cjs`:

```javascript
module.exports = {
    appId: 'com.veilvulp.rscscan',
    productName: 'RscScan',
    directories: {
        output: 'release',
        buildResources: 'build'
    },
    files: [
        'dist-react/**/*',
        'electron/**/*',
        'package.json'
    ],
    // Platform-specific configurations...
}
```

### Customization Options

#### Change App Name
```javascript
productName: 'YourAppName'
```

#### Change App ID
```javascript
appId: 'com.yourcompany.yourapp'
```

#### Change Output Directory
```javascript
directories: {
    output: 'dist'
}
```

#### Add/Remove File Types
```javascript
fileAssociations: [
    {
        ext: 'txt',
        name: 'Text File',
        role: 'Editor'
    }
]
```

---

## Troubleshooting

### Common Issues

#### 1. Build Fails with "Cannot find module"

**Problem:** Missing dependencies

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

---

#### 2. Windows Build Fails with "node-gyp" Error

**Problem:** Missing Visual Studio Build Tools

**Solution:**
```bash
npm install --global windows-build-tools
```

---

#### 3. macOS Build Fails with "Code signing required"

**Problem:** No code signing certificate

**Solution:**
```bash
# Skip code signing for local builds
export CSC_IDENTITY_AUTO_DISCOVERY=false
npm run electron:build:mac
```

---

#### 4. Linux Build Fails with "EACCES: permission denied"

**Problem:** Insufficient permissions

**Solution:**
```bash
# Fix permissions
chmod +x node_modules/.bin/*
npm run electron:build:linux
```

---

#### 5. Build Succeeds but App Shows Black Screen

**Problem:** Incorrect file paths in production

**Solution:**
Check `electron/main.cjs` file loading:
```javascript
// Should be:
const indexPath = path.join(__dirname, '..', 'dist-react', 'index.html');
```

---

#### 6. Large Bundle Size

**Problem:** Unnecessary files included

**Solution:**
Update `files` in `electron/builder.config.cjs`:
```javascript
files: [
    'dist-react/**/*',
    'electron/**/*',
    'package.json',
    '!**/*.map',           // Exclude source maps
    '!**/node_modules/**'  // Exclude dev dependencies
]
```

---

### Debug Build Issues

#### Enable Verbose Logging
```bash
DEBUG=electron-builder npm run electron:build
```

#### Check Build Output
```bash
# Inspect packaged files
ls -la release/
```

#### Test Built App
```bash
# Windows
./release/RscScan.exe

# macOS
open ./release/mac/RscScan.app

# Linux
./release/RscScan.AppImage
```

---

## Advanced Topics

### Multi-Platform Builds

Build for all platforms from a single machine (requires Docker):

```bash
# Install electron-builder-docker
npm install --save-dev electron-builder-docker

# Build for all platforms
npm run electron:build -- --win --mac --linux
```

---

### Auto-Update Configuration

Add auto-update support:

1. **Setup Update Server**
   - Use GitHub Releases
   - Or setup custom update server

2. **Configure in builder.config.cjs**
```javascript
publish: {
    provider: 'github',
    owner: 'VeilVulp',
    repo: 'Rscscan'
}
```

3. **Implement in Code**
```javascript
// electron/main.cjs
const { autoUpdater } = require('electron-updater');

autoUpdater.checkForUpdatesAndNotify();
```

---

### Code Signing

#### Windows
```bash
# Set certificate
export CSC_LINK="path/to/certificate.pfx"
export CSC_KEY_PASSWORD="password"

# Build with signing
npm run electron:build:win
```

#### macOS
```bash
# Set certificate
export CSC_LINK="path/to/certificate.p12"
export CSC_KEY_PASSWORD="password"

# Build with signing and notarization
npm run electron:build:mac
```

---

### Optimization Tips

#### 1. Reduce Bundle Size
```bash
# Analyze bundle
npm run build -- --analyze

# Remove unused dependencies
npm prune --production
```

#### 2. Enable Compression
```javascript
// electron/builder.config.cjs
compression: 'maximum'
```

#### 3. Use ASAR Archive
```javascript
// electron/builder.config.cjs
asar: true
```

---

## Build Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (web mode) |
| `npm run build` | Build React app only |
| `npm run electron:dev` | Start Electron in development mode |
| `npm run electron:build` | Build for current platform |
| `npm run electron:build:win` | Build for Windows |
| `npm run electron:build:mac` | Build for macOS |
| `npm run electron:build:linux` | Build for Linux |

---

## Support

If you encounter build issues:

1. Check [Troubleshooting](#troubleshooting) section
2. Search [GitHub Issues](https://github.com/VeilVulp/Rscscan/issues)
3. Create a new issue with:
   - Your OS and version
   - Node.js and npm versions
   - Full error message
   - Build command used

---

<div align="center">

**Happy Building!** 🚀

[⬆ Back to Top](#build-guide---rscscan)

</div>
