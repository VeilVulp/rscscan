import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { scanMultiple, calculateStatistics } from '../services/scanner'
import { exportResults as exportResultsService } from '../services/exporter'
import { toast } from 'react-toastify'

/**
 * useScanner Hook
 * 
 * Manages scanner state and operations.
 * Handles scanning workflow, progress tracking, and result management.
 * 
 * @returns {Object} - Scanner state and control functions
 */
export function useScanner() {
    const { t } = useTranslation()
    const [isScanning, setIsScanning] = useState(false)
    const [progress, setProgress] = useState({ current: 0, total: 0, percentage: 0 })
    const [results, setResults] = useState([])
    const [statistics, setStatistics] = useState({
        total: 0,
        success: 0,
        failed: 0,
        warning: 0
    })

    /**
     * Start scanning operation
     * 
     * @param {Object} config - Scan configuration
     * @param {string} config.dnsEndpoint - DNS exfiltration endpoint
     * @param {Array<string>} config.targets - Array of target URLs
     * @param {boolean} config.demoMode - Whether to use demo mode
     */
    const startScan = useCallback(async (config) => {
        const { dnsEndpoint, targets, demoMode, requestTimeout = 10, maxConcurrentRequests = 30 } = config

        // Reset state
        setIsScanning(true)
        setResults([])
        setProgress({ current: 0, total: targets.length, percentage: 0 })
        setStatistics({ total: 0, success: 0, failed: 0, warning: 0 })

        try {
            // Start scanning
            const scanResults = await scanMultiple(
                targets,
                dnsEndpoint,
                (progressUpdate) => {
                    setProgress(progressUpdate)

                    // Update statistics in real-time
                    setResults(prevResults => {
                        const newResults = [...prevResults]
                        // This is a simplified approach - in production you'd track individual results
                        return newResults
                    })
                },
                {
                    demoMode,
                    maxConcurrent: maxConcurrentRequests,
                    timeout: requestTimeout * 1000 // Convert to ms
                }
            )

            // Update final results and statistics
            setResults(scanResults)
            setStatistics(calculateStatistics(scanResults))
            setProgress({
                current: targets.length,
                total: targets.length,
                percentage: 100
            })
            toast.success(t('config.scan.completed'))
        } catch (error) {
            console.error('Scan failed:', error)
            toast.error(t('config.scan.failed', { error: error.message }))
        } finally {
            setIsScanning(false)
        }
    }, [t])

    /**
     * Reset scanner state
     */
    const resetScan = useCallback(() => {
        setIsScanning(false)
        setProgress({ current: 0, total: 0, percentage: 0 })
        setResults([])
        setStatistics({ total: 0, success: 0, failed: 0, warning: 0 })
    }, [])

    /**
     * Export results
     * 
     * @param {string} format - Export format ('json' or 'csv')
     */
    const exportResults = useCallback((format) => {
        if (results.length === 0) {
            toast.info(t('config.export.no_results'))
            return
        }

        try {
            exportResultsService(results, format)
            toast.success(t('config.export.success'))
        } catch (error) {
            console.error('Export failed:', error)
            toast.error(t('config.export.failed', { error: error.message }))
        }
    }, [results, t])

    return {
        isScanning,
        progress,
        results,
        statistics,
        startScan,
        resetScan,
        exportResults
    }
}
