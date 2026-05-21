'use client';

import { createOverlayClose } from '../shared/factories';
import type { PopoverCloseProps } from './Popover.types';
import { usePopoverContext } from './PopoverContext';

/**
 * Close button for the Popover.
 * Uses a smaller default size (16px) than Drawer/Modal.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Standardized via `createOverlayClose`
 * - **Props**: PopoverCloseProps
 */
export const PopoverClose = createOverlayClose(usePopoverContext, 'PopoverClose', 16);

/**
 * Props for PopoverClose, the button that dismisses a Popover.
 */
export type { PopoverCloseProps };
