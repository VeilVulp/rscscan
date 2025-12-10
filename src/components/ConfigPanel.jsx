import { useState, useRef } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { Play, Upload, Trash2, Settings, FolderOpen } from 'lucide-react'
import { toast } from 'react-toastify'
import { fileHandler } from '../services/fileHandler'
import { useElectron } from '../hooks/useElectron'

/**
 * ConfigPanel Component
 * 
 * Provides configuration interface for the scanner.
 * Allows users to set DNS endpoint, upload target files, and start scans.
 * 
 * @component
 * @param {Object} props
 * @param {Function} props.onStartScan - Callback to start scanning
 * @param {Function} props.onReset - Callback to reset scan state
 * @param {boolean} props.isScanning - Whether a scan is currently in progress
 * @param {boolean} props.demoMode - Whether demo mode is enabled
 */
function ConfigPanel({ onStartScan, onReset, isScanning, demoMode }) {
    const { t } = useTranslation()
    const [dnsEndpoint, setDnsEndpoint] = useState('')
    const [targets, setTargets] = useState([])
    const [fileName, setFileName] = useState('')
    const [filePath, setFilePath] = useState('')
    const fileInputRef = useRef(null)
    const [isDragging, setIsDragging] = useState(false)
    const { isElectron } = useElectron()

    /**
     * Handle native file picker (Electron)
     */
    const handleNativeFilePicker = async () => {
        const result = await fileHandler.selectFile()
        if (result) {
            setFileName(result.name)
            setFilePath(result.path)

            // Parse file content
            const urls = result.content
                .split('\n')
                .map(line => line.trim())
                .filter(line => line && !line.startsWith('#'))

            setTargets(urls)
        }
    }

    /**
     * Process selected file (text reading and parsing)
     * @param {File} file - The file object to process
     */
    const processFile = (file) => {
        if (!file) return

        setFileName(file.name)
        // In some Electron contexts (drag & drop), file.path might be available
        if (file.path) {
            setFilePath(file.path)
        } else {
            setFilePath('')
        }

        const reader = new FileReader()

        reader.onload = (event) => {
            const text = event.target?.result
            if (typeof text === 'string') {
                // Parse file content - one URL per line
                const urls = text
                    .split('\n')
                    .map(line => line.trim())
                    .filter(line => line && !line.startsWith('#')) // Remove empty lines and comments

                setTargets(urls)
            }
        }

        reader.readAsText(file)
    }

    /**
     * Handle file upload and parse target URLs
     * @param {Event} e - File input change event
     */
    const handleFileUpload = (e) => {
        const file = e.target.files?.[0]
        processFile(file)
    }

    /**
     * Handle drag over event
     * @param {Event} e 
     */
    const handleDragOver = (e) => {
        e.preventDefault()
        if (!isScanning) {
            setIsDragging(true)
        }
    }

    /**
     * Handle drag leave event
     * @param {Event} e 
     */
    const handleDragLeave = (e) => {
        e.preventDefault()
        setIsDragging(false)
    }

    /**
     * Handle drop event
     * @param {Event} e 
     */
    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)

        if (isScanning) return

        const file = e.dataTransfer.files?.[0]
        if (file) {
            processFile(file)
        }
    }

    /**
     * Validate configuration and start scan
     */
    const handleStartScan = () => {
        // Validation
        if (!dnsEndpoint.trim()) {
            toast.error(t('config.validation.dns_required'))
            return
        }

        if (targets.length === 0) {
            toast.error(t('config.validation.targets_required'))
            return
        }

        // Start scan with configuration
        onStartScan({
            dnsEndpoint: dnsEndpoint.trim(),
            targets,
            demoMode
        })
    }

    /**
     * Reset all configuration
     */
    const handleReset = () => {
        setDnsEndpoint('')
        setTargets([])
        setFileName('')
        setFilePath('')
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
        onReset()
    }

    return (
        <div className="card">
            <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent-primary/10">
                    <Settings className="w-5 h-5 text-accent-primary" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-light-text dark:text-dark-text">
                        {t('config.title')}
                    </h2>
                    <p className="text-sm text-light-muted dark:text-dark-muted">
                        {t('config.description')}
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                {/* DNS Endpoint Input */}
                <div>
                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                        {t('config.dns_endpoint')} <span className="text-accent-danger">*</span>
                    </label>
                    <input
                        type="text"
                        value={dnsEndpoint}
                        onChange={(e) => setDnsEndpoint(e.target.value)}
                        placeholder={t('config.dns_placeholder')}
                        className="input"
                        disabled={isScanning}
                    />
                    <p className="text-xs text-light-muted dark:text-dark-muted mt-1">
                        {t('config.dns_help')}
                    </p>
                </div>

                {/* File Upload */}
                <div>
                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                        {t('config.target_list')} <span className="text-accent-danger">*</span>
                    </label>
                    <div className="flex gap-3">
                        {/* Native File Picker (Electron) */}
                        {isElectron && (
                            <button
                                onClick={handleNativeFilePicker}
                                disabled={isScanning}
                                className="btn-secondary flex items-center gap-2"
                                title="Open file with native dialog"
                            >
                                <FolderOpen className="w-4 h-4" />
                                {t('config.load_file')}
                            </button>
                        )}

                        {/* Web File Input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".txt"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="file-upload"
                            disabled={isScanning}
                        />
                        <label
                            htmlFor="file-upload"
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed transition-all cursor-pointer 
                                ${isScanning ? 'opacity-50 cursor-not-allowed' : ''}
                                ${isDragging
                                    ? 'border-accent-primary bg-accent-primary/10 scale-[1.02]'
                                    : 'border-light-border dark:border-dark-border hover:border-accent-primary dark:hover:border-accent-primary'
                                }`}
                        >
                            <Upload className={`w-5 h-5 transition-colors ${isDragging ? 'text-accent-primary' : 'text-light-muted dark:text-dark-muted'}`} />
                            <span className={`text-sm transition-colors ${isDragging ? 'text-accent-primary font-medium' : 'text-light-text dark:text-dark-text'}`}>
                                {isDragging ? t('config.drop_file') : (fileName || t('config.target_placeholder'))}
                            </span>
                        </label>
                    </div>
                    {targets.length > 0 && (
                        <p className="text-xs text-accent-success mt-1">
                            {t('config.loaded_targets', { count: targets.length })}
                        </p>
                    )}
                    {filePath && (
                        <p className="text-xs text-light-muted dark:text-dark-muted mt-1">
                            📁 {filePath}
                        </p>
                    )}
                    <p className="text-xs text-light-muted dark:text-dark-muted mt-1">
                        {t('config.upload_help')}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                    <button
                        onClick={handleStartScan}
                        disabled={isScanning || !dnsEndpoint.trim() || targets.length === 0}
                        className="btn-primary flex-1 flex items-center justify-center gap-2"
                    >
                        <Play className="w-4 h-4" />
                        {isScanning ? t('config.scanning') : t('config.start_scan')}
                    </button>
                    <button
                        onClick={handleReset}
                        disabled={isScanning}
                        className="btn-danger flex items-center justify-center gap-2 px-6"
                        title="Reset configuration"
                    >
                        <Trash2 className="w-4 h-4" />
                        {t('config.reset')}
                    </button>
                </div>

                {/* Demo Mode Notice */}
                {demoMode && (
                    <div className="p-3 rounded-lg bg-accent-info/10 border border-accent-info/20">
                        <p className="text-sm text-accent-info">
                            🎭 <Trans i18nKey="config.demo_notice" components={{ strong: <strong /> }} />
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ConfigPanel
