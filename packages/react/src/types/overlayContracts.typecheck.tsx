import { ListboxPopover, ListboxPopoverContent } from '@/components/overlay/ListboxPopover';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/overlay/Popover';
import type { ComponentProps } from 'react';

<Popover open onOpenChange={() => undefined} />;
<Popover onOpenChange={() => undefined} />;
// @ts-expect-error Controlled click Popovers require an update callback.
<Popover open />;
// @ts-expect-error Manual Popovers always require controlled visibility.
<Popover triggerMode="manual" onOpenChange={() => undefined} />;

// @ts-expect-error Public Popover semantics are fixed to dialog.
<Popover floatingRole="menu" />;
// @ts-expect-error PopoverTrigger owns its expanded state.
const invalidPopoverExpanded = { 'aria-expanded': true } satisfies ComponentProps<
  typeof PopoverTrigger
>;
// @ts-expect-error PopoverTrigger owns the popup semantic.
const invalidPopoverHasPopup = { 'aria-haspopup': 'menu' } satisfies ComponentProps<
  typeof PopoverTrigger
>;
// @ts-expect-error PopoverTrigger owns its content relationship.
const invalidPopoverControls = { 'aria-controls': 'content' } satisfies ComponentProps<
  typeof PopoverTrigger
>;
// @ts-expect-error Generic Popover content always owns the dialog role.
<PopoverContent role="menu" />;

void invalidPopoverExpanded;
void invalidPopoverHasPopup;
void invalidPopoverControls;

<ListboxPopover open onOpenChange={() => undefined}>
  <ListboxPopoverContent aria-label="Options" />
</ListboxPopover>;

// @ts-expect-error ListboxPopover owns focus management upstream.
<ListboxPopoverContent focusManagement aria-label="Options" />;

// @ts-expect-error Focus guards have no effect while focus management is disabled.
<ListboxPopoverContent focusGuards aria-label="Options" />;

// @ts-expect-error Focus return is owned by the surrounding listbox/select.
<ListboxPopoverContent returnFocus aria-label="Options" />;

// @ts-expect-error ListboxPopoverContent always owns the listbox role.
<ListboxPopoverContent role="dialog" aria-label="Options" />;
