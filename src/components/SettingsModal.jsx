import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { X, Settings as SettingsIcon, Save } from 'lucide-react'
import { toast } from 'react-toastify'

/**
 * SettingsModal Component
 * 
 * Provides application settings interface with persistence.
 * Settings are managed via parent component (App) using useSettings hook.
 * 
 * @component
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close callback
 * @param {Object} props.settings - Current application settings
 * @param {Function} props.onUpdate - Callback to update global settings
 * @param {Function} props.onReset - Callback to reset global settings
 */
function SettingsModal({ isOpen, onClose, settings: globalSettings, onUpdate, onReset }) {
    const { t } = useTranslation()
    const [localSettings, setLocalSettings] = useState(globalSettings || {})

    // Sync with global settings when modal opens or settings change
    useEffect(() => {
        if (globalSettings) {
            setLocalSettings(globalSettings)
        }
    }, [globalSettings, isOpen])

    /**
     * Save settings
     */
    const handleSave = () => {
        onUpdate(localSettings)
        toast.success(t('settings.saved'))
        onClose()
    }

    /**
     * Reset to defaults
     */
    const handleReset = () => {
        onReset()
        // onReset will update globalSettings, which triggers the useEffect above
        toast.success(t('settings.reset_success'))
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
            <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-light-border dark:border-dark-border">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent-primary/10">
                            <SettingsIcon className="w-5 h-5 text-accent-primary" />
                        </div>
                        <h2 className="text-xl font-bold text-light-text dark:text-dark-text">
                            {t('settings.title')}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-light-border dark:hover:bg-dark-border transition-colors"
                    >
                        <X className="w-5 h-5 text-light-muted dark:text-dark-muted" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                    <div className="flex flex-col gap-6">
                        {/* Scanner Settings */}
                        <div>
                            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
                                {t('settings.scanner_config')}
                            </h3>

                            {/* Request Timeout */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                                    {t('settings.request_timeout')}: {localSettings.requestTimeout}s
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="60"
                                    value={localSettings.requestTimeout || 10}
                                    onChange={(e) => setLocalSettings({ ...localSettings, requestTimeout: parseInt(e.target.value) })}
                                    className="w-full"
                                />
                                <p className="text-xs text-light-muted dark:text-dark-muted mt-1">
                                    {t('settings.request_timeout_desc')}
                                </p>
                            </div>

                            {/* Max Concurrent Requests */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                                    {t('settings.max_concurrent')}: {localSettings.maxConcurrentRequests}
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="100"
                                    value={localSettings.maxConcurrentRequests || 30}
                                    onChange={(e) => setLocalSettings({ ...localSettings, maxConcurrentRequests: parseInt(e.target.value) })}
                                    className="w-full"
                                />
                                <p className="text-xs text-light-muted dark:text-dark-muted mt-1">
                                    {t('settings.max_concurrent_desc')}
                                </p>
                            </div>
                        </div>

                        {/* Export Settings */}
                        <div>
                            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
                                {t('settings.export_settings')}
                            </h3>

                            {/* Default Export Format */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                                    {t('settings.default_format')}
                                </label>
                                <select
                                    value={localSettings.defaultExportFormat || 'json'}
                                    onChange={(e) => setLocalSettings({ ...localSettings, defaultExportFormat: e.target.value })}
                                    className="input"
                                >
                                    <option value="json">JSON</option>
                                    <option value="csv">CSV</option>
                                </select>
                            </div>

                            {/* Auto Save */}
                            <div className="flex items-center justify-between p-4 rounded-lg bg-light-border/50 dark:bg-dark-border/50">
                                <div>
                                    <p className="text-sm font-medium text-light-text dark:text-dark-text">
                                        {t('settings.auto_save')}
                                    </p>
                                    <p className="text-xs text-light-muted dark:text-dark-muted">
                                        {t('settings.auto_save_desc')}
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={localSettings.autoSave || false}
                                        onChange={(e) => setLocalSettings({ ...localSettings, autoSave: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-light-border dark:bg-dark-border peer-focus:outline-hidden peer-focus:ring-2 peer-focus:ring-accent-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
                                </label>
                            </div>
                        </div>

                        {/* Appearance */}
                        <div>
                            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
                                {t('settings.appearance')}
                            </h3>

                            {/* Theme Preference */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                                    {t('settings.theme_preference')}
                                </label>
                                <select
                                    value={localSettings.themePreference || 'system'}
                                    onChange={(e) => setLocalSettings({ ...localSettings, themePreference: e.target.value })}
                                    className="input"
                                >
                                    <option value="system">{t('settings.theme_system')}</option>
                                    <option value="light">{t('settings.theme_light')}</option>
                                    <option value="dark">{t('settings.theme_dark')}</option>
                                </select>
                            </div>
                        </div>

                        {/* Desktop Settings (Electron only) */}
                        {window.electronAPI && (
                            <div>
                                <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
                                    {t('settings.desktop_settings')}
                                </h3 >

                                {/* Minimize to Tray */}
                                <div className="flex items-center justify-between p-4 rounded-lg bg-light-border/50 dark:bg-dark-border/50">
                                    <div>
                                        <p className="text-sm font-medium text-light-text dark:text-dark-text">
                                            {t('settings.minimize_tray')}
                                        </p>
                                        <p className="text-xs text-light-muted dark:text-dark-muted">
                                            {t('settings.minimize_tray_desc')}
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={localSettings.minimizeToTray || false}
                                            onChange={(e) => setLocalSettings({ ...localSettings, minimizeToTray: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-light-border dark:bg-dark-border peer-focus:outline-hidden peer-focus:ring-2 peer-focus:ring-accent-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-light-border dark:border-dark-border">
                    <button
                        onClick={handleReset}
                        className="btn-secondary"
                    >
                        {t('settings.reset_defaults')}
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="btn-secondary"
                        >
                            {t('settings.cancel')}
                        </button>
                        <button
                            onClick={handleSave}
                            className="btn-primary flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {t('settings.save')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingsModal
