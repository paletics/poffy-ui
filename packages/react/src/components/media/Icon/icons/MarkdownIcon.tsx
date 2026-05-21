import { forwardRef } from 'react';
import { Icon } from '../Icon';
import type { IconProps } from '../Icon.types';

/**
 * MarkdownIcon
 * Icon component for Markdown.
 */
export const MarkdownIcon = forwardRef<SVGSVGElement, Omit<IconProps, 'variant'>>((props, ref) => (
  <Icon {...props} ref={ref} variant="stroke">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M7 15V9l2.5 2.5L12 9v6" />
    <line x1="19" y1="9" x2="19" y2="15" />
    <line x1="15" y1="9" x2="19" y2="13" />
    <line x1="15" y1="13" x2="19" y2="9" />
  </Icon>
));

MarkdownIcon.displayName = 'MarkdownIcon';
