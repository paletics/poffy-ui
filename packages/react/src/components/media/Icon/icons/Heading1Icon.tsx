import { forwardRef } from 'react';
import { Icon } from '../Icon';
import type { IconProps } from '../Icon.types';

/**
 * Heading1Icon
 * Icon component for Heading1.
 */
export const Heading1Icon = forwardRef<SVGSVGElement, Omit<IconProps, 'variant'>>((props, ref) => (
  <Icon {...props} ref={ref} variant="stroke">
    <path d="M4 12h8" />
    <path d="M4 6v12" />
    <path d="M12 6v12" />
    <path d="M17 18V6l-2 2" />
  </Icon>
));

Heading1Icon.displayName = 'Heading1Icon';
