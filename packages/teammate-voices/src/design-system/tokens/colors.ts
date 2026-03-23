/**
 * Teammate Voices Design System - Color Tokens
 * Inspired by Apple's color palette
 */

export const colors = {
  // Primary - Blue (Apple's signature blue)
  blue: {
    50: '#E5F0FF',
    100: '#CCE1FF',
    200: '#99C3FF',
    300: '#66A5FF',
    400: '#3387FF',
    500: '#007AFF', // Apple Blue
    600: '#0062CC',
    700: '#004999',
    800: '#003166',
    900: '#001933',
  },

  // Gray Scale
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // System Colors (iOS/macOS)
  system: {
    red: '#FF3B30',
    orange: '#FF9500',
    yellow: '#FFCC00',
    green: '#34C759',
    teal: '#5AC8FA',
    blue: '#007AFF',
    indigo: '#5856D6',
    purple: '#AF52DE',
    pink: '#FF2D55',
  },

  // Semantic Colors - Light Mode
  light: {
    // Backgrounds
    background: {
      primary: '#FFFFFF',
      secondary: '#F2F2F7',
      tertiary: '#FFFFFF',
      grouped: {
        primary: '#F2F2F7',
        secondary: '#FFFFFF',
        tertiary: '#F2F2F7',
      },
    },

    // Text
    text: {
      primary: '#000000',
      secondary: '#3C3C43', // 60% opacity
      tertiary: '#3C3C43', // 30% opacity
      quaternary: '#3C3C43', // 18% opacity
      link: '#007AFF',
    },

    // Fills
    fill: {
      primary: 'rgba(120, 120, 128, 0.2)',
      secondary: 'rgba(120, 120, 128, 0.16)',
      tertiary: 'rgba(120, 120, 128, 0.12)',
      quaternary: 'rgba(120, 120, 128, 0.08)',
    },

    // Separators
    separator: {
      opaque: '#C6C6C8',
      nonOpaque: 'rgba(60, 60, 67, 0.29)',
    },
  },

  // Semantic Colors - Dark Mode
  dark: {
    // Backgrounds
    background: {
      primary: '#000000',
      secondary: '#1C1C1E',
      tertiary: '#2C2C2E',
      grouped: {
        primary: '#000000',
        secondary: '#1C1C1E',
        tertiary: '#2C2C2E',
      },
    },

    // Text
    text: {
      primary: '#FFFFFF',
      secondary: '#EBEBF5', // 60% opacity
      tertiary: '#EBEBF5', // 30% opacity
      quaternary: '#EBEBF5', // 18% opacity
      link: '#0A84FF',
    },

    // Fills
    fill: {
      primary: 'rgba(120, 120, 128, 0.36)',
      secondary: 'rgba(120, 120, 128, 0.32)',
      tertiary: 'rgba(120, 120, 128, 0.24)',
      quaternary: 'rgba(120, 120, 128, 0.18)',
    },

    // Separators
    separator: {
      opaque: '#38383A',
      nonOpaque: 'rgba(84, 84, 88, 0.65)',
    },
  },

  // Vibrancy & Effects
  effects: {
    blur: {
      light: 'rgba(255, 255, 255, 0.7)',
      dark: 'rgba(0, 0, 0, 0.7)',
    },
    glass: {
      light: 'rgba(255, 255, 255, 0.8)',
      dark: 'rgba(30, 30, 30, 0.8)',
    },
  },
} as const;

export type ColorTokens = typeof colors;
