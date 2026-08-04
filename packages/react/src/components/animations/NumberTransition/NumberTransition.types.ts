import type { Easing } from 'motion/react';
import type { MotionPrimitiveProps } from '@/types/motion';

/**
 * Props for an animated numeric value. Changing `to` begins interpolation from the current value.
 */
export type NumberTransitionProps = MotionPrimitiveProps<
  'span',
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
