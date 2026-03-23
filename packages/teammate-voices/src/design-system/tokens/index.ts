/**
 * Teammate Voices Design System - Main Tokens Export
 */

export { colors } from './colors';
export type { ColorTokens } from './colors';

export { typography } from './typography';
export type { TypographyTokens } from './typography';

export { spacing } from './spacing';
export type { SpacingTokens } from './spacing';

export { shadows, blur, effects } from './shadows';
export type { ShadowTokens, BlurTokens, EffectTokens } from './shadows';

export { radius } from './radius';
export type { RadiusTokens } from './radius';

export { transitions, animations } from './transitions';
export type { TransitionTokens, AnimationTokens } from './transitions';

// Z-index scale
export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  toast: 1600,
  tooltip: 1700,
  max: 9999,
} as const;

// Breakpoints (responsive design)
export const breakpoints = {
  xs: '320px',   // iPhone SE
  sm: '390px',   // iPhone 12/13/14 Pro
  md: '768px',   // iPad
  lg: '1024px',  // iPad Pro
  xl: '1280px',  // MacBook
  '2xl': '1536px', // MacBook Pro
  '3xl': '1920px', // iMac
} as const;

export type ZIndexTokens = typeof zIndex;
export type BreakpointTokens = typeof breakpoints;
