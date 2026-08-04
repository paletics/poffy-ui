import { baseTokens } from '@poffy-ui/system';

export const motionOffsets = {
  sm: 11.3,
  md: 22.6,
  lg: 32,
} as const;

export const motionScales = {
  in: 0.841,
  out: 1.189,
  hover: 1.059,
  press: 0.944,
} as const;

export const springs = {
  snappy: { type: 'spring', stiffness: 500, damping: 25, mass: 1 },
  gentle: { type: 'spring', stiffness: 120, damping: 14, mass: 1 },
  bouncy: { type: 'spring', stiffness: 400, damping: 15, mass: 0.8 },
  heavy: { type: 'spring', stiffness: 400, damping: 35, mass: 1.2 },
  wobbly: { type: 'spring', stiffness: 600, damping: 12, mass: 0.8 },
  lazy: { type: 'spring', stiffness: 50, damping: 20, mass: 1 },
  sharp: { type: 'spring', stiffness: 1000, damping: 50, mass: 0.5 },
} as const;

export const overlay = {
  popover: {
    scale: motionScales.press,
    y: motionOffsets.sm,
  },
  slide: {
    y: motionOffsets.md,
    scale: 1.0,
  },
  zoom: { scale: motionScales.in, opacity: 0 },
} as const;

export const transitions = {
  base: { duration: baseTokens.motion.durations.base, ease: 'easeOut' },
  fast: { duration: baseTokens.motion.durations.fast, ease: 'easeOut' },
  slow: { duration: baseTokens.motion.durations.slow, ease: 'easeOut' },
  spring: springs,
} as const;
