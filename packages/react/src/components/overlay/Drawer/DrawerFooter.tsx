'use client';

import { createOverlayFooter } from '../shared/factories';
import { useDrawerContext } from './DrawerContext';

/** Footer section of the Drawer, typically containing action buttons. */
export const DrawerFooter = createOverlayFooter(useDrawerContext, 'DrawerFooter');
