import { motionOffsets, motionScales, springs, transitions } from '../presets';

/**
 * Motion variant presets for `IconSwapTransition`.
 *
 * ### Notes
 * Presets are tuned for compact keyed content such as icons, badges, and
 * status glyphs. Use a stable `transitionKey` on the component so exit animation can run.
 */
export const iconSwapVariants = {
  /** Cross-fades content with minimal visual emphasis. */
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: transitions.fast,
  },

  /** Scales content in and out for small success/error feedback. */
  pop: {
    initial: { opacity: 0, scale: motionScales.in },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: motionScales.press },
    transition: springs.bouncy,
  },

  /** Rotates replacement content for directional or refresh-like states. */
  rotate: {
    initial: { opacity: 0, rotate: -90, scale: motionScales.in },
    animate: { opacity: 1, rotate: 0, scale: 1 },
    exit: { opacity: 0, rotate: 90, scale: motionScales.in },
    transition: springs.snappy,
  },

  /** Slides content vertically for compact status replacement. */
  slide: {
    initial: { opacity: 0, y: motionOffsets.sm },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -motionOffsets.sm },
    transition: springs.snappy,
  },
} as const;

/**
 * Named icon swap transition preset.
 */
export type IconSwapTransitionType = keyof typeof iconSwapVariants;
