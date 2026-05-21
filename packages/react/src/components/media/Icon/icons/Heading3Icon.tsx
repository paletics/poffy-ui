import { forwardRef } from 'react';
import { Icon } from '../Icon';
import type { IconProps } from '../Icon.types';

/**
 * Heading3Icon
 * Icon component for Heading3.
 */
export const Heading3Icon = forwardRef<SVGSVGElement, Omit<IconProps, 'variant'>>((props, ref) => (
  <Icon {...props} ref={ref} variant="stroke">
    <path d="M4 12h8" />
    <path d="M4 6v12" />
    <path d="M12 6v12" />
    <path d="M17.5 6a2.5 2.5 0 0 1 0 5 2.5 2.5 0 0 1 0 5 2.5 2.5 0 0 1 0 5h-2.5V6z" />
    <path d="M17.5 16A2.5 2.5 0 0 1 15 18.5" />
    <path d="M15 18.5h-1V6h1a2.5 2.5 0 0 1 0 5 2.5 2.5 0 0 1 0 5 2.5 2.5 0 0 1 0 2.5" />
    <path d="M15 6h2.5a2.5 2.5 0 1 1 0 5H16M16 11h1.5a2.5 2.5 0 1 1 0 5H15V6" />
  </Icon>
));

Heading3Icon.displayName = 'Heading3Icon';
