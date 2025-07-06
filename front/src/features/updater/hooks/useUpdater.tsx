import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';
import { useState } from 'react';

export const useAppUpdater = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const checkForUpdates = async () => {
    try {
      setError(null);
      const update = await check();
      
      if (update) {
        setUpdateAvailable(true);
        return update;
      }
      
      return null;
    } catch (err) {
        console.error('Check for updates error:', err);
      setError(err instanceof Error ? err.message : 'Failed to check for updates');
      return null;
    }
  };

  const downloadAndInstall = async () => {
    try {
      setIsUpdating(true);
      setError(null);
      
      const update = await check();
      
      if (update) {
        await update.downloadAndInstall((event) => {
          switch (event.event) {
            case 'Started':
              setUpdateProgress(0);
              break;
            case 'Progress':
                // @ts-expect-error contentLength is defined
              setUpdateProgress(event.data.chunkLength / event.data.contentLength * 100);
              break;
            case 'Finished':
              setUpdateProgress(100);
              break;
          }
        });

        await relaunch();
      }
    } catch (err) {
        console.error('Update error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateAvailable,
    isUpdating,
    updateProgress,
    error,
    checkForUpdates,
    downloadAndInstall,
  };
};