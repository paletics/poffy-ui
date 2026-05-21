/**
 * Theme Module
 *
 * ### AI Context & Architecture
 * This is the public entry point for the Poffy UI theme system.
 * It exports essential components, hooks, and types for theme management.
 *
 * Components:
 * - ThemeProvider: Root provider for brand and color mode.
 * - ThemeBoundary: Scoped theme override container.
 * - ColorModeProvider: Low-level color mode provider.
 * - PoffyBrandProvider: Low-level brand provider.
 *
 * Hooks:
 * - useColorMode: Access and control the current color mode.
 * - useBrand: Access and control the current brand.
 *
 * ### AI Usage
 * - **DO**: Import `ThemeProvider` for normal application roots instead of
 *   composing individual low-level providers.
 * - **DO**: Import low-level providers only for isolated integration tests or
 *   embedded subtrees that intentionally scope one concern.
 * - **DON'T**: Mix global and scoped providers without checking the `global`
 *   prop behavior on each provider.
 *
 * @example
 * ```tsx
 * import { ThemeProvider } from '@poffy-ui/react';
 *
 * <ThemeProvider defaultColorMode="system">
 *   <App />
 * </ThemeProvider>
 * ```
 */
export { ColorModeProvider, useColorMode } from './ColorModeProvider';
/**
 * Public color mode provider context and props types.
 */
export type {
  PoffyColorMode,
  PoffyResolvedColorMode,
  ColorModeContextType,
  ColorModeProviderProps,
} from './ColorModeProvider.types';
export { PoffyBrandProvider, useBrand } from './BrandProvider';
/**
 * Public brand provider context, brand name, and props types.
 */
export type { PoffyBrand, BrandContextType, BrandProviderProps } from './BrandProvider.types';
export { LocaleProvider, useLocale } from './LocaleProvider';
/**
 * Public locale provider context, locale value, and props types.
 */
export type { PoffyLocale, LocaleContextType, LocaleProviderProps } from './LocaleProvider.types';
export { DirectionProvider, useDirection } from './DirectionProvider';
/**
 * Public direction provider context, direction value, and props types.
 */
export type {
  PoffyDirection,
  DirectionContextType,
  DirectionProviderProps,
} from './DirectionProvider.types';
export { AnimationProvider, useAnimation } from './AnimationProvider';
/**
 * Public animation provider context and props types.
 */
export type { AnimationContextType, AnimationProviderProps } from './AnimationProvider.types';
export { MotionProvider } from './MotionProvider';
/**
 * Public MotionProvider props.
 */
export type { MotionProviderProps } from './MotionProvider.types';
export { ThemeBoundary } from './ThemeBoundary';
/**
 * Public ThemeBoundary props.
 */
export type { ThemeBoundaryProps } from './ThemeBoundary.types';
export { ThemeProvider } from './ThemeProvider';
/**
 * Public ThemeProvider props.
 */
export type { ThemeProviderProps } from './ThemeProvider.types';
