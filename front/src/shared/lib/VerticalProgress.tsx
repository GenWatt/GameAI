import { cn } from "@/lib/utils"

interface VerticalProgressProps {
    value?: number
    height?: string | number
    width?: string | number
    showValue?: boolean
    valuePosition?: 'top' | 'bottom' | 'center'
    variant?: 'default' | 'success' | 'warning' | 'error'
    className?: string
    animated?: boolean
}

const variantStyles = {
    default: 'bg-primary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
}

const variantBackgrounds = {
    default: 'bg-primary/20',
    success: 'bg-green-500/20',
    warning: 'bg-yellow-500/20',
    error: 'bg-red-500/20'
}

function VerticalProgress({
    value = 0,
    height = "100%",
    width = 8,
    showValue = false,
    valuePosition = 'top',
    variant = 'default',
    className,
    animated = true,
    ...props
}: VerticalProgressProps) {
    const heightStyle = typeof height === 'number' ? `${height}px` : height
    const widthStyle = typeof width === 'number' ? `${width}px` : width
    const clampedValue = Math.min(Math.max(value, 0), 100)

    return (
        <div className="flex flex-col items-center gap-1 h-full">
            {showValue && valuePosition === 'top' && (
                <span className="text-xs font-medium text-muted-foreground shrink-0">
                    {Math.round(clampedValue)}%
                </span>
            )}

            <div className="flex-1 flex items-center justify-center min-h-0">
                <div
                    className={cn(
                        "relative overflow-hidden rounded-xs",
                        variantBackgrounds[variant],
                        className
                    )}
                    style={{
                        height: heightStyle,
                        width: widthStyle,
                    }}
                    {...props}
                >
                    <div
                        className={cn(
                            "absolute bottom-0 left-0 right-0 rounded-xs",
                            variantStyles[variant],
                            animated && "transition-all duration-500 ease-out"
                        )}
                        style={{
                            height: `${clampedValue}%`,
                        }}
                    />

                    {/* Shine effect */}
                    {animated && (
                        <div
                            className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent opacity-30"
                            style={{
                                transform: 'translateY(-100%)',
                                animation: clampedValue > 0 ? 'shine 2s ease-in-out infinite' : 'none',
                            }}
                        />
                    )}

                    {showValue && valuePosition === 'center' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-bold text-white mix-blend-difference drop-shadow-sm">
                                {Math.round(clampedValue)}%
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {showValue && valuePosition === 'bottom' && (
                <span className="text-xs font-medium text-muted-foreground shrink-0">
                    {Math.round(clampedValue)}%
                </span>
            )}
        </div>
    )
}

export default VerticalProgress
export type { VerticalProgressProps }