/**
 * Teammate Voices Design System - Spacing Tokens
 * 8px base grid system (Apple's standard)
 */

export const spacing = {
  // Base unit: 8px
  0: '0',
  0.5: '4px',   // 0.5 × 8
  1: '8px',     // 1 × 8
  1.5: '12px',  // 1.5 × 8
  2: '16px',    // 2 × 8
  2.5: '20px',  // 2.5 × 8
  3: '24px',    // 3 × 8
  3.5: '28px',  // 3.5 × 8
  4: '32px',    // 4 × 8
  5: '40px',    // 5 × 8
  6: '48px',    // 6 × 8
  7: '56px',    // 7 × 8
  8: '64px',    // 8 × 8
  9: '72px',    // 9 × 8
  10: '80px',   // 10 × 8
  12: '96px',   // 12 × 8
  14: '112px',  // 14 × 8
  16: '128px',  // 16 × 8
  20: '160px',  // 20 × 8
  24: '192px',  // 24 × 8

  // Semantic spacing (iOS/macOS patterns)
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '40px',
  '3xl': '48px',
  '4xl': '64px',

  // Component-specific
  inset: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '20px',
    xl: '24px',
  },

  stack: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },

  inline: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
  },
} as const;

export type SpacingTokens = typeof spacing;
