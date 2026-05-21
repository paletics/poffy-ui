'use client';

import { cx } from '@/styled-system/css';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import { useEmptyStateClasses } from './EmptyStateContext';
import type { EmptyStateTitleProps } from './EmptyState.types';

/**
 * Heading text for EmptyState.
 */
export const EmptyStateTitle = forwardRef<HTMLHeadingElement, EmptyStateTitleProps>(
  (props, ref) => {
    const { asChild, children, className, ...rest } = props;
    const Component = asChild ? Slot : 'h3';
    const classes = useEmptyStateClasses();

    return (
      <Component ref={ref} className={cx(classes.title, className)} {...rest}>
        {children}
      </Component>
    );
  },
);

EmptyStateTitle.displayName = 'EmptyStateTitle';
