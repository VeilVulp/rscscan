/**
 * Utility Helper Functions
 * 
 * Common utility functions used throughout the application
 */

/**
 * Validate URL format
 * 
 * @param {string} url - URL to validate
 * @returns {boolean} - Whether URL is valid
 */
export function isValidUrl(url) {
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}

/**
 * Validate DNS endpoint format
 * 
 * @param {string} endpoint - DNS endpoint to validate
 * @returns {boolean} - Whether endpoint is valid
 */
export function isValidDnsEndpoint(endpoint) {
    // Basic DNS hostname validation
    const dnsRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i
    return dnsRegex.test(endpoint)
}

/**
 * Format timestamp to readable string
 * 
 * @param {string} timestamp - ISO timestamp
 * @returns {string} - Formatted timestamp
 */
export function formatTimestamp(timestamp) {
    const date = new Date(timestamp)
    return date.toLocaleString()
}

/**
 * Format file size in bytes to human-readable format
 * 
 * @param {number} bytes - Size in bytes
 * @returns {string} - Formatted size
 */
export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Debounce function
 * 
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait) {
    let timeout

    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }

        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

/**
 * Throttle function
 * 
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
export function throttle(func, limit) {
    let inThrottle

    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args)
            inThrottle = true
            setTimeout(() => inThrottle = false, limit)
        }
    }
}

/**
 * Deep clone object
 * 
 * @param {Object} obj - Object to clone
 * @returns {Object} - Cloned object
 */
export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj))
}

/**
 * Generate unique ID
 * 
 * @returns {string} - Unique ID
 */
export function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Sleep/delay function
 * 
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} - Promise that resolves after delay
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Sanitize filename for download
 * 
 * @param {string} filename - Filename to sanitize
 * @returns {string} - Sanitized filename
 */
export function sanitizeFilename(filename) {
    return filename.replace(/[^a-z0-9.-]/gi, '_').toLowerCase()
}

/**
 * Parse targets from text content
 * 
 * @param {string} text - Text content with URLs
 * @returns {Array<string>} - Array of valid URLs
 */
export function parseTargets(text) {
    return text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#')) // Remove empty lines and comments
        .filter(isValidUrl) // Only keep valid URLs
}

/**
 * Calculate percentage
 * 
 * @param {number} current - Current value
 * @param {number} total - Total value
 * @returns {number} - Percentage (0-100)
 */
export function calculatePercentage(current, total) {
    if (total === 0) return 0
    return Math.min(100, Math.max(0, (current / total) * 100))
}
