import { motionScales, springs, transitions } from '../presets';

/**
 * Motion variant presets for `SelectionTransition`.
 *
 * ### Notes
 * These presets animate only the visual indicator. The owning control remains
 * responsible for native checked state or ARIA selected state.
 */
export const selectionVariants = {
  /** Snappy entrance for checkmarks and selected item marks. */
  check: {
    initial: { opacity: 0, scale: motionScales.in },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: motionScales.press },
    transition: springs.snappy,
  },

  /** Higher-emphasis pop for dots, chips, and active indicators. */
  pop: {
    initial: { opacity: 0, scale: 0.707 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: motionScales.in },
    transition: springs.bouncy,
  },

  /** Minimal opacity transition for dense or low-emphasis controls. */
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: transitions.fast,
  },
} as const;

/**
 * Named selected-state indicator preset.
 */
export type SelectionTransitionType = keyof typeof selectionVariants;
