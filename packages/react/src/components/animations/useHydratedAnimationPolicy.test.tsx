import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useHydratedAnimationPolicy } from './useHydratedAnimationPolicy';

const policyState = vi.hoisted(() => ({
  animationEnabled: true,
  isAnimating: true,
  isHydrated: true,
  motionStyle: 'pop' as const,
  reducedMotion: false,
  resolvedMotionStyle: 'pop' as const,
}));

vi.mock('@/providers/AnimationProvider', () => ({
  useOptionalAnimation: () => ({
    animationEnabled: policyState.animationEnabled,
    isAnimating: policyState.isAnimating,
    motionStyle: policyState.motionStyle,
    reducedMotion: policyState.reducedMotion,
    resolvedMotionStyle: policyState.resolvedMotionStyle,
  }),
}));

vi.mock('./useHydrated', () => ({ useHydrated: () => policyState.isHydrated }));

describe('useHydratedAnimationPolicy', () => {
  beforeEach(() => {
    policyState.isAnimating = true;
    policyState.isHydrated = true;
  });

  it.each([
    [false, false, false],
    [false, true, false],
    [true, false, false],
    [true, true, true],
  ])(
    'combines isAnimating=%s and isHydrated=%s into shouldAnimate=%s',
    (isAnimating, isHydrated, shouldAnimate) => {
      policyState.isAnimating = isAnimating;
      policyState.isHydrated = isHydrated;

      const { result } = renderHook(() => useHydratedAnimationPolicy());

      expect(result.current.shouldAnimate).toBe(shouldAnimate);
    },
  );

  it('passes through animation fields and hydration readiness', () => {
    const { result } = renderHook(() => useHydratedAnimationPolicy());

    expect(result.current).toMatchObject({
      animationEnabled: true,
      isAnimating: true,
      isHydrated: true,
      motionStyle: 'pop',
      reducedMotion: false,
      resolvedMotionStyle: 'pop',
    });
  });
});
