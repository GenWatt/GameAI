import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface CPUCardProps {
    cpuCores: number | null;
    cpuUage?: number | null;
    cpuName: string | null;
}

export const CPUCard: React.FC<CPUCardProps> = ({ cpuCores, cpuUage, cpuName }) => {
    const formattedCpuUsage = cpuUage ? Math.round(cpuUage) : null;

    return (
        <Card>
            <CardHeader>
                {cpuName && <CardTitle>CPU - {cpuName}</CardTitle>}
            </CardHeader>
            <CardContent>
                <div className="space-y-1 flex gap-2 items-center">
                    <p className="text-lg font-semibold">
                        {cpuCores ? `${cpuCores} cores` : 'Unknown'}
                    </p>

                    {formattedCpuUsage && <Progress value={formattedCpuUsage} />}
                    <span> {formattedCpuUsage}%</span>
                </div>
            </CardContent>
        </Card>
    );
};