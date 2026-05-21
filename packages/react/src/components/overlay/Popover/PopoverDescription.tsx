'use client';

import { createOverlayDescription } from '../shared/factories';
import type { PopoverDescriptionProps } from './Popover.types';
import { usePopoverContext } from './PopoverContext';

/**
 * Descriptive text for the Popover, automatically linked via aria-describedby.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Standardized via `createOverlayDescription`
 * - **Props**: PopoverDescriptionProps
 */
export const PopoverDescription = createOverlayDescription(usePopoverContext, 'PopoverDescription');

/**
 * Props for PopoverDescription, the accessible descriptive text of a Popover.
 */
export type { PopoverDescriptionProps };
