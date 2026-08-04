'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** Controlled and initial values for a state cell that reserves `undefined` for uncontrolled mode. */
export interface UseControllableStateOptions<T> {
  /**
   * Current value in controlled mode. `undefined` reserves uncontrolled mode.
   */
  value?: T;

  /**
   * Initial value used only for the first uncontrolled state. Later changes to this prop do not
   * reset the cell, and it is ignored while `value` is defined.
   */
  defaultValue: T;
}

/**
 * Effective value, ownership indicator, and an updater ignored while controlled.
 *
 * On a controlled-to-uncontrolled handoff, `value` remains the latest committed controlled value
 * for the release render; updates requested during that handoff are applied after it.
 */
export interface UseControllableStateReturn<T> {
  /** The controlled value, or the internal value when uncontrolled. */
  value: T;

  /** Whether `value` currently owns the state. */
  isControlled: boolean;

  /** Updates internal state only while uncontrolled. */
  setValue: Dispatch<SetStateAction<T>>;
}

/**
 * Owns a single controlled or uncontrolled value without losing its last
 * controlled value when ownership is released.
 *
 * `undefined` is reserved as the uncontrolled sentinel. Event callbacks,
 * validation, normalization, and disabled/read-only policy stay with the
 * calling feature because their contracts vary by component.
 */
export const useControllableState = <T>({
  value: controlledValue,
  defaultValue,
}: UseControllableStateOptions<T>): UseControllableStateReturn<T> => {
  const [uncontrolledState, setUncontrolledState] = useState(() => ({ value: defaultValue }));
  const isControlled = controlledValue !== undefined;
  const committedControlledValueRef = useRef(isControlled ? controlledValue : defaultValue);
  const wasControlledRef = useRef(isControlled);
  const pendingHandoffRef = useRef<{
    value: T;
    updates: SetStateAction<T>[];
  } | null>(null);

  const value = isControlled
    ? controlledValue
    : wasControlledRef.current
      ? committedControlledValueRef.current
      : uncontrolledState.value;

  useIsomorphicLayoutEffect(() => {
    if (isControlled) {
      committedControlledValueRef.current = controlledValue;
      wasControlledRef.current = true;
      return;
    }

    if (wasControlledRef.current) {
      pendingHandoffRef.current ??= {
        value: committedControlledValueRef.current,
        updates: [],
      };
      wasControlledRef.current = false;
    }
  }, [controlledValue, isControlled]);

  useEffect(() => {
    const pendingHandoff = pendingHandoffRef.current;
    if (pendingHandoff === null) return;

    pendingHandoffRef.current = null;
    const handoffValue = pendingHandoff.updates.reduce<T>(
      (currentValue, update) =>
        typeof update === 'function' ? (update as (previousValue: T) => T)(currentValue) : update,
      pendingHandoff.value,
    );
    // Use a fresh container so the release render is committed even when a
    // release-layout update resolves to the pre-control uncontrolled value.
    setUncontrolledState({ value: handoffValue });
  }, [isControlled]);

  const setValue = useCallback<Dispatch<SetStateAction<T>>>(
    (nextValue) => {
      if (isControlled) return;

      let pendingHandoff = pendingHandoffRef.current;
      if (pendingHandoff === null && wasControlledRef.current) {
        pendingHandoff = {
          value: committedControlledValueRef.current,
          updates: [],
        };
        pendingHandoffRef.current = pendingHandoff;
        wasControlledRef.current = false;
      }
      if (pendingHandoff !== null) {
        pendingHandoff.updates.push(nextValue);
        return;
      }

      setUncontrolledState((currentState) => {
        const resolvedValue =
          typeof nextValue === 'function'
            ? (nextValue as (previousValue: T) => T)(currentState.value)
            : nextValue;
        return Object.is(currentState.value, resolvedValue)
          ? currentState
          : { value: resolvedValue };
      });
    },
    [isControlled],
  );

  return { value, isControlled, setValue };
};
