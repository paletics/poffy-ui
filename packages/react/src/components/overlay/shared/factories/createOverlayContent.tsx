'use client';

import { OverlayTransition } from '@/components/animations/OverlayTransition/OverlayTransition';
import { useOptionalBrand } from '@/providers/BrandProvider';
import { useOptionalColorMode } from '@/providers/ColorModeProvider';
import { cx } from '@/styled-system/css';
import {
  FloatingFocusManager,
  FloatingPortal,
  ReferenceType,
  useMergeRefs,
} from '@floating-ui/react';
import { forwardRef } from 'react';
import { Backdrop } from '../../Backdrop/Backdrop';
import type { OverlayContext, OverlaySubComponentProps } from './types';

/**
 * Factory function to create a Content component for overlay patterns.
 *
 * Encapsulates the core structural logic of an overlay:
 * 1. Portal (FloatingPortal) — always rendered to enable AnimatePresence exit animations
 * 2. Backdrop fade (OverlayTransition 'fade') — dims the background with opacity transition
 * 3. Scroll lock (Backdrop/FloatingOverlay)
 * 4. Focus management (FloatingFocusManager)
 * 5. Content animation (OverlayTransition with context's animationType)
 * 6. Theme/Brand data-attribute injection
 * 7. Polymorphism (asChild) support
 *
 * @param useContext - Hook to access the parent overlay's context.
 * @param displayName - Display name for the generated component.
 * @returns A forwardRef-wrapped Content component.
 *
 * ### AI Context & Architecture
 * FloatingPortal is always rendered (no early-return guard) so that
 * the inner OverlayTransition's AnimatePresence can play exit animations when
 * `open` transitions true → false.
 *
 * Two-layer animation strategy:
 * - Outer OverlayTransition ('fade', keepMounted): fades the backdrop in/out.
 *   Uses keepMounted so the outer element stays in the DOM, allowing the inner
 *   AnimatePresence to receive the exit signal correctly.
 *   Duration 0.6s is intentionally longer than any content preset (~0.3–0.5s) so the
 *   backdrop stays visible until the content exit animation completes.
 * - Inner OverlayTransition (context.animationType): drives the dialog enter/exit
 *   (e.g. 'modal' scale-bounce for Modal, 'slide-left' for right Drawer).
 */
export const createOverlayContent = <T extends ReferenceType, TContext extends OverlayContext<T>>(
  useContext: () => TContext,
  displayName: string,
) => {
  const Component = forwardRef<HTMLDivElement, OverlaySubComponentProps<'div'>>((props, ref) => {
    const { children, className, asChild, ...rest } = props;
    const {
      context,
      getFloatingProps,
      refs,
      titleId,
      descriptionId,
      classes: rawClasses,
      open,
      brand: propBrand,
      theme: propTheme,
      animationType = 'modal',
    } = useContext();

    const currentBrand = useOptionalBrand()?.brand;
    const globalTheme = useOptionalColorMode()?.resolvedColorMode;
    const classes = rawClasses as Record<'overlay' | 'content', string>;

    const mergedRef = useMergeRefs([refs.setFloating, ref]);

    return (
      <FloatingPortal>
        {/* Outer: keepMounted fade. DOM is preserved so the inner AnimatePresence receives
            the exit signal. Duration 0.6s > any content animation (~0.3–0.5s) ensures
            the backdrop stays visible until content exit completes. */}
        <OverlayTransition
          isVisible={open}
          animationType="fade"
          keepMounted
          customData={{ duration: 0.6 }}
        >
          <Backdrop className={classes.overlay} lockScroll={open}>
            <FloatingFocusManager context={context}>
              <OverlayTransition
                isVisible={open}
                animationType={animationType}
                asChild={asChild}
                ref={mergedRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
                className={cx(classes.content, className)}
                data-brand={propBrand ?? currentBrand ?? 'blue'}
                data-theme={propTheme ?? globalTheme ?? 'light'}
                data-state={open ? 'open' : 'closed'}
                {...getFloatingProps(rest)}
              >
                {children}
              </OverlayTransition>
            </FloatingFocusManager>
          </Backdrop>
        </OverlayTransition>
      </FloatingPortal>
    );
  });

  Component.displayName = displayName;
  return Component;
};
