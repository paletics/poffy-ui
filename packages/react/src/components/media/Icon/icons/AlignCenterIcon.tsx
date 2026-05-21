import { forwardRef } from 'react';
import { Icon } from '../Icon';
import type { IconProps } from '../Icon.types';

/**
 * AlignCenterIcon
 * Icon component for AlignCenter.
 */
export const AlignCenterIcon = forwardRef<SVGSVGElement, Omit<IconProps, 'variant'>>(
  (props, ref) => (
    <Icon {...props} ref={ref} variant="stroke">
      <line x1="21" y1="6" x2="3" y2="6" />
      <line x1="17" y1="12" x2="7" y2="12" />
      <line x1="19" y1="18" x2="5" y2="18" />
    </Icon>
  ),
);

AlignCenterIcon.displayName = 'AlignCenterIcon';
