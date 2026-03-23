/**
 * Teammate Voices Design System - Shadow & Effects Tokens
 * iOS/macOS shadow system
 */

export const shadows = {
  // iOS-style shadows
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

  // Card shadows (macOS Big Sur style)
  card: {
    light: '0 2px 8px rgba(0, 0, 0, 0.08)',
    medium: '0 8px 16px rgba(0, 0, 0, 0.12)',
    heavy: '0 16px 32px rgba(0, 0, 0, 0.16)',
  },

  // Depth layers
  depth: {
    1: '0 1px 2px rgba(0, 0, 0, 0.06)',
    2: '0 2px 4px rgba(0, 0, 0, 0.08)',
    3: '0 4px 8px rgba(0, 0, 0, 0.1)',
    4: '0 8px 16px rgba(0, 0, 0, 0.12)',
    5: '0 16px 32px rgba(0, 0, 0, 0.14)',
  },

  // Inner shadows
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',

  // No shadow
  none: 'none',
} as const;

export const blur = {
  none: '0',
  sm: '4px',
  base: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '40px',
  '3xl': '64px',
} as const;

export const effects = {
  // Glassmorphism (macOS Big Sur/Monterey)
  glass: {
    light: {
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
    },
    dark: {
      background: 'rgba(30, 30, 30, 0.7)',
      backdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
    },
  },

  // Material effects
  material: {
    ultraThin: 'blur(10px)',
    thin: 'blur(20px)',
    regular: 'blur(30px)',
    thick: 'blur(40px)',
    ultraThick: 'blur(50px)',
  },
} as const;

export type ShadowTokens = typeof shadows;
export type BlurTokens = typeof blur;
export type EffectTokens = typeof effects;
