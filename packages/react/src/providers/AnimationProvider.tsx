'use client';

import { createContext, ReactElement, useCallback, useContext, useMemo, useState } from 'react';
import { useMediaQuery } from '@poffy-ui/behavior/hooks';
import type {
  AnimationContextType,
  AnimationProviderProps,
  PoffyMotionStyle,
} from './AnimationProvider.types';
import { isPoffyMotionStyle } from './motionStyle';
import { resolveMotionDefaults } from './motionDefaults';
import { MotionScope } from './MotionScope';
import { createGlobalDocumentOwnerStack } from './globalDocumentOwnership';
import { useGlobalDocumentOwner } from './useGlobalDocumentOwner';
import { useGlobalPreferenceRestoreGate } from './useGlobalPreferenceRestoreGate';

/**
 * Public AnimationProvider context and props types.
 */
export type {
  AnimationContextType,
  AnimationProviderProps,
  PoffyMotionStyle,
} from './AnimationProvider.types';

const ANIMATION_STORAGE_KEY = 'poffy-animation-enabled';
const MOTION_STYLE_STORAGE_KEY = 'poffy-motion-style';

interface GlobalMotionDocumentState {
  animationEnabled: boolean;
  isAnimating: boolean;
  motionStyle: PoffyMotionStyle;
  resolvedMotionStyle: PoffyMotionStyle;
}

interface GlobalMotionAttributes {
  animation: string | null;
  motionStyle: string | null;
  scopeFallback: string | null;
}

const restoreAttribute = (targetDocument: Document, name: string, value: string | null) => {
  if (value === null) targetDocument.documentElement.removeAttribute(name);
  else targetDocument.documentElement.setAttribute(name, value);
};

const persistGlobalMotionPreferences = (
  targetDocument: Document,
  state: GlobalMotionDocumentState,
) => {
  try {
    targetDocument.defaultView?.localStorage.setItem(
      ANIMATION_STORAGE_KEY,
      String(state.animationEnabled),
    );
    targetDocument.defaultView?.localStorage.setItem(MOTION_STYLE_STORAGE_KEY, state.motionStyle);
  } catch {
    // localStorage unavailable (e.g. private browsing, storage quota exceeded)
  }
};

const globalMotionOwnerStack = createGlobalDocumentOwnerStack<
  GlobalMotionDocumentState,
  GlobalMotionAttributes
>({
  capture: (targetDocument) => ({
    animation: targetDocument.documentElement.getAttribute('data-animation'),
    motionStyle: targetDocument.documentElement.getAttribute('data-motion-style'),
    scopeFallback: targetDocument.documentElement.getAttribute('data-motion-scope-fallback'),
  }),
  apply: (targetDocument, { isAnimating, resolvedMotionStyle }) => {
    targetDocument.documentElement.setAttribute(
      'data-animation',
      isAnimating ? 'enabled' : 'disabled',
    );
    targetDocument.documentElement.setAttribute('data-motion-style', resolvedMotionStyle);
    const cssScopeRule = (
      targetDocument.defaultView as (Window & { CSSScopeRule?: unknown }) | null
    )?.CSSScopeRule;
    if (typeof cssScopeRule === 'undefined' && !isAnimating) {
      targetDocument.documentElement.setAttribute('data-motion-scope-fallback', 'disabled');
    } else {
      targetDocument.documentElement.removeAttribute('data-motion-scope-fallback');
    }
  },
  restore: (targetDocument, { animation, motionStyle, scopeFallback }) => {
    restoreAttribute(targetDocument, 'data-animation', animation);
    restoreAttribute(targetDocument, 'data-motion-style', motionStyle);
    restoreAttribute(targetDocument, 'data-motion-scope-fallback', scopeFallback);
  },
  onActiveChange: persistGlobalMotionPreferences,
});

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Provides animation preferences to a subtree. At the application root, `global` synchronizes the
 * effective preference to the owner document and restores persisted preferences after hydration;
 * with `global={false}` and `scope`, it applies only to the local subtree. OS reduced-motion always
 * disables `isAnimating`.
 */
export const AnimationProvider = ({
  children,
  defaultAnimationEnabled = true,
  defaultMotionStyle = 'standard',
  global = true,
  ownerDocument,
  scope = false,
}: AnimationProviderProps): ReactElement => {
  const resolvedOwnerDocument =
    ownerDocument ?? (typeof document === 'undefined' ? undefined : document);
  const initialMotionDefaults = resolveMotionDefaults({
    defaultAnimationEnabled,
    defaultMotionStyle,
  });
  const [animationEnabled, setAnimationEnabledState] = useState<boolean>(
    initialMotionDefaults.animationEnabled,
  );

  const [motionStyle, setMotionStyleState] = useState<PoffyMotionStyle>(
    initialMotionDefaults.motionStyle,
  );

  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY, {
    targetWindow: resolvedOwnerDocument?.defaultView ?? null,
  });

  const isAnimating = animationEnabled && motionStyle !== 'none' && !reducedMotion;
  const resolvedMotionStyle: PoffyMotionStyle = isAnimating ? motionStyle : 'none';
  const restorePreferences = useCallback(() => {
    try {
      const storage = resolvedOwnerDocument?.defaultView?.localStorage;
      const savedAnimationEnabled = storage?.getItem(ANIMATION_STORAGE_KEY);
      if (savedAnimationEnabled === 'true') setAnimationEnabledState(true);
      if (savedAnimationEnabled === 'false') setAnimationEnabledState(false);
      const saved = storage?.getItem(MOTION_STYLE_STORAGE_KEY);
      if (isPoffyMotionStyle(saved)) setMotionStyleState(saved);
    } catch {
      // localStorage unavailable (e.g. private browsing, storage quota exceeded)
    }
  }, [resolvedOwnerDocument]);

  const documentState = useMemo(
    () => ({ animationEnabled, isAnimating, motionStyle, resolvedMotionStyle }),
    [animationEnabled, isAnimating, motionStyle, resolvedMotionStyle],
  );
  const canOwnDocument = useGlobalPreferenceRestoreGate({
    enabled: global,
    restore: restorePreferences,
    restoreKey: resolvedOwnerDocument,
  });
  useGlobalDocumentOwner(
    globalMotionOwnerStack,
    documentState,
    canOwnDocument,
    resolvedOwnerDocument,
  );

  const setAnimationEnabled = useCallback((enabled: boolean) => {
    setAnimationEnabledState(enabled);
  }, []);

  const toggleAnimation = useCallback(() => {
    setAnimationEnabledState((prev) => !prev);
  }, []);

  const setMotionStyle = useCallback((style: PoffyMotionStyle) => {
    setMotionStyleState(isPoffyMotionStyle(style) ? style : 'standard');
  }, []);

  const contextValue = useMemo(
    () => ({
      reducedMotion,
      animationEnabled,
      isAnimating,
      motionStyle,
      resolvedMotionStyle,
      setAnimationEnabled,
      toggleAnimation,
      setMotionStyle,
    }),
    [
      reducedMotion,
      animationEnabled,
      isAnimating,
      motionStyle,
      resolvedMotionStyle,
      setAnimationEnabled,
      toggleAnimation,
      setMotionStyle,
    ],
  );

  return (
    <AnimationContext.Provider value={contextValue}>
      {!global && scope ? (
        <MotionScope isAnimating={isAnimating} motionStyle={resolvedMotionStyle}>
          {children}
        </MotionScope>
      ) : (
        children
      )}
    </AnimationContext.Provider>
  );
};

/** Returns the nearest animation preferences and controls, or throws when no provider is present. */
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
  'animationEnabled' | 'isAnimating' | 'motionStyle' | 'reducedMotion' | 'resolvedMotionStyle'
> => {
  const context = useContext(AnimationContext);
  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);

  if (context) {
    return {
      animationEnabled: context.animationEnabled,
      isAnimating: context.isAnimating,
      motionStyle: context.motionStyle,
      reducedMotion: context.reducedMotion,
      resolvedMotionStyle: context.resolvedMotionStyle,
    };
  }

  return {
    animationEnabled: true,
    isAnimating: !reducedMotion,
    motionStyle: 'standard',
    reducedMotion,
    resolvedMotionStyle: reducedMotion ? 'none' : 'standard',
  };
};
