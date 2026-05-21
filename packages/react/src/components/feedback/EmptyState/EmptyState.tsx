'use client';

import { cx } from '@/styled-system/css';
import { emptyState } from '@/styled-system/recipes';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import { EmptyStateContext } from './EmptyStateContext';
import type { EmptyStateProps } from './EmptyState.types';

/**
 * A placeholder layout shown when content is absent, guiding users to take action.
 *
 * @example
 * ```tsx
 * import {
 *   EmptyState,
 *   EmptyStateDescription,
 *   EmptyStateTitle,
 * } from '@poffy-ui/react/feedback';
 *
 * <EmptyState>
 *   <EmptyStateTitle>No projects yet</EmptyStateTitle>
 *   <EmptyStateDescription>Create a project to get started.</EmptyStateDescription>
 * </EmptyState>
 * ```
 *
 * ### Notes
 * Required structure: use the root with title/description slots, and add actions only
 * when the empty state has a clear next step.
 *
 * ### AI Context & Architecture
 * - Tier: Molecules, Stack: Panda CSS (Recipe: emptyState), Radix Slot, EmptyStateContext
 * ### Design Tokens
 * - spacing/typography: silver-ratio tokens
 * ### Variant Logic
 * - size: sm/md/lg scales the icon and text proportionally. variant: Adjusts visual weight.
 * Compose with EmptyStateIcon, EmptyStateTitle, EmptyStateDescription, EmptyStateActions.
 * ### Accessibility
 * - Must contain meaningful text for screen readers. Avoid decorative-only icons without alt context.
 * ### AI Usage
 * - Use when a list or data region has zero results to display with a call-to-action.
 * - Do not use for errors that block the page; use Result or Alert instead.
 *
 * Related: `EmptyStateProps`
 */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>((props, ref) => {
  const {
    asChild,
    children,
    className,
    size,
    appearance = 'soft',
    intent = 'primary',
    variant,
    ...rest
  } = props;
  const resolvedVariant = variant ?? (appearance === 'outline' ? 'dashed' : 'flat');
  const classes = emptyState({ size, variant: resolvedVariant, intent });
  const Component = asChild ? Slot : 'div';

  return (
    <EmptyStateContext.Provider value={classes}>
      <Component ref={ref} className={cx(classes.root, className)} {...rest}>
        {children}
      </Component>
    </EmptyStateContext.Provider>
  );
});

EmptyState.displayName = 'EmptyState';
