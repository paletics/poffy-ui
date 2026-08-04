'use client';

import { createFeedbackDescription } from '@/components/feedback/shared/createFeedbackParts';
import { useEmptyStateClasses } from './EmptyStateContext';

/**
 * Semantic explanatory-text slot for an `EmptyState` root.
 *
 * The default host is `p`; `asChild` accepts one native paragraph with phrasing content. Invalid
 * hosts or block content fall back to textual content in the default paragraph.
 */
export const EmptyStateDescription = createFeedbackDescription({
  displayName: 'EmptyStateDescription',
  useClasses: useEmptyStateClasses,
});
