import React from 'react';
import { useModelViewer } from '../hooks/useModelViewer';

export interface ModelViewerProps {
    url: string;
    className?: string;
}

export const ModelViewer: React.FC<ModelViewerProps> = ({
    url,
    className = "h-[400px] w-full"
}) => {
    const { fileExists, error, containerRef, loading } = useModelViewer({ url });

    if (fileExists === false) {
        return (
            <div className={`${className} border rounded-md bg-yellow-50 flex items-center justify-center`}>
                <div className="text-center p-4">
                    <p className="text-yellow-700 font-medium">File not found</p>
                    <p className="text-yellow-600 text-sm mt-1">{url}</p>
                    <p className="text-yellow-600 text-xs mt-2">Check if the file exists in the public folder</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`${className} border rounded-md bg-red-50 flex items-center justify-center`}>
                <div className="text-center p-4">
                    <p className="text-red-600 font-medium">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`${className} rounded-md relative`}>
            <div ref={containerRef} className="w-full h-full" />


            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                        <p className="text-sm text-foreground">
                            {fileExists === null ? 'Checking file...' : 'Loading 3D model...'}
                        </p>
                    </div>
                </div>
            )}

            {!loading && !error && (
                <div className="absolute bottom-2 right-2 bg-black/30 text-white text-xs px-2 py-1 rounded">
                    Drag: rotate | Scroll: zoom
                </div>
            )}
        </div>
    );
};

export default ModelViewer;