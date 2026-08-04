'use client';

import { createOverlayTitle } from '../shared/factories';
import { useDrawerContext } from './DrawerContext';

/** Title element for the Drawer, automatically linked via aria-labelledby. */
export const DrawerTitle = createOverlayTitle(useDrawerContext, 'DrawerTitle', 'h2');
