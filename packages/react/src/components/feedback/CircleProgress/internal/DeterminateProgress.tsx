import { InternalProgressProps } from '../CircleProgress.types';

type DeterminateProgressProps = Pick<
  InternalProgressProps,
  'classes' | 'radius' | 'size' | 'thickness'
>;

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
