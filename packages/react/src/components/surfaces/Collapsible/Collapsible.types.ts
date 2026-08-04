import type { MotionPrimitiveProps } from '@/types/motion';
import { collapsible } from '@/styled-system/recipes';
import type { RecipeVariantProps } from '@/styled-system/types';
import type { NavigationAppearance, PrimitiveProps } from '@poffy-ui/types';
import type { ReactNode } from 'react';
import type { DelegatedButtonHostProps } from '@/components/shared/buttonDelegation';
import type {
  AsChildHostProps,
  DefaultHostProps,
  PolymorphicAsChildComponent,
  RetargetedAsChildHostProps,
} from '@/components/shared/polymorphicAsChild.types';

/** Public visual variant props for Collapsible. */
export type CollapsibleVariants = RecipeVariantProps<typeof collapsible>;

/** Public visual variant subset for Collapsible. */
export interface CollapsibleVariantSubset extends Omit<
  CollapsibleVariants,
  'appearance' | 'variant'
> {
  appearance?: NavigationAppearance;
}

type CollapsibleNativeProps = PrimitiveProps<
  'div',
  CollapsibleVariantSubset & {
    disabled?: boolean;
    /**
     * One `CollapsibleTrigger` and one matching `CollapsibleContent`.
     * Multiple disclosure pairs require separate Collapsible roots.
     */
    children: ReactNode;
  }
>;

type CollapsibleDefaultBaseProps = DefaultHostProps<CollapsibleNativeProps>;
type CollapsibleAsChildBaseProps = AsChildHostProps<CollapsibleNativeProps>;

type ControlledCollapsibleState = {
  open: boolean;
  defaultOpen?: never;
  onOpenChange: (open: boolean) => void;
};

type UncontrolledCollapsibleState = {
  open?: never;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

/** Controlled state props for Collapsible. */
export type ControlledCollapsibleProps = (
  | CollapsibleDefaultBaseProps
  | CollapsibleAsChildBaseProps
) &
  ControlledCollapsibleState;

/** Uncontrolled state props for Collapsible. */
export type UncontrolledCollapsibleProps = (
  | CollapsibleDefaultBaseProps
  | CollapsibleAsChildBaseProps
) &
  UncontrolledCollapsibleState;

/** Props for Collapsible rendered with its default host. */
export type CollapsibleDefaultProps = CollapsibleDefaultBaseProps &
  (ControlledCollapsibleState | UncontrolledCollapsibleState);
/** Props for Collapsible delegated to an asChild host. */
export type CollapsibleAsChildProps = CollapsibleAsChildBaseProps &
  (ControlledCollapsibleState | UncontrolledCollapsibleState);
/** Public props for Collapsible. */
export type CollapsibleProps = CollapsibleDefaultProps | CollapsibleAsChildProps;
/** Polymorphic component call signatures for Collapsible. */
export type CollapsibleComponent = PolymorphicAsChildComponent<
  CollapsibleDefaultProps,
  CollapsibleAsChildProps,
  HTMLDivElement
>;

type CollapsibleTriggerOwnedProp =
  | 'aria-controls'
  | 'aria-disabled'
  | 'aria-expanded'
  | 'data-state'
  | 'disabled'
  | 'id'
  | 'role'
  | 'tabIndex'
  | 'type';

type CollapsibleTriggerNativeProps = Omit<
  PrimitiveProps<'button', { children: ReactNode }>,
  CollapsibleTriggerOwnedProp
>;

/** Props for CollapsibleTrigger rendered with its default host. */
export type CollapsibleTriggerDefaultProps =
  DefaultHostProps<CollapsibleTriggerNativeProps>;
/** Props for CollapsibleTrigger delegated to an asChild host. */
export type CollapsibleTriggerAsChildProps = RetargetedAsChildHostProps<
  DelegatedButtonHostProps<CollapsibleTriggerNativeProps>,
  HTMLElement
>;
/** Public props for CollapsibleTrigger. */
export type CollapsibleTriggerProps =
  | CollapsibleTriggerDefaultProps
  | CollapsibleTriggerAsChildProps;
/** Polymorphic component call signatures for CollapsibleTrigger. */
export type CollapsibleTriggerComponent = PolymorphicAsChildComponent<
  CollapsibleTriggerDefaultProps,
  CollapsibleTriggerAsChildProps,
  HTMLButtonElement,
  HTMLElement
>;

/** Public props for CollapsibleContent. */
export type CollapsibleContentProps = Omit<
  MotionPrimitiveProps<
    'div',
    {
      children: ReactNode;
      keepMounted?: boolean;
      /** Whether the controlled collapse should animate on its first mount. */
      initial?: boolean;
    }
  >,
  'asChild'
> & {
  /**
   * Delegates the animated region to one native `article`, `div`, or `section` child.
   * Other children, including interactive elements and custom components, retain a wrapping div
   * to preserve the region's semantics and measurement behavior.
   */
  asChild?: boolean;
};
