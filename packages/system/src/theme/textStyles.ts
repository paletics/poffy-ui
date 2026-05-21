import type { TextStyles } from '@pandacss/dev';
import { baseTokens } from './tokens';

/**
 * Global text styles for the design system.
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
