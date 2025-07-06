import { useSystemStatus } from '@/features/system/hooks/useSystemStatus'
import {
    Cpu,
    HardDrive,
    Monitor,
    Wifi,
    WifiOff,
    Battery,
    MemoryStick
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import VerticalProgress from '@/shared/lib/VerticalProgress'

interface SystemMetric {
    id: string
    label: string
    value: number
    icon: LucideIcon
    show?: boolean
    color?: string
}

interface StatusIndicator {
    id: string
    icon: LucideIcon
    active: boolean
    activeColor?: string
    inactiveColor?: string
}

function Footer() {
    const { system, loading } = useSystemStatus()
    const gpu = system?.gpus?.[0]
    const vramPercentage = gpu ? (gpu.vram_used_mb / gpu.vram_total_mb) * 100 : 0

    const roundPercentage = (value: number): number => Math.round(value)

    const systemMetrics: SystemMetric[] = [
        {
            id: 'ram',
            label: 'RAM',
            value: roundPercentage(system?.memory_percentage || 0),
            icon: MemoryStick,
            show: !!system
        },
        {
            id: 'cpu',
            label: 'CPU',
            value: roundPercentage(system?.cpu_usage || 0),
            icon: Cpu,
            show: !!system
        },
        {
            id: 'gpu',
            label: 'GPU',
            value: roundPercentage(gpu?.usage_percentage || 0),
            icon: Monitor,
            show: !!gpu
        },
        {
            id: 'vram',
            label: 'VRAM',
            value: roundPercentage(vramPercentage),
            icon: HardDrive,
            show: !!gpu
        }
    ]

    const statusIndicators: StatusIndicator[] = [
        {
            id: 'network',
            icon: system?.online ? Wifi : WifiOff,
            active: system?.online || false,
            activeColor: 'text-chart-2',
            inactiveColor: 'text-destructive'
        }
    ]

    const batteryMetric: SystemMetric = {
        id: 'battery',
        label: 'Battery',
        value: roundPercentage(system?.battery_level || 0),
        icon: Battery,
        show: !!system
    }

    const MetricItem = ({ metric }: { metric: SystemMetric }) => (
        <div className="flex items-center gap-2 h-6"> {/* Fixed height container */}
            <metric.icon className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs hidden sm:block">{metric.label}</span>
            <div className="w-3 h-6 hidden md:block"> {/* Fixed size container for progress */}
                <VerticalProgress
                    value={metric.value}
                    width={12}
                    height="100%"
                    variant={
                        metric.id === 'cpu' || metric.id === 'gpu' ?
                            (metric.value > 80 ? 'error' : metric.value > 60 ? 'warning' : 'success') :
                            'default'
                    }
                />
            </div>
            <span className="text-xs text-muted-foreground">{metric.value}%</span>
        </div>
    )

    const StatusIcon = ({ indicator }: { indicator: StatusIndicator }) => (
        <indicator.icon
            className={`h-4 w-4 ${indicator.active
                ? indicator.activeColor || 'text-chart-2'
                : indicator.inactiveColor || 'text-muted-foreground'
                }`}
        />
    )

    if (loading) {
        return (
            <footer className="bg-background border-t border-accent px-4 py-2">
                <div className="flex items-center justify-center text-sm text-muted-foreground">
                    Loading system status...
                </div>
            </footer>
        )
    }

    return (
        <footer className="bg-background border-t border-accent px-4 py-2">
            <ScrollArea className="w-full">
                <div className="flex items-center justify-between text-sm">
                    {/* System Stats */}
                    <div className="flex items-center gap-4">
                        {systemMetrics
                            .filter(metric => metric.show)
                            .map(metric => (
                                <MetricItem key={metric.id} metric={metric} />
                            ))}
                    </div>

                    {/* Status Indicators */}
                    <div className="flex items-center gap-3">
                        {statusIndicators.map(indicator => (
                            <StatusIcon key={indicator.id} indicator={indicator} />
                        ))}

                        {/* Battery */}
                        {batteryMetric.show && <MetricItem metric={batteryMetric} />}
                    </div>
                </div>
            </ScrollArea>
        </footer>
    )
}

export default Footer