import React, { useEffect, useState } from 'react';
import type { IConversation } from '@/shared/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '@/components/ui/sheet';
import {
    MessageSquareIcon,
    History
} from 'lucide-react';
import ConversationHistoryList from './ConversationHistoryList';

interface ConversationHistoryProps {
    conversations: IConversation[];
    onSelectConversation?: (conversation: IConversation) => void;
}

export const ConversationHistorySheet: React.FC<ConversationHistoryProps> = ({
    conversations = [],
    onSelectConversation
}) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === 'h') {
                event.preventDefault();
                setOpen((prev) => !prev);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                    <History className="h-4 w-4" />
                </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <span className="flex items-center gap-2">
                            <MessageSquareIcon className="h-5 w-5" />
                            Conversation History
                        </span>
                        <Badge variant="secondary" className="text-xs">
                            Ctrl+H
                        </Badge>
                    </SheetTitle>
                </SheetHeader>

                <ScrollArea className="flex-1 h-[calc(100vh-150px)]">
                    <div className="space-y-2 p-2">
                        {conversations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                                <MessageSquareIcon className="h-12 w-12 mb-2 opacity-50" />
                                <p className="text-lg font-medium">No conversations found</p>
                                <p className="text-sm">Your conversation history will appear here</p>
                            </div>
                        ) : (
                            <ConversationHistoryList
                                conversations={conversations}
                                onSelectConversation={onSelectConversation} />
                        )}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
};

export default ConversationHistorySheet;