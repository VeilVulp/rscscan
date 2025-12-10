/**
 * Export Service
 * 
 * Handles exporting scan results to various formats (JSON, CSV)
 */

/**
 * Export results as JSON
 * 
 * @param {Array} results - Array of scan results
 * @param {string} filename - Optional filename (default: auto-generated)
 * @returns {void}
 */
export function exportAsJSON(results, filename = null) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const defaultFilename = `RscScan-scan-${timestamp}.json`

    const data = {
        metadata: {
            cve: 'RscScan',
            description: 'Next.js Server Actions Prototype Pollution RCE',
            scanDate: new Date().toISOString(),
            totalTargets: results.length,
            vulnerableCount: results.filter(r => r.status === 'vulnerable').length,
            safeCount: results.filter(r => r.status === 'safe').length,
            errorCount: results.filter(r => r.status === 'error').length
        },
        results: results
    }

    const jsonString = JSON.stringify(data, null, 2)
    downloadFile(jsonString, filename || defaultFilename, 'application/json')
}

/**
 * Export results as CSV
 * 
 * @param {Array} results - Array of scan results
 * @param {string} filename - Optional filename (default: auto-generated)
 * @returns {void}
 */
export function exportAsCSV(results, filename = null) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const defaultFilename = `RscScan-scan-${timestamp}.csv`

    // CSV headers
    const headers = ['URL', 'Status', 'Status Code', 'Size (bytes)', 'Message', 'Timestamp']

    // Convert results to CSV rows
    const rows = results.map(result => [
        escapeCSV(result.url),
        escapeCSV(result.status),
        result.statusCode || 'N/A',
        result.size || 'N/A',
        escapeCSV(result.message || ''),
        escapeCSV(result.timestamp || '')
    ])

    // Combine headers and rows
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n')

    downloadFile(csvContent, filename || defaultFilename, 'text/csv')
}

/**
 * Escape CSV field (handle commas, quotes, newlines)
 * 
 * @param {string} field - Field value to escape
 * @returns {string} - Escaped field value
 */
function escapeCSV(field) {
    if (field === null || field === undefined) return ''

    const stringField = String(field)

    // If field contains comma, quote, or newline, wrap in quotes and escape quotes
    if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
        return `"${stringField.replace(/"/g, '""')}"`
    }

    return stringField
}

/**
 * Download file to user's computer
 * 
 * @param {string} content - File content
 * @param {string} filename - Filename
 * @param {string} mimeType - MIME type
 * @returns {void}
 */
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.style.display = 'none'

    document.body.appendChild(link)
    link.click()

    // Cleanup
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}

/**
 * Export results in specified format
 * 
 * @param {Array} results - Array of scan results
 * @param {string} format - Export format ('json' or 'csv')
 * @param {string} filename - Optional custom filename
 * @returns {void}
 */
export function exportResults(results, format = 'json', filename = null) {
    if (!results || results.length === 0) {
        console.warn('No results to export')
        return
    }

    switch (format.toLowerCase()) {
        case 'json':
            exportAsJSON(results, filename)
            break
        case 'csv':
            exportAsCSV(results, filename)
            break
        default:
            console.error(`Unsupported export format: ${format}`)
    }
}
