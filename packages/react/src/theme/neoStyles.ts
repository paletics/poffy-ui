/**
 * Builds semantic token paths and CSS variable names for a neo intent.
 *
 * ### Notes
 * Intended for recipe authors who need both Panda token paths and the
 * matching runtime CSS variable names for derived color expressions.
 *
 * ### AI Usage
 * - **DO**: Use this helper in recipe/theme code when deriving neo variant colors.
 * - **DON'T**: Call from React components or public runtime render paths.
 *
 * @example
 * ```ts
 * const tokens = createNeoTokens('primary');
 * ```
 */
export const createNeoTokens = (intent: string) => {
  const tokenBase = `variants.${intent}`;

  return {
    main: `${tokenBase}.main`,
    contrast: `${tokenBase}.contrast`,
    border: `${tokenBase}.border`,
    surface: `${tokenBase}.surface`,
    hover: `${tokenBase}.hover`,
    mainToken: `var(--poffy-colors-variants-${intent}-main)`,
    borderToken: `var(--poffy-colors-variants-${intent}-border)`,
  } as const;
};

/**
 * Returns a readable overlay text color expression for a neo intent surface.
 *
 * ### Notes
 * Returns Panda-compatible token/color expressions. The special
 * `light` and `dark` intents are handled explicitly because mixing them like
 * brand colors can reduce contrast.
 *
 * ### AI Usage
 * - **DO**: Use with the `mainToken` returned by `createNeoTokens`.
 * - **DON'T**: Replace with raw hex values in recipes.
 */
export const createNeoOverlayTextColor = (mainToken: string, intent: string) => {
  if (intent === 'light') {
    return 'text.primary';
  }

  if (intent === 'dark') {
    return `[color-mix(in srgb, ${mainToken}, #FFFFFF 25%)]`;
  }

  return `[color-mix(in srgb, ${mainToken}, #000000 25%)]`;
};

/**
 * Returns a mixed shadow color expression derived from an intent main color.
 *
 * ### Notes
 * The returned string is a CSS `color-mix()` expression for recipe
 * values, not a resolved color.
 */
export const createNeoShadowColor = (mainToken: string) =>
  `color-mix(in srgb, ${mainToken} 70%, #000000 30%)`;

/**
 * Returns light and dark border color expressions derived from an intent main color.
 *
 * ### Notes
 * Use as a Panda conditional style object where both base and dark
 * mode border colors are needed.
 */
export const createNeoBorderColor = (mainToken: string) =>
  ({
    base: `color-mix(in srgb, ${mainToken} 25%, #000000 75%)`,
    _dark: `color-mix(in srgb, ${mainToken} 20%, #FFFFFF 80%)`,
  }) as const;
