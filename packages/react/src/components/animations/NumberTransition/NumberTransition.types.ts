import { Easing } from 'motion/react';
import { ElementType } from 'react';
import { PrimitiveProps } from '@poffy-ui/types';

/**
 * NumberTransition Props
 *
 * ### Notes
 * `NumberTransition` is controlled by the numeric `to` prop. When `to`
 * changes, the component restarts interpolation from the current motion value
 * unless reduced motion is enabled.
 *
 * ### AI Usage
 * - **DO**: Provide `format` for currency, units, compact notation, and locale-aware strings.
 * - **DON'T**: Format by wrapping children; this component renders the animated value itself.
 *
 * ### Generic Parameters
 * - **T**: HTML element type rendered by the polymorphic primitive.
 */
export type NumberTransitionProps<T extends ElementType = 'span'> = PrimitiveProps<
  T,
  {
    /**
     * Start value
     *
     * @defaultValue `0`
     */
    from?: number;

    /**
     * Target value to animate to
     */
    to: number;

    /**
     * Number of decimal places
     *
     * @defaultValue `0`
     */
    decimals?: number;

    /**
     * Custom formatter for the value
     */
    format?: (value: number) => string;

    /**
     * Animation duration in seconds
     *
     * @defaultValue `1.414`
     */
    duration?: number;

    /**
     * Easing function
     *
     * @defaultValue `'easeOut'`
     */
    easing?: Easing;

    /**
     * Whether to start animation when entering viewport
     *
     * @defaultValue `true`
     */
    animateOnView?: boolean;

    /**
     * Delay before starting animation in seconds
     *
     * @defaultValue `0`
     */
    delay?: number;
  }
>;
