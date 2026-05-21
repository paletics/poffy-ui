'use client';

import { createOverlayContent } from '../shared/factories';
import { useDrawerContext } from './DrawerContext';

/**
 * The content container for the Drawer.
 * Handles portals, overlays, focus management, and accessibility attributes.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Standardized via `createOverlayContent`
 * - **Props**: DrawerContentProps
 *
 * ### Component Details
 * - Wraps content in Portal and Backdrop automatically.
 *
 * ### Accessibility
 * - **Pattern**: WAI-ARIA Dialog for non-modal or modal drawer surfaces.
 * - **Required**: Include `DrawerTitle` in the content so the drawer has a
 *   stable accessible name.
 *
 * ### AI Usage
 * - **DO**: Put `DrawerHeader`, `DrawerBody`, and optional `DrawerFooter`
 *   inside `DrawerContent`.
 * - **DON'T**: Render `DrawerContent` outside `Drawer`; use `ModalContent`
 *   for blocking confirmation dialogs.
 *
 * @example Drawer content composition
 * ```tsx
 * import { Drawer, DrawerBody, DrawerContent, DrawerTitle } from '@poffy-ui/react/overlay';
 *
 * <Drawer open={open} onOpenChange={setOpen}>
 *   <DrawerContent>
 *     <DrawerTitle>Filters</DrawerTitle>
 *     <DrawerBody>Filter controls go here.</DrawerBody>
 *   </DrawerContent>
 * </Drawer>
 * ```
 */
export const DrawerContent = createOverlayContent(useDrawerContext, 'DrawerContent');

DrawerContent.displayName = 'DrawerContent';
