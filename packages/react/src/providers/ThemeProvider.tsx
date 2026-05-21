'use client';

import { ColorModeProvider } from './ColorModeProvider';
import { PoffyBrandProvider } from './BrandProvider';
import { LocaleProvider } from './LocaleProvider';
import { DirectionProvider } from './DirectionProvider';
import { AnimationProvider } from './AnimationProvider';
import { MotionProvider } from './MotionProvider';
import { ThemeBoundary } from './ThemeBoundary';
import type { ThemeProviderProps } from './ThemeProvider.types';

/**
 * Root theme provider for the Poffy UI design system.
 * Wraps the application in the providers required for color mode, brand,
 * locale, direction, motion features, and animation preferences.
 *
 * ### Notes
 * Use once at the app root for normal applications. Set `global={false}`
 * only for embedded widgets that must not write attributes to
 * `document.documentElement`; local scoping then happens through `ThemeBoundary`.
 *
 * ### AI Usage
 * - **DO**: Prefer `ThemeProvider` over manually composing individual providers for app roots.
 * - **DO**: Pass `features` only when intentionally overriding the default async `domMax` bundle.
 * - **DON'T**: Nest multiple root `ThemeProvider` instances unless isolating an embedded subtree.
 *
 * @example App root
 * ```tsx
 * import { ThemeProvider } from '@poffy-ui/react';
 *
 * <ThemeProvider defaultColorMode="system" defaultLocale="ja-JP">
 *   <App />
 * </ThemeProvider>
 * ```
 */
export const ThemeProvider = ({
  children,
  defaultBrand = 'blue',
  defaultColorMode = 'light',
  defaultLocale = 'en-US',
  defaultDir = 'ltr',
  defaultAnimationEnabled = true,
  features,
  customBrand,
  global = true,
}: ThemeProviderProps) => {
  return (
    <ColorModeProvider defaultColorMode={defaultColorMode} global={global}>
      <PoffyBrandProvider initialBrand={defaultBrand} global={global} customBrand={customBrand}>
        <LocaleProvider defaultLocale={defaultLocale} global={global}>
          <DirectionProvider defaultDir={defaultDir} global={global}>
            <AnimationProvider defaultAnimationEnabled={defaultAnimationEnabled} global={global}>
              <MotionProvider features={features}>
                {!global ? <ThemeBoundary>{children}</ThemeBoundary> : children}
              </MotionProvider>
            </AnimationProvider>
          </DirectionProvider>
        </LocaleProvider>
      </PoffyBrandProvider>
    </ColorModeProvider>
  );
};
