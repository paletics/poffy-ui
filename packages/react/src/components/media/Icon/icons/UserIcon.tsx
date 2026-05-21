import { forwardRef } from 'react';
import { Icon } from '../Icon';
import type { IconProps } from '../Icon.types';

/**
 * UserIcon
 * A user silhouette icon for account navigation.
 */
export const UserIcon = forwardRef<SVGSVGElement, Omit<IconProps, 'variant'>>((props, ref) => (
  <Icon {...props} ref={ref} variant="stroke">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c1.5-4 4.2-6 8-6s6.5 2 8 6" />
  </Icon>
));

UserIcon.displayName = 'UserIcon';
