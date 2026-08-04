import type { CSSProperties } from 'react';
import { getCustomBrandStyle } from '@/providers/brand-css-vars';
import type { CustomBrandColors, PoffyBrand } from '@/providers/BrandProvider.types';
import type { PoffyColorMode, PoffyResolvedColorMode } from '@/providers/ColorModeProvider.types';
import type { PoffyDirection } from '@/providers/DirectionProvider.types';
import type { PoffyLocale } from '@/providers/LocaleProvider.types';
import {
  getThemeTokenOverrideStyle,
  normalizeThemeTokenOverrides,
} from '@/providers/theme-token-overrides';
import type { ThemeTokenOverrides } from '@/providers/theme-token-overrides';

/**
 * Initial server-side configuration shared with ThemeProvider.
 *
 * These options produce the deterministic document snapshot rendered before client preferences and
 * persisted values are restored after hydration.
 */
export interface InitialThemeOptions {
  /**
   * Brand written to `data-brand`. Custom-brand variables are supplied separately through
   * `customBrand`.
   * @defaultValue `'blue'`
   */
  defaultBrand?: PoffyBrand;
  /**
   * Initial color-mode preference. The server renders `system` as `light`, then ThemeProvider
   * reconciles it with the browser preference after hydration.
   * @defaultValue `'light'`
   */
  defaultColorMode?: PoffyColorMode;
  /** BCP 47 locale written to the document `lang` attribute. @defaultValue `'en-US'` */
  defaultLocale?: PoffyLocale;
  /** Text direction written to the document `dir` attribute. @defaultValue `'ltr'` */
  defaultDir?: PoffyDirection;
  /** Custom-brand color variables included only when `defaultBrand` is `'custom'`. */
  customBrand?: CustomBrandColors;
  /** Runtime values for existing `--poffy-*` CSS custom properties; invalid names are discarded. */
  tokenOverrides?: ThemeTokenOverrides;
}

/**
 * Attributes to spread onto the document element before ThemeProvider hydrates.
 *
 * The values mirror ThemeProvider's server snapshot; `style` is omitted unless custom-brand or
 * token-override variables are present.
 */
export interface InitialThemeAttributes {
  /** Brand selector consumed by Poffy theme CSS. */
  'data-brand': PoffyBrand;
  /** Resolved light or dark selector consumed by Poffy theme CSS. */
  'data-theme': PoffyResolvedColorMode;
  /** Matching light or dark document class used by the color-mode provider. */
  className: PoffyResolvedColorMode;
  /** Document text direction. */
  dir: PoffyDirection;
  /** Document BCP 47 language tag. */
  lang: PoffyLocale;
  /** Optional custom-brand and token-override CSS variables. */
  style?: CSSProperties;
}

/**
 * Returns `<html>` attributes matching ThemeProvider's initial server state.
 *
 * The server cannot evaluate `prefers-color-scheme`, so `system` consistently
 * resolves to `light`, matching ColorModeProvider's server snapshot. Persisted
 * browser preferences are restored by ThemeProvider after hydration.
 *
 * @param options - Initial theme inputs shared with ThemeProvider.
 * @returns Attributes to spread onto the server-rendered `<html>` element.
 *
 * @example
 * ```tsx
 * import { getInitialThemeAttributes } from '@poffy-ui/react/ssr';
 *
 * <html {...getInitialThemeAttributes({ defaultColorMode: 'dark', defaultDir: 'rtl' })}>
 * ```
 */
export const getInitialThemeAttributes = (
  options: InitialThemeOptions = {},
): InitialThemeAttributes => {
  const brand = options.defaultBrand ?? 'blue';
  const colorMode = options.defaultColorMode ?? 'light';
  const resolvedColorMode: PoffyResolvedColorMode = colorMode === 'system' ? 'light' : colorMode;
  const tokenOverrides = getThemeTokenOverrideStyle(
    normalizeThemeTokenOverrides(options.tokenOverrides),
  );
  const customBrandStyle =
    brand === 'custom' ? getCustomBrandStyle(options.customBrand) : undefined;

  return {
    'data-brand': brand,
    'data-theme': resolvedColorMode,
    className: resolvedColorMode,
    dir: options.defaultDir ?? 'ltr',
    lang: options.defaultLocale ?? 'en-US',
    ...(Object.keys(tokenOverrides).length > 0 || customBrandStyle
      ? { style: { ...tokenOverrides, ...customBrandStyle } }
      : {}),
  };
};
