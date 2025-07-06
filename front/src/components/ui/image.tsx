import { cn } from "@/lib/utils"
import { useEffect, useState, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton"

export interface ImageProps extends React.HTMLAttributes<HTMLImageElement> {
    src?: string;
    alt: string;
    loading?: "lazy" | "eager";
    timeout?: number;
}

const defaultImage = "/assets/images/no-image.jpeg";

function ImageComponent({
    src = defaultImage,
    alt,
    className,
    loading = 'lazy',
    timeout = 5000,
    ...restProps
}: ImageProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [imageSrc, setImageSrc] = useState(src);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        setImageLoaded(false);
        setImageError(false);
        setImageSrc(src);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        if (!src) {
            setImageSrc(defaultImage);
            setImageError(false);
            setImageLoaded(false);
            return;
        }

        if (src && src !== defaultImage) {
            timeoutRef.current = setTimeout(() => {
                handleError();
            }, timeout);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [src, timeout]);

    const handleLoad = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        setImageLoaded(true);
    };

    const handleError = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        if (imageSrc !== defaultImage) {
            setImageSrc(defaultImage);
            setImageError(false);
            setImageLoaded(false);
        } else {
            setImageError(true);
            setImageLoaded(true);
        }
    };

    return (
        <div className={cn("relative w-full h-full", className)}>
            {!imageLoaded && !imageError && (
                <Skeleton className="w-full h-full absolute inset-0" />
            )}

            {imageError ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                    <span className="text-sm">Failed to load image</span>
                </div>
            ) : (
                <img
                    ref={imgRef}
                    src={imageSrc}
                    alt={alt}
                    className={cn(
                        "object-cover w-full h-full transition-opacity duration-200",
                        !imageLoaded && "opacity-0"
                    )}
                    loading={loading}
                    onLoad={handleLoad}
                    onError={handleError}
                    {...restProps}
                />
            )}
        </div>
    );
}

export default ImageComponent;