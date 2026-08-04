'use client';

import { forwardRef } from 'react';
import { OverlayDialogTrigger } from '../shared/OverlayDialogTrigger';
import type { OverlayTriggerComponent } from '../shared/factories/types';
import type { DrawerTriggerProps } from './Drawer.types';
import { useDrawerContext } from './DrawerContext';

/**
 * Control that toggles a Drawer and registers its focus-return reference.
 *
 * ### Accessibility
 * With `asChild`, passive hosts receive button semantics; href anchors open the
 * drawer without navigating. Disabled controls remain focusable but suppress
 * pointer and Enter/Space activation.
 *
 * @example
 * ```tsx
 * <Drawer>
 *   <DrawerTrigger>Open filters</DrawerTrigger>
 *   <DrawerContent><DrawerTitle>Filters</DrawerTitle></DrawerContent>
 * </Drawer>
 * ```
 */
const DrawerTriggerImpl = forwardRef<HTMLElement, DrawerTriggerProps>((props, ref) => {
  const context = useDrawerContext();

  return <OverlayDialogTrigger ref={ref} context={context} {...props} />;
});

DrawerTriggerImpl.displayName = 'DrawerTrigger';

/** Opens its owning Drawer and supplies the trigger semantics used for focus restoration. */

export const DrawerTrigger = DrawerTriggerImpl as unknown as OverlayTriggerComponent;
