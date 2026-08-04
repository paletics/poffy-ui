'use client';

import { cx } from '@/styled-system/css';
import {
  getFallbackChildrenForNativeContainer,
  isContainerAsChildHost,
} from '@/components/shared/asChild';
import { Slot } from '@radix-ui/react-slot';
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
  type Dispatch,
  type ElementType,
  type SetStateAction,
} from 'react';
import type { AccordionItemComponent, AccordionItemProps } from './Accordion.types';
import { useAccordion } from './AccordionContext';
import { AccordionItemContext } from './AccordionItemContext';
import { ACCORDION_ITEM_MARKER, getAccordionPartCounts } from './AccordionTopology';


const AccordionItemImpl = forwardRef<Element, AccordionItemProps>(
  ({ children, value, disabled, className, asChild, ...rest }, ref) => {
    const { ambiguousValues, classes, failClosedAll, registerItem } = useAccordion();
    const contentId = useId();
    const instanceId = useId();
    useEffect(() => registerItem(instanceId, value), [instanceId, registerItem, value]);
    const [triggerIds, setTriggerIds] = useState<string[]>([]);
    const [contentIds, setContentIds] = useState<string[]>([]);
    const registerPart = useCallback(
      (setter: Dispatch<SetStateAction<string[]>>, partId: string) => {
        setter((current) => (current.includes(partId) ? current : [...current, partId]));
        return () => setter((current) => current.filter((id) => id !== partId));
      },
      [],
    );
    const registerTrigger = useCallback(
      (partId: string) => registerPart(setTriggerIds, partId),
      [registerPart],
    );
    const registerContent = useCallback(
      (partId: string) => registerPart(setContentIds, partId),
      [registerPart],
    );
    const staticParts = useMemo(() => getAccordionPartCounts(children), [children]);
    const invalidStructure = [
      !staticParts.hasOpaqueChildren && (staticParts.triggers !== 1 || staticParts.contents !== 1),
      triggerIds.length > 1,
      contentIds.length > 1,
    ].some(Boolean);
    const hasStaticPair =
      !staticParts.hasOpaqueChildren && staticParts.triggers === 1 && staticParts.contents === 1;
    const hasPair = triggerIds.length === 1 && contentIds.length === 1 && !invalidStructure;
    const effectiveDisabled = Boolean(disabled || failClosedAll || ambiguousValues.has(value));

    const canUseAsChild = Boolean(asChild && isContainerAsChildHost(children));
    const Component = (canUseAsChild ? Slot : 'div') as ElementType;

    return (
      <AccordionItemContext.Provider
        value={{
          value,
          contentId,
          disabled: effectiveDisabled,
          triggerId: hasPair
            ? triggerIds[0]
            : hasStaticPair
              ? `${contentId}-trigger`
              : undefined,
          panelId: hasPair ? contentIds[0] : hasStaticPair ? `${contentId}-content` : undefined,
          invalidStructure,
          registerTrigger,
          registerContent,
        }}
      >
        <Component ref={ref} className={cx(classes.item, className)} {...rest}>
          {asChild && !canUseAsChild ? getFallbackChildrenForNativeContainer(children) : children}
        </Component>
      </AccordionItemContext.Provider>
    );
  },
);

AccordionItemImpl.displayName = 'AccordionItem';

/**
 * Defines one value-addressable Accordion disclosure item.
 *
 * It registers its `value` with the owning root. Duplicate values, disabled
 * items, and an invalid trigger/content topology disable activation. A valid
 * item must contain exactly one `Accordion.Trigger` and one
 * `Accordion.Content`; otherwise the ARIA IDs are deliberately withheld.
 */

export const AccordionItem = AccordionItemImpl as AccordionItemComponent;
(AccordionItem as typeof AccordionItem & { [ACCORDION_ITEM_MARKER]?: boolean })[
  ACCORDION_ITEM_MARKER
] = true;
