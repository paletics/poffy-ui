import { forwardRef } from 'react';
import { Icon } from '../Icon';
import type { IconProps } from '../Icon.types';

/**
 * ### AI Context & Architecture
 * - strokeWidth is intentionally heavier (3) for legibility at small sizes
 * such as DataGrid sort indicators.
 */
export const SortDescIcon = forwardRef<SVGSVGElement, Omit<IconProps, 'variant'>>((props, ref) => (
  <Icon strokeWidth="strong" {...props} ref={ref} variant="stroke">
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="19 12 12 19 5 12" />
  </Icon>
));

SortDescIcon.displayName = 'SortDescIcon';
