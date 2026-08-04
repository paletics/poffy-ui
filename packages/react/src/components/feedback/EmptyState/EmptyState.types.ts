import type { FeedbackAppearance, SemanticIntent } from '@poffy-ui/types';
import type { PrimitiveProps } from '@poffy-ui/types';
import type {
  ComponentPropsWithoutRef,
  DOMAttributes,
  ReactElement,
  ReactNode,
  RefAttributes,
} from 'react';
import type {
  DefaultHostProps,
  PolymorphicAsChildComponent,
  RetargetedAsChildHostProps,
} from '@/components/shared/polymorphicAsChild.types';

/**
 * Props for `EmptyState`, a non-interactive placeholder shown when a region has no data.
 *
 * ### Notes
 * Do: include `EmptyStateTitle` and `EmptyStateDescription` so assistive technology
 * receives the same message as sighted users.
 * Don't: use EmptyState for transient loading states; use Skeleton or Spinner instead.
 * `asChild` accepts a single native `article`, `div`, `main`, or `section` wrapper;
 * other children safely render within the default div root.
 *
 * @example
 * ```tsx
 * import { EmptyState } from '@poffy-ui/react/feedback';
 * ```
 *
 * Related: `EmptyStateIconProps`
 * Related: `EmptyStateActionsProps`
 */
interface EmptyStateOwnProps {
  /** Controls padding and icon/font sizing.
   * @defaultValue `'md'`
   */
  size?: 'sm' | 'md' | 'lg';
  /** Controls the public surface treatment.
   * @defaultValue `'soft'`
   */
  appearance?: Extract<FeedbackAppearance, 'soft' | 'outline' | 'solid'> | 'elevated';
  /** Controls semantic accent color.
   * @defaultValue `'primary'`
   */
  intent?: Extract<
    SemanticIntent,
    'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'danger'
  >;
  /**
   * Announcement priority when the empty state appears after an asynchronous update.
   * Keep the default `'off'` for static page content.
   * @defaultValue `'off'`
   */
  live?: 'polite' | 'assertive' | 'off';
}

type EmptyStateNativeProps = PrimitiveProps<'div', EmptyStateOwnProps>;
/** Props for EmptyState rendered with its default host. */
export type EmptyStateDefaultProps = DefaultHostProps<EmptyStateNativeProps>;
type EmptyStateAsChildElement =
  | ReactElement<ComponentPropsWithoutRef<'article'>, 'article'>
  | ReactElement<ComponentPropsWithoutRef<'div'>, 'div'>
  | ReactElement<ComponentPropsWithoutRef<'main'>, 'main'>
  | ReactElement<ComponentPropsWithoutRef<'section'>, 'section'>;
/** Props for EmptyState delegated to an asChild host. */
export type EmptyStateAsChildProps = RetargetedAsChildHostProps<
  EmptyStateNativeProps,
  HTMLElement,
  EmptyStateAsChildElement
>;
/** Public props for EmptyState. */
export type EmptyStateProps = EmptyStateDefaultProps | EmptyStateAsChildProps;
/** Polymorphic component call signatures for EmptyState. */
export type EmptyStateComponent = PolymorphicAsChildComponent<
  EmptyStateDefaultProps,
  EmptyStateAsChildProps,
  HTMLDivElement,
  HTMLElement
>;

/**
 * Props for the decorative or status icon slot in EmptyState.
 *
 * ### Notes
 * `asChild` accepts one native `svg` element. Invalid hosts safely fall back to
 * an empty div placeholder. Icons are decorative by default. Set
 * `decorative={false}` with an accessible name only for a meaningful icon.
 * The forwarded ref targets the default div or, with `asChild`, the SVG.
 */
interface EmptyStateIconOwnedSemantics {
  role?: never;
  'aria-hidden'?: never;
  inert?: never;
}

interface DecorativeEmptyStateIconProps {
  /**
   * Hides the icon from assistive technology.
   *
   * @defaultValue true
   */
  decorative?: true;
  'aria-label'?: never;
  'aria-labelledby'?: never;
}

type MeaningfulEmptyStateIconProps = {
  /** Exposes the icon as a named image. */
  decorative: false;
} & (
  | {
      'aria-label': string;
      'aria-labelledby'?: never;
    }
  | {
      'aria-label'?: never;
      'aria-labelledby': string;
    }
);

type EmptyStateIconAccessibilityProps =
  | DecorativeEmptyStateIconProps
  | MeaningfulEmptyStateIconProps;

/** Props for the default EmptyState icon container. */
export type EmptyStateIconDefaultProps = Omit<
  PrimitiveProps<'div'>,
  | keyof DOMAttributes<Element>
  | 'accessKey'
  | 'aria-hidden'
  | 'aria-label'
  | 'aria-labelledby'
  | 'asChild'
  | 'autoFocus'
  | 'contentEditable'
  | 'draggable'
  | 'inert'
  | 'role'
  | 'tabIndex'
> &
  EmptyStateIconOwnedSemantics &
  EmptyStateIconAccessibilityProps & {
    asChild?: false;
    /** Presentation content only. Event handlers and focus behavior belong in EmptyStateActions. */
    children?: ReactNode;
  };

type PassiveEmptyStateSvgProps = Omit<
  ComponentPropsWithoutRef<'svg'>,
  | keyof DOMAttributes<Element>
  | 'accessKey'
  | 'autoFocus'
  | 'contentEditable'
  | 'dangerouslySetInnerHTML'
  | 'draggable'
  | 'focusable'
  | 'tabIndex'
>;

/** Props for an EmptyState icon delegated to one native SVG element. */
export type EmptyStateIconAsChildProps = Omit<
  PassiveEmptyStateSvgProps,
  | keyof DOMAttributes<Element>
  | 'accessKey'
  | 'aria-hidden'
  | 'aria-label'
  | 'aria-labelledby'
  | 'children'
  | 'contentEditable'
  | 'autoFocus'
  | 'draggable'
  | 'focusable'
  | 'inert'
  | 'role'
  | 'tabIndex'
> &
  EmptyStateIconOwnedSemantics &
  EmptyStateIconAccessibilityProps & {
    asChild: true;
    children: ReactElement<PassiveEmptyStateSvgProps, 'svg'>;
  };

/** Complete discriminated EmptyState icon props. */
export type EmptyStateIconProps = EmptyStateIconDefaultProps | EmptyStateIconAsChildProps;

type EmptyStateIconPropsWithRef =
  | (EmptyStateIconDefaultProps & RefAttributes<HTMLDivElement>)
  | (EmptyStateIconAsChildProps & RefAttributes<SVGSVGElement>);

/** Branch-aware EmptyState icon component signature. */
export interface EmptyStateIconComponent {
  (props: EmptyStateIconDefaultProps & RefAttributes<HTMLDivElement>): ReactElement | null;
  (props: EmptyStateIconAsChildProps & RefAttributes<SVGSVGElement>): ReactElement | null;
  (props: EmptyStateIconPropsWithRef): ReactElement | null;
  displayName?: string;
}

/**
 * Props for the heading slot in EmptyState.
 *
 * ### Notes
 * Keep the title short and pair it with `EmptyStateDescription` for context.
 * Use `asChild` with the page's appropriate heading level when the default h3
 * would skip the surrounding document hierarchy. `asChild` accepts one native
 * h1-h6 element; other children fall back to their textual content in the
 * default h3. Pass native phrasing content to the default element; custom or
 * block components fall back to their textual children.
 */
export type EmptyStateTitleProps = PrimitiveProps<'h3'>;

/**
 * Props for the explanatory text slot in EmptyState.
 *
 * `asChild` accepts one native p element; other children fall back to their
 * textual content in the default p. Pass native phrasing content to the
 * default element; custom or block components fall back to their textual
 * children.
 */
export type EmptyStateDescriptionProps = PrimitiveProps<'p'>;

/**
 * Props for the optional action area in EmptyState.
 *
 * ### Notes
 * Place follow-up controls here, such as a create button or retry link.
 */
export type EmptyStateActionsProps = PrimitiveProps<'div'>;
