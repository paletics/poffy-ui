'use client';

import { createOverlayTitle } from '../shared/factories';
import { useDrawerContext } from './DrawerContext';

/**
 * Title element for the Drawer, automatically linked via aria-labelledby.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Standardized via `createOverlayTitle`
 * - **Props**: DrawerTitleProps
 */
export const DrawerTitle = createOverlayTitle(useDrawerContext, 'DrawerTitle', 'h2');
