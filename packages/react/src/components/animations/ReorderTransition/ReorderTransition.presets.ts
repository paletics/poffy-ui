import { motionOffsets, motionScales, springs } from '../presets';

/**
 * ReorderTransition Presets
 *
 * ### AI Context & Architecture
 * Defines enter/exit animation variants for items in an ReorderTransition container.
 * Unlike StaggerTransition (entrance-only), these variants include `exit` states to support
 * AnimatePresence-driven removal animations.
 * The `layout` FLIP transition is defined separately via `orderLayoutTransition` to decouple
 * reorder physics from enter/exit physics.
 */

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

/**
 * Layout transition spring for FLIP reorder animations.
 * ### AI Context & Architecture
 * - Intentionally softer than enter/exit springs to prevent oscillation
 * when multiple items reflow simultaneously during a reorder operation.
 */
export const orderLayoutTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 25,
};

/**
 * Named reorder item animation preset key accepted by ReorderTransition.
 */
export type OrderItemAnimationType = keyof typeof orderItemVariants;
