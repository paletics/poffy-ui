import type {
  PopoverAnchorProps,
  PopoverContentProps,
  PopoverProps,
} from '@/components/overlay/Popover';

/**
 * Props for the listbox-specific Popover wrapper.
 *
 * ListboxPopover is a Popover preset for select/listbox primitives. It fixes
 * `triggerMode="manual"`, `floatingRole="listbox"`, and `showArrow={false}`;
 * callers own open state and anchor wiring through the surrounding input.
 *
 * Required structure: `ListboxPopover` -> `ListboxPopoverAnchor` and
 * `ListboxPopoverContent`, with option rows rendered inside the content by the
 * owning listbox/select component.
 *
 * Do: use this for custom listbox/select surfaces. Don't: use it for generic
 * dialogs; use Popover for that.
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
 *
 * Related: import('@poffy-ui/react/overlay').PopoverProps
 */
export type ListboxPopoverProps = Omit<PopoverProps, 'triggerMode' | 'floatingRole' | 'showArrow'>;

/** Props for the element used as the listbox popover's positioning anchor. */
export type ListboxPopoverAnchorProps = PopoverAnchorProps;

/** Props for the listbox popup surface. Focus management is owned upstream. */
export type ListboxPopoverContentProps = Omit<PopoverContentProps, 'focusManagement'>;
