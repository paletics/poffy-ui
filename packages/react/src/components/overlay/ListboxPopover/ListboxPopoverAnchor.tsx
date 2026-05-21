'use client';

import { PopoverAnchor } from '@/components/overlay/Popover';
import { forwardRef } from 'react';
import type { ListboxPopoverAnchorProps } from './ListboxPopover.types';

/**
 * Anchor element for ListboxPopover positioning.
 */
export const ListboxPopoverAnchor = forwardRef<HTMLDivElement, ListboxPopoverAnchorProps>(
  (props, ref) => <PopoverAnchor ref={ref} {...props} />,
);

ListboxPopoverAnchor.displayName = 'ListboxPopoverAnchor';
