/**
 * Teammate Voices Design System - Typography Tokens
 * Based on Apple's SF Pro font system
 */

export const typography = {
  // Font Families
  fontFamily: {
    system: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace',
  },

  // Font Sizes (iOS/macOS Scale)
  fontSize: {
    // Large Titles
    largeTitle: '34px',
    title1: '28px',
    title2: '22px',
    title3: '20px',

    // Headlines & Body
    headline: '17px',
    body: '17px',
    callout: '16px',
    subheadline: '15px',
    footnote: '13px',
    caption1: '12px',
    caption2: '11px',

    // Additional sizes
    xs: '11px',
    sm: '13px',
    base: '15px',
    lg: '17px',
    xl: '20px',
    '2xl': '22px',
    '3xl': '28px',
    '4xl': '34px',
  },

  // Font Weights (SF Pro)
  fontWeight: {
    ultralight: 100,
    thin: 200,
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    heavy: 800,
    black: 900,
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,

    // Specific to Apple typography
    largeTitle: '41px',
    title1: '34px',
    title2: '28px',
    title3: '25px',
    headline: '22px',
    body: '22px',
    callout: '21px',
    subheadline: '20px',
    footnote: '18px',
    caption1: '16px',
    caption2: '13px',
  },

  // Letter Spacing (Tracking)
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',

    // Apple-specific tracking
    largeTitle: '0.34px',
    title1: '0.36px',
    title2: '0.35px',
    title3: '0.38px',
    headline: '-0.41px',
    body: '-0.41px',
    callout: '-0.32px',
    subheadline: '-0.24px',
    footnote: '-0.08px',
    caption1: '0',
    caption2: '0.06px',
  },

  // Text Styles (iOS/macOS)
  textStyle: {
    largeTitle: {
      fontSize: '34px',
      lineHeight: '41px',
      fontWeight: 400,
      letterSpacing: '0.34px',
    },
    title1: {
      fontSize: '28px',
      lineHeight: '34px',
      fontWeight: 400,
      letterSpacing: '0.36px',
    },
    title2: {
      fontSize: '22px',
      lineHeight: '28px',
      fontWeight: 400,
      letterSpacing: '0.35px',
    },
    title3: {
      fontSize: '20px',
      lineHeight: '25px',
      fontWeight: 400,
      letterSpacing: '0.38px',
    },
    headline: {
      fontSize: '17px',
      lineHeight: '22px',
      fontWeight: 600,
      letterSpacing: '-0.41px',
    },
    body: {
      fontSize: '17px',
      lineHeight: '22px',
      fontWeight: 400,
      letterSpacing: '-0.41px',
    },
    callout: {
      fontSize: '16px',
      lineHeight: '21px',
      fontWeight: 400,
      letterSpacing: '-0.32px',
    },
    subheadline: {
      fontSize: '15px',
      lineHeight: '20px',
      fontWeight: 400,
      letterSpacing: '-0.24px',
    },
    footnote: {
      fontSize: '13px',
      lineHeight: '18px',
      fontWeight: 400,
      letterSpacing: '-0.08px',
    },
    caption1: {
      fontSize: '12px',
      lineHeight: '16px',
      fontWeight: 400,
      letterSpacing: '0',
    },
    caption2: {
      fontSize: '11px',
      lineHeight: '13px',
      fontWeight: 400,
      letterSpacing: '0.06px',
    },
  },
} as const;

export type TypographyTokens = typeof typography;
