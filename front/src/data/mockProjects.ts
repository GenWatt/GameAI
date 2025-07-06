import type { IAsset, IMessage, IConversation, IProject } from "@/shared/types";

const BrickPng = '/assets/images/brick.png';
const Audio = '/assets/audio/sample-3s.mp3';
const RoomFBX = '/assets/3d/room.fbx';

// Helper to create IDs
const createId = () => Math.random().toString(36).substring(2, 15);

// Create some assets
const assets: IAsset[] = [
    {
        id: createId(),
        messageId: 'msg1',
        name: 'brick.png',
        type: 'image',
        url: BrickPng,
        createdAt: '2025-05-01T14:30:22Z',
        updatedAt: '2025-05-01T14:30:22Z',
    },
    {
        id: createId(),
        messageId: 'msg2',
        name: 'environment_design.png',
        type: 'image',
        url: 'https://example.com/images/environment_design.png',
        createdAt: '2025-05-02T10:15:30Z',
        updatedAt: '2025-05-02T10:15:30Z',
    },
    {
        id: createId(),
        messageId: 'msg4',
        name: 'room.fbx',
        type: '3d-model',
        url: RoomFBX,
        createdAt: '2025-05-05T16:42:10Z',
        updatedAt: '2025-05-05T16:42:10Z',
    },
    {
        id: createId(),
        messageId: 'msg6',
        name: 'battle_sound.mp3',
        type: 'audio',
        url: Audio,
        createdAt: '2025-05-10T11:23:45Z',
        updatedAt: '2025-05-10T11:23:45Z',
    },
    {
        id: createId(),
        messageId: 'msg7',
        name: 'character_3d.glb',
        type: '3d-model',
        url: RoomFBX,
        createdAt: '2025-05-12T09:18:22Z',
        updatedAt: '2025-05-12T09:18:22Z',
    },
];

// Create messages
const createMessages = (conversationId: string, count: number): IMessage[] => {
    const messages: IMessage[] = [];

    for (let i = 0; i < count; i++) {
        const id = `msg${messages.length + 1}`;
        const isEven = i % 2 === 0;

        messages.push({
            id,
            conversationId,
            content: isEven
                ? `Here is my idea for the game: ${Math.random().toString(36).substring(2, 10)}`
                : `That's a great concept! I would recommend ${Math.random().toString(36).substring(2, 10)}`,
            role: isEven ? 'user' : 'assistant',
            createdAt: new Date(Date.now() - (count - i) * 86400000).toISOString(),
            updatedAt: new Date(Date.now() - (count - i) * 86400000).toISOString(),
            assets: assets.filter(asset => asset.messageId === id),
        });
    }

    return messages;
};

// Create conversations
const createConversations = (projectId: string, count: number): IConversation[] => {
    const conversations: IConversation[] = [];

    const topics = [
        'Character Design',
        'Environment Concept',
        'Game Mechanics',
        'Story Development',
        'Sound Design',
        'Level Design',
        'Enemy AI Behavior',
        'UI/UX Design',
        'Combat System'
    ];

    for (let i = 0; i < count; i++) {
        const id = `conv${conversations.length + 1}`;
        const created = new Date(Date.now() - (count - i) * 172800000);
        const updated = new Date(created.getTime() + 86400000);

        conversations.push({
            id,
            projectId,
            title: topics[i % topics.length],
            createdAt: created.toISOString(),
            updatedAt: updated.toISOString(),
            messages: createMessages(id, Math.floor(Math.random() * 5) + 3),
        });
    }

    return conversations;
};

// Create projects
export const mockProjects: IProject[] = [
    {
        id: 'proj1',
        name: 'Galactic Odyssey',
        description: 'A sci-fi action RPG set in a distant galaxy where players navigate political intrigue and ancient alien mysteries.',
        imageUrl: '/assets/images/odysay.png',
        type: 'default',
        createdAt: '2025-04-20T08:30:00Z',
        updatedAt: '2025-06-01T14:22:10Z',
        conversations: createConversations('proj1', 4),
    },
    {
        id: 'proj2',
        name: 'Mythic Realms',
        description: 'Fantasy strategy game where players build civilizations based on mythological creatures and deities.',
        imageUrl: 'https://example.com/projects/mythic_realms.jpg',
        type: 'default',
        createdAt: '2025-03-15T10:45:00Z',
        updatedAt: '2025-05-28T09:14:30Z',
        conversations: createConversations('proj2', 3),
    },
    {
        id: 'proj3',
        name: 'Neon Shadows',
        description: 'Cyberpunk stealth game set in a dystopian future where megacorporations control society.',
        imageUrl: 'https://example.com/projects/neon_shadows.jpg',
        type: 'special',
        createdAt: '2025-05-01T16:20:00Z',
        updatedAt: '2025-06-10T11:05:45Z',
        conversations: createConversations('proj3', 5),
    },
    {
        id: 'proj4',
        name: 'Temporal Tactics',
        description: 'A turn-based strategy game where players can manipulate time to gain tactical advantages.',
        imageUrl: 'https://example.com/projects/temporal_tactics.jpg',
        type: 'default',
        createdAt: '2025-02-28T09:10:00Z',
        updatedAt: '2025-05-15T17:30:20Z',
        conversations: createConversations('proj4', 2),
    }
];

export default mockProjects;