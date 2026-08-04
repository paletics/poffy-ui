'use client';

import { ReferenceType } from '@floating-ui/react';
import { createOverlaySection } from './createOverlaySection';
import type { OverlayContext } from './types';

/**
 * Creates the body slot for a composed overlay.
 *
 * The returned part is structural only: it supplies the owning overlay's `body` recipe class and
 * accepts a safe non-interactive `asChild` host through `createOverlaySection`.
 */
export const createOverlayBody = <T extends ReferenceType, TContext extends OverlayContext<T>>(
  useContext: () => TContext,
  displayName: string,
) => {
  return createOverlaySection(useContext, displayName, 'body');
};
