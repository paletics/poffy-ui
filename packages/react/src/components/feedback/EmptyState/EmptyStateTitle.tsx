'use client';

import { createFeedbackTitle } from '@/components/feedback/shared/createFeedbackParts';
import { useEmptyStateClasses } from './EmptyStateContext';

/**
 * Semantic heading slot for an `EmptyState` root.
 *
 * The default host is `h3`; `asChild` accepts one native heading with phrasing content. Invalid
 * hosts or block content fall back to textual content in the default heading.
 */
export const EmptyStateTitle = createFeedbackTitle({
  displayName: 'EmptyStateTitle',
  useClasses: useEmptyStateClasses,
});
