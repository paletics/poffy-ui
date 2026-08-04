import { motion } from 'motion/react';
import { SpinnerInternalProps } from '../Spinner.types';
import { getSpinnerMotionDuration } from './motionTiming';

const SQRT2 = Math.SQRT2;

/**
 * Internal motion component: Dash animation.
 */
export const MotionDash = ({
  size,
  thickness,
  radius,
  circumference,
  classes,
  motionStyle,
}: SpinnerInternalProps) => {
  const offShort = circumference / SQRT2;
  const offLong = circumference * (1 - 1 / SQRT2);
  const dashArray = `${offShort} ${offLong}`;
  const t1 = 1 / (1 + SQRT2);
  const cycle = 2 * (1 + SQRT2);

  return (
    <motion.circle
      className={classes.indicator}
      cx={size / 2}
      cy={size / 2}
      r={radius}
      strokeWidth={thickness}
      animate={{
        strokeDashoffset: [offShort, offLong, offShort],
        rotate: [0, 720],
      }}
      transition={{
        strokeDashoffset: {
          duration: getSpinnerMotionDuration(cycle, motionStyle),
          repeat: Infinity,
          ease: [0.25, 1.5, 0.75, 1],
          times: [0, t1, 1],
        },
        rotate: {
          duration: getSpinnerMotionDuration(cycle, motionStyle),
          repeat: Infinity,
          ease: 'linear',
        },
      }}
      strokeDasharray={dashArray}
    />
  );
};
