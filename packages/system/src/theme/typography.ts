import type { Tokens } from '@pandacss/dev';
import { baseTokens } from './tokens';

/**
 * Poffy UI typography size tokens.
 *
 * ### Notes
 * Values are mapped from `baseTokens.fontSizes` into Panda's `{ value }` token
 * shape. Add or rename typography primitives in `tokens.ts` first so this file
 * stays a projection of the canonical source.
 */
export const fontSizes = {
  '2xs': { value: baseTokens.fontSizes['2xs'] },
  xs: { value: baseTokens.fontSizes.xs },
  sm: { value: baseTokens.fontSizes.sm },
  md: { value: baseTokens.fontSizes.md },
  lg: { value: baseTokens.fontSizes.lg },
  xl: { value: baseTokens.fontSizes.xl },
  '2xl': { value: baseTokens.fontSizes['2xl'] },
  '3xl': { value: baseTokens.fontSizes['3xl'] },
  '4xl': { value: baseTokens.fontSizes['4xl'] },
} satisfies NonNullable<Tokens['fontSizes']>;

/**
 * Font weight tokens mapped from the base token source.
 *
 * ### Notes
 * Consumers should reference these by token name, not numeric literals, so
 * theme overrides can remain centralized.
 */
export const fontWeights = {
  normal: { value: baseTokens.fontWeights.normal },
  medium: { value: baseTokens.fontWeights.medium },
  semibold: { value: baseTokens.fontWeights.semibold },
  bold: { value: baseTokens.fontWeights.bold },
} satisfies NonNullable<Tokens['fontWeights']>;

/**
 * Line height tokens mapped from the base token source.
 *
 * ### Notes
 * These unitless values are intended for text styles and component recipes that
 * need predictable vertical rhythm across brands.
 */
export const lineHeights = {
  none: { value: baseTokens.lineHeights.none },
  tight: { value: baseTokens.lineHeights.tight },
  snug: { value: baseTokens.lineHeights.snug },
  normal: { value: baseTokens.lineHeights.normal },
  relaxed: { value: baseTokens.lineHeights.relaxed },
  loose: { value: baseTokens.lineHeights.loose },
} satisfies NonNullable<Tokens['lineHeights']>;
