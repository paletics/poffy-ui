import { forwardRef } from 'react';
import { Icon } from '../Icon';
import type { IconProps } from '../Icon.types';

/**
 * BucketIcon
 * Icon component for Bucket.
 */
export const BucketIcon = forwardRef<SVGSVGElement, Omit<IconProps, 'variant'>>((props, ref) => (
  <Icon {...props} ref={ref} variant="stroke">
    <path d="M19 11l-8-8-9 9 8 8 5-5 9-9-5-5z" />
    <path d="M22 22h-10.5" />
    <path d="M2 22h.01" />
  </Icon>
));

BucketIcon.displayName = 'BucketIcon';
