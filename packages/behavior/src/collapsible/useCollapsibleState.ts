'use client';

import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { useControllableState } from '../hooks/state';
import type { UseCollapsibleStateProps } from './useCollapsibleState.types';

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Owns collapsible open state in controlled or uncontrolled mode. Controlled mode requires both
 * `open` and `onOpenChange`; disabled instances ignore state-change requests. Runtime input that
 * supplies `open` without a callable callback uses that value as the initial uncontrolled state
 * and warns in development.
 */
export const useCollapsibleState = ({
  open,
  defaultOpen,
  disabled = false,
  onOpenChange,
}: UseCollapsibleStateProps) => {
  const resolvedOnOpenChange = typeof onOpenChange === 'function' ? onOpenChange : undefined;
  const hasControlledPair = open !== undefined && resolvedOnOpenChange !== undefined;
  const {
    value: currentOpen,
    isControlled,
    setValue: setUncontrolledOpen,
  } = useControllableState({
    value: hasControlledPair ? open : undefined,
    defaultValue: !hasControlledPair && open !== undefined ? open : (defaultOpen ?? false),
  });
  const currentOpenRef = useRef(currentOpen);

  useEffect(() => {
    if (open === undefined || hasControlledPair) return;
    const nodeEnv = (
      globalThis as {
        process?: { env?: Record<string, string | undefined> };
      }
    ).process?.env?.['NODE_ENV'];
    if (nodeEnv === 'production') return;
    console.warn(
      '[useCollapsibleState] `open` without `onOpenChange` falls back to uncontrolled initial state.',
    );
  }, [hasControlledPair, open]);

  useIsomorphicLayoutEffect(() => {
    currentOpenRef.current = currentOpen;
  }, [currentOpen]);

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (disabled) return;
      if (nextOpen === currentOpenRef.current) return;

      if (!isControlled) {
        currentOpenRef.current = nextOpen;
        setUncontrolledOpen(nextOpen);
      }

      resolvedOnOpenChange?.(nextOpen);
    },
    [disabled, isControlled, resolvedOnOpenChange, setUncontrolledOpen],
  );

  const toggle = useCallback(() => {
    setOpen(!currentOpenRef.current);
  }, [setOpen]);

  return {
    open: currentOpen,
    isControlled,
    setOpen,
    toggle,
  };
};
