'use client';

import {
  createContext,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type {
  BrandContextType,
  BrandProviderProps,
  CustomBrandColors,
  PoffyBrand,
} from './BrandProvider.types';
import { applyCustomBrandVars, removeCustomBrandVars } from './brand-css-vars';

/**
 * Public brand provider context, brand name, and custom color types.
 */
export type { PoffyBrand, BrandContextType, CustomBrandColors } from './BrandProvider.types';

const BRAND_STORAGE_KEY = 'poffy-brand';
const VALID_BRANDS: readonly PoffyBrand[] = ['blue', 'pome', 'custom'];

const BrandContext = createContext<BrandContextType | undefined>(undefined);

/**
 * Injects the active brand token (`blue` / `pome` / `custom`) into the component tree
 * and marks `document.documentElement` with a `data-brand` attribute for Panda CSS token resolution.
 *
 * ### AI Context & Architecture
 * - **Tier**: Provider / Infrastructure
 * - **Scope**: App Root — place once in `_app.tsx` or `layout.tsx`
 * - **SSR Safety**: `brand` lazy-initializes from `localStorage` (client-only, SSR guard applied).
 * - **Persistence**: `localStorage` write only occurs when `global=true`.
 *
 * ### AI Usage
 * - **DO**: Place at the top of the React tree alongside `ColorModeProvider`.
 * - **DON'T**: Do not nest two `PoffyBrandProvider` instances — the inner one silently overrides the outer.
 * - **DON'T**: Set `global={false}` at the app root — `data-brand` will not be set on `document.documentElement`.
 *
 * @example
 * ```tsx
 * import { PoffyBrandProvider } from '@poffy-ui/react';
 *
 * // App root — global mode (default)
 * <PoffyBrandProvider initialBrand="blue">
 *   <App />
 * </PoffyBrandProvider>
 * ```
 *
 * @example
 * ```tsx
 * import { PoffyBrandProvider } from '@poffy-ui/react';
 *
 * // Scoped mode — does not touch document.documentElement
 * <PoffyBrandProvider initialBrand="pome" global={false}>
 *   <Widget />
 * </PoffyBrandProvider>
 * ```
 */
export const PoffyBrandProvider = ({
  children,
  initialBrand = 'blue',
  global = true,
  customBrand: customBrandProp,
}: BrandProviderProps): ReactElement => {
  const [brand, setBrand] = useState<PoffyBrand>(() => {
    if (typeof window === 'undefined') return initialBrand;
    if (!global) return initialBrand;
    try {
      const saved = localStorage.getItem(BRAND_STORAGE_KEY);
      if (saved !== null && (VALID_BRANDS as readonly string[]).includes(saved)) {
        return saved as PoffyBrand;
      }
    } catch {
      // localStorage unavailable (e.g. private browsing, storage quota exceeded)
    }
    return initialBrand;
  });

  const [customBrandColors, setCustomBrandColors] = useState<CustomBrandColors | undefined>(
    customBrandProp,
  );

  const setCustomBrand = useCallback((colors: CustomBrandColors) => {
    setCustomBrandColors(colors);
    setBrand('custom');
  }, []);

  useEffect(() => {
    setCustomBrandColors(customBrandProp);
  }, [customBrandProp]);

  useEffect(() => {
    if (!global) return;

    const el = document.documentElement;
    el.setAttribute('data-brand', brand);

    if (brand === 'custom' && customBrandColors) {
      applyCustomBrandVars(el, customBrandColors);
    } else {
      removeCustomBrandVars(el);
    }

    try {
      localStorage.setItem(BRAND_STORAGE_KEY, brand);
    } catch {
      // localStorage unavailable (e.g. private browsing, storage quota exceeded)
    }
  }, [brand, customBrandColors, global]);

  const contextValue = useMemo(
    () => ({ brand, setBrand, customBrandColors, setCustomBrand }),
    [brand, customBrandColors, setCustomBrand],
  );

  return <BrandContext.Provider value={contextValue}>{children}</BrandContext.Provider>;
};

/**
 * Returns the current brand state and controls from the nearest `PoffyBrandProvider`.
 *
 * ### AI Usage
 * - **DON'T**: Do not call outside a `PoffyBrandProvider` tree — throws at runtime
 *
 * @returns `{ brand, setBrand, customBrandColors, setCustomBrand }`
 *
 * @example
 * ```tsx
 * import { useBrand } from '@poffy-ui/react';
 *
 * const { brand, setBrand } = useBrand();
 * ```
 */
export const useBrand = (): BrandContextType => {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrand must be used within a PoffyBrandProvider.');
  }
  return context;
};

/**
 * Returns the nearest brand context when one exists.
 *
 * Use this only for provider-tolerant components that can fall back to their
 * own defaults. Application code should use `useBrand()` so missing providers
 * fail loudly.
 */
export const useOptionalBrand = (): BrandContextType | undefined => useContext(BrandContext);
