import { forwardRef } from 'react';
import { Icon } from '../Icon';
import type { IconProps } from '../Icon.types';

/**
 * BellIcon
 * Icon component for Bell.
 */
export const BellIcon = forwardRef<SVGSVGElement, Omit<IconProps, 'variant'>>((props, ref) => (
  <Icon {...props} ref={ref} viewBox="0 0 15.502 17.551" variant="filled">
    <path d="M13.31 13.467V8.072c0-.011-.01-.017-.012-.027-.054-3.03-1.824-5.541-4.204-6.243v-.316a1.486 1.486 0 1 0-2.972 0v.426c-2.226.82-3.853 3.233-3.905 6.133-.002.01-.012.017-.012.027v5.405l-.012-.01L0 15.212h15.502l-2.193-1.745ZM7.751 17.551c1.147 0 2.077-.93 2.077-2.077H5.675c0 1.147.93 2.077 2.077 2.077Z" />
  </Icon>
));

BellIcon.displayName = 'BellIcon';
