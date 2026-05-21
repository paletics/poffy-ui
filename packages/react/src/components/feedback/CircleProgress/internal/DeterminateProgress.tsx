import { InternalProgressProps } from '../CircleProgress.types';

interface DeterminateProgressProps extends InternalProgressProps {
  value: number;
  animation?: 'progress' | 'none';
}

/**
 * Renders the determinate CircleProgress indicator stroke.
 */
export const DeterminateProgress = ({
  radius,
  thickness,
  size,
  classes,
}: DeterminateProgressProps) => {
  return (
    <circle
      className={classes.indicator}
      cx={size / 2}
      cy={size / 2}
      r={radius}
      strokeWidth={thickness}
    />
  );
};
