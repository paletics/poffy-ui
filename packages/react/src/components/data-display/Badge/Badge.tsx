'use client';

import { cloneElement, forwardRef, isValidElement, ReactElement, ReactNode } from 'react';
import { BadgeRoot } from './BadgeRoot';
import { BadgeIndicator } from './BadgeIndicator';
import { BadgeProps } from './Badge.types';

const BadgeImplementation = forwardRef<HTMLDivElement, BadgeProps>((props, ref) => {
  const { asChild, content, size, placement, intent, appearance, shape, children, ...rest } = props;

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ children?: ReactNode }>;
    return (
      <BadgeRoot
        ref={ref}
        size={size}
        placement={placement}
        intent={intent}
        appearance={appearance}
        shape={shape}
        asChild
        {...rest}
      >
        {cloneElement(
          child,
          undefined,
          <span>
            {child.props.children}
            {content != null && <BadgeIndicator>{content}</BadgeIndicator>}
          </span>,
        )}
      </BadgeRoot>
    );
  }

  return (
    <BadgeRoot
      ref={ref}
      size={size}
      placement={placement}
      intent={intent}
      appearance={appearance}
      shape={shape}
      {...rest}
    >
      {children}
      {content != null && <BadgeIndicator>{content}</BadgeIndicator>}
    </BadgeRoot>
  );
});

BadgeImplementation.displayName = 'Badge';

/**
 * Compound Badge component with Root and Indicator subcomponents.
 *
 * ### AI Usage
 * - Use the shorthand form for common anchored badges, or compose Root/Indicator for custom layout.
 *
 * @example Shorthand anchored badge
 * ```tsx
 * import { Avatar, Badge } from '@poffy-ui/react/data-display';
 *
 * <Badge content={3} placement="top-end" intent="danger">
 *   <Avatar src="/user.jpg" alt="User" />
 * </Badge>
 * ```
 */
export const Badge = Object.assign(BadgeImplementation, {
  Root: BadgeRoot,
  Indicator: BadgeIndicator,
});
