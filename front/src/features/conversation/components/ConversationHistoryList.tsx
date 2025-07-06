import React from 'react';
import type { IConversation } from '@/shared/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    MessageSquareIcon,
    ClockIcon,
    Trash2Icon,
    MoreVerticalIcon,
    PencilIcon
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ConversationHistoryListProps {
    conversations: IConversation[];
    selectedConversationId?: string;
    onSelectConversation?: (conversation: IConversation) => void;
    onDeleteConversation?: (conversationId: string) => void;
    onRenameConversation?: (conversationId: string, newTitle: string) => void;
    className?: string;
    showActions?: boolean;
    compact?: boolean;
}

interface ConversationItemProps {
    conversation: IConversation;
    isSelected?: boolean;
    onSelect?: (conversation: IConversation) => void;
    onDelete?: (conversationId: string) => void;
    onRename?: (conversationId: string, newTitle: string) => void;
    showActions?: boolean;
    compact?: boolean;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
    conversation,
    isSelected = false,
    onSelect,
    onDelete,
    onRename,
    showActions = true,
    compact = false
}) => {
    const handleRename = () => {
        const newTitle = prompt('Enter new title:', conversation.title);
        if (newTitle && newTitle.trim() !== conversation.title) {
            onRename?.(conversation.id, newTitle.trim());
        }
    };

    const formatDate = (date: string) => {
        const now = new Date();
        const messageDate = new Date(date);
        const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
        if (diffInHours < 48) return 'Yesterday';
        return messageDate.toLocaleDateString();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
        >
            <Card
                className={cn(
                    'cursor-pointer transition-all duration-200 group relative',
                    'border-border hover:border-primary/30',
                    isSelected
                        ? 'bg-primary/5 border-primary shadow-sm'
                        : 'hover:bg-muted/30',
                    compact ? 'p-2' : 'p-3',
                    'overflow-hidden'
                )}
                onClick={() => onSelect?.(conversation)}
            >
                {isSelected && (
                    <div className="absolute inset-y-0 left-0 w-1 bg-primary rounded-r-md" />
                )}

                <CardHeader className={cn(
                    'p-0',
                    compact ? 'space-y-1' : 'space-y-2'
                )}>
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0 space-y-1">
                            <CardTitle className={cn(
                                'truncate font-medium',
                                compact ? 'text-sm' : 'text-base',
                                isSelected ? 'text-primary' : 'text-foreground'
                            )}>
                                {conversation.title}
                            </CardTitle>

                            <CardDescription className={cn(
                                'flex items-center gap-4',
                                compact ? 'text-xs' : 'text-sm'
                            )}>
                                <span className="flex items-center gap-1.5">
                                    <ClockIcon className={cn(
                                        'flex-shrink-0',
                                        compact ? 'h-3 w-3' : 'h-4 w-4'
                                    )} />
                                    {formatDate(conversation.updatedAt)}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <MessageSquareIcon className={cn(
                                        'flex-shrink-0',
                                        compact ? 'h-3 w-3' : 'h-4 w-4'
                                    )} />
                                    {conversation.messages.length} messages
                                </span>
                            </CardDescription>
                        </div>

                        {showActions && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size={compact ? 'sm' : 'default'}
                                        className={cn(
                                            'opacity-0 group-hover:opacity-100 transition-opacity',
                                            'hover:bg-background',
                                            compact ? 'h-7 w-7' : 'h-9 w-9'
                                        )}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <MoreVerticalIcon className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRename();
                                        }}
                                        className="gap-2"
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                        Rename
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete?.(conversation.id);
                                        }}
                                        className="gap-2 text-destructive"
                                    >
                                        <Trash2Icon className="h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </CardHeader>
            </Card>
        </motion.div>
    );
};

const EmptyState: React.FC<{ compact?: boolean }> = ({ compact = false }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={cn(
            'flex flex-col items-center justify-center text-center',
            'text-muted-foreground p-4',
            compact ? 'h-24' : 'h-40'
        )}
    >
        <div className="relative">
            <MessageSquareIcon className={cn(
                'mb-3 text-muted-foreground/50',
                compact ? 'h-8 w-8' : 'h-12 w-12'
            )} />
            <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
        </div>
        <h3 className={cn(
            'font-medium mb-1',
            compact ? 'text-sm' : 'text-lg'
        )}>
            No conversations yet
        </h3>
        <p className={cn(
            'text-muted-foreground/70',
            compact ? 'text-xs' : 'text-sm'
        )}>
            Start a new conversation to see it here
        </p>
    </motion.div>
);

export const ConversationHistoryList: React.FC<ConversationHistoryListProps> = ({
    conversations = [],
    selectedConversationId,
    onSelectConversation,
    onDeleteConversation,
    onRenameConversation,
    className = '',
    showActions = true,
    compact = false
}) => {
    return (
        <div className={cn(
            'flex flex-col h-full',
            className
        )}>
            <ScrollArea className="flex-1">
                <div className={cn(
                    'space-y-2',
                )}>
                    {conversations.length === 0 ? (
                        <EmptyState compact={compact} />
                    ) : (
                        conversations.map((conversation) => (
                            <ConversationItem
                                key={conversation.id}
                                conversation={conversation}
                                isSelected={selectedConversationId === conversation.id}
                                onSelect={onSelectConversation}
                                onDelete={onDeleteConversation}
                                onRename={onRenameConversation}
                                showActions={showActions}
                                compact={compact}
                            />
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    );
};

export default ConversationHistoryList;