'use client';

import { Popover } from '@/components/overlay/Popover';
import type { ListboxPopoverProps } from './ListboxPopover.types';

/**
 * Popover wrapper configured for custom listbox/select surfaces.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Popover preset with `triggerMode="manual"` and `floatingRole="listbox"`
 * - **Props**: ListboxPopoverProps
 *
 * ### Accessibility
 * - The owning select/listbox must provide option roles, active descendant state, and keyboard navigation.
 * - Do not put generic dialog content in this preset; the role is fixed to `listbox`.
 *
 * ### AI Usage
 * - Do: use with `ListboxPopoverAnchor` and `ListboxPopoverContent` for custom select surfaces.
 * - Don't: use when click-triggered disclosure or dialog semantics are required.
 *
 * @example
 * ```tsx
 * import {
 *   ListboxPopover,
 *   ListboxPopoverAnchor,
 *   ListboxPopoverContent,
 * } from '@poffy-ui/react/overlay';
 *
 * <ListboxPopover open={open} onOpenChange={setOpen}>
 *   <ListboxPopoverAnchor>{trigger}</ListboxPopoverAnchor>
 *   <ListboxPopoverContent>{options}</ListboxPopoverContent>
 * </ListboxPopover>
 * ```
 */
export const ListboxPopover = (props: ListboxPopoverProps) => {
  const { children, placement = 'bottom-start', ...rest } = props;

  return (
    <Popover
      placement={placement}
      triggerMode="manual"
      floatingRole="listbox"
      showArrow={false}
      {...rest}
    >
      {children}
    </Popover>
  );
};

ListboxPopover.displayName = 'ListboxPopover';
