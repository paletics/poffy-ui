import { motion } from 'motion/react';
import { SpinnerInternalProps } from '../Spinner.types';

const SQRT2 = Math.SQRT2;

/**
 * Internal motion component: Silver ratio driven animation.
 */
export const MotionSilver = ({
  size,
  thickness,
  radius,
  circumference,
  classes,
}: SpinnerInternalProps) => {
  const cx = size / 2;
  const cy = size / 2;

  const arc1 = circumference / SQRT2;
  const arc2 = circumference / 2;
  const arc3 = circumference / (2 * SQRT2);

  const off1Long = circumference - arc1;
  const off1Short = circumference - arc2;

  const cycle = 2 * (1 + SQRT2);
  const t1 = 1 / (1 + SQRT2);
  const t2 = SQRT2 / (1 + SQRT2);

  return (
    <>
      <motion.circle
        cx={cx}
        cy={cy}
        r={radius}
        strokeWidth={thickness / 2}
        fill="transparent"
        strokeLinecap="round"
        className={classes.indicator}
        animate={{
          rotate: [0, 720],
          opacity: [0.08, 0.22, 0.08],
        }}
        transition={{
          rotate: { duration: cycle, repeat: Infinity, ease: 'easeInOut' },
          opacity: { duration: cycle, repeat: Infinity, ease: 'easeInOut' },
        }}
        strokeDasharray={`${arc3} ${circumference - arc3}`}
      />

      <motion.circle
        cx={cx}
        cy={cy}
        r={radius}
        strokeWidth={thickness / SQRT2}
        fill="transparent"
        strokeLinecap="round"
        className={classes.indicator}
        animate={{
          rotate: [0, 360],
          opacity: [0.28, 0.5, 0.28],
        }}
        transition={{
          rotate: { duration: cycle / SQRT2, repeat: Infinity, ease: 'easeInOut' },
          opacity: { duration: cycle / SQRT2, repeat: Infinity, ease: 'easeInOut' },
        }}
        strokeDasharray={`${arc2} ${arc2}`}
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
          strokeDashoffset: [off1Short, off1Long, off1Long, off1Short],
          rotate: [0, 360 * t1, 360 * t2, 360],
        }}
        transition={{
          duration: cycle,
          repeat: Infinity,
          ease: 'easeInOut',
          times: [0, t1, t2, 1],
        }}
        strokeDasharray={circumference}
      />
    </>
  );
};
