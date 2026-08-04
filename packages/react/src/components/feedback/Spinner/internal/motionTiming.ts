import type { PoffyMotionStyle } from '@/providers/AnimationProvider.types';

const scales: Record<PoffyMotionStyle, number> = { subtle: 1.5, standard: 1, pop: 0.8, none: 1 };

export const getSpinnerMotionDuration = (duration: number, style: PoffyMotionStyle): number =>
  duration * scales[style];
