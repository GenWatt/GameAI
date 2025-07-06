export interface IConversation {
    id: string;
    projectId: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    messages: IMessage[];
}

export interface IAsset {
    id: string;
    messageId: string;
    name: string;
    type: 'image' | 'audio' | '3d-model';
    url: string;
    createdAt: string;
    updatedAt: string;
}

export interface IMessage {
    id: string;
    conversationId: string;
    content: string;
    role: 'user' | 'assistant';
    createdAt: string;
    updatedAt: string;
    assets: IAsset[];
}

export interface IProject {
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    type: 'default' | 'special';
    createdAt: string;
    updatedAt: string;
    conversations: IConversation[];
}