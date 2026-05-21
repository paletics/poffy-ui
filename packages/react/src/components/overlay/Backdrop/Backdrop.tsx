'use client';

import { cx } from '@/styled-system/css';
import { backdrop } from '@/styled-system/recipes';
import { FloatingOverlay } from '@floating-ui/react';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import { BackdropProps } from './Backdrop.types';

/**
 * Backdrop component that provides a consistent background for overlays.
 * It uses Floating UI's `FloatingOverlay` internally for positioning and scroll locking.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Floating UI (`FloatingOverlay`), Radix Slot
 * - **Props**: BackdropProps
 *
 * ### Accessibility
 * - **Scroll Management**: Optionally prevents body scroll when active, keeping focus within the overlay content.
 *
 * @example
 * ```tsx
 * import { Backdrop } from '@poffy-ui/react/overlay';
 *
 * <Backdrop lockScroll>
 *   <div className="content">Modal Content</div>
 * </Backdrop>
 * ```
 */
export const Backdrop = forwardRef<HTMLDivElement, BackdropProps>((props, ref) => {
  const { lockScroll = true, children, className, asChild, ...rest } = props;
  const Component = asChild ? Slot : FloatingOverlay;
  // lockScroll is a FloatingOverlay-specific prop; omit it when delegating via Slot
  // to prevent unknown DOM attribute warnings and silent no-op behaviour.
  const overlayProps = asChild ? {} : { lockScroll };

  return (
    <Component ref={ref} {...overlayProps} className={cx(backdrop(), className)} {...rest}>
      {children}
    </Component>
  );
});

Backdrop.displayName = 'Backdrop';
