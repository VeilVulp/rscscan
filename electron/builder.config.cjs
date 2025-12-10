/**
 * Electron Builder Configuration
 * 
 * Configuration for building and packaging the application
 * for Windows, macOS, and Linux platforms.
 * 
 * Key Settings:
 * - appId: Unique application identifier
 * - productName: Display name of the application
 * - executableName: Name of the executable file
 * - directories.output: Where built files are placed (release/)
 * - files: Which source files to include in the package
 * 
 * Platform-Specific:
 * - win: Windows NSIS installer and portable executable
 * - mac: macOS DMG and ZIP archives
 * - linux: AppImage, DEB, and RPM packages
 * 
 * @see https://www.electron.build/configuration/configuration
 */

module.exports = {
    // Application Identification
    appId: 'com.veilvulp.rscscan',
    productName: 'RscScan',
    executableName: 'RscScan',  // Explicit executable name for consistency
    copyright: 'Copyright © 2025 VeilVulp',

    /**
     * Directories Configuration
     * 
     * output: Where Electron Builder places the final packages
     * buildResources: Where to find icons and other build assets
     */
    directories: {
        output: 'release/${os}',      // ✅ FIXED: Separates builds into os specific folders (e.g. release/win, release/mac)
        buildResources: 'build'
    },

    /**
     * Files to Include in Package
     * 
     * The packaged app will include:
     * - dist-react/: Built React application (from Vite)
     * - electron/: Main and preload scripts
     * - package.json: App metadata
     * 
     * Excluded:
     * - Source maps (*.map)
     * - TypeScript definitions (*.d.ts)
     * - Markdown files (*.md)
     */
    files: [
        'dist-react/**/*',  // Vite build output
        'electron/**/*',    // Electron main process files
        'package.json',     // Package metadata
        '!**/*.map',        // Exclude source maps
        '!**/*.d.ts',       // Exclude TypeScript definitions
        '!*.md'             // Exclude markdown files
    ],

    /**
     * Extra Files
     * 
     * Additional files to copy into the package.
     * These are placed outside the asar archive for accessibility.
     */
    extraFiles: [
        {
            from: 'build/icon.png',
            to: 'build/icon.png'
        }
    ],

    /**
     * ═══════════════════════════════════════════════════════════════════════
     * WINDOWS CONFIGURATION
     * ═══════════════════════════════════════════════════════════════════════
     */
    win: {
        target: [
            {
                target: 'nsis',     // NSIS installer (recommended)
                arch: ['x64', 'ia32']       // 64-bit and 32-bit
            },
            {
                target: 'portable', // Portable executable (No installation required)
                arch: ['x64', 'ia32']
            }
        ],
        icon: 'build/icon.png',  // Application icon
        artifactName: '${productName}-Setup-${version}-${arch}.${ext}'  // Installer naming with arch
    },

    /**
     * Portable Configuration
     * 
     * Settings for the portable executable version.
     * This creates a standalone .exe that runs without installation.
     */
    portable: {
        artifactName: '${productName}-Portable-${version}-${arch}.${ext}',
        requestExecutionLevel: 'user' // Run as standard user (no admin rights needed)
    },

    /**
     * NSIS Installer Configuration (Windows)
     * 
     * Creates a professional Windows installer with:
     * - Custom installation directory option
     * - Desktop and Start Menu shortcuts
     * - Automatic launch after installation
     * - Proper uninstaller
     * 
     * Note: Icon configuration removed due to format incompatibility.
     * NSIS requires .ico files, but we only have .png
     * The default Electron icon will be used instead.
     */
    nsis: {
        oneClick: false,                            // Allow custom install location
        allowToChangeInstallationDirectory: true,   // User can choose directory
        allowElevation: true,                       // Allow admin elevation if needed
        createDesktopShortcut: true,                // Create desktop shortcut
        createStartMenuShortcut: true,              // Create Start Menu shortcut
        shortcutName: 'RscScan',                    // Shortcut display name
        runAfterFinish: true,                       // Launch app after install
        perMachine: false,                          // Per-user installation
        deleteAppDataOnUninstall: false             // Keep user data on uninstall
    },

    /**
     * ═══════════════════════════════════════════════════════════════════════
     * MACOS CONFIGURATION
     * ═══════════════════════════════════════════════════════════════════════
     */
    mac: {
        target: [
            {
                target: 'dmg',              // DMG disk image (recommended)
                arch: ['x64', 'arm64']      // Intel and Apple Silicon
            }
        ],
        icon: 'build/icon.png',             // Application icon
        category: 'public.app-category.developer-tools',
        artifactName: '${productName}-${version}-${arch}.${ext}',
        hardenedRuntime: process.env.CSC_IDENTITY_AUTO_DISCOVERY !== 'false',
        gatekeeperAssess: false,            // Skip Gatekeeper assessment
        entitlements: process.env.CSC_IDENTITY_AUTO_DISCOVERY !== 'false' ? 'build/entitlements.mac.plist' : undefined,
        entitlementsInherit: process.env.CSC_IDENTITY_AUTO_DISCOVERY !== 'false' ? 'build/entitlements.mac.plist' : undefined
    },

    /**
     * DMG Configuration (macOS)
     * 
     * Configures the DMG disk image appearance:
     * - Window size and icon positions
     * - Applications folder link
     */
    dmg: {
        contents: [
            {
                x: 130,
                y: 220
            },
            {
                x: 410,
                y: 220,
                type: 'link',
                path: '/Applications'
            }
        ],
        window: {
            width: 540,
            height: 380
        }
    },

    /**
     * ═══════════════════════════════════════════════════════════════════════
     * LINUX CONFIGURATION
     * ═══════════════════════════════════════════════════════════════════════
     */
    linux: {
        target: [
            {
                target: 'AppImage',     // Universal Linux package
                arch: ['x64']
            },
            {
                target: 'deb',          // Debian/Ubuntu package
                arch: ['x64']
            }
        ],
        icon: 'build/icon.png',
        category: 'Development',
        artifactName: '${productName}-${version}-${arch}.${ext}',
        synopsis: 'Educational CVE-2025-55182 vulnerability scanner',
        description: 'Desktop application for scanning Next.js applications for CVE-2025-55182 vulnerabilities. For educational and authorized security testing purposes only.'
    },

    /**
     * Debian Package Configuration
     * 
     * System dependencies required for the app to run on Debian/Ubuntu.
     */
    deb: {
        depends: [
            'gconf2',
            'gconf-service',
            'libnotify4',
            'libappindicator1',
            'libxtst6',
            'libnss3'
        ]
    },

    /**
     * ═══════════════════════════════════════════════════════════════════════
     * GENERAL BUILD SETTINGS
     * ═══════════════════════════════════════════════════════════════════════
     */

    /**
     * Compression Level
     * 
     * 'maximum' provides smallest file size but slower build.
     * Options: 'store' | 'normal' | 'maximum'
     */
    compression: 'maximum',

    /**
     * ASAR Archive
     * 
     * Package app files into a single archive for:
     * - Faster loading
     * - Basic obfuscation
     * - Smaller file count
     */
    asar: true,

    /**
     * Build Version
     * 
     * Version number for the build.
     * Should match package.json version.
     */
    buildVersion: '1.0.0'
};
