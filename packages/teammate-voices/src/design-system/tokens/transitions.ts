/**
 * Teammate Voices Design System - Animation & Transition Tokens
 * Apple's signature fluid animations
 */

export const transitions = {
  // Durations (based on UIKit/AppKit standards)
  duration: {
    instant: '0ms',
    fast: '150ms',
    base: '250ms',
    moderate: '350ms',
    slow: '500ms',
    slower: '700ms',
    slowest: '1000ms',
  },

  // Timing functions (Apple's easing curves)
  easing: {
    // Standard iOS curves
    standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0.0, 0.6, 1)',

    // Apple-specific curves
    easeInOut: 'cubic-bezier(0.42, 0.0, 0.58, 1.0)',
    easeOut: 'cubic-bezier(0.0, 0.0, 0.58, 1.0)',
    easeIn: 'cubic-bezier(0.42, 0.0, 1.0, 1.0)',

    // Spring-like (similar to UIView spring animations)
    spring: 'cubic-bezier(0.5, 1.5, 0.5, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // Common transitions
  all: {
    fast: 'all 150ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    base: 'all 250ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    moderate: 'all 350ms cubic-bezier(0.4, 0.0, 0.2, 1)',
  },

  // Property-specific transitions
  opacity: 'opacity 150ms cubic-bezier(0.4, 0.0, 0.2, 1)',
  transform: 'transform 250ms cubic-bezier(0.4, 0.0, 0.2, 1)',
  color: 'color 150ms cubic-bezier(0.4, 0.0, 0.2, 1)',
  background: 'background-color 150ms cubic-bezier(0.4, 0.0, 0.2, 1)',
  border: 'border-color 150ms cubic-bezier(0.4, 0.0, 0.2, 1)',
  shadow: 'box-shadow 250ms cubic-bezier(0.4, 0.0, 0.2, 1)',
} as const;

export const animations = {
  // Keyframe animations
  fadeIn: {
    name: 'fadeIn',
    duration: '250ms',
    timingFunction: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  },
  fadeOut: {
    name: 'fadeOut',
    duration: '200ms',
    timingFunction: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  },
  slideUp: {
    name: 'slideUp',
    duration: '350ms',
    timingFunction: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  },
  slideDown: {
    name: 'slideDown',
    duration: '350ms',
    timingFunction: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  },
  scale: {
    name: 'scale',
    duration: '250ms',
    timingFunction: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  },
  bounce: {
    name: 'bounce',
    duration: '500ms',
    timingFunction: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  spin: {
    name: 'spin',
    duration: '1000ms',
    timingFunction: 'linear',
  },
} as const;

export type TransitionTokens = typeof transitions;
export type AnimationTokens = typeof animations;
