/**
 * Application Constants
 * 
 * Centralized configuration and constant values for the entire application.
 * This file serves as a single source of truth for all configurable values,
 * making it easy to adjust application behavior without modifying code.
 * 
 * Benefits of centralization:
 * - Easy to find and modify configuration
 * - Prevents magic numbers/strings scattered in code
 * - Enables environment-specific configurations
 * - Improves maintainability
 * 
 * @module utils/constants
 * @author VeilVulp
 * @license MIT
 */

/**
 * CVE Information
 * 
 * Details about the vulnerability being scanned for.
 * This information is displayed in the About modal and used for
 * documentation purposes.
 * 
 * Properties:
 * - id: CVE identifier
 * - title: Human-readable vulnerability name
 * - description: Brief explanation of the vulnerability
 * - severity: CVSS severity rating (CRITICAL/HIGH/MEDIUM/LOW)
 * - cvssScore: Numerical CVSS score (0-10)
 * - references: Array of URLs for more information
 */
export const CVE_INFO = {
    id: 'RscScan',
    title: 'Next.js Server Actions Prototype Pollution RCE',
    description: 'Remote Code Execution vulnerability in Next.js Server Actions due to prototype pollution',
    severity: 'CRITICAL',
    cvssScore: 9.8,
    references: [
        'https://nvd.nist.gov/vuln/detail/RscScan',
        'https://github.com/advisories/GHSA-f8xw-jg36-jqg6'
    ]
}

/**
 * Scanner Configuration
 * 
 * Core settings that control scanner behavior and performance.
 * 
 * maxConcurrentRequests:
 * - Number of simultaneous HTTP requests
 * - Higher = faster scanning, but more resource intensive
 * - Matches Python's ThreadPoolExecutor max_workers for consistency
 * - Recommended: 10-50 depending on system resources
 * 
 * requestTimeout:
 * - Maximum time to wait for a response (milliseconds)
 * - Prevents hanging on unresponsive targets
 * - 10 seconds is a good balance between thoroughness and speed
 * 
 * maxRedirects:
 * - Number of HTTP redirects to follow
 * - Set to 0 to avoid redirect loops and focus on direct responses
 * 
 * userAgent:
 * - HTTP User-Agent header sent with requests
 * - Mimics a real browser to avoid basic bot detection
 * - Uses Chrome on Windows 10 (most common)
 */
export const SCANNER_CONFIG = {
    maxConcurrentRequests: 30,  // Concurrent HTTP requests
    requestTimeout: 10000,       // 10 seconds
    maxRedirects: 0,             // Don't follow redirects
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36'
}

/**
 * Vulnerability Indicators
 * 
 * Patterns used to detect if a target is vulnerable.
 * 
 * headers:
 * - HTTP response headers that indicate Next.js Server Actions
 * - Presence of these headers suggests the target uses the vulnerable feature
 * - x-action: Custom action header
 * - next-action: Next.js specific action header
 * - rsc: React Server Components header
 * 
 * statusCodes:
 * - HTTP status codes that might indicate successful exploitation
 * - 200: OK - Normal successful response
 * - 201: Created - Resource created
 * - 202: Accepted - Request accepted for processing
 */
export const VULNERABILITY_INDICATORS = {
    headers: ['x-action', 'next-action', 'rsc'],
    statusCodes: [200, 201, 202]
}

/**
 * Export Formats
 * 
 * Supported file formats for exporting scan results.
 * 
 * JSON:
 * - Machine-readable format
 * - Preserves all data structure
 * - Easy to import into other tools
 * - Best for programmatic processing
 * 
 * CSV:
 * - Human-readable format
 * - Easy to open in Excel/Google Sheets
 * - Good for reporting and analysis
 * - Best for manual review
 */
export const EXPORT_FORMATS = {
    JSON: 'json',
    CSV: 'csv'
}

/**
 * Status Types
 * 
 * Possible scan result statuses.
 * Used for filtering, statistics, and UI display.
 * 
 * VULNERABLE:
 * - Target shows vulnerability indicators
 * - Requires immediate attention
 * - Displayed in red/danger color
 * 
 * SAFE:
 * - No vulnerability indicators found
 * - Target appears secure
 * - Displayed in green/success color
 * 
 * ERROR:
 * - Scan failed due to network/server error
 * - Inconclusive result
 * - Displayed in yellow/warning color
 */
export const STATUS_TYPES = {
    VULNERABLE: 'vulnerable',
    SAFE: 'safe',
    ERROR: 'error'
}

/**
 * Theme Options
 * 
 * Available UI themes.
 * 
 * LIGHT:
 * - Light background, dark text
 * - Better for bright environments
 * - Reduces eye strain in daylight
 * 
 * DARK:
 * - Dark background, light text
 * - Better for low-light environments
 * - Reduces eye strain at night
 * - Saves battery on OLED screens
 */
export const THEMES = {
    LIGHT: 'light',
    DARK: 'dark'
}

/**
 * Local Storage Keys
 * 
 * Keys used for persisting data in browser localStorage.
 * Centralized to avoid typos and make it easy to change keys.
 * 
 * THEME:
 * - Stores user's theme preference
 * - Persists across sessions
 * 
 * LAST_DNS_ENDPOINT:
 * - Remembers the last DNS endpoint used
 * - Convenience feature for repeated scans
 * 
 * DEMO_MODE:
 * - Stores demo mode preference
 * - Allows testing without real network requests
 */
export const STORAGE_KEYS = {
    THEME: 'theme',
    LAST_DNS_ENDPOINT: 'lastDnsEndpoint',
    DEMO_MODE: 'demoMode'
}

/**
 * Sample Target List
 * 
 * Example targets for demo and testing purposes.
 * These are placeholder URLs that won't actually be scanned.
 * 
 * Usage:
 * - Demonstration of scanner functionality
 * - Testing UI with sample data
 * - Example format for target lists
 * 
 * Note: These are example.com domains which are reserved for
 * documentation and testing. They won't respond to scans.
 */
export const SAMPLE_TARGETS = [
    'https://example.com',
    'https://test.example.com',
    'https://demo.example.com',
    'https://staging.example.com',
    'https://dev.example.com'
]

/**
 * Educational Resources
 * 
 * Links to educational content and social media.
 * Displayed in the About modal to help users learn more.
 * 
 * youtube:
 * - en: English YouTube channel
 * - main: Main YouTube channel
 * 
 * instagram:
 * - main: Main Instagram account
 * - en: English Instagram account
 * 
 * These resources provide:
 * - Security tutorials
 * - Vulnerability explanations
 * - Penetration testing guides
 * - Community support
 */
export const EDUCATIONAL_RESOURCES = {
    youtube: {
        en: 'https://youtube.com/@PentesterLandEn',
        main: 'https://youtube.com/@PentesterLand'
    },
    instagram: {
        main: 'https://instagram.com/PentesterLand',
        en: 'https://instagram.com/PentesterLandEn'
    }
}
