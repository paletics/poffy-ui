import { forwardRef } from 'react';
import { Icon } from '../Icon';
import type { IconProps } from '../Icon.types';

/**
 * Downward chevron stroke icon.
 */
export const ChevronDownIcon = forwardRef<SVGSVGElement, Omit<IconProps, 'variant'>>(
  (props, ref) => (
    <Icon {...props} ref={ref} variant="stroke">
      <polyline points="6 9 12 15 18 9" />
    </Icon>
  ),
);

ChevronDownIcon.displayName = 'ChevronDownIcon';
