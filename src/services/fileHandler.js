/**
 * File Handler Service
 * 
 * Provides a unified API for file operations that works in both
 * Electron and web environments.
 */

/**
 * Check if running in Electron
 */
export const isElectron = () => {
    return typeof window !== 'undefined' && window.electronAPI && window.electronAPI.isElectron;
};

/**
 * Electron API wrapper with web fallbacks
 */
export const fileHandler = {
    /**
     * Select and read a file
     * @returns {Promise<{path: string, content: string, name: string} | null>}
     */
    selectFile: async () => {
        if (isElectron()) {
            // Use Electron native file picker
            return await window.electronAPI.selectFile();
        } else {
            // Use web File API
            return new Promise((resolve) => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.txt';

                input.onchange = async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) {
                        resolve(null);
                        return;
                    }

                    const content = await file.text();
                    resolve({
                        path: file.name,
                        content: content,
                        name: file.name
                    });
                };

                input.click();
            });
        }
    },

    /**
     * Save file with native dialog
     * @param {string} data - File content
     * @param {string} defaultName - Default filename
     * @returns {Promise<string | null>} - Saved file path or null
     */
    saveFile: async (data, defaultName) => {
        if (isElectron()) {
            // Use Electron native save dialog
            return await window.electronAPI.saveFile(data, defaultName);
        } else {
            // Use web download
            const blob = new Blob([data], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = defaultName;
            link.style.display = 'none';

            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            return defaultName;
        }
    },

    /**
     * Read file from path (Electron only)
     * @param {string} filePath - File path
     * @returns {Promise<{success: boolean, content?: string, error?: string}>}
     */
    readFile: async (filePath) => {
        if (isElectron()) {
            return await window.electronAPI.readFile(filePath);
        } else {
            return {
                success: false,
                error: 'File path reading not supported in web mode'
            };
        }
    },

    /**
     * Write file to path (Electron only)
     * @param {string} filePath - File path
     * @param {string} data - File content
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    writeFile: async (filePath, data) => {
        if (isElectron()) {
            return await window.electronAPI.writeFile(filePath, data);
        } else {
            return {
                success: false,
                error: 'File path writing not supported in web mode'
            };
        }
    },

    /**
     * Show native notification
     * @param {string} title - Notification title
     * @param {string} body - Notification body
     */
    showNotification: async (title, body) => {
        if (isElectron()) {
            await window.electronAPI.showNotification(title, body);
        }

        // Use Web Notifications API (works in both modes)
        if ('Notification' in window) {
            if (Notification.permission === 'granted') {
                new Notification(title, { body });
            } else if (Notification.permission !== 'denied') {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    new Notification(title, { body });
                }
            }
        }
    },

    /**
     * Get application version
     * @returns {Promise<string>}
     */
    getVersion: async () => {
        if (isElectron()) {
            return await window.electronAPI.getVersion();
        } else {
            // Return package.json version or default
            return '1.0.0 (Web)';
        }
    },

    /**
     * Open URL in external browser
     * @param {string} url - URL to open
     */
    openExternal: async (url) => {
        if (isElectron()) {
            await window.electronAPI.openExternal(url);
        } else {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    },

    /**
     * Get platform information
     * @returns {string}
     */
    getPlatform: () => {
        if (isElectron() && window.process) {
            return window.process.platform;
        } else {
            return navigator.platform;
        }
    }
};

export default fileHandler;
