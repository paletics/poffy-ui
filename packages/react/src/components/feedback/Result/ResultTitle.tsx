'use client';

import { cx } from '@/styled-system/css';
import { result } from '@/styled-system/recipes';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import { useResultContext } from './ResultContext';
import { ResultTitleProps } from './Result.types';

/**
 * ResultTitle - Title component for Result
 *
 * @example
 * ```tsx
 * import { Result, ResultDescription, ResultTitle } from '@poffy-ui/react/feedback';
 *
 * <Result intent="success">
 *   <ResultTitle>Operation Successful</ResultTitle>
 *   <ResultDescription>Your changes have been saved.</ResultDescription>
 * </Result>
 *
 * // Custom heading level via asChild
 * <ResultTitle asChild><h2>Custom Heading</h2></ResultTitle>
 * ```
 */
export const ResultTitle = forwardRef<HTMLHeadingElement, ResultTitleProps>(
  ({ asChild, className, children, ...rest }, ref) => {
    const Component = asChild ? Slot : 'h3';
    const { status } = useResultContext();
    const classes = result({ status });

    return (
      <Component ref={ref} className={cx(classes.title, className)} {...rest}>
        {children}
      </Component>
    );
  },
);

ResultTitle.displayName = 'ResultTitle';
