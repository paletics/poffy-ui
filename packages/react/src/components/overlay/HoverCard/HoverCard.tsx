'use client';

import { useOptionalBrand } from '@/providers/BrandProvider';
import { useOptionalColorMode } from '@/providers/ColorModeProvider';
import { useAnchorPosition } from '@/hooks/overlay/useFloating';
import { hoverCard } from '@/styled-system/recipes';
import { useControllableState } from '@poffy-ui/behavior/hooks';
import {
  FloatingNode,
  ReferenceType,
  safePolygon,
  useDismiss,
  useFloatingNodeId,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import { useCallback, useEffect, useId, useMemo, useState } from 'react';
import type { OverlayRefs } from '../shared/factories/types';
import { FloatingTreeBoundary } from '../shared/FloatingTreeBoundary';
import { useOverlayAriaParts } from '../shared/useOverlayAriaParts';
import { HoverCardContext } from './HoverCardContext';
import type { HoverCardProps } from './HoverCard.types';
import { useWarnUnpairedControlledOpen } from '../shared/useWarnUnpairedControlledOpen';
import { HoverCardContent } from './HoverCardContent';
import { HoverCardTrigger } from './HoverCardTrigger';
import { sanitizeOverlayRootChildren } from '../shared/sanitizeOverlayRootChildren';
import { useOverlayPartOwnership } from '../shared/useOverlayPartOwnership';

const hoverCardPartGroups = [
  { name: 'reference owner', types: new Set([HoverCardTrigger]) },
  { name: 'content', types: new Set([HoverCardContent]) },
];

const HoverCardRoot = ({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange: controlledOnOpenChange,
  placement = 'bottom-start',
  showArrow = true,
  openDelay = 300,
  closeDelay = 100,
  disabled,
  appearance,
  size,
  brand: propBrand,
  theme: propTheme,
}: HoverCardProps) => {
  const sanitizedChildren = useMemo(
    () => sanitizeOverlayRootChildren(children, hoverCardPartGroups),
    [children],
  );
  useEffect(() => {
    for (const group of sanitizedChildren.duplicateGroups) {
      console.warn(
        `[HoverCard] Only one ${group} can be mounted per root; later parts were ignored.`,
      );
    }
  }, [sanitizedChildren]);
  const resolvedOnOpenChange =
    typeof controlledOnOpenChange === 'function' ? controlledOnOpenChange : undefined;
  const hasControlledHandler = resolvedOnOpenChange !== undefined;
  const isOpenControlled = controlledOpen !== undefined && hasControlledHandler;
  useWarnUnpairedControlledOpen('HoverCard', controlledOpen, isOpenControlled);
  const {
    value: open,
    isControlled,
    setValue: setUncontrolledOpen,
  } = useControllableState({
    value: isOpenControlled ? controlledOpen : undefined,
    defaultValue: !isOpenControlled && controlledOpen !== undefined ? controlledOpen : defaultOpen,
  });
  const [arrowElement, setArrowElement] = useState<SVGSVGElement | null>(null);
  const { registeredTitleId, registeredDescriptionId, registerTitle, registerDescription } =
    useOverlayAriaParts();
  const partOwnership = useOverlayPartOwnership();
  const currentBrand = useOptionalBrand()?.brand;
  const resolvedColorMode = useOptionalColorMode()?.resolvedColorMode;

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (disabled && nextOpen) return;
      if (!isControlled) setUncontrolledOpen(nextOpen);
      resolvedOnOpenChange?.(nextOpen);
    },
    [disabled, isControlled, resolvedOnOpenChange, setUncontrolledOpen],
  );

  useEffect(() => {
    if (disabled && !isControlled) setUncontrolledOpen(false);
  }, [disabled, isControlled, setUncontrolledOpen]);

  const isOpen = !disabled && open;

  const nodeId = useFloatingNodeId();
  const { refs, floatingStyles, context } = useAnchorPosition<ReferenceType>({
    open: isOpen,
    onOpenChange: handleOpenChange,
    placement,
    arrowElement: showArrow ? arrowElement : null,
    nodeId,
  });

  const hover = useHover(context, {
    enabled: !disabled,
    move: false,
    delay: { open: openDelay, close: closeDelay },
    handleClose: safePolygon(),
  });
  const focus = useFocus(context, { enabled: !disabled });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'dialog' });
  const interactions = useInteractions([hover, focus, dismiss, role]);

  const contentId = useId();
  const classes = useMemo(() => hoverCard({ appearance, size }), [appearance, size]);

  const contextValue = useMemo(
    () => ({
      open: isOpen,
      setOpen: handleOpenChange,
      onOpenChange: handleOpenChange,
      ...interactions,
      refs: refs as OverlayRefs<ReferenceType>,
      floatingStyles,
      context,
      contentId,
      ...partOwnership,
      registeredTitleId,
      registeredDescriptionId,
      registerTitle,
      registerDescription,
      classes,
      showArrow,
      setArrowElement,
      brand: propBrand ?? currentBrand ?? 'blue',
      theme: propTheme ?? resolvedColorMode ?? 'light',
    }),
    [
      isOpen,
      handleOpenChange,
      interactions,
      refs,
      floatingStyles,
      context,
      contentId,
      partOwnership,
      registeredTitleId,
      registeredDescriptionId,
      registerTitle,
      registerDescription,
      classes,
      showArrow,
      propBrand,
      currentBrand,
      propTheme,
      resolvedColorMode,
    ],
  );

  return (
    <FloatingNode id={nodeId}>
      <HoverCardContext.Provider value={contextValue}>
        {sanitizedChildren.children}
      </HoverCardContext.Provider>
    </FloatingNode>
  );
};

/**
 * Provides hover/focus-driven, controlled or uncontrolled card state.
 *
 * Hover opens and closes using the supplied delays, while a safe pointer
 * polygon keeps the card open as the pointer moves from reference to panel.
 * Disabling an uncontrolled card closes it. One trigger and one content part
 * may own a root; later duplicates are ignored. An unpaired controlled value
 * falls back to uncontrolled initial state and warns in development.
 */
export const HoverCard = (props: HoverCardProps) => (
  <FloatingTreeBoundary>
    <HoverCardRoot {...props} />
  </FloatingTreeBoundary>
);

HoverCard.displayName = 'HoverCard';
