import type { Direction } from './DirectionalButton.types';

interface DirectionalButtonLabels {
  move: (direction: Direction) => string;
}

const ENGLISH_DIRECTIONAL_BUTTON_LABELS: DirectionalButtonLabels = {
  move: (direction) => `Move ${direction}`,
};

const DIRECTIONAL_BUTTON_LOCALES: Record<string, DirectionalButtonLabels> = {
  en: ENGLISH_DIRECTIONAL_BUTTON_LABELS,
  ja: {
    move: (direction) =>
      ({ up: '上へ移動', down: '下へ移動', left: '左へ移動', right: '右へ移動' })[direction],
  },
};

/** Resolves the localized fallback accessible label for a directional button. */
export const getDirectionalButtonLabels = (locale = 'en-US'): DirectionalButtonLabels => {
  const normalizedLocale = locale.toLowerCase();
  return (
    DIRECTIONAL_BUTTON_LOCALES[normalizedLocale] ??
    DIRECTIONAL_BUTTON_LOCALES[normalizedLocale.split('-')[0]] ??
    ENGLISH_DIRECTIONAL_BUTTON_LABELS
  );
};
