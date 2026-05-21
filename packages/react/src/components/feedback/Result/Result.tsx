'use client';

import { cx } from '@/styled-system/css';
import { result } from '@/styled-system/recipes';
import { forwardRef } from 'react';
import { ResultContext } from './ResultContext';
import { ResultProps } from './Result.types';

/**
 * A page-level outcome display for completed operations, supporting status-driven layouts.
 * ### AI Context & Architecture
 * - Tier: Organisms, Stack: Panda CSS (Recipe: result), ResultContext
 * ### Design Tokens
 * - spacing/typography: silver-ratio tokens
 * ### Variant Logic
 * - status: info/success/warning/error drives icon color and semantic tone.
 * ### Notes
 * Compose with ResultIcon, ResultTitle, ResultDescription, ResultActions. Uses `role="status"` + `aria-live="polite"`.
 * ### Accessibility
 * - `role="status"` ensures screen readers announce the result on mount. Use `aria-live="assertive"` for critical errors.
 * ### AI Usage
 * - Use after completing a multi-step flow or a form submission to show outcome to the user.
 *
 * @example Success result
 * ```tsx
 * import { Result, ResultTitle, ResultDescription, ResultActions } from '@poffy-ui/react/feedback';
 * import { Button } from '@poffy-ui/react/inputs';
 *
 * <Result status="success">
 *   <ResultTitle>Project created</ResultTitle>
 *   <ResultDescription>The workspace is ready for your team.</ResultDescription>
 *   <ResultActions>
 *     <Button>Open project</Button>
 *   </ResultActions>
 * </Result>
 * ```
 *
 * @example Error result
 * ```tsx
 * import { Result, ResultTitle, ResultDescription } from '@poffy-ui/react/feedback';
 *
 * <Result status="error" aria-live="assertive">
 *   <ResultTitle>Could not publish</ResultTitle>
 *   <ResultDescription>Check the required fields and try again.</ResultDescription>
 * </Result>
 * ```
 */
export const Result = forwardRef<HTMLDivElement, ResultProps>((props, ref) => {
  const { children, className, intent = 'info', appearance = 'soft', status, ...rest } = props;
  const resolvedStatus = status ?? (intent === 'danger' ? 'error' : intent);
  const classes = result({ status: resolvedStatus, appearance });

  return (
    <ResultContext.Provider value={{ status: resolvedStatus }}>
      <div
        ref={ref}
        className={cx(classes.root, className)}
        role="status"
        aria-live="polite"
        {...rest}
      >
        {children}
      </div>
    </ResultContext.Provider>
  );
});

Result.displayName = 'Result';
