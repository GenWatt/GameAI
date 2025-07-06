import { useParams } from 'react-router';
import { useProject } from '@/features/project';
import {
    ChatConversation,
    ConversationHistory,
    useProjectConversations
} from '@/features/conversation';
import ChatInput from '@/features/conversation/components/ChatInput';
import { useRef } from 'react';
import { Loader } from '@/components/ui/loader';

const NoActiveConversation = () => (
    <div className="h-full flex items-center justify-center border rounded-md bg-card">
        <div className="text-center p-6">
            <h3 className="text-xl font-medium">No active conversation</h3>
            <p className="text-muted-foreground">
                Select an existing conversation or create a new one to get started
            </p>
        </div>
    </div>
);

export default function ProjectDetailPage() {
    const { projectId } = useParams<{ projectId: string }>();
    const conversationContainerRef = useRef<HTMLDivElement>(null);

    const { project, loading, error } = useProject({ projectId: projectId! });

    const conversations = useProjectConversations({
        project: project!
    });

    const onSendMessage = (content: string, conversationId: string) => {
        console.log('Sending message:', content, 'to conversation:', conversationId);
    }

    const onUploadFile = (file: File) => {
        console.log('Uploading file:', file);
    }

    if (loading) {
        return <Loader className='pt-6' />
    }

    if (error || !project) {
        return <div className="flex justify-center pt-6">
            <p className='text-2xl font-bold'>{error?.message || 'Project not found'}</p>
        </div>;
    }

    return (
        <div className='h-full'>
            <div className='flex gap-2 w-full h-full' ref={conversationContainerRef}>
                <div className="flex-1/4 max-w-72 bg-card p-2">
                    <h2 className='text-xl mb-1 font-bold'>{project.name}</h2>
                    <p className='text-background mb-1 py-1 bg-primary rounded-md p-1'>{project.description}</p>
                    <ConversationHistory
                        conversations={project.conversations}
                    // activeConversationId={conversations.activeConversationId}
                    // onConversationSelect={conversations.setActiveConversationId}
                    // onNewConversation={conversations.handleNewConversation}
                    />
                </div>

                {/* div conversation area */}
                <div className="flex flex-col flex-1 items-center my-2">
                    {conversations.activeConversation ? (
                        <div className='max-w-7xl w-full h-full justify-between flex flex-col'>
                            <div className="flex-1 overflow-hidden">
                                <ChatConversation conversation={conversations.activeConversation} />
                            </div>
                            <div className="mt-2">
                                <ChatInput
                                    conversation={conversations.activeConversation}
                                    onSendMessage={onSendMessage}
                                    onUploadFile={onUploadFile}
                                />
                            </div>
                        </div>
                    ) : (
                        <NoActiveConversation />
                    )}
                </div>
            </div>
        </div>
    );
}