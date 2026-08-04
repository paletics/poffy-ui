'use client';

import { PopoverRolePreset } from '@/components/overlay/Popover/Popover';
import type { ListboxPopoverProps } from './ListboxPopover.types';

/**
 * Provides a manual, arrowless Popover preset for custom listbox/select surfaces.
 *
 * It fixes `triggerMode` to manual and exposes `role="listbox"`; the owning
 * select or listbox retains open state, keyboard navigation, and option ARIA.
 * The default placement is `bottom-start`.
 */
export const ListboxPopover = (props: ListboxPopoverProps) => {
  const { children, placement = 'bottom-start', ...rest } = props;

  return (
    <PopoverRolePreset
      {...rest}
      placement={placement}
      triggerMode="manual"
      popupRole="listbox"
      showArrow={false}
    >
      {children}
    </PopoverRolePreset>
  );
};

ListboxPopover.displayName = 'ListboxPopover';
