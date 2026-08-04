'use client';

import { useOptionalBrand } from '@/providers/BrandProvider';
import { useOptionalColorMode } from '@/providers/ColorModeProvider';
import { useAnchorPosition } from '@/hooks/overlay/useFloating';
import { popover } from '@/styled-system/recipes';
import { useControllableState } from '@poffy-ui/behavior/hooks';
import {
  FloatingNode,
  ReferenceType,
  useClick,
  useDismiss,
  useFloatingNodeId,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import type { PopoverProps } from './Popover.types';
import type { UseRoleProps } from '@floating-ui/react';
import { PopoverContext } from './PopoverContext';
import type { OverlayRefs } from '../shared/factories/types';
import { FloatingTreeBoundary } from '../shared/FloatingTreeBoundary';
import { useOverlayAriaParts } from '../shared/useOverlayAriaParts';
import { useWarnUnpairedControlledOpen } from '../shared/useWarnUnpairedControlledOpen';
import { PopoverAnchor } from './PopoverAnchor';
import { PopoverContent } from './PopoverContent';
import { PopoverTrigger } from './PopoverTrigger';
import { sanitizeOverlayRootChildren } from '../shared/sanitizeOverlayRootChildren';
import { useOverlayPartOwnership } from '../shared/useOverlayPartOwnership';

const popoverPartGroups = [
  { name: 'reference owner', types: new Set([PopoverAnchor, PopoverTrigger]) },
  { name: 'content', types: new Set([PopoverContent]) },
];


type PopoverRolePresetProps = PopoverProps & {
  popupRole: NonNullable<UseRoleProps['role']>;
};

const PopoverRoot = ({
  children,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  placement = 'bottom',
  showArrow = true,
  brand: propBrand,
  theme: propTheme,
  triggerMode = 'click',
  popupRole,
}: PopoverRolePresetProps) => {
  const sanitizedChildren = useMemo(
    () => sanitizeOverlayRootChildren(children, popoverPartGroups),
    [children],
  );
  useEffect(() => {
    for (const group of sanitizedChildren.duplicateGroups) {
      console.warn(
        `[Popover] Only one ${group} can be mounted per root; later parts were ignored.`,
      );
    }
  }, [sanitizedChildren]);
  const resolvedOnOpenChange =
    typeof setControlledOpen === 'function' ? setControlledOpen : undefined;
  const controlsOpen = controlledOpen !== undefined && resolvedOnOpenChange !== undefined;
  useWarnUnpairedControlledOpen('Popover', controlledOpen, controlsOpen);
  const {
    value: open,
    isControlled,
    setValue: setUncontrolledOpen,
  } = useControllableState({
    value: controlsOpen ? controlledOpen : undefined,
    defaultValue: !controlsOpen && controlledOpen !== undefined ? controlledOpen : false,
  });
  const currentBrand = useOptionalBrand()?.brand;
  const resolvedColorMode = useOptionalColorMode()?.resolvedColorMode;

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) setUncontrolledOpen(nextOpen);
      resolvedOnOpenChange?.(nextOpen);
    },
    [isControlled, resolvedOnOpenChange, setUncontrolledOpen],
  );

  const [arrowElement, setArrowElement] = useState<SVGSVGElement | null>(null);

  const nodeId = useFloatingNodeId();
  const { refs, floatingStyles, context, middlewareData } = useAnchorPosition<ReferenceType>({
    open,
    onOpenChange: handleOpenChange,
    placement,
    offset: 5,
    arrowElement,
    nodeId,
  });

  const click = useClick(context, { enabled: triggerMode === 'click' });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: popupRole });

  const interactions = useInteractions([click, dismiss, role]);

  const {
    registeredTitleId,
    registeredDescriptionId,
    registeredContentId,
    registerTitle,
    registerDescription,
    registerContent,
  } = useOverlayAriaParts();
  const partOwnership = useOverlayPartOwnership();
  const popoverClasses = useMemo(() => popover(), []);

  const contextValue = useMemo(
    () => ({
      open,
      setOpen: handleOpenChange,
      onOpenChange: handleOpenChange,
      ...interactions,
      refs: refs as OverlayRefs<ReferenceType>,
      floatingStyles,
      context,
      middlewareData,
      arrowRef: { current: arrowElement },
      setArrowElement,
      registeredTitleId,
      registeredDescriptionId,
      contentId: registeredContentId,
      registerTitle,
      registerDescription,
      registerContentId: registerContent,
      classes: popoverClasses,
      showArrow,
      popupRole,
      brand: propBrand ?? currentBrand ?? 'blue',
      theme: propTheme ?? resolvedColorMode ?? 'light',
      ...partOwnership,
    }),
    [
      open,
      handleOpenChange,
      interactions,
      refs,
      floatingStyles,
      context,
      middlewareData,
      arrowElement,
      setArrowElement,
      registeredTitleId,
      registeredDescriptionId,
      registeredContentId,
      registerTitle,
      registerDescription,
      registerContent,
      popoverClasses,
      showArrow,
      popupRole,
      propBrand,
      currentBrand,
      propTheme,
      resolvedColorMode,
      partOwnership,
    ],
  );

  return (
    <FloatingNode id={nodeId}>
      <PopoverContext.Provider value={contextValue}>
        {sanitizedChildren.children}
      </PopoverContext.Provider>
    </FloatingNode>
  );
};

/**
 * Internal role preset used by semantic wrappers such as ListboxPopover.
 * It is intentionally not exported from the public Popover barrel.
 */
export const PopoverRolePreset = (props: PopoverRolePresetProps) => (
  <FloatingTreeBoundary>
    <PopoverRoot {...props} />
  </FloatingTreeBoundary>
);

/**
 * Provides click- or manually controlled floating Popover state.
 *
 * One trigger/anchor and one content part may own a root; later duplicates are
 * ignored so reference, ARIA, and focus ownership remain unambiguous. Click
 * mode may be controlled or uncontrolled, while manual mode is always
 * controlled. Dismissal still requests `onOpenChange(false)` in manual mode.
 */
export const Popover = (props: PopoverProps) => <PopoverRolePreset {...props} popupRole="dialog" />;

Popover.displayName = 'Popover';
