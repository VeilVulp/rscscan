/**
 * React Application Entry Point
 * 
 * This is the main entry point for the React application.
 * It initializes the React root and renders the App component.
 * 
 * Key Features:
 * - StrictMode enabled for development warnings
 * - Single root render for optimal performance
 * - Mounts to #root element in index.html
 * 
 * @module src/main
 * @author VeilVulp
 * @license MIT
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n' // Initialize i18n before App
import App from './App.jsx'
import './index.css'

// Fonts
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'

import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import '@fontsource/vazirmatn/400.css'
import '@fontsource/vazirmatn/500.css'
import '@fontsource/vazirmatn/700.css'

import '@fontsource/noto-sans-sc/400.css'
import '@fontsource/noto-sans-sc/500.css'
import '@fontsource/noto-sans-sc/700.css'

/**
 * Initialize React Application
 * 
 * Steps:
 * 1. Get the root DOM element from index.html
 * 2. Create a React root using React 18's createRoot API
 * 3. Render the App component wrapped in StrictMode
 * 
 * StrictMode Benefits:
 * - Identifies components with unsafe lifecycles
 * - Warns about legacy string ref API usage
 * - Warns about deprecated findDOMNode usage
 * - Detects unexpected side effects
 * - Detects legacy context API
 * 
 * Note: StrictMode only runs in development and has no impact on production.
 */
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
