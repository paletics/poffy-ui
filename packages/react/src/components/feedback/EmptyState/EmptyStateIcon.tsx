'use client';

import { cx } from '@/styled-system/css';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import { useEmptyStateClasses } from './EmptyStateContext';
import type { EmptyStateIconProps } from './EmptyState.types';

/**
 * Icon container for EmptyState.
 */
export const EmptyStateIcon = forwardRef<HTMLDivElement, EmptyStateIconProps>((props, ref) => {
  const { asChild, className, children, ...rest } = props;
  const Component = asChild ? Slot : 'div';
  const classes = useEmptyStateClasses();

  return (
    <Component ref={ref} className={cx(classes.icon, className)} {...rest}>
      {children}
    </Component>
  );
});

EmptyStateIcon.displayName = 'EmptyStateIcon';
