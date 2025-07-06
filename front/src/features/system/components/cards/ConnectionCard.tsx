import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { StatusType } from '@/shared/api/stores/useConnectionStore';

interface ConnectionCardProps {
    online?: boolean;
    connectionType?: string;
    serverStatus?: StatusType;
}

export const ConnectionCard: React.FC<ConnectionCardProps> = ({ connectionType, online, serverStatus }) => {

    const serverStatusText = serverStatus === 'loading' ? 'Connecting...' : serverStatus === 'online' ? 'Server is online' : 'Server is Offline';

    return (
        <Card>
            <CardHeader>
                <CardTitle>Connection</CardTitle>
            </CardHeader>
            <CardContent>
                <Badge variant={online ? 'default' : 'destructive'}>
                    {connectionType}
                </Badge>

                <div className="mt-2">
                    <Badge variant={serverStatus ? 'default' : 'destructive'}>
                        {serverStatusText}
                    </Badge>
                </div>

            </CardContent>
        </Card>
    );
};
