'use client';

import { PopoverContent } from '@/components/overlay/Popover';
import { forwardRef, type ForwardRefExoticComponent, type RefAttributes } from 'react';
import type { ListboxPopoverContentProps } from './ListboxPopover.types';

const InternalPopoverContent = PopoverContent as unknown as ForwardRefExoticComponent<
  ListboxPopoverContentProps &
    { focusManagement?: boolean; surface?: 'default' | 'none' } &
    RefAttributes<HTMLElement>
>;

/**
 * Floating listbox surface for ListboxPopover.
 *
 * It fixes Popover focus management off and surface ownership to `none`, so
 * the enclosing select/listbox owns Tab order and visual framing. Supply the
 * listbox accessible name and option semantics from that owning composite.
 */
export const ListboxPopoverContent = forwardRef<HTMLElement, ListboxPopoverContentProps>(
  (props, ref) => (
    <InternalPopoverContent ref={ref} {...props} focusManagement={false} surface="none" />
  ),
);

ListboxPopoverContent.displayName = 'ListboxPopoverContent';
