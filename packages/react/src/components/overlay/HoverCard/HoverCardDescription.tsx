'use client';

import { createOverlayDescription } from '../shared/factories';
import { useHoverCardContext } from './HoverCardContext';

/** Provides descriptive text within HoverCard content. */


export const HoverCardDescription = createOverlayDescription(
  useHoverCardContext,
  'HoverCardDescription',
);
