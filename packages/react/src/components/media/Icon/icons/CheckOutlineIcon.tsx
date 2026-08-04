import { forwardRef } from 'react';
import { Icon } from '../Icon';
import type { IconProps } from '../Icon.types';

/** Stroke checkmark icon. */
export const CheckOutlineIcon = forwardRef<SVGSVGElement, Omit<IconProps, 'variant'>>(
  (props, ref) => (
    <Icon {...props} ref={ref} variant="stroke">
      <g transform="translate(0 0.5)">
        <path d="M20 6 9 17l-5-5" />
      </g>
    </Icon>
  ),
);

CheckOutlineIcon.displayName = 'CheckOutlineIcon';
