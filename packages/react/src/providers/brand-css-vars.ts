import type { CustomBrandColors } from './BrandProvider.types';
import type { CSSProperties } from 'react';

/** All runtime CSS custom properties owned by the custom-brand palette. */
export const CUSTOM_BRAND_VARIABLES = [
  '--poffy-custom-main',
  '--poffy-custom-contrast',
  '--poffy-custom-main-dark',
  '--poffy-custom-contrast-dark',
] as const;

type CustomBrandStyle = CSSProperties & {
  '--poffy-custom-main'?: string;
  '--poffy-custom-contrast'?: string;
  '--poffy-custom-main-dark'?: string;
  '--poffy-custom-contrast-dark'?: string;
};

/** Returns custom brand variables for SSR-safe scoped theme rendering. */
export const getCustomBrandStyle = (colors: CustomBrandColors | undefined): CustomBrandStyle =>
  colors
    ? {
        '--poffy-custom-main': colors.main,
        '--poffy-custom-contrast': colors.contrast ?? '#FFFFFF',
        // Define fallbacks locally so a parent custom scope cannot leak dark values in.
        '--poffy-custom-main-dark': colors.mainDark ?? colors.main,
        '--poffy-custom-contrast-dark': colors.contrastDark ?? colors.contrast ?? '#FFFFFF',
      }
    : {};

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
  else element.style.removeProperty('--poffy-custom-main-dark');
  if (colors.contrastDark)
    element.style.setProperty('--poffy-custom-contrast-dark', colors.contrastDark);
  else element.style.removeProperty('--poffy-custom-contrast-dark');
};

/**
 * Removes all custom brand CSS variables from the given element.
 * Called when the active brand switches away from `'custom'`.
 *
 * ### Internal Use
 * This helper is exported only for provider composition inside this package.
 */
export const removeCustomBrandVars = (element: HTMLElement): void => {
  for (const variable of CUSTOM_BRAND_VARIABLES) element.style.removeProperty(variable);
};
