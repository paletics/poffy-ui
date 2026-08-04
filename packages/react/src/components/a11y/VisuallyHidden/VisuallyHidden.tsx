import { css, cx } from '@/styled-system/css';
import { isNonVoidAsChildHost } from '@/components/shared/asChild';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef, type ElementType } from 'react';
import type { VisuallyHiddenComponent, VisuallyHiddenProps } from './VisuallyHidden.types';

const VisuallyHiddenImpl = forwardRef<Element, VisuallyHiddenProps>(
  ({ asChild, children, className, ...rest }, ref) => {
    const canUseAsChild = Boolean(asChild && isNonVoidAsChildHost(children));
    const Component = (canUseAsChild ? Slot : 'span') as ElementType;

    return (
      <Component
        ref={ref}
        className={cx(
          css({
            srOnly: true,
            _focusWithin: {
              clip: 'auto',
              height: 'auto',
              margin: '[0]',
              overflow: 'visible',
              position: 'static',
              whiteSpace: 'normal',
              width: 'auto',
            },
          }),
          className,
        )}
        {...rest}
      >
        {children}
      </Component>
    );
  },
);

VisuallyHiddenImpl.displayName = 'VisuallyHidden';
/**
 * Visually hides content while keeping it in the accessibility tree and reading order.
 *
 * Focusable descendants become visible while focus is within the wrapper, preserving a visible
 * keyboard target. `asChild` delegates only to a non-void element; unsupported children use the
 * default `<span>`. Use it for labels, descriptions, and status text—not as a general visibility
 * toggle for interactive UI.
 */
export const VisuallyHidden = VisuallyHiddenImpl as VisuallyHiddenComponent;
