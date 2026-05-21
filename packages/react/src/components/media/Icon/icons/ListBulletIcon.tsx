import { forwardRef } from 'react';
import { Icon } from '../Icon';
import type { IconProps } from '../Icon.types';

/**
 * ListBulletIcon
 * Icon component for ListBullet.
 */
export const ListBulletIcon = forwardRef<SVGSVGElement, Omit<IconProps, 'variant'>>(
  (props, ref) => (
    <Icon {...props} ref={ref} variant="stroke">
      <line x1="9" y1="6" x2="20" y2="6" />
      <line x1="9" y1="12" x2="20" y2="12" />
      <line x1="9" y1="18" x2="20" y2="18" />
      <line x1="5" y1="6" x2="5" y2="6.01" />
      <line x1="5" y1="12" x2="5" y2="12.01" />
      <line x1="5" y1="18" x2="5" y2="18.01" />
    </Icon>
  ),
);

ListBulletIcon.displayName = 'ListBulletIcon';
