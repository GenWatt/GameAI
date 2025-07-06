import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import usePlatform from '@/shared/lib/usePlatform';
import type { DesktopSystemInfo } from '../types';
import useSystemStore from '../stores/systemStore';

export interface UseSystemStatusReturn {
    system: DesktopSystemInfo | null;
    updateStatus: () => Promise<void>;
    refreshStatus: () => Promise<void>;
    loading: boolean;
    error: string | null;
    refreshing: boolean;
}

class SystemStatusManager {
    private static instance: SystemStatusManager;
    private interval: NodeJS.Timeout | null = null;
    private subscribers = new Set<(data: DesktopSystemInfo | null, error: string | null) => void>();
    private isUpdating = false;
    private refreshInterval = 1000;

    static getInstance(): SystemStatusManager {
        if (!SystemStatusManager.instance) {
            SystemStatusManager.instance = new SystemStatusManager();
        }
        return SystemStatusManager.instance;
    }

    subscribe(callback: (data: DesktopSystemInfo | null, error: string | null) => void, refreshInterval?: number): void {
        this.subscribers.add(callback);

        if (this.subscribers.size === 1) {
            if (refreshInterval && refreshInterval !== this.refreshInterval) {
                this.setRefreshInterval(refreshInterval);
            }

            if (!this.interval) this.startInterval();
        }
    }

    unsubscribe(callback: (data: DesktopSystemInfo | null, error: string | null) => void): void {
        this.subscribers.delete(callback);

        if (this.subscribers.size === 0 && this.interval) {
            this.stopInterval();
        }
    }

    private startInterval(): void {
        if (this.interval) return;

        this.updateSystemStatus();

        this.interval = setInterval(() => {
            console.log('SystemStatusManager: Updating system status');
            this.updateSystemStatus();
        }, this.refreshInterval);
    }

    private stopInterval(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    private async updateSystemStatus(): Promise<void> {
        if (this.isUpdating) return;

        this.isUpdating = true;

        try {
            const systemInfo = await invoke<DesktopSystemInfo>('get_system_status');
            this.subscribers.forEach(callback => callback(systemInfo, null));

        } catch (err) {
            const error = err instanceof Error ? err.message : 'Failed to fetch system status';

            this.subscribers.forEach(callback => callback(null, error));

        } finally {
            this.isUpdating = false;
        }
    }

    setRefreshInterval(interval: number): void {
        this.refreshInterval = interval;

        if (this.interval) {
            this.stopInterval();
            this.startInterval();
        }
    }

    async triggerUpdate(): Promise<void> {
        await this.updateSystemStatus();
    }
}

export const useSystemStatus = (refreshInterval: number = 1000): UseSystemStatusReturn => {
    const { isDesktop } = usePlatform();
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { system, setSystemInfo, clearSystemInfo } = useSystemStore();

    const handleSystemUpdate = useCallback((data: DesktopSystemInfo | null, err: string | null) => {
        if (data) {
            setSystemInfo(data);
            setError(null);
        } else if (err) {
            setError(err);
            clearSystemInfo();
        }

        setRefreshing(false);
        setLoading(false);
    }, [setSystemInfo, clearSystemInfo]);

    const updateStatus = useCallback(async (): Promise<void> => {
        if (!isDesktop) {
            clearSystemInfo();
            return;
        }

        setRefreshing(true);
        const manager = SystemStatusManager.getInstance();
        await manager.triggerUpdate();
    }, [isDesktop, clearSystemInfo]);

    useEffect(() => {
        if (!isDesktop) {
            console.warn('System status is only available on desktop platforms.');
            clearSystemInfo();
            setLoading(false);
            setError(null);
            return;
        }

        console.log('useSystemStatus: Initializing system status manager');

        const manager = SystemStatusManager.getInstance();

        setLoading(true);

        manager.subscribe(handleSystemUpdate);

        return () => {
            manager.unsubscribe(handleSystemUpdate);
        };
    }, [isDesktop, handleSystemUpdate, refreshInterval, clearSystemInfo]);

    return {
        system,
        updateStatus,
        refreshStatus: updateStatus,
        loading,
        error,
        refreshing
    };
};