import type { ReactNode } from 'react';

/**
 * Built-in brands (`'blue'`, `'pome'`) resolve via static Panda CSS semantic tokens.
 * `'custom'` enables runtime color overrides via the `customBrand` prop on `PoffyBrandProvider`.
 */
export type PoffyBrand = 'pome' | 'blue' | 'custom';

/**
 * Color overrides for the `'custom'` brand.
 * Only `main` is required — all derived colors (hover, active, surface, etc.) are computed
 * automatically via CSS `color-mix()`.
 */
export interface CustomBrandColors {
  /** Primary brand color in light mode (any valid CSS color). */
  main: string;
  /** Text color rendered on top of `main` in light mode. Defaults to `'#FFFFFF'`. */
  contrast?: string;
  /** Primary brand color in dark mode. Defaults to `main`. */
  mainDark?: string;
  /** Text color rendered on top of `main` in dark mode. Defaults to `contrast`. */
  contrastDark?: string;
}

/**
 * Shape of the value exposed by `BrandContext`.
 * Use to type the return value of `useBrand()` or when extending the context.
 */
export interface BrandContextType {
  /** The currently active brand. */
  brand: PoffyBrand;
  /** Sets the active brand. */
  setBrand: (brand: PoffyBrand) => void;
  /**
   * The current custom brand color overrides.
   * Only meaningful when `brand === 'custom'`. `undefined` otherwise.
   */
  customBrandColors: CustomBrandColors | undefined;
  /**
   * Updates the custom brand colors and automatically switches `brand` to `'custom'`.
   * Calling this without first calling `setBrand('custom')` is safe — the switch is implicit.
   */
  setCustomBrand: (colors: CustomBrandColors) => void;
}

/**
 * Props for the `PoffyBrandProvider` component.
 */
export interface BrandProviderProps {
  /** The React subtree that receives brand context. */
  children: ReactNode;
  /**
   * The brand applied on first render.
   *
   * @defaultValue `'blue'`
   */
  initialBrand?: PoffyBrand;
  /**
   * When `true`, syncs `data-brand` to `document.documentElement` and persists to `localStorage`.
   * Set to `false` when scoping brand to a subtree only.
   *
   * @defaultValue `true`
   */
  global?: boolean;
  /**
   * Color values for the `'custom'` brand.
   * Required when `initialBrand` is `'custom'`. Ignored for built-in brands.
   */
  customBrand?: CustomBrandColors;
}
