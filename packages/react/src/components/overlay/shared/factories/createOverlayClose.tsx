'use client';

import { cx } from '@/styled-system/css';
import { Slot } from '@radix-ui/react-slot';
import { type MouseEvent, forwardRef } from 'react';
import { ReferenceType } from '@floating-ui/react';
import { CrossIcon } from '@/components/media/Icon/icons';
import type { OverlayContext, OverlaySubComponentProps } from './types';

const getCloseIconSize = (iconSize: number) => (iconSize <= 16 ? 'sm' : 'md');

/**
 * Factory function to create a Close button component for overlay patterns.
 *
 * Provides a consistent dismissal button for Modals, Drawers, and Popovers.
 * Includes a default close icon and manages the open state transition.
 *
 * @param useContext - Hook to access the parent overlay's context.
 * @param displayName - Display name for the generated component in React DevTools.
 * @param iconSize - Size of the close SVG icon.
 * @returns A forwardRef-wrapped Close button component.
 *
 * @example
 * ```tsx
 * export const ModalClose = createOverlayClose(useModalContext, 'ModalClose', 24);
 * export const PopoverClose = createOverlayClose(usePopoverContext, 'PopoverClose', 16);
 * ```
 *
 * ### AI Context & Architecture
 * Standardizes close button behavior across different overlay types.
 * It automatically maps `onClick` to the context's `onOpenChange` or `setOpen` to ensure
 * the overlay closes without requiring explicit state management in the UI implementation.
 */
export const createOverlayClose = <T extends ReferenceType, TContext extends OverlayContext<T>>(
  useContext: () => TContext,
  displayName: string,
  iconSize = 24,
) => {
  const Component = forwardRef<HTMLButtonElement, OverlaySubComponentProps<'button'>>(
    (props, ref) => {
      const { className, onClick, asChild, children, ...rest } = props;
      const { classes: rawClasses, ...ctx } = useContext();
      const classes = rawClasses as Record<'close', string>;

      const onClose = ctx.onOpenChange;
      const CloseElement = asChild ? Slot : 'button';

      return (
        <CloseElement
          ref={ref}
          type={asChild ? undefined : 'button'}
          className={cx(classes.close, className)}
          onClick={(e: MouseEvent<HTMLButtonElement>) => {
            onClick?.(e);
            onClose?.(false);
          }}
          aria-label="Close"
          {...rest}
        >
          {children ?? <CrossIcon size={getCloseIconSize(iconSize)} />}
        </CloseElement>
      );
    },
  );

  Component.displayName = displayName;
  return Component;
};
