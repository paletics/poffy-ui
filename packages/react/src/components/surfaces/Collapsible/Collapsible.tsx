'use client';

import { Slot } from '@radix-ui/react-slot';
import { useCollapsibleState } from '@poffy-ui/behavior';
import type { UseCollapsibleStateProps } from '@poffy-ui/behavior';
import {
  getFallbackChildrenForNativeContainer,
  isContainerAsChildHost,
} from '@/components/shared/asChild';
import { forwardRef, useCallback, useId, useMemo, useState, type ElementType } from 'react';
import { cx } from '@/styled-system/css';
import { collapsible } from '@/styled-system/recipes';
import { CollapsibleContext } from './CollapsibleContext';
import type { CollapsibleComponent, CollapsibleProps } from './Collapsible.types';
import { getCollapsiblePartCounts } from './CollapsibleTopology';


const CollapsibleImpl = forwardRef<Element, CollapsibleProps>(
  (
    {
      asChild,
      appearance,
      open,
      defaultOpen = false,
      onOpenChange,
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const [presentContentIds, setPresentContentIds] = useState(() => new Set<string>());
    const contentPresent = presentContentIds.size > 0;
    const setContentPresent = useCallback((partId: string, present: boolean) => {
      setPresentContentIds((current) => {
        const next = new Set(current);
        if (present) next.add(partId);
        else next.delete(partId);
        return next;
      });
    }, []);
    const [triggerIds, setTriggerIds] = useState<string[]>([]);
    const [contentIds, setContentIds] = useState<string[]>([]);
    const registerTrigger = useCallback((partId: string) => {
      setTriggerIds((current) => (current.includes(partId) ? current : [...current, partId]));
      return () => setTriggerIds((current) => current.filter((id) => id !== partId));
    }, []);
    const registerContent = useCallback((partId: string) => {
      setContentIds((current) => (current.includes(partId) ? current : [...current, partId]));
      return () => setContentIds((current) => current.filter((id) => id !== partId));
    }, []);
    const { open: isOpen, toggle } = useCollapsibleState({
      open,
      defaultOpen,
      disabled,
      onOpenChange,
    } as unknown as UseCollapsibleStateProps);
    const classes = useMemo(() => collapsible({ appearance }), [appearance]);
    const staticParts = useMemo(() => getCollapsiblePartCounts(children), [children]);
    const invalidStructure = [
      !staticParts.hasOpaqueChildren && (staticParts.triggers !== 1 || staticParts.contents !== 1),
      triggerIds.length > 1,
      contentIds.length > 1,
    ].some(Boolean);
    const hasStaticPair =
      !staticParts.hasOpaqueChildren && staticParts.triggers === 1 && staticParts.contents === 1;
    const hasPair = triggerIds.length === 1 && contentIds.length === 1 && !invalidStructure;
    const canUseAsChild = Boolean(asChild && isContainerAsChildHost(children));
    const Component = (canUseAsChild ? Slot : 'div') as ElementType;

    const contextValue = useMemo(
      () => ({
        open: isOpen,
        disabled,
        contentId: generatedId,
        contentPresent,
        setContentPresent,
        triggerId: hasPair
          ? triggerIds[0]
          : hasStaticPair
            ? `${generatedId}-trigger`
            : undefined,
        panelId: hasPair
          ? contentIds[0]
          : hasStaticPair
            ? `${generatedId}-content`
            : undefined,
        invalidStructure,
        registerTrigger,
        registerContent,
        toggle,
        classes,
      }),
      [
        classes,
        contentPresent,
        disabled,
        generatedId,
        hasPair,
        hasStaticPair,
        contentIds,
        invalidStructure,
        isOpen,
        registerContent,
        registerTrigger,
        toggle,
        triggerIds,
      ],
    );

    return (
      <CollapsibleContext.Provider value={contextValue}>
        <Component
          ref={ref}
          className={cx(classes.root, className)}
          {...props}
          data-state={isOpen ? 'open' : 'closed'}
          data-disabled={disabled ? '' : undefined}
        >
          {asChild && !canUseAsChild ? getFallbackChildrenForNativeContainer(children) : children}
        </Component>
      </CollapsibleContext.Provider>
    );
  },
);

CollapsibleImpl.displayName = 'Collapsible';

/**
 * Coordinates one trigger and one collapsible content region.
 *
 * It supports controlled `open` and uncontrolled `defaultOpen` state. The
 * required one-trigger/one-content topology is verified at runtime; an invalid
 * structure disables trigger activation and withholds the ARIA relationship.
 * The root exposes `data-state` and `data-disabled`, but content animation is
 * performed by `Collapsible.Content`.
 */

export const Collapsible = CollapsibleImpl as CollapsibleComponent;
