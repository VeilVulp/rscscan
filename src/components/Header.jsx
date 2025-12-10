import { useTranslation } from 'react-i18next'
import { ShieldAlert, Sun, Moon, Terminal, Settings, Info, Radio, PlayCircle } from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'

/**
 * Header Component
 * 
 * Displays the application title, branding, and theme toggle.
 * Includes demo mode toggle for safe testing without actual scanning.
 * 
 * @component
 * @param {Object} props
 * @param {string} props.theme - Current theme ('light' or 'dark')
 * @param {Function} props.toggleTheme - Function to toggle theme
 * @param {boolean} props.demoMode - Demo mode state
 * @param {Function} props.setDemoMode - Function to toggle demo mode
 */
function Header({ theme, toggleTheme, demoMode, setDemoMode, onOpenSettings, onOpenAbout }) {
    const { t } = useTranslation()

    return (
        <header className="sticky top-0 z-50 border-b border-light-border dark:border-dark-border bg-light-card/80 dark:bg-dark-card/80 backdrop-blur-lg">
            <div className="container mx-auto px-4 py-4 max-w-7xl">
                <div className="flex items-center justify-between">
                    {/* Logo and Title */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent-danger/10">
                            <ShieldAlert className="w-7 h-7 text-accent-danger" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-light-text dark:text-dark-text flex items-center gap-2">
                                {t('app.title')}
                                <span className="px-2 py-0.5 text-xs font-semibold rounded-sm bg-accent-danger/10 text-accent-danger">
                                    {t('header.educational')}
                                </span>
                            </h1>
                            <p className="text-sm text-light-muted dark:text-dark-muted flex items-center gap-1">
                                <Terminal className="w-3 h-3" />
                                {t('app.subtitle')}
                            </p>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-3">
                        {/* Demo Mode Toggle */}
                        <button
                            onClick={() => setDemoMode(!demoMode)}
                            className="p-1 rounded-full transition-colors" // Adjusted button styling to be a container for the styled span
                            title={t('header.demo_toggle')}
                        >
                            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${demoMode
                                ? 'bg-accent-warning/10 text-accent-warning'
                                : 'bg-accent-success/10 text-accent-success'
                                }`}>
                                {demoMode ? <PlayCircle className="w-3 h-3" /> : <Radio className="w-3 h-3" />}
                                {demoMode ? t('app.mode.demo') : t('app.mode.live')}
                            </span>
                        </button>

                        {/* Language Switcher */}
                        <LanguageSwitcher />

                        {/* Settings Button */}
                        {onOpenSettings && (
                            <button
                                onClick={onOpenSettings}
                                className="p-2 rounded-lg bg-light-border dark:bg-dark-border hover:bg-light-muted/20 dark:hover:bg-dark-muted/20 transition-colors"
                                aria-label={t('header.settings')}
                                title={t('header.settings')}
                            >
                                <Settings className="w-5 h-5 text-light-text dark:text-dark-text" />
                            </button>
                        )}

                        {/* About Button */}
                        {onOpenAbout && (
                            <button
                                onClick={onOpenAbout}
                                className="p-2 rounded-lg bg-light-border dark:bg-dark-border hover:bg-light-muted/20 dark:hover:bg-dark-muted/20 transition-colors"
                                aria-label={t('header.about')}
                                title={t('header.about')}
                            >
                                <Info className="w-5 h-5 text-light-text dark:text-dark-text" />
                            </button>
                        )}

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-light-border dark:bg-dark-border hover:bg-light-muted/20 dark:hover:bg-dark-muted/20 transition-colors"
                            aria-label={theme === 'light' ? t('header.theme_dark') : t('header.theme_light')}
                            title={theme === 'light' ? t('header.theme_dark') : t('header.theme_light')}
                        >
                            {theme === 'light' ? (
                                <Moon className="w-5 h-5 text-light-text" />
                            ) : (
                                <Sun className="w-5 h-5 text-dark-text" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
