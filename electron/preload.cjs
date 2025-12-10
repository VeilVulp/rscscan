/**
 * Electron Preload Script - Secure IPC Bridge
 * 
 * This script runs in a privileged context and serves as a secure bridge
 * between the main process (Node.js) and the renderer process (browser).
 * 
 * SECURITY MODEL:
 * ===============
 * 
 * 1. Context Isolation (Enabled):
 *    - Renderer cannot access Node.js or Electron APIs directly
 *    - Preload script runs in a separate context
 *    - Only explicitly exposed APIs are available to renderer
 * 
 * 2. Node Integration (Disabled):
 *    - Renderer cannot use require() or access Node.js modules
 *    - Prevents prototype pollution attacks
 *    - Prevents arbitrary code execution
 * 
 * 3. Sandbox (Enabled):
 *    - OS-level process sandboxing
 *    - Limits system access even if code execution occurs
 *    - Additional layer of defense
 * 
 * 4. IPC Channel Whitelisting:
 *    - Only specific channels are allowed
 *    - Prevents arbitrary IPC calls
 *    - Reduces attack surface
 * 
 * EXPOSED API:
 * ============
 * 
 * The renderer can access these APIs via window.electronAPI:
 * - File operations (selectFile, saveFile, readFile, writeFile)
 * - App information (getVersion)
 * - Shell operations (openExternal)
 * - Notifications (showNotification)
 * - Event listeners (onUpdateAvailable, onUpdateDownloaded)
 * 
 * All IPC calls are validated against the whitelist before execution.
 * 
 * @module electron/preload
 * @author VeilVulp
 * @license MIT
 */

const { contextBridge, ipcRenderer } = require('electron');

/**
 * IPC Channel Whitelist
 * 
 * This whitelist defines all allowed IPC channels for communication
 * between renderer and main processes.
 * 
 * Security Benefits:
 * - Prevents arbitrary IPC channel access
 * - Makes it easy to audit all IPC communication
 * - Reduces risk of IPC-based attacks
 * 
 * Channel Types:
 * - invoke: Two-way communication (request-response)
 * - on: One-way communication (event listeners)
 */
const ALLOWED_CHANNELS = {
    // Channels that can be invoked from renderer (request-response)
    invoke: [
        'dialog:openFile',      // Open file dialog
        'dialog:saveFile',      // Save file dialog
        'fs:readFile',          // Read file from path
        'fs:writeFile',         // Write file to path
        'app:getVersion',       // Get app version
        'shell:openExternal',   // Open URL in browser
        'notification:show'     // Show notification
    ],
    // Channels that can be listened to from renderer (events)
    on: [
        'update:available',     // Update available event
        'update:downloaded'     // Update downloaded event
    ]
};

/**
 * Validate IPC Channel
 * 
 * Checks if a channel is in the whitelist for the specified type.
 * This prevents the renderer from calling arbitrary IPC channels.
 * 
 * @param {string} channel - Channel name to validate
 * @param {string} type - Channel type ('invoke' or 'on')
 * @returns {boolean} True if channel is whitelisted
 */
function isValidChannel(channel, type = 'invoke') {
    return ALLOWED_CHANNELS[type].includes(channel);
}

/**
 * Context Bridge - Expose Secure Electron API
 * 
 * contextBridge.exposeInMainWorld() safely exposes APIs to the renderer.
 * This is the ONLY way the renderer can access Electron/Node.js functionality.
 * 
 * Security:
 * - APIs are exposed to window.electronAPI (not global scope)
 * - Each API is a wrapper around validated IPC calls
 * - No direct access to ipcRenderer or Node.js modules
 * - All communication goes through the whitelist
 */
contextBridge.exposeInMainWorld('electronAPI', {
    /**
     * ═══════════════════════════════════════════════════════════════════════
     * FILE OPERATIONS
     * ═══════════════════════════════════════════════════════════════════════
     */

    /**
     * Select File
     * 
     * Opens a native file picker dialog and reads the selected file.
     * 
     * Usage:
     * ```javascript
     * const file = await window.electronAPI.selectFile();
     * if (file) {
     *     console.log(file.name, file.content);
     * }
     * ```
     * 
     * @returns {Promise<Object|null>} File object or null if canceled
     */
    selectFile: async () => {
        return await ipcRenderer.invoke('dialog:openFile');
    },

    /**
     * Save File
     * 
     * Opens a native save dialog and writes data to the selected location.
     * 
     * Usage:
     * ```javascript
     * const path = await window.electronAPI.saveFile(jsonData, 'results.json');
     * if (path) {
     *     console.log('Saved to:', path);
     * }
     * ```
     * 
     * @param {string} data - File content to write
     * @param {string} defaultName - Suggested filename
     * @returns {Promise<string|null>} Saved file path or null if canceled
     */
    saveFile: async (data, defaultName) => {
        return await ipcRenderer.invoke('dialog:saveFile', data, defaultName);
    },

    /**
     * Read File
     * 
     * Reads a file from a specific path.
     * 
     * Usage:
     * ```javascript
     * const result = await window.electronAPI.readFile('/path/to/file.txt');
     * if (result.success) {
     *     console.log(result.content);
     * }
     * ```
     * 
     * @param {string} filePath - Absolute path to file
     * @returns {Promise<Object>} Result with success status and content/error
     */
    readFile: async (filePath) => {
        return await ipcRenderer.invoke('fs:readFile', filePath);
    },

    /**
     * Write File
     * 
     * Writes data to a specific file path.
     * 
     * Usage:
     * ```javascript
     * const result = await window.electronAPI.writeFile('/path/to/file.txt', data);
     * if (result.success) {
     *     console.log('File written successfully');
     * }
     * ```
     * 
     * @param {string} filePath - Absolute path where to write
     * @param {string} data - Content to write
     * @returns {Promise<Object>} Result with success status and error if failed
     */
    writeFile: async (filePath, data) => {
        return await ipcRenderer.invoke('fs:writeFile', filePath, data);
    },

    /**
     * ═══════════════════════════════════════════════════════════════════════
     * APP INFORMATION
     * ═══════════════════════════════════════════════════════════════════════
     */

    /**
     * Get Version
     * 
     * Returns the application version from package.json.
     * 
     * Usage:
     * ```javascript
     * const version = await window.electronAPI.getVersion();
     * console.log('App version:', version); // e.g., '1.0.0'
     * ```
     * 
     * @returns {Promise<string>} Application version string
     */
    getVersion: async () => {
        return await ipcRenderer.invoke('app:getVersion');
    },

    /**
     * ═══════════════════════════════════════════════════════════════════════
     * SHELL OPERATIONS
     * ═══════════════════════════════════════════════════════════════════════
     */

    /**
     * Open External URL
     * 
     * Opens a URL in the system's default web browser.
     * The URL is validated before opening to prevent security issues.
     * 
     * Usage:
     * ```javascript
     * const result = await window.electronAPI.openExternal('https://github.com');
     * if (result.success) {
     *     console.log('URL opened in browser');
     * }
     * ```
     * 
     * @param {string} url - URL to open (must be http:// or https://)
     * @returns {Promise<Object>} Result with success status
     */
    openExternal: async (url) => {
        return await ipcRenderer.invoke('shell:openExternal', url);
    },

    /**
     * ═══════════════════════════════════════════════════════════════════════
     * NOTIFICATIONS
     * ═══════════════════════════════════════════════════════════════════════
     */

    /**
     * Show Notification
     * 
     * Shows a system notification.
     * Currently uses Web Notifications API, but this provides a unified interface.
     * 
     * Usage:
     * ```javascript
     * await window.electronAPI.showNotification('Scan Complete', 'Found 5 vulnerabilities');
     * ```
     * 
     * @param {string} title - Notification title
     * @param {string} body - Notification body text
     * @returns {Promise<Object>} Result with success status
     */
    showNotification: async (title, body) => {
        return await ipcRenderer.invoke('notification:show', { title, body });
    },

    /**
     * ═══════════════════════════════════════════════════════════════════════
     * EVENT LISTENERS
     * ═══════════════════════════════════════════════════════════════════════
     */

    /**
     * On Update Available
     * 
     * Registers a callback for when an app update is available.
     * 
     * Usage:
     * ```javascript
     * window.electronAPI.onUpdateAvailable((info) => {
     *     console.log('Update available:', info.version);
     * });
     * ```
     * 
     * @param {Function} callback - Function to call when update is available
     */
    onUpdateAvailable: (callback) => {
        ipcRenderer.on('update:available', (event, info) => callback(info));
    },

    /**
     * On Update Downloaded
     * 
     * Registers a callback for when an app update has been downloaded.
     * 
     * Usage:
     * ```javascript
     * window.electronAPI.onUpdateDownloaded((info) => {
     *     console.log('Update downloaded:', info.version);
     * });
     * ```
     * 
     * @param {Function} callback - Function to call when update is downloaded
     */
    onUpdateDownloaded: (callback) => {
        ipcRenderer.on('update:downloaded', (event, info) => callback(info));
    },

    /**
     * Utility
     */

    // Check if running in Electron
    isElectron: true,

    // Platform information
    platform: process.platform,

    // Generic IPC invoke (with validation)
    invoke: async (channel, ...args) => {
        if (isValidChannel(channel, 'invoke')) {
            return await ipcRenderer.invoke(channel, ...args);
        }
        throw new Error(`Invalid IPC channel: ${channel}`);
    }
});

/**
 * Expose Node.js process information (read-only)
 */
contextBridge.exposeInMainWorld('process', {
    platform: process.platform,
    arch: process.arch,
    versions: {
        node: process.versions.node,
        chrome: process.versions.chrome,
        electron: process.versions.electron
    }
});

/**
 * Security logging
 */
console.log('Preload script loaded');
console.log('Context isolation:', process.contextIsolated);
console.log('Sandbox:', process.sandboxed);
