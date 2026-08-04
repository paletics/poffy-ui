import type { NumberInputLabels } from './NumberInput.types';

const ENGLISH_NUMBER_INPUT_LABELS: NumberInputLabels = {
  increment: 'Increment',
  decrement: 'Decrement',
};

const NUMBER_INPUT_LABELS: Record<string, NumberInputLabels> = {
  en: ENGLISH_NUMBER_INPUT_LABELS,
  ja: { increment: '増やす', decrement: '減らす' },
};

/** Resolves stepper labels by exact locale, base language, then English, with caller overrides. */
export const getNumberInputLabels = (
  locale = 'en-US',
  overrides?: Partial<NumberInputLabels>,
): NumberInputLabels => ({
  ...(NUMBER_INPUT_LABELS[locale.toLowerCase()] ??
    NUMBER_INPUT_LABELS[locale.toLowerCase().split('-')[0]] ??
    ENGLISH_NUMBER_INPUT_LABELS),
  ...overrides,
});
