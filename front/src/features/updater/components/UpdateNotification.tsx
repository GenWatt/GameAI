import { useAppUpdater } from '@/features/updater/hooks/useUpdater';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Download, RefreshCw, X, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';

export const UpdateNotification: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const {
    updateAvailable,
    isUpdating,
    updateProgress,
    error,
    checkForUpdates,
    downloadAndInstall,
  } = useAppUpdater();

  useEffect(() => {
    checkForUpdates();
  }, [checkForUpdates]);

  if ((!updateAvailable && !isUpdating) || dismissed) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 bg-card border border-border rounded-lg p-4 shadow-lg z-50 max-w-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Download className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-sm">Update Available</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDismissed(true)}
          className="h-6 w-6 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {error ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
          <Button
            onClick={checkForUpdates}
            size="sm"
            variant="outline"
            className="w-full"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      ) : isUpdating ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Downloading update... {Math.round(updateProgress)}%
          </p>
          <Progress value={updateProgress} className="w-full" />
          <p className="text-xs text-muted-foreground">
            App will restart automatically when complete
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            A new version is available. Update now for the latest features and fixes.
          </p>
          <div className="flex gap-2">
            <Button
              onClick={downloadAndInstall}
              size="sm"
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Update
            </Button>
            <Button
              onClick={() => setDismissed(true)}
              size="sm"
              variant="outline"
            >
              Later
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
