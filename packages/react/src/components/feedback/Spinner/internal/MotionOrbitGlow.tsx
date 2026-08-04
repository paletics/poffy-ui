import { motion } from 'motion/react';
import { useId } from 'react';
import { SpinnerInternalProps } from '../Spinner.types';
import { getSpinnerMotionDuration } from './motionTiming';

const SQRT2 = Math.SQRT2;

/**
 * Internal motion component: Orbit Glow animation.
 */
export const MotionOrbitGlow = ({
  size,
  thickness,
  radius,
  circumference,
  classes,
  motionStyle,
}: SpinnerInternalProps) => {
  const rawId = useId();
  const filterId = `glow-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  const cx = size / 2;
  const cy = size / 2;

  const arcLength = circumference / SQRT2;
  const dashArray = `${arcLength} ${circumference - arcLength}`;
  const blur = Math.max(1.5, thickness * 0.7);

  const cycle = 2 * (1 + SQRT2);

  return (
    <>
      <defs>
        <filter
          id={filterId}
          x="-35%"
          y="-35%"
          width="170%"
          height="170%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <motion.circle
        cx={cx}
        cy={cy}
        r={radius}
        strokeWidth={thickness * 2.5}
        fill="transparent"
        strokeLinecap="round"
        className={classes.indicator}
        filter={`url(#${filterId})`}
        animate={{
          rotate: [0, 360],
          opacity: [0.08, 0.75, 0.35, 0.08],
        }}
        transition={{
          rotate: {
            duration: getSpinnerMotionDuration(cycle, motionStyle),
            repeat: Infinity,
            ease: 'linear',
          },
          opacity: {
            duration: getSpinnerMotionDuration(cycle, motionStyle),
            repeat: Infinity,
            ease: [0.2, 0, 0.8, 1],
            times: [0, 0.3, 0.6, 1],
          },
        }}
        strokeDasharray={dashArray}
      />

      <motion.circle
        cx={cx}
        cy={cy}
        r={radius}
        strokeWidth={thickness}
        fill="transparent"
        strokeLinecap="round"
        className={classes.indicator}
        animate={{
          rotate: [0, 360],
          opacity: [0.85, 1, 0.85],
        }}
        transition={{
          rotate: {
            duration: getSpinnerMotionDuration(cycle, motionStyle),
            repeat: Infinity,
            ease: 'linear',
          },
          opacity: {
            duration: getSpinnerMotionDuration(cycle, motionStyle),
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
        strokeDasharray={dashArray}
      />
    </>
  );
};
