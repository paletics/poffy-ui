'use client';

import { createOverlayFooter } from '../shared/factories';
import { useDrawerContext } from './DrawerContext';

/**
 * Footer section of the Drawer, typically containing action buttons.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Standardized via `createOverlayFooter`
 * - **Props**: DrawerFooterProps
 */
export const DrawerFooter = createOverlayFooter(useDrawerContext, 'DrawerFooter');
