import { dividerStyle } from '@/styled-system/recipes';
import { JsxStyleProps, RecipeVariantProps } from '@/styled-system/types';
import { PrimitiveProps } from '@poffy-ui/types';

/**
 * Extracted variant types from the Panda CSS recipe.
 * ### AI Usage
 * - Use this when extending Divider styles.
 */
export type DividerVariants = RecipeVariantProps<typeof dividerStyle>;

/**
 * Base properties for the Divider component.
 * ### AI Usage
 * - Use to type-check Divider configurations without the outer div props.
 */
export type DividerBaseProps = DividerVariants &
  JsxStyleProps & {
    className?: string;
  };

/**
 * Comprehensive properties for the core Divider component.
 * ### AI Usage
 * - Use this to type-check Divider components.
 */
export type DividerProps = PrimitiveProps<'hr', DividerBaseProps>;
