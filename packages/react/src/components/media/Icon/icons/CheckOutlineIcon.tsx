import { forwardRef } from 'react';
import { Icon } from '../Icon';
import type { IconProps } from '../Icon.types';

/**
 * CheckOutlineIcon
 * A stroke-based checkmark icon.
 * ### AI Context & Architecture
 * - Uses variant="stroke" because this is a line-based icon.
 */
export const CheckOutlineIcon = forwardRef<SVGSVGElement, Omit<IconProps, 'variant'>>(
  (props, ref) => (
    <Icon {...props} ref={ref} variant="stroke">
      <path d="M20 6 9 17l-5-5" />
    </Icon>
  ),
);

CheckOutlineIcon.displayName = 'CheckOutlineIcon';
