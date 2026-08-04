'use client';

import { createOverlayDescription } from '../shared/factories';
import type { PopoverDescriptionProps } from './Popover.types';
import { usePopoverContext } from './PopoverContext';

/** Descriptive text for the Popover, automatically linked via aria-describedby. */
export const PopoverDescription = createOverlayDescription(usePopoverContext, 'PopoverDescription');

/**
 * Props for PopoverDescription, the accessible descriptive text of a Popover.
 */
export type { PopoverDescriptionProps };
