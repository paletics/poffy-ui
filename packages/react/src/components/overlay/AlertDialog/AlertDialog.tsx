'use client';

import { useOverlay } from '@/hooks/overlay/useFloating';
import { alertDialog } from '@/styled-system/recipes';
import { FloatingNode, useFloatingNodeId } from '@floating-ui/react';
import { useEffect, useMemo, useRef } from 'react';
import type { OverlayRefs } from '../shared/factories/types';
import { FloatingTreeBoundary } from '../shared/FloatingTreeBoundary';
import { useDialogOpenState } from '../shared/useDialogOpenState';
import { useOverlayAriaParts } from '../shared/useOverlayAriaParts';
import { useWarnUnpairedControlledOpen } from '../shared/useWarnUnpairedControlledOpen';
import { AlertDialogContext } from './AlertDialogContext';
import type { AlertDialogProps } from './AlertDialog.types';
import { AlertDialogContent } from './AlertDialogContent';
import { AlertDialogTrigger } from './AlertDialogTrigger';
import { sanitizeOverlayRootChildren } from '../shared/sanitizeOverlayRootChildren';
import { useOverlayPartOwnership } from '../shared/useOverlayPartOwnership';

const alertDialogPartGroups = [
  { name: 'reference owner', types: new Set([AlertDialogTrigger]) },
  { name: 'content', types: new Set([AlertDialogContent]) },
];

/**
 * Modal confirmation dialog for high-impact actions.
 */
const AlertDialogRoot = ({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  defaultOpen = false,
  children,
  appearance,
  intent,
  size,
  scrollBehavior,
  brand,
  theme,
}: AlertDialogProps) => {
  const sanitizedChildren = useMemo(
    () => sanitizeOverlayRootChildren(children, alertDialogPartGroups),
    [children],
  );
  useEffect(() => {
    for (const group of sanitizedChildren.duplicateGroups) {
      console.warn(
        `[AlertDialog] Only one ${group} can be mounted per root; later parts were ignored.`,
      );
    }
  }, [sanitizedChildren]);
  const isControlled = controlledOpen !== undefined && typeof controlledOnOpenChange === 'function';
  useWarnUnpairedControlledOpen('AlertDialog', controlledOpen, isControlled);
  const { open, onOpenChange } = useDialogOpenState({
    open: isControlled ? controlledOpen : undefined,
    defaultOpen: !isControlled && controlledOpen !== undefined ? controlledOpen : defaultOpen,
    onOpenChange: controlledOnOpenChange as
      | ((open: boolean, ...args: unknown[]) => void)
      | undefined,
  });
  const initialFocusRef = useRef<HTMLElement | null>(null);
  const { registeredTitleId, registeredDescriptionId, registerTitle, registerDescription } =
    useOverlayAriaParts();
  const partOwnership = useOverlayPartOwnership();

  const nodeId = useFloatingNodeId();
  const { refs, context, getReferenceProps, getFloatingProps } = useOverlay<HTMLElement>({
    open,
    onOpenChange,
    role: 'alertdialog',
    outsidePress: false,
    nodeId,
  });

  const classes = useMemo(
    () => alertDialog({ appearance, intent, size, scrollBehavior }),
    [appearance, intent, scrollBehavior, size],
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
      classes,
      brand,
      theme,
      animationType: 'modal' as const,
      role: 'alertdialog' as const,
      initialFocus: initialFocusRef,
      initialFocusRef,
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
      classes,
      brand,
      theme,
      registerTitle,
      registerDescription,
      partOwnership,
    ],
  );

  return (
    <FloatingNode id={nodeId}>
      <AlertDialogContext.Provider value={contextValue}>
        {sanitizedChildren.children}
      </AlertDialogContext.Provider>
    </FloatingNode>
  );
};

/**
 * Provides a modal alert-dialog confirmation flow.
 *
 * It renders no DOM node and configures `role="alertdialog"` with outside
 * press dismissal disabled, so a high-impact decision is not lost
 * accidentally. One trigger and one content part may own a root; later
 * duplicates are ignored. Controlled `open` requires `onOpenChange`; an
 * unpaired value becomes uncontrolled initial state and warns in development.
 */
export const AlertDialog = (props: AlertDialogProps) => (
  <FloatingTreeBoundary>
    <AlertDialogRoot {...props} />
  </FloatingTreeBoundary>
);

AlertDialog.displayName = 'AlertDialog';
