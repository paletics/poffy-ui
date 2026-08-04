import type { RangeSliderLabels } from './RangeSlider.types';

const ENGLISH_RANGE_SLIDER_LABELS: RangeSliderLabels = {
  lower: 'Minimum value',
  upper: 'Maximum value',
};

const RANGE_SLIDER_LABELS: Record<string, RangeSliderLabels> = {
  en: ENGLISH_RANGE_SLIDER_LABELS,
  ja: { lower: '最小値', upper: '最大値' },
};

export const getRangeSliderLabels = (
  locale = 'en-US',
  overrides?: Partial<RangeSliderLabels>,
): RangeSliderLabels => ({
  ...(RANGE_SLIDER_LABELS[locale.toLowerCase()] ??
    RANGE_SLIDER_LABELS[locale.toLowerCase().split('-')[0]] ??
    ENGLISH_RANGE_SLIDER_LABELS),
  ...overrides,
});
