'use client';

import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type { AvatarGroupComponent, AvatarGroupExcessProps } from './AvatarGroup.types';
import { AvatarGroupRoot } from './AvatarGroupRoot';
import { AvatarGroupExcess } from './AvatarGroupExcess';

/**
 * Arranges avatars with optional overlap and an automatically calculated excess marker.
 *
 * `max` limits rendered children, while `total` may represent members that
 * were not rendered; their difference becomes `AvatarGroup.Excess`.
 * Supplying `onExcessClick` makes that marker a labelled button. The group
 * defaults to `role="group"` and supports only structural hosts for `asChild`.
 */
export const AvatarGroup = Object.assign(AvatarGroupRoot as AvatarGroupComponent, {
  Root: AvatarGroupRoot,
  Excess: AvatarGroupExcess as ForwardRefExoticComponent<
    AvatarGroupExcessProps & RefAttributes<HTMLSpanElement>
  >,
});
