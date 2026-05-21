import { PoffyResolvedColorMode } from '@/providers';
import { TooltipVariantProps } from '@/styled-system/recipes';
import { PoffyBrand } from '@/providers';
import { Placement, VirtualElement } from '@floating-ui/react';
import { ReactNode } from 'react';
import { PrimitiveProps } from '@poffy-ui/types';

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
 *
 * Controlled contract: pass `open` with `onOpenChange`. Uncontrolled
 * contract: omit `open`; hover and focus interactions manage state.
 *
 * Accessibility: use Tooltip only for supplemental, non-interactive text.
 * The trigger must remain keyboard focusable when the tooltip is important.
 *
 * Do: keep `content` short. Don't: put buttons, forms, or required
 * instructions in a Tooltip; use Popover instead.
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
export interface TooltipProps extends TooltipVariants, Omit<PrimitiveProps<'div'>, 'content'> {
  /**
   * Non-interactive content displayed within the tooltip.
   */
  content: ReactNode;

  /**
   * Preferred placement of the tooltip relative to the trigger.
   * @defaultValue "top"
   */
  placement?: Placement;

  /**
   * Whether the tooltip is currently open.
   * If provided, the tooltip becomes a controlled component.
   */
  open?: boolean;

  /**
   * Callback fired when the open state changes.
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Whether the tooltip is disabled.
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
