'use client';

import { cx } from '@/styled-system/css';
import { emptyState } from '@/styled-system/recipes';
import { Slot } from '@radix-ui/react-slot';
import { resolveLiveRegionProps } from '@/components/shared/resolveLiveRegionProps';
import { cloneElement, type ElementType, forwardRef, isValidElement, type ReactNode } from 'react';
import { EmptyStateContext } from '@/components/feedback/EmptyState/EmptyStateContext';
import type {
  EmptyStateComponent,
  EmptyStateProps,
} from '@/components/feedback/EmptyState/EmptyState.types';

const emptyStateAsChildElements = new Set(['article', 'div', 'main', 'section']);

const isSafeEmptyStateAsChildHost = (children: ReactNode) =>
  isValidElement(children) &&
  typeof children.type === 'string' &&
  emptyStateAsChildElements.has(children.type);

const EmptyStateImpl = forwardRef<HTMLElement, EmptyStateProps>((props, ref) => {
  const {
    asChild,
    children,
    className,
    size,
    appearance = 'soft',
    intent = 'primary',
    live,
    role,
    'aria-live': ariaLive,
    ...rest
  } = props;
  const { variant: _unsupportedVariant, ...safeRest } = rest as typeof rest & {
    variant?: unknown;
  };
  const classes = emptyState({ size, appearance, intent });
  const canUseAsChild = asChild && isSafeEmptyStateAsChildHost(children);
  const Component = (canUseAsChild ? Slot : 'div') as ElementType;
  const { role: resolvedRole, ariaLive: resolvedAriaLive } = resolveLiveRegionProps({
    live,
    defaultLive: 'off',
    role,
    ariaLive,
  });
  const ownsLiveRegion = [live, role, ariaLive].some((value) => value !== undefined);
  const renderedChildren =
    canUseAsChild &&
    ownsLiveRegion &&
    isValidElement<{ role?: string; 'aria-live'?: string }>(children)
      ? cloneElement(children, { role: resolvedRole, 'aria-live': resolvedAriaLive })
      : children;

  return (
    <EmptyStateContext.Provider value={classes}>
      <Component
        ref={ref}
        className={cx(classes.root, className)}
        role={resolvedRole}
        aria-live={resolvedAriaLive}
        {...safeRest}
      >
        {renderedChildren}
      </Component>
    </EmptyStateContext.Provider>
  );
});

EmptyStateImpl.displayName = 'EmptyState';
/**
 * Presents a no-content state with optional icon, explanation, and follow-up actions.
 *
 * It is not a live region unless `live`, `role`, or `aria-live` is supplied. Delegated rendering
 * is limited to `article`, `div`, `main`, and `section`; when live semantics are owned, the
 * resolved attributes are applied to that host.
 */
export const EmptyState = EmptyStateImpl as EmptyStateComponent;
