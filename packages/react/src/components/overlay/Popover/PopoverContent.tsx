'use client';

import { OverlayTransition } from '@/components/animations/OverlayTransition/OverlayTransition';
import { cx } from '@/styled-system/css';
import {
  FloatingArrow,
  FloatingFocusManager,
  FloatingPortal,
  useMergeRefs,
} from '@floating-ui/react';
import { forwardRef } from 'react';
import type { PopoverContentProps } from './Popover.types';
import { usePopoverContext } from './PopoverContext';

/**
 * The content container for the Popover.
 * Handles portals, focus management, and accessibility attributes.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: FloatingPortal, FloatingFocusManager, OverlayTransition
 * - **Props**: PopoverContentProps
 *
 * ### Component Details
 * FloatingPortal is always rendered (no early-return guard) so that
 * OverlayTransition's internal AnimatePresence can play exit animations when
 * `open` transitions true → false. This mirrors the ContextMenu pattern.
 *
 * The 'popover' animation preset (scale + y-offset) is applied via OverlayTransition.
 * floatingStyles from Floating UI are passed directly to OverlayTransition so the
 * anchor positioning and motion transforms are applied on the same element.
 *
 * When asChild=true, FloatingArrow is not rendered (consumer controls content structure).
 */
export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>((props, ref) => {
  const { className, children, asChild, focusManagement = false, ...rest } = props;
  const {
    context,
    floatingStyles,
    getFloatingProps,
    open,
    refs,
    setArrowElement,
    classes: rawClasses,
    showArrow,
    brand,
    theme,
    titleId,
    descriptionId,
  } = usePopoverContext();
  const classes = rawClasses as Record<'content' | 'arrow', string>;
  const mergedRef = useMergeRefs([refs.setFloating, ref]);

  const contentNode = (
    <OverlayTransition
      isVisible={open}
      animationType="popover"
      asChild={asChild}
      ref={mergedRef}
      // Floating UI computes runtime position styles for the controlled element.
      style={floatingStyles}
      role="dialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className={cx(classes.content, className)}
      data-brand={brand}
      data-theme={theme}
      data-state={open ? 'open' : 'closed'}
      {...getFloatingProps(rest)}
    >
      {asChild ? (
        children
      ) : (
        <>
          {showArrow && (
            <FloatingArrow
              ref={setArrowElement}
              context={context}
              className={classes.arrow}
              width={18}
              height={9}
              tipRadius={2}
              strokeWidth={1}
            />
          )}
          {children}
        </>
      )}
    </OverlayTransition>
  );

  return (
    <FloatingPortal>
      {focusManagement ? (
        <FloatingFocusManager context={context} modal={false}>
          {contentNode}
        </FloatingFocusManager>
      ) : (
        contentNode
      )}
    </FloatingPortal>
  );
});

PopoverContent.displayName = 'PopoverContent';
