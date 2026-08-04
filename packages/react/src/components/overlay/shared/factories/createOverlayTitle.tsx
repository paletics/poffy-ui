'use client';

import { cx } from '@/styled-system/css';
import { Slot } from '@radix-ui/react-slot';
import { cloneElement, forwardRef, isValidElement, useId, useLayoutEffect } from 'react';
import { ReferenceType } from '@floating-ui/react';
import type {
  OverlayContext,
  OverlayPartComponent,
  OverlaySubComponentProps,
  OverlayTextAsChildElement,
} from './types';

const overlayTextHostNames = new Set(['div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span']);

const isOverlayTextHost = (children: unknown): children is OverlayTextAsChildElement =>
  isValidElement(children) &&
  typeof children.type === 'string' &&
  overlayTextHostNames.has(children.type);

/**
 * Creates a title part that registers its resolved ID with the owning overlay.
 *
 * The generated part uses the requested `h2` or `h3` host by default, or slots a safe textual host
 * with `asChild`. Its generated ID becomes the content `aria-labelledby` value unless the consumer
 * supplies an explicit label or labelled-by override.
 *
 * @param useContext - Returns the owning overlay context, including the title-ID registrar.
 * @param displayName - DevTools name assigned to the generated component.
 * @param element - Default semantic heading level for the overlay pattern.
 * @returns A ref-forwarding title component for the overlay's public API.
 *
 * @example
 * ```tsx
 * export const ModalTitle = createOverlayTitle(useModalContext, 'ModalTitle', 'h2');
 * ```
 */
export const createOverlayTitle = <
  T extends ReferenceType,
  TContext extends OverlayContext<T>,
  TElement extends 'h2' | 'h3',
>(
  useContext: () => TContext,
  displayName: string,
  element: TElement,
) => {
  const Component = forwardRef<HTMLHeadingElement, OverlaySubComponentProps<'h2'>>((props, ref) => {
    const { className, asChild, children, id: idProp, ...rest } = props;
    const { classes: rawClasses, registerTitle } = useContext();
    const classes = rawClasses as Record<'title', string>;
    const canUseAsChild = Boolean(asChild && isOverlayTextHost(children));
    const TitleElement = canUseAsChild ? Slot : element;
    const generatedId = useId();
    const resolvedId = idProp ?? generatedId;
    const renderedChildren =
      canUseAsChild && isValidElement<{ id?: string }>(children)
        ? cloneElement(children, { id: resolvedId })
        : children;

    useLayoutEffect(() => registerTitle(resolvedId), [registerTitle, resolvedId]);

    return (
      <TitleElement {...rest} ref={ref} id={resolvedId} className={cx(classes.title, className)}>
        {renderedChildren}
      </TitleElement>
    );
  });

  Component.displayName = displayName;
  return Component as unknown as OverlayPartComponent<
    TElement,
    HTMLHeadingElement,
    object,
    HTMLElement,
    OverlayTextAsChildElement
  >;
};
