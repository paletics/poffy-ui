import type { ReactNode } from 'react';
import type { PoffyColorMode } from './ColorModeProvider.types';
import type { CustomBrandColors, PoffyBuiltInBrand } from './BrandProvider.types';
import type { PoffyLocale } from './LocaleProvider.types';
import type { PoffyDirection } from './DirectionProvider.types';
import type { AnimationProviderProps } from './AnimationProvider.types';
import type { MotionProviderProps } from './MotionProvider.types';
import type { ThemeTokenOverrides } from './theme-token-overrides';

type PickedAnimationProps = Pick<
  AnimationProviderProps,
  'defaultAnimationEnabled' | 'defaultMotionStyle'
>;


interface ThemeProviderBaseProps extends PickedAnimationProps {
  /** The content to be wrapped by the theme providers. */
  children: ReactNode;
  /**
   * The initial color mode for the design system.
   *
   * @defaultValue `'light'`
   */
  defaultColorMode?: PoffyColorMode;
  /**
   * The initial BCP 47 locale string (e.g. `'en-US'`, `'ja-JP'`).
   * Used by components that format dates, numbers, or relative times via `Intl.*` APIs.
   *
   * @defaultValue `'en-US'`
   */
  defaultLocale?: PoffyLocale;
  /**
   * The initial text direction applied across the design system.
   *
   * @defaultValue `'ltr'`
   */
  defaultDir?: PoffyDirection;
  /**
   * Framer Motion feature bundle forwarded to `MotionProvider`.
   *
   * Defaults to async `domMax` loaded off the critical path.
   * Override with `domAnimation` only when no components in your tree use
   * `layout`, `drag`, `LayoutGroup`, or `layoutId`.
   *
   * Related API: `MotionProviderProps['features']`.
   */
  features?: MotionProviderProps['features'];
  /**
   * When `true`, applies brand and color-mode attributes to `document.documentElement` (global scope).
   * When `false`, wraps `children` in a `ThemeBoundary` for local DOM scoping instead.
   * Set to `false` only when embedding Poffy UI inside a host app that controls its own global theming.
   * Never set `false` at the app root — it prevents CSS token resolution from reaching the document.
   *
   * @defaultValue `true`
   */
  global?: boolean;
  /** Document forwarded to every global theme provider. */
  ownerDocument?: Document;
  /**
   * Runtime values for `--poffy-*` CSS custom properties.
   *
   * This changes token values without generating new Panda tokens. Add custom
   * token names through the consuming application's Panda `theme.extend`.
   * Custom brand variables remain controlled by `customBrand`.
   */
  tokenOverrides?: ThemeTokenOverrides;
}

interface BuiltInThemeProviderProps extends ThemeProviderBaseProps {
  /**
   * The initial built-in brand.
   *
   * @defaultValue `'blue'`
   */
  defaultBrand?: PoffyBuiltInBrand;
  customBrand?: never;
}

interface CustomThemeProviderProps extends ThemeProviderBaseProps {
  /** Activates the supplied custom palette on first render. */
  defaultBrand: 'custom';
  /**
   * Color overrides required by the custom brand.
   *
   * @example
   * ```tsx
   * <ThemeProvider defaultBrand="custom" customBrand={{ main: '#8B5CF6' }}>
   *   <App />
   * </ThemeProvider>
   * ```
   */
  customBrand: CustomBrandColors;
}

/** Props for the root theme provider with a valid built-in or custom brand configuration. */
export type ThemeProviderProps = BuiltInThemeProviderProps | CustomThemeProviderProps;
