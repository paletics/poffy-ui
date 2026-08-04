import { SpinnerInternalProps } from '../Spinner.types';
import { TrailArc } from './TrailArc';

const SQRT2 = Math.SQRT2;

interface LayerConfig {
  opacity: number;
  strokeScale: number;
  initialDelay: number;
  speedFactor: number;
}

const LAYERS: LayerConfig[] = [
  { opacity: 1, strokeScale: 1, initialDelay: 0, speedFactor: 1.0 },
  { opacity: 0.45, strokeScale: 1 / SQRT2, initialDelay: 1 / (4 * SQRT2), speedFactor: 1.08 },
  { opacity: 0.2, strokeScale: 1 / 2, initialDelay: 1 / (2 * SQRT2), speedFactor: 0.92 },
];

/**
 * Internal motion component: Trail animation.
 */
export const MotionTrail = ({
  size,
  thickness,
  radius,
  circumference,
  classes,
  motionStyle,
}: SpinnerInternalProps) => {
  const cx = size / 2;
  const cy = size / 2;

  return (
    <>
      {LAYERS.map((config, i) => (
        <TrailArc
          key={i}
          circumference={circumference}
          config={config}
          cx={cx}
          cy={cy}
          r={radius}
          strokeWidth={thickness * config.strokeScale}
          className={classes.indicator}
          motionStyle={motionStyle}
        />
      ))}
    </>
  );
};
