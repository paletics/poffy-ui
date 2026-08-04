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
 * Creates a description part that registers its resolved ID with the owning overlay.
 *
 * The generated part renders a paragraph by default, or slots a safe textual host with `asChild`.
 * Its generated ID is used by content as `aria-describedby` unless the consumer supplies an
 * explicit override.
 *
 * @param useContext - Returns the owning overlay context, including the description-ID registrar.
 * @param displayName - DevTools name assigned to the generated component.
 * @returns A ref-forwarding description component for the overlay's public API.
 *
 * @example
 * ```tsx
 * export const ModalDescription = createOverlayDescription(useModalContext, 'ModalDescription');
 * ```
 */
export const createOverlayDescription = <
  T extends ReferenceType,
  TContext extends OverlayContext<T>,
>(
  useContext: () => TContext,
  displayName: string,
) => {
  const Component = forwardRef<HTMLParagraphElement, OverlaySubComponentProps<'p'>>(
    (props, ref) => {
      const { className, asChild, children, id: idProp, ...rest } = props;
      const { classes: rawClasses, registerDescription } = useContext();
      const classes = rawClasses as Record<'description', string>;
      const canUseAsChild = Boolean(asChild && isOverlayTextHost(children));
      const DescriptionElement = canUseAsChild ? Slot : 'p';
      const generatedId = useId();
      const resolvedId = idProp ?? generatedId;
      const renderedChildren =
        canUseAsChild && isValidElement<{ id?: string }>(children)
          ? cloneElement(children, { id: resolvedId })
          : children;

      useLayoutEffect(() => registerDescription(resolvedId), [registerDescription, resolvedId]);

      return (
        <DescriptionElement
          {...rest}
          ref={ref}
          id={resolvedId}
          className={cx(classes.description, className)}
        >
          {renderedChildren}
        </DescriptionElement>
      );
    },
  );

  Component.displayName = displayName;
  return Component as OverlayPartComponent<
    'p',
    HTMLParagraphElement,
    object,
    HTMLElement,
    OverlayTextAsChildElement
  >;
};
