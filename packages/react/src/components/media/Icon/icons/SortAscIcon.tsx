import { forwardRef } from 'react';
import { Icon } from '../Icon';
import type { IconProps } from '../Icon.types';

/**
 * ### AI Context & Architecture
 * - strokeWidth is intentionally heavier (3) for legibility at small sizes
 * such as DataGrid sort indicators.
 */
export const SortAscIcon = forwardRef<SVGSVGElement, Omit<IconProps, 'variant'>>((props, ref) => (
  <Icon strokeWidth="strong" {...props} ref={ref} variant="stroke">
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </Icon>
));

SortAscIcon.displayName = 'SortAscIcon';
