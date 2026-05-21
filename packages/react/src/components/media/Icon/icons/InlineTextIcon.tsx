import { forwardRef } from 'react';
import { Icon } from '../Icon';
import type { IconProps } from '../Icon.types';

/**
 * InlineTextIcon
 * Icon component for InlineText.
 */
export const InlineTextIcon = forwardRef<SVGSVGElement, Omit<IconProps, 'variant'>>(
  (props, ref) => (
    <Icon {...props} ref={ref} variant="stroke">
      <path d="M4 20h16" />
      <path d="M12 4l-6 16" />
      <path d="M12 4l6 16" />
      <line x1="14" y1="14" x2="10" y2="14" />
    </Icon>
  ),
);

InlineTextIcon.displayName = 'InlineTextIcon';
