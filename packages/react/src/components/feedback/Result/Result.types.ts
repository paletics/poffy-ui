import {
  type FeedbackAppearance,
  type StatusIntent,
  NativeProps,
  PrimitiveProps,
} from '@poffy-ui/types';

/**
 * Props for a stable outcome surface. Use Result for completed flows or persistent states, rather
 * than transient inline validation; keep follow-up controls in ResultActions.
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
     * Announcement priority when this result is inserted or updated.
     * Use `'off'` for stable page content that should not announce itself.
     * @defaultValue `'off'`
     */
    live?: 'polite' | 'assertive' | 'off';
  }
>;

/**
 * Props for the ResultIcon component.
 * Uses NativeProps since the wrapper element is always a fixed `div`.
 *
 * ### Notes
 * The icon slot is decorative by default. Set `aria-hidden={false}` only for
 * a meaningful, labeled icon. The default decorative slot is inert.
 */
export type ResultIconProps = NativeProps<'div'>;

/**
 * Props for the ResultTitle component.
 * Uses PrimitiveProps to support the asChild Slot pattern.
 *
 * ### Notes
 * Render one concise heading that names the outcome. `asChild` accepts one
 * native h1-h6 element; other children fall back to textual content in h3.
 */
export type ResultTitleProps = PrimitiveProps<'h3'>;

/**
 * Props for the ResultDescription component.
 * Uses PrimitiveProps to support the asChild Slot pattern.
 *
 * ### Notes
 * Explain what happened and, when useful, what the user can do next. `asChild`
 * accepts one native p element; other children fall back to textual content in p.
 */
export type ResultDescriptionProps = PrimitiveProps<'p'>;

/**
 * Props for the ResultActions component.
 * Uses PrimitiveProps to support the asChild Slot pattern.
 * `asChild` accepts one native div element; other children use the default div.
 * Actions opt out of an ancestor Result live region unless `aria-live` is supplied.
 */
export type ResultActionsProps = PrimitiveProps<'div'>;
