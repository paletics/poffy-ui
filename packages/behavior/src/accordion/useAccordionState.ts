'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useControllableState } from '../hooks/state';
import type { UseAccordionStateProps, UseAccordionStateReturn } from './useAccordionState.types';

const normalizeAccordionValue = (
  value: string | string[] | null | undefined,
  multiple: boolean,
): string[] => {
  if (value === undefined || value === null) return [];
  const values = Array.isArray(value) ? [...value] : [value];
  return multiple ? values : values.slice(0, 1);
};

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

interface RuntimeEnv {
  process?: { env?: Record<string, string | undefined> };
}

/**
 * Shared controlled/uncontrolled accordion state management.
 *
 * This hook owns only the open-value set. React accordion components should wrap
 * it with trigger/content rendering, `aria-expanded`, `aria-controls`, heading
 * structure, and roving focus or keyboard bindings required by the chosen APG
 * accordion pattern. In controlled mode, pass `value` and update it from
 * `onChange`; in uncontrolled mode, omit `value` and optionally seed
 * `defaultValue`. `currentValue` is always an array; single mode keeps only
 * the first supplied value and emits a string or `null`, while multiple mode
 * emits the complete next array.
 */
export const useAccordionState = ({
  multiple = false,
  value: valueProp,
  defaultValue,
  onChange,
}: UseAccordionStateProps): UseAccordionStateReturn => {
  const resolvedOnChange = typeof onChange === 'function' ? onChange : undefined;
  const hasValue = valueProp !== undefined;
  const hasControlledPair = hasValue && resolvedOnChange !== undefined;
  const controlledValue = useMemo(
    () => (hasControlledPair ? normalizeAccordionValue(valueProp, multiple === true) : undefined),
    [hasControlledPair, multiple, valueProp],
  );
  const normalizedDefaultValue = useMemo(
    () =>
      normalizeAccordionValue(
        !hasControlledPair && hasValue ? valueProp : defaultValue,
        multiple === true,
      ),
    [defaultValue, hasControlledPair, hasValue, multiple, valueProp],
  );
  const { value, isControlled, setValue } = useControllableState({
    value: controlledValue,
    defaultValue: normalizedDefaultValue,
  });

  const currentValue = useMemo(
    () => normalizeAccordionValue(value, multiple === true),
    [multiple, value],
  );

  const currentValueRef = useRef(currentValue);

  useEffect(() => {
    if (!hasValue || hasControlledPair) return;
    if ((globalThis as RuntimeEnv).process?.env?.['NODE_ENV'] === 'production') return;
    console.warn(
      '[useAccordionState] `value` without a function `onChange` falls back to uncontrolled initial state.',
    );
  }, [hasControlledPair, hasValue]);

  useIsomorphicLayoutEffect(() => {
    currentValueRef.current = currentValue;
    if (!isControlled && value.length !== currentValue.length) {
      setValue([...currentValue]);
    }
  }, [currentValue, isControlled, setValue, value.length]);

  const toggle = useCallback(
    (val: string) => {
      const curr = currentValueRef.current;
      const newValue =
        multiple === true
          ? curr.includes(val)
            ? curr.filter((v) => v !== val)
            : [...curr, val]
          : curr.includes(val)
            ? []
            : [val];

      if (!isControlled) {
        setValue(newValue);
        currentValueRef.current = newValue;
      }

      if (multiple === true) {
        (resolvedOnChange as ((nextValue: string[]) => void) | undefined)?.([...newValue]);
      } else {
        (resolvedOnChange as ((nextValue: string | null) => void) | undefined)?.(
          newValue[0] ?? null,
        );
      }
    },
    [isControlled, multiple, resolvedOnChange, setValue],
  );

  return {
    currentValue,
    toggle,
  };
};
