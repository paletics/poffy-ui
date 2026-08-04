'use client';

import { useCallback } from 'react';
import { useControllableState } from '../hooks/state';
import type {
  UseRadioGroupStateOptions,
  UseRadioGroupStateReturn,
} from './useRadioGroupState.types';

/**
 * Shared controlled/uncontrolled state for radio groups.
 *
 * This hook owns only the selected string value. React radio components should
 * provide the fieldset/radiogroup semantics, native radio inputs or equivalent
 * ARIA, shared `name`, disabled/read-only handling, and arrow-key movement.
 * In controlled mode, pass `value` and update it from `onChange`; otherwise
 * `defaultValue` is used once for initial state.
 */
export const useRadioGroupState = ({
  value: controlledValue,
  defaultValue,
  onChange,
}: UseRadioGroupStateOptions): UseRadioGroupStateReturn => {
  const {
    value,
    isControlled,
    setValue: setInternalValue,
  } = useControllableState({
    value: controlledValue,
    defaultValue: defaultValue ?? '',
  });

  const handleChange = useCallback(
    (nextValue: string) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }
      onChange?.(nextValue);
    },
    [isControlled, onChange, setInternalValue],
  );

  return {
    value,
    onChange: handleChange,
    setValue: setInternalValue,
  };
};
