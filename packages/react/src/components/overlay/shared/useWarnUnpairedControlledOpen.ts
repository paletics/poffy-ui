'use client';

import { useEffect } from 'react';

interface RuntimeEnv {
  process?: { env?: Record<string, string | undefined> };
}

/** Warns untyped consumers when `open` cannot form a controlled state pair. */
export const useWarnUnpairedControlledOpen = (
  componentName: string,
  open: boolean | undefined,
  hasControlledHandler: boolean,
) => {
  useEffect(() => {
    if (open === undefined || hasControlledHandler) return;
    if ((globalThis as RuntimeEnv).process?.env?.['NODE_ENV'] === 'production') return;

    console.warn(
      `[${componentName}] \`open\` without \`onOpenChange\` falls back to uncontrolled initial state.`,
    );
  }, [componentName, hasControlledHandler, open]);
};
