'use client';
import { cx } from '@/styled-system/css';
import {
  getFallbackChildrenForNativeContainer,
  isContainerAsChildHost,
} from '@/components/shared/asChild';
import { accordion } from '@/styled-system/recipes';
import { forwardRef, useCallback, useEffect, useMemo, useState, type ElementType } from 'react';
import type { AccordionComponent, AccordionProps } from './Accordion.types';
import { AccordionContext } from './AccordionContext';
import { useAccordionState } from './useAccordionState';
import type { UseAccordionStateProps } from './useAccordionState';
import { Slot } from '@radix-ui/react-slot';
import { getAccordionItemValues } from './AccordionTopology';


const AccordionImpl = forwardRef<Element, AccordionProps>((props, ref) => {
  const {
    children,
    multiple = false,
    value,
    defaultValue,
    onChange,
    className,
    appearance,
    headingLevel = 3,
    asChild,
    ...rest
  } = props;
  const { variant: _unsupportedVariant, ...safeRest } = rest as typeof rest & {
    variant?: unknown;
  };

  const { currentValue, toggle } = useAccordionState({
    multiple,
    value,
    defaultValue,
    onChange,
  } as unknown as UseAccordionStateProps);
  const classes = useMemo(() => accordion({ appearance }), [appearance]);
  const [registeredItems, setRegisteredItems] = useState(() => new Map<string, string>());
  const registerItem = useCallback((instanceId: string, itemValue: string) => {
    setRegisteredItems((current) => new Map(current).set(instanceId, itemValue));
    return () =>
      setRegisteredItems((current) => {
        const next = new Map(current);
        next.delete(instanceId);
        return next;
      });
  }, []);
  const staticTopology = useMemo(() => getAccordionItemValues(children), [children]);
  const ambiguousValues = useMemo(() => {
    const counts = new Map<string, number>();
    staticTopology.values.forEach((itemValue) =>
      counts.set(itemValue, (counts.get(itemValue) ?? 0) + 1),
    );
    const runtimeCounts = new Map<string, number>();
    registeredItems.forEach((itemValue) =>
      runtimeCounts.set(itemValue, (runtimeCounts.get(itemValue) ?? 0) + 1),
    );
    runtimeCounts.forEach((count, itemValue) =>
      counts.set(itemValue, Math.max(counts.get(itemValue) ?? 0, count)),
    );
    return new Set([...counts].flatMap(([itemValue, count]) => (count > 1 ? [itemValue] : [])));
  }, [registeredItems, staticTopology.values]);
  const failClosedAll = staticTopology.hasOpaqueChildren && registeredItems.size === 0;

  useEffect(() => {
    if (ambiguousValues.size === 0) return;
    console.warn(
      `[Accordion] item values must be unique. Ambiguous values were disabled: ${[
        ...ambiguousValues,
      ].join(', ')}`,
    );
  }, [ambiguousValues]);

  const contextValue = useMemo(
    () => ({
      value: currentValue,
      toggle,
      multiple,
      classes,
      headingLevel,
      ambiguousValues,
      failClosedAll,
      registerItem,
    }),
    [
      currentValue,
      toggle,
      multiple,
      classes,
      headingLevel,
      ambiguousValues,
      failClosedAll,
      registerItem,
    ],
  );

  const canUseAsChild = Boolean(asChild && isContainerAsChildHost(children));
  const Component = (canUseAsChild ? Slot : 'div') as ElementType;

  return (
    <AccordionContext.Provider value={contextValue}>
      <Component ref={ref} className={cx(classes.root, className)} {...safeRest}>
        {asChild && !canUseAsChild ? getFallbackChildrenForNativeContainer(children) : children}
      </Component>
    </AccordionContext.Provider>
  );
});

AccordionImpl.displayName = 'Accordion';

/**
 * Coordinates controlled or uncontrolled single- and multi-open disclosure items.
 *
 * `multiple` determines whether one or several values can be open. Item values
 * must be unique: duplicates warn in development and those items are disabled
 * to avoid ambiguous ARIA relationships. Opaque children initially fail closed
 * until their items register. Use `Accordion.Item`, `Trigger`, and `Content`
 * as one compound unit; this root supplies state but not item layout.
 */

export const Accordion = AccordionImpl as AccordionComponent;
