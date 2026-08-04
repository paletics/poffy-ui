'use client';

import { cx } from '@/styled-system/css';
import { result } from '@/styled-system/recipes';
import { resolveLiveRegionProps } from '@/components/shared/resolveLiveRegionProps';
import { forwardRef, useMemo } from 'react';
import { ResultContext } from '@/components/feedback/Result/ResultContext';
import type { ResultProps } from '@/components/feedback/Result/Result.types';

/**
 * Presents a stable task outcome with composable icon, title, description, and actions. It does not
 * announce by default; use `live="polite"` for routine updates or `live="assertive"` for critical
 * errors.
 */
export const Result = forwardRef<HTMLDivElement, ResultProps>((props, ref) => {
  const {
    children,
    className,
    intent = 'info',
    appearance = 'soft',
    live,
    role,
    'aria-live': ariaLive,
    ...rest
  } = props;
  const { status: _unsupportedStatus, ...safeRest } = rest as typeof rest & {
    status?: unknown;
  };
  const resolvedStatus: 'success' | 'error' | 'warning' | 'info' =
    intent === 'danger' ? 'error' : intent;
  const classes = result({ status: resolvedStatus, appearance });
  const { role: resolvedRole, ariaLive: resolvedAriaLive } = resolveLiveRegionProps({
    live,
    defaultLive: 'off',
    role,
    ariaLive,
  });

  const contextValue = useMemo(
    () => ({ status: resolvedStatus, classes }),
    [classes, resolvedStatus],
  );

  return (
    <ResultContext.Provider value={contextValue}>
      <div
        ref={ref}
        className={cx(classes.root, className)}
        role={resolvedRole}
        aria-live={resolvedAriaLive}
        {...safeRest}
      >
        {children}
      </div>
    </ResultContext.Provider>
  );
});

Result.displayName = 'Result';
