import { useTheme } from '@/components/theme-provider';
import { useMemo } from 'react';

interface ThemeColors {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    popover: string;
    popoverForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    destructive: string;
    border: string;
    input: string;
    ring: string;
    chart1: string;
    chart2: string;
    chart3: string;
    chart4: string;
    chart5: string;
    sidebar: string;
    sidebarForeground: string;
    sidebarPrimary: string;
    sidebarPrimaryForeground: string;
    sidebarAccent: string;
    sidebarAccentForeground: string;
    sidebarBorder: string;
    sidebarRing: string;
}

const lightColors: ThemeColors = {
    background: 'oklch(1 0 0)',
    foreground: 'oklch(0.145 0 0)',
    card: 'oklch(1 0 0)',
    cardForeground: 'oklch(0.145 0 0)',
    popover: 'oklch(1 0 0)',
    popoverForeground: 'oklch(0.145 0 0)',
    primary: 'oklch(0.205 0 0)',
    primaryForeground: 'oklch(0.985 0 0)',
    secondary: 'oklch(0.97 0 0)',
    secondaryForeground: 'oklch(0.205 0 0)',
    muted: 'oklch(0.97 0 0)',
    mutedForeground: 'oklch(0.556 0 0)',
    accent: 'oklch(0.97 0 0)',
    accentForeground: 'oklch(0.205 0 0)',
    destructive: 'oklch(0.577 0.245 27.325)',
    border: 'oklch(0.922 0 0)',
    input: 'oklch(0.922 0 0)',
    ring: 'oklch(0.708 0 0)',
    chart1: 'oklch(0.646 0.222 41.116)',
    chart2: 'oklch(0.6 0.118 184.704)',
    chart3: 'oklch(0.398 0.07 227.392)',
    chart4: 'oklch(0.828 0.189 84.429)',
    chart5: 'oklch(0.769 0.188 70.08)',
    sidebar: 'oklch(0.985 0 0)',
    sidebarForeground: 'oklch(0.145 0 0)',
    sidebarPrimary: 'oklch(0.205 0 0)',
    sidebarPrimaryForeground: 'oklch(0.985 0 0)',
    sidebarAccent: 'oklch(0.97 0 0)',
    sidebarAccentForeground: 'oklch(0.205 0 0)',
    sidebarBorder: 'oklch(0.922 0 0)',
    sidebarRing: 'oklch(0.708 0 0)',
};

const darkColors: ThemeColors = {
    background: 'oklch(0.145 0 0)',
    foreground: 'oklch(0.985 0 0)',
    card: 'oklch(0.205 0 0)',
    cardForeground: 'oklch(0.985 0 0)',
    popover: 'oklch(0.205 0 0)',
    popoverForeground: 'oklch(0.985 0 0)',
    primary: 'oklch(0.922 0 0)',
    primaryForeground: 'oklch(0.205 0 0)',
    secondary: 'oklch(0.269 0 0)',
    secondaryForeground: 'oklch(0.985 0 0)',
    muted: 'oklch(0.269 0 0)',
    mutedForeground: 'oklch(0.708 0 0)',
    accent: 'oklch(0.269 0 0)',
    accentForeground: 'oklch(0.985 0 0)',
    destructive: 'oklch(0.704 0.191 22.216)',
    border: 'oklch(1 0 0 / 10%)',
    input: 'oklch(1 0 0 / 15%)',
    ring: 'oklch(0.556 0 0)',
    chart1: 'oklch(0.488 0.243 264.376)',
    chart2: 'oklch(0.696 0.17 162.48)',
    chart3: 'oklch(0.769 0.188 70.08)',
    chart4: 'oklch(0.627 0.265 303.9)',
    chart5: 'oklch(0.645 0.246 16.439)',
    sidebar: 'oklch(0.205 0 0)',
    sidebarForeground: 'oklch(0.985 0 0)',
    sidebarPrimary: 'oklch(0.488 0.243 264.376)',
    sidebarPrimaryForeground: 'oklch(0.985 0 0)',
    sidebarAccent: 'oklch(0.269 0 0)',
    sidebarAccentForeground: 'oklch(0.985 0 0)',
    sidebarBorder: 'oklch(1 0 0 / 10%)',
    sidebarRing: 'oklch(0.556 0 0)',
};

export const useThemeColors = () => {
    const { theme } = useTheme();

    const colors = useMemo(() => {
        // Check system theme if theme is 'system'
        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light';
            return systemTheme === 'dark' ? darkColors : lightColors;
        }

        return theme === 'dark' ? darkColors : lightColors;
    }, [theme]);

    return colors;
};

// Helper function to convert OKLCH to hex (for Three.js compatibility)
const oklchToHex = (oklch: string): string => {
    // For simplicity, we'll map common colors to hex equivalents
    // In a real app, you might want to use a color conversion library
    const colorMap: { [key: string]: string } = {
        // Light theme mappings
        'oklch(1 0 0)': '#ffffff',
        'oklch(0.145 0 0)': '#252525',
        'oklch(0.205 0 0)': '#353535',
        'oklch(0.985 0 0)': '#fbfbfb',
        'oklch(0.97 0 0)': '#f7f7f7',
        'oklch(0.556 0 0)': '#8e8e8e',
        'oklch(0.922 0 0)': '#ebebeb',
        'oklch(0.708 0 0)': '#b5b5b5',

        // Dark theme mappings
        'oklch(0.269 0 0)': '#454545',
        'oklch(1 0 0 / 10%)': '#ffffff1a',
        'oklch(1 0 0 / 15%)': '#ffffff26',

        // Chart colors
        'oklch(0.646 0.222 41.116)': '#ff6b35',
        'oklch(0.6 0.118 184.704)': '#4ecdc4',
        'oklch(0.398 0.07 227.392)': '#45b7d1',
        'oklch(0.828 0.189 84.429)': '#96ceb4',
        'oklch(0.769 0.188 70.08)': '#feca57',
        'oklch(0.488 0.243 264.376)': '#6c5ce7',
        'oklch(0.696 0.17 162.48)': '#55a3ff',
        'oklch(0.627 0.265 303.9)': '#fd79a8',
        'oklch(0.645 0.246 16.439)': '#e17055',

        // Destructive
        'oklch(0.577 0.245 27.325)': '#ef4444',
        'oklch(0.704 0.191 22.216)': '#f87171',
    };

    return colorMap[oklch] || '#000000';
};

// Hook for Three.js compatible colors (hex format)
export const useThreeJSColors = () => {
    const colors = useThemeColors();

    return useMemo(() => ({
        background: oklchToHex(colors.background),
        foreground: oklchToHex(colors.foreground),
        card: oklchToHex(colors.card),
        cardForeground: oklchToHex(colors.cardForeground),
        primary: oklchToHex(colors.primary),
        primaryForeground: oklchToHex(colors.primaryForeground),
        secondary: oklchToHex(colors.secondary),
        muted: oklchToHex(colors.muted),
        border: oklchToHex(colors.border),
        // Add more as needed
    }), [colors]);
};