'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { UseAccordionStateProps, UseAccordionStateReturn } from './useAccordionState.types';

/**
 * Shared controlled/uncontrolled accordion state management.
 *
 * ### Notes
 * This hook owns only the open-value set. React accordion components should wrap
 * it with trigger/content rendering, `aria-expanded`, `aria-controls`, heading
 * structure, and roving focus or keyboard bindings required by the chosen APG
 * accordion pattern. In controlled mode, pass `value` and update it from
 * `onChange`; in uncontrolled mode, omit `value` and optionally seed
 * `defaultValue`.
 */
export const useAccordionState = ({
  multiple = false,
  value: valueProp,
  defaultValue,
  onChange,
}: UseAccordionStateProps): UseAccordionStateReturn => {
  const [internalValue, setInternalValue] = useState<string[]>(() => {
    if (!defaultValue) return [];
    return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
  });

  const isControlled = valueProp !== undefined;
  const currentValue = useMemo(
    () => (isControlled ? (Array.isArray(valueProp) ? valueProp : [valueProp]) : internalValue),
    [internalValue, isControlled, valueProp],
  );

  const currentValueRef = useRef(currentValue);
  useEffect(() => {
    currentValueRef.current = currentValue;
  });

  const toggle = useCallback(
    (val: string) => {
      const curr = currentValueRef.current;
      const newValue = multiple
        ? curr.includes(val)
          ? curr.filter((v) => v !== val)
          : [...curr, val]
        : curr.includes(val)
          ? []
          : [val];

      if (!isControlled) {
        setInternalValue(newValue);
      }

      onChange?.(multiple ? newValue : (newValue[0] ?? ''));
    },
    [isControlled, multiple, onChange],
  );

  return {
    currentValue,
    toggle,
  };
};
