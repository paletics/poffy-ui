import { baseTokens } from '@poffy-ui/system';
import { motionOffsets, motionScales, springs } from '../presets';
import { CustomData } from '../types';
import { getCustomValue } from '../utils';

/**
 * Container Variants: Orchestrates entry timing for children.
 */
export const listContainerVariants = {
  /**
   * Flow: Standard staggered appearance from top to bottom.
   */
  flow: {
    hidden: { opacity: 0 },
    __poffyListEnter: (custom?: CustomData) => ({
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
    __poffyListSettled: { opacity: 1, transition: { duration: 0 } },
  },

  /**
   * Burst: Rapid staggered entry for high-priority lists.
   */
  burst: {
    hidden: { opacity: 0 },
    __poffyListEnter: {
      opacity: [0, 1] as number[],
      transition: {
        staggerChildren: baseTokens.motion.stagger.fast,
      },
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: baseTokens.motion.stagger.fast,
      },
    },
    __poffyListSettled: { opacity: 1, transition: { duration: 0 } },
  },

  /**
   * Lazy: Slower staggered entry for content-heavy displays.
   */
  lazy: {
    hidden: { opacity: 0 },
    __poffyListEnter: {
      opacity: [0, 1] as number[],
      transition: {
        staggerChildren: baseTokens.motion.stagger.slow,
      },
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: baseTokens.motion.stagger.slow,
      },
    },
    __poffyListSettled: { opacity: 1, transition: { duration: 0 } },
  },
} as const;

/**
 * Item Variants: Behavior for individual list items.
 */
export const listItemVariants = {
  /**
   * Fade: Basic vertical slide-in with opacity change.
   */
  fade: {
    hidden: { opacity: 0, y: motionOffsets.sm },
    __poffyListEnter: {
      opacity: [0, 1] as number[],
      y: [motionOffsets.sm, 0] as number[],
      transition: { ...springs.snappy, type: 'spring' },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { ...springs.snappy, type: 'spring' },
    },
    __poffyListSettled: { opacity: 1, y: 0, transition: { duration: 0 } },
  },

  /**
   * Slide: Horizontal slide-in suitable for sidebars or navigation items.
   */
  slide: {
    hidden: { opacity: 0, x: -motionOffsets.md },
    __poffyListEnter: {
      opacity: [0, 1] as number[],
      x: [-motionOffsets.md, 0] as number[],
      transition: { ...springs.bouncy, type: 'spring' },
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: { ...springs.bouncy, type: 'spring' },
    },
    __poffyListSettled: { opacity: 1, x: 0, transition: { duration: 0 } },
  },

  /**
   * Pop: Scale-based appearance for grid or card displays.
   */
  pop: {
    hidden: { opacity: 0, scale: motionScales.in },
    __poffyListEnter: {
      opacity: [0, 1] as number[],
      scale: [motionScales.in, 1] as number[],
      transition: { type: 'spring', stiffness: 300, damping: 20 },
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 300, damping: 20 },
    },
    __poffyListSettled: { opacity: 1, scale: 1, transition: { duration: 0 } },
  },
} as const;

/**
 * Named list container transition preset key accepted by ListTransition.
 */
export type ListContainerType = keyof typeof listContainerVariants;

/**
 * Named list item transition preset key accepted by ListTransition.
 */
export type ListItemType = keyof typeof listItemVariants;
