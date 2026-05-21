'use client';

import { cx } from '@/styled-system/css';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import { ReferenceType } from '@floating-ui/react';
import type { OverlayContext, OverlaySubComponentProps } from './types';

/**
 * Factory function to create a Description component for overlay patterns.
 *
 * Provides a consistent descriptive paragraph for Modals, Drawers, and Popovers.
 * Automatically links to the parent overlay via the `descriptionId` for `aria-describedby` support.
 *
 * @param useContext - Hook to access the parent overlay's context.
 * @param displayName - Display name for the generated component in React DevTools.
 * @returns A forwardRef-wrapped Description component.
 *
 * @example
 * ```tsx
 * export const ModalDescription = createOverlayDescription(useModalContext, 'ModalDescription');
 * ```
 *
 * ### AI Context & Architecture
 * Standardizes auxiliary text accessibility. Enforces link via `descriptionId`
 * (mapping to `aria-describedby`).
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
      const { className, asChild, ...rest } = props;
      const { descriptionId, classes: rawClasses } = useContext();
      const classes = rawClasses as Record<'description', string>;
      const DescriptionElement = asChild ? Slot : 'p';

      return (
        <DescriptionElement
          ref={ref}
          id={descriptionId}
          className={cx(classes.description, className)}
          {...rest}
        />
      );
    },
  );

  Component.displayName = displayName;
  return Component;
};
