'use client';

import { useEffect, useRef } from 'react';

interface InvalidControllableStateOptions {
  componentName: string;
  defaultValue: unknown;
  handler: unknown;
  value: unknown;
}

/**
 * Reports malformed untyped controlled-state pairs without changing ownership.
 */
export const useWarnInvalidControllableState = ({
  componentName,
  defaultValue,
  handler,
  value,
}: InvalidControllableStateOptions) => {
  const warnedRef = useRef(new Set<string>());
  const defaultValueProvided = defaultValue !== undefined;
  const handlerProvided = handler !== undefined;
  const hasCallableHandler = typeof handler === 'function';
  const hasValue = value !== undefined;

  useEffect(() => {
    const warnings: Array<[string, string]> = [];
    if (hasValue && !hasCallableHandler) {
      warnings.push([
        'missing-handler',
        `controlled state requires a callable change handler; the supplied value remains read-only.`,
      ]);
    }
    if (handlerProvided && !hasCallableHandler) {
      warnings.push([
        'invalid-handler',
        `the supplied change handler is not callable and was ignored.`,
      ]);
    }
    if (hasValue && defaultValueProvided) {
      warnings.push([
        'value-and-default',
        `received both a controlled value and a default value; the default value was ignored.`,
      ]);
    }

    warnings.forEach(([key, message]) => {
      if (warnedRef.current.has(key)) return;
      warnedRef.current.add(key);
      console.warn(`[${componentName}] ${message}`);
    });
  }, [componentName, defaultValueProvided, handlerProvided, hasCallableHandler, hasValue]);
};
