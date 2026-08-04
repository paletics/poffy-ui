'use client';

import { cx } from '@/styled-system/css';
import { buttonGroup } from '@/styled-system/recipes';
import { getFallbackChildrenForNativeContainer } from '@/components/shared/asChild';
import { type ElementType, forwardRef, isValidElement, useMemo } from 'react';
import { Slot } from '@radix-ui/react-slot';
import type { ButtonGroupComponent, ButtonGroupProps } from './ButtonGroup.types';
import { ButtonGroupContext } from './ButtonGroupContext';
import { ActionMotion } from '@/components/animations';

const buttonGroupHostNames = new Set(['article', 'div', 'section']);

const ButtonGroupRootImpl = forwardRef<HTMLElement, ButtonGroupProps>(
  (
    {
      children,
      animationType = 'stagger',
      orientation = 'horizontal',
      spacing = 'md',
      connected = false,
      fullWidth = false,
      wrap = false,
      className,
      asChild,
      ...props
    },
    ref,
  ) => {
    const effectiveWrap = wrap && orientation === 'horizontal' && !connected;
    const classes = buttonGroup({
      orientation,
      spacing: connected ? 'none' : spacing,
      connected,
      fullWidth,
      wrap: effectiveWrap,
    });
    const canUseAsChild = Boolean(
      asChild &&
      isValidElement(children) &&
      typeof children.type === 'string' &&
      buttonGroupHostNames.has(children.type),
    );
    const Component = (canUseAsChild ? Slot : 'div') as ElementType;
    const renderedChildren =
      asChild && !canUseAsChild ? getFallbackChildrenForNativeContainer(children) : children;

    const contextValue = useMemo(
      () => ({ orientation, spacing, connected, fullWidth }),
      [orientation, spacing, connected, fullWidth],
    );

    return (
      <ButtonGroupContext.Provider value={contextValue}>
        <ActionMotion asChild animationType={animationType} customData={{ staggerChildren: 0.05 }}>
          <Component
            ref={ref}
            className={cx(classes.root, className)}
            {...props}
            role="group"
            data-orientation={orientation}
            data-wrap={effectiveWrap ? '' : undefined}
          >
            {renderedChildren}
          </Component>
        </ActionMotion>
      </ButtonGroupContext.Provider>
    );
  },
);

ButtonGroupRootImpl.displayName = 'ButtonGroup.Root';
/**
 * Groups related actions in a labelled `role="group"` region.
 *
 * Provide `aria-label` or `aria-labelledby` when the surrounding context does not name the
 * group. `connected` removes inter-button spacing, so `wrap` is effective only for unconnected
 * horizontal groups. `asChild` accepts only an `article`, `div`, or `section`; other children
 * render inside the default `<div>`.
 */
export const ButtonGroupRoot = ButtonGroupRootImpl as ButtonGroupComponent;
