'use client';

import { type ReactNode } from 'react';
import { useOptionalAnimation } from './AnimationProvider';
import { useOptionalBrand } from './BrandProvider';
import { useOptionalColorMode } from './ColorModeProvider';
import { useOptionalDirection } from './DirectionProvider';
import { useOptionalLocale } from './LocaleProvider';
import { MotionScope } from './MotionScope';
import { getCustomBrandStyle } from './brand-css-vars';
import { getThemeTokenOverrideStyle, useThemeTokenOverrides } from './theme-token-overrides';

interface MotionPortalScopeProps {
  children: ReactNode;
}

/**
 * Recreates motion, brand, color mode, locale, direction, and runtime token
 * override scopes after React content crosses a portal.
 * This is internal infrastructure for overlays and feedback layers.
 */
export const MotionPortalScope = ({ children }: MotionPortalScopeProps) => {
  const { isAnimating, resolvedMotionStyle } = useOptionalAnimation();
  const brandContext = useOptionalBrand();
  const colorModeContext = useOptionalColorMode();
  const directionContext = useOptionalDirection();
  const localeContext = useOptionalLocale();
  const brand = brandContext?.brand;
  const customBrandColors = brandContext?.customBrandColors;
  const tokenOverrides = useThemeTokenOverrides();
  const customBrandStyle = brand === 'custom' ? getCustomBrandStyle(customBrandColors) : undefined;
  const style = { ...getThemeTokenOverrideStyle(tokenOverrides), ...customBrandStyle };

  return (
    <MotionScope isAnimating={isAnimating} motionStyle={resolvedMotionStyle}>
      <div
        data-brand={brand}
        data-theme={colorModeContext?.resolvedColorMode}
        lang={localeContext?.locale}
        dir={directionContext?.dir}
        style={style}
      >
        {children}
      </div>
    </MotionScope>
  );
};
