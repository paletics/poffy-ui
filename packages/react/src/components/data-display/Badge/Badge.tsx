'use client';

import {
  Children,
  forwardRef,
  type ForwardRefExoticComponent,
  type PropsWithoutRef,
  type RefAttributes,
} from 'react';
import { materializeReactNodeTree } from '@/components/shared/flattenFragmentChildren';
import { BadgeRoot } from './BadgeRoot';
import { BadgeIndicator } from './BadgeIndicator';
import type { BadgeComponent, BadgeProps, BadgeRootProps } from './Badge.types';
import { isBadgeRootAsChildHost } from './Badge.utils';

const BadgeRootRuntime = BadgeRoot as unknown as ForwardRefExoticComponent<
  PropsWithoutRef<BadgeRootProps> & RefAttributes<HTMLElement>
>;

const BadgeImplementation = forwardRef<HTMLElement, BadgeProps>((props, ref) => {
  const { asChild, content, size, placement, intent, appearance, shape, children, ...rest } = props;
  const materializedChildren = materializeReactNodeTree(children);
  const hasAnchor = Children.toArray(materializedChildren).length > 0;

  if (asChild && isBadgeRootAsChildHost(materializedChildren)) {
    const child = materializedChildren;
    return (
      <BadgeRootRuntime
        ref={ref}
        size={size}
        placement={placement}
        intent={intent}
        appearance={appearance}
        shape={shape}
        asChild
        {...rest}
      >
        {child}
        {content != null && <BadgeIndicator>{content}</BadgeIndicator>}
      </BadgeRootRuntime>
    );
  }

  return (
    <BadgeRootRuntime
      ref={ref}
      size={size}
      placement={placement}
      intent={intent}
      appearance={appearance}
      shape={shape}
      {...rest}
      data-standalone={content != null && !hasAnchor ? '' : undefined}
    >
      {materializedChildren}
      {content != null && (
        <BadgeIndicator data-standalone={!hasAnchor ? '' : undefined}>
          {hasAnchor ? content : <span data-badge-standalone-content="">{content}</span>}
        </BadgeIndicator>
      )}
    </BadgeRootRuntime>
  );
});

BadgeImplementation.displayName = 'Badge';

/**
 * Attaches a compact indicator to an anchor or renders a standalone badge.
 *
 * When children are present, `content` is placed in `Badge.Indicator` beside
 * the first anchor. Without children it renders a standalone indicator.
 * `asChild` delegates only when the supplied child is a valid badge anchor.
 */
export const Badge = Object.assign(BadgeImplementation as BadgeComponent, {
  Root: BadgeRoot,
  Indicator: BadgeIndicator,
});
