'use client';

import { useCallback, useMemo } from 'react';
import { useControllableState } from '../hooks/state/useControllableState';
import { fallbackTimeParts, parseTimeValue } from './time';
import type { TimeParts } from './time.types';

interface TimeValueState {
  hasValue: boolean;
  parts: TimeParts;
}

/** Controlled and initial nullable time strings parsed into a stable time-state representation. */
export interface UseControllableTimeValueOptions {
  /** Current controlled time value. `undefined` selects uncontrolled mode. */
  value?: string | null;
  /** Initial time value used only in uncontrolled mode. */
  defaultValue?: string | null;
}

/** Time parts, presence state, and uncontrolled-only updates for a nullable time value. */
export interface UseControllableTimeValueReturn {
  /** Whether a valid time value is currently present. */
  hasValue: boolean;
  /** Parsed time parts, or the fallback parts when no valid value is present. */
  parts: TimeParts;
  /** Whether the caller currently owns the time value. */
  isControlled: boolean;
  /** Sets caller-supplied time parts while uncontrolled without additional normalization. */
  setParts: (parts: TimeParts) => void;
  /** Restores a nullable time value while uncontrolled. */
  resetValue: (value: string | null | undefined) => void;
}

const toTimeValueState = (value: string | null | undefined): TimeValueState => {
  const parts = parseTimeValue(value);

  return { hasValue: parts !== null, parts: parts ?? fallbackTimeParts };
};

/**
 * Owns time value state parsed from controlled or initial strings while preserving the latest
 * controlled value when ownership is released. `setParts` intentionally preserves caller-supplied
 * parts without validation; formatting, constraints, and change callbacks remain feature-specific
 * responsibilities of the caller.
 */
export const useControllableTimeValue = ({
  value,
  defaultValue,
}: UseControllableTimeValueOptions): UseControllableTimeValueReturn => {
  const controlledValue = useMemo(
    () => (value === undefined ? undefined : toTimeValueState(value)),
    [value],
  );
  const initialValue = useMemo(() => toTimeValueState(defaultValue), [defaultValue]);
  const {
    value: state,
    isControlled,
    setValue: setState,
  } = useControllableState({ value: controlledValue, defaultValue: initialValue });
  const setParts = useCallback(
    (parts: TimeParts) => {
      setState({ hasValue: true, parts });
    },
    [setState],
  );

  const resetValue = useCallback(
    (nextValue: string | null | undefined) => {
      setState(toTimeValueState(nextValue));
    },
    [setState],
  );

  return { hasValue: state.hasValue, parts: state.parts, isControlled, resetValue, setParts };
};
