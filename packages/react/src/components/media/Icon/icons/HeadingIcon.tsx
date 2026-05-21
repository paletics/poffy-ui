import { forwardRef } from 'react';
import { Icon } from '../Icon';
import type { IconProps } from '../Icon.types';

/**
 * HeadingIcon
 * Icon component for Heading.
 */
export const HeadingIcon = forwardRef<SVGSVGElement, Omit<IconProps, 'variant'>>((props, ref) => (
  <Icon {...props} ref={ref} variant="stroke">
    <path d="M7 12h10" />
    <path d="M7 5v14" />
    <path d="M17 5v14" />
  </Icon>
));

HeadingIcon.displayName = 'HeadingIcon';
