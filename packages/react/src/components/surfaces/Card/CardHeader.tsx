'use client';

import { cx } from '@/styled-system/css';
import { forwardRef } from 'react';
import type { CardHeaderProps } from './Card.types';
import { useCardContext } from './CardContext';

/**
 * The header section of a Card. Usually contains titles or primary actions.
 * ### AI Context & Architecture
 * - Tier: Molecules, Stack: Panda CSS (Recipe: card header slot)
 * ### Design Tokens
 * - padding: silver-ratio tokens inherited via parent context
 * ### Variant Logic
 * - Visual hierarchy matches parent Card variant.
 * @example
 * ```tsx
 * <CardHeader><h3>Project Overview</h3></CardHeader>
 * ```
 * ### Notes
 * Must be a descendant of a `Card` component.
 * ### Accessibility
 * - Use appropriate semantic heading tags (`<Heading>`) inside the header.
 * ### AI Usage
 * - Place at the top of the Card.
 * - Best used for titles, avatars, or contextual actions.
 */
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className, ...rest }, ref) => {
    const { classes } = useCardContext();

    return (
      <div ref={ref} className={cx(classes.header, className)} {...rest}>
        {children}
      </div>
    );
  },
);

CardHeader.displayName = 'CardHeader';
