import type {
  PopoverAnchorProps,
  PopoverContentProps,
  PopoverProps,
} from '@/components/overlay/Popover';
import type { ReactNode } from 'react';

/**
 * Props for the listbox-specific Popover wrapper.
 *
 * ListboxPopover is a Popover preset for select/listbox primitives. It fixes
 * `triggerMode="manual"`, listbox popup semantics, and `showArrow={false}`;
 * callers own open state and anchor wiring through the surrounding input.
 *
 * Required structure: `ListboxPopover` -> `ListboxPopoverAnchor` and
 * `ListboxPopoverContent`, with option rows rendered inside the content by the
 * owning listbox/select component. Give `ListboxPopoverContent` an
 * `aria-label` or `aria-labelledby`; the owning select/listbox controls the
 * popup's accessible name and option navigation.
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
export interface ListboxPopoverProps extends Omit<
  PopoverProps,
  'children' | 'onOpenChange' | 'open' | 'showArrow' | 'triggerMode'
> {
  /** ListboxPopover is manual-only, so its visibility is always owned by the caller. */
  open: boolean;
  /** Receives dismissal requests such as Escape or outside press. */
  onOpenChange: (open: boolean) => void;
  children?: ReactNode;
}

/**
 * Props for the element used as the listbox popover's positioning anchor. The
 * forwarded ref targets the default div or the slotted anchor with `asChild`.
 */
export type ListboxPopoverAnchorProps = PopoverAnchorProps;

/**
 * Props for the listbox popup surface. Focus management is owned upstream. The
 * forwarded ref targets the default div or the safe slotted content host.
 */
export type ListboxPopoverContentProps = Omit<
  PopoverContentProps,
  'focusGuards' | 'focusManagement' | 'returnFocus' | 'role' | 'surface'
>;
