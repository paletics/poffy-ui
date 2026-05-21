'use client';

import { useOptionalBrand } from '@/providers/BrandProvider';
import { useOptionalColorMode } from '@/providers/ColorModeProvider';
import { useAnchorPosition } from '@/hooks/overlay/useFloating';
import { popover } from '@/styled-system/recipes';
import { useClick, useDismiss, useInteractions, useRole, ReferenceType } from '@floating-ui/react';
import { useCallback, useId, useMemo, useState } from 'react';

import type { PopoverProps } from './Popover.types';
import { PopoverContext } from './PopoverContext';
import type { OverlayRefs } from '../shared/factories/types';

/**
 * A non-modal dialog that pops up when triggered by an element.
 * Supports both controlled and uncontrolled states.
 *
 * ### AI Context & Architecture
 * - **Tier**: Organisms
 * - **Stack**: React Context, Floating UI `useAnchorPosition`
 * - **Props**: PopoverProps
 *
 * ### Component Details
 * Root provider for all Popover sub-components.
 * Uses `useAnchorPosition` for positioning and `@floating-ui/react` for interactions.
 * Provides `titleId` and `descriptionId` for accessibility.
 *
 * ### Variant Logic
 * - `triggerMode="click"`: Use for button-triggered disclosure.
 * - `triggerMode="manual"`: Use when another component owns open state and anchor wiring.
 *
 * ### Accessibility
 * - Use `floatingRole="dialog"` for interactive content and provide `PopoverTitle`.
 * - Keep focusable controls inside `PopoverContent` and enable focus management when needed.
 *
 * ### AI Usage
 * - Do: use Popover for non-modal interactive content anchored to a trigger.
 * - Don't: put required blocking decisions in Popover; use Modal instead.
 *
 * @example
 * ```tsx
 * import {
 *   Popover,
 *   PopoverContent,
 *   PopoverTitle,
 *   PopoverTrigger,
 * } from '@poffy-ui/react/overlay';
 *
 * <Popover placement="top">
 *   <PopoverTrigger>Toggle Popover</PopoverTrigger>
 *   <PopoverContent>
 *     <PopoverTitle>Details</PopoverTitle>
 *     <p>Here are some more details about the item.</p>
 *   </PopoverContent>
 * </Popover>
 * ```
 *
 * @example Manual anchor
 * ```tsx
 * import { Popover, PopoverAnchor, PopoverContent } from '@poffy-ui/react/overlay';
 *
 * <Popover open={open} onOpenChange={setOpen} triggerMode="manual">
 *   <PopoverAnchor>{anchor}</PopoverAnchor>
 *   <PopoverContent>Anchored content</PopoverContent>
 * </Popover>
 * ```
 */
export const Popover = ({
  children,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  placement = 'bottom',
  showArrow = true,
  brand: propBrand,
  theme: propTheme,
  triggerMode = 'click',
  floatingRole = 'dialog',
}: PopoverProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const currentBrand = useOptionalBrand()?.brand;
  const resolvedColorMode = useOptionalColorMode()?.resolvedColorMode;

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;
  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen);
    },
    [setOpen],
  );

  const [arrowElement, setArrowElement] = useState<SVGSVGElement | null>(null);

  const { refs, floatingStyles, context, middlewareData } = useAnchorPosition<ReferenceType>({
    open,
    onOpenChange: handleOpenChange,
    placement,
    offset: 5,
    arrowElement,
  });

  const click = useClick(context, { enabled: triggerMode === 'click' });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: floatingRole });

  const interactions = useInteractions([click, dismiss, role]);

  const titleId = useId();
  const descriptionId = useId();
  const popoverClasses = useMemo(() => popover(), []);

  const contextValue = useMemo(
    () => ({
      open,
      setOpen,
      onOpenChange: handleOpenChange,
      ...interactions,
      refs: refs as OverlayRefs<ReferenceType>,
      floatingStyles,
      context,
      middlewareData,
      arrowRef: { current: arrowElement },
      setArrowElement,
      titleId,
      descriptionId,
      classes: popoverClasses,
      showArrow,
      brand: propBrand ?? currentBrand ?? 'blue',
      theme: propTheme ?? resolvedColorMode ?? 'light',
    }),
    [
      open,
      setOpen,
      handleOpenChange,
      interactions,
      refs,
      floatingStyles,
      context,
      middlewareData,
      arrowElement,
      setArrowElement,
      titleId,
      descriptionId,
      popoverClasses,
      showArrow,
      propBrand,
      currentBrand,
      propTheme,
      resolvedColorMode,
    ],
  );

  return <PopoverContext.Provider value={contextValue}>{children}</PopoverContext.Provider>;
};

Popover.displayName = 'Popover';
