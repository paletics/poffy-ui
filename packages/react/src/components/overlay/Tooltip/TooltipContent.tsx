import { getSafeInteractiveContent } from '@/components/shared/getSafeInteractiveContent';
import type { ReactNode } from 'react';

/** Removes interactive and opaque custom content from the non-interactive tooltip surface. */
export const getSafeTooltipContent = (content: ReactNode): ReactNode =>
  getSafeInteractiveContent(content, { disallowActivationHandlers: true });
