import { motionOffsets, motionScales, transitions } from '../presets';
import { CustomData } from '../types';
import { getCustomValue } from '../utils';

export const loopVariants = {
  /**
   * Float Animation
   *
   * Gentle vertical floating motion, creating an airy, weightless effect.
   * Element moves up and down smoothly like a feather in the breeze.
   *
   * Customizable parameters:
   * - `floatDistance`: Vertical travel distance in pixels (default: -5.65)
   * - `duration`: Animation cycle duration in seconds (default: 2.828)
   *
   * Use cases: Decorative icons, floating action buttons, notification badges
   */
  float: {
    animate: (custom?: CustomData) => ({
      y: [0, getCustomValue(custom, 'floatDistance', -5.65), 0],
      transition: {
        duration: getCustomValue(custom, 'duration', 2.828),
        delay: getCustomValue(custom, 'delay', 0),
        repeat: Infinity,
        ease: 'easeInOut',
      },
    }),
  },

  /**
   * Pulse Animation
   *
   * Gentle breathing effect using scale. Creates a subtle "heartbeat" or
   * "breathing" visual rhythm. Ideal for drawing attention without being intrusive.
   *
   * Customizable parameters:
   * - `pulseScale`: Maximum scale multiplier (default: 1.059 = ~6% larger)
   * - `duration`: Animation cycle duration in seconds (default: 2.262)
   *
   * Use cases: Unread notifications, call-to-action buttons, live status indicators
   */
  pulse: {
    animate: (custom?: CustomData) => ({
      scale: [1, getCustomValue(custom, 'pulseScale', motionScales.hover), 1],
      transition: {
        duration: getCustomValue(custom, 'duration', 2.262),
        repeat: Infinity,
        ease: 'easeInOut',
      },
    }),
  },

  /**
   * Spin Animation
   *
   * Continuous 360-degree rotation with linear easing for constant speed.
   * Classic loading indicator animation.
   *
   * Customizable parameters:
   * - `duration`: Full rotation duration in seconds (default: 4.525)
   *
   * Use cases: Loading spinners, refresh icons, settings/gear icons
   */
  spin: {
    animate: (custom?: CustomData) => ({
      rotate: [0, 360],
      transition: {
        duration: getCustomValue(custom, 'duration', 4.525),
        repeat: Infinity,
        ease: 'linear',
      },
    }),
  },

  /**
   * Shake Animation
   *
   * Rapid side-to-side trembling effect with rotation. Creates an energetic,
   * playful vibration with periodic pauses controlled by `repeatDelay`.
   *
   * Customizable parameters:
   * - `duration`: Shake cycle duration in seconds (default: 0.565)
   * - `delay`: Pause duration between shake cycles in seconds (default: 2.262)
   *
   * Use cases: Notification alerts, error states, playful interactive elements
   */
  shake: {
    animate: (custom?: CustomData) => ({
      rotate: [0, -2, 2, -2, 0],
      x: [0, -1, 1, -1, 0],
      transition: {
        duration: getCustomValue(custom, 'duration', transitions.slow.duration),
        repeat: Infinity,
        repeatDelay: getCustomValue(custom, 'delay', 2.262),
        ease: 'easeInOut',
      },
    }),
  },

  /**
   * Bounce Animation
   *
   * Vertical bouncing motion with realistic physics timing. Uses `times` array
   * to create asymmetric easing that mimics natural gravity (quick ascent, slower descent).
   *
   * Customizable parameters:
   * - `duration`: Bounce cycle duration in seconds (default: 0.565)
   *
   * Technical note: `times: [0, 0.4, 1]` creates a faster upward motion (40% of cycle)
   * and slower downward motion (60% of cycle) for realistic physics feel.
   *
   * Use cases: Playful branding elements, success indicators, gamification
   */
  bounce: {
    animate: (custom?: CustomData) => ({
      y: [0, -motionOffsets.sm, 0],
      transition: {
        duration: getCustomValue(custom, 'duration', transitions.slow.duration),
        repeat: Infinity,
        ease: 'easeOut',
        times: [0, 0.4, 1],
      },
    }),
  },

  /**
   * No Animation
   *
   * Static state with no motion. For users with motion sensitivity or
   * performance-constrained environments.
   *
   * Use cases: Reduced motion preferences, accessibility, low-power mode
   */
  none: {
    animate: {},
  },
} as const;

/**
 * Union type of all available loop transition animation presets.
 *
 * @example
 * ```tsx
 * const myAnimation: LoopEffectType = 'float';
 * ```
 */
export type LoopEffectType = keyof typeof loopVariants;
