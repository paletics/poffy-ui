'use client';

import { useMergeRefs } from '@floating-ui/react';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import type { PopoverTriggerProps } from './Popover.types';
import { usePopoverContext } from './PopoverContext';

/**
 * Trigger element that toggles the popover.
 * By default, renders a `<button>`. Use `asChild` to delegate to a custom trigger.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Radix Slot, `setReference` ref integration
 * - **Props**: PopoverTriggerProps
 *
 * ### Accessibility
 * - **Role**: button by default.
 * - **Keyboard**: Enter / Space activates the trigger; Escape is handled by
 *   the popover interaction layer while open.
 * - **Required**: When using `asChild`, pass a focusable child that preserves
 *   trigger props and refs.
 *
 * ### AI Usage
 * - **DO**: Use visible button text or an `aria-label` for icon-only triggers.
 * - **DON'T**: Wrap a disabled or non-focusable element with `asChild`; use
 *   `PopoverAnchor` for passive positioning anchors.
 *
 * @example Button trigger
 * ```tsx
 * import { Popover, PopoverContent, PopoverTrigger } from '@poffy-ui/react/overlay';
 *
 * <Popover>
 *   <PopoverTrigger>Open details</PopoverTrigger>
 *   <PopoverContent>Details</PopoverContent>
 * </Popover>
 * ```
 *
 * @example Router or custom trigger
 * ```tsx
 * import { Popover, PopoverContent, PopoverTrigger } from '@poffy-ui/react/overlay';
 *
 * <Popover>
 *   <PopoverTrigger asChild>
 *     <button type="button" aria-label="Show filters">Filters</button>
 *   </PopoverTrigger>
 *   <PopoverContent>Filter controls</PopoverContent>
 * </Popover>
 * ```
 */
export const PopoverTrigger = forwardRef<HTMLButtonElement, PopoverTriggerProps>((props, ref) => {
  const { children, asChild = false, ...rest } = props;
  const context = usePopoverContext();

  const mergedRef = useMergeRefs([context.refs.setReference, ref]);
  const Component = asChild ? Slot : 'button';

  return (
    <Component
      ref={mergedRef}
      type={asChild ? undefined : 'button'}
      data-state={context.open ? 'open' : 'closed'}
      {...context.getReferenceProps(rest)}
    >
      {children}
    </Component>
  );
});

PopoverTrigger.displayName = 'PopoverTrigger';
