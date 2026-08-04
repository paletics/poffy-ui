'use client';

import { createOverlayClose } from '../shared/factories';
import { useDrawerContext } from './DrawerContext';

/** Close button for the Drawer. */
export const DrawerClose = createOverlayClose(useDrawerContext, 'DrawerClose', 24);
