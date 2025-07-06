import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SystemInfoCardProps {
    osName: string | null
    osVersion: string | null
    batteryCharging?: boolean | null
    batteryLevel?: number | null
    timestamp?: string | null
}

export const SystemInfoCard: React.FC<SystemInfoCardProps> = ({
    osName,
    osVersion,
    batteryCharging = null,
    batteryLevel = null,
    timestamp = null
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>System Info</CardTitle>
            </CardHeader>

            <CardContent>
                <div className="space-y-1 text-sm">
                    {osName && <p><strong>Operating system:</strong> {osName}</p>}
                    {osVersion && <p><strong>Version:</strong> {osVersion}</p>}
                    {batteryLevel !== null && (
                        <p>
                            <strong>Battery:</strong> {batteryLevel}%
                            {batteryCharging !== null && (
                                <Badge variant={batteryCharging ? 'default' : 'outline'} className="ml-2">
                                    {batteryCharging ? 'Charging' : 'Not Charging'}
                                </Badge>
                            )}
                        </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                        Updated: {timestamp ? new Date(timestamp).toLocaleTimeString() : 'Never'}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};