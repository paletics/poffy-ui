'use client';

import { cx } from '@/styled-system/css';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import { ReferenceType } from '@floating-ui/react';
import type { OverlayContext, OverlaySubComponentProps } from './types';

/**
 * Factory function to create a Body component for overlay patterns.
 *
 * Provides a consistent main content area for Modals and Drawers.
 * Usually contains the primary information or forms.
 *
 * @param useContext - Hook to access the parent overlay's context.
 * @param displayName - Display name for the generated component in React DevTools.
 * @returns A forwardRef-wrapped Body component.
 *
 * @example
 * ```tsx
 * export const ModalBody = createOverlayBody(useModalContext, 'ModalBody');
 * ```
 *
 * ### AI Context & Architecture
 * Core content wrapper for scrolling or layout-specific logic within an overlay.
 */
export const createOverlayBody = <T extends ReferenceType, TContext extends OverlayContext<T>>(
  useContext: () => TContext,
  displayName: string,
) => {
  const Component = forwardRef<HTMLDivElement, OverlaySubComponentProps<'div'>>((props, ref) => {
    const { className, asChild, ...rest } = props;
    const { classes: rawClasses } = useContext();
    const classes = rawClasses as Record<'body', string>;
    const BodyElement = asChild ? Slot : 'div';

    return <BodyElement ref={ref} className={cx(classes.body, className)} {...rest} />;
  });

  Component.displayName = displayName;
  return Component;
};
