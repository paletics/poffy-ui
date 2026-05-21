'use client';

import { createOverlayTitle } from '../shared/factories';
import { PopoverTitleProps } from './Popover.types';
import { usePopoverContext } from './PopoverContext';

/**
 * Title element for the Popover, automatically linked via aria-labelledby.
 * Uses an `h3` tag by default.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Standardized via `createOverlayTitle`
 * - **Props**: PopoverTitleProps
 */
export const PopoverTitle = createOverlayTitle(usePopoverContext, 'PopoverTitle', 'h3');

/**
 * Props for PopoverTitle, the accessible heading of a Popover.
 */
export type { PopoverTitleProps };
