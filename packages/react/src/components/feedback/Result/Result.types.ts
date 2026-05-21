import {
  type FeedbackAppearance,
  type StatusIntent,
  NativeProps,
  PrimitiveProps,
} from '@poffy-ui/types';

/**
 * Props for the Result container component.
 * Uses NativeProps since the outer element is always a fixed `div`.
 *
 * @example
 * ```tsx
 * import { Result } from '@poffy-ui/react/feedback';
 *
 * <Result intent="success">
 *   <Result.Icon />
 *   <Result.Title>Project published</Result.Title>
 *   <Result.Description>The public page is now live.</Result.Description>
 * </Result>
 * ```
 *
 * ### Notes
 * Do: use Result for a stable outcome page, panel, or empty-flow completion state.
 * Don't: use Result for transient inline validation; use Alert or field-level messaging.
 *
 * ### AI Usage
 * - Use for success/error/warning/info outcomes after a task completes.
 * - Keep actions in `Result.Actions` so call-to-action layout remains consistent.
 */
export type ResultProps = NativeProps<
  'div',
  {
    /**
     * Semantic outcome intent.
     * @defaultValue 'info'
     */
    intent?: StatusIntent;
    /**
     * Public surface treatment.
     * @defaultValue 'soft'
     */
    appearance?: Extract<FeedbackAppearance, 'soft' | 'outline'>;
    /**
     * Legacy status alias.
     */
    status?: 'success' | 'error' | 'warning' | 'info';
  }
>;

/**
 * Props for the ResultIcon component.
 * Uses NativeProps since the wrapper element is always a fixed `div`.
 *
 * ### Notes
 * The icon slot is decorative by default. Ensure the title or
 * description carries the actual outcome text.
 */
export type ResultIconProps = NativeProps<'div'>;

/**
 * Props for the ResultTitle component.
 * Uses PrimitiveProps to support the asChild Slot pattern.
 *
 * ### Notes
 * Render one concise heading that names the outcome.
 */
export type ResultTitleProps = PrimitiveProps<'h3'>;

/**
 * Props for the ResultDescription component.
 * Uses PrimitiveProps to support the asChild Slot pattern.
 *
 * ### Notes
 * Explain what happened and, when useful, what the user can do next.
 */
export type ResultDescriptionProps = PrimitiveProps<'p'>;

/**
 * Props for the ResultActions component.
 * Uses PrimitiveProps to support the asChild Slot pattern.
 */
export type ResultActionsProps = PrimitiveProps<'div'>;
