import type { CustomBrandColors } from './BrandProvider.types';

/**
 * Writes custom brand CSS variables onto the given element.
 * Called by `BrandProvider` (global scope) and `ThemeBoundary` (scoped scope).
 *
 * ### Internal Use
 * This helper is exported only for provider composition inside this package.
 */
export const applyCustomBrandVars = (element: HTMLElement, colors: CustomBrandColors): void => {
  element.style.setProperty('--poffy-custom-main', colors.main);
  element.style.setProperty('--poffy-custom-contrast', colors.contrast ?? '#FFFFFF');
  if (colors.mainDark) element.style.setProperty('--poffy-custom-main-dark', colors.mainDark);
  if (colors.contrastDark)
    element.style.setProperty('--poffy-custom-contrast-dark', colors.contrastDark);
};

/**
 * Removes all custom brand CSS variables from the given element.
 * Called when the active brand switches away from `'custom'`.
 *
 * ### Internal Use
 * This helper is exported only for provider composition inside this package.
 */
export const removeCustomBrandVars = (element: HTMLElement): void => {
  element.style.removeProperty('--poffy-custom-main');
  element.style.removeProperty('--poffy-custom-contrast');
  element.style.removeProperty('--poffy-custom-main-dark');
  element.style.removeProperty('--poffy-custom-contrast-dark');
};
