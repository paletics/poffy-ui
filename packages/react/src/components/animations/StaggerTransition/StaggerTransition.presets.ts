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
    __poffyStaggerEnter: (custom?: CustomData) => ({
      opacity: [0, 1] as number[],
      transition: {
        staggerChildren: getCustomValue(custom, 'stagger', baseTokens.motion.stagger.base),
        delayChildren: getCustomValue(custom, 'delay', 0),
      },
    }),
    visible: (custom?: CustomData) => ({
      opacity: 1,
      transition: {
        staggerChildren: getCustomValue(custom, 'stagger', baseTokens.motion.stagger.base),
        delayChildren: getCustomValue(custom, 'delay', 0),
      },
    }),
    __poffyStaggerSettled: { opacity: 1, transition: { duration: 0 } },
  },
  burst: {
    hidden: { opacity: 0 },
    __poffyStaggerEnter: (custom?: CustomData) => ({
      opacity: [0, 1] as number[],
      transition: {
        staggerChildren: getCustomValue(custom, 'stagger', baseTokens.motion.stagger.fast),
        delayChildren: getCustomValue(custom, 'delay', 0),
      },
    }),
    visible: (custom?: CustomData) => ({
      opacity: 1,
      transition: {
        staggerChildren: getCustomValue(custom, 'stagger', baseTokens.motion.stagger.fast),
        delayChildren: getCustomValue(custom, 'delay', 0),
      },
    }),
    __poffyStaggerSettled: { opacity: 1, transition: { duration: 0 } },
  },
  lazy: {
    hidden: { opacity: 0 },
    __poffyStaggerEnter: (custom?: CustomData) => ({
      opacity: [0, 1] as number[],
      transition: {
        staggerChildren: getCustomValue(custom, 'stagger', baseTokens.motion.stagger.slow),
        delayChildren: getCustomValue(custom, 'delay', 0),
      },
    }),
    visible: (custom?: CustomData) => ({
      opacity: 1,
      transition: {
        staggerChildren: getCustomValue(custom, 'stagger', baseTokens.motion.stagger.slow),
        delayChildren: getCustomValue(custom, 'delay', 0),
      },
    }),
    __poffyStaggerSettled: { opacity: 1, transition: { duration: 0 } },
  },
} as const;

/**
 * Motion variants applied to each staggered child item.
 */
export const staggerItemVariants = {
  fade: {
    hidden: { opacity: 0, y: motionOffsets.md },
    __poffyStaggerEnter: {
      opacity: [0, 1] as number[],
      y: [motionOffsets.md, 0] as number[],
      transition: springs.snappy,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: springs.snappy,
    },
    __poffyStaggerSettled: { opacity: 1, y: 0, transition: { duration: 0 } },
  },
  slide: {
    hidden: { opacity: 0, x: -motionOffsets.md },
    __poffyStaggerEnter: {
      opacity: [0, 1] as number[],
      x: [-motionOffsets.md, 0] as number[],
      transition: springs.snappy,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: springs.snappy,
    },
    __poffyStaggerSettled: { opacity: 1, x: 0, transition: { duration: 0 } },
  },
  pop: {
    hidden: { opacity: 0, scale: motionScales.in },
    __poffyStaggerEnter: {
      opacity: [0, 1] as number[],
      scale: [motionScales.in, 1] as number[],
      transition: springs.bouncy,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: springs.bouncy,
    },
    __poffyStaggerSettled: { opacity: 1, scale: 1, transition: { duration: 0 } },
  },
  reveal: {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    __poffyStaggerEnter: {
      opacity: [0, 1] as number[],
      scale: [0.9, 1] as number[],
      y: [20, 0] as number[],
      transition: springs.heavy,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: springs.heavy,
    },
    __poffyStaggerSettled: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0 },
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
