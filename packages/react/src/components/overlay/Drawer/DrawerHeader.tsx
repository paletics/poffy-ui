'use client';

import { createOverlayHeader } from '../shared/factories';
import { useDrawerContext } from './DrawerContext';

/**
 * Header section of the Drawer, typically containing the title and close button.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Standardized via `createOverlayHeader`
 * - **Props**: DrawerHeaderProps
 */
export const DrawerHeader = createOverlayHeader(useDrawerContext, 'DrawerHeader');
