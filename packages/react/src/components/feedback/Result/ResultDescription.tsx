'use client';

import { cx } from '@/styled-system/css';
import { result } from '@/styled-system/recipes';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import { useResultContext } from './ResultContext';
import { ResultDescriptionProps } from './Result.types';

/**
 * ResultDescription - Description text for Result
 *
 * @example
 * ```tsx
 * import { Result, ResultDescription, ResultTitle } from '@poffy-ui/react/feedback';
 *
 * <Result intent="success">
 *   <ResultTitle>Success</ResultTitle>
 *   <ResultDescription>
 *     Your changes have been saved successfully.
 *   </ResultDescription>
 * </Result>
 * ```
 */
export const ResultDescription = forwardRef<HTMLParagraphElement, ResultDescriptionProps>(
  ({ asChild, className, children, ...rest }, ref) => {
    const Component = asChild ? Slot : 'p';
    const { status } = useResultContext();
    const classes = result({ status });

    return (
      <Component ref={ref} className={cx(classes.description, className)} {...rest}>
        {children}
      </Component>
    );
  },
);

ResultDescription.displayName = 'ResultDescription';
