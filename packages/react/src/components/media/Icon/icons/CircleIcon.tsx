import { forwardRef } from 'react';
import { Icon } from '../Icon';
import type { IconProps } from '../Icon.types';

/**
 * CircleIcon
 * Icon component for Circle.
 */
export const CircleIcon = forwardRef<SVGSVGElement, Omit<IconProps, 'variant'>>((props, ref) => (
  <Icon {...props} ref={ref} viewBox="0 0 19.213 19.213" variant="filled">
    <circle cx="9.606" cy="9.606" r="9.606" />
  </Icon>
));

CircleIcon.displayName = 'CircleIcon';
