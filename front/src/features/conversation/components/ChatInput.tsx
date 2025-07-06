import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { IConversation } from '@/shared/types';
import { PaperclipIcon, SendIcon } from 'lucide-react';
import React, { useRef } from 'react'

interface ChatInputProps {
    conversation: IConversation;
    onSendMessage: (content: string, conversationId: string) => void;
    onUploadFile?: (file: File, conversationId: string) => void;
}

function ChatInput({ conversation, onSendMessage, onUploadFile }: ChatInputProps) {
    const [messageInput, setMessageInput] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim()) return;

        setIsLoading(true);
        try {
            onSendMessage(messageInput, conversation.id);
            setMessageInput('');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files.length) return;

        const file = e.target.files[0];
        if (!file) return;

        if (onUploadFile) {
            setIsLoading(true);
            try {
                onUploadFile(file, conversation.id);
            } finally {
                setIsLoading(false);
            }
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,audio/*,.glb,.gltf,.obj,.fbx"
            />

            <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
            >
                <PaperclipIcon className="h-4 w-4" />
            </Button>

            <Input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isLoading}
            />

            <Button type="submit" disabled={isLoading || !messageInput.trim()}>
                <SendIcon className="h-4 w-4" />
                <span className='sm:hidden block ml-2'>Send</span>
            </Button>
        </form>
    )
}

export default ChatInput