import { forwardRef } from 'react';
import { Icon } from '../Icon';
import type { IconProps } from '../Icon.types';

/**
 * ErrorIcon
 * An error circle-x icon for status indicators.
 */
export const ErrorIcon = forwardRef<SVGSVGElement, Omit<IconProps, 'variant'>>((props, ref) => (
  <Icon {...props} ref={ref} variant="stroke">
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6" />
    <path d="m9 9 6 6" />
  </Icon>
));

ErrorIcon.displayName = 'ErrorIcon';
