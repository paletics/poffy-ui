'use client';

import { cx } from '@/styled-system/css';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import { ReferenceType } from '@floating-ui/react';
import type { OverlayContext, OverlaySubComponentProps } from './types';

/**
 * Factory function to create a Title component for overlay patterns.
 *
 * Provides a consistent heading component for Modals, Drawers, and Popovers.
 * Automatically links to the parent overlay via the `titleId` for `aria-labelledby` support.
 *
 * @param useContext - Hook to access the parent overlay's context.
 * @param displayName - Display name for the generated component in React DevTools.
 * @param element - The HTML heading element to use.
 * @returns A forwardRef-wrapped Title component.
 *
 * @example
 * ```tsx
 * export const ModalTitle = createOverlayTitle(useModalContext, 'ModalTitle', 'h2');
 * export const PopoverTitle = createOverlayTitle(usePopoverContext, 'PopoverTitle', 'h3');
 * ```
 *
 * ### AI Context & Architecture
 * Standardizes accessibility titles. It enforces link between the title and the root
 * dialog via `titleId` (mapping to `aria-labelledby`).
 * The `element` parameter determines the default semantic level, but `asChild` allows absolute control.
 */
export const createOverlayTitle = <T extends ReferenceType, TContext extends OverlayContext<T>>(
  useContext: () => TContext,
  displayName: string,
  element: 'h2' | 'h3' = 'h2',
) => {
  const Component = forwardRef<HTMLHeadingElement, OverlaySubComponentProps<'h2'>>((props, ref) => {
    const { className, asChild, ...rest } = props;
    const { titleId, classes: rawClasses } = useContext();
    const classes = rawClasses as Record<'title', string>;
    const TitleElement = asChild ? Slot : element;

    return (
      <TitleElement ref={ref} id={titleId} className={cx(classes.title, className)} {...rest} />
    );
  });

  Component.displayName = displayName;
  return Component;
};
