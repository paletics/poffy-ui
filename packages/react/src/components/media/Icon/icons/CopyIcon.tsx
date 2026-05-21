import { forwardRef } from 'react';
import { Icon } from '../Icon';
import type { IconProps } from '../Icon.types';

/**
 * CopyIcon
 * A solid filled copy icon.
 * ### AI Context & Architecture
 * - Uses variant="filled" because this is a fill-based icon.
 * The filled variant sets fill:currentColor and stroke:none at the recipe level,
 * avoiding CSS cascade conflicts with path-level presentation attributes.
 */
export const CopyIcon = forwardRef<SVGSVGElement, Omit<IconProps, 'variant'>>((props, ref) => (
  <Icon {...props} ref={ref} variant="filled">
    <path d="M12.154 18.797H.589V7.232a.267.267 0 0 0-.267-.267H.268a.267.267 0 0 0-.267.267v11.887c0 .148.12.267.267.267h11.887c.148 0 .267-.12.267-.267v-.054a.267.267 0 0 0-.267-.267Z" />
    <path d="M15.624 0H2.264a.267.267 0 0 0-.267.267v16.809c0 .148.12.267.267.267h13.36c.148 0 .267-.12.267-.267V.267A.267.267 0 0 0 15.624 0Zm-.321.589v16.166H2.585V.589h12.718Z" />
  </Icon>
));

CopyIcon.displayName = 'CopyIcon';
