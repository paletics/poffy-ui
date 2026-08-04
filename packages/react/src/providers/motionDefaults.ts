import type { PoffyMotionStyle } from './AnimationProvider.types';
import { isPoffyMotionStyle } from './motionStyle';

/** Initial values shared by AnimationProvider and server-rendered document attributes. */
export interface MotionDefaults {
  defaultAnimationEnabled?: boolean;
  defaultMotionStyle?: PoffyMotionStyle;
}

/** The server-known portion of AnimationProvider state before OS preferences are available. */
export interface ResolvedMotionDefaults {
  animationEnabled: boolean;
  isAnimating: boolean;
  motionStyle: PoffyMotionStyle;
  resolvedMotionStyle: PoffyMotionStyle;
}

/**
 * Resolves AnimationProvider defaults without accessing browser APIs.
 *
 * OS reduced-motion is intentionally not considered here: it is a client-only
 * preference and AnimationProvider uses `false` as its server snapshot.
 */
export const resolveMotionDefaults = ({
  defaultAnimationEnabled = true,
  defaultMotionStyle = 'standard',
}: MotionDefaults = {}): ResolvedMotionDefaults => {
  const motionStyle = isPoffyMotionStyle(defaultMotionStyle) ? defaultMotionStyle : 'standard';
  const isAnimating = defaultAnimationEnabled && motionStyle !== 'none';

  return {
    animationEnabled: defaultAnimationEnabled,
    isAnimating,
    motionStyle,
    resolvedMotionStyle: isAnimating ? motionStyle : 'none',
  };
};
