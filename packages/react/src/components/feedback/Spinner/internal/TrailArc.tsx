import { animate, motion, useMotionValue } from 'motion/react';
import { useEffect } from 'react';
import type { PoffyMotionStyle } from '@/providers/AnimationProvider.types';
import { getSpinnerMotionDuration } from './motionTiming';

const SQRT2 = Math.SQRT2;

function useOrganicArc(
  circumference: number,
  initialDelay: number,
  speedFactor: number,
  motionStyle: PoffyMotionStyle,
) {
  const offset = useMotionValue(circumference * 0.88);
  const rotation = useMotionValue(0);

  useEffect(() => {
    let cancelled = false;
    const controls: { stop: () => void }[] = [];
    let cumulativeRotation = rotation.get();
    let isFirst = true;

    const runCycle = () => {
      if (cancelled) return;

      controls.splice(0).forEach((control) => control.stop());

      const shortArc = circumference * (0.78 + Math.random() * 0.16);
      const longArc = circumference * (0.03 + Math.random() * 0.11);
      const midArc = circumference * (0.38 + Math.random() * 0.4);

      const duration = getSpinnerMotionDuration(
        (2 + SQRT2) * (1 + Math.random() * (SQRT2 - 1)) * speedFactor,
        motionStyle,
      );
      const rotDelta = 360 + Math.random() * (360 * SQRT2 - 360);
      const delay = isFirst ? getSpinnerMotionDuration(initialDelay, motionStyle) : 0;
      isFirst = false;

      const targetRot = cumulativeRotation + rotDelta;
      cumulativeRotation = targetRot;

      controls.push(
        animate(offset, [shortArc, longArc, midArc, longArc * 1.25, shortArc], {
          duration,
          delay,
          ease: ['easeOut', 'easeIn', 'easeOut', 'easeIn'],
          times: [0, 0.28, 0.54, 0.76, 1],
          onComplete: runCycle,
        }),
      );

      controls.push(
        animate(rotation, targetRot, {
          duration,
          delay,
          ease: 'easeOut',
        }),
      );
    };

    runCycle();
    return () => {
      cancelled = true;
      controls.forEach((control) => control.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- motion values are stable refs; delay/speed are layer constants and should not restart the organic loop after mount.
  }, [circumference, initialDelay, speedFactor, motionStyle]);

  return { offset, rotation };
}

interface TrailArcProps {
  circumference: number;
  config: {
    opacity: number;
    initialDelay: number;
    speedFactor: number;
  };
  cx: number;
  cy: number;
  r: number;
  strokeWidth: number;
  className?: string;
  motionStyle: PoffyMotionStyle;
}

/**
 * Renders one organic animated trail arc for Spinner.
 */
export const TrailArc = ({
  circumference,
  config,
  cx,
  cy,
  r,
  strokeWidth,
  className,
  motionStyle,
}: TrailArcProps) => {
  const { offset, rotation } = useOrganicArc(
    circumference,
    config.initialDelay,
    config.speedFactor,
    motionStyle,
  );

  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={r}
      strokeWidth={strokeWidth}
      fill="transparent"
      strokeLinecap="round"
      className={className}
      strokeDasharray={circumference}
      style={{
        opacity: config.opacity,
        strokeDashoffset: offset,
        rotate: rotation,
      }}
    />
  );
};
