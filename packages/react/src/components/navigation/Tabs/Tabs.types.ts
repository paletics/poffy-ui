import { tabs } from '@/styled-system/recipes';
import type { LayoutAnimationType } from '@/components/animations/LayoutTransition';
import type { NavigationAppearance, PrimitiveProps } from '@poffy-ui/types';
import { ReactNode } from 'react';

/**
 * Variants for the Tabs component based on the Panda CSS recipe.
 *
 * ### Notes
 * Use `TabsProps` for component wrappers; use this type only for recipe-level
 * extension or documentation tooling.
 */
export type TabsVariants = NonNullable<Parameters<typeof tabs>[0]>;

/**
 * Public Tabs variant props with shared navigation appearance names.
 */
export interface TabsVariantSubset extends Omit<TabsVariants, 'variant'> {
  /** Visual appearance mapped to the shared navigation appearance token set. */
  appearance?: NavigationAppearance;
  /** Recipe-specific tab indicator and trigger style. */
  variant?: TabsVariants['variant'];
}

/**
 * Props for the root Tabs component.
 *
 * @example
 * ```tsx
 * import { Tabs, TabContent, TabList, TabTrigger } from '@poffy-ui/react/navigation';
 * ```
 *
 * ### Notes
 * Required structure: `Tabs` must contain one `TabList` with `TabTrigger` children
 * and matching `TabContent` values. Trigger and content `value` strings must match.
 *
 * ### AI Context & Architecture
 * - Tier: Molecules, Engine: Panda CSS (Recipe: tabs)
 *
 * Related: `TabTriggerProps`
 * Related: `TabContentProps`
 */
export interface TabsProps extends Omit<
  PrimitiveProps<'div', TabsVariantSubset>,
  'defaultValue' | 'onChange'
> {
  /**
   * The content of the tabs, typically including TabList and TabContent.
   */
  children?: ReactNode;
  /**
   * The value of the tab that should be active by default.
   */
  defaultValue?: string;
  /**
   * The value of the currently active tab (controlled).
   */
  value?: string;
  /**
   * Callback fired when the active tab value changes.
   */
  onValueChange?: (value: string) => void;
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

/**
 * Props for the tab list slot.
 *
 * ### Notes
 * Renders the `tablist` role in the component implementation. Keep only
 * `TabTrigger` elements or compatible trigger wrappers inside.
 */
export type TabListProps = PrimitiveProps<'div'>;

/**
 * Props for the individual TabTrigger component.
 *
 * ### Notes
 * Do: provide a stable `value` that matches exactly one `TabContent`.
 * Don't: nest interactive controls inside a tab trigger.
 *
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: ActionMotion, Radix Slot
 */
export interface TabTriggerProps extends PrimitiveProps<'button'> {
  /**
   * The unique value associated with this tab.
   */
  value: string;
  /**
   * The label or content of the tab trigger.
   */
  children?: ReactNode;
}

/**
 * Props for an individual tab panel.
 *
 * ### Notes
 * The `value` must match a `TabTrigger` value in the same Tabs root.
 */
export interface TabContentProps extends PrimitiveProps<'div'> {
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
   * The active visual variant resolved by the Tabs root.
   */
  variant?: TabsVariants['variant'];
  /**
   * Unique layout id used by the animated active indicator.
   */
  indicatorId: string;
  /**
   * Layout animation preset used by the active tab indicator.
   */
  indicatorAnimation: LayoutAnimationType;
}
