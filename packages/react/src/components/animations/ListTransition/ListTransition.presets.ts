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
    visible: (custom?: CustomData) => ({
      opacity: 1,
      transition: {
        staggerChildren: getCustomValue(custom, 'stagger', baseTokens.motion.stagger.base),
        delayChildren: getCustomValue(custom, 'delay', 0),
      },
    }),
  },

  /**
   * Burst: Rapid staggered entry for high-priority lists.
   */
  burst: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: baseTokens.motion.stagger.fast,
      },
    },
  },

  /**
   * Lazy: Slower staggered entry for content-heavy displays.
   */
  lazy: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: baseTokens.motion.stagger.slow,
      },
    },
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
    visible: {
      opacity: 1,
      y: 0,
      transition: { ...springs.snappy, type: 'spring' },
    },
  },

  /**
   * Slide: Horizontal slide-in suitable for sidebars or navigation items.
   */
  slide: {
    hidden: { opacity: 0, x: -motionOffsets.md },
    visible: {
      opacity: 1,
      x: 0,
      transition: { ...springs.bouncy, type: 'spring' },
    },
  },

  /**
   * Pop: Scale-based appearance for grid or card displays.
   */
  pop: {
    hidden: { opacity: 0, scale: motionScales.in },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 300, damping: 20 },
    },
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
