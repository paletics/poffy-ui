import { OverlayTransitionType } from '@/components/animations';
import { PuffVariantProps } from '@/styled-system/recipes';
import type { MotionPrimitiveProps } from '@/types/motion';
import { ComponentProps, ReactNode } from 'react';

/**
 * Public surface treatment for Puff notifications.
 *
 * ### Notes
 * Use `solid` for high-emphasis system feedback and `soft`/`outline`
 * for lower-priority notifications.
 */
export type PuffAppearance = 'solid' | 'soft' | 'outline';

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

/**
 * ### AI Context & Architecture
 * Props for the PuffDisplayContainer component.
 * This container is responsible for positioning the puffs on the screen based on the 'point' prop.
 * It uses absolute positioning within a portal.
 */
export interface PuffDisplayContainerProps {
  /** The content to display within the container. Usually a list of Puff components. */
  children: ReactNode;
  /**
   * The positioning point for the puff container.
   * @defaultValue 'top-right'
   */
  point?: PuffVariantProps['point'];
}

/**
 * ### AI Context & Architecture
 * Props for the PuffContainer component.
 * This component manages the list of active puffs and renders them within a PuffDisplayContainer.
 * It handles the mounting and unmounting of puffs using AnimatePresence.
 */
export interface PuffContainerProps {
  /** Anchor point for the puff group. Determines where on the screen the puffs appear. */
  point: PuffVariantProps['point'];
  /** List of active puff data objects to display. */
  puffs: PuffContainerItem[];
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
  id: string;
  /** Whether the puff should currently be visible. */
  isVisible: boolean;
}

/**
 * ### AI Context & Architecture
 * Base properties for the Puff component.
 * Extends Panda CSS variant props to include intent, appearance, and generic styling props.
 * This interface defines the data structure for a single notification/toast message.
 * Used internally by PuffContainerProps, PuffContextType, and as the data model for puff state.
 *
 * @example
 * ```tsx
 * import { Puff } from '@poffy-ui/react/feedback';
 *
 * <Puff intent="success" title="Saved" duration={4000}>
 *   Your changes are available.
 * </Puff>
 * ```
 *
 * ### Notes
 * Do: keep content short and actionable.
 * Don't: put required form errors only in a timed Puff; also render the error
 * near the affected field or region.
 *
 * ### AI Usage
 * - Use Puff for transient toast-style notifications.
 * - Use Alert or Result for persistent messages that need to remain in layout.
 */
export interface PuffBaseProps extends Omit<PuffVariantProps, 'appearance' | 'intent'> {
  /**
   * Semantic accent color.
   * @defaultValue 'primary'
   */
  intent?: PuffIntent;
  /**
   * Public surface treatment.
   * @defaultValue 'solid'
   */
  appearance?: PuffAppearance;
  /** Unique identifier for the puff. Required for managing the list of puffs. */
  id?: string;
  /** Anchor point for the puff. Used to determine entrance animation direction. */
  point?: PuffVariantProps['point'];
  /** Optional icon to display on the left side of the title or content. */
  icon?: ReactNode;
  /** Title of the puff. Displayed prominently at the top. */
  title?: ReactNode;
  /** Optional action element (e.g., a button or link) displayed on the right. */
  action?: ReactNode;
  /** Main content of the puff. Can be text or complex React nodes. */
  children?: ReactNode;
  /**
   * Auto-close duration in milliseconds.
   * If provided, the puff will automatically call onClose and removePuff after this time.
   *
   * ### Notes
   * Avoid auto-closing critical messages before users can read or act on them.
   */
  duration?: number;
  /** Callback triggered when the puff is closed (either manually or via timer). */
  onClose?: () => void;
  /** Internal callback to remove the puff from the provider's state. */
  removePuff?: (id: string) => void;
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
  /**
   * Internal visibility flag used by provider-managed puffs.
   * Standalone usage can ignore this; defaults to visible.
   */
  isVisible?: boolean;
  /**
   * Internal callback fired after the exit animation completes.
   */
  onExitComplete?: (id: string) => void;
}

/**
 * Public props type for the Puff component.
 * Extends PrimitiveProps to include asChild support and all native div attributes.
 *
 * ### Notes
 * Add `role="status"` or an appropriate live-region attribute when a
 * standalone Puff must be announced outside the provider's surrounding context.
 */
export type PuffProps = MotionPrimitiveProps<'div', PuffBaseProps>;

/**
 * ### AI Context & Architecture
 * Props for the PuffTitle sub-component.
 * Used internally by Puff to render the header section.
 */
export interface PuffTitleProps extends Omit<ComponentProps<'div'>, 'title'> {
  /** Optional icon to display next to the title. */
  icon?: ReactNode;
  /** Title text or element. */
  title?: ReactNode;
  /** Optional action element. */
  action?: ReactNode;
}

/**
 * ### AI Context & Architecture
 * Props for the PuffContent sub-component.
 * Used internally by Puff to render the body section.
 */
export type PuffContentProps = ComponentProps<'div'>;

/**
 * ### AI Context & Architecture
 * Props for the PuffProvider component.
 * The provider wraps the application (or a subtree) and enables the use of `usePuff`.
 *
 * @example
 * ```tsx
 * import { PuffProvider } from '@poffy-ui/react/feedback';
 *
 * <PuffProvider point="bottom-right">{children}</PuffProvider>
 * ```
 */
export interface PuffProviderProps {
  /**
   * Default anchor point for all puffs triggered within this provider.
   * @defaultValue 'top-right'
   */
  point?: PuffVariantProps['point'];
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
  addPuff: (options: PuffBaseProps) => void;
  /**
   * Removes a specific puff by ID.
   * @param id The unique identifier of the puff to remove.
   */
  removePuff: (id: string) => void;
}
