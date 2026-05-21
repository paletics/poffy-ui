import { forwardRef } from 'react';
import { Icon } from '../Icon';
import type { IconProps } from '../Icon.types';

/**
 * Heading2Icon
 * Icon component for Heading2.
 */
export const Heading2Icon = forwardRef<SVGSVGElement, Omit<IconProps, 'variant'>>((props, ref) => (
  <Icon {...props} ref={ref} variant="stroke">
    <path d="M4 12h8" />
    <path d="M4 6v12" />
    <path d="M12 6v12" />
    <path d="M21 18h-4c0-4 4-5 4-9V6h-4" />
  </Icon>
));

Heading2Icon.displayName = 'Heading2Icon';
