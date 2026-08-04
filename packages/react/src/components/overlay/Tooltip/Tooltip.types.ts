import { PoffyResolvedColorMode } from '@/providers';
import { TooltipVariantProps } from '@/styled-system/recipes';
import { PoffyBrand } from '@/providers';
import { Placement, VirtualElement } from '@floating-ui/react';
import { ReactNode } from 'react';
import { PrimitiveProps } from '@poffy-ui/types';
import type { PortalTargetProps } from '@/providers/PortalProvider.types';
import type {
  AsChildHostProps,
  DefaultHostProps,
  PolymorphicAsChildComponent,
} from '@/components/shared/polymorphicAsChild.types';

/**
 * Variants for the Tooltip component based on Panda CSS recipe.
 *
 */
export type TooltipVariants = TooltipVariantProps;

/**
 * Props for Tooltip.
 *
 * Tooltip wraps one trigger child unless `virtualRef` is provided. The tooltip
 * content is rendered in a portal and exposed with role `tooltip`.
 * The forwarded ref targets the default `div` trigger wrapper, or the slotted
 * trigger element when `asChild` is used. `asChild` requires one element that
 * forwards props and refs. When `virtualRef` is supplied, no physical trigger
 * is rendered and the forwarded ref remains null.
 *
 * Controlled contract: pass `open` with `onOpenChange`. An unpaired `open`
 * value falls back to initial uncontrolled state and warns in development.
 * Uncontrolled contract: omit `open`; hover and focus interactions manage state.
 *
 * Accessibility: use Tooltip only for supplemental, non-interactive text.
 * The trigger must remain keyboard focusable when the tooltip is important.
 *
 * Do: keep `content` short. Long text wraps, but the non-focusable tooltip
 * surface does not become a keyboard-scrollable region. Don't: put long-form
 * guidance, buttons, forms, or required instructions in a Tooltip; use Popover instead.
 *
 * @example
 * ```tsx
 * import { Tooltip } from '@poffy-ui/react/overlay';
 *
 * <Tooltip content="Saved automatically">
 *   <button type="button">Status</button>
 * </Tooltip>
 * ```
 *
 * Related: import('@poffy-ui/react/overlay').PopoverProps
 *
 */
interface TooltipBaseProps
  extends TooltipVariants, Omit<PrimitiveProps<'div', PortalTargetProps>, 'content'> {
  /**
   * Non-interactive supplemental content displayed within the tooltip.
   * Long text wraps; use Popover for long-form or interactive content.
   */
  content: ReactNode;

  /**
   * Preferred placement of the tooltip relative to the trigger.
   * @defaultValue "top"
   */
  placement?: Placement;

  /**
   * Whether the tooltip is disabled. Disabling an uncontrolled tooltip closes it.
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * Delay in milliseconds before the tooltip appears on hover.
   * @defaultValue 200
   */
  delay?: number;

  /**
   * Theme color mode override.
   * @defaultValue current color mode from context
   */
  theme?: PoffyResolvedColorMode;

  /**
   * Whether to display an arrow pointing to the trigger.
   * @defaultValue true
   */
  showArrow?: boolean;

  /**
   * Theme brand override.
   * @defaultValue current brand from theme context
   */
  brand?: PoffyBrand;

  /**
   * Virtual element for coordinate-based positioning (e.g. charts, canvas).
   */
  virtualRef?: VirtualElement;
}

type TooltipDefaultBaseProps = DefaultHostProps<TooltipBaseProps>;
type TooltipAsChildBaseProps = AsChildHostProps<TooltipBaseProps>;
type TooltipHostProps = TooltipDefaultBaseProps | TooltipAsChildBaseProps;

type ControlledTooltipStateProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type UncontrolledTooltipStateProps = {
  open?: never;
  onOpenChange?: (open: boolean) => void;
};

type TooltipStateProps = ControlledTooltipStateProps | UncontrolledTooltipStateProps;

/** Controlled Tooltip props for either the default or delegated trigger host. */
export type ControlledTooltipProps = TooltipHostProps & ControlledTooltipStateProps;

/** Uncontrolled Tooltip props for either the default or delegated trigger host. */
export type UncontrolledTooltipProps = TooltipHostProps & UncontrolledTooltipStateProps;

/** Tooltip props for the default `div` trigger wrapper. */
export type TooltipDefaultProps = TooltipDefaultBaseProps & TooltipStateProps;

/** Tooltip props for a trigger delegated with `asChild`. */
export type TooltipAsChildProps = TooltipAsChildBaseProps & TooltipStateProps;

/** Public props for Tooltip. */
export type TooltipProps = TooltipDefaultProps | TooltipAsChildProps;

/** Polymorphic component call signatures for Tooltip. */
export type TooltipComponent = PolymorphicAsChildComponent<
  TooltipDefaultProps,
  TooltipAsChildProps,
  HTMLDivElement
>;
