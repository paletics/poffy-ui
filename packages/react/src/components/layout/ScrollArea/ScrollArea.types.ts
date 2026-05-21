import { scrollArea } from '@/styled-system/recipes';
import { RecipeVariantProps } from '@/styled-system/types';
import { PrimitiveProps } from '@poffy-ui/types';
import { ElementType, ReactNode } from 'react';

/**
 * Variants for the ScrollArea component derived from Panda CSS recipe.
 * ### AI Usage
 * - Use this when extending ScrollArea styles.
 */
export type ScrollAreaVariants = RecipeVariantProps<typeof scrollArea>;

/**
 * Scroll direction(s) to enable custom scrollbars for.
 *
 * ### Notes
 * The content can still overflow naturally; this controls which custom
 * scrollbar controls are rendered.
 */
export type ScrollOrientation = 'vertical' | 'horizontal' | 'both';

/**
 * Public props for the ScrollArea component.
 *
 * @example
 * ```tsx
 * import { ScrollArea } from '@poffy-ui/react/layout';
 *
 * <ScrollArea height="300px">
 *   <LongContent />
 * </ScrollArea>
 * ```
 *
 * ### Notes
 * `ScrollArea` owns its internal viewport and scrollbar structure. Do not use
 * `asChild`; pass root attributes such as `aria-label`, `height`, or `width`
 * directly to the component.
 *
 * ### AI Usage
 * - Do: add an accessible label when the scroll region is not obvious from context.
 * - Don't: wrap focusable content in another scroll container inside ScrollArea.
 */
export type ScrollAreaProps<T extends ElementType = 'div'> = PrimitiveProps<
  T,
  ScrollAreaVariants & {
    /** Content to be scrolled. */
    children: ReactNode;
    /**
     * Which direction(s) to enable custom scrollbars for.
     * @defaultValue 'vertical'
     */
    orientation?: ScrollOrientation;
  }
>;
