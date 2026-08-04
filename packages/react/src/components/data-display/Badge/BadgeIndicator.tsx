'use client';

import { Slot } from '@radix-ui/react-slot';
import { getSafeInteractiveContent } from '@/components/shared/getSafeInteractiveContent';
import { cx } from '@/styled-system/css';
import { ElementType, forwardRef } from 'react';
import { useBadgeContext } from './BadgeContext';
import type { BadgeIndicatorComponent, BadgeIndicatorProps } from './Badge.types';
import { isBadgeIndicatorAsChildHost } from './Badge.utils';

const BadgeIndicatorImpl = forwardRef<HTMLElement, BadgeIndicatorProps>((props, ref) => {
  const { asChild, children, className, ...rest } = props;
  const { classes, isDelegated } = useBadgeContext();
  const canUseAsChild = Boolean(asChild && isBadgeIndicatorAsChildHost(children));
  const Component = (canUseAsChild ? Slot : 'span') as ElementType;

  return (
    <Component ref={ref} className={cx(classes.badge, className)} data-badge-indicator="" {...rest}>
      {getSafeInteractiveContent(children, { preserveOpaque: !isDelegated })}
    </Component>
  );
});

BadgeIndicatorImpl.displayName = 'Badge.Indicator';

/**
 * Renders the positioned badge marker supplied by `Badge.Root`.
 *
 * Its children are rendered as safe, non-interactive content, so a count or
 * short status is appropriate. In a delegated root, `asChild` may target only
 * supported inline hosts; otherwise it renders a `span`.
 */

export const BadgeIndicator = BadgeIndicatorImpl as BadgeIndicatorComponent;
