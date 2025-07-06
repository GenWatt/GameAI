import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ErrorCardProps {
    error: string;
}

export const ErrorCard: React.FC<ErrorCardProps> = ({ error }) => {
    return (
        <Card className="border-destructive">
            <CardContent className="pt-6">
                <p className="text-destructive">Error: {error}</p>
            </CardContent>
        </Card>
    );
};