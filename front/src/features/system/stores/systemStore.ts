import { create } from 'zustand';
import type { DesktopSystemInfo } from '../types';

interface SystemState {
    system: DesktopSystemInfo | null;
    setSystemInfo: (info: DesktopSystemInfo) => void;
    clearSystemInfo: () => void;
}

const useSystemStore = create<SystemState>((set) => ({
    system: null,
    setSystemInfo: (info: DesktopSystemInfo) => set(() => ({
        system: info
    })),
    clearSystemInfo: () => set(() => ({ system: null }))
}));

export default useSystemStore;