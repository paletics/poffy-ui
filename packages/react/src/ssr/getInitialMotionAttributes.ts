import type { PoffyMotionStyle } from '@/providers/AnimationProvider.types';
import { resolveMotionDefaults } from '@/providers/motionDefaults';

/**
 * Initial server-side configuration shared with AnimationProvider.
 *
 * These options produce the deterministic document snapshot rendered before client-only
 * reduced-motion preference resolution after hydration.
 */
export interface InitialMotionOptions {
  /**
   * Whether animations are enabled in the server-rendered initial state.
   *
   * @defaultValue `true`
   */
  defaultAnimationEnabled?: boolean;
  /**
   * The initial motion profile before client-only reduced-motion resolution. `none` also disables
   * the returned animation attribute.
   *
   * @defaultValue `'standard'`
   */
  defaultMotionStyle?: PoffyMotionStyle;
}

/** Attributes to spread onto the document element before AnimationProvider hydrates. */
export interface InitialMotionAttributes {
  /** Whether the initial server snapshot enables motion. */
  'data-animation': 'enabled' | 'disabled';
  /** Resolved motion profile consumed by Poffy motion CSS. */
  'data-motion-style': PoffyMotionStyle;
}

/**
 * Returns the `<html>` motion attributes matching AnimationProvider's initial
 * server state. This helper is safe to call in server components and document
 * templates because it does not read browser APIs or persisted preferences.
 *
 * @param options - Initial motion inputs shared with AnimationProvider.
 * @returns Attributes to spread onto the server-rendered `<html>` element.
 *
 * @example
 * ```tsx
 * import { getInitialMotionAttributes } from '@poffy-ui/react/ssr';
 *
 * <html {...getInitialMotionAttributes({ defaultMotionStyle: 'subtle' })}>
 * ```
 */
export const getInitialMotionAttributes = (
  options: InitialMotionOptions = {},
): InitialMotionAttributes => {
  const { isAnimating, resolvedMotionStyle } = resolveMotionDefaults(options);

  return {
    'data-animation': isAnimating ? 'enabled' : 'disabled',
    'data-motion-style': resolvedMotionStyle,
  };
};
