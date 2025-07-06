import { Button } from "@/components/ui/button";
import type { IAsset } from "@/shared/types";
import { Download, Music, Box, FileText } from "lucide-react";
import ModelViewer from "./ModelViewer";
import { Separator } from "@/components/ui/separator";

interface AssetPreviewProps {
    asset: IAsset;
}

export const AssetPreview: React.FC<AssetPreviewProps> = ({ asset }) => {
    switch (asset.type) {
        case 'image':
            return (
                <div className="relative group">
                    <img
                        src={asset.url}
                        alt={asset.name}
                        className="max-h-40 rounded-md border border-border object-cover"
                    />
                    <a
                        href={asset.url}
                        download={asset.name}
                        className="absolute inset-0 flex items-center justify-center bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md"
                    >
                        <Download className="h-5 w-5 text-primary" />
                    </a>
                </div>
            );

        case 'audio':
            return (
                <div className="bg-muted border border-border rounded-md p-2 flex items-center gap-2">
                    <Music className="h-4 w-4 text-primary" />
                    <span className="text-sm truncate max-w-[180px]">{asset.name}</span>
                    <audio controls className="h-8 w-32">
                        <source src={asset.url} />
                    </audio>
                </div>
            );

        case '3d-model':
            return (
                <div className="bg-muted border border-border rounded-md p-2 items-center gap-2 w-100">
                    <ModelViewer url={asset.url} />
                    <Separator className="w-full mt-1" />
                    <div className='flex justify-between gap-2 mt-2 bg-accent'>
                        <div className='flex items-center gap-1'>
                            <Box className="h-4 w-4 text-primary" />
                            <span className="text-sm truncate">{asset.name}</span>
                        </div>

                        <a
                            download={asset.name}
                            target="_blank"
                            href={asset.url}
                            rel="noopener noreferrer">
                            <Button
                                variant="link"
                                className="text-primary hover:text-primary/80 text-sm ml-auto"
                            >
                                Download
                            </Button>
                        </a>
                    </div>
                </div>
            );

        default:
            return (
                <div className="bg-muted border border-border rounded-md p-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm truncate max-w-[200px]">{asset.name}</span>
                    <a
                        href={asset.url}
                        download={asset.name}
                        className="text-primary hover:text-primary/80 text-sm ml-auto"
                    >
                        <Download className="h-4 w-4" />
                    </a>
                </div>
            );
    }
};