'use client';

import { createFeedbackActions } from '@/components/feedback/shared/createFeedbackParts';
import { useResultContext } from '@/components/feedback/Result/ResultContext';
import { getCommonMessages } from '@/components/shared/common.locales';
import { useOptionalLocale } from '@/providers/LocaleProvider';

/**
 * Groups follow-up controls for a `Result` with `role="group"` and a localized fallback label.
 *
 * `asChild` accepts only one native `div`; an invalid host falls back to the owned group. The
 * default `aria-live="off"` prevents asynchronous result changes from re-announcing its actions.
 */
export const ResultActions = createFeedbackActions({
  allowedHosts: ['div'],
  useDefaultAriaLabel: () => getCommonMessages(useOptionalLocale()?.locale).resultActions,
  defaultAriaLive: 'off',
  displayName: 'ResultActions',
  useClasses: () => useResultContext().classes,
});
