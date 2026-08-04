'use client';

import { useOverlay } from '@/hooks/overlay/useFloating';
import { modal } from '@/styled-system/recipes';
import { FloatingNode, useFloatingNodeId } from '@floating-ui/react';
import { useEffect, useMemo } from 'react';
import type { OverlayRefs } from '../shared/factories/types';
import { FloatingTreeBoundary } from '../shared/FloatingTreeBoundary';
import { useDialogOpenState } from '../shared/useDialogOpenState';
import { useOverlayAriaParts } from '../shared/useOverlayAriaParts';
import { useWarnUnpairedControlledOpen } from '../shared/useWarnUnpairedControlledOpen';
import type { ModalProps } from './Modal.types';
import { ModalContext } from './ModalContext';
import { ModalContent } from './ModalContent';
import { ModalTrigger } from './ModalTrigger';
import { sanitizeOverlayRootChildren } from '../shared/sanitizeOverlayRootChildren';
import { useOverlayPartOwnership } from '../shared/useOverlayPartOwnership';

const modalPartGroups = [
  { name: 'reference owner', types: new Set([ModalTrigger]) },
  { name: 'content', types: new Set([ModalContent]) },
];


const ModalRoot = ({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  defaultOpen = false,
  children,
  appearance,
  size,
  scrollBehavior,
  brand,
  theme,
}: ModalProps) => {
  const sanitizedChildren = useMemo(
    () => sanitizeOverlayRootChildren(children, modalPartGroups),
    [children],
  );
  useEffect(() => {
    for (const group of sanitizedChildren.duplicateGroups) {
      console.warn(`[Modal] Only one ${group} can be mounted per root; later parts were ignored.`);
    }
  }, [sanitizedChildren]);
  const hasControlledHandler = typeof controlledOnOpenChange === 'function';
  useWarnUnpairedControlledOpen('Modal', controlledOpen, hasControlledHandler);
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
    () => modal({ appearance, size, scrollBehavior }),
    [appearance, size, scrollBehavior],
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
      animationType: 'modal' as const,
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
      partOwnership,
    ],
  );

  return (
    <FloatingNode id={nodeId}>
      <ModalContext.Provider value={contextValue}>
        {sanitizedChildren.children}
      </ModalContext.Provider>
    </FloatingNode>
  );
};

/**
 * Provides controlled or uncontrolled state and floating-dialog context.
 *
 * The root renders no DOM node. It accepts one trigger/reference owner and
 * one content surface; later duplicates are ignored with a development
 * warning so focus and ARIA ownership remain unambiguous. Controlled `open`
 * requires `onOpenChange`; an unpaired value falls back to uncontrolled
 * initial state. Compose `ModalContent` for the actual dialog surface.
 */
export const Modal = (props: ModalProps) => (
  <FloatingTreeBoundary>
    <ModalRoot {...props} />
  </FloatingTreeBoundary>
);

Modal.displayName = 'Modal';
