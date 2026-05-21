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
 * PictureOwnProps
 *
 * Properties specific to the Picture component, including:
 * - `PictureRecipeVariants`: Variants defined in the Panda CSS recipe (e.g., `fit`).
 *
 * Related: `PictureRecipeVariants`
 */
export type PictureOwnProps = PictureRecipeVariants;

/**
 * PictureProps
 *
 * The public props for the Picture component.
 *
 * @example
 * ```tsx
 * import { Picture } from '@poffy-ui/react/media';
 *
 * <Picture fit="cover">
 *   <source srcSet="photo.webp" type="image/webp" />
 *   <img src="photo.jpg" alt="A landscape" />
 * </Picture>
 * ```
 *
 * ### Notes
 * Do: make the fallback `<img>` the final child and give it appropriate `alt` text.
 * Don't: put multiple `<img>` children inside Picture; browsers use the last
 * image fallback semantics.
 *
 * ### AI Usage
 * - Use Picture for format switching, density switching, or art direction.
 * - Use Image from `@poffy-ui/react/media` for a single source with fallback handling.
 */
export type PictureProps = NativeProps<'picture', PictureOwnProps>;
