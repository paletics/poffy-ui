import { type StatusIntent, PrimitiveProps } from '@poffy-ui/types';
import type { ReactElement, ReactNode, RefAttributes, SVGProps } from 'react';
import type {
  DefaultHostProps,
  PolymorphicAsChildComponent,
  RetargetedAsChildHostProps,
} from '@/components/shared/polymorphicAsChild.types';

/** Shared base props for Stat. */
export interface StatBaseProps {
  children?: ReactNode;
  /** Visual scale inherited by all Stat compound parts. */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Semantic trend/status accent inherited by Stat subcomponents.
   *
   * ### Notes
   * Use only when the metric needs positive, warning, or negative emphasis.
   */
  intent?: Extract<StatusIntent, 'success' | 'warning' | 'danger'>;
}

/**
 * Type checks Stat root props with native `div` attributes.
 */
type StatNativeProps = PrimitiveProps<'div', StatBaseProps>;
type StatRootAsChildElement = ReactElement<Record<string, unknown>, 'article' | 'div' | 'section'>;
/** Props for Stat rendered with its default host. */
export type StatDefaultProps = DefaultHostProps<StatNativeProps>;
/** Props for Stat delegated to an asChild host. */
export type StatAsChildProps = RetargetedAsChildHostProps<
  StatNativeProps,
  HTMLElement,
  StatRootAsChildElement
>;
/** Public props for Stat. */
export type StatProps = StatDefaultProps | StatAsChildProps;
/** Polymorphic component call signatures for Stat. */
export type StatComponent = PolymorphicAsChildComponent<
  StatDefaultProps,
  StatAsChildProps,
  HTMLDivElement,
  HTMLElement
>;

/**
 * Content props for the descriptive metric label.
 */
export interface StatLabelBaseProps {
  children?: ReactNode;
}

/**
 * Type checks StatLabel wrapping a native `div`.
 */
type StatTextAsChildElement = ReactElement<Record<string, unknown>, 'div' | 'p' | 'span'>;
type StatLabelNativeProps = PrimitiveProps<'div', StatLabelBaseProps>;
/** Props for StatLabel rendered with its default host. */
export type StatLabelDefaultProps = DefaultHostProps<StatLabelNativeProps>;
/** Props for StatLabel delegated to an asChild host. */
export type StatLabelAsChildProps = RetargetedAsChildHostProps<
  StatLabelNativeProps,
  HTMLElement,
  StatTextAsChildElement
>;
/** Public props for StatLabel. */
export type StatLabelProps = StatLabelDefaultProps | StatLabelAsChildProps;
/** Polymorphic component call signatures for StatLabel. */
export type StatLabelComponent = PolymorphicAsChildComponent<
  StatLabelDefaultProps,
  StatLabelAsChildProps,
  HTMLDivElement,
  HTMLElement
>;

/**
 * Content props for the primary metric value.
 */
export interface StatNumberBaseProps {
  children?: ReactNode;
}

/**
 * Type checks StatNumber wrapping a native `div`.
 */
type StatNumberNativeProps = PrimitiveProps<'div', StatNumberBaseProps>;
/** Props for StatNumber rendered with its default host. */
export type StatNumberDefaultProps = DefaultHostProps<StatNumberNativeProps>;
/** Props for StatNumber delegated to an asChild host. */
export type StatNumberAsChildProps = RetargetedAsChildHostProps<
  StatNumberNativeProps,
  HTMLElement,
  StatTextAsChildElement
>;
/** Public props for StatNumber. */
export type StatNumberProps = StatNumberDefaultProps | StatNumberAsChildProps;
/** Polymorphic component call signatures for StatNumber. */
export type StatNumberComponent = PolymorphicAsChildComponent<
  StatNumberDefaultProps,
  StatNumberAsChildProps,
  HTMLDivElement,
  HTMLElement
>;

/**
 * Content props for contextual or explanatory Stat text.
 */
export interface StatHelpTextBaseProps {
  children?: ReactNode;
}

/**
 * Type checks StatHelpText wrapping a native `div`.
 */
type StatHelpTextNativeProps = PrimitiveProps<'div', StatHelpTextBaseProps>;
/** Props for StatHelpText rendered with its default host. */
export type StatHelpTextDefaultProps = DefaultHostProps<StatHelpTextNativeProps>;
/** Props for StatHelpText delegated to an asChild host. */
export type StatHelpTextAsChildProps = RetargetedAsChildHostProps<
  StatHelpTextNativeProps,
  HTMLElement,
  StatTextAsChildElement
>;
/** Public props for StatHelpText. */
export type StatHelpTextProps = StatHelpTextDefaultProps | StatHelpTextAsChildProps;
/** Polymorphic component call signatures for StatHelpText. */
export type StatHelpTextComponent = PolymorphicAsChildComponent<
  StatHelpTextDefaultProps,
  StatHelpTextAsChildProps,
  HTMLDivElement,
  HTMLElement
>;

/**
 * Props for the directional trend indicator.
 */
export interface StatArrowBaseProps {
  /**
   * Trend direction: `increase` shows an upward arrow, `decrease` shows a downward arrow.
   *
   * ### Notes
   * The arrow is visual support only. Include the trend direction in
   * adjacent text for screen reader and color-blind users.
   */
  type?: 'increase' | 'decrease';
}

/**
 * Type checks StatArrow wrapping a native inline `span`.
 */
type StatArrowNativeProps = Omit<
  PrimitiveProps<'span', StatArrowBaseProps>,
  'aria-hidden' | 'asChild' | 'children' | 'role'
>;

type StatArrowAccessibilityProps =
  | {
      decorative?: true;
      'aria-label'?: never;
      'aria-labelledby'?: never;
    }
  | ({
      decorative: false;
      'aria-hidden'?: never;
    } & (
      | { 'aria-label': string; 'aria-labelledby'?: never }
      | { 'aria-label'?: never; 'aria-labelledby': string }
    ));

/** Props for StatArrow rendered with its default host. */
export type StatArrowDefaultProps = StatArrowNativeProps &
  StatArrowAccessibilityProps & {
    asChild?: false;
    children?: never;
  };

/** Props for StatArrow delegated to an asChild host. */
export type StatArrowAsChildProps = StatArrowNativeProps &
  StatArrowAccessibilityProps & {
    asChild: true;
    children: ReactElement<SVGProps<SVGSVGElement>, 'svg'>;
  };

/** Public props for StatArrow. */
export type StatArrowProps = StatArrowDefaultProps | StatArrowAsChildProps;

/**
 * Public ref overloads for the native and `asChild` StatArrow hosts.
 */
export interface StatArrowComponent {
  (props: StatArrowDefaultProps & RefAttributes<HTMLSpanElement>): ReactElement | null;
  (props: StatArrowAsChildProps & RefAttributes<SVGSVGElement>): ReactElement | null;
  (
    props:
      | (StatArrowDefaultProps & RefAttributes<HTMLSpanElement>)
      | (StatArrowAsChildProps & RefAttributes<SVGSVGElement>),
  ): ReactElement | null;
}
