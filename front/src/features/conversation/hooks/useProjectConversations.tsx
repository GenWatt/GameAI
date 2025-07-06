import { useState, useEffect } from 'react';
import type { IProject } from '@/shared/types';

interface UseProjectConversationsOptions {
    project: IProject | null;
}

export const useProjectConversations = ({
    project,
}: UseProjectConversationsOptions) => {
    const [activeConversationId, setActiveConversationId] = useState<string | undefined>(
        project?.conversations.length ? project.conversations[0].id : undefined
    );

    const activeConversation = project?.conversations.find(
        conversation => conversation.id === activeConversationId
    );

    useEffect(() => {
        if (project && !activeConversationId && project.conversations.length > 0) {
            setActiveConversationId(project.conversations[0].id);
        }
    }, [project, activeConversationId]);

    return {
        activeConversationId,
        activeConversation,
        setActiveConversationId
    };
};