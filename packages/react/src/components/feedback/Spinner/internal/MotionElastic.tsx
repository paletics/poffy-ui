import { animate, motion, useMotionValue } from 'motion/react';
import { useEffect } from 'react';
import { SpinnerInternalProps } from '../Spinner.types';

/**
 * Internal motion component: Elastic animation.
 */
export const MotionElastic = ({
  size,
  thickness,
  radius,
  circumference,
  classes,
}: SpinnerInternalProps) => {
  const offset = useMotionValue(circumference * 0.55);
  const rotation = useMotionValue(0);

  useEffect(() => {
    let cancelled = false;
    let cumulativeRotation = 0;

    const meetOffset = circumference * 0.015;

    const runCycle = () => {
      if (cancelled) return;

      const shrinkOffset = circumference * (0.3 + Math.random() * 0.35);
      const overshoot = shrinkOffset * (1.1 + Math.random() * 0.15);
      const stretchDuration = 1.2 + Math.random() * 1.0;
      const bounceDuration = 1.2 + Math.random() * 0.8;
      const rotDelta = 180 + Math.random() * 220;
      cumulativeRotation += rotDelta;

      animate(offset, meetOffset, {
        duration: stretchDuration,
        ease: [0.4, 0, 1, 1],
        onComplete: () => {
          if (cancelled) return;

          animate(offset, [meetOffset, overshoot, shrinkOffset], {
            duration: bounceDuration,
            ease: ['circOut', 'linear'],
            times: [0, 0.5, 1],
            onComplete: runCycle,
          });
        },
      });

      animate(rotation, cumulativeRotation, {
        duration: stretchDuration + bounceDuration,
        ease: 'easeInOut',
      });
    };

    runCycle();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- motion values are stable refs and should not restart the elastic loop after mount.
  }, [circumference]);

  return (
    <motion.circle
      className={classes.indicator}
      cx={size / 2}
      cy={size / 2}
      r={radius}
      strokeWidth={thickness}
      fill="transparent"
      strokeLinecap="round"
      strokeDasharray={circumference}
      style={{
        strokeDashoffset: offset,
        rotate: rotation,
      }}
    />
  );
};
