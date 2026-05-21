import { forwardRef } from 'react';
import { Icon } from '../Icon';
import type { IconProps } from '../Icon.types';

/**
 * StrikethroughIcon
 * Icon component for Strikethrough.
 */
export const StrikethroughIcon = forwardRef<SVGSVGElement, Omit<IconProps, 'variant'>>(
  (props, ref) => (
    <Icon {...props} ref={ref} variant="stroke">
      <line x1="5" y1="12" x2="19" y2="12" />
      <path d="M16 6.5A4 4 0 0 0 8 6.5" />
      <path d="M16 17.5A4 4 0 0 1 8 17.5" />
    </Icon>
  ),
);

StrikethroughIcon.displayName = 'StrikethroughIcon';
