'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useControllableState } from '../hooks/state';
import {
  clampRangeSliderThumb,
  getNextRangeSliderValue,
  normalizeRangeSliderValue,
} from './range-slider';
import type { RangeSliderOptions, RangeSliderThumb, RangeSliderValue } from './range-slider.types';
import type {
  UseRangeSliderStateOptions,
  UseRangeSliderStateReturn,
} from './useRangeSliderState.types';

/**
 * Owns a normalized two-thumb range value and separates continuous changes from interaction
 * commits.
 *
 * Every move is normalized to the configured bounds, step, and thumb gap. Accepted moves request
 * `onValueChange` even when the value is controlled; a matching later `commitInteraction` requests
 * `onValueCommit` once. Host-blocked interactions are ignored and discard pending commits.
 * `reset` discards a pending interaction and changes only uncontrolled state without callbacks.
 */
export const useRangeSliderState = ({
  defaultValue,
  interactionBlocked = false,
  isInteractionBlockedNow,
  onValueChange,
  onValueCommit,
  value: controlledValue,
  ...optionValues
}: UseRangeSliderStateOptions): UseRangeSliderStateReturn => {
  const options = useMemo<RangeSliderOptions>(
    () => ({
      max: optionValues.max,
      min: optionValues.min,
      minStepsBetweenThumbs: optionValues.minStepsBetweenThumbs,
      pageStep: optionValues.pageStep,
      step: optionValues.step,
    }),
    [
      optionValues.max,
      optionValues.min,
      optionValues.minStepsBetweenThumbs,
      optionValues.pageStep,
      optionValues.step,
    ],
  );
  const fallbackValue = normalizeRangeSliderValue(
    defaultValue ?? [options.min ?? 0, options.max ?? 100],
    options,
  );
  const normalizedControlledValue =
    controlledValue === undefined ? undefined : normalizeRangeSliderValue(controlledValue, options);
  const {
    isControlled,
    setValue,
    value: stateValue,
  } = useControllableState({
    value: normalizedControlledValue,
    defaultValue: fallbackValue,
  });
  const value = normalizeRangeSliderValue(stateValue, options);
  const latestRef = useRef({ defaultValue, options });
  const interactionRef = useRef<{ thumb: RangeSliderThumb; value: RangeSliderValue } | null>(null);
  useLayoutEffect(() => {
    latestRef.current = { defaultValue, options };
  }, [defaultValue, options]);
  useEffect(() => {
    if (interactionBlocked) interactionRef.current = null;
  }, [interactionBlocked]);

  const isBlockedNow = useCallback(
    () => (interactionBlocked ? true : isInteractionBlockedNow?.() === true),
    [interactionBlocked, isInteractionBlockedNow],
  );
  const setNextValue = useCallback(
    (nextValue: RangeSliderValue, thumb: RangeSliderThumb) => {
      if (isBlockedNow()) return;
      const normalized = normalizeRangeSliderValue(nextValue, options);
      if (normalized[0] === value[0] && normalized[1] === value[1]) return;
      setValue(normalized);
      onValueChange?.(normalized, thumb);
      interactionRef.current = { value: normalized, thumb };
    },
    [isBlockedNow, onValueChange, options, setValue, value],
  );
  const moveThumb = useCallback(
    (thumb: RangeSliderThumb, nextValue: number) => {
      setNextValue(clampRangeSliderThumb(nextValue, thumb, value, options), thumb);
    },
    [options, setNextValue, value],
  );
  const applyKeyboardAction = useCallback(
    (thumb: RangeSliderThumb, action: Parameters<typeof getNextRangeSliderValue>[0]['action']) => {
      setNextValue(getNextRangeSliderValue({ value, thumb, action, ...options }), thumb);
    },
    [options, setNextValue, value],
  );
  const cancelInteraction = useCallback(() => {
    interactionRef.current = null;
  }, []);
  const commitInteraction = useCallback(
    (thumb: RangeSliderThumb) => {
      const interaction = interactionRef.current;
      if (interaction?.thumb !== thumb) return;
      interactionRef.current = null;
      if (isBlockedNow()) return;
      onValueCommit?.(normalizeRangeSliderValue(interaction.value, options), thumb);
    },
    [isBlockedNow, onValueCommit, options],
  );
  const reset = useCallback(() => {
    interactionRef.current = null;
    if (isControlled) return;
    const latest = latestRef.current;
    setValue(
      normalizeRangeSliderValue(
        latest.defaultValue ?? [latest.options.min ?? 0, latest.options.max ?? 100],
        latest.options,
      ),
    );
  }, [isControlled, setValue]);

  return {
    applyKeyboardAction,
    cancelInteraction,
    commitInteraction,
    isControlled,
    moveThumb,
    reset,
    value,
  };
};
