import type { ReactNode } from 'react';
import type { PoffyColorMode } from './ColorModeProvider.types';
import type { CustomBrandColors, PoffyBrand } from './BrandProvider.types';
import type { PoffyLocale } from './LocaleProvider.types';
import type { PoffyDirection } from './DirectionProvider.types';
import type { AnimationProviderProps } from './AnimationProvider.types';
import type { MotionProviderProps } from './MotionProvider.types';

type PickedAnimationProps = Pick<AnimationProviderProps, 'defaultAnimationEnabled'>;

/**
 * Props for the `ThemeProvider` component.
 * All child props are forwarded to the corresponding sub-providers
 * (`ColorModeProvider`, `PoffyBrandProvider`, `LocaleProvider`, `DirectionProvider`, `AnimationProvider`).
 * Place once at the app root.
 *
 * ### Notes
 * `ThemeProvider` owns the default values for the provider stack but
 * each low-level provider remains stateful after initial render. Updating a
 * `default*` prop after mount is not a controlled state update.
 *
 * ### AI Usage
 * - **DO**: Treat `defaultBrand`, `defaultColorMode`, `defaultLocale`, `defaultDir`,
 *   and `defaultAnimationEnabled` as initial values.
 * - **DON'T**: Use `global={false}` at an app root that should control document-level tokens.
 */
export interface ThemeProviderProps extends PickedAnimationProps {
  /** The content to be wrapped by the theme providers. */
  children: ReactNode;
  /**
   * The initial brand applied across the design system (e.g., `'blue'`, `'pome'`).
   *
   * @defaultValue `'blue'`
   */
  defaultBrand?: PoffyBrand;
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
   * Color overrides for the `'custom'` brand.
   * Required when `defaultBrand` is `'custom'`. Ignored for built-in brands.
   *
   * @example
   * ```tsx
   * import { ThemeProvider } from '@poffy-ui/react';
   *
   * <ThemeProvider defaultBrand="custom" customBrand={{ main: '#8B5CF6' }}>
   *   <App />
   * </ThemeProvider>
   * ```
   */
  customBrand?: CustomBrandColors;
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
}
