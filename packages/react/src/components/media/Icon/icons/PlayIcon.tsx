import { forwardRef } from 'react';
import { Icon } from '../Icon';
import type { IconProps } from '../Icon.types';

/**
 * PlayIcon
 * Icon component for Play.
 */
export const PlayIcon = forwardRef<SVGSVGElement, Omit<IconProps, 'variant'>>((props, ref) => (
  <Icon {...props} ref={ref} variant="stroke">
    <polygon points="5 3 19 12 5 21 5 3" />
  </Icon>
));

PlayIcon.displayName = 'PlayIcon';
