'use client';

import { createOverlayDescription } from '../shared/factories';
import { useDrawerContext } from './DrawerContext';

/**
 * Descriptive text for the Drawer, automatically linked via aria-describedby.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Standardized via `createOverlayDescription`
 * - **Props**: DrawerDescriptionProps
 */
export const DrawerDescription = createOverlayDescription(useDrawerContext, 'DrawerDescription');
