import { motionOffsets, motionScales, springs } from '../presets';

export const orderItemVariants = {
  /**
   * Pop: Scale-based entrance/exit. Best for tags, chips, and card grids.
   */
  pop: {
    initial: { opacity: 0, scale: motionScales.in },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { type: 'spring' as const, stiffness: 300, damping: 20 },
    },
    exit: {
      opacity: 0,
      scale: motionScales.in,
      transition: { ...springs.snappy, type: 'spring' as const },
    },
  },

  /**
   * Fade: Vertical slide with opacity. Best for vertical lists and feeds.
   */
  fade: {
    initial: { opacity: 0, y: motionOffsets.sm },
    animate: {
      opacity: 1,
      y: 0,
      transition: { ...springs.snappy, type: 'spring' as const },
    },
    exit: {
      opacity: 0,
      y: motionOffsets.sm,
      transition: { ...springs.sharp, type: 'spring' as const },
    },
  },

  /**
   * Slide: Horizontal slide with opacity. Best for horizontal lists and navigation items.
   * Exits in the opposite direction to reinforce directionality.
   */
  slide: {
    initial: { opacity: 0, x: -motionOffsets.md },
    animate: {
      opacity: 1,
      x: 0,
      transition: { ...springs.bouncy, type: 'spring' as const },
    },
    exit: {
      opacity: 0,
      x: motionOffsets.md,
      transition: { ...springs.snappy, type: 'spring' as const },
    },
  },
} as const;

export const orderLayoutTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 25,
};

/**
 * Named reorder item animation preset key accepted by ReorderTransition.
 */
export type OrderItemAnimationType = keyof typeof orderItemVariants;
