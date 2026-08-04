'use client';

import { forwardRef, isValidElement, type ReactNode, useEffect, useId } from 'react';
import { CollapseTransition } from '@/components/animations';
import { cx } from '@/styled-system/css';
import { useCollapsible } from './CollapsibleContext';
import type { CollapsibleContentProps } from './Collapsible.types';
import { COLLAPSIBLE_CONTENT_MARKER } from './CollapsibleTopology';

const collapsibleAsChildElements = new Set(['article', 'div', 'section']);

const isSafeCollapsibleAsChildHost = (children: ReactNode) =>
  isValidElement(children) &&
  typeof children.type === 'string' &&
  collapsibleAsChildElements.has(children.type);

/**
 * Content region animated with `CollapseTransition`.
 *
 * It renders `role="region"` and labels itself from the owning trigger when
 * the topology is valid. `keepMounted` preserves hidden content as inert;
 * otherwise the region exits and unmounts. `asChild` accepts only article,
 * div, and section hosts.
 */
export const CollapsibleContent = forwardRef<HTMLElement, CollapsibleContentProps>(
  ({ asChild = false, children, className, initial, keepMounted, ...props }, ref) => {
    const {
      open,
      invalidStructure,
      panelId,
      registerContent,
      setContentPresent,
      triggerId,
      classes,
    } = useCollapsible();
    const generatedId = useId();
    const ownId = panelId ?? generatedId;
    useEffect(() => registerContent(ownId), [ownId, registerContent]);
    const present = [open, keepMounted].some(Boolean);
    const isSlotChild = asChild && isSafeCollapsibleAsChildHost(children);

    useEffect(() => {
      setContentPresent(ownId, present);
      return () => setContentPresent(ownId, false);
    }, [ownId, present, setContentPresent]);

    return (
      <CollapseTransition
        ref={ref}
        asChild={isSlotChild}
        animationType="height-fade"
        customData={{ duration: 0.24 }}
        {...props}
        initial={initial}
        id={ownId}
        role="region"
        aria-labelledby={!invalidStructure ? triggerId : undefined}
        isOpen={open && !invalidStructure}
        keepMounted={keepMounted}
        className={cx(classes.content, className)}
      >
        {isSlotChild ? children : <div data-collapsible-content-inner="">{children}</div>}
      </CollapseTransition>
    );
  },
);

CollapsibleContent.displayName = 'CollapsibleContent';
(CollapsibleContent as typeof CollapsibleContent & { [COLLAPSIBLE_CONTENT_MARKER]?: boolean })[
  COLLAPSIBLE_CONTENT_MARKER
] = true;
