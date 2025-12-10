
import { useState, useEffect } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { X, Info, ExternalLink, Shield, Code, Heart, Github, Youtube, Instagram, Mail } from 'lucide-react'
import { fileHandler } from '../services/fileHandler'

/**
 * AboutModal Component
 * 
 * Displays application information, version, credits, and legal disclaimer.
 * 
 * @component
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close callback
 */
function AboutModal({ isOpen, onClose }) {
    const { t } = useTranslation()
    const [version, setVersion] = useState('1.0.0')

    useEffect(() => {
        // Get app version
        const loadVersion = async () => {
            const appVersion = await fileHandler.getVersion()
            setVersion(appVersion)
        }
        loadVersion()
    }, [])

    const handleOpenLink = async (url) => {
        await fileHandler.openExternal(url)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
            <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-light-border dark:border-dark-border">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent-info/10">
                            <Info className="w-5 h-5 text-accent-info" />
                        </div>
                        <h2 className="text-xl font-bold text-light-text dark:text-dark-text">
                            {t('header.about')}
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
                <div className="p-6 overflow-y-auto  max-h-[calc(90vh-140px)]">
                    <div className="flex flex-col gap-6">
                        {/* App Info */}
                        <div className="text-center">
                            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-lg bg-accent-danger/10">
                                <Shield className="w-10 h-10 text-accent-danger" />
                            </div>
                            <h3 className="text-2xl font-bold text-light-text dark:text-dark-text mb-2">
                                {t('app.title')}
                            </h3>
                            <p className="text-sm text-light-muted dark:text-dark-muted mb-1">
                                {t('about.version')} {version}
                            </p>
                            <p className="text-sm text-light-muted dark:text-dark-muted">
                                {t('app.subtitle')}
                            </p>
                        </div>

                        {/* CVE Information */}
                        <div className="p-4 rounded-lg bg-light-border/50 dark:bg-dark-border/50">
                            <div className="flex items-start gap-3">
                                <Code className="w-5 h-5 text-accent-primary mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-light-text dark:text-dark-text mb-1">
                                        {t('about.title')}
                                    </h4>
                                    <p className="text-sm text-light-muted dark:text-dark-muted mb-2">
                                        {t('about.description')} <strong>{t('about.description_highlight')}</strong> {t('about.description_end')}
                                    </p>
                                    <div className="flex gap-2">
                                        <span className="px-2 py-1 text-xs font-semibold rounded-sm bg-accent-danger/10 text-accent-danger">
                                            CRITICAL
                                        </span>
                                        <span className="px-2 py-1 text-xs font-semibold rounded-sm bg-accent-warning/10 text-accent-warning">
                                            CVSS 9.8
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Legal Disclaimer */}
                        <div className="p-4 rounded-lg border-2 border-accent-warning bg-accent-warning/5">
                            <h4 className="font-semibold text-accent-warning mb-2 flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                {t('app.warning.title')}
                            </h4>
                            <p className="text-sm text-light-text dark:text-dark-text leading-relaxed">
                                <Trans i18nKey="app.warning.text" components={{ 1: <strong /> }} />
                            </p>
                        </div>

                        {/* Developer */}
                        <div className="flex flex-col gap-3">
                            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text flex items-center gap-2">
                                <Code className="w-5 h-5 text-accent-primary" />
                                {t('about.developer')}
                            </h3>
                            <div className="flex flex-col gap-2">
                                <p className="text-sm font-semibold text-light-text dark:text-dark-text">
                                    VeilVulp
                                </p>
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-light-border/50 dark:bg-dark-border/50 hover:bg-light-border dark:hover:bg-dark-border transition-colors">
                                        <span className="text-sm text-light-text dark:text-dark-text flex items-center gap-2">
                                            <Github className="w-4 h-4" />
                                            GitHub
                                        </span>
                                        <button
                                            onClick={() => handleOpenLink('https://github.com/VeilVulp')}
                                            className="text-accent-primary hover:text-accent-primary/80 transition-colors"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-light-border/50 dark:bg-dark-border/50 hover:bg-light-border dark:hover:bg-dark-border transition-colors">
                                        <span className="text-sm text-light-text dark:text-dark-text flex items-center gap-2">
                                            <Youtube className="w-4 h-4" />
                                            YouTube
                                        </span>
                                        <button
                                            onClick={() => handleOpenLink('https://www.youtube.com/@VeilVulp')}
                                            className="text-accent-primary hover:text-accent-primary/80 transition-colors"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-light-border/50 dark:bg-dark-border/50 hover:bg-light-border dark:hover:bg-dark-border transition-colors">
                                        <span className="text-sm text-light-text dark:text-dark-text flex items-center gap-2">
                                            <Instagram className="w-4 h-4" />
                                            Instagram
                                        </span>
                                        <button
                                            onClick={() => handleOpenLink('https://www.instagram.com/veilvulp')}
                                            className="text-accent-primary hover:text-accent-primary/80 transition-colors"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-light-border/50 dark:bg-dark-border/50 hover:bg-light-border dark:hover:bg-dark-border transition-colors">
                                        <span className="text-sm text-light-text dark:text-dark-text flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            Email
                                        </span>
                                        <a
                                            href="mailto:veilvulp@outlook.com"
                                            className="text-accent-primary hover:text-accent-primary/80 transition-colors"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Acknowledgments */}
                        <div className="flex flex-col gap-3">
                            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text flex items-center gap-2">
                                <Heart className="w-5 h-5 text-accent-danger" />
                                {t('about.special_thanks')}
                            </h3>
                            <div className="p-4 rounded-lg bg-linear-to-br from-accent-primary/5 to-accent-info/5 border border-accent-primary/20 dark:border-accent-primary/10">
                                <p className="text-sm font-semibold text-light-text dark:text-dark-text mb-1">
                                    PentesterLand Academy
                                </p>
                                <p className="text-xs text-light-muted dark:text-dark-muted mb-3">
                                    {t('about.original_creator')}
                                </p>
                                <p className="text-xs text-light-muted dark:text-dark-muted mb-3 leading-relaxed">
                                    {t('about.guidance_text')}
                                </p>
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/50 dark:bg-black/20 hover:bg-white/70 dark:hover:bg-black/30 transition-colors">
                                        <span className="text-xs text-light-text dark:text-dark-text flex items-center gap-2">
                                            <Youtube className="w-3.5 h-3.5" />
                                            YouTube (English)
                                        </span>
                                        <button
                                            onClick={() => handleOpenLink('https://youtube.com/@PentesterLandEn')}
                                            className="text-accent-primary hover:text-accent-primary/80 transition-colors"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/50 dark:bg-black/20 hover:bg-white/70 dark:hover:bg-black/30 transition-colors">
                                        <span className="text-xs text-light-text dark:text-dark-text flex items-center gap-2">
                                            <Youtube className="w-3.5 h-3.5" />
                                            YouTube (Main)
                                        </span>
                                        <button
                                            onClick={() => handleOpenLink('https://youtube.com/@PentesterLand')}
                                            className="text-accent-primary hover:text-accent-primary/80 transition-colors"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/50 dark:bg-black/20 hover:bg-white/70 dark:hover:bg-black/30 transition-colors">
                                        <span className="text-xs text-light-text dark:text-dark-text flex items-center gap-2">
                                            <Instagram className="w-3.5 h-3.5" />
                                            Instagram
                                        </span>
                                        <button
                                            onClick={() => handleOpenLink('https://instagram.com/PentesterLand')}
                                            className="text-accent-primary hover:text-accent-primary/80 transition-colors"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Credits */}
                        <div className="flex flex-col gap-3">
                            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text flex items-center gap-2">
                                <Shield className="w-5 h-5 text-accent-success" />
                                {t('about.license')}
                            </h3>
                            <div className="grid grid-cols-2 gap-2 text-xs text-light-muted dark:text-dark-muted">
                                <div className="p-2 rounded-sm bg-light-border/30 dark:bg-dark-border/30">
                                    • Next.js team
                                </div>
                                <div className="p-2 rounded-sm bg-light-border/30 dark:bg-dark-border/30">
                                    • Security community
                                </div>
                                <div className="p-2 rounded-sm bg-light-border/30 dark:bg-dark-border/30">
                                    • PortSwigger
                                </div>
                                <div className="p-2 rounded-sm bg-light-border/30 dark:bg-dark-border/30">
                                    • OWASP
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Technology Stack */}
                    <div className='flex flex-col gap-3 mt-4 mb-4'>
                        <h4 className="font-semibold text-light-text dark:text-dark-text mb-3">
                            {t('about.technology_stack')}
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="p-2 rounded-sm bg-light-border/50 dark:bg-dark-border/50">
                                <span className="text-light-muted dark:text-dark-muted">{t('about.tech_frontend')}</span>
                                <span className="ml-2 text-light-text dark:text-dark-text">React 19.2.1</span>
                            </div>
                            <div className="p-2 rounded-sm bg-light-border/50 dark:bg-dark-border/50">
                                <span className="text-light-muted dark:text-dark-muted">{t('about.tech_build')}</span>
                                <span className="ml-2 text-light-text dark:text-dark-text">Vite 5.3</span>
                            </div>
                            <div className="p-2 rounded-sm bg-light-border/50 dark:bg-dark-border/50">
                                <span className="text-light-muted dark:text-dark-muted">{t('about.tech_styling')}</span>
                                <span className="ml-2 text-light-text dark:text-dark-text">Tailwind CSS</span>
                            </div>
                            <div className="p-2 rounded-sm bg-light-border/50 dark:bg-dark-border/50">
                                <span className="text-light-muted dark:text-dark-muted">{t('about.tech_desktop')}</span>
                                <span className="ml-2 text-light-text dark:text-dark-text">Electron 28</span>
                            </div>
                        </div>
                    </div>


                    {/* License */}
                    <div className="text-center text-sm text-light-muted dark:text-dark-muted">
                        <p>{t('about.license_text')}</p>
                        <p className="mt-1">{t('about.copyright')}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutModal
