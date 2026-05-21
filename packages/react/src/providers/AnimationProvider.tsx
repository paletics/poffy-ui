'use client';

import {
  createContext,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';
import type { AnimationContextType, AnimationProviderProps } from './AnimationProvider.types';

/**
 * Public AnimationProvider context and props types.
 */
export type { AnimationContextType, AnimationProviderProps } from './AnimationProvider.types';

const ANIMATION_STORAGE_KEY = 'poffy-animation-enabled';

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

const subscribe = (callback: () => void): (() => void) => {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
};

const getSnapshot = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const getServerSnapshot = (): boolean => false;

/**
 * Injects animation preference state into the component tree and optionally syncs
 * `data-animation` on `document.documentElement` so CSS transitions/animations
 * can be globally suppressed without JavaScript.
 *
 * ### How `isAnimating` is resolved
 * ```
 * isAnimating = animationEnabled && !reducedMotion
 * ```
 * OS-level `prefers-reduced-motion` always takes precedence. Even if `animationEnabled`
 * is `true`, `isAnimating` will be `false` when the OS requests reduced motion.
 *
 * ### CSS integration
 * When `global=true`, the provider writes `data-animation="disabled"` on `<html>`.
 * Add this rule to your global stylesheet to suppress all CSS animations:
 * ```css
 * [data-animation="disabled"] * {
 *   animation-duration: 0.01ms !important;
 *   transition-duration: 0.01ms !important;
 * }
 * ```
 *
 * ### AI Context & Architecture
 * - **Tier**: Provider / Infrastructure
 * - **Scope**: App Root — place once in `_app.tsx` or `layout.tsx`
 * - **SSR Safety**: `reducedMotion` uses `useSyncExternalStore` with a `false` server snapshot.
 *   `animationEnabled` lazy-initializes from `localStorage` with an SSR guard.
 *
 * ### AI Usage
 * - **DO**: Read `isAnimating` in every `*FX` component to skip animation when `false`.
 * - **DO**: Expose `animationEnabled` / `toggleAnimation` in accessibility settings UI.
 * - **DON'T**: Read `reducedMotion` directly in components — use `isAnimating` instead.
 * - **DON'T**: Nest two `AnimationProvider` instances — the inner one silently overrides the outer.
 *
 * @example Global animation control (default)
 * ```tsx
 * import { AnimationProvider } from '@poffy-ui/react';
 *
 * <AnimationProvider defaultAnimationEnabled={true}>
 *   <App />
 * </AnimationProvider>
 * ```
 *
 * @example Disable animations for an embedded widget
 * ```tsx
 * import { AnimationProvider } from '@poffy-ui/react';
 *
 * <AnimationProvider defaultAnimationEnabled={false} global={false}>
 *   <Widget />
 * </AnimationProvider>
 * ```
 */
export const AnimationProvider = ({
  children,
  defaultAnimationEnabled = true,
  global = true,
}: AnimationProviderProps): ReactElement => {
  const [animationEnabled, setAnimationEnabledState] = useState<boolean>(() => {
    if (typeof window === 'undefined') return defaultAnimationEnabled;
    if (!global) return defaultAnimationEnabled;
    try {
      const saved = localStorage.getItem(ANIMATION_STORAGE_KEY);
      if (saved === 'true') return true;
      if (saved === 'false') return false;
    } catch {
      // localStorage unavailable (e.g. private browsing, storage quota exceeded)
    }
    return defaultAnimationEnabled;
  });

  const reducedMotion = useSyncExternalStore<boolean>(subscribe, getSnapshot, getServerSnapshot);

  const isAnimating = animationEnabled && !reducedMotion;

  useEffect(() => {
    if (!global) return;

    document.documentElement.setAttribute('data-animation', isAnimating ? 'enabled' : 'disabled');

    try {
      localStorage.setItem(ANIMATION_STORAGE_KEY, String(animationEnabled));
    } catch {
      // localStorage unavailable (e.g. private browsing, storage quota exceeded)
    }
  }, [isAnimating, animationEnabled, global]);

  const setAnimationEnabled = useCallback((enabled: boolean) => {
    setAnimationEnabledState(enabled);
  }, []);

  const toggleAnimation = useCallback(() => {
    setAnimationEnabledState((prev) => !prev);
  }, []);

  const contextValue = useMemo(
    () => ({ reducedMotion, animationEnabled, isAnimating, setAnimationEnabled, toggleAnimation }),
    [reducedMotion, animationEnabled, isAnimating, setAnimationEnabled, toggleAnimation],
  );

  return <AnimationContext.Provider value={contextValue}>{children}</AnimationContext.Provider>;
};

/**
 * Returns animation preferences and controls from the nearest `AnimationProvider`.
 *
 * ### AI Usage
 * - **DON'T**: Do not call outside an `AnimationProvider` tree — throws at runtime
 *
 * @returns `{ reducedMotion, animationEnabled, isAnimating, setAnimationEnabled, toggleAnimation }`
 *
 * @example
 * ```tsx
 * import { useAnimation } from '@poffy-ui/react';
 *
 * const { isAnimating } = useAnimation();
 * if (!isAnimating) return <StaticFallback />;
 * return <ParticleFieldFX />;
 * ```
 */
export const useAnimation = (): AnimationContextType => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within an AnimationProvider.');
  }
  return context;
};

/**
 * Returns animation state when a provider exists, otherwise falls back to the
 * OS reduced-motion preference. This keeps animation primitives usable outside
 * `ThemeProvider` while allowing app-level animation settings to disable motion.
 */
export const useOptionalAnimation = (): Pick<
  AnimationContextType,
  'animationEnabled' | 'isAnimating' | 'reducedMotion'
> => {
  const context = useContext(AnimationContext);
  const reducedMotion = useSyncExternalStore<boolean>(subscribe, getSnapshot, getServerSnapshot);

  if (context) {
    return {
      animationEnabled: context.animationEnabled,
      isAnimating: context.isAnimating,
      reducedMotion: context.reducedMotion,
    };
  }

  return {
    animationEnabled: true,
    isAnimating: !reducedMotion,
    reducedMotion,
  };
};
