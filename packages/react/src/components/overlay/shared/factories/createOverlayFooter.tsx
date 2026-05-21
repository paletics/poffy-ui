'use client';

import { cx } from '@/styled-system/css';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import { ReferenceType } from '@floating-ui/react';
import type { OverlayContext, OverlaySubComponentProps } from './types';

/**
 * Factory function to create a Footer component for overlay patterns.
 *
 * Provides a consistent action area for Modals and Drawers.
 * Usually contains buttons for committing or canceling actions.
 *
 * @param useContext - Hook to access the parent overlay's context.
 * @param displayName - Display name for the generated component in React DevTools.
 * @returns A forwardRef-wrapped Footer component.
 *
 * @example
 * ```tsx
 * export const ModalFooter = createOverlayFooter(useModalContext, 'ModalFooter');
 * ```
 *
 * ### AI Context & Architecture
 * Container for sticky or bottom-aligned actions in Modals and Drawers.
 */
export const createOverlayFooter = <T extends ReferenceType, TContext extends OverlayContext<T>>(
  useContext: () => TContext,
  displayName: string,
) => {
  const Component = forwardRef<HTMLDivElement, OverlaySubComponentProps<'div'>>((props, ref) => {
    const { className, asChild, ...rest } = props;
    const { classes: rawClasses } = useContext();
    const classes = rawClasses as Record<'footer', string>;
    const FooterElement = asChild ? Slot : 'div';

    return <FooterElement ref={ref} className={cx(classes.footer, className)} {...rest} />;
  });

  Component.displayName = displayName;
  return Component;
};
