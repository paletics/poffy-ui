import { forwardRef } from 'react';
import { Icon } from '../Icon';
import type { IconProps } from '../Icon.types';

/**
 * CheckIcon
 * A solid filled check icon.
 * ### AI Context & Architecture
 * - Uses variant="filled" because this is a fill-based icon.
 * The filled variant sets fill:currentColor and stroke:none at the recipe level,
 * avoiding CSS cascade conflicts with path-level presentation attributes.
 */
export const CheckIcon = forwardRef<SVGSVGElement, Omit<IconProps, 'variant'>>((props, ref) => (
  <Icon {...props} ref={ref} variant="filled">
    <path d="M18.06.259 7.218 11.102 1.454 6.265A.886.886 0 0 0 .316 7.621l6.385 5.358a.877.877 0 0 0 1.171-.048c.019-.016.042-.022.06-.04L19.312 1.51A.884.884 0 1 0 18.061.259Z" />
  </Icon>
));

CheckIcon.displayName = 'CheckIcon';
