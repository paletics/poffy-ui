import type { TextStyles } from '@pandacss/dev';
import { baseTokens } from './tokens';

/**
 * Panda text-style definitions backed by the corresponding `baseTokens.textStyles` entries.
 *
 * The exported names (`h1`–`h6`, `body1`, `body2`, `caption`, and `button`) are available after
 * installing `poffyPreset`; they define typography only and do not add document semantics.
 */
export const textStyles = {
  h1: { value: baseTokens.textStyles.h1 },
  h2: { value: baseTokens.textStyles.h2 },
  h3: { value: baseTokens.textStyles.h3 },
  h4: { value: baseTokens.textStyles.h4 },
  h5: { value: baseTokens.textStyles.h5 },
  h6: { value: baseTokens.textStyles.h6 },
  body1: { value: baseTokens.textStyles.body1 },
  body2: { value: baseTokens.textStyles.body2 },
  caption: { value: baseTokens.textStyles.caption },
  button: { value: baseTokens.textStyles.button },
} satisfies TextStyles;
