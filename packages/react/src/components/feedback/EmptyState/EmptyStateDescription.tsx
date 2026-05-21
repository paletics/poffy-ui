'use client';

import { cx } from '@/styled-system/css';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import { useEmptyStateClasses } from './EmptyStateContext';
import type { EmptyStateDescriptionProps } from './EmptyState.types';

/**
 * Description text for EmptyState.
 */
export const EmptyStateDescription = forwardRef<HTMLParagraphElement, EmptyStateDescriptionProps>(
  (props, ref) => {
    const { asChild, children, className, ...rest } = props;
    const Component = asChild ? Slot : 'p';
    const classes = useEmptyStateClasses();

    return (
      <Component ref={ref} className={cx(classes.description, className)} {...rest}>
        {children}
      </Component>
    );
  },
);

EmptyStateDescription.displayName = 'EmptyStateDescription';
