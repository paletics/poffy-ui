'use client';

import { cx } from '@/styled-system/css';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import { ReferenceType } from '@floating-ui/react';
import type { OverlayContext, OverlaySubComponentProps } from './types';

/**
 * Factory function to create a Header component for overlay patterns.
 *
 * Provides a consistent top-level container for Modals and Drawers.
 * Usually contains the Title and Close button.
 *
 * @param useContext - Hook to access the parent overlay's context.
 * @param displayName - Display name for the generated component in React DevTools.
 * @returns A forwardRef-wrapped Header component.
 *
 * @example
 * ```tsx
 * export const ModalHeader = createOverlayHeader(useModalContext, 'ModalHeader');
 * ```
 *
 * ### AI Context & Architecture
 * Consistent header layout for multi-part overlays.
 * Supports `asChild` for semantic flexibility (e.g., using `header` vs `div`).
 */
export const createOverlayHeader = <T extends ReferenceType, TContext extends OverlayContext<T>>(
  useContext: () => TContext,
  displayName: string,
) => {
  const Component = forwardRef<HTMLDivElement, OverlaySubComponentProps<'div'>>((props, ref) => {
    const { className, asChild, ...rest } = props;
    const { classes: rawClasses } = useContext();
    const classes = rawClasses as Record<'header', string>;
    const HeaderElement = asChild ? Slot : 'div';

    return <HeaderElement ref={ref} className={cx(classes.header, className)} {...rest} />;
  });

  Component.displayName = displayName;
  return Component;
};
