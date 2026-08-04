'use client';

import { ColorModeProvider } from './ColorModeProvider';
import { PoffyBrandProvider } from './BrandProvider';
import { LocaleProvider } from './LocaleProvider';
import { DirectionProvider } from './DirectionProvider';
import { AnimationProvider } from './AnimationProvider';
import { MotionProvider } from './MotionProvider';
import { ThemeBoundary } from './ThemeBoundary';
import {
  normalizeThemeTokenOverrides,
  ThemeTokenOverrideProvider,
  useGlobalThemeTokenOverrides,
  useThemeTokenOverrides,
} from './theme-token-overrides';
import { OverlayTreeProvider } from '@/components/overlay/shared/FloatingTreeBoundary';
import type { ThemeProviderProps } from './ThemeProvider.types';

/**
 * Configures the complete Poffy UI provider stack for an application root. With `global={true}`, it
 * owns theme-related document attributes and global token overrides; with `global={false}`, it
 * creates an embedded local boundary instead.
 */
export const ThemeProvider = ({
  children,
  defaultBrand = 'blue',
  defaultColorMode = 'light',
  defaultLocale = 'en-US',
  defaultDir = 'ltr',
  defaultAnimationEnabled = true,
  defaultMotionStyle = 'standard',
  features,
  customBrand,
  global = true,
  ownerDocument,
  tokenOverrides,
}: ThemeProviderProps) => {
  const ownTokenOverrides = normalizeThemeTokenOverrides(tokenOverrides);
  const inheritedTokenOverrides = useThemeTokenOverrides();
  const resolvedTokenOverrides = { ...inheritedTokenOverrides, ...ownTokenOverrides };
  useGlobalThemeTokenOverrides(ownTokenOverrides, global, ownerDocument);
  const brandProviderProps =
    defaultBrand === 'custom'
      ? { initialBrand: 'custom' as const, customBrand: customBrand! }
      : { initialBrand: defaultBrand };

  return (
    <ThemeTokenOverrideProvider overrides={resolvedTokenOverrides}>
      <ColorModeProvider
        defaultColorMode={defaultColorMode}
        global={global}
        ownerDocument={ownerDocument}
      >
        <PoffyBrandProvider {...brandProviderProps} global={global} ownerDocument={ownerDocument}>
          <LocaleProvider
            defaultLocale={defaultLocale}
            global={global}
            ownerDocument={ownerDocument}
          >
            <DirectionProvider
              defaultDir={defaultDir}
              global={global}
              ownerDocument={ownerDocument}
            >
              <AnimationProvider
                defaultAnimationEnabled={defaultAnimationEnabled}
                defaultMotionStyle={defaultMotionStyle}
                global={global}
                ownerDocument={ownerDocument}
              >
                <MotionProvider features={features}>
                  <OverlayTreeProvider>
                    {!global ? (
                      <ThemeBoundary tokenOverrides={resolvedTokenOverrides}>
                        {children}
                      </ThemeBoundary>
                    ) : (
                      children
                    )}
                  </OverlayTreeProvider>
                </MotionProvider>
              </AnimationProvider>
            </DirectionProvider>
          </LocaleProvider>
        </PoffyBrandProvider>
      </ColorModeProvider>
    </ThemeTokenOverrideProvider>
  );
};
