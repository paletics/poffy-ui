'use client';

import { createOverlayTitle } from '../shared/factories';
import { useHoverCardContext } from './HoverCardContext';

/** Provides the accessible title within HoverCard content. */


export const HoverCardTitle = createOverlayTitle(useHoverCardContext, 'HoverCardTitle', 'h3');
