import { useState, useEffect } from 'react'

/**
 * useTheme Hook
 * 
 * Manages application theme (light/dark mode) with intelligent defaults
 * and persistence across sessions.
 * 
 * Features:
 * - Automatic system preference detection on first load
 * - localStorage persistence for user preference
 * - Live sync with system theme changes (if no manual preference)
 * - Smooth theme transitions
 * 
 * Usage:
 * ```javascript
 * const { theme, toggleTheme, setTheme } = useTheme();
 * 
 * // Toggle between light and dark
 * <button onClick={toggleTheme}>Toggle Theme</button>
 * 
 * // Set specific theme
 * <button onClick={() => setTheme('dark')}>Dark Mode</button>
 * ```
 * 
 * @module hooks/useTheme
 * @returns {Object} Theme state and control functions
 * @property {string} theme - Current theme ('light' or 'dark')
 * @property {Function} toggleTheme - Toggle between themes
 * @property {Function} setTheme - Set specific theme
 */
export function useTheme() {
    /**
     * Initialize Theme State
     * 
     * Priority order:
     * 1. User's saved preference (localStorage)
     * 2. System preference (prefers-color-scheme)
     * 3. Default to 'light'
     * 
     * This ensures the theme is set before the first render,
     * preventing a flash of wrong theme.
     */
    const [theme, setTheme] = useState(() => {
        // Check if user has a saved preference
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme) {
            // Use saved preference (highest priority)
            return savedTheme
        }

        // No saved preference - check system preference
        // This respects the user's OS-level theme setting
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark'
        }

        // Default to light theme
        return 'light'
    })

    /**
     * Persist Theme to localStorage
     * 
     * Whenever the theme changes, save it to localStorage.
     * This ensures the user's preference is remembered across:
     * - Page refreshes
     * - Browser restarts
     * - App restarts (Electron)
     */
    useEffect(() => {
        localStorage.setItem('theme', theme)
    }, [theme])

    /**
     * Listen for System Theme Changes
     * 
     * Automatically sync with system theme changes, but ONLY if:
     * - User hasn't manually set a preference
     * - System theme changes (e.g., sunset triggers dark mode)
     * 
     * This provides a seamless experience where the app follows
     * the system theme until the user explicitly chooses one.
     * 
     * Cleanup:
     * The event listener is removed when the component unmounts
     * to prevent memory leaks.
     */
    useEffect(() => {
        // Create a media query for dark mode preference
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

        /**
         * Handle System Theme Change
         * 
         * @param {MediaQueryListEvent} e - Media query change event
         */
        const handleChange = (e) => {
            // Only auto-switch if user hasn't manually set a preference
            // This respects user choice over system preference
            const savedTheme = localStorage.getItem('theme')
            if (!savedTheme) {
                // No manual preference - follow system theme
                setTheme(e.matches ? 'dark' : 'light')
            }
        }

        // Register the event listener
        mediaQuery.addEventListener('change', handleChange)

        // Cleanup function - remove listener on unmount
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, []) // Empty deps - only run once on mount

    /**
     * Toggle Theme
     * 
     * Switches between light and dark themes.
     * This is the most common way users change themes.
     * 
     * The new theme is automatically saved to localStorage
     * via the useEffect above.
     */
    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
    }

    /**
     * Return Theme State and Controls
     * 
     * Provides everything needed to manage themes:
     * - theme: Current theme string ('light' or 'dark')
     * - toggleTheme: Function to toggle between themes
     * - setTheme: Function to set a specific theme
     */
    return { theme, toggleTheme, setTheme }
}
