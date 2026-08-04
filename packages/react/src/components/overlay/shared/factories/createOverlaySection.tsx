'use client';

import { cx } from '@/styled-system/css';
import type { ReferenceType } from '@floating-ui/react';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef, isValidElement } from 'react';
import type {
  OverlayContext,
  OverlayPartComponent,
  OverlaySectionAsChildElement,
  OverlaySubComponentProps,
} from './types';

type OverlaySectionSlot = 'header' | 'body' | 'footer';
const overlaySectionHostNames = new Set([
  'article',
  'aside',
  'div',
  'footer',
  'header',
  'main',
  'section',
]);
const isOverlaySectionHost = (children: unknown): children is OverlaySectionAsChildElement =>
  isValidElement(children) &&
  typeof children.type === 'string' &&
  overlaySectionHostNames.has(children.type);

/**
 * Creates a structural header, body, or footer part backed by an overlay recipe slot.
 *
 * The part renders `div` by default. `asChild` delegates only to listed non-interactive landmark or
 * section hosts; invalid and interactive children fall back to the owned `div` so a section slot
 * cannot accidentally replace its child control.
 */
export const createOverlaySection = <T extends ReferenceType, TContext extends OverlayContext<T>>(
  useContext: () => TContext,
  displayName: string,
  slot: OverlaySectionSlot,
) => {
  const Component = forwardRef<HTMLDivElement, OverlaySubComponentProps<'div'>>((props, ref) => {
    const { className, asChild, children, ...rest } = props;
    const { classes } = useContext();
    const canUseAsChild = Boolean(asChild && isOverlaySectionHost(children));
    const SectionElement = canUseAsChild ? Slot : 'div';

    return (
      <SectionElement ref={ref} className={cx(classes[slot], className)} {...rest}>
        {children}
      </SectionElement>
    );
  });

  Component.displayName = displayName;
  return Component as OverlayPartComponent<
    'div',
    HTMLDivElement,
    object,
    HTMLElement,
    OverlaySectionAsChildElement
  >;
};
