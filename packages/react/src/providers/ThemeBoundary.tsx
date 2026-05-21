'use client';

import { useEffect, useRef } from 'react';
import { useBrand } from './BrandProvider';
import { useColorMode } from './ColorModeProvider';
import { useLocale } from './LocaleProvider';
import { useDirection } from './DirectionProvider';
import { applyCustomBrandVars, removeCustomBrandVars } from './brand-css-vars';
import { css, cx } from '@/styled-system/css';
import type { ThemeBoundaryProps } from './ThemeBoundary.types';

const boundaryClass = css({
  bg: 'layout.background',
  color: 'text.primary',
  transitionProperty: 'background',
  transitionDuration: 'standard',
});

/**
 * A scoped theme container that applies `data-brand` and `data-theme` attributes to its
 * subtree, restricting Panda CSS semantic token resolution to the local DOM boundary.
 *
 * ### AI Context & Architecture
 * - **Tier**: Provider / Infrastructure
 * - **Scope**: Feature Boundary — wraps subsections that need an isolated brand or color mode
 * - **Stack**: Panda CSS (semantic tokens), `useBrand`, `useColorMode`, `useLocale`, `useDirection`
 * - **Props**: `ThemeBoundaryProps`
 *
 * ### Design Tokens
 * - **color**: `layout.background`, `text.primary` — semantic tokens only, no raw hex
 * - **transition**: `transitionDuration.standard` on `background`
 *
 * ### Accessibility
 * - **Role**: generic (`div`) — purely a layout / scoping wrapper, no ARIA semantics
 *
 * ### AI Usage
 * - **DO**: Use when a page subsection must render under a different brand or color mode
 *   than the root `ThemeProvider`.
 * - **DON'T**: Do not use as a substitute for `ThemeProvider` at the app root.
 * - **DON'T**: Do not nest `ThemeBoundary` inside itself unnecessarily — each instance
 *   re-reads context, adding render overhead.
 *
 * @example Scoped brand override
 * ```tsx
 * import { ThemeBoundary } from '@poffy-ui/react';
 *
 * <ThemeBoundary className="embedded-poffy-scope">
 *   <Card />
 * </ThemeBoundary>
 * ```
 */
export const ThemeBoundary = ({ children, className }: ThemeBoundaryProps) => {
  const { brand, customBrandColors } = useBrand();
  const { resolvedColorMode } = useColorMode();
  const { locale } = useLocale();
  const { dir } = useDirection();
  const ref = useRef<HTMLDivElement>(null);

  // Apply / remove custom brand CSS variables directly on the boundary element.
  // This mirrors what BrandProvider does on document.documentElement in global mode,
  // but scoped to this div so global=false + custom brand works correctly.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (brand === 'custom' && customBrandColors) {
      applyCustomBrandVars(el, customBrandColors);
    } else {
      removeCustomBrandVars(el);
    }
  }, [brand, customBrandColors]);

  return (
    <div
      ref={ref}
      data-brand={brand}
      data-theme={resolvedColorMode}
      lang={locale}
      dir={dir}
      className={cx(boundaryClass, className)}
    >
      {children}
    </div>
  );
};
