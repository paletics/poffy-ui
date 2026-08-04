import { getSafeInteractiveContent } from '@/components/shared/getSafeInteractiveContent';
import type { ReactNode } from 'react';

/** Removes interactive and opaque descendants from a menuitem's presentational content. */
export const getSafeMenuItemContent = (content: ReactNode): ReactNode =>
  getSafeInteractiveContent(content, { disallowActivationHandlers: true });
