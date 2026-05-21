import { baseTokens } from '@poffy-ui/system';
import { motionOffsets, motionScales, overlay, springs } from '../presets';
import { CustomData } from '../types';
import { getCustomValue } from '../utils';

/**
 * Overlay Transition Presets
 *
 * ### AI Context & Architecture
 * Defines variants for overlays such as modals, popovers, drawers, and puffs.
 * Orchestrates entrance and exit animations including opacity, scale, and position.
 * Integration with `AnimatePresence` is expected for most presets.
 */
export const overlayVariants = {
  /**
   * Fade: Simple opacity transition.
   */
  fade: {
    variants: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    transition: (custom?: CustomData) => ({
      duration: getCustomValue(custom, 'duration', baseTokens.motion.durations.fast),
    }),
  },

  /**
   * Popover: Standard pop-up effect from below with subtle scaling.
   * Commonly used for tooltips and contextual menus.
   */
  popover: {
    variants: {
      initial: (custom?: CustomData) => ({
        opacity: 0,
        scale: getCustomValue(custom, 'scale', overlay.popover.scale),
        y: getCustomValue(custom, 'y', overlay.popover.y),
      }),
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: (custom?: CustomData) => ({
        opacity: 0,
        scale: getCustomValue(custom, 'scale', overlay.popover.scale),
        y: getCustomValue(custom, 'y', overlay.popover.y),
      }),
    },
    transition: (custom?: CustomData) => ({
      duration: getCustomValue(custom, 'duration', baseTokens.motion.durations.base),
      ease: baseTokens.motion.easings.default,
    }),
  },

  /**
   * Zoom: Energetic zoom-in effect from center.
   * Best for priority alerts or emphasis.
   */
  zoom: {
    variants: {
      initial: { opacity: 0, scale: overlay.zoom.scale },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: overlay.zoom.scale },
    },
    transition: springs.snappy,
  },

  /**
   * Modal: Bouncy scale and position entrance for dialogs.
   * Provides a tactile and reliable feel for interactive containers.
   */
  modal: {
    variants: {
      initial: { opacity: 0, scale: motionScales.in, y: motionOffsets.md },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: motionScales.in, y: motionOffsets.md },
    },
    transition: springs.bouncy,
  },

  /**
   * Slide Up: Sheet-like entry from the bottom.
   * Essential for mobile drawers and bottom sheets.
   */
  'slide-up': {
    variants: {
      initial: { opacity: 0, y: '100%' },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: '100%' },
    },
    transition: {
      type: 'spring',
      damping: 30,
      stiffness: 300,
      mass: 1,
    },
  },

  /**
   * Slide Right: Entrance from left to right.
   * Used for sidebars and side navigation menus.
   */
  'slide-right': {
    variants: {
      initial: { x: '-100%' },
      animate: { x: 0 },
      exit: { x: '-100%' },
    },
    transition: springs.snappy,
  },

  /**
   * Slide Left: Entrance from right to left.
   * Ideal for cart panels or auxiliary sidebars.
   */
  'slide-left': {
    variants: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
    },
    transition: springs.snappy,
  },

  /**
   * Slide Down: Entrance from top to bottom.
   * Recommended for banners and top-level notifications.
   */
  'slide-down': {
    variants: {
      initial: { y: '-100%' },
      animate: { y: 0 },
      exit: { y: '-100%' },
    },
    transition: springs.snappy,
  },

  /**
   * Toast: Bouncy entry from corners with quick fade-out.
   */
  puff: {
    variants: {
      initial: { opacity: 0, y: -motionOffsets.md, scale: motionScales.in },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: {
        opacity: 0,
        scale: motionScales.in,
        transition: { duration: 0.141 },
      },
    },
    transition: springs.bouncy,
  },

  /**
   * Blur: Cinematic appearance with gaussian blur effect.
   */
  blur: {
    variants: {
      initial: { opacity: 0, filter: `blur(${motionOffsets.sm}px)`, scale: 1.05 },
      animate: { opacity: 1, filter: 'blur(0px)', scale: 1 },
      exit: { opacity: 0, filter: `blur(${motionOffsets.sm}px)`, scale: 1.05 },
    },
    transition: { duration: baseTokens.motion.durations.base, ease: 'easeOut' },
  },
} as const;

/** Overlay transition type. */
export type OverlayTransitionType = keyof typeof overlayVariants;
