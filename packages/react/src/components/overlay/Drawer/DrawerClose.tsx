'use client';

import { createOverlayClose } from '../shared/factories';
import { useDrawerContext } from './DrawerContext';

/**
 * Close button for the Drawer.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Standardized via `createOverlayClose`
 * - **Props**: DrawerCloseProps
 */
export const DrawerClose = createOverlayClose(useDrawerContext, 'DrawerClose', 24);
