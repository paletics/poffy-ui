import { cx } from '@/styled-system/css';
import { skipLink } from '@/styled-system/recipes';
import { forwardRef } from 'react';
import type { SkipLinkProps } from './SkipLink.types';

/**
 * A keyboard-first link that lets users bypass repeated page chrome.
 *
 * It remains visually hidden until focused. The host must provide the matching fragment target
 * and make it programmatically focusable when necessary; this component does not transfer focus
 * with JavaScript.
 *
 * @example
 * ```tsx
 * <SkipLink href="#main-content">Skip to main content</SkipLink>
 * ```
 */
export const SkipLink = forwardRef<HTMLAnchorElement, SkipLinkProps>(
  ({ children, className, href, ...rest }, ref) => (
    <a ref={ref} className={cx(skipLink(), className)} href={href} {...rest}>
      {children}
    </a>
  ),
);

SkipLink.displayName = 'SkipLink';
