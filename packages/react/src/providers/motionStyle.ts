import type { PoffyMotionStyle } from './AnimationProvider.types';

type MotionRecord = Record<string, unknown>;

const motionStyles: readonly PoffyMotionStyle[] = ['subtle', 'standard', 'pop', 'none'];

/** Runtime guard for public JavaScript consumers and persisted browser values. */
export const isPoffyMotionStyle = (value: unknown): value is PoffyMotionStyle =>
  typeof value === 'string' && motionStyles.some((style) => style === value);

const isRecord = (value: unknown): value is MotionRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const multipliers = {
  subtle: {
    distance: 0.5,
    rotation: 0.25,
    scale: 0.5,
    duration: 0.8,
    stiffness: 0.75,
    damping: 1.35,
  },
  pop: {
    distance: 1.25,
    rotation: 1.25,
    scale: 1.25,
    duration: 1.1,
    stiffness: 1.1,
    damping: 0.85,
  },
} as const;

const transformDragElastic = (value: number, style: Exclude<PoffyMotionStyle, 'standard' | 'none'>) =>
  Math.min(1, Math.max(0, value * multipliers[style].distance));

const transformNumber = (value: number, key: string, style: PoffyMotionStyle): number => {
  if (style === 'standard' || style === 'none') return value;

  const profile = multipliers[style];
  if (key === 'x' || key === 'y') return value * profile.distance;
  if (key === 'dragElastic') return transformDragElastic(value, style);
  if (key === 'rotate' || key === 'rotateX' || key === 'rotateY') return value * profile.rotation;
  if (key === 'scale' || key === 'scaleX' || key === 'scaleY') {
    return 1 + (value - 1) * profile.scale;
  }
  if (
    key === 'duration' ||
    key === 'delay' ||
    key === 'repeatDelay' ||
    key === 'staggerChildren' ||
    key === 'delayChildren'
  ) {
    return value * profile.duration;
  }
  if (key === 'stiffness') return value * profile.stiffness;
  if (key === 'damping') return value * profile.damping;
  return value;
};

const transformPercentageDistance = (value: string, style: PoffyMotionStyle): string => {
  if (style === 'standard' || style === 'none') return value;
  const match = /^(-?(?:\d+|\d*\.\d+))%$/.exec(value);
  if (!match) return value;

  return `${Number(match[1]) * multipliers[style].distance}%`;
};

const forceInstantTransition = (value: unknown): unknown => {
  if (typeof value === 'function') {
    return (...args: unknown[]) => forceInstantTransition(value(...args));
  }
  if (Array.isArray(value)) return value.map(forceInstantTransition);
  if (!isRecord(value)) return value;

  return {
    ...Object.fromEntries(
      Object.entries(value).map(([entryKey, entryValue]) => [
        entryKey,
        forceInstantTransition(entryValue),
      ]),
    ),
    type: 'tween',
    duration: 0,
    delay: 0,
    repeat: 0,
    repeatDelay: 0,
    delayChildren: 0,
    staggerChildren: 0,
  };
};

const transformMotionValue = (value: unknown, style: PoffyMotionStyle, key = ''): unknown => {
  if (style === 'none' && key === 'transition') return forceInstantTransition(value);
  if (typeof value === 'number') return transformNumber(value, key, style);
  if (typeof value === 'string' && (key === 'x' || key === 'y')) {
    return transformPercentageDistance(value, style);
  }

  if (key === 'dragElastic' && isRecord(value) && style !== 'standard' && style !== 'none') {
    return Object.fromEntries(
      Object.entries(value).map(([edge, edgeValue]) => [
        edge,
        typeof edgeValue === 'number' ? transformDragElastic(edgeValue, style) : edgeValue,
      ]),
    );
  }

  if (typeof value === 'function') {
    return (...args: unknown[]) => transformMotionValue(value(...args), style, key);
  }

  if (Array.isArray(value)) {
    // Easing curves and keyframe timing arrays are ratios, not motion magnitudes.
    if (key === 'ease' || key === 'times') return value;
    return value.map((item) => transformMotionValue(item, style, key));
  }

  if (!isRecord(value)) return value;

  return Object.fromEntries(
    Object.entries(value).map(([entryKey, entryValue]) => [
      entryKey,
      transformMotionValue(entryValue, style, entryKey),
    ]),
  );
};

/**
 * Adapts existing Motion variants and transitions to the resolved app-wide
 * motion style without changing their semantic animation type.
 *
 * Explicit component options still select the animation family; this helper
 * only adjusts magnitude and physics consistently across primitives.
 */
export const applyMotionStyle = <T>(definition: T, style: PoffyMotionStyle): T =>
  transformMotionValue(definition, isPoffyMotionStyle(style) ? style : 'standard') as T;
