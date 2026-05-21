import { motionOffsets, springs, transitions } from '../presets';

/**
 * Content Transition Animation Variants
 *
 * ### AI Context & Architecture
 * Defines animation behavior for content switching.
 * Inherits the logic from PageTransition but extends it for component-level usage.
 */
export const contentVariants = {
  /**
   * Fade Animation
   */
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: transitions.base.duration, ease: 'easeInOut' },
  },

  /**
   * Crossfade Animation
   * True overlap fade where both elements are visible during transition.
   */
  crossfade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: transitions.slow.duration, ease: 'linear' },
  },

  /**
   * Slide Up Animation
   */
  'slide-up': {
    initial: { opacity: 0, y: motionOffsets.md },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -motionOffsets.md },
    transition: springs.snappy,
  },

  /**
   * Slide Left Animation
   */
  'slide-left': {
    initial: { opacity: 0, x: motionOffsets.md },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -motionOffsets.md },
    transition: springs.snappy,
  },

  /**
   * Slide Right Animation
   */
  'slide-right': {
    initial: { opacity: 0, x: -motionOffsets.md },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: motionOffsets.md },
    transition: springs.snappy,
  },

  /**
   * Zoom Animation
   */
  zoom: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
    transition: springs.bouncy,
  },

  /**
   * Flip X Animation
   */
  'flip-x': {
    initial: { opacity: 0, rotateY: 90, transformPerspective: 1000 },
    animate: { opacity: 1, rotateY: 0 },
    exit: { opacity: 0, rotateY: -90 },
    transition: springs.snappy,
  },

  /**
   * Flip Y Animation
   */
  'flip-y': {
    initial: { opacity: 0, rotateX: 90, transformPerspective: 1000 },
    animate: { opacity: 1, rotateX: 0 },
    exit: { opacity: 0, rotateX: -90 },
    transition: springs.snappy,
  },

  /**
   * Morph Animation
   */
  morph: {
    initial: { opacity: 0, scale: 1.1, filter: 'blur(10px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, scale: 0.9, filter: 'blur(10px)' },
    transition: transitions.slow,
  },

  /**
   * Book Turn Animation (Ported from PageTransition)
   */
  'book-turn': {
    initial: {
      opacity: 0,
      rotateY: 90,
      transformPerspective: 1000,
      transformOrigin: 'left center',
      x: '100%',
    },
    animate: {
      opacity: 1,
      rotateY: 0,
      x: '0%',
      transition: {
        duration: transitions.slow.duration,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: {
      opacity: 0,
      rotateY: -90,
      x: '-100%',
      transition: {
        duration: transitions.slow.duration,
        ease: [0.7, 0, 0.84, 0],
      },
    },
  },

  /** No Animation */
  none: {
    initial: {},
    animate: {},
    exit: {},
  },
} as const;

/**
 * Named content transition preset key accepted by ContentTransition.
 */
export type ContentTransitionType = keyof typeof contentVariants;
