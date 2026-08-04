'use client';

import { createOverlayContent } from '../shared/factories';
import { useDrawerContext } from './DrawerContext';

/**
 * Renders the portalled modal drawer surface for its owning `Drawer`.
 *
 * The shared overlay factory provides focus trapping, dismissal, title and
 * description ARIA links, and safe `asChild` fallback. Supply `DrawerTitle`
 * unless another accessible name is explicitly provided.
 */
export const DrawerContent = createOverlayContent(useDrawerContext, 'DrawerContent', {
  fallbackLabelKey: 'drawer',
});

DrawerContent.displayName = 'DrawerContent';
