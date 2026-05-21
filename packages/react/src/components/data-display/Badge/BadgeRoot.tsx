'use client';

import { Slot, Slottable } from '@radix-ui/react-slot';
import { cx } from '@/styled-system/css';
import { badge } from '@/styled-system/recipes';
import { ElementType, forwardRef, useMemo } from 'react';
import { BadgeContext } from './BadgeContext';
import { BadgeRootProps } from './Badge.types';

/**
 * Evaluates bounding dimensions to properly wrap elements that need to be badged.
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Panda CSS (Recipe: badge), React Context, Radix Slot
 * ### Design Tokens
 * - spacing: silver-ratio tokens map to badge positioning logic.
 * ### Variant Logic
 * - size: Dictates dimensional scale, placement: Controls absolute positioning coordinates.
 * ### Notes
 * Establishes absolute positioning bounds (`position: relative`) for the BadgeIndicator.
 * ### Accessibility
 * - Must contain a valid focusable element if it acts on interactive children.
 * ### AI Usage
 * - Used as the parent container when building custom badges manually rather than using the shorthand.
 * @example
 * ```tsx
 * import { Badge } from '@poffy-ui/react/data-display';
 *
 * <Badge.Root size="md" placement="top-end" intent="danger">
 *   <button>Notifications</button>
 *   <Badge.Indicator>9+</Badge.Indicator>
 * </Badge.Root>
 * ```
 */
export const BadgeRoot = forwardRef<HTMLDivElement, BadgeRootProps>((props, ref) => {
  const { asChild, size, placement, intent, appearance, shape, children, className, ...rest } =
    props;
  const classes = badge({ size, placement, intent, appearance, shape });
  const Component = asChild ? Slot : ('div' as ElementType);

  const contextValue = useMemo(
    () => ({ size, placement, intent, appearance, shape }),
    [size, placement, intent, appearance, shape],
  );

  return (
    <BadgeContext.Provider value={contextValue}>
      <Component ref={ref} className={cx(classes.root, className)} {...rest}>
        <Slottable>{children}</Slottable>
      </Component>
    </BadgeContext.Provider>
  );
});

BadgeRoot.displayName = 'Badge.Root';
