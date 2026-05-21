import { type StatusIntent, PrimitiveProps } from '@poffy-ui/types';
import { ReactNode } from 'react';

/**
 * Base properties for the Stat root container.
 *
 * @example
 * ```tsx
 * import { Stat } from '@poffy-ui/react/data-display';
 *
 * <Stat intent="success">
 *   <Stat.Label>Conversion rate</Stat.Label>
 *   <Stat.Number>8.2%</Stat.Number>
 *   <Stat.HelpText><Stat.Arrow type="increase" /> 1.4% this week</Stat.HelpText>
 * </Stat>
 * ```
 *
 * ### Notes
 * Do: pair each value with `Stat.Label` so the metric has a programmatic
 * explanation in reading order.
 * Don't: use the trend color or arrow as the only indication of meaning.
 *
 * ### AI Usage
 * - Use for one key metric with optional trend context, not for arbitrary card content.
 */
export interface StatBaseProps {
  children?: ReactNode;
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
export type StatProps = PrimitiveProps<'div', StatBaseProps>;

/**
 * Base properties for the StatLabel element (descriptive metric title).
 */
export interface StatLabelBaseProps {
  children?: ReactNode;
}

/**
 * Type checks StatLabel wrapping a native `div`.
 */
export type StatLabelProps = PrimitiveProps<'div', StatLabelBaseProps>;

/**
 * Base properties for the StatNumber element (the main metric value).
 */
export interface StatNumberBaseProps {
  children?: ReactNode;
}

/**
 * Type checks StatNumber wrapping a native `div`.
 */
export type StatNumberProps = PrimitiveProps<'div', StatNumberBaseProps>;

/**
 * Base properties for the StatHelpText element (contextual or explanatory text).
 */
export interface StatHelpTextBaseProps {
  children?: ReactNode;
}

/**
 * Type checks StatHelpText wrapping a native `div`.
 */
export type StatHelpTextProps = PrimitiveProps<'div', StatHelpTextBaseProps>;

/**
 * Base properties for the StatArrow element (trend direction indicator).
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
 * Type checks StatArrow wrapping a native `div`.
 */
export type StatArrowProps = PrimitiveProps<'div', StatArrowBaseProps>;
