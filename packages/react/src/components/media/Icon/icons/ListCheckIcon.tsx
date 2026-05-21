import { forwardRef } from 'react';
import { Icon } from '../Icon';
import type { IconProps } from '../Icon.types';

/**
 * ListCheckIcon
 * Icon component for ListCheck.
 */
export const ListCheckIcon = forwardRef<SVGSVGElement, Omit<IconProps, 'variant'>>((props, ref) => (
  <Icon {...props} ref={ref} variant="stroke">
    <path d="M3.5 5.5L5 7l2.5-2.5" />
    <path d="M3.5 11.5L5 13l2.5-2.5" />
    <path d="M3.5 17.5L5 19l2.5-2.5" />
    <line x1="11" y1="6" x2="20" y2="6" />
    <line x1="11" y1="12" x2="20" y2="12" />
    <line x1="11" y1="18" x2="20" y2="18" />
  </Icon>
));

ListCheckIcon.displayName = 'ListCheckIcon';
