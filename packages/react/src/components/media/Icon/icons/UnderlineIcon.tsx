import { forwardRef } from 'react';
import { Icon } from '../Icon';
import type { IconProps } from '../Icon.types';

/**
 * UnderlineIcon
 * Icon component for Underline.
 */
export const UnderlineIcon = forwardRef<SVGSVGElement, Omit<IconProps, 'variant'>>((props, ref) => (
  <Icon {...props} ref={ref} variant="stroke">
    <path d="M7 5v5a5 5 0 0 0 10 0V5" />
    <line x1="5" y1="19" x2="19" y2="19" />
  </Icon>
));

UnderlineIcon.displayName = 'UnderlineIcon';
