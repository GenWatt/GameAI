import React from 'react';
import type { IMessage } from '@/shared/types';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Bot, User } from 'lucide-react';
import { AssetPreview } from '@/shared/assetsDisplay/components/AssetsPreview';

interface ChatMessageProps {
    message: IMessage;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isBot = message.role === 'assistant';

    return (
        <div className={`flex gap-3 ${isBot ? '' : 'flex-row-reverse'}`}>
            <Avatar className={`h-8 w-8 ${isBot ? 'bg-primary' : 'bg-secondary'} items-center justify-center`}>
                {isBot ? <Bot className="h-4 w-4 text-secondary" /> : <User className="h-4 w-4" />}
            </Avatar>

            <div className={`flex flex-col max-w-[80%] ${isBot ? '' : 'items-end'}`}>
                <Card className={`px-4 py-3 ${isBot
                    ? 'bg-muted border-muted'
                    : 'bg-primary/10 border-primary/20'
                    }`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                </Card>

                {message.assets.length > 0 && (
                    <div className={`flex flex-wrap gap-2 mt-2 ${isBot ? '' : 'justify-end'}`}>
                        {message.assets.map(asset => (
                            <AssetPreview key={asset.id} asset={asset} />
                        ))}
                    </div>
                )}

                <span className="text-xs text-muted-foreground mt-1">
                    {new Date(message.createdAt).toLocaleTimeString()}
                </span>
            </div>
        </div>
    );
};

