'use client';

import { ReferenceType } from '@floating-ui/react';
import { createOverlaySection } from './createOverlaySection';
import type { OverlayContext } from './types';

/**
 * Creates the header slot for a composed overlay.
 *
 * The returned part is structural only and inherits the shared safe-host `asChild` contract.
 */
export const createOverlayHeader = <T extends ReferenceType, TContext extends OverlayContext<T>>(
  useContext: () => TContext,
  displayName: string,
) => {
  return createOverlaySection(useContext, displayName, 'header');
};
