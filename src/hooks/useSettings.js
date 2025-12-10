import { useState, useCallback } from 'react'

const DEFAULT_SETTINGS = {
    requestTimeout: 10,
    maxConcurrentRequests: 30,
    autoSave: false,
    defaultExportFormat: 'json',
    themePreference: 'system',
    minimizeToTray: false
}

export function useSettings() {
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('app-settings')
        if (saved) {
            try {
                return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
            } catch (e) {
                console.error('Failed to parse settings', e)
                return DEFAULT_SETTINGS
            }
        }
        return DEFAULT_SETTINGS
    })

    const updateSettings = useCallback((newSettings) => {
        setSettings(prev => {
            const updated = { ...prev, ...newSettings }
            localStorage.setItem('app-settings', JSON.stringify(updated))
            return updated
        })
    }, [])

    const resetSettings = useCallback(() => {
        setSettings(DEFAULT_SETTINGS)
        localStorage.setItem('app-settings', JSON.stringify(DEFAULT_SETTINGS))
    }, [])

    return {
        settings,
        updateSettings,
        resetSettings
    }
}
