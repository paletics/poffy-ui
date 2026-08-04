'use client';

import { createFeedbackTitle } from '@/components/feedback/shared/createFeedbackParts';
import { useResultContext } from '@/components/feedback/Result/ResultContext';

/**
 * Semantic heading slot for a `Result` root.
 *
 * The default host is `h3`; `asChild` accepts one native heading with phrasing content and falls
 * back to textual content for unsupported composition.
 */
export const ResultTitle = createFeedbackTitle({
  displayName: 'ResultTitle',
  useClasses: () => useResultContext().classes,
});
