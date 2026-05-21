import { forwardRef } from 'react';
import { Icon } from '../Icon';
import type { IconProps } from '../Icon.types';

/**
 * PawIcon
 * A paw print icon component, representing the "Poffy" brand identity.
 */
export const PawIcon = forwardRef<SVGSVGElement, Omit<IconProps, 'variant'>>((props, ref) => (
  <Icon {...props} ref={ref} variant="stroke">
    <circle cx="8.5" cy="6.5" r="2.5" />
    <circle cx="5" cy="11" r="2" />
    <circle cx="19" cy="11" r="2" />
    <path d="M17.9,17.6c-.5,2.4-2.7,1.9-5.9,1.9s-5.4.5-5.9-1.9,2.7-5.1,5.9-5.1,6.5,2.4,5.9,5.1Z" />
    <circle cx="15.5" cy="6.5" r="2.5" />
  </Icon>
));

PawIcon.displayName = 'PawIcon';
