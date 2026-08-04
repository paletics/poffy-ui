import { motionOffsets, motionScales, springs, transitions } from '../presets';

export const revealVariants = {
  /**
   * Fade Up: Standard upward float and fade-in.
   * Most common choice for section headers and content cards.
   */
  'fade-up': {
    variants: {
      hidden: { opacity: 0, y: motionOffsets.lg },
      visible: { opacity: 1, y: 0 },
    },
    transition: springs.snappy,
  },

  /**
   * Fade Down: Downward float and fade-in.
   * Suitable for top-aligned elements like hero catchphrases.
   */
  'fade-down': {
    variants: {
      hidden: { opacity: 0, y: -motionOffsets.lg },
      visible: { opacity: 1, y: 0 },
    },
    transition: springs.snappy,
  },

  /**
   * Fade Right: Entrance from left to right.
   * Complements ZigZag layouts when applied to left-positioned content.
   */
  'fade-right': {
    variants: {
      hidden: { opacity: 0, x: -motionOffsets.lg },
      visible: { opacity: 1, x: 0 },
    },
    transition: springs.snappy,
  },

  /**
   * Fade Left: Entrance from right to left.
   * Ideal for ZigZag layout components positioned on the right.
   */
  'fade-left': {
    variants: {
      hidden: { opacity: 0, x: motionOffsets.lg },
      visible: { opacity: 1, x: 0 },
    },
    transition: springs.snappy,
  },

  /**
   * Zoom: Focus-drawing zoom-in effect.
   * Best for logos or high-emphasis visual assets.
   */
  zoom: {
    variants: {
      hidden: { opacity: 0, scale: motionScales.in },
      visible: { opacity: 1, scale: 1 },
    },
    transition: springs.bouncy,
  },

  /**
   * Blur: Modern entrance with gaussian blur and subtle scaling.
   * Delivers a premium, cinematic reveal for hero sections.
   */
  blur: {
    variants: {
      hidden: { opacity: 0, filter: `blur(${motionOffsets.sm}px)`, scale: 1.05 },
      visible: { opacity: 1, filter: 'blur(0px)', scale: 1 },
    },
    transition: { duration: transitions.slow.duration, ease: [0.33, 1, 0.68, 1] },
  },
} as const;

/** Reveal transition type. */
export type RevealTransitionType = keyof typeof revealVariants;
