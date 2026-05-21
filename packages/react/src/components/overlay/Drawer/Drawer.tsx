'use client';

import type { OverlayAnimationType } from '@/components/animations/OverlayTransition/OverlayTransition.types';
import { useOverlay } from '@/hooks/overlay/useFloating';
import { drawer, type DrawerVariantProps } from '@/styled-system/recipes';
import { useId, useMemo, useState } from 'react';
import type { OverlayRefs } from '../shared/factories/types';
import type { DrawerProps } from './Drawer.types';
import { DrawerContext } from './DrawerContext';

type DrawerPlacement = NonNullable<DrawerVariantProps['placement']>;

const PLACEMENT_ANIMATION: Record<DrawerPlacement, OverlayAnimationType> = {
  left: 'slide-right',
  right: 'slide-left',
  top: 'slide-down',
  bottom: 'slide-up',
};

/**
 * A slide-out panel that appears from the edge of the screen.
 * Supports both controlled and uncontrolled states.
 *
 * ### AI Context & Architecture
 * - **Tier**: Organisms
 * - **Stack**: React Context, Floating UI (`useFloating`)
 * - **Props**: DrawerProps
 *
 * ### Design Tokens
 * - **spacing**: panel padding and section gaps are owned by the `drawer` recipe.
 * - **motion**: placement maps to slide direction through `PLACEMENT_ANIMATION`.
 *
 * ### Variant Logic
 * - `placement="right"`: Default for settings and task panels in LTR layouts.
 * - `placement="bottom"`: Prefer for mobile sheets and short action panels.
 *
 * ### Accessibility
 * - Include `DrawerTitle` inside `DrawerContent` so the generated `aria-labelledby` target exists.
 * - Include `DrawerClose` or an equivalent close action.
 *
 * ### AI Usage
 * - Do: use Drawer for side sheets and persistent task panels.
 * - Don't: use Drawer for tooltip-like disclosure or generic menus.
 *
 * @example
 * ```tsx
 * import {
 *   Drawer,
 *   DrawerBody,
 *   DrawerClose,
 *   DrawerContent,
 *   DrawerHeader,
 *   DrawerTitle,
 * } from '@poffy-ui/react/overlay';
 *
 * <Drawer placement="right">
 *   <DrawerContent>
 *     <DrawerHeader>
 *       <DrawerTitle>Settings</DrawerTitle>
 *       <DrawerClose />
 *     </DrawerHeader>
 *     <DrawerBody>...</DrawerBody>
 *   </DrawerContent>
 * </Drawer>
 * ```
 *
 * ### Component Details
 * - Root provider for all Drawer sub-components. Renders no DOM node itself —
 *   only a React Context provider. DOM ref access is intentionally not supported
 *   at this level; use DrawerContent's ref instead.
 * - Manages accessibility IDs (`titleId`, `descriptionId`) and Floating UI state.
 * - Leverages Panda CSS `drawer` recipe for layout and positioning.
 *
 * @example Controlled state
 * ```tsx
 * import { Drawer, DrawerContent, DrawerTitle } from '@poffy-ui/react/overlay';
 *
 * <Drawer open={open} onOpenChange={setOpen} placement="left">
 *   <DrawerContent>
 *     <DrawerTitle>Filters</DrawerTitle>
 *   </DrawerContent>
 * </Drawer>
 * ```
 */
export const Drawer = ({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  defaultOpen = false,
  children,
  appearance,
  placement = 'right',
  size,
  brand,
  theme,
}: DrawerProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  const open = controlledOpen ?? internalOpen;
  const onOpenChange = controlledOnOpenChange ?? setInternalOpen;

  const { refs, context, getReferenceProps, getFloatingProps } = useOverlay<HTMLElement>({
    open,
    onOpenChange,
  });

  const titleId = useId();
  const descriptionId = useId();
  const rawClasses = useMemo(
    () => drawer({ appearance, placement, size }),
    [appearance, placement, size],
  );

  const contextValue = useMemo(
    () => ({
      open,
      onOpenChange,
      refs: refs as OverlayRefs<HTMLElement>,
      context,
      getReferenceProps,
      getFloatingProps,
      titleId,
      descriptionId,
      classes: rawClasses,
      brand,
      theme,
      animationType: PLACEMENT_ANIMATION[placement],
    }),
    [
      open,
      onOpenChange,
      refs,
      context,
      getReferenceProps,
      getFloatingProps,
      titleId,
      descriptionId,
      rawClasses,
      brand,
      theme,
      placement,
    ],
  );

  return <DrawerContext.Provider value={contextValue}>{children}</DrawerContext.Provider>;
};

Drawer.displayName = 'Drawer';
