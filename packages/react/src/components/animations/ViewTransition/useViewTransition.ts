'use client';

import { useCallback } from 'react';
import { flushSync } from 'react-dom';
import { useOptionalAnimation } from '@/providers/AnimationProvider';
import { useHydrated } from '../useHydrated';
import type {
  UseViewTransitionReturn,
  ViewTransitionResult,
  ViewTransitionUpdate,
} from './ViewTransition.types';

interface NativeViewTransition {
  finished: Promise<unknown>;
  updateCallbackDone?: Promise<unknown>;
}

interface ViewTransitionDocument {
  startViewTransition?: (update: () => void) => NativeViewTransition;
}

const completeWithoutTransition = (update: ViewTransitionUpdate): ViewTransitionResult => {
  update();
  return { supported: false, finished: Promise.resolve() };
};

/**
 * Captures synchronous React updates in the browser View Transition API.
 *
 * This adapter deliberately does not own routing or global `::view-transition-*`
 * styles. It complements `LayoutTransition` for updates that replace route-level
 * DOM, while respecting the nearest Poffy animation policy. It is disabled before hydration,
 * when animation is disabled, or when the supplied owner document lacks the native API; in those
 * cases it runs `update` synchronously without browser motion. An API-start failure has the same
 * fallback, while an error thrown by `update` after native capture is preserved.
 */
export const useViewTransition = (ownerDocument?: Document): UseViewTransitionReturn => {
  const { isAnimating } = useOptionalAnimation();
  const isHydrated = useHydrated();
  const activeDocument = ownerDocument ?? (typeof document === 'undefined' ? undefined : document);
  const isSupported =
    isHydrated &&
    Boolean((activeDocument as ViewTransitionDocument | undefined)?.startViewTransition);

  const startViewTransition = useCallback(
    (update: ViewTransitionUpdate): ViewTransitionResult => {
      const start = (activeDocument as ViewTransitionDocument | undefined)?.startViewTransition;
      if (!isHydrated || !isAnimating || !start) return completeWithoutTransition(update);

      let updateStarted = false;
      let updateError: unknown;
      try {
        const transition = start.call(activeDocument, () => {
          updateStarted = true;
          try {
            flushSync(update);
          } catch (error) {
            updateError = error;
            throw error;
          }
        });
        // The platform exposes update callback failures through a separate promise. Observe it
        // so callers only need to handle the normalized `finished` result below.
        void transition.updateCallbackDone?.catch(() => undefined);
        return {
          supported: true,
          finished: transition.finished.then(
            () => undefined,
            (error) => {
              if (error === updateError) throw error;
            },
          ),
        };
      } catch (error) {
        if (updateStarted) throw error;
        return completeWithoutTransition(update);
      }
    },
    [activeDocument, isAnimating, isHydrated],
  );

  return { isSupported, startViewTransition };
};
