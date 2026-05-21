'use client';

import { forwardRef } from 'react';
import { AvatarGroupProps } from './AvatarGroup.types';
import { AvatarGroupRoot } from './AvatarGroupRoot';
import { AvatarGroupExcess } from './AvatarGroupExcess';

/**
 * Organizes multiple Avatar components into a cohesive group.
 * ### AI Context & Architecture
 * - Tier: Organisms, Stack: Panda CSS (Recipe: avatarGroup), React Context
 * ### Design Tokens
 * - spacing: silver-ratio tokens (supports negative margins for overlap)
 * ### Variant Logic
 * - size: Inherited by children to ensure uniform scale.
 * ### Notes
 * Limits rendering based on `max` prop and automatically appends an excess indicator.
 * ### Accessibility
 * - The excess indicator should have an aria-label indicating the remaining user count.
 * ### AI Usage
 * - Wrap multiple `<Avatar>` tags. Do not wrap other elements.
 * @example
 * ```tsx
 * import { Avatar, AvatarGroup } from '@poffy-ui/react/data-display';
 *
 * <AvatarGroup max={3} size="md">
 *   <Avatar src="/a.jpg" alt="Alice" name="Alice" />
 *   <Avatar src="/b.jpg" alt="Bob" name="Bob" />
 *   <Avatar src="/c.jpg" alt="Carol" name="Carol" />
 *   <Avatar name="Dave" />
 * </AvatarGroup>
 * ```
 */
export const AvatarGroup = Object.assign(
  forwardRef<HTMLDivElement, AvatarGroupProps>(function AvatarGroup(props, ref) {
    const { onExcessClick, ...rest } = props;
    return <AvatarGroupRoot ref={ref} onExcessClick={onExcessClick} {...rest} />;
  }),
  {
    Root: AvatarGroupRoot,
    Excess: AvatarGroupExcess,
  },
);

AvatarGroup.displayName = 'AvatarGroup';
