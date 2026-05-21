'use client';

import { useCallback, useState } from 'react';
import type {
  UseRadioGroupStateOptions,
  UseRadioGroupStateReturn,
} from './useRadioGroupState.types';

/**
 * Shared controlled/uncontrolled state for radio groups.
 *
 * ### Notes
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
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleChange = useCallback(
    (nextValue: string) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }
      onChange?.(nextValue);
    },
    [isControlled, onChange],
  );

  return {
    value,
    onChange: handleChange,
  };
};
