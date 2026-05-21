import { forwardRef } from 'react';
import { Icon } from '../Icon';
import type { IconProps } from '../Icon.types';

/**
 * EyeOffIcon
 * A crossed eye icon for hide actions.
 */
export const EyeOffIcon = forwardRef<SVGSVGElement, Omit<IconProps, 'variant'>>((props, ref) => (
  <Icon {...props} ref={ref} variant="stroke">
    <path d="m3 3 18 18" />
    <path d="M10.58 10.58A2 2 0 0 0 12 14a2 2 0 0 0 1.42-.58" />
    <path d="M9.88 5.24A9.9 9.9 0 0 1 12 5c6.5 0 10 7 10 7a16.9 16.9 0 0 1-2.24 3.28" />
    <path d="M6.12 6.12C3.5 7.79 2 12 2 12s3.5 7 10 7c1.5 0 2.86-.37 4.06-.97" />
  </Icon>
));

EyeOffIcon.displayName = 'EyeOffIcon';
