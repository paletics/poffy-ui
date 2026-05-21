'use client';

import { createOverlayBody } from '../shared/factories';
import { useDrawerContext } from './DrawerContext';

/**
 * Main content body for the Drawer.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Standardized via `createOverlayBody`
 * - **Props**: DrawerBodyProps
 */
export const DrawerBody = createOverlayBody(useDrawerContext, 'DrawerBody');
