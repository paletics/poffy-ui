import { OverlayTransitionType } from '@/components/animations';
import { PuffVariantProps } from '@/styled-system/recipes';
import type { MotionPrimitiveProps } from '@/types/motion';
import type { PortalProviderContainer } from '@/providers/PortalProvider.types';
import type { PortalOwnerDocument } from '@/components/overlay/Portal';
import { ComponentProps, ReactNode } from 'react';

/** Surface treatment for Puff notifications. */
export type PuffAppearance = 'solid' | 'soft' | 'outline';
/** ARIA live-region politeness used when a PuffProvider announces a notification. */
export type PuffLive = 'polite' | 'assertive' | 'off';

/**
 * Semantic accent color for Puff notifications.
 */
export type PuffIntent =
  | 'primary'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'light'
  | 'dark';

export interface PuffDisplayContainerProps {
  /** The content to display within the container. Usually a list of Puff components. */
  children: ReactNode;
  /** Provider-owned items used to populate persistent announcement lanes. */
  puffs?: readonly PuffContainerItem[];
  /**
   * The positioning point for the puff container.
   * @defaultValue 'top-right'
   */
  point?: PuffVariantProps['point'];
}

export interface PuffContainerProps {
  /** Anchor point for the puff group. Determines where on the screen the puffs appear. */
  point: PuffVariantProps['point'];
  /** List of active puff data objects to display. */
  puffs: PuffContainerItem[];
  portalContainer?: PortalProviderContainer;
  ownerDocument?: PortalOwnerDocument;
  /** Callback to request closing a puff by its unique ID. */
  removePuff: (id: string) => void;
  /** Callback to permanently remove a puff after its exit animation finishes. */
  finalizePuffRemoval: (id: string) => void;
}

/**
 * Internal runtime shape for provider-managed puffs.
 * Keeps mount identity stable while exit animation plays.
 */
export interface PuffContainerItem extends PuffBaseProps {
  /** Unique identifier for this mounted puff instance. */
  puffId: string;
  /** Whether the puff should currently be visible. */
  isVisible: boolean;
}

/**
 * Props for one transient notification. Keep its content concise and actionable; required or
 * persistent feedback must also remain available in the surrounding layout.
 */
export interface PuffBaseProps extends Omit<PuffVariantProps, 'appearance' | 'intent'> {
  /**
   * Semantic accent color.
   * @defaultValue `'primary'`
   */
  intent?: PuffIntent;
  /**
   * Public surface treatment.
   * @defaultValue `'solid'`
   */
  appearance?: PuffAppearance;
  /** Anchor point for the puff. Used to determine entrance animation direction. */
  point?: PuffVariantProps['point'];
  /** Optional icon to display on the left side of the title or content. */
  icon?: ReactNode;
  /** Title of the puff. Displayed prominently at the top. */
  title?: ReactNode;
  /**
   * Optional action element displayed on the right.
   *
   * Provider announcements exclude actions structurally. Standalone puffs add
   * a nested `aria-live="off"` override, but assistive-technology handling of
   * nested live regions can vary.
   */
  action?: ReactNode;
  /** Main content of the puff. Can be text or complex React nodes. */
  children?: ReactNode;
  /**
   * Announcement priority for this notification.
   * @defaultValue 'polite'
   */
  live?: PuffLive;
  /**
   * Plain text announced by `PuffProvider`.
   *
   * When omitted, static text from `title` and `children` is used. Supply this
   * for custom components or render functions whose text cannot be inspected.
   */
  announcement?: string;
  /**
   * Auto-close duration in milliseconds. Non-finite or non-positive values
   * disable automatic dismissal.
   * If provided, the puff calls `onClose` after this time. Provider-managed puffs also start their
   * exit/removal lifecycle; standalone puffs remain mounted until their parent responds.
   * Hovering or focusing the puff pauses dismissal and resumes with the remaining time.
   *
   * ### Notes
   * Avoid auto-closing critical messages before users can read or act on them.
   */
  duration?: number;
  /** Callback triggered when automatic dismissal is requested. */
  onClose?: () => void;
  /**
   * Whether to use a simplified layout.
   * If true, renders a compact version without a separate title row.
   */
  isSimple?: boolean;
  /**
   * Type of entrance/exit animation.
   * @defaultValue 'puff'
   */
  animationType?: OverlayTransitionType;
  /**
   * Custom render function for complete control over the puff appearance.
   * If provided, the standard Puff UI structure is bypassed.
   *
   * ### Notes
   * Preserve equivalent title/content/action semantics in custom renders.
   */
  render?: (props: PuffBaseProps) => ReactNode;
}

/** Public configuration accepted by `usePuff().addPuff`. */
export type PuffOptions = PuffBaseProps;

/** Props for a standalone or provider-managed Puff notification. */
export type PuffProps = MotionPrimitiveProps<'div', PuffBaseProps>;

export interface PuffTitleProps extends Omit<ComponentProps<'div'>, 'title'> {
  /** Optional icon to display next to the title. */
  icon?: ReactNode;
  /** Title text or element. */
  title?: ReactNode;
  /** Optional action element. */
  action?: ReactNode;
}

export type PuffContentProps = ComponentProps<'div'>;

/** Props for a subtree that owns transient Puff notifications. */
export interface PuffProviderProps {
  /**
   * Default anchor point for all puffs triggered within this provider.
   * @defaultValue 'top-right'
   */
  point?: PuffVariantProps['point'];
  /** Overrides the nearest PortalProvider for notifications from this provider. */
  portalContainer?: PortalProviderContainer;
  /** Owner document for the default body portal when no portal container is configured. */
  ownerDocument?: PortalOwnerDocument;
  /** Children to render within the provider. */
  children: ReactNode;
}

/**
 * Interface for the Puff context value.
 * Exposed via `usePuff` hook.
 *
 * ### Notes
 * Use `addPuff` for new notifications and let the provider manage
 * removal timing unless a user action dismisses a specific item.
 */
export interface PuffContextType {
  /**
   * Triggers a new puff notification.
   * @param options Configuration options for the puff.
   */
  addPuff: (options: PuffOptions) => string;
  /**
   * Removes a specific puff by ID.
   * @param id The unique identifier of the puff to remove.
   */
  removePuff: (id: string) => void;
}
