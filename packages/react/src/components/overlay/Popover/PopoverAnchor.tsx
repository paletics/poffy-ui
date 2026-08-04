'use client';

import { useMergeRefs } from '@floating-ui/react';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef, useCallback, useLayoutEffect, useRef } from 'react';
import { isReferenceAsChildHost } from '@/components/shared/asChild';
import type { PopoverAnchorComponent, PopoverAnchorProps } from './Popover.types';
import { usePopoverContext } from './PopoverContext';
import { useOverlayPartOwner } from '../shared/useOverlayPartOwnership';

/**
 * Anchor element for positioning without trigger interaction binding.
 * Useful for manual open-state controls (e.g. combobox/listbox patterns).
 */
const PopoverAnchorImpl = forwardRef<Element, PopoverAnchorProps>((props, ref) => {
  const { children, asChild = false, ...rest } = props;
  const context = usePopoverContext();
  const ownership = useOverlayPartOwner(context, 'reference');
  const hostRef = useRef<Element | null>(null);
  const setOwnedReference = useCallback(
    (node: Element | null) => {
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
  const canUseAsChild = asChild && isReferenceAsChildHost(children);
  const Component = canUseAsChild ? Slot : 'div';

  if (!ownership.isOwner) return null;

  return (
    <Component ref={mergedRef} data-state={context.open ? 'open' : 'closed'} {...rest}>
      {children}
    </Component>
  );
});

PopoverAnchorImpl.displayName = 'PopoverAnchor';

/**
 * Supplies a positioning reference without binding trigger interaction.
 *
 * Use it with `triggerMode="manual"` when another composite owns opening and
 * keyboard behavior. Only the first reference part owns the floating ref;
 * later anchors render nothing. `asChild` delegates to a valid reference host.
 */

export const PopoverAnchor = PopoverAnchorImpl as PopoverAnchorComponent;
