'use client';

import { useEffect, useMemo, useState } from 'react';
import type { UseAnimationPauseOptions } from './useAnimationPause.types';

interface IntersectionState {
  key: IntersectionKey;
  isIntersecting: boolean;
}

interface IntersectionKey {
  disabled: boolean;
  pauseWhenOffscreen: boolean;
  rootMargin: string | undefined;
  target: Element | null | undefined;
  threshold: number | readonly number[];
}

/**
 * Returns whether a non-essential animation should be paused.
 *
 * Compose the result with an effect's existing pause condition. This hook does
 * not make accessibility decisions; callers must continue to respect the app
 * animation policy and `prefers-reduced-motion`. `disabled` always returns
 * `true`. When offscreen pausing is requested but a target or
 * `IntersectionObserver` is unavailable, the hook also returns `true` rather
 * than allowing an unobservable animation to run.
 */
export const useAnimationPause = ({
  target,
  targetDocument,
  disabled = false,
  pauseWhenDocumentHidden = true,
  pauseWhenOffscreen = false,
  rootMargin,
  threshold = 0,
}: UseAnimationPauseOptions = {}): boolean => {
  const [, forceVisibilityRender] = useState(0);
  const [intersectionState, setIntersectionState] = useState<IntersectionState | null>(null);
  const ownerDocument =
    target?.ownerDocument ??
    (targetDocument === undefined
      ? typeof document === 'undefined'
        ? undefined
        : document
      : (targetDocument ?? undefined));
  const intersectionKey = useMemo(
    () => ({
      disabled,
      pauseWhenOffscreen,
      rootMargin,
      target,
      threshold,
    }),
    [disabled, pauseWhenOffscreen, rootMargin, target, threshold],
  );

  useEffect(() => {
    if (disabled || !pauseWhenDocumentHidden || !ownerDocument) return;

    const update = () => forceVisibilityRender((revision) => revision + 1);
    ownerDocument.addEventListener('visibilitychange', update);
    return () => ownerDocument.removeEventListener('visibilitychange', update);
  }, [disabled, ownerDocument, pauseWhenDocumentHidden]);

  useEffect(() => {
    if (disabled || !pauseWhenOffscreen) return;

    const IntersectionObserverConstructor = target?.ownerDocument.defaultView?.IntersectionObserver;
    if (!target || !IntersectionObserverConstructor) return;

    const observer = new IntersectionObserverConstructor(
      ([entry]) =>
        setIntersectionState({
          key: intersectionKey,
          isIntersecting: entry?.isIntersecting ?? true,
        }),
      {
        rootMargin,
        threshold:
          typeof threshold === 'number'
            ? threshold
            : threshold === undefined
              ? undefined
              : Array.from(threshold),
      },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [disabled, intersectionKey, pauseWhenOffscreen, rootMargin, target, threshold]);

  if (disabled) return true;
  if (pauseWhenDocumentHidden && ownerDocument?.visibilityState === 'hidden') return true;
  if (!pauseWhenOffscreen) return false;

  const IntersectionObserverConstructor = target?.ownerDocument.defaultView?.IntersectionObserver;
  if (!target || !IntersectionObserverConstructor) return true;

  const isIntersecting =
    intersectionState?.key === intersectionKey ? intersectionState.isIntersecting : true;
  return !isIntersecting;
};
