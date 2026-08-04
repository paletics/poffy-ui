'use client';

import { useBrand } from './BrandProvider';
import { useColorMode } from './ColorModeProvider';
import { useLocale } from './LocaleProvider';
import { useDirection } from './DirectionProvider';
import { useOptionalAnimation } from './AnimationProvider';
import { getCustomBrandStyle } from './brand-css-vars';
import {
  getThemeTokenOverrideStyle,
  normalizeThemeTokenOverrides,
  ThemeTokenOverrideProvider,
  useThemeTokenOverrides,
} from './theme-token-overrides';
import { useMotionScopeAttributes } from './useMotionScopeAttributes';
import { css, cx } from '@/styled-system/css';
import type { ThemeBoundaryProps } from './ThemeBoundary.types';

const boundaryClass = css({
  bg: 'layout.background',
  color: 'text.primary',
  transitionProperty: 'background',
  transitionDuration: 'standard',
});

const boundaryMotionClasses = {
  subtle: css({ transitionDuration: 'ultraFast', transitionTimingFunction: 'soft' }),
  standard: undefined,
  pop: css({ transitionDuration: 'standard', transitionTimingFunction: 'bounce' }),
  none: undefined,
} as const;

/**
 * Mirrors the nearest theme, locale, direction, motion, and token-override state onto a local DOM
 * boundary. Use inside ThemeProvider for an embedded or scoped subtree; it does not replace the
 * application-root provider stack.
 */
export const ThemeBoundary = ({ children, className, tokenOverrides }: ThemeBoundaryProps) => {
  const { brand, customBrandColors } = useBrand();
  const { resolvedColorMode } = useColorMode();
  const { locale } = useLocale();
  const { dir } = useDirection();
  const { isAnimating, resolvedMotionStyle } = useOptionalAnimation();
  const motionScopeAttributes = useMotionScopeAttributes(isAnimating, resolvedMotionStyle);
  // Runtime CSS variables are rendered directly so scoped custom brands match on server and client.
  const inheritedTokenOverrides = useThemeTokenOverrides();
  const resolvedTokenOverrides = {
    ...inheritedTokenOverrides,
    ...normalizeThemeTokenOverrides(tokenOverrides),
  };
  const customBrandStyle = brand === 'custom' ? getCustomBrandStyle(customBrandColors) : undefined;
  const style = {
    ...getThemeTokenOverrideStyle(resolvedTokenOverrides),
    ...customBrandStyle,
  };

  return (
    <ThemeTokenOverrideProvider overrides={resolvedTokenOverrides}>
      <div
        data-brand={brand}
        data-theme={resolvedColorMode}
        {...motionScopeAttributes}
        data-theme-boundary
        lang={locale}
        dir={dir}
        className={cx(boundaryClass, boundaryMotionClasses[resolvedMotionStyle], className)}
        style={style}
      >
        {children}
      </div>
    </ThemeTokenOverrideProvider>
  );
};
