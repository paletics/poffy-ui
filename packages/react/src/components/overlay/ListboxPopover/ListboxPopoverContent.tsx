'use client';

import { PopoverContent } from '@/components/overlay/Popover';
import { forwardRef } from 'react';
import type { ListboxPopoverContentProps } from './ListboxPopover.types';

/**
 * Floating content element for ListboxPopover.
 */
export const ListboxPopoverContent = forwardRef<HTMLDivElement, ListboxPopoverContentProps>(
  (props, ref) => <PopoverContent ref={ref} focusManagement={false} {...props} />,
);

ListboxPopoverContent.displayName = 'ListboxPopoverContent';
