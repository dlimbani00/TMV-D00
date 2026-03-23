/**
 * Teammate Voices Design System - Border Radius Tokens
 * iOS/macOS corner radius system
 */

export const radius = {
  none: '0',
  xs: '4px',
  sm: '6px',
  base: '8px',
  md: '10px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  '3xl': '24px',
  full: '9999px',

  // iOS-specific radii
  ios: {
    small: '8px',      // Small elements
    medium: '10px',    // Buttons, inputs
    large: '12px',     // Cards
    extraLarge: '16px', // Modals, sheets
    continuous: '40%', // Continuous corner curve
  },

  // macOS-specific radii
  macos: {
    small: '6px',
    medium: '8px',
    large: '10px',
    window: '12px',
  },
} as const;

export type RadiusTokens = typeof radius;
