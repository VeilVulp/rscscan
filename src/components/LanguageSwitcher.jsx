import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'
import US from 'country-flag-icons/react/3x2/US'
import IR from 'country-flag-icons/react/3x2/IR'
import RU from 'country-flag-icons/react/3x2/RU'
import DE from 'country-flag-icons/react/3x2/DE'
import CN from 'country-flag-icons/react/3x2/CN'

const languages = [
    { code: 'en', name: 'English', Flag: US, dir: 'ltr' },
    { code: 'ru', name: 'Русский', Flag: RU, dir: 'ltr' },
    { code: 'de', name: 'Deutsch', Flag: DE, dir: 'ltr' },
    { code: 'zh', name: '中文', Flag: CN, dir: 'ltr' },
    { code: 'fa', name: 'فارسی', Flag: IR, dir: 'rtl', className: 'font-persian' }
]

export default function LanguageSwitcher() {
    const { i18n } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Handle language change
    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang.code)
        document.documentElement.dir = lang.dir
        document.documentElement.lang = lang.code
        setIsOpen(false)
    }

    const currentLang = languages.find(l => l.code === i18n.language) || languages[0]

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg bg-light-border dark:bg-dark-border hover:bg-light-muted/20 dark:hover:bg-dark-muted/20 transition-colors flex items-center gap-2"
                aria-label="Select Language"
                title="Select Language"
            >
                <div className="flex items-center justify-center w-6 h-5">
                    <currentLang.Flag className="w-5 h-auto rounded-sm shadow-sm" />
                </div>
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 py-2 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-3 py-2 text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wider">
                        Select Language
                    </div>
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => changeLanguage(lang)}
                            className={`w-full px-4 py-2 text-sm text-left flex items-center justify-between hover:bg-light-muted/10 dark:hover:bg-dark-muted/10 transition-colors group
                                ${i18n.language === lang.code ? 'text-accent-primary font-medium' : 'text-light-text dark:text-dark-text'}
                            `}
                        >
                            <span className="flex items-center gap-3">
                                <lang.Flag className="w-5 h-auto rounded-sm shadow-sm group-hover:scale-110 transition-transform duration-200" />
                                <span className={lang.className}>{lang.name}</span>
                            </span>
                            {i18n.language === lang.code && (
                                <Check className="w-4 h-4" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
