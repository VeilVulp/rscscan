import { useState, useEffect } from 'react'

/**
 * useElectron Hook
 * 
 * Detects if the application is running in Electron desktop mode
 * and provides access to Electron-specific APIs and platform information.
 * 
 * This hook enables dual-mode support:
 * - Electron mode: Full native features (file dialogs, system tray, etc.)
 * - Web mode: Graceful degradation with browser APIs
 * 
 * Features:
 * - Automatic Electron detection
 * - Platform identification (Windows, macOS, Linux)
 * - Safe access to Electron API
 * - No errors in web mode
 * 
 * Usage:
 * ```javascript
 * const { isElectron, api, platform, isMac } = useElectron();
 * 
 * if (isElectron) {
 *     // Use native file picker
 *     const file = await api.selectFile();
 * } else {
 *     // Use web file input
 *     // ...
 * }
 * ```
 * 
 * @module hooks/useElectron
 * @returns {Object} Electron state and platform information
 * @property {boolean} isElectron - True if running in Electron
 * @property {Object|null} api - Electron API or null in web mode
 * @property {string} platform - Platform identifier
 * @property {boolean} isMac - True if running on macOS
 * @property {boolean} isWindows - True if running on Windows
 * @property {boolean} isLinux - True if running on Linux
 */
export function useElectron() {
    // State for Electron detection
    const [isElectron, setIsElectron] = useState(false)

    // State for platform information
    const [platform, setPlatform] = useState('unknown')

    /**
     * Detect Electron Environment
     * 
     * This effect runs once on component mount to detect if we're
     * running in Electron and gather platform information.
     * 
     * Detection Strategy:
     * 1. Check if window object exists (SSR safety)
     * 2. Check if window.electronAPI exists (exposed by preload script)
     * 3. Check if window.electronAPI.isElectron is true
     * 
     * Platform Detection:
     * - Electron: Use window.process.platform (Node.js platform)
     * - Web: Use navigator.platform (browser platform)
     */
    useEffect(() => {
        /**
         * Electron Detection
         * 
         * The electronAPI is exposed by the preload script via contextBridge.
         * It's only available in Electron, not in web browsers.
         */
        const electronDetected = typeof window !== 'undefined' &&
            window.electronAPI &&
            window.electronAPI.isElectron

        // Update Electron detection state
        setIsElectron(!!electronDetected)

        /**
         * Platform Detection
         * 
         * Get platform information for platform-specific features:
         * - darwin: macOS
         * - win32: Windows
         * - linux: Linux
         * 
         * In Electron: Use Node.js process.platform (more accurate)
         * In Web: Use navigator.platform (browser-provided)
         */
        if (electronDetected && window.process) {
            // Electron mode - use Node.js platform
            setPlatform(window.process.platform)
        } else if (typeof navigator !== 'undefined') {
            // Web mode - use browser platform
            setPlatform(navigator.platform)
        }
    }, []) // Empty deps - only run once on mount

    /**
     * Return Electron State and Platform Information
     * 
     * Provides comprehensive information about the runtime environment:
     * 
     * isElectron: Boolean indicating if running in Electron
     * api: Access to Electron API (null in web mode)
     * platform: Platform string (darwin/win32/linux/etc.)
     * isMac: Convenience boolean for macOS
     * isWindows: Convenience boolean for Windows
     * isLinux: Convenience boolean for Linux
     * 
     * Usage Examples:
     * 
     * // Feature detection
     * if (isElectron) {
     *     // Use native features
     * }
     * 
     * // Platform-specific UI
     * if (isMac) {
     *     // Show Cmd+Q hint
     * } else if (isWindows) {
     *     // Show Alt+F4 hint
     * }
     * 
     * // Safe API access
     * if (api) {
     *     const version = await api.getVersion();
     * }
     */
    return {
        isElectron,                                    // Boolean: Running in Electron?
        api: isElectron ? window.electronAPI : null,   // Electron API or null
        platform,                                      // Platform string
        isMac: platform === 'darwin',                  // macOS check
        isWindows: platform === 'win32',               // Windows check
        isLinux: platform === 'linux'                  // Linux check
    }
}

export default useElectron
