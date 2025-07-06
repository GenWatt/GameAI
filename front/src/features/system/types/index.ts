// Desktop types
export interface DesktopSystemInfo {
    online: boolean;
    connection_speed?: number;
    connection_type: string;
    memory_used_mb: number;
    memory_total_mb: number;
    memory_percentage: number;
    gpus: GpuInfo[];
    cpu_usage: number;
    cpu_cores: number;
    cpu_name: string;
    os_name: string;
    os_version: string;
    battery_level?: number;
    battery_charging?: boolean;
    timestamp: string;
}

export interface GpuInfo {
    name: string;
    usage_percentage: number;
    vram_used_mb: number;
    vram_total_mb: number;
}
