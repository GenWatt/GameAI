import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface MemoryCardProps {
    memoryUsage: number | null;
    memoryLimit: number | null;
    memoryPercentage: number | null;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({ memoryLimit, memoryPercentage, memoryUsage }) => {
    const formattedMemoryPercentage = memoryPercentage ? Math.round(memoryPercentage) : null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>RAM</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm gap-3">
                        {memoryUsage && <span>Used: {memoryUsage} MB</span>}
                        {formattedMemoryPercentage && <span>{formattedMemoryPercentage}%</span>}
                    </div>

                    {formattedMemoryPercentage && <Progress value={formattedMemoryPercentage} />}

                    <p className="text-xs">
                        {memoryLimit} MB
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};