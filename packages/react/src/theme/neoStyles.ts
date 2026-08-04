/**
 * Internal recipe helpers for the `neo` appearance.
 *
 * These values are Panda recipe fragments, token paths, or CSS expressions rather than resolved
 * browser colors. They are intentionally not exported from the package public API.
 */

/**
 * Creates the semantic token paths and CSS custom-property references for one neo intent.
 *
 * The returned values are consumed by Panda recipes to keep an intent's foreground, background,
 * border, and interaction colors aligned. They are token paths and CSS variable references, not
 * resolved browser colors.
 *
 * @param intent - Variant intent segment below `variants.` (for example, `primary` or `danger`).
 * @returns Token paths plus main and border CSS custom-property references for that intent.
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
 * Creates the overlay text color expression for a neo surface derived from an intent main color.
 *
 * `light` uses the theme primary text token, `dark` mixes the main color toward white, and all
 * other intents mix it toward black. The result is a Panda bracketed CSS expression or token path,
 * not a resolved color.
 *
 * @param mainToken - CSS color expression for the intent's main color.
 * @param intent - Variant intent used to select the light/dark contrast exception.
 * @returns A Panda-compatible token path or bracketed CSS color expression for overlay text.
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
 * Creates the hard-shadow color expression for a neo surface derived from its main color.
 *
 * The returned value is a CSS `color-mix()` expression for Panda recipe values, not a resolved
 * browser color. It mixes the main color 70% toward black to give the offset shadow its contrast.
 *
 * @param mainToken - CSS color expression for the intent's main color.
 * @returns A CSS color-mix expression for a neo hard shadow.
 */
export const createNeoShadowColor = (mainToken: string) =>
  `color-mix(in srgb, ${mainToken} 70%, #000000 30%)`;

/**
 * Creates base and dark-mode border color expressions for a neo surface.
 *
 * The returned Panda conditional style object derives both colors from the same main token: the
 * base value mixes toward black and the dark value mixes toward white. Neither value is resolved.
 *
 * @param mainToken - CSS color expression for the intent's main color.
 * @returns Panda base and `_dark` border color expressions.
 */
export const createNeoBorderColor = (mainToken: string) =>
  ({
    base: `color-mix(in srgb, ${mainToken} 25%, #000000 75%)`,
    _dark: `color-mix(in srgb, ${mainToken} 20%, #FFFFFF 80%)`,
  }) as const;
