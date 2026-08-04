'use client';

import { createFeedbackActions } from '@/components/feedback/shared/createFeedbackParts';
import { useEmptyStateClasses } from '@/components/feedback/EmptyState/EmptyStateContext';
import { getCommonMessages } from '@/components/shared/common.locales';
import { useOptionalLocale } from '@/providers/LocaleProvider';

/**
 * Groups follow-up controls for an `EmptyState` with `role="group"` and a localized fallback label.
 *
 * `asChild` accepts only one native `div`; an invalid host falls back to the owned group. This part
 * leaves live-region behavior unset unless the caller explicitly provides `aria-live`.
 */
export const EmptyStateActions = createFeedbackActions({
  // Keep the only slottable host aligned with the public HTMLDivElement ref.
  allowedHosts: ['div'],
  useDefaultAriaLabel: () => getCommonMessages(useOptionalLocale()?.locale).emptyStateActions,
  displayName: 'EmptyStateActions',
  useClasses: useEmptyStateClasses,
});
