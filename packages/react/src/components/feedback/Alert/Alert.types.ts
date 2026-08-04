import { AlertVariantProps } from '@/styled-system/recipes';
import { ComponentProps, type ComponentPropsWithoutRef, type ReactElement, ReactNode } from 'react';
import { PrimitiveProps } from '@poffy-ui/types';
import type {
  DefaultHostProps,
  PolymorphicAsChildComponent,
  RetargetedAsChildHostProps,
} from '@/components/shared/polymorphicAsChild.types';

/** Semantic urgency used for Alert visual treatment and default announcement priority. */
export type AlertStatus = 'info' | 'success' | 'warning' | 'error';

/**
 * Public surface treatment for Alert.
 */
export type AlertAppearance = 'subtle' | 'solid' | 'start-accent' | 'outline';

/** Status and surface choices for Alert wrappers. */
export interface AlertVariants extends Omit<AlertVariantProps, 'status' | 'variant' | 'closable'> {
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
 * Props for timely, status-aware feedback. Select `status` for semantic urgency and `variant` for
 * visual treatment; avoid simultaneously mounting multiple assertive error alerts.
 */
export interface AlertBaseProps extends AlertVariants {
  /** Content of the alert. */
  children?: ReactNode;
  /**
   * Called when the generated close button is activated. It does not remove the alert itself.
   */
  onClose?: () => void;
  /**
   * Accessible name for the generated close button.
   * Uses the active locale's dismiss-alert message when omitted.
   */
  closeLabel?: string;
  /**
   * Announcement priority for the alert when it is inserted into the page.
   *
   * By default, errors use `assertive` semantics while info, success, and
   * warning alerts use `polite` semantics. Use `'off'` for static content that
   * should not be announced.
   * @defaultValue `'auto'`
   */
  live?: 'assertive' | 'polite' | 'off' | 'auto';
}

/**
 * Full props for the Alert component merging HTML div attributes.
 * `asChild` accepts native `article`, `div`, and `section` hosts only; other
 * children safely render within Alert's default div root.
 */
type AlertNativeProps = PrimitiveProps<'div', AlertBaseProps>;
/** Props for Alert rendered with its default host. */
export type AlertDefaultProps = DefaultHostProps<AlertNativeProps>;
type AlertAsChildElement =
  | ReactElement<ComponentPropsWithoutRef<'article'>, 'article'>
  | ReactElement<ComponentPropsWithoutRef<'div'>, 'div'>
  | ReactElement<ComponentPropsWithoutRef<'section'>, 'section'>;
/** Props for Alert delegated to an asChild host. */
export type AlertAsChildProps = RetargetedAsChildHostProps<
  AlertNativeProps,
  HTMLElement,
  AlertAsChildElement
>;
/** Public props for Alert. */
export type AlertProps = AlertDefaultProps | AlertAsChildProps;
/** Polymorphic component call signatures for Alert. */
export type AlertComponent = PolymorphicAsChildComponent<
  AlertDefaultProps,
  AlertAsChildProps,
  HTMLDivElement,
  HTMLElement
>;

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
