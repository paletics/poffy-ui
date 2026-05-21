import { forwardRef } from 'react';
import { Icon } from '../Icon';
import type { IconProps } from '../Icon.types';

/**
 * ItalicIcon
 * Icon component for Italic.
 */
export const ItalicIcon = forwardRef<SVGSVGElement, Omit<IconProps, 'variant'>>((props, ref) => (
  <Icon {...props} ref={ref} variant="stroke">
    <line x1="11" y1="5" x2="17" y2="5" />
    <line x1="7" y1="19" x2="13" y2="19" />
    <line x1="14" y1="5" x2="10" y2="19" />
  </Icon>
));

ItalicIcon.displayName = 'ItalicIcon';
