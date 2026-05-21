import { accordion } from '@/styled-system/recipes';
import { RecipeVariantProps } from '@/styled-system/types';
import type { NavigationAppearance, PrimitiveProps } from '@poffy-ui/types';
import type { MotionPrimitiveProps } from '@/types/motion';
import { ElementType, ReactNode } from 'react';

/**
 * Variants for the Accordion component derived from the Panda CSS recipe.
 */
export type AccordionVariants = RecipeVariantProps<typeof accordion>;

/**
 * Public Accordion variant props with shared navigation appearance names.
 */
export interface AccordionVariantSubset extends Omit<AccordionVariants, 'appearance' | 'variant'> {
  /** Visual appearance mapped to the shared navigation appearance token set. */
  appearance?: NavigationAppearance;
  /**
   * Legacy appearance alias.
   */
  variant?: 'pop' | 'outline';
}

/**
 * Properties for the root Accordion component.
 *
 * @example
 * ```tsx
 * import {
 *   Accordion,
 *   AccordionContent,
 *   AccordionItem,
 *   AccordionTrigger,
 * } from '@poffy-ui/react/surfaces';
 * ```
 *
 * ### Notes
 * Required structure: `Accordion` contains `AccordionItem`; each item contains one
 * `AccordionTrigger` and one `AccordionContent`. Item `value` strings must be unique.
 *
 * Related APIs: `AccordionItemProps`, `AccordionContentProps`.
 *
 * Supports both controlled and uncontrolled state patterns.
 */
export type AccordionProps<T extends ElementType = 'div'> = PrimitiveProps<
  T,
  AccordionVariantSubset & {
    /** Whether multiple items can be open at the same time.
     * @defaultValue `false`
     */
    multiple?: boolean;
    /** The value(s) of the open item(s) when controlled. */
    value?: string | string[];
    /** Default value(s) for the initially open item(s). */
    defaultValue?: string | string[];
    /** Callback function fired when the open item(s) change. */
    onChange?: (value: string | string[]) => void;
    /** AccordionItem components to render. */
    children: ReactNode;
  }
>;

/**
 * Properties for an AccordionItem component.
 *
 * ### Notes
 * Do not reuse the same `value` in one Accordion root.
 */
export type AccordionItemProps<T extends ElementType = 'div'> = PrimitiveProps<
  T,
  {
    /** Unique value to identify this item. */
    value: string;
    disabled?: boolean;
    /** AccordionTrigger and AccordionContent components. */
    children: ReactNode;
  }
>;

/**
 * Properties for the AccordionTrigger component.
 *
 * ### Notes
 * Renders the interactive disclosure control. Do not nest buttons or links
 * inside the trigger content.
 */
export type AccordionTriggerProps<T extends ElementType = 'button'> = PrimitiveProps<
  T,
  {
    /** The clickable trigger content. */
    children: ReactNode;
  }
>;

/**
 * Properties for the AccordionContent component.
 *
 * ### AI Context & Architecture
 * Uses `MotionPrimitiveProps` (not `PrimitiveProps`) because AccordionContent renders
 * `CollapseTransition` as its root, which is a Framer Motion component.
 * Using `PrimitiveProps` (React HTML event types) would cause type conflicts on
 * shared event names such as `onDrag` whose signatures differ between React and Motion.
 * See `src/types/Polymorphic.ts` for the full rationale.
 */
export type AccordionContentProps = MotionPrimitiveProps<
  'div',
  {
    /** The collapsible content. */
    children: ReactNode;
  }
>;
