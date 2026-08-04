import { tabs } from '@/styled-system/recipes';
import type { LayoutAnimationType } from '@/components/animations/LayoutTransition';
import type { NativeProps, NavigationAppearance, PrimitiveProps } from '@poffy-ui/types';
import type { ReactElement, ReactNode, RefAttributes } from 'react';
import type {
  DefaultHostProps,
  RetargetedAsChildHostProps,
} from '@/components/shared/polymorphicAsChild.types';
import type { DelegatedButtonHostProps } from '@/components/shared/buttonDelegation';

/**
 * Variants for the Tabs component based on the Panda CSS recipe.
 *
 * ### Notes
 * Use `TabsProps` for component wrappers; use this type only for recipe-level
 * extension or documentation tooling.
 */
type TabsRecipeVariants = NonNullable<Parameters<typeof tabs>[0]>;

/** Visual and keyboard navigation axis for Tabs. */
export type TabsOrientation = 'horizontal' | 'vertical';

/**
 * Public Tabs variant props with shared navigation appearance names.
 */
export interface TabsVariantSubset extends Omit<TabsRecipeVariants, 'orientation' | 'variant'> {
  /** Visual appearance mapped to the shared navigation appearance token set. */
  appearance?: NavigationAppearance;
  /**
   * Visual and keyboard navigation axis.
   * @defaultValue `'horizontal'`
   */
  orientation?: TabsOrientation;
}

/** Canonical public visual props for Tabs. */
export type TabsVariants = TabsVariantSubset;


interface TabsBaseOwnProps extends TabsVariantSubset {
  /**
   * The content of the tabs, typically including TabList and TabContent.
   */
  children?: ReactNode;
  /**
   * Whether to defer rendering of tab content until it's selected.
   * @defaultValue `false`
   */
  lazyMount?: boolean;
  /**
   * Layout animation preset used by the active tab indicator.
   * @defaultValue `'stable'`
   */
  indicatorAnimation?: LayoutAnimationType;
}

type TabsBaseProps = Omit<NativeProps<'div', TabsBaseOwnProps>, 'defaultValue' | 'onChange'>;

/** Controlled Tabs state. */
export type ControlledTabsProps = TabsBaseProps & {
  /** The externally owned active tab value. */
  value: string;
  /** Commits a requested or resolved active tab value. */
  onValueChange: (value: string) => void;
  defaultValue?: never;
};

/** Tabs-owned state with an optional initial value and change notification. */
export type UncontrolledTabsProps = TabsBaseProps & {
  value?: never;
  /** The initially active tab value. */
  defaultValue?: string;
  /** Callback fired when the active tab value changes. */
  onValueChange?: (value: string) => void;
};

/** Public props for Tabs. */
export type TabsProps = ControlledTabsProps | UncontrolledTabsProps;

/**
 * Props for the tab list slot.
 *
 * ### Notes
 * Renders the `tablist` role in the component implementation. Keep only
 * `TabTrigger` elements or compatible trigger wrappers inside.
 */
export type TabListProps = Omit<NativeProps<'div'>, 'aria-orientation' | 'children' | 'role'> & {
  children?: ReactNode;
};


interface TabTriggerOwnProps {
  /**
   * The unique value associated with this tab.
   */
  value: string;
  /**
   * The label or content of the tab trigger.
   */
  children?: ReactNode;
}

type TabTriggerNativeProps = Omit<
  PrimitiveProps<'button', TabTriggerOwnProps>,
  'aria-controls' | 'aria-disabled' | 'aria-selected' | 'id' | 'role' | 'tabIndex' | 'type'
>;
/** Props for TabTrigger rendered with its default host. */
export type TabTriggerDefaultProps = DefaultHostProps<TabTriggerNativeProps>;
type TabTriggerRetargetedProps = RetargetedAsChildHostProps<
  DelegatedButtonHostProps<TabTriggerNativeProps>,
  HTMLElement
>;
/** Props for TabTrigger delegated to an asChild host. */
export type TabTriggerAsChildProps = Omit<TabTriggerRetargetedProps, 'value'> &
  Pick<TabTriggerOwnProps, 'value'>;
/** Public props for TabTrigger. */
export type TabTriggerProps = TabTriggerDefaultProps | TabTriggerAsChildProps;

/** Callable TabTrigger contract preserving default and delegated HTML refs. */
export interface TabTriggerComponent {
  (props: TabTriggerDefaultProps & RefAttributes<HTMLButtonElement>): ReactElement | null;
  (props: TabTriggerAsChildProps & RefAttributes<HTMLElement>): ReactElement | null;
  (
    props:
      | (TabTriggerDefaultProps & RefAttributes<HTMLButtonElement>)
      | (TabTriggerAsChildProps & RefAttributes<HTMLElement>),
  ): ReactElement | null;
}

/**
 * Props for an individual tab panel.
 *
 * ### Notes
 * The `value` must match a `TabTrigger` value in the same Tabs root.
 */
export interface TabContentProps extends Omit<
  NativeProps<'div'>,
  'aria-labelledby' | 'children' | 'hidden' | 'id' | 'role'
> {
  /**
   * The value of the tab this content belongs to.
   */
  value: string;
  /**
   * The content to be displayed when this tab is active.
   */
  children?: ReactNode;
}

/**
 * Value provided by the TabsContext.
 */
export interface TabsContextValue {
  /**
   * The currently active tab value.
   */
  value: string;
  /**
   * Function to update the active tab value.
   */
  setValue: (value: string) => void;
  /**
   * Generated recipe classes for Tabs slots.
   */
  classes: ReturnType<typeof tabs>;
  /**
   * Whether lazy mounting is enabled.
   */
  lazyMount?: boolean;
  /**
   * The internal visual variant resolved by the Tabs root appearance.
   */
  variant?: TabsRecipeVariants['variant'];
  /**
   * Unique layout id used by the animated active indicator.
   */
  indicatorId: string;
  /**
   * Layout animation preset used by the active tab indicator.
   */
  indicatorAnimation: LayoutAnimationType;
  /** Visual and keyboard navigation axis owned by the Tabs root. */
  orientation: TabsOrientation;
  /** Registers a mounted trigger for internal uncontrolled-value reconciliation. */
  registerTrigger: (trigger: RegisteredTabTrigger) => () => void;
  /** Registers a mounted panel for internal trigger/panel association. */
  registerContent: (content: RegisteredTabContent) => () => void;
  /** Resolves the unique mounted trigger/panel association for a value. */
  getTabAssociation: (value: string) => TabAssociation;
}

/** Internal trigger record used to reconcile uncontrolled tab selection. */
export interface RegisteredTabTrigger {
  registrationKey: string;
  domId: string;
  value: string;
  disabled: boolean;
  node: HTMLElement;
}

/** Internal panel record used to associate tabs without inspecting React children. */
export interface RegisteredTabContent {
  registrationKey: string;
  domId: string;
  value: string;
  node: HTMLDivElement;
}

/** Internal association state for one public tab value. */
export interface TabAssociation {
  triggerId?: string;
  panelId?: string;
  hasMatchingTrigger: boolean;
  hasMatchingPanel: boolean;
  invalid: boolean;
}
