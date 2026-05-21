'use client';

import { OverlayTransition } from '@/components/animations/OverlayTransition/OverlayTransition';
import { useOptionalBrand } from '@/providers/BrandProvider';
import { useOptionalColorMode } from '@/providers/ColorModeProvider';
import { useAnchorPosition } from '@/hooks/overlay/useFloating';
import { cx } from '@/styled-system/css';
import { tooltip } from '@/styled-system/recipes';
import {
  FloatingArrow,
  FloatingPortal,
  useDismiss,
  useFocus,
  useHover,
  useInteractions,
  useMergeRefs,
  useRole,
} from '@floating-ui/react';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef, useCallback, useState } from 'react';
import { TooltipProps } from './Tooltip.types';

/**
 * A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.
 *
 * ### AI Context & Architecture
 * - **Tier**: Organisms
 * - **Stack**: FloatingPortal, OverlayTransition, `useAnchorPosition`
 * - **Props**: TooltipProps
 *
 * ### Component Details
 * Tooltip implementation that integrates both trigger and content management in a single component.
 * It uses `asChild` on the trigger to avoid extra wrapper DOM nodes (like `div`) which can break layouts
 * (e.g., inside Flexbox or Grid). `useAnchorPosition` is leveraged for high-performance positioning.
 *
 * ### Variant Logic
 * - `placement`: Choose the side that keeps the hint near the trigger without covering the task.
 * - `delay`: Keep a short delay for hover so tooltips do not flicker during pointer travel.
 *
 * ### Accessibility
 * - Tooltip content must be supplemental and non-interactive.
 * - The trigger must remain keyboard focusable when the hint matters.
 *
 * ### AI Usage
 * - Do: use Tooltip for short hints and labels.
 * - Don't: place buttons, forms, or required instructions inside Tooltip.
 *
 * @example
 * ```tsx
 * import { Tooltip } from '@poffy-ui/react/overlay';
 *
 * <Tooltip content="Helpful information">
 *   <button>Hover me</button>
 * </Tooltip>
 * ```
 *
 * @example Controlled tooltip
 * ```tsx
 * import { Tooltip } from '@poffy-ui/react/overlay';
 *
 * <Tooltip open={open} onOpenChange={setOpen} content="Copied">
 *   <button type="button">Copy</button>
 * </Tooltip>
 * ```
 */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>((props, ref) => {
  const {
    children,
    content,
    placement = 'top',
    theme: propTheme,
    disabled,
    delay = 200,
    showArrow = true,
    brand: propBrand,
    virtualRef,
    className,
    asChild,
    open: controlledOpen,
    onOpenChange: controlledOnOpenChange,
    ...rest
  } = props;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [arrowEl, setArrowEl] = useState<SVGSVGElement | null>(null);
  const currentBrand = useOptionalBrand()?.brand;
  const resolvedColorMode = useOptionalColorMode()?.resolvedColorMode;

  const isOpen = controlledOpen ?? uncontrolledOpen;
  const onOpenChange = useCallback(
    (nextOpen: boolean) => {
      // Only update internal state when uncontrolled to avoid unnecessary re-renders
      // and prevent internal state pollution if the consumer later removes the `open` prop.
      if (controlledOpen === undefined) setUncontrolledOpen(nextOpen);
      controlledOnOpenChange?.(nextOpen);
    },
    [controlledOpen, controlledOnOpenChange],
  );

  const { refs, floatingStyles, context } = useAnchorPosition({
    open: isOpen,
    onOpenChange: onOpenChange,
    placement,
    arrowElement: showArrow ? arrowEl : null,
    virtualRef,
  });

  const { setReference, setFloating } = refs;

  const hover = useHover(context, {
    move: false,
    delay: { open: delay, close: 0 },
    enabled: !disabled && !virtualRef,
  });
  const focus = useFocus(context, { enabled: !disabled && !virtualRef });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);

  const classes = tooltip({ theme: propTheme });

  const mergedRef = useMergeRefs([virtualRef ? null : setReference, ref]);

  const TriggerComponent = asChild ? Slot : 'div';

  return (
    <>
      {!virtualRef && children && (
        <TriggerComponent ref={mergedRef} {...getReferenceProps(rest)} className={classes.trigger}>
          {children}
        </TriggerComponent>
      )}
      {/* FloatingPortal is always rendered so OverlayTransition's AnimatePresence
          can play exit animations when isOpen transitions true → false. */}
      <FloatingPortal>
        <OverlayTransition
          isVisible={isOpen}
          animationType="fade"
          ref={setFloating}
          // Floating UI computes runtime position styles for the controlled element.
          style={floatingStyles}
          data-brand={propBrand ?? currentBrand ?? 'blue'}
          data-theme={propTheme ?? resolvedColorMode ?? 'light'}
          className={cx(classes.content, className)}
          {...getFloatingProps()}
        >
          {content}
          {showArrow && (
            <FloatingArrow
              ref={setArrowEl}
              context={context}
              className={classes.arrow}
              fill="currentColor"
            />
          )}
        </OverlayTransition>
      </FloatingPortal>
    </>
  );
});

Tooltip.displayName = 'Tooltip';
