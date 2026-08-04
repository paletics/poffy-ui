import { RecipeVariantProps } from '@/styled-system/css';
import { picture } from '@/styled-system/recipes';
import { NativeProps } from '@poffy-ui/types';

/**
 * Variants for Picture based on the Panda CSS recipe.
 *
 * ### Notes
 * Prefer `PictureProps` for component usage. Use this type for
 * wrappers that expose the same `fit` behavior.
 */
export type PictureRecipeVariants = RecipeVariantProps<typeof picture>;

/**
 * Visual recipe props applied to the native `picture` element.
 */
export type PictureOwnProps = PictureRecipeVariants;

/**
 * Props for responsive-image art direction. Provide zero or more direct `source` children followed by
 * one final `img`; source selection does not retry a URL after a network failure.
 */
export type PictureProps = NativeProps<'picture', PictureOwnProps>;
