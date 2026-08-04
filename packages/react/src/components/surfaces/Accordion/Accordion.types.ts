import { accordion } from '@/styled-system/recipes';
import { RecipeVariantProps } from '@/styled-system/types';
import type { NativeProps, NavigationAppearance, PrimitiveProps } from '@poffy-ui/types';
import type { MotionPrimitiveProps } from '@/types/motion';
import type { ReactNode } from 'react';
import type {
  AsChildHostProps,
  DefaultHostProps,
  PolymorphicAsChildComponent,
} from '@/components/shared/polymorphicAsChild.types';

type AccordionRecipeVariants = RecipeVariantProps<typeof accordion>;

/** Heading level exposed by each accordion trigger, or null to omit heading semantics. */
export type AccordionHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6 | null;

/**
 * Public Accordion variant props with shared navigation appearance names.
 */
export interface AccordionVariantSubset extends Omit<
  AccordionRecipeVariants,
  'appearance' | 'variant'
> {
  /** Visual appearance mapped to the shared navigation appearance token set. @defaultValue `'soft'` */
  appearance?: NavigationAppearance;
}

/** Canonical public variants accepted by Accordion. */
export type AccordionVariants = AccordionVariantSubset;

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
 * With `asChild`, provide one `article`, `div`, or `section` host (or a component
 * that forwards the same container contract); incompatible hosts fall back to `div`.
 *
 * Related APIs: `AccordionItemProps`, `AccordionContentProps`.
 *
 * Supports both controlled and uncontrolled state patterns.
 */
type AccordionNativeProps = Omit<
  PrimitiveProps<
    'div',
    AccordionVariantSubset & {
      /**
       * Accessible heading level used by every trigger wrapper. Pass `null` when
       * surrounding markup already supplies the heading structure.
       * @defaultValue `3`
       */
      headingLevel?: AccordionHeadingLevel;
      /** AccordionItem components to render. */
      children: ReactNode;
    }
  >,
  'defaultValue' | 'onChange' | 'value'
>;

type AccordionDefaultBaseProps = DefaultHostProps<AccordionNativeProps>;
type AccordionAsChildBaseProps = AsChildHostProps<AccordionNativeProps>;
type AccordionHostProps = AccordionDefaultBaseProps | AccordionAsChildBaseProps;

type ControlledSingleAccordionStateProps = {
  multiple?: false;
  value: string | null;
  defaultValue?: never;
  onChange: (value: string | null) => void;
};

type UncontrolledSingleAccordionStateProps = {
  multiple?: false;
  value?: never;
  defaultValue?: string | null;
  onChange?: (value: string | null) => void;
};

type ControlledMultipleAccordionStateProps = {
  multiple: true;
  value: string[];
  defaultValue?: never;
  onChange: (value: string[]) => void;
};

type UncontrolledMultipleAccordionStateProps = {
  multiple: true;
  value?: never;
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
};

type AccordionStateProps =
  | ControlledSingleAccordionStateProps
  | UncontrolledSingleAccordionStateProps
  | ControlledMultipleAccordionStateProps
  | UncontrolledMultipleAccordionStateProps;

/** Props for a controlled single-open Accordion; reflect `onChange` to update `value`. */
export type ControlledSingleAccordionProps = AccordionHostProps &
  ControlledSingleAccordionStateProps;
/** Props for an uncontrolled single-open Accordion initialized by `defaultValue`. */
export type UncontrolledSingleAccordionProps = AccordionHostProps &
  UncontrolledSingleAccordionStateProps;
/** Props for a controlled multi-open Accordion; `onChange` receives the complete next value set. */
export type ControlledMultipleAccordionProps = AccordionHostProps &
  ControlledMultipleAccordionStateProps;
/** Props for an uncontrolled multi-open Accordion initialized by `defaultValue`. */
export type UncontrolledMultipleAccordionProps = AccordionHostProps &
  UncontrolledMultipleAccordionStateProps;

/** Props for Accordion's owned div host in either state mode. */
export type AccordionDefaultProps = AccordionDefaultBaseProps & AccordionStateProps;
/** Props for Accordion delegated to its constrained `asChild` container host. */
export type AccordionAsChildProps = AccordionAsChildBaseProps & AccordionStateProps;
/** Props accepted by Accordion's owned or delegated root. */
export type AccordionProps = AccordionDefaultProps | AccordionAsChildProps;
/** Ref-forwarding public component signature for Accordion. */
export type AccordionComponent = PolymorphicAsChildComponent<
  AccordionDefaultProps,
  AccordionAsChildProps,
  HTMLDivElement
>;

/**
 * Properties for an AccordionItem component.
 *
 * ### Notes
 * Do not reuse the same `value` in one Accordion root.
 * With `asChild`, provide one `article`, `div`, or `section` host (or a component
 * that forwards the same container contract); incompatible hosts fall back to `div`.
 */
type AccordionItemNativeProps = PrimitiveProps<
  'div',
  {
    /** Unique value to identify this item. */
    value: string;
    /** Disables activation and removes the item's panel/trigger ARIA linkage. */
    disabled?: boolean;
    /** AccordionTrigger and AccordionContent components. */
    children: ReactNode;
  }
>;

/** Props for AccordionItem's owned div host. */
export type AccordionItemDefaultProps = DefaultHostProps<AccordionItemNativeProps>;
/** Props for AccordionItem delegated to its constrained `asChild` container host. */
export type AccordionItemAsChildProps = AsChildHostProps<AccordionItemNativeProps>;
/** Props accepted by AccordionItem's owned or delegated host. */
export type AccordionItemProps = AccordionItemDefaultProps | AccordionItemAsChildProps;
/** Ref-forwarding public component signature for AccordionItem. */
export type AccordionItemComponent = PolymorphicAsChildComponent<
  AccordionItemDefaultProps,
  AccordionItemAsChildProps,
  HTMLDivElement
>;

/**
 * Properties for the AccordionTrigger component.
 *
 * ### Notes
 * Renders the interactive disclosure control. Do not nest buttons or links
 * inside the trigger content.
 */
export type AccordionTriggerProps = Omit<
  NativeProps<
    'button',
    {
      /** The clickable trigger content. */
      children: ReactNode;
    }
  >,
  | 'aria-controls'
  | 'aria-disabled'
  | 'aria-expanded'
  | 'aria-haspopup'
  | 'aria-pressed'
  | 'aria-selected'
  | 'disabled'
  | 'id'
  | 'role'
  | 'tabIndex'
  | 'type'
>;

/** Props for an animated Accordion content panel. */
export type AccordionContentProps = MotionPrimitiveProps<
  'div',
  {
    /** The collapsible content. */
    children: ReactNode;
    /** Whether the controlled collapse should animate on its first mount. */
    initial?: boolean;
  }
>;
