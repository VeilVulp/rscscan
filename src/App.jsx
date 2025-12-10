import { useState, useEffect } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import Header from './components/Header'
import ConfigPanel from './components/ConfigPanel'
import ResultsPanel from './components/ResultsPanel'
import ProgressBar from './components/ProgressBar'
import StatisticsCard from './components/StatisticsCard'
import SettingsModal from './components/SettingsModal'
import AboutModal from './components/AboutModal'
import { useSettings } from './hooks/useSettings'
import { useScanner } from './hooks/useScanner'
import { Radio, PlayCircle } from 'lucide-react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

/**
 * Main Application Component
 * 
 * This is the root component that orchestrates the RscScan.
 * It manages the overall application state, theme, and scanning workflow.
 * 
 * @component
 */
function App() {
    const { settings, updateSettings, resetSettings } = useSettings()
    // We can keep useTheme for system detection logic, OR we can rely on what useSettings gives us.
    // simpler: useTheme is still useful for the toggle logic in header?
    // Actually, useTheme reads from its own localStorage key 'theme'. useSettings uses 'app-settings'.
    // We should migrate to useSettings strictly for theme to avoid conflicts.
    // BUT Header uses toggleTheme.
    // Let's make toggleTheme update useSettings.

    // Let's strip out the conflicting useTheme logic from App.jsx and manually apply theme from settings.
    const { t, i18n } = useTranslation()

    // Derived theme: if 'system', check media query.
    const [effectiveTheme, setEffectiveTheme] = useState('light')

    useEffect(() => {
        const applyTheme = () => {
            let themeToApply = settings.themePreference
            if (themeToApply === 'system') {
                themeToApply = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
            }

            document.documentElement.classList.remove('light', 'dark')
            document.documentElement.classList.add(themeToApply)
            setEffectiveTheme(themeToApply)
        }

        applyTheme()

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handler = () => applyTheme()
        mediaQuery.addEventListener('change', handler)
        return () => mediaQuery.removeEventListener('change', handler)
    }, [settings.themePreference])

    const toggleTheme = () => {
        // Cycle: light -> dark -> system? Or just light <-> dark and set preference to that?
        // Usually toggles override system.
        const newTheme = effectiveTheme === 'light' ? 'dark' : 'light'
        updateSettings({ themePreference: newTheme })
    }

    const {
        isScanning,
        progress,
        results,
        statistics,
        startScan,
        resetScan,
        exportResults
    } = useScanner()

    const [demoMode, setDemoMode] = useState(false)
    const [showSettings, setShowSettings] = useState(false)
    const [showAbout, setShowAbout] = useState(false)

    // Apply language-specific fonts
    useEffect(() => {
        const lang = i18n.language
        const root = document.documentElement

        if (lang === 'fa') {
            root.style.setProperty('--font-sans', 'var(--font-persian)')
        } else if (lang === 'zh' || lang?.startsWith('zh')) {
            root.style.setProperty('--font-sans', 'var(--font-chinese)')
        } else if (lang === 'ru') {
            root.style.setProperty('--font-sans', 'var(--font-russian)')
        } else {
            root.style.removeProperty('--font-sans')
        }

        // Enforce direction and language attribute
        root.dir = i18n.dir(lang)
        root.lang = lang
    }, [i18n, i18n.language])

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e) => {
            // Ctrl+Enter or Cmd+Enter to start scan
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !isScanning) {
                e.preventDefault()
                // Trigger scan from ConfigPanel
            }

            // Ctrl+E or Cmd+E to export
            if ((e.ctrlKey || e.metaKey) && e.key === 'e' && results.length > 0) {
                e.preventDefault()
                // Use default export format from settings
                exportResults(settings.defaultExportFormat || 'json')
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [isScanning, results, exportResults, settings.defaultExportFormat])

    // Wrap startScan to inject settings
    const handleStartScan = (config) => {
        startScan({
            ...config,
            requestTimeout: settings.requestTimeout,
            maxConcurrentRequests: settings.maxConcurrentRequests
        })
    }

    return (
        <div className="min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-300">
            {/* Header */}
            <Header
                theme={effectiveTheme}
                toggleTheme={toggleTheme}
                demoMode={demoMode}
                setDemoMode={setDemoMode}
                onOpenSettings={() => setShowSettings(true)}
                onOpenAbout={() => setShowAbout(true)}
            />
            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Warning Banner */}
                <div className="mb-8 p-6 rounded-lg border-2 border-accent-warning bg-accent-warning/5">
                    <div className="flex items-start gap-4">
                        <div className="shrink-0 text-accent-warning">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-accent-warning mb-2">
                                {t('app.warning.title')}
                            </h3>
                            <p className="text-light-text dark:text-dark-text text-sm leading-relaxed">
                                <Trans i18nKey="app.warning.text">
                                    This tool is designed for <strong>educational and authorized security testing purposes only</strong>.
                                    Unauthorized access to computer systems is illegal. Only use this scanner on systems you own or have
                                    explicit written permission to test. Misuse of this tool may result in criminal prosecution.
                                </Trans>
                            </p>
                            <p className="text-light-muted dark:text-dark-muted text-xs mt-2">
                                {t('app.warning.footer')}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-4"> {/* Added mt-4 for spacing */}
                        <button
                            onClick={() => setDemoMode(false)}
                            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${!demoMode
                                ? 'bg-accent-success text-white shadow-lg'
                                : 'bg-light-border dark:bg-dark-border text-light-muted dark:text-dark-muted hover:bg-light-border/80 dark:hover:bg-dark-border/80'
                                }`}
                        >
                            <Radio className="w-4 h-4" />
                            {t('app.mode.live')}
                        </button>
                        <button
                            onClick={() => setDemoMode(true)}
                            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${demoMode
                                ? 'bg-accent-warning text-white shadow-lg'
                                : 'bg-light-border dark:bg-dark-border text-light-muted dark:text-dark-muted hover:bg-light-border/80 dark:hover:bg-dark-border/80'
                                }`}
                        >
                            <PlayCircle className="w-4 h-4" />
                            {t('app.mode.demo')}
                        </button>
                    </div>
                </div>

                {/* Statistics Cards */}
                {(isScanning || results.length > 0) && (
                    <div className="mb-8">
                        <StatisticsCard statistics={statistics} />
                    </div>
                )}

                {/* Progress Bar */}
                {isScanning && (
                    <div className="mb-8">
                        <ProgressBar progress={progress} />
                    </div>
                )}

                {/* Configuration Panel */}
                <div className="mb-8">
                    <ConfigPanel
                        onStartScan={handleStartScan}
                        onReset={resetScan}
                        isScanning={isScanning}
                        demoMode={demoMode}
                    />
                </div>

                {/* Results Panel */}
                {results.length > 0 && (
                    <ResultsPanel
                        results={results}
                        onExport={exportResults}
                        isScanning={isScanning}
                    />
                )}

                {/* Empty State */}
                {!isScanning && results.length === 0 && (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-light-border dark:bg-dark-border mb-4">
                            <svg className="w-10 h-10 text-light-muted dark:text-dark-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.333 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-2">
                            {t('app.empty_state.title')}
                        </h3>
                        <p className="text-light-muted dark:text-dark-muted max-w-md mx-auto">
                            {t('app.empty_state.description')}
                        </p>
                    </div>
                )}
            </main>

            {/* Modals */}
            <SettingsModal
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                settings={settings}
                onUpdate={updateSettings}
                onReset={resetSettings}
            />
            <AboutModal
                isOpen={showAbout}
                onClose={() => setShowAbout(false)}
            />
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={i18n.dir() === 'rtl'}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={effectiveTheme === 'dark' ? 'dark' : 'light'}
            />
        </div>
    )
}

export default App
