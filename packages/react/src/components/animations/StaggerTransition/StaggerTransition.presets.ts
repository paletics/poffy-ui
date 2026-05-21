import { baseTokens } from '@poffy-ui/system';
import { motionOffsets, motionScales, springs } from '../presets';
import { CustomData } from '../types';
import { getCustomValue } from '../utils';

/**
 * Stagger Transition Presets
 */

export const staggerContainerVariants = {
  base: {
    hidden: { opacity: 0 },
    visible: (custom?: CustomData) => ({
      opacity: 1,
      transition: {
        staggerChildren: getCustomValue(custom, 'stagger', baseTokens.motion.stagger.base),
        delayChildren: getCustomValue(custom, 'delay', 0),
      },
    }),
  },
  burst: {
    hidden: { opacity: 0 },
    visible: (custom?: CustomData) => ({
      opacity: 1,
      transition: {
        staggerChildren: getCustomValue(custom, 'stagger', baseTokens.motion.stagger.fast),
        delayChildren: getCustomValue(custom, 'delay', 0),
      },
    }),
  },
  lazy: {
    hidden: { opacity: 0 },
    visible: (custom?: CustomData) => ({
      opacity: 1,
      transition: {
        staggerChildren: getCustomValue(custom, 'stagger', baseTokens.motion.stagger.slow),
        delayChildren: getCustomValue(custom, 'delay', 0),
      },
    }),
  },
} as const;

/**
 * Motion variants applied to each staggered child item.
 */
export const staggerItemVariants = {
  fade: {
    hidden: { opacity: 0, y: motionOffsets.md },
    visible: {
      opacity: 1,
      y: 0,
      transition: springs.snappy,
    },
  },
  slide: {
    hidden: { opacity: 0, x: -motionOffsets.md },
    visible: {
      opacity: 1,
      x: 0,
      transition: springs.snappy,
    },
  },
  pop: {
    hidden: { opacity: 0, scale: motionScales.in },
    visible: {
      opacity: 1,
      scale: 1,
      transition: springs.bouncy,
    },
  },
  reveal: {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: springs.heavy,
    },
  },
} as const;

/**
 * Named stagger container transition preset key accepted by StaggerTransition.
 */
export type StaggerTransitionType = keyof typeof staggerContainerVariants;

/**
 * Named stagger child item transition preset key accepted by StaggerTransition.
 */
export type StaggerItemType = keyof typeof staggerItemVariants;
