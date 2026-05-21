'use client';

import { cx } from '@/styled-system/css';
import { result } from '@/styled-system/recipes';
import { forwardRef } from 'react';
import { useResultContext } from './ResultContext';
import { ResultIconProps } from './Result.types';

/**
 * ResultIcon - Icon container for Result component
 *
 * @example
 * ```tsx
 * import { Result, ResultIcon, ResultTitle } from '@poffy-ui/react/feedback';
 * import { SuccessIcon } from '@poffy-ui/react/media';
 *
 * <Result intent="success">
 *   <ResultIcon><SuccessIcon /></ResultIcon>
 *   <ResultTitle>Success!</ResultTitle>
 * </Result>
 * ```
 */
export const ResultIcon = forwardRef<HTMLDivElement, ResultIconProps>(
  ({ className, children, ...rest }, ref) => {
    const { status } = useResultContext();
    const classes = result({ status });

    return (
      <div ref={ref} className={cx(classes.icon, className)} aria-hidden="true" {...rest}>
        {children}
      </div>
    );
  },
);

ResultIcon.displayName = 'ResultIcon';
