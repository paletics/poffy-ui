import { forwardRef } from 'react';
import { Icon } from '../Icon';
import type { IconProps } from '../Icon.types';

/**
 * BoldIcon
 * Icon component for Bold.
 */
export const BoldIcon = forwardRef<SVGSVGElement, Omit<IconProps, 'variant'>>((props, ref) => (
  <Icon {...props} ref={ref} variant="stroke">
    <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4h-8zm0 8h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4h-9z" />
  </Icon>
));

BoldIcon.displayName = 'BoldIcon';
