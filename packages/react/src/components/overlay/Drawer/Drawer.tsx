'use client';

import type { OverlayAnimationType } from '@/components/animations/OverlayTransition/OverlayTransition.types';
import { useOverlay } from '@/hooks/overlay/useFloating';
import { useOptionalDirection } from '@/providers/DirectionProvider';
import type { PoffyDirection } from '@/providers/DirectionProvider.types';
import { drawer } from '@/styled-system/recipes';
import { FloatingNode, useFloatingNodeId } from '@floating-ui/react';
import { useEffect, useMemo } from 'react';
import type { OverlayRefs } from '../shared/factories/types';
import { FloatingTreeBoundary } from '../shared/FloatingTreeBoundary';
import { useDialogOpenState } from '../shared/useDialogOpenState';
import { useOverlayAriaParts } from '../shared/useOverlayAriaParts';
import { useWarnUnpairedControlledOpen } from '../shared/useWarnUnpairedControlledOpen';
import type { DrawerProps } from './Drawer.types';
import { DrawerContext } from './DrawerContext';
import { DrawerContent } from './DrawerContent';
import { DrawerTrigger } from './DrawerTrigger';
import { sanitizeOverlayRootChildren } from '../shared/sanitizeOverlayRootChildren';
import { useOverlayPartOwnership } from '../shared/useOverlayPartOwnership';

const drawerPartGroups = [
  { name: 'reference owner', types: new Set([DrawerTrigger]) },
  { name: 'content', types: new Set([DrawerContent]) },
];

type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom' | 'start' | 'end';
type DrawerPhysicalPlacement = Exclude<DrawerPlacement, 'start' | 'end'>;

const PLACEMENT_ANIMATION: Record<DrawerPhysicalPlacement, OverlayAnimationType> = {
  left: 'slide-right',
  right: 'slide-left',
  top: 'slide-down',
  bottom: 'slide-up',
};

const resolvePhysicalPlacement = (
  placement: DrawerPlacement,
  direction: PoffyDirection,
): DrawerPhysicalPlacement => {
  if (placement === 'start') return direction === 'rtl' ? 'right' : 'left';
  if (placement === 'end') return direction === 'rtl' ? 'left' : 'right';
  return placement;
};


const DrawerRoot = ({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  defaultOpen = false,
  children,
  appearance,
  placement = 'right',
  size,
  brand,
  theme,
  dir,
}: DrawerProps) => {
  const sanitizedChildren = useMemo(
    () => sanitizeOverlayRootChildren(children, drawerPartGroups),
    [children],
  );
  useEffect(() => {
    for (const group of sanitizedChildren.duplicateGroups) {
      console.warn(`[Drawer] Only one ${group} can be mounted per root; later parts were ignored.`);
    }
  }, [sanitizedChildren]);
  const hasControlledHandler = typeof controlledOnOpenChange === 'function';
  useWarnUnpairedControlledOpen('Drawer', controlledOpen, hasControlledHandler);
  const directionContext = useOptionalDirection();
  const direction = dir ?? directionContext?.dir ?? 'ltr';
  const physicalPlacement = resolvePhysicalPlacement(placement as DrawerPlacement, direction);
  const { open, onOpenChange } = useDialogOpenState({
    open: hasControlledHandler ? controlledOpen : undefined,
    defaultOpen:
      !hasControlledHandler && controlledOpen !== undefined ? controlledOpen : defaultOpen,
    onOpenChange: controlledOnOpenChange as
      | ((open: boolean, ...args: unknown[]) => void)
      | undefined,
  });
  const { registeredTitleId, registeredDescriptionId, registerTitle, registerDescription } =
    useOverlayAriaParts();
  const partOwnership = useOverlayPartOwnership();

  const nodeId = useFloatingNodeId();
  const { refs, context, getReferenceProps, getFloatingProps } = useOverlay<HTMLElement>({
    open,
    onOpenChange,
    nodeId,
  });

  const rawClasses = useMemo(
    () => drawer({ appearance, placement: physicalPlacement, size }),
    [appearance, physicalPlacement, size],
  );

  const contextValue = useMemo(
    () => ({
      open,
      onOpenChange,
      refs: refs as OverlayRefs<HTMLElement>,
      context,
      getReferenceProps,
      getFloatingProps,
      registeredTitleId,
      registeredDescriptionId,
      registerTitle,
      registerDescription,
      classes: rawClasses,
      brand,
      theme,
      animationType: PLACEMENT_ANIMATION[physicalPlacement],
      ...partOwnership,
    }),
    [
      open,
      onOpenChange,
      refs,
      context,
      getReferenceProps,
      getFloatingProps,
      registeredTitleId,
      registeredDescriptionId,
      registerTitle,
      registerDescription,
      rawClasses,
      brand,
      theme,
      physicalPlacement,
      partOwnership,
    ],
  );

  return (
    <FloatingNode id={nodeId}>
      <DrawerContext.Provider value={contextValue}>
        {sanitizedChildren.children}
      </DrawerContext.Provider>
    </FloatingNode>
  );
};

/**
 * Provides a modal side or edge panel’s state and floating-dialog context.
 *
 * It renders no DOM node. One trigger and one content part may own a root;
 * later duplicates are ignored with a development warning. Logical `start`
 * and `end` placements resolve from `dir`, then DirectionProvider, then LTR,
 * and select the matching physical slide animation. Controlled `open` requires
 * `onOpenChange`; otherwise the supplied value becomes uncontrolled initial state.
 */
export const Drawer = (props: DrawerProps) => (
  <FloatingTreeBoundary>
    <DrawerRoot {...props} />
  </FloatingTreeBoundary>
);

Drawer.displayName = 'Drawer';
