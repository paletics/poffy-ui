'use client';

import { createFeedbackDescription } from '@/components/feedback/shared/createFeedbackParts';
import { useResultContext } from '@/components/feedback/Result/ResultContext';

/**
 * Semantic explanatory-text slot for a `Result` root.
 *
 * The default host is `p`; `asChild` accepts one native paragraph with phrasing content and falls
 * back to textual content for unsupported composition.
 */
export const ResultDescription = createFeedbackDescription({
  displayName: 'ResultDescription',
  useClasses: () => useResultContext().classes,
});
