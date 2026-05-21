import type { CssKeyframes } from '@pandacss/dev';

// Constants derived from the silver ratio, sqrt(2) ~= 1.41421.
// Arc length is controlled through strokeDashoffset (C = var(--circumference)).
//   LONG  arc -> dashoffset = C * (1 - 1 / sqrt(2)) ~= 0.29289C -> 70.7% visible.
//   SHORT arc -> dashoffset = C / sqrt(2)            ~= 0.70711C -> 29.3% visible.
// Timing split points:
//   T1 = 1 / (1 + sqrt(2))       ~= 41.421%, the short-to-long peak.
//   T2 = sqrt(2) / (1 + sqrt(2)) ~= 58.579%, the long-to-short turn.
//   T3 = 1 - 1 / sqrt(2)         ~= 29.289%, the early pop-spin expansion point.
const S2 = Math.SQRT2;

const LONG = `calc(var(--circumference) * ${(1 - 1 / S2).toFixed(5)})`; // 0.29289C
const SHORT = `calc(var(--circumference) * ${(1 / S2).toFixed(5)})`; // 0.70711C

// Keyframe selector strings
const T1 = `${(100 / (1 + S2)).toFixed(3)}%`; // 41.421%
const T2 = `${((100 * S2) / (1 + S2)).toFixed(3)}%`; // 58.579%
const T3 = `${(100 * (1 - 1 / S2)).toFixed(3)}%`; // 29.289%

// pop-spin rotation angles derived from sqrt(2) ratios.
// Splits two full turns (720deg) by silver-ratio points.
const ROT_A = `rotate(${(360 * 2 * (1 - 1 / S2)).toFixed(1)}deg)`; // ~= 210.9deg at T3
const ROT_B = `rotate(${((360 * 2) / (1 + S2)).toFixed(1)}deg)`; // ~= 297.9deg at T1
const ROT_C = `rotate(${(360 * (1 + 2 * (1 - 1 / S2))).toFixed(1)}deg)`; // ~= 570.9deg at T2

/**
 * Keyframe definitions for design system animations.
 * Arc lengths and timing are based on the silver ratio, 1:sqrt(2).
 */
export const keyframes = {
  /**
   * Subtle glowing effect using drop-shadow.
   */
  glow: {
    '0%': { filter: 'drop-shadow(0 0 4px var(--btn-glow-color))' },
    '50%': { filter: 'drop-shadow(0 0 16px var(--btn-glow-color))' },
    '100%': { filter: 'drop-shadow(0 0 4px var(--btn-glow-color))' },
  },
  /**
   * Horizontal loading animation for progress bars.
   * ### Formula
   * - A 1 / sqrt(2), or 70.7%, bar passes through the container.
   *          Endpoint: (1 + sqrt(2)) * 100% ~= 241.4%.
   *          T1 = 1 / (1 + sqrt(2)) ~= 41.4%, the ease-in/out inflection point.
   */
  progressLoad: {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: `translateX(${((1 + S2) * 100).toFixed(1)}%)` }, // ~= 241.4%
  },
  /**
   * Spins twice while stretching between C / sqrt(2) and C * (1 - 1 / sqrt(2)).
   * The T1 peak, 1 / (1 + sqrt(2)) ~= 41.4%, is the silver-ratio split point.
   */
  'circle-dash': {
    '0%': { transform: 'rotate(0deg)', strokeDashoffset: SHORT },
    [T1]: { transform: 'rotate(360deg)', strokeDashoffset: LONG },
    '100%': { transform: 'rotate(720deg)', strokeDashoffset: SHORT },
  },
  /**
   * A pop-spin that snaps through five silver-ratio timing points.
   * The 29.3% -> 41.4% -> 58.6% split points all derive from sqrt(2).
   */
  'pop-spin': {
    '0%': { transform: 'rotate(0deg)', strokeDashoffset: SHORT },
    [T3]: { transform: ROT_A, strokeDashoffset: LONG },
    [T1]: { transform: ROT_B, strokeDashoffset: SHORT },
    [T2]: { transform: ROT_C, strokeDashoffset: LONG },
    '100%': { transform: 'rotate(720deg)', strokeDashoffset: SHORT },
  },
  /**
   * Peaks at T1 and snaps at T2 using the two silver-ratio split points.
   */
  'refined-dash': {
    '0%': { transform: 'rotate(0deg)', strokeDashoffset: SHORT },
    [T1]: { transform: 'rotate(300deg)', strokeDashoffset: LONG },
    [T2]: { transform: 'rotate(360deg)', strokeDashoffset: SHORT },
    '100%': { transform: 'rotate(720deg)', strokeDashoffset: SHORT },
  },
  /**
   * Breathes through SHORT -> LONG -> SHORT.
   * The T1-to-T2 hold is ~= 17.2%, or (sqrt(2) - 1)^2.
   */
  breathe: {
    '0%': { strokeDashoffset: SHORT, opacity: '0.3' },
    [T1]: { strokeDashoffset: LONG, opacity: '1' },
    [T2]: { strokeDashoffset: LONG, opacity: '1' },
    '100%': { strokeDashoffset: SHORT, opacity: '0.3' },
  },
  /**
   * Simple 360-degree rotation.
   */
  spin: {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
  /**
   * Linear dash offset animation.
   */
  'line-dash': {
    to: { strokeDashoffset: '-20' },
  },
  /**
   * Edge-to-edge dash offset.
   */
  'edge-dash': {
    '0%': { strokeDashoffset: '10' },
    '100%': { strokeDashoffset: '0' },
  },
  /**
   * Shimmering effect for loading skeletons.
   */
  shimmer: {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(100%)' },
  },
  /**
   * Pulsing opacity effect.
   */
  pulse: {
    '0%, 100%': { opacity: '1' },
    '50%': { opacity: '0.4' },
  },
} satisfies CssKeyframes;
