'use client';

import { cx } from '@/styled-system/css';
import { forwardRef } from 'react';
import type { CardBodyProps } from './Card.types';
import { useCardContext } from './CardContext';

/**
 * The primary content container within a Card. Applies consistent internal spacing.
 * ### AI Context & Architecture
 * - Tier: Molecules, Stack: Panda CSS (Recipe: card body slot)
 * ### Design Tokens
 * - padding/gap: silver-ratio tokens inherited via parent context
 * ### Variant Logic
 * - Visual hierarchy matches parent Card variant.
 * @example
 * ```tsx
 * <CardBody>Detailed text content.</CardBody>
 * ```
 * ### Notes
 * Must be a descendant of a `Card` component.
 * ### Accessibility
 * - No specific ARIA roles enforced here, relies on inner content semantics.
 * ### AI Usage
 * - Wrap all main readable content or interactive forms inside this component.
 */
export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ children, className, ...rest }, ref) => {
    const { classes } = useCardContext();

    return (
      <div ref={ref} className={cx(classes.body, className)} {...rest}>
        {children}
      </div>
    );
  },
);

CardBody.displayName = 'CardBody';
