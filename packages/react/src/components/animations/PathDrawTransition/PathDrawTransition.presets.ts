import { baseTokens } from '@poffy-ui/system';
import { springs } from '../presets';
import { CustomData } from '../types';
import { getCustomValue } from '../utils';

/**
 * Motion variant presets for `PathDrawTransition` stroke primitives.
 *
 * ### Notes
 * Presets animate SVG `pathLength`, so they are intended for stroked `path`,
 * `line`, and `polyline` elements rather than filled SVG shapes.
 */
export const pathDrawVariants = {
  /** Spring-based stroke reveal for checkmarks and short status glyphs. */
  draw: {
    initial: { pathLength: 0, opacity: 0 },
    enter: { pathLength: [0, 1] as number[], opacity: [0, 1] as number[] },
    animate: { pathLength: 1, opacity: 1 },
    exit: { pathLength: 0, opacity: 0 },
    transition: (custom?: CustomData) => ({
      ...springs.snappy,
      duration: getCustomValue(custom, 'duration', baseTokens.motion.durations.base),
    }),
  },

  /** Slower stroke reveal for progress-like or illustrative paths. */
  dash: {
    initial: { pathLength: 0, opacity: 0 },
    enter: { pathLength: [0, 1] as number[], opacity: [0, 1] as number[] },
    animate: { pathLength: 1, opacity: 1 },
    exit: { pathLength: 0, opacity: 0 },
    transition: (custom?: CustomData) => ({
      duration: getCustomValue(custom, 'duration', baseTokens.motion.durations.slow),
      ease: baseTokens.motion.easings.default,
    }),
  },

  /** Static path state with no drawing duration. */
  instant: {
    initial: { opacity: 1, pathLength: 1 },
    enter: { opacity: 1, pathLength: 1 },
    animate: { opacity: 1, pathLength: 1 },
    exit: { opacity: 0, pathLength: 1 },
    transition: { duration: 0 },
  },
} as const;

/**
 * Named SVG path drawing preset.
 */
export type PathDrawTransitionType = keyof typeof pathDrawVariants;
