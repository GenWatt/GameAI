import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { GpuInfo } from '../../types';
import { Progress } from '@/components/ui/progress';

interface GPUCardProps {
    gpuUsage: GpuInfo | null;
}

const GpuNotAvaliable = () => {
    return (
        <div className="text-sm text-muted-foreground">
            GPU info not available
        </div>
    );
}

const GpuInfo = ({ gpu }: { gpu: GpuInfo }) => {
    const vramUsagePercentage = gpu.vram_total_mb ? (gpu.vram_used_mb / gpu.vram_total_mb) * 100 : 0;
    const formattedGpusagePercentage = Math.round(gpu.usage_percentage);

    return (
        <div className="space-y-1">
            <h2>Usage</h2>

            <div className='flex gap-2 items-center'>
                <Progress value={formattedGpusagePercentage} />
                <p>{formattedGpusagePercentage}%</p>
            </div>

            <h2>VRAM</h2>

            <div className="flex items-center gap-2">
                <p>{gpu.vram_used_mb}mb</p>
                <Progress value={vramUsagePercentage} />
                <p>{gpu.vram_total_mb}mb</p>
            </div>
        </div>
    );
}

export const GPUCard: React.FC<GPUCardProps> = ({ gpuUsage }) => {
    return (
        <Card>
            <CardHeader>
                {gpuUsage?.name && <CardTitle>GPU - {gpuUsage.name}</CardTitle>}
            </CardHeader>
            <CardContent>
                {gpuUsage ? <GpuInfo gpu={gpuUsage} /> : <GpuNotAvaliable />}
            </CardContent>
        </Card>
    );
};