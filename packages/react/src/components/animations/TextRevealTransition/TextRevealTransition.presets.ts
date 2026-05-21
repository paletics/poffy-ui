import { Transition, Variants } from 'motion/react';
import { motionOffsets, motionScales, springs, transitions } from '../presets';

/**
 * Container Variants:
 * Controls the animation of the text container, specifically orchestration like `staggerChildren`.
 */
export const textContainerVariants: Variants = {
  visible: (stagger: number) => ({
    transition: {
      staggerChildren: stagger,
      delayChildren: 0,
    },
  }),
  hidden: {
    transition: { staggerChildren: 0.04, staggerDirection: -1 },
  },
};

/**
 * Item Variants:
 * Defines animations for individual characters or words.
 */
export const textVariants = {
  /**
   * Typewriter: Immediate appearance with no easing.
   * Best used for simulating terminal or typing effects.
   */
  typewriter: {
    hidden: { opacity: 0, scale: motionScales.press, display: 'none' },
    visible: {
      opacity: 1,
      display: 'inline-block',
      scale: 1,
      transition: { duration: 0, ease: 'linear' },
    },
  },

  /**
   * Fade In: Standard opacity entrance.
   */
  'fade-in': {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: transitions.base.duration, ease: 'easeOut' },
    },
  },

  /**
   * Fade Up: Standard upward float and fade-in.
   * Highly legible and suitable for general content.
   */
  'fade-up': {
    hidden: { opacity: 0, y: motionOffsets.md },
    visible: {
      opacity: 1,
      y: 0,
      transition: springs.snappy as Transition,
    },
  },

  /**
   * Blur: Cinematic reveal with gaussian blur and scaling.
   * Ideal for high-impact hero sections.
   */
  blur: {
    hidden: { opacity: 0, filter: `blur(${motionOffsets.sm}px)`, scale: 1.141 },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      scale: 1,
      transition: { duration: transitions.slow.duration, ease: 'easeOut' },
    },
  },

  /**
   * Bounce: Organic, spring-based elasticity.
   * Expresses energy and playfulness.
   */
  bounce: {
    hidden: { opacity: 0, y: -motionOffsets.md },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 14.14,
      },
    },
  },

  /**
   * Word Pop: Scale entrance designed for word-level splitting.
   */
  'word-pop': {
    hidden: { opacity: 0, scale: 0.707 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
      },
    },
  },

  /**
   * No Animation
   */
  none: {},
} as const;

/** Available text reveal item animation variant names. */
export type TextRevealTransitionType = keyof typeof textVariants;
/** Available text reveal container orchestration variant names. */
export type TextRevealTransitionContainerType = keyof typeof textContainerVariants;
