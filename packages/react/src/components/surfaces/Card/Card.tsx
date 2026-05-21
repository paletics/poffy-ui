'use client';

import { cx } from '@/styled-system/css';
import { card } from '@/styled-system/recipes';
import { ElementType, forwardRef, useMemo } from 'react';
import type { CardProps } from './Card.types';
import { CardContext } from './CardContext';
import { Slot } from '@radix-ui/react-slot';

/**
 * A versatile container component for grouping related content using the Silver Ratio for dimension spacing.
 * ### AI Context & Architecture
 * - Tier: Molecules, Stack: Panda CSS (Recipe: card), Context Provider, Radix Slot
 * ### Design Tokens
 * - padding/gap/border-radius: silver-ratio tokens via card recipe
 * ### Variant Logic
 * - elevated: Primary floating card with shadow. outlined: Subtle bordered card for dense layouts. filled: Background-filled without borders or shadow.
 * @example
 * ```tsx
 * <Card variant="elevated">
 *   <CardHeader>Title</CardHeader>
 *   <CardBody>Main content area.</CardBody>
 *   <CardFooter>Action buttons</CardFooter>
 * </Card>
 * ```
 * ### Notes
 * Acts as a Context Provider. Children must be composed of Card parts (Header/Body/Footer).
 * ### Accessibility
 * - Can be rendered as `<article>` or `<section>` via `asChild` to construct meaningful document regions.
 * ### AI Usage
 * - Use to group homogeneous content or distinct UI actions.
 * - Delegate the HTML element to semantic tags via `asChild` when rendering items in a list.
 */
export const Card = forwardRef<HTMLDivElement, CardProps<ElementType>>(
  ({ children, className, appearance, intent, shape, variant, asChild, ...rest }, ref) => {
    const Component = asChild ? Slot : 'div';
    const resolvedAppearance =
      appearance ?? (variant === 'filled' ? 'soft' : variant === 'outlined' ? 'outline' : 'solid');

    const contextValue = useMemo(
      () => ({
        classes: card({
          appearance: resolvedAppearance,
          intent,
          shape,
        }),
      }),
      [resolvedAppearance, intent, shape],
    );

    return (
      <CardContext.Provider value={contextValue}>
        <Component ref={ref} className={cx(contextValue.classes.root, className)} {...rest}>
          {children}
        </Component>
      </CardContext.Provider>
    );
  },
);

Card.displayName = 'Card';
