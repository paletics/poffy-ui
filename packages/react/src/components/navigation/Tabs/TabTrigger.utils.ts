import { isButtonTriggerAsChildHost } from '@/components/shared/asChild';
import type { ReactElement, ReactNode } from 'react';

type TabTriggerHostProps = Record<string, unknown>;

/**
 * Accepts HTML button-compatible tab hosts while rejecting link-like opaque
 * components whose rendered navigation target cannot be removed safely.
 */
export const isTabTriggerAsChildHost = (
  child: ReactNode,
): child is ReactElement<TabTriggerHostProps> => isButtonTriggerAsChildHost(child);
