'use client';

import { PopoverAnchor } from '@/components/overlay/Popover';
import { forwardRef, type Ref } from 'react';
import type {
  PopoverAnchorAsChildProps,
  PopoverAnchorDefaultProps,
} from '@/components/overlay/Popover';
import type { ListboxPopoverAnchorProps } from './ListboxPopover.types';

/**
 * Anchor element for ListboxPopover positioning.
 *
 * It deliberately binds no trigger interaction. The owning input/select
 * manages opening and keyboard behavior; `asChild` follows `PopoverAnchor`'s
 * valid reference-host constraint.
 */
export const ListboxPopoverAnchor = forwardRef<HTMLElement, ListboxPopoverAnchorProps>(
  (props, ref) =>
    props.asChild ? (
      <PopoverAnchor {...(props as PopoverAnchorAsChildProps)} ref={ref as Ref<Element>} />
    ) : (
      <PopoverAnchor {...(props as PopoverAnchorDefaultProps)} ref={ref as Ref<HTMLDivElement>} />
    ),
);

ListboxPopoverAnchor.displayName = 'ListboxPopoverAnchor';
