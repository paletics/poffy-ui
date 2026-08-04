import type { ReactNode } from 'react';

/**
 * Built-in brands (`'blue'`, `'pome'`) resolve via static Panda CSS semantic tokens.
 * `'custom'` enables runtime color overrides via the `customBrand` prop on `PoffyBrandProvider`.
 */
export type PoffyBuiltInBrand = 'pome' | 'blue';

/** Every brand identifier supported by the provider runtime. */
export type PoffyBrand = PoffyBuiltInBrand | 'custom';

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
  /** Activates a built-in brand. Use `setCustomBrand` for custom palettes. */
  setBrand: (brand: PoffyBuiltInBrand) => void;
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
interface BrandProviderBaseProps {
  /** The React subtree that receives brand context. */
  children: ReactNode;
  /**
   * When `true`, syncs `data-brand` to `document.documentElement` and persists the brand,
   * including a custom palette, to `localStorage`.
   * Set to `false` when scoping brand to a subtree only.
   *
   * @defaultValue `true`
   */
  global?: boolean;
  /** Document whose root and storage receive global brand state. */
  ownerDocument?: Document;
  /**
   * When `global={false}`, renders a local DOM boundary with `data-brand` and
   * custom brand CSS variables when the active brand is `'custom'`.
   *
   * @defaultValue `false`
   */
  scope?: boolean;
}

interface BuiltInBrandProviderProps extends BrandProviderBaseProps {
  /**
   * The built-in brand applied on first render.
   *
   * @defaultValue `'blue'`
   */
  initialBrand?: PoffyBuiltInBrand;
  customBrand?: never;
}

interface CustomBrandProviderProps extends BrandProviderBaseProps {
  /** Activates the supplied custom palette on first render. */
  initialBrand: 'custom';
  /** Custom colors required by the custom brand. */
  customBrand: CustomBrandColors;
}

/** Props for a built-in or fully configured custom brand provider. */
export type BrandProviderProps = BuiltInBrandProviderProps | CustomBrandProviderProps;
