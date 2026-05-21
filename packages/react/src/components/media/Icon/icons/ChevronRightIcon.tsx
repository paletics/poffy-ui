import { forwardRef } from 'react';
import { Icon } from '../Icon';
import type { IconProps } from '../Icon.types';

/**
 * Right-facing chevron stroke icon.
 */
export const ChevronRightIcon = forwardRef<SVGSVGElement, Omit<IconProps, 'variant'>>(
  (props, ref) => (
    <Icon {...props} ref={ref} variant="stroke">
      <polyline points="9 18 15 12 9 6" />
    </Icon>
  ),
);

ChevronRightIcon.displayName = 'ChevronRightIcon';
