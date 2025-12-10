import { CheckCircle, XCircle, AlertTriangle, Target } from 'lucide-react'
import { useTranslation } from 'react-i18next'

/**
 * StatisticsCard Component
 * 
 * Displays real-time statistics about the scanning operation.
 * Shows counts for total, success, failed, and warning results.
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.statistics - Statistics object
 * @param {number} props.statistics.total - Total targets scanned
 * @param {number} props.statistics.success - Successful scans
 * @param {number} props.statistics.failed - Failed scans
 * @param {number} props.statistics.warning - Scans with warnings
 */
function StatisticsCard({ statistics }) {
    const { t } = useTranslation()
    const { total = 0, success = 0, failed = 0, warning = 0 } = statistics || {}

    const stats = [
        {
            label: t('statistics.total'),
            value: total,
            icon: Target,
            color: 'text-accent-info',
            bgColor: 'bg-accent-info/10'
        },
        {
            label: t('statistics.vulnerable'),
            value: success,
            icon: CheckCircle,
            color: 'text-accent-success',
            bgColor: 'bg-accent-success/10'
        },
        {
            label: t('statistics.safe'),
            value: failed,
            icon: XCircle,
            color: 'text-accent-danger',
            bgColor: 'bg-accent-danger/10'
        },
        {
            label: t('statistics.errors'), // Re-using errors key for warnings if appropriate, essentially "issues"
            value: warning,
            icon: AlertTriangle,
            color: 'text-accent-warning',
            bgColor: 'bg-accent-warning/10'
        }
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                    <div key={index} className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-light-muted dark:text-dark-muted mb-1">
                                    {stat.label}
                                </p>
                                <p className="text-3xl font-bold text-light-text dark:text-dark-text">
                                    {stat.value}
                                </p>
                            </div>
                            <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${stat.bgColor}`}>
                                <Icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default StatisticsCard
