import type { SplitButtonLabels } from './SplitButton.types';

const ENGLISH_SPLIT_BUTTON_LABELS: SplitButtonLabels = {
  moreOptions: 'More options',
};

const SPLIT_BUTTON_LABELS: Record<string, SplitButtonLabels> = {
  en: ENGLISH_SPLIT_BUTTON_LABELS,
  ja: {
    moreOptions: 'その他のオプション',
  },
};

export const getSplitButtonLabels = (
  locale = 'en-US',
  overrides?: Partial<SplitButtonLabels>,
): SplitButtonLabels => ({
  ...(SPLIT_BUTTON_LABELS[locale.toLowerCase()] ??
    SPLIT_BUTTON_LABELS[locale.toLowerCase().split('-')[0]] ??
    ENGLISH_SPLIT_BUTTON_LABELS),
  ...overrides,
});
