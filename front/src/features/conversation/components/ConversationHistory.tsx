import React, { useState, useEffect } from 'react';

import { ConversationHistoryList } from './ConversationHistoryList';
import { ConversationHistorySheet } from './ConversationHistorySheet';
import type { IConversation } from '@/shared/types';

interface ConversationHistoryProps {
    conversations: IConversation[];
    selectedConversationId?: string;
    onSelectConversation?: (conversation: IConversation) => void;
    onDeleteConversation?: (conversationId: string) => void;
    onRenameConversation?: (conversationId: string, newTitle: string) => void;
    className?: string;
    showActions?: boolean;
    breakpoint?: string;
}

const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches);
        window.addEventListener("resize", listener);
        return () => window.removeEventListener("resize", listener);
    }, [matches, query]);

    return matches;
};

export const ConversationHistory: React.FC<ConversationHistoryProps> = ({
    conversations = [],
    selectedConversationId,
    onSelectConversation,
    onDeleteConversation,
    onRenameConversation,
    className = '',
    showActions = true,
    breakpoint = '(min-width: 768px)'
}) => {
    const isDesktop = useMediaQuery(breakpoint);

    const commonProps = {
        conversations,
        selectedConversationId,
        onSelectConversation,
        onDeleteConversation,
        onRenameConversation,
        showActions
    };

    if (isDesktop) {
        return (
            <ConversationHistoryList
                {...commonProps}
                className={className}
                compact={false}
            />
        );
    }

    return (
        <ConversationHistorySheet
            conversations={conversations}
            onSelectConversation={onSelectConversation}
        />
    );
};

export default ConversationHistory;