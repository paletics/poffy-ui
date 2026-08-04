import { forwardRef } from 'react';
import { Icon } from '../Icon';
import type { IconProps } from '../Icon.types';

/** Filled check icon. */
export const CheckIcon = forwardRef<SVGSVGElement, Omit<IconProps, 'variant'>>((props, ref) => (
  <Icon {...props} ref={ref} variant="filled">
    <g transform="translate(2.19 5.38)">
      <path d="M18.06.259 7.218 11.102 1.454 6.265A.886.886 0 0 0 .316 7.621l6.385 5.358a.877.877 0 0 0 1.171-.048c.019-.016.042-.022.06-.04L19.312 1.51A.884.884 0 1 0 18.061.259Z" />
    </g>
  </Icon>
));

CheckIcon.displayName = 'CheckIcon';
