import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Download, Search, Copy, CheckCircle, XCircle, AlertTriangle, Filter } from 'lucide-react'

/**
 * ResultsPanel Component
 * 
 * Displays scan results in a filterable, searchable table.
 * Provides export functionality and copy-to-clipboard for URLs.
 * 
 * @component
 * @param {Object} props
 * @param {Array} props.results - Array of scan results
 * @param {Function} props.onExport - Callback to export results
 * @param {boolean} props.isScanning - Whether scan is in progress
 */
function ResultsPanel({ results, onExport, isScanning }) {
    const { t } = useTranslation()
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all') // all, vulnerable, safe, error
    const [copiedUrl, setCopiedUrl] = useState(null)

    /**
     * Filter and search results
     */
    const filteredResults = useMemo(() => {
        return results.filter(result => {
            // Status filter
            if (statusFilter !== 'all') {
                if (statusFilter === 'vulnerable' && result.status !== 'vulnerable') return false
                if (statusFilter === 'safe' && result.status !== 'safe') return false
                if (statusFilter === 'error' && result.status !== 'error') return false
            }

            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase()
                return (
                    result.url.toLowerCase().includes(query) ||
                    result.statusCode?.toString().includes(query) ||
                    result.message?.toLowerCase().includes(query)
                )
            }

            return true
        })
    }, [results, searchQuery, statusFilter])

    /**
     * Copy URL to clipboard
     * @param {string} url - URL to copy
     */
    const handleCopyUrl = async (url) => {
        try {
            await navigator.clipboard.writeText(url)
            setCopiedUrl(url)
            setTimeout(() => setCopiedUrl(null), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    /**
     * Get status badge component
     * @param {Object} result - Scan result object
     */
    const getStatusBadge = (result) => {
        switch (result.status) {
            case 'vulnerable':
                return (
                    <span className="badge-success">
                        <CheckCircle className="w-3 h-3" />
                        {t('results.status.vulnerable')}
                    </span>
                )
            case 'safe':
                return (
                    <span className="badge-danger">
                        <XCircle className="w-3 h-3" />
                        {t('results.status.safe')}
                    </span>
                )
            case 'error':
                return (
                    <span className="badge-warning">
                        <AlertTriangle className="w-3 h-3" />
                        {t('results.status.error')}
                    </span>
                )
            default:
                return (
                    <span className="badge-info">
                        Unknown
                    </span>
                )
        }
    }

    return (
        <div className="card">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-light-text dark:text-dark-text">
                        {t('results.title')}
                    </h2>
                    <p className="text-sm text-light-muted dark:text-dark-muted">
                        {filteredResults.length} of {results.length} result{results.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Export Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={() => onExport('json')}
                        disabled={isScanning || results.length === 0}
                        className="btn-secondary flex items-center gap-2 text-sm"
                        title={t('results.export')}
                    >
                        <Download className="w-4 h-4" />
                        JSON
                    </button>
                    <button
                        onClick={() => onExport('csv')}
                        disabled={isScanning || results.length === 0}
                        className="btn-secondary flex items-center gap-2 text-sm"
                    >
                        <Download className="w-4 h-4" />
                        CSV
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                {/* Search */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-muted dark:text-dark-muted" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search URLs, status codes, messages..."
                        className="input pl-10"
                    />
                </div>

                {/* Status Filter */}
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-muted dark:text-dark-muted pointer-events-none" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="input pl-10 pr-4 appearance-none cursor-pointer"
                    >
                        <option value="all">{t('results.filters.all')}</option>
                        <option value="vulnerable">{t('results.filters.vulnerable')}</option>
                        <option value="safe">{t('results.filters.safe')}</option>
                        <option value="error">{t('results.filters.error')}</option>
                    </select>
                </div>
            </div>

            {/* Results Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-light-border dark:border-dark-border">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-light-text dark:text-dark-text">
                                {t('results.columns.url')}
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-light-text dark:text-dark-text">
                                {t('results.columns.status')}
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-light-text dark:text-dark-text">
                                Code
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-light-text dark:text-dark-text">
                                Size
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-light-text dark:text-dark-text">
                                {t('results.columns.details')}
                            </th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-light-text dark:text-dark-text">
                                {t('results.columns.actions')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredResults.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-8 text-light-muted dark:text-dark-muted">
                                    {searchQuery || statusFilter !== 'all'
                                        ? 'No results match your filters'
                                        : 'No results yet'}
                                </td>
                            </tr>
                        ) : (
                            filteredResults.map((result, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-light-border dark:border-dark-border hover:bg-light-border/50 dark:hover:bg-dark-border/50 transition-colors"
                                >
                                    <td className="py-3 px-4">
                                        <code className="text-xs break-all">
                                            {result.url}
                                        </code>
                                    </td>
                                    <td className="py-3 px-4">
                                        {getStatusBadge(result)}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="font-mono text-sm text-light-text dark:text-dark-text">
                                            {result.statusCode || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="text-sm text-light-muted dark:text-dark-muted">
                                            {result.size ? `${result.size} bytes` : 'N/A'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="text-sm text-light-muted dark:text-dark-muted">
                                            {result.message || 'No details'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <button
                                            onClick={() => handleCopyUrl(result.url)}
                                            className="p-2 rounded-sm hover:bg-light-border dark:hover:bg-dark-border transition-colors"
                                            title={t('results.tooltips.copy_url')}
                                        >
                                            {copiedUrl === result.url ? (
                                                <CheckCircle className="w-4 h-4 text-accent-success" />
                                            ) : (
                                                <Copy className="w-4 h-4 text-light-muted dark:text-dark-muted" />
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ResultsPanel
