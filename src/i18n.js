import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import enTranslation from './locales/en/translation.json'
import ruTranslation from './locales/ru/translation.json'
import deTranslation from './locales/de/translation.json'
import zhTranslation from './locales/zh/translation.json'
import faTranslation from './locales/fa/translation.json'

const resources = {
    en: {
        translation: enTranslation,
    },
    ru: {
        translation: ruTranslation,
    },
    de: {
        translation: deTranslation,
    },
    zh: {
        translation: zhTranslation,
    },
    fa: {
        translation: faTranslation,
    },
}

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        debug: import.meta.env.DEV, // Enable debug in dev mode

        interpolation: {
            escapeValue: false, // React already safes from xss
        },

        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
            lookupLocalStorage: 'i18nextLng'
        }
    })

export default i18n
