'use client';

import { useMergeRefs } from '@floating-ui/react';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import type { PopoverAnchorProps } from './Popover.types';
import { usePopoverContext } from './PopoverContext';

/**
 * Anchor element for positioning without trigger interaction binding.
 * Useful for manual open-state controls (e.g. combobox/listbox patterns).
 */
export const PopoverAnchor = forwardRef<HTMLDivElement, PopoverAnchorProps>((props, ref) => {
  const { children, asChild = false, ...rest } = props;
  const context = usePopoverContext();
  const mergedRef = useMergeRefs([context.refs.setReference, ref]);
  const Component = asChild ? Slot : 'div';

  return (
    <Component ref={mergedRef} data-state={context.open ? 'open' : 'closed'} {...rest}>
      {children}
    </Component>
  );
});

PopoverAnchor.displayName = 'PopoverAnchor';
