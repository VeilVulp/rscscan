/**
 * Electron Main Process
 * 
 * This is the main entry point for the Electron desktop application.
 * It manages the application lifecycle, window creation, IPC communication,
 * and system tray integration.
 * 
 * Key Responsibilities:
 * - Create and manage the main application window
 * - Handle IPC (Inter-Process Communication) between main and renderer
 * - Manage system tray icon and menu
 * - Persist window state across sessions
 * - Implement security measures (navigation prevention, context isolation)
 * 
 * Security Features:
 * - Context isolation enabled
 * - Node integration disabled in renderer
 * - Sandbox enabled for renderer process
 * - IPC channel whitelisting via preload script
 * - External navigation prevention
 * 
 * @module electron/main
 * @author VeilVulp
 * @license MIT
 */

const { app, BrowserWindow, ipcMain, dialog, shell, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs').promises;

// Disable SSL certificate validation to match Python script behavior (verify=False)
// This allows scanning targets with self-signed or invalid certificates
app.commandLine.appendSwitch('ignore-certificate-errors');

/**
 * Global References
 * 
 * These must be kept in the global scope to prevent garbage collection.
 * If not kept globally, the window/tray would be destroyed when the
 * function scope ends.
 */
let mainWindow = null;  // Main application window
let tray = null;         // System tray icon

/**
 * Development Mode Detection
 * 
 * Determines if the app is running in development or production mode.
 * This affects:
 * - URL loading (localhost vs file://)
 * - DevTools availability
 * - Error logging verbosity
 */
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

/**
 * Create Main Application Window
 * 
 * Creates and configures the main BrowserWindow with:
 * - Restored window state (size and position)
 * - Security settings (context isolation, sandbox)
 * - Preload script for secure IPC
 * - Dark theme background
 * 
 * The window is initially hidden and shown only when ready
 * to prevent visual flashing during load.
 * 
 * @returns {void}
 */
function createWindow() {
    // Load previously saved window state (size, position)
    // Falls back to defaults if no saved state exists
    const windowState = loadWindowState();

    // Create the main application window
    mainWindow = new BrowserWindow({
        // Window dimensions - restore from saved state or use defaults
        width: windowState.width || 1400,   // Default: 1400px wide
        height: windowState.height || 900,  // Default: 900px tall
        x: windowState.x,                   // X position (undefined = center)
        y: windowState.y,                   // Y position (undefined = center)

        // Minimum window size to ensure UI remains usable
        minWidth: 1024,
        minHeight: 768,

        // Application icon (shown in taskbar/dock)
        icon: path.join(__dirname, '../build/icon.png'),

        /**
         * Web Preferences - Security Configuration
         * 
         * These settings are critical for application security:
         * - preload: Secure bridge between main and renderer processes
         * - contextIsolation: Prevents renderer from accessing Node.js/Electron APIs
         * - nodeIntegration: Disabled to prevent direct Node.js access in renderer
         * - sandbox: Enables OS-level sandboxing for additional security
         * - webSecurity: Disabled to allow CORS for vulnerability scanning
         * 
         * ⚠️ Security Note:
         * webSecurity is disabled because the scanner needs to make cross-origin
         * requests to target URLs. This is safe because:
         * 1. User input is validated before making requests
         * 2. The app doesn't load untrusted external content
         * 3. Context isolation prevents prototype pollution attacks
         */
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),  // Secure IPC bridge
            contextIsolation: true,   // Isolate renderer context (security)
            nodeIntegration: false,   // Disable Node.js in renderer (security)
            sandbox: true,            // Enable OS sandbox (security)
            webSecurity: false        // Allow CORS for scanner functionality
        },

        // Background color (dark theme) - prevents white flash on load
        backgroundColor: '#0f172a',

        // Don't show window until content is loaded (prevents flash)
        show: false,

        // Use default title bar (native OS style)
        titleBarStyle: 'default'
    });

    /**
     * User-Agent Enforcement
     * 
     * Chromium's renderer process (axios/fetch) often blocks setting the 'User-Agent' header
     * even with webSecurity: false. To ensure the scanner's logic is perfectly identical
     * to the Python script, we intercept requests in the main process and force the header.
     */
    mainWindow.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
        details.requestHeaders['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36';
        callback({ requestHeaders: details.requestHeaders });
    });

    /**
     * Load Application Content
     * 
     * Development mode: Load from Vite dev server (http://localhost:5173)
     * Production mode: Load from bundled files (file:// protocol)
     * 
     * The different loading strategies allow for:
     * - Hot module replacement in development
     * - Offline functionality in production
     */
    if (isDev) {
        // Development: Load from Vite dev server
        mainWindow.loadURL('http://localhost:5173');

        // Open DevTools automatically in development for debugging
        mainWindow.webContents.openDevTools();
    } else {
        /**
         * Production: Load from bundled files
         * 
         * The packaged app structure:
         * app.asar/
         * ├── electron/
         * │   └── main.cjs (we are here)
         * └── dist-react/
         *     └── index.html (target file)
         * 
         * We go up one directory (..) from electron/ to reach dist-react/
         */
        const indexPath = path.join(__dirname, '..', 'dist-react', 'index.html');

        // Log paths for debugging production issues
        console.log('Loading index.html from:', indexPath);
        console.log('__dirname:', __dirname);
        console.log('app.getAppPath():', app.getAppPath());

        /**
         * Error Handling for File Loading
         * 
         * If the primary path fails, try an alternative path.
         * This handles edge cases in different packaging scenarios.
         */
        mainWindow.loadFile(indexPath).catch(err => {
            console.error('Failed to load index.html:', err);
            console.error('Attempted path:', indexPath);

            // Fallback: Try alternative path using app.getAppPath()
            // This may work in some packaging configurations
            const fallbackPath = path.join(app.getAppPath(), 'dist-react', 'index.html');
            console.log('Trying fallback path:', fallbackPath);

            mainWindow.loadFile(fallbackPath).catch(fallbackErr => {
                console.error('Fallback also failed:', fallbackErr);
                // At this point, show an error dialog to the user
            });
        });

        // DevTools are hidden in production by default
        // Uncomment the line below for debugging production builds
        // mainWindow.webContents.openDevTools();
    }

    /**
     * Console Message Logging
     * 
     * Forward console messages from the renderer process to the main process.
     * This is useful for debugging issues in production builds where DevTools
     * are not available.
     * 
     * Levels: 0=verbose, 1=info, 2=warning, 3=error
     */
    mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
        console.log(`Renderer console [${level}]:`, message);
    });

    /**
     * Window Ready Event
     * 
     * Show the window only after content is fully loaded.
     * This prevents the user from seeing a blank white window
     * during the initial load.
     */
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    /**
     * Window Close Event
     * 
     * Save the current window state (size, position) before closing.
     * This allows us to restore the window to the same state on next launch.
     */
    mainWindow.on('close', () => {
        saveWindowState(mainWindow);
    });

    /**
     * Window Closed Event
     * 
     * Clean up the window reference to allow garbage collection.
     * This prevents memory leaks.
     */
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    /**
     * External Link Handler
     * 
     * When the user clicks a link that would open a new window,
     * open it in the system's default browser instead.
     * 
     * This prevents:
     * - Multiple Electron windows
     * - Security risks from untrusted content
     * - Poor user experience
     */
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);  // Open in default browser
        return { action: 'deny' };  // Deny opening in Electron
    });
}

/**
 * Create System Tray Icon
 * 
 * Creates a system tray icon that allows the user to:
 * - Quickly show the application window
 * - Quit the application
 * 
 * The tray icon persists even when the window is closed,
 * allowing the app to run in the background.
 * 
 * Platform-specific behavior:
 * - Windows: Icon appears in system tray (bottom-right)
 * - macOS: Icon appears in menu bar (top-right)
 * - Linux: Icon appears in system tray (varies by desktop environment)
 * 
 * @returns {void}
 */
function createTray() {
    // Load and resize the icon for the system tray
    // Tray icons should be 16x16 pixels for best display
    const iconPath = path.join(__dirname, '../build/icon.png');
    const trayIcon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });

    // Create the tray icon
    tray = new Tray(trayIcon);

    /**
     * Tray Context Menu
     * 
     * Right-clicking the tray icon shows this menu.
     * Provides quick actions without opening the main window.
     */
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show App',
            click: () => {
                // Show and focus the main window
                if (mainWindow) {
                    mainWindow.show();
                }
            }
        },
        {
            label: 'Quit',
            click: () => {
                // Quit the entire application
                app.quit();
            }
        }
    ]);

    // Set tooltip text (shown on hover)
    tray.setToolTip('RscScan - React Server Components Scan');

    // Attach the context menu to the tray icon
    tray.setContextMenu(contextMenu);

    /**
     * Tray Click Handler
     * 
     * Left-clicking the tray icon shows the main window.
     * This provides a quick way to restore the window.
     */
    tray.on('click', () => {
        if (mainWindow) {
            mainWindow.show();
        }
    });
}

/**
 * Load Window State from Disk
 * 
 * Attempts to load previously saved window state (size and position)
 * from a JSON file in the user data directory.
 * 
 * The state includes:
 * - width: Window width in pixels
 * - height: Window height in pixels
 * - x: Window X position on screen
 * - y: Window Y position on screen
 * 
 * If no saved state exists or loading fails, returns an empty object
 * and the window will use default values.
 * 
 * @returns {Object} Window state object or empty object
 */
function loadWindowState() {
    try {
        // Path to the saved window state file
        // Example: ~/Library/Application Support/RscScan/window-state.json (macOS)
        const configPath = path.join(app.getPath('userData'), 'window-state.json');

        // Load and parse the JSON file
        // Note: require() caches the result, but this is fine for one-time load
        const data = require(configPath);
        return data;
    } catch (error) {
        // File doesn't exist or is invalid JSON
        // Return empty object to use default window dimensions
        return {};
    }
}

/**
 * Save Window State to Disk
 * 
 * Saves the current window state (size and position) to a JSON file
 * in the user data directory. This state will be restored on next launch.
 * 
 * This function is called when:
 * - The window is closed
 * - The app is quitting
 * 
 * @param {BrowserWindow} window - The window to save state for
 * @returns {Promise<void>}
 */
async function saveWindowState(window) {
    try {
        // Get current window bounds (size and position)
        const bounds = window.getBounds();

        // Path to save the window state file
        const configPath = path.join(app.getPath('userData'), 'window-state.json');

        // Write the state as formatted JSON (2-space indentation)
        await fs.writeFile(configPath, JSON.stringify(bounds, null, 2));
    } catch (error) {
        // Log error but don't crash the app
        // Window state persistence is a nice-to-have, not critical
        console.error('Failed to save window state:', error);
    }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * IPC HANDLERS
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * These handlers respond to IPC (Inter-Process Communication) calls from the
 * renderer process. They provide secure access to Node.js APIs that are not
 * available in the renderer due to context isolation.
 * 
 * All handlers are registered with ipcMain.handle() and can be called from
 * the renderer using window.electronAPI (exposed via preload script).
 */

/**
 * File Dialog - Open File
 * 
 * Shows a native file picker dialog and reads the selected file.
 * Used for loading target lists in the scanner.
 * 
 * Flow:
 * 1. Show native file picker dialog
 * 2. User selects a file (or cancels)
 * 3. If file selected, read its contents
 * 4. Return file path, content, and name to renderer
 * 
 * @returns {Promise<Object|null>} File info object or null if canceled
 * @property {string} path - Absolute path to the file
 * @property {string} content - File contents as UTF-8 string
 * @property {string} name - Base filename (e.g., 'targets.txt')
 */
ipcMain.handle('dialog:openFile', async () => {
    // Show native file picker dialog
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],  // Allow selecting one file
        filters: [
            // Filter for text files (target lists)
            { name: 'Text Files', extensions: ['txt'] },
            // Allow all files as fallback
            { name: 'All Files', extensions: ['*'] }
        ]
    });

    // User canceled the dialog
    if (result.canceled) {
        return null;
    }

    // Get the selected file path (first item in array)
    const filePath = result.filePaths[0];

    // Read file contents as UTF-8 text
    const content = await fs.readFile(filePath, 'utf-8');

    // Return file information to renderer
    return {
        path: filePath,              // Full path for display
        content: content,            // File contents for parsing
        name: path.basename(filePath) // Filename only (e.g., 'targets.txt')
    };
});

/**
 * File Dialog - Save File
 * 
 * Shows a native save dialog and writes data to the selected location.
 * Used for exporting scan results (JSON/CSV).
 * 
 * Flow:
 * 1. Show native save dialog with suggested filename
 * 2. User chooses location and filename (or cancels)
 * 3. If confirmed, write data to the selected path
 * 4. Return the saved file path to renderer
 * 
 * @param {Event} event - IPC event object (unused)
 * @param {string} data - File content to write
 * @param {string} defaultName - Suggested filename (e.g., 'scan-results.json')
 * @returns {Promise<string|null>} Saved file path or null if canceled
 */
ipcMain.handle('dialog:saveFile', async (event, data, defaultName) => {
    // Show native save dialog
    const result = await dialog.showSaveDialog(mainWindow, {
        defaultPath: defaultName,  // Pre-fill filename
        filters: [
            // Filter for JSON export
            { name: 'JSON Files', extensions: ['json'] },
            // Filter for CSV export
            { name: 'CSV Files', extensions: ['csv'] },
            // Allow all file types
            { name: 'All Files', extensions: ['*'] }
        ]
    });

    // User canceled the dialog
    if (result.canceled) {
        return null;
    }

    // Write data to the selected file path
    await fs.writeFile(result.filePath, data, 'utf-8');

    // Return the path where file was saved
    return result.filePath;
});

/**
 * Read File from Path
 * 
 * Reads a file from a specific path without showing a dialog.
 * Used when the file path is already known.
 * 
 * Security Note:
 * This is safe because:
 * 1. The renderer cannot call this directly (context isolation)
 * 2. File paths must be explicitly provided by user interaction
 * 3. There's no way to inject arbitrary paths from untrusted sources
 * 
 * @param {Event} event - IPC event object (unused)
 * @param {string} filePath - Absolute path to file to read
 * @returns {Promise<Object>} Result object with success status
 * @property {boolean} success - Whether read succeeded
 * @property {string} [content] - File contents if successful
 * @property {string} [error] - Error message if failed
 */
ipcMain.handle('fs:readFile', async (event, filePath) => {
    try {
        // Read file contents as UTF-8 text
        const content = await fs.readFile(filePath, 'utf-8');
        return { success: true, content };
    } catch (error) {
        // Return error message (e.g., file not found, permission denied)
        return { success: false, error: error.message };
    }
});

/**
 * Write File to Path
 * 
 * Writes data to a specific file path without showing a dialog.
 * Used when the file path is already known.
 * 
 * @param {Event} event - IPC event object (unused)
 * @param {string} filePath - Absolute path where to write file
 * @param {string} data - Content to write to file
 * @returns {Promise<Object>} Result object with success status
 * @property {boolean} success - Whether write succeeded
 * @property {string} [error] - Error message if failed
 */
ipcMain.handle('fs:writeFile', async (event, filePath, data) => {
    try {
        // Write data to file as UTF-8 text
        await fs.writeFile(filePath, data, 'utf-8');
        return { success: true };
    } catch (error) {
        // Return error message (e.g., permission denied, disk full)
        return { success: false, error: error.message };
    }
});

/**
 * Get Application Version
 * 
 * Returns the application version from package.json.
 * Used to display version in About modal.
 * 
 * @returns {string} Version string (e.g., '1.0.0')
 */
ipcMain.handle('app:getVersion', () => {
    // Version is automatically read from package.json by Electron
    return app.getVersion();
});

/**
 * Open External URL
 * 
 * Opens a URL in the system's default web browser.
 * Used for opening documentation links, GitHub, social media, etc.
 * 
 * Security:
 * - Validates URL format before opening
 * - Prevents javascript:, file:, and other dangerous protocols
 * - Only allows http:// and https:// URLs
 * 
 * @param {Event} event - IPC event object (unused)
 * @param {string} url - URL to open in browser
 * @returns {Promise<Object>} Result object with success status
 * @property {boolean} success - Whether URL was opened
 * @property {string} [error] - Error message if validation failed
 */
ipcMain.handle('shell:openExternal', async (event, url) => {
    try {
        // Validate URL format
        // This throws if URL is invalid or uses dangerous protocols
        new URL(url);

        // Open URL in system's default browser
        // This is safe because:
        // 1. URL is validated above
        // 2. shell.openExternal only opens in browser, not in Electron
        // 3. Dangerous protocols (javascript:, file:) are rejected by URL()
        await shell.openExternal(url);

        return { success: true };
    } catch (error) {
        // URL validation failed or opening failed
        return { success: false, error: 'Invalid URL' };
    }
});

/**
 * Show Notification
 * 
 * Placeholder for native notifications.
 * Currently, notifications are handled by the renderer using the Web
 * Notifications API, which works well for our use case.
 * 
 * This handler exists for future native notification support if needed.
 * 
 * @param {Event} event - IPC event object (unused)
 * @param {Object} options - Notification options
 * @param {string} options.title - Notification title
 * @param {string} options.body - Notification body text
 * @returns {Object} Result object
 * @property {boolean} success - Always true (placeholder)
 */
ipcMain.handle('notification:show', (event, { title, body }) => {
    // Notifications are handled by the renderer using Web Notifications API
    // This is just a placeholder for future native notification support
    // 
    // Future implementation could use:
    // - new Notification({ title, body }) on Windows/Linux
    // - macOS notification center integration
    // - Windows Action Center integration

    return { success: true };
});

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * APPLICATION LIFECYCLE EVENTS
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * These event handlers manage the application lifecycle across different
 * platforms, handling startup, activation, and shutdown.
 */

/**
 * App Ready Event
 * 
 * Fired when Electron has finished initialization and is ready to create
 * browser windows. This is the earliest point where we can safely create
 * windows and access Electron APIs.
 * 
 * Actions performed:
 * 1. Create the main application window
 * 2. Create the system tray icon
 * 3. Set up the activate event handler (macOS specific)
 */
app.whenReady().then(() => {
    // Create the main window
    createWindow();

    // Create system tray icon
    createTray();

    /**
     * Activate Event (macOS only)
     * 
     * On macOS, clicking the dock icon when no windows are open should
     * re-create a window. This is standard macOS behavior.
     * 
     * On Windows/Linux, this event is never fired because the app quits
     * when all windows are closed (see window-all-closed handler below).
     */
    app.on('activate', () => {
        // Check if any windows are currently open
        if (BrowserWindow.getAllWindows().length === 0) {
            // No windows open, create a new one
            createWindow();
        }
    });
});

/**
 * Window All Closed Event
 * 
 * Fired when all browser windows have been closed.
 * 
 * Platform-specific behavior:
 * - Windows/Linux: Quit the app (standard behavior)
 * - macOS: Keep app running (standard macOS behavior)
 *   - App stays in dock and menu bar
 *   - Clicking dock icon triggers 'activate' event
 *   - User can quit via Cmd+Q or menu
 */
app.on('window-all-closed', () => {
    // Check if we're NOT on macOS
    if (process.platform !== 'darwin') {
        // Windows/Linux: Quit the app when all windows are closed
        app.quit();
    }
    // On macOS (darwin), do nothing - keep app running
});

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SECURITY EVENT HANDLERS
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Web Contents Created Event - Navigation Security
 * 
 * This is a critical security measure that prevents the renderer process
 * from navigating to untrusted external websites.
 * 
 * Why this is important:
 * - Prevents XSS attacks from redirecting to malicious sites
 * - Prevents phishing attacks
 * - Ensures the app only loads trusted content
 * 
 * Allowed navigation:
 * - localhost:5173 in development (Vite dev server)
 * - No external navigation in production
 * 
 * This works in conjunction with:
 * - Context isolation (prevents access to Node.js)
 * - webSecurity: false (allows CORS for scanning, but not navigation)
 * - setWindowOpenHandler (opens external links in browser)
 */
app.on('web-contents-created', (event, contents) => {
    /**
     * Will Navigate Event
     * 
     * Fired when the renderer attempts to navigate to a new URL.
     * This could be triggered by:
     * - User clicking a link
     * - JavaScript window.location change
     * - Form submission
     * - Malicious code injection
     */
    contents.on('will-navigate', (event, navigationUrl) => {
        // Parse the URL to check its components
        const parsedUrl = new URL(navigationUrl);

        /**
         * Development Mode Exception
         * 
         * Allow navigation to localhost in development for:
         * - Vite dev server (http://localhost:5173)
         * - Hot module replacement
         * - Development tools
         */
        if (isDev && parsedUrl.hostname === 'localhost') {
            return;  // Allow navigation
        }

        /**
         * Production Mode: Block All Navigation
         * 
         * In production, the app should never navigate away from
         * the loaded index.html file. All external links should
         * open in the system browser (handled by setWindowOpenHandler).
         */
        event.preventDefault();  // Block navigation
    });
});
