import { Activity } from 'lucide-react'

/**
 * ProgressBar Component
 * 
 * Displays a visual progress indicator during scanning operations.
 * Shows percentage completion and animated progress bar.
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.progress - Progress information
 * @param {number} props.progress.current - Current number of scanned targets
 * @param {number} props.progress.total - Total number of targets
 * @param {number} props.progress.percentage - Completion percentage (0-100)
 */
function ProgressBar({ progress }) {
    const { current = 0, total = 0, percentage = 0 } = progress || {}

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-accent-primary animate-pulse" />
                    <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
                        Scanning in Progress
                    </h3>
                </div>
                <div className="text-sm font-mono text-light-muted dark:text-dark-muted">
                    {current} / {total} targets
                </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-8 bg-light-border dark:bg-dark-border rounded-lg overflow-hidden">
                {/* Animated Background */}
                <div
                    className="absolute inset-0 shimmer"
                    style={{
                        background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent)',
                        backgroundSize: '200% 100%'
                    }}
                />

                {/* Progress Fill */}
                <div
                    className="absolute inset-y-0 left-0 bg-linear-to-r from-accent-primary to-accent-info transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                >
                    <div className="absolute inset-0 shimmer" />
                </div>

                {/* Percentage Text */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-light-text dark:text-dark-text drop-shadow-lg">
                        {percentage.toFixed(1)}%
                    </span>
                </div>
            </div>

            {/* Status Text */}
            <p className="text-xs text-light-muted dark:text-dark-muted mt-2 text-center">
                {percentage === 100 ? 'Scan complete!' : 'Please wait while scanning targets...'}
            </p>
        </div>
    )
}

export default ProgressBar
