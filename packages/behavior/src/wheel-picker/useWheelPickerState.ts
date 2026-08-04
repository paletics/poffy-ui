'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { useControllableState } from '../hooks/state';
import { getNextWheelPickerOption, normalizeWheelPickerValue } from './wheel-picker';
import type {
  UseWheelPickerStateOptions,
  UseWheelPickerStateReturn,
  WheelPickerKeyboardInput,
} from './useWheelPickerState.types';

const valuesEqual = (first: Record<string, string>, second: Record<string, string>) => {
  const secondEntries = Object.entries(second);
  return (
    Object.keys(first).length === secondEntries.length &&
    secondEntries.every(([key, value]) => first[key] === value)
  );
};

/** Maps unhandled wheel-picker navigation keys to movement or edge actions. */
export const getWheelPickerKeyboardAction = ({
  defaultPrevented,
  key,
}: WheelPickerKeyboardInput):
  | { type: 'edge'; edge: 'first' | 'last' }
  | { type: 'move'; direction: 1 | -1 }
  | undefined => {
  if (defaultPrevented) return undefined;
  if (key === 'ArrowDown') return { type: 'move', direction: 1 };
  if (key === 'ArrowUp') return { type: 'move', direction: -1 };
  if (key === 'Home') return { type: 'edge', edge: 'first' };
  return key === 'End' ? { type: 'edge', edge: 'last' } : undefined;
};

/**
 * Owns controlled or uncontrolled selections across wheel-picker columns and normalizes each
 * selection to an enabled option.
 *
 * Normalization never emits `onChange`; uncontrolled state is reconciled after a column changes.
 * `commitValue` ignores disabled, read-only, host-disabled, and unchanged interactions, while
 * controlled callers receive the requested next map through `onChange` and must reflect it.
 * `handleKeyDown` returns `true` for a recognized, unprevented navigation key even when its
 * resulting mutation is ignored, so the caller can consistently prevent browser scrolling.
 */
export const useWheelPickerState = ({
  columns,
  defaultValue,
  disabled = false,
  isInteractionDisabled,
  loop = true,
  onChange,
  readOnly = false,
  value,
}: UseWheelPickerStateOptions): UseWheelPickerStateReturn => {
  const normalizedControlledValue =
    value === undefined ? undefined : normalizeWheelPickerValue(columns, value);
  const {
    value: stateValue,
    isControlled,
    setValue,
  } = useControllableState({
    value: normalizedControlledValue,
    defaultValue: normalizeWheelPickerValue(columns, defaultValue),
  });
  const selectedValue = useMemo(
    () => normalizeWheelPickerValue(columns, stateValue),
    [columns, stateValue],
  );

  useEffect(() => {
    if (!isControlled && !valuesEqual(stateValue, selectedValue)) setValue(selectedValue);
  }, [isControlled, selectedValue, setValue, stateValue]);

  const commitValue = useCallback(
    (columnId: string, nextOptionValue: string) => {
      if (disabled || isInteractionDisabled?.() || readOnly) return;
      if (nextOptionValue === selectedValue[columnId]) return;

      const nextValue = Object.fromEntries(
        new Map([...Object.entries(selectedValue), [columnId, nextOptionValue]]),
      );
      if (!isControlled) setValue(nextValue);
      onChange?.(nextValue, columnId);
    },
    [disabled, isControlled, isInteractionDisabled, onChange, readOnly, selectedValue, setValue],
  );

  const moveColumn = useCallback(
    (columnId: string, direction: 1 | -1) => {
      const column = columns.find((item) => item.id === columnId);
      const option = column
        ? getNextWheelPickerOption(column.options, selectedValue[column.id], direction, { loop })
        : undefined;
      if (column && option) commitValue(column.id, option.value);
    },
    [columns, commitValue, loop, selectedValue],
  );

  const handleKeyDown = useCallback(
    (input: WheelPickerKeyboardInput, columnId: string) => {
      if (isInteractionDisabled?.()) return false;
      const action = getWheelPickerKeyboardAction(input);
      if (!action) return false;
      if (action.type === 'move') {
        moveColumn(columnId, action.direction);
        return true;
      }

      const column = columns.find((item) => item.id === columnId);
      const options = column?.options.filter((option) => !option.disabled);
      const option = action.edge === 'first' ? options?.[0] : options?.at(-1);
      if (column && option) commitValue(column.id, option.value);
      return true;
    },
    [columns, commitValue, isInteractionDisabled, moveColumn],
  );

  return {
    commitValue,
    handleKeyDown,
    isControlled,
    resetValue: (nextValue) => {
      if (!isControlled) setValue(nextValue);
    },
    selectedValue,
  };
};
