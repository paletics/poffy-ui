'use client';

import { Slot } from '@radix-ui/react-slot';
import { AnimatePresence } from 'motion/react';
import { forwardRef, ReactNode, useMemo } from 'react';
import { getMotionComponent } from '../utils';
import { overlayVariants } from './OverlayTransition.presets';
import { OverlayAnimationType, OverlayTransitionProps } from './OverlayTransition.types';

/**
 * A self-contained animation wrapper for overlay elements.
 *
 * Accepts `isVisible` and handles all Framer Motion wiring internally,
 * so consumers never need to touch `AnimatePresence` or motion variants directly.
 *
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Framer Motion (AnimatePresence), Radix Slot
 * ### Design Tokens
 * - transition: Driven by Silver Ratio physics metrics (e.g. `springs.snappy` for Modals).
 *
 * ### Variant Logic
 * - `animationType`: Choose the overlay family that matches the owning component (`modal`, `popover`, `toast`, or directional slide variants).
 * - `keepMounted`: Use `true` for nested overlay transitions or frequently toggled layers that must preserve DOM state.
 *
 * ## Modes
 *
 * ### Default (`keepMounted=false`)
 * Removes the element from the DOM when hidden. AnimatePresence is owned internally —
 * no external setup required.
 * Use for: Modal, Drawer, Puff, ContextMenu.
 *
 * ### Persistent (`keepMounted=true`)
 * Keeps the element in the DOM and toggles between `animate` / `exit` variants.
 * Sets `aria-hidden` and `data-visible` automatically.
 * Use for: Tooltip (pre-rendered for perf), backdrop layers, elements that open/close frequently.
 *
 * ## Nesting constraint
 * Framer Motion does not propagate exit signals through nested `AnimatePresence` instances.
 * **When nesting two `OverlayTransition` elements, the outer one MUST use `keepMounted`.**
 * The outer element stays in the DOM, so the inner AnimatePresence receives the exit signal correctly.
 *
 * ```tsx
 * // ✅ Correct — outer keepMounted, inner AnimatePresence works
 * <OverlayTransition isVisible={open} animationType="fade" keepMounted>
 *   <OverlayTransition isVisible={open} animationType="modal">
 *     ...
 *   </OverlayTransition>
 * </OverlayTransition>
 *
 * // ❌ Wrong — nested AnimatePresence blocks inner exit signal
 * <OverlayTransition isVisible={open} animationType="fade">
 *   <OverlayTransition isVisible={open} animationType="modal">
 *     ...
 *   </OverlayTransition>
 * </OverlayTransition>
 * ```
 *
 * ### Accessibility
 * - Sets `aria-hidden` automatically only in persistent mode when the content is hidden.
 * - The owning overlay component remains responsible for focus management, escape handling, and labels.
 *
 * ### AI Usage
 * - **DO**: Wrap the actual overlay panel, backdrop, toast, tooltip, or menu surface.
 * - **DO**: Set `keepMounted` on an outer `OverlayTransition` when nesting another `OverlayTransition`.
 * - **DON'T**: Use as the source of dialog semantics; pair it with Modal, Drawer, Popover, or another semantic owner.
 *
 * @example Standalone usage
 * ```tsx
 * import { OverlayTransition } from '@poffy-ui/react';
 *
 * <OverlayTransition isVisible={isOpen} animationType="zoom" asChild>
 *   <dialog open={isOpen}>Modal Content</dialog>
 * </OverlayTransition>
 * ```
 */
export const OverlayTransition = forwardRef<HTMLDivElement, OverlayTransitionProps>(
  (
    {
      asChild,
      isVisible,
      animationType = 'fade',
      keepMounted = false,
      customData,
      children,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const Component = useMemo(() => getMotionComponent(asChild ? Slot : 'div'), [asChild]);

    const animationKey = animationType as OverlayAnimationType;
    const variants = overlayVariants[animationKey];
    const transition = useMemo(
      () =>
        typeof variants.transition === 'function'
          ? variants.transition(customData)
          : variants.transition,
      [variants, customData],
    );

    if (keepMounted) {
      // Preserve the DOM node while hidden for consumers that need stable structure or focus ownership.
      return (
        // eslint-disable-next-line react-hooks/static-components -- Component is resolved through the shared motion cache for polymorphic asChild support.
        <Component
          ref={ref}
          className={className}
          style={{ ...style, pointerEvents: isVisible ? style?.pointerEvents : 'none' }}
          data-visible={isVisible}
          initial={false}
          animate={isVisible ? 'animate' : 'exit'}
          variants={variants.variants}
          transition={transition}
          custom={customData}
          aria-hidden={!isVisible}
          {...rest}
        >
          {children as ReactNode}
        </Component>
      );
    }

    // Fully unmount on close so AnimatePresence can own exit animation lifecycle.
    return (
      <AnimatePresence>
        {isVisible && (
          // eslint-disable-next-line react-hooks/static-components -- Component is resolved through the shared motion cache for polymorphic asChild support.
          <Component
            ref={ref}
            className={className}
            style={style}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants.variants}
            transition={transition}
            custom={customData}
            {...rest}
          >
            {children as ReactNode}
          </Component>
        )}
      </AnimatePresence>
    );
  },
);

OverlayTransition.displayName = 'OverlayTransition';
