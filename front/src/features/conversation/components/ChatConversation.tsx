import React from 'react';
import type { IConversation } from '@/shared/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './ChatMessage';

interface ChatConversationProps {
    conversation: IConversation;
}

export const ChatConversation: React.FC<ChatConversationProps> = ({
    conversation,
}) => {
    return (
        <div className="flex flex-col h-full border rounded-md bg-card">
            <div className="p-2 border-b flex items-center bg-accent rounded-md">
                <h2 className="text-md font-semibold">{conversation.title}</h2>
            </div>

            <div className="flex-1 min-h-0">
                <ScrollArea className="p-4 h-full">
                    <div className="flex flex-col gap-4">
                        {conversation.messages.map((message) => (
                            <ChatMessage key={message.id} message={message} />
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
};