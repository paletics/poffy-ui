import { AlertVariantProps } from '@/styled-system/recipes';
import { ComponentProps, ReactNode } from 'react';
import { PrimitiveProps } from '@poffy-ui/types';

/**
 * Semantic status used to choose the Alert icon and accent.
 *
 * ### Notes
 * `error` maps to a danger/error visual treatment. Use `warning`
 * for recoverable caution and `error` for failed or blocked actions.
 */
export type AlertStatus = 'info' | 'success' | 'warning' | 'error';

/**
 * Public surface treatment for Alert.
 */
export type AlertAppearance = 'subtle' | 'solid' | 'left-accent' | 'outline';

/**
 * Extracted variant types from the Panda CSS alert recipe.
 *
 * ### Notes
 * Prefer `AlertProps` for component usage. Use this interface for
 * wrapper components that expose compatible status and appearance controls.
 *
 * ### AI Usage
 * - Use when extending or reading alert styling variants.
 */
export interface AlertVariants extends Omit<AlertVariantProps, 'status' | 'variant'> {
  /**
   * Semantic status used for icon selection and visual urgency.
   *
   * @defaultValue `'info'`
   */
  status?: AlertStatus;
  /**
   * Visual treatment of the alert surface.
   *
   * @defaultValue `'subtle'`
   */
  variant?: AlertAppearance;
}

/**
 * Base props for the Alert component.
 * ### Formula
 * - Silver Ratio (1:1.414) applied to internal spacing and icon sizing.
 *
 * @example
 * ```tsx
 * import { Alert } from '@poffy-ui/react/feedback';
 *
 * <Alert status="warning" variant="left-accent">
 *   <Alert.Icon />
 *   <Alert.Title>Payment method expiring</Alert.Title>
 *   <Alert.Description>Update billing before the next renewal.</Alert.Description>
 * </Alert>
 * ```
 *
 * ### Notes
 * Do: use Alert for timely feedback that should be announced.
 * Don't: mount many alerts at once; `role="alert"` can overwhelm assistive technology.
 *
 * ### AI Usage
 * - Core props for the Alert root element.
 * - Use `status` for semantic urgency and `variant` for visual treatment.
 */
export interface AlertBaseProps extends AlertVariants {
  /** Content of the alert. */
  children?: ReactNode;
  /**
   * Callback fired when the close button is clicked.
   *
   * ### Notes
   * Renders a CloseButton automatically when provided.
   */
  onClose?: () => void;
}

/**
 * Full props for the Alert component merging HTML div attributes.
 */
export type AlertProps = PrimitiveProps<'div', AlertBaseProps>;

/**
 * Props for the AlertTitle element (heading text of the alert).
 */
export interface AlertTitleProps extends ComponentProps<'div'> {
  children?: ReactNode;
}

/**
 * Props for the AlertDescription element (body text of the alert).
 */
export interface AlertDescriptionProps extends ComponentProps<'div'> {
  children?: ReactNode;
}

/**
 * Props for the AlertIcon element (status icon beside the alert content).
 */
export interface AlertIconProps extends ComponentProps<'div'> {
  /**
   * Custom icon element to override the default status icon.
   *
   * ### Notes
   * Alert icons are decorative when the title/description already
   * carries the status text.
   */
  children?: ReactNode;
}
