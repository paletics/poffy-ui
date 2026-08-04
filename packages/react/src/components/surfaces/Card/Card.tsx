'use client';

import { cx } from '@/styled-system/css';
import { card } from '@/styled-system/recipes';
import {
  getFallbackChildrenForNativeContainer,
  isContainerAsChildHost,
} from '@/components/shared/asChild';
import { forwardRef, useMemo, type ElementType } from 'react';
import type { CardComponent, CardProps } from './Card.types';
import { CardContext } from './CardContext';
import { Slot } from '@radix-ui/react-slot';


const CardImpl = forwardRef<Element, CardProps>(
  ({ children, className, appearance, intent, shape, asChild, ...rest }, ref) => {
    const { variant: _unsupportedVariant, ...safeRest } = rest as typeof rest & {
      variant?: unknown;
    };
    const canUseAsChild = Boolean(asChild && isContainerAsChildHost(children));
    const Component = (canUseAsChild ? Slot : 'div') as ElementType;

    const contextValue = useMemo(
      () => ({
        classes: card({
          appearance,
          intent,
          shape,
        }),
      }),
      [appearance, intent, shape],
    );

    return (
      <CardContext.Provider value={contextValue}>
        <Component ref={ref} className={cx(contextValue.classes.root, className)} {...safeRest}>
          {asChild && !canUseAsChild ? getFallbackChildrenForNativeContainer(children) : children}
        </Component>
      </CardContext.Provider>
    );
  },
);

CardImpl.displayName = 'Card';

/**
 * Groups related content in a visual surface without imposing internal layout.
 *
 * It renders a `div` by default and shares its selected appearance, intent,
 * and shape with Card compound slots. `asChild` delegates only to a supported
 * container host; invalid delegation falls back to a native container.
 */

export const Card = CardImpl as CardComponent;
