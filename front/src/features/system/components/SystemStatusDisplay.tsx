import React from 'react';
import { useSystemStatus } from '../hooks/useSystemStatus';
import { ConnectionCard, CPUCard, GPUCard, MemoryCard, SystemInfoCard } from './cards';
import { Loader } from '@/components/ui/loader';
import { useConnectionStore } from '@/shared/api/stores/useConnectionStore';

const SystemStatusDisplay: React.FC = () => {
    const { system, loading, error } = useSystemStatus();
    const { status } = useConnectionStore();

    if (loading) {
        return <Loader text='Loading system data' />;
    }

    if (error || !system) {
        return (
            <div className="p-4">
                <div className="text-destructive text-center">{error}</div>
            </div>
        );
    }

    const {
        memory_percentage,
        memory_total_mb,
        memory_used_mb, cpu_cores,
        cpu_name, cpu_usage,
        gpus,
        online,
        battery_charging,
        battery_level,
        os_name,
        os_version,
        connection_type,
        timestamp } = system

    return (
        <div className="mt-4 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">System Status</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <ConnectionCard online={online} connectionType={connection_type} serverStatus={status} />
                <MemoryCard memoryLimit={memory_total_mb} memoryPercentage={memory_percentage} memoryUsage={memory_used_mb} />
                <CPUCard cpuCores={cpu_cores} cpuName={cpu_name} cpuUage={cpu_usage} />
                {gpus.map((gpu, index) => (
                    <GPUCard key={index} gpuUsage={gpu} />
                ))}
                <SystemInfoCard
                    osName={os_name}
                    osVersion={os_version}
                    batteryCharging={battery_charging}
                    batteryLevel={battery_level}
                    timestamp={timestamp}
                />
            </div>
        </div>
    );
};

export default SystemStatusDisplay;