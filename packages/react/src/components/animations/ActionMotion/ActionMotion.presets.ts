import { baseTokens } from '@poffy-ui/system';
import { motionScales, springs } from '../presets';
import { CustomData } from '../types';
import { getCustomValue } from '../utils';

const entranceInitial = { opacity: 0, y: 10, scale: 0.98 };
const entranceAnimate = { opacity: 1, y: 0, scale: 1 };

/**
 * Action Motion Presets
 *
 * ### AI Context & Architecture
 * Defines micro-interaction variants for user actions like hover, press, and focus.
 * Most variants use spring-based physics from `baseTokens.motion.springs`.
 * Customization is supported via `customData` and the `getCustomValue` utility.
 */
export const actionVariants = {
  /**
   * Press: Standard bouncy interaction.
   * Suitable for most interactive elements.
   */
  press: {
    initial: (custom?: CustomData) =>
      getCustomValue(custom, 'staggerChildren', 0) > 0 ? entranceInitial : {},
    animate: (custom?: CustomData) =>
      getCustomValue(custom, 'staggerChildren', 0) > 0 ? entranceAnimate : {},
    whileHover: (custom?: CustomData) => ({
      scale: getCustomValue(custom, 'hoverScale', motionScales.hover),
    }),
    whileFocus: (custom?: CustomData) => ({
      scale: getCustomValue(custom, 'hoverScale', motionScales.hover),
      transition: { duration: baseTokens.motion.durations.fast },
    }),
    whileTap: (custom?: CustomData) => ({
      scale: getCustomValue(custom, 'tapScale', motionScales.press),
    }),
    transition: (custom?: CustomData) => ({
      ...springs.bouncy,
      staggerChildren: getCustomValue(custom, 'staggerChildren', 0),
    }),
  },

  /**
   * Physical: Heavy, sticker-like interaction with shadow and elevation.
   * Leverages Y-axis movement and filter effects for a 3D feel.
   */
  physical: {
    initial: (custom?: CustomData) =>
      getCustomValue(custom, 'staggerChildren', 0) > 0 ? { ...entranceInitial, scale: 0.95 } : {},
    animate: (custom?: CustomData) =>
      getCustomValue(custom, 'staggerChildren', 0) > 0 ? entranceAnimate : {},
    whileHover: (custom?: CustomData) => {
      const shadowSize = getCustomValue(custom, 'shadowSize', 4);
      const lift = getCustomValue(custom, 'lift', baseTokens.motion.actions.lift);
      const shadowColor = getCustomValue(custom, 'shadowColor', 'rgba(0,0,0,0.2)');
      return {
        scale: 1.02,
        y: lift,
        filter: 'brightness(1.05)',
        boxShadow: `${Math.abs(lift) + shadowSize}px ${Math.abs(lift) + shadowSize}px 0px ${shadowColor}`,
      };
    },
    whileTap: (custom?: CustomData) => {
      const sink = getCustomValue(custom, 'sink', baseTokens.motion.actions.sink);
      const shadowColor = getCustomValue(custom, 'shadowColor', 'rgba(0,0,0,0.2)');
      return {
        scale: motionScales.press,
        y: sink,
        filter: 'brightness(0.95)',
        boxShadow: `0px 0px 0px ${shadowColor}`,
      };
    },
    transition: (custom?: CustomData) => ({
      ...springs.heavy,
      staggerChildren: getCustomValue(custom, 'staggerChildren', 0),
    }),
  },

  /**
   * Subtle: Minimal scale change with focus indicators.
   * Best for professional or clean interfaces.
   */
  subtle: {
    initial: (custom?: CustomData) =>
      getCustomValue(custom, 'staggerChildren', 0) > 0 ? entranceInitial : {},
    animate: (custom?: CustomData) =>
      getCustomValue(custom, 'staggerChildren', 0) > 0 ? entranceAnimate : {},
    whileHover: (custom?: CustomData) => ({
      scale: getCustomValue(custom, 'hoverScale', 1.01),
    }),
    whileFocus: (custom?: CustomData) => ({
      scale: getCustomValue(custom, 'focusScale', 1.01),
    }),
    whileTap: (custom?: CustomData) => ({
      scale: getCustomValue(custom, 'tapScale', motionScales.press),
    }),
    transition: (custom?: CustomData) => ({
      ...springs.snappy,
      staggerChildren: getCustomValue(custom, 'staggerChildren', 0),
    }),
  },

  stagger: {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    transition: (custom?: CustomData) => ({
      staggerChildren: getCustomValue(custom, 'staggerChildren', 0.05),
      delayChildren: getCustomValue(custom, 'delayChildren', 0),
    }),
  },

  /**
   * Bouncy: Bold scale changes with rotation.
   * Expresses energy and playfulness.
   */
  bouncy: {
    initial: (custom?: CustomData) =>
      getCustomValue(custom, 'staggerChildren', 0) > 0 ? entranceInitial : {},
    animate: (custom?: CustomData) =>
      getCustomValue(custom, 'staggerChildren', 0) > 0 ? entranceAnimate : {},
    whileHover: (custom?: CustomData) => ({
      scale: getCustomValue(custom, 'hoverScale', 1.1),
      rotate: getCustomValue(custom, 'rotate', 2),
    }),
    whileTap: (custom?: CustomData) => ({
      scale: getCustomValue(custom, 'tapScale', 0.9),
      rotate: 0,
    }),
    transition: (custom?: CustomData) => ({
      ...springs.bouncy,
      staggerChildren: getCustomValue(custom, 'staggerChildren', 0),
    }),
  },

  /**
   * Vibrant: Hyper-responsive interaction with jitter effects.
   */
  vibrant: {
    whileHover: (custom?: CustomData) => ({
      scale: getCustomValue(custom, 'hoverScale', motionScales.hover),
      rotate: [0, -2, 2, -2, 0],
      transition: {
        scale: springs.wobbly,
        rotate: {
          duration: baseTokens.motion.durations.fast,
          ease: 'easeInOut',
          times: [0, 0.2, 0.5, 0.8, 1],
        },
      },
    }),
    whileFocus: {
      scale: 1.05,
      rotate: 0,
    },
    whileTap: {
      scale: 0.92,
      rotate: 0,
      transition: springs.snappy,
    },
  },

  /**
   * Squish: Rubber-like deformation on tap.
   */
  squish: {
    initial: (custom?: CustomData) =>
      getCustomValue(custom, 'staggerChildren', 0) > 0 ? entranceInitial : {},
    animate: (custom?: CustomData) =>
      getCustomValue(custom, 'staggerChildren', 0) > 0 ? entranceAnimate : {},
    whileHover: { scale: motionScales.hover, transition: springs.bouncy },
    whileTap: {
      scaleX: 1.25,
      scaleY: 0.75,
      transition: springs.bouncy,
    },
    transition: (custom?: CustomData) => ({
      staggerChildren: getCustomValue(custom, 'staggerChildren', 0),
    }),
  },

  /**
   * Glow: Luminous effects using box-shadows.
   */
  glow: {
    initial: (custom?: CustomData) =>
      getCustomValue(custom, 'staggerChildren', 0) > 0 ? entranceInitial : {},
    animate: (custom?: CustomData) =>
      getCustomValue(custom, 'staggerChildren', 0) > 0 ? entranceAnimate : {},
    whileHover: (custom?: CustomData) => {
      const color = getCustomValue(custom, 'glowColor', 'rgba(66, 153, 225, 0.6)');
      return { scale: 1.02, boxShadow: `0 0 15px ${color}, 0 0 30px ${color}` };
    },
    whileTap: { scale: 0.98, boxShadow: 'none' },
    transition: (custom?: CustomData) => ({
      type: 'tween',
      ease: 'easeOut',
      duration: baseTokens.motion.durations.base,
      staggerChildren: getCustomValue(custom, 'staggerChildren', 0),
    }),
  },

  /**
   * Pulse: Repeating heartbeat animation.
   */
  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: baseTokens.motion.durations.molasses * 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.95 },
  },

  /**
   * Sharp: Precise, low-latency feedback.
   */
  sharp: {
    initial: (custom?: CustomData) =>
      getCustomValue(custom, 'staggerChildren', 0) > 0 ? entranceInitial : {},
    animate: (custom?: CustomData) =>
      getCustomValue(custom, 'staggerChildren', 0) > 0 ? entranceAnimate : {},
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.97 },
    transition: (custom?: CustomData) => ({
      ...springs.sharp,
      staggerChildren: getCustomValue(custom, 'staggerChildren', 0),
    }),
  },

  shake: {
    animate: {
      x: [0, -4, 4, -4, 4, 0],
      transition: {
        duration: baseTokens.motion.durations.base,
        ease: 'easeInOut',
      },
    },
    whileHover: { scale: 1.01 },
    whileFocus: (custom?: CustomData) => ({
      scale: getCustomValue(custom, 'focusScale', 1.01),
    }),
    whileTap: (custom?: CustomData) => ({
      scale: getCustomValue(custom, 'tapScale', 1),
    }),
  },
} as const;

/** Action motion type. */
export type ActionMotionType = keyof typeof actionVariants;
