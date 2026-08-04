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
  PoffyBuiltInBrand,
} from './BrandProvider.types';
import {
  applyCustomBrandVars,
  CUSTOM_BRAND_VARIABLES,
  removeCustomBrandVars,
} from './brand-css-vars';
import { createGlobalDocumentOwnerStack } from './globalDocumentOwnership';
import { ProviderScope } from './ProviderScope';
import { useGlobalDocumentOwner } from './useGlobalDocumentOwner';
import { useGlobalPreferenceRestoreGate } from './useGlobalPreferenceRestoreGate';

/**
 * Public brand provider context, brand name, and custom color types.
 */
export type {
  PoffyBrand,
  PoffyBuiltInBrand,
  BrandContextType,
  CustomBrandColors,
} from './BrandProvider.types';

const BRAND_STORAGE_KEY = 'poffy-brand';
const CUSTOM_BRAND_STORAGE_KEY = 'poffy-custom-brand';

const BrandContext = createContext<BrandContextType | undefined>(undefined);

interface StyleVariableSnapshot {
  value: string;
  priority: string;
}
type BrandDocumentState = Pick<BrandContextType, 'brand' | 'customBrandColors'>;
interface BrandDocumentSnapshot {
  brand: string | null;
  variables: Record<(typeof CUSTOM_BRAND_VARIABLES)[number], StyleVariableSnapshot>;
}

const isCustomBrandColors = (value: unknown): value is CustomBrandColors => {
  if (!value || typeof value !== 'object') return false;
  const colors = value as Partial<CustomBrandColors>;
  const isOptionalString = (candidate: unknown) =>
    candidate === undefined ? true : typeof candidate === 'string';
  return (
    typeof colors.main === 'string' &&
    colors.main.length > 0 &&
    isOptionalString(colors.contrast) &&
    isOptionalString(colors.mainDark) &&
    isOptionalString(colors.contrastDark)
  );
};

const brandOwnerStack = createGlobalDocumentOwnerStack<BrandDocumentState, BrandDocumentSnapshot>({
  capture: (targetDocument) => ({
    brand: targetDocument.documentElement.getAttribute('data-brand'),
    variables: Object.fromEntries(
      CUSTOM_BRAND_VARIABLES.map((variable) => [
        variable,
        {
          value: targetDocument.documentElement.style.getPropertyValue(variable),
          priority: targetDocument.documentElement.style.getPropertyPriority(variable),
        },
      ]),
    ) as BrandDocumentSnapshot['variables'],
  }),
  apply: (targetDocument, { brand, customBrandColors }) => {
    const element = targetDocument.documentElement;
    element.setAttribute('data-brand', brand);
    if (brand === 'custom' && customBrandColors) applyCustomBrandVars(element, customBrandColors);
    else removeCustomBrandVars(element);
  },
  restore: (targetDocument, { brand, variables }) => {
    const element = targetDocument.documentElement;
    if (brand === null) element.removeAttribute('data-brand');
    else element.setAttribute('data-brand', brand);
    for (const variable of CUSTOM_BRAND_VARIABLES) {
      const { value, priority } = variables[variable];
      if (value) element.style.setProperty(variable, value, priority);
      else element.style.removeProperty(variable);
    }
  },
  onActiveChange: (targetDocument, { brand, customBrandColors }) => {
    try {
      const storage = targetDocument.defaultView?.localStorage;
      storage?.setItem(BRAND_STORAGE_KEY, brand);
      if (brand === 'custom' && customBrandColors) {
        storage?.setItem(CUSTOM_BRAND_STORAGE_KEY, JSON.stringify(customBrandColors));
      } else {
        storage?.removeItem(CUSTOM_BRAND_STORAGE_KEY);
      }
    } catch {
      // localStorage unavailable (e.g. private browsing, storage quota exceeded)
    }
  },
});

/**
 * Provides blue, pome, or custom-brand state to a subtree. At the application root, `global`
 * synchronizes `data-brand` and custom color variables to the owner document and restores persisted
 * preferences after hydration; local scoped providers leave the document unchanged.
 */
export const PoffyBrandProvider = ({
  children,
  initialBrand = 'blue',
  global = true,
  ownerDocument,
  scope = false,
  customBrand: customBrandProp,
}: BrandProviderProps): ReactElement => {
  const resolvedOwnerDocument =
    ownerDocument ?? (typeof document === 'undefined' ? undefined : document);
  const hasInitialCustomPalette = initialBrand === 'custom' && customBrandProp !== undefined;
  const [brand, setBrandState] = useState<PoffyBrand>(
    hasInitialCustomPalette ? 'custom' : initialBrand === 'custom' ? 'blue' : initialBrand,
  );

  const [customBrandColors, setCustomBrandColors] = useState<CustomBrandColors | undefined>(
    customBrandProp,
  );

  const setCustomBrand = useCallback((colors: CustomBrandColors) => {
    if (!isCustomBrandColors(colors)) return;
    setCustomBrandColors(colors);
    setBrandState('custom');
  }, []);

  const setBrand = useCallback((nextBrand: PoffyBuiltInBrand) => {
    if (nextBrand !== 'blue' && nextBrand !== 'pome') return;
    setBrandState(nextBrand);
  }, []);

  useEffect(() => {
    setCustomBrandColors(customBrandProp);
  }, [customBrandProp]);

  const restorePreferences = useCallback(() => {
    try {
      const storage = resolvedOwnerDocument?.defaultView?.localStorage;
      const saved = storage?.getItem(BRAND_STORAGE_KEY);
      if (saved === 'blue' || saved === 'pome') setBrandState(saved);
      if (saved === 'custom') {
        const storedColors = storage?.getItem(CUSTOM_BRAND_STORAGE_KEY);
        if (storedColors) {
          const parsedColors: unknown = JSON.parse(storedColors);
          if (isCustomBrandColors(parsedColors)) {
            setCustomBrandColors(parsedColors);
            setBrandState('custom');
          }
        } else if (customBrandProp) {
          setBrandState('custom');
        }
      }
    } catch {
      // localStorage unavailable (e.g. private browsing, storage quota exceeded)
    }
  }, [customBrandProp, resolvedOwnerDocument]);

  const documentState = useMemo(() => ({ brand, customBrandColors }), [brand, customBrandColors]);
  const canOwnDocument = useGlobalPreferenceRestoreGate({
    enabled: global,
    restore: restorePreferences,
    restoreKey: resolvedOwnerDocument,
  });
  useGlobalDocumentOwner(brandOwnerStack, documentState, canOwnDocument, resolvedOwnerDocument);

  const contextValue = useMemo(
    () => ({
      brand,
      setBrand,
      customBrandColors: brand === 'custom' ? customBrandColors : undefined,
      setCustomBrand,
    }),
    [brand, customBrandColors, setBrand, setCustomBrand],
  );

  return (
    <BrandContext.Provider value={contextValue}>
      {!global && scope ? (
        <ProviderScope brand={brand} customBrandColors={customBrandColors}>
          {children}
        </ProviderScope>
      ) : (
        children
      )}
    </BrandContext.Provider>
  );
};

/** Returns the nearest brand state and controls, or throws when no provider is present. */
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
