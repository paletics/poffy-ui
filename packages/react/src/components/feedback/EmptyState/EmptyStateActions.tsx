'use client';

import { cx } from '@/styled-system/css';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import { useEmptyStateClasses } from './EmptyStateContext';
import type { EmptyStateActionsProps } from './EmptyState.types';

/**
 * Action container for EmptyState follow-up controls.
 */
export const EmptyStateActions = forwardRef<HTMLDivElement, EmptyStateActionsProps>(
  (props, ref) => {
    const { asChild, children, className, ...rest } = props;
    const Component = asChild ? Slot : 'div';
    const classes = useEmptyStateClasses();

    return (
      <Component ref={ref} className={cx(classes.actions, className)} {...rest}>
        {children}
      </Component>
    );
  },
);

EmptyStateActions.displayName = 'EmptyStateActions';
