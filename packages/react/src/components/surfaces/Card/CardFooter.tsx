'use client';

import { cx } from '@/styled-system/css';
import { forwardRef } from 'react';
import type { CardFooterProps } from './Card.types';
import { useCardContext } from './CardContext';

/**
 * The footer section of a Card. Typically contains secondary text or bottom-aligned action buttons.
 * ### AI Context & Architecture
 * - Tier: Molecules, Stack: Panda CSS (Recipe: card footer slot)
 * ### Design Tokens
 * - padding/gap: silver-ratio tokens inherited via parent context
 * ### Variant Logic
 * - Visual hierarchy matches parent Card variant.
 * @example
 * ```tsx
 * <CardFooter><Button>Submit</Button></CardFooter>
 * ```
 * ### Notes
 * Must be a descendant of a `Card` component.
 * ### Accessibility
 * - Should not contain primary site navigation.
 * ### AI Usage
 * - Place at the bottom of the Card content.
 * - Wrap CTA buttons or "Read More" links here.
 */
export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className, ...rest }, ref) => {
    const { classes } = useCardContext();

    return (
      <div ref={ref} className={cx(classes.footer, className)} {...rest}>
        {children}
      </div>
    );
  },
);

CardFooter.displayName = 'CardFooter';
