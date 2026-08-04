'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useControllableState } from '../hooks/state';
import {
  applyOtpBackspace,
  applyOtpInputChange,
  applyOtpPasteAtIndex,
  normalizeOtpDigits,
  normalizeOtpSegments,
  resizeOtpSegments,
  toOtpSegments,
} from './otp-input';
import type { OtpInputChangeResult } from './otp-input.types';
import type {
  OtpInputKeyboardInput,
  OtpInputKeyboardResult,
  UseOtpInputStateOptions,
  UseOtpInputStateReturn,
} from './useOtpInputState.types';

interface OtpState {
  length: number;
  segments: string[];
}

/**
 * Coordinates controlled or uncontrolled fixed-position OTP segments, input normalization,
 * composition, paste, focus movement, and completion notification. Disabled and read-only modes
 * suppress value changes.
 *
 * `length` is normalized to an integer from 1 through 32. IME input is buffered between the
 * composition actions and committed only when composition ends. `onComplete` runs when an edit
 * transitions from incomplete to complete, not again for an already-complete value. `reset`
 * restores the latest default only when uncontrolled and does not emit change callbacks.
 */
export const useOtpInputState = ({
  defaultValue,
  disabled = false,
  isRtl = false,
  length,
  onChange,
  onComplete,
  readOnly = false,
  value,
}: UseOtpInputStateOptions): UseOtpInputStateReturn => {
  const resolvedLength = toOtpSegments('', length).length;
  const normalizedControlledValue = useMemo(
    () => (value === undefined ? undefined : normalizeOtpSegments(value, resolvedLength)),
    [resolvedLength, value],
  );
  const normalizedDefaultValue = useMemo(
    () => normalizeOtpSegments(defaultValue ?? [], resolvedLength),
    [defaultValue, resolvedLength],
  );
  const controlledState = useMemo<OtpState | undefined>(
    () =>
      normalizedControlledValue === undefined
        ? undefined
        : { length: resolvedLength, segments: normalizedControlledValue },
    [normalizedControlledValue, resolvedLength],
  );
  const [defaultState] = useState<OtpState>(() => ({
    length: resolvedLength,
    segments: normalizedDefaultValue,
  }));
  const {
    value: otpState,
    isControlled,
    setValue: setOtpState,
  } = useControllableState({ value: controlledState, defaultValue: defaultState });
  const segments = useMemo(
    () =>
      otpState.length === resolvedLength
        ? otpState.segments
        : resizeOtpSegments(otpState.segments, resolvedLength),
    [otpState, resolvedLength],
  );
  const segmentSignature = segments.join('\u0000');
  const lastObservedSignatureRef = useRef(segmentSignature);
  const lastEmittedCompleteRef = useRef<string | undefined>(
    segments.every(Boolean) ? segments.join('') : undefined,
  );
  const defaultValueRef = useRef([...normalizedDefaultValue]);
  const compositionRef = useRef({ active: false, value: '' });

  useEffect(() => {
    if (lastObservedSignatureRef.current === segmentSignature) return;
    lastObservedSignatureRef.current = segmentSignature;
    lastEmittedCompleteRef.current = segments.every(Boolean) ? segments.join('') : undefined;
  }, [segmentSignature, segments]);

  useLayoutEffect(() => {
    defaultValueRef.current = [...normalizedDefaultValue];
  }, [normalizedDefaultValue]);

  useLayoutEffect(() => {
    if (otpState.length !== resolvedLength) {
      setOtpState({ length: resolvedLength, segments });
    }
  }, [otpState.length, resolvedLength, segments, setOtpState]);

  const commit = useCallback(
    (result: OtpInputChangeResult) => {
      if (segments.every((segment, index) => segment === result.otp[index])) {
        return result.nextFocusIndex;
      }
      setOtpState({ length: resolvedLength, segments: result.otp });
      onChange?.([...result.otp]);
      const wasComplete = segments.every(Boolean);
      if (!result.isComplete) {
        lastEmittedCompleteRef.current = undefined;
      } else if (!wasComplete && lastEmittedCompleteRef.current !== result.value) {
        lastEmittedCompleteRef.current = result.value;
        onComplete?.(result.value);
      }
      return result.nextFocusIndex;
    },
    [onChange, onComplete, resolvedLength, segments, setOtpState],
  );

  const applyInput = useCallback(
    (rawValue: string, index: number) => {
      if (disabled || readOnly) return null;
      if (compositionRef.current.active) {
        compositionRef.current.value = rawValue;
        return null;
      }
      const normalizedValue = normalizeOtpDigits(rawValue);
      if (rawValue.length > 0 && !normalizedValue) {
        setOtpState({ length: resolvedLength, segments: [...segments] });
        return null;
      }
      return commit(
        normalizedValue.length > 1
          ? applyOtpPasteAtIndex(segments, index, normalizedValue)
          : applyOtpInputChange(segments, index, normalizedValue),
      );
    },
    [commit, disabled, readOnly, resolvedLength, segments, setOtpState],
  );

  const applyPaste = useCallback(
    (text: string, index: number) => {
      if (disabled || readOnly) return null;
      const result = applyOtpPasteAtIndex(segments, index, text);
      return result.nextFocusIndex === null ? null : commit(result);
    },
    [commit, disabled, readOnly, segments],
  );

  const handleKeyDown = useCallback(
    ({ index, isComposing, key, keyCode }: OtpInputKeyboardInput): OtpInputKeyboardResult => {
      if (disabled || isComposing || keyCode === 229) {
        return { handled: false, nextFocusIndex: null };
      }
      if (key === 'ArrowLeft') {
        const nextIndex = index + (isRtl ? 1 : -1);
        return {
          handled: true,
          nextFocusIndex: nextIndex >= 0 && nextIndex < resolvedLength ? nextIndex : null,
        };
      }
      if (key === 'ArrowRight') {
        const nextIndex = index + (isRtl ? -1 : 1);
        return {
          handled: true,
          nextFocusIndex: nextIndex >= 0 && nextIndex < resolvedLength ? nextIndex : null,
        };
      }
      if (key === 'Backspace' && !readOnly) {
        return {
          handled: true,
          nextFocusIndex: commit(applyOtpBackspace(segments, index)),
        };
      }
      return { handled: false, nextFocusIndex: null };
    },
    [commit, disabled, isRtl, readOnly, resolvedLength, segments],
  );

  return {
    applyInput,
    applyPaste,
    beginComposition: () => {
      compositionRef.current = { active: true, value: '' };
    },
    endComposition: (fallbackValue, index) => {
      const rawValue =
        compositionRef.current.value.length > 0 ? compositionRef.current.value : fallbackValue;
      compositionRef.current = { active: false, value: '' };
      return applyInput(rawValue, index);
    },
    handleKeyDown,
    isControlled,
    joinedValue: segments.join(''),
    reset: () => {
      if (isControlled) return;
      setOtpState({
        length: resolvedLength,
        segments: normalizeOtpSegments(defaultValueRef.current, resolvedLength),
      });
    },
    resolvedLength,
    segments,
  };
};
