'use client';

import { createOverlayDescription } from '../shared/factories';
import { useDrawerContext } from './DrawerContext';

/** Descriptive text for the Drawer, automatically linked via aria-describedby. */
export const DrawerDescription = createOverlayDescription(useDrawerContext, 'DrawerDescription');
