'use client';

import { useMergeRefs } from '@floating-ui/react';
import {
  cloneElement,
  forwardRef,
  isValidElement,
  type KeyboardEventHandler,
  useCallback,
  useLayoutEffect,
  useRef,
} from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cx } from '@/styled-system/css';
import {
  getFallbackChildrenForNativeButton,
  isReferenceAsChildHost,
} from '@/components/shared/asChild';
import { omitNativeButtonOnlyProps } from '@/components/shared/buttonDelegation';
import { useHoverCardContext } from './HoverCardContext';
import { handleCancellableEscapeKeyDown } from '../shared/handleCancellableEscapeKeyDown';
import type { HoverCardTriggerComponent, HoverCardTriggerProps } from './HoverCard.types';
import { useOverlayPartOwner } from '../shared/useOverlayPartOwnership';

const HoverCardTriggerImpl = forwardRef<HTMLElement, HoverCardTriggerProps>((rawProps, ref) => {
  const {
    asChild = false,
    children,
    className,
    disabled: _legacyDisabled,
    onKeyDown: consumerKeyDown,
    ...props
  } = rawProps as HoverCardTriggerProps & { disabled?: unknown };
  const context = useHoverCardContext();
  const ownership = useOverlayPartOwner(context, 'reference');
  const hostRef = useRef<HTMLElement | null>(null);
  const setOwnedReference = useCallback(
    (node: HTMLElement | null) => {
      if (ownership.isOwner) context.refs.setReference(node);
    },
    [context.refs, ownership.isOwner],
  );
  const mergedRef = useMergeRefs([hostRef, setOwnedReference, ref]);
  useLayoutEffect(() => {
    if (!ownership.isOwner) return;
    context.refs.setReference(hostRef.current);
    return () => context.refs.setReference(null);
  }, [context.refs, ownership.activeId, ownership.isOwner]);
  const ownedStateProps = {
    'aria-haspopup': 'dialog',
    'aria-expanded': context.open,
    'aria-controls': context.open ? context.contentId : undefined,
    'data-state': context.open ? 'open' : 'closed',
  } as const;

  const asChildElement = asChild && isReferenceAsChildHost(children) ? children : null;
  const canUseAsChild = Boolean(asChildElement);
  const hostProps = canUseAsChild ? omitNativeButtonOnlyProps(props) : props;
  const { onKeyDown: floatingKeyDown, ...referenceProps } = context.getReferenceProps(hostProps);
  const Component = canUseAsChild ? Slot : 'button';
  const fallbackChildren =
    asChild && !canUseAsChild ? getFallbackChildrenForNativeButton(children) : children;
  const renderedChildren =
    canUseAsChild && isValidElement<Record<string, unknown>>(asChildElement)
      ? cloneElement(asChildElement, ownedStateProps)
      : fallbackChildren;

  if (!ownership.isOwner) return null;

  return (
    <Component
      ref={mergedRef}
      {...referenceProps}
      type={canUseAsChild ? undefined : 'button'}
      className={cx(context.classes.trigger, className)}
      {...ownedStateProps}
      onKeyDown={(event) =>
        handleCancellableEscapeKeyDown(event, {
          onKeyDown: consumerKeyDown,
          onFloatingKeyDown: floatingKeyDown as KeyboardEventHandler<HTMLElement>,
        })
      }
    >
      {renderedChildren}
    </Component>
  );
});

HoverCardTriggerImpl.displayName = 'HoverCardTrigger';

/**
 * Anchors a HoverCard for its parent’s hover and focus interactions.
 *
 * It owns dialog ARIA state while the panel is mounted. The default host is a
 * button, but `asChild` accepts a valid reference host without imposing button
 * behavior. Only the first trigger in a root owns the floating reference.
 */

export const HoverCardTrigger = HoverCardTriggerImpl as unknown as HoverCardTriggerComponent;
