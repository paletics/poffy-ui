import { getSafeInteractiveContent } from '@/components/shared/getSafeInteractiveContent';
import type { ReactNode } from 'react';

/** Keeps menuitem descendants passive so the item exclusively owns activation. */
export const getSafeDropdownItemContent = (content: ReactNode): ReactNode =>
  getSafeInteractiveContent(content, { disallowActivationHandlers: true });
