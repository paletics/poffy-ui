import type { CSSProperties, ReactNode } from 'react';
import type { CustomBrandColors, PoffyBrand } from './BrandProvider.types';
import type { PoffyResolvedColorMode } from './ColorModeProvider.types';
import type { PoffyDirection } from './DirectionProvider.types';
import type { PoffyLocale } from './LocaleProvider.types';
import { getCustomBrandStyle } from './brand-css-vars';

interface ProviderScopeProps {
  children: ReactNode;
  brand?: PoffyBrand;
  colorMode?: PoffyResolvedColorMode;
  customBrandColors?: CustomBrandColors;
  dir?: PoffyDirection;
  locale?: PoffyLocale;
}

/** Internal DOM boundary for opt-in low-level provider scoping. */
export const ProviderScope = ({
  children,
  brand,
  colorMode,
  customBrandColors,
  dir,
  locale,
}: ProviderScopeProps) => {
  const customBrandStyle: CSSProperties | undefined =
    brand === 'custom' ? getCustomBrandStyle(customBrandColors) : undefined;

  return (
    <div
      data-brand={brand}
      data-theme={colorMode}
      className={colorMode}
      dir={dir}
      lang={locale}
      style={customBrandStyle}
    >
      {children}
    </div>
  );
};
