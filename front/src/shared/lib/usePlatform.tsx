import { useMemo } from "react";

export const isPlatform = {
    web: () => typeof window === 'undefined' || !window.isTauri,
    desktop: () => typeof window !== 'undefined' && !!window.isTauri,
    mobile: () => typeof window !== 'undefined' && !!window.isTauri && /Mobile|Android|iOS/.test(navigator.userAgent)
};

export type Platform = 'web' | 'desktop' | 'mobile';

export const getCurrentPlatform = (): Platform => {
    if (typeof window !== 'undefined' && window.isTauri) {
        if (/Mobile|Android|iOS/.test(navigator.userAgent)) return 'mobile';
        return 'desktop';
    }
    return 'web';
};

function usePlatform() {
    const platform = useMemo(() => getCurrentPlatform(), []);

    return {
        platform,
        isDesktop: platform === 'desktop',
        isWeb: platform === 'web',
        isMobile: platform === 'mobile'
    };
}

export default usePlatform;