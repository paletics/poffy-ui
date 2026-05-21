'use client';

import { Slot } from '@radix-ui/react-slot';
import { cx } from '@/styled-system/css';
import { badge } from '@/styled-system/recipes';
import { ElementType, forwardRef } from 'react';
import { useBadgeContext } from './BadgeContext';
import { BadgeIndicatorProps } from './Badge.types';

/**
 * The visual indicator of the Badge, conveying numeric or status information.
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Panda CSS (Recipe: badge), React Context, Radix Slot
 * ### Design Tokens
 * - size/padding: silver-ratio tokens map to dimensions and text sizes.
 * ### Variant Logic
 * - intent: Defines colors (primary, danger, success).
 * ### Notes
 * Extracts positional sizing from BadgeContext to properly offset limits.
 * ### Accessibility
 * - Must contain screen-reader text inside. `aria-hidden` could be provided if content is purely decorative.
 * ### AI Usage
 * - Do not use alone; must be placed inside or wrapped by a `BadgeRoot`.
 * @example
 * ```tsx
 * import { Badge } from '@poffy-ui/react/data-display';
 * import { BellIcon } from '@poffy-ui/react/media';
 *
 * <Badge.Root placement="top-end" intent="danger">
 *   <BellIcon />
 *   <Badge.Indicator aria-label="3 notifications">3</Badge.Indicator>
 * </Badge.Root>
 * ```
 */
export const BadgeIndicator = forwardRef<HTMLSpanElement, BadgeIndicatorProps>((props, ref) => {
  const { asChild, children, className, ...rest } = props;
  const { size, placement, intent, appearance, shape } = useBadgeContext();
  const classes = badge({ size, placement, intent, appearance, shape });
  const Component = asChild ? Slot : ('span' as ElementType);

  return (
    <Component ref={ref} className={cx(classes.badge, className)} {...rest}>
      {children}
    </Component>
  );
});

BadgeIndicator.displayName = 'Badge.Indicator';
