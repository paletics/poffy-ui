'use client';

import { cx } from '@/styled-system/css';
import { result } from '@/styled-system/recipes';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import { useResultContext } from './ResultContext';
import { ResultActionsProps } from './Result.types';

/**
 * ResultActions - Action buttons container for Result
 *
 * @example
 * ```tsx
 * import { Result, ResultActions, ResultTitle } from '@poffy-ui/react/feedback';
 *
 * <Result intent="success">
 *   <ResultTitle>Success!</ResultTitle>
 *   <ResultActions>
 *     <button type="button">Continue</button>
 *     <button type="button">Cancel</button>
 *   </ResultActions>
 * </Result>
 * ```
 */
export const ResultActions = forwardRef<HTMLDivElement, ResultActionsProps>(
  ({ asChild, className, children, ...rest }, ref) => {
    const Component = asChild ? Slot : 'div';
    const { status } = useResultContext();
    const classes = result({ status });

    return (
      <Component ref={ref} className={cx(classes.actions, className)} {...rest}>
        {children}
      </Component>
    );
  },
);

ResultActions.displayName = 'ResultActions';
