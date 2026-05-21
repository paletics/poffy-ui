import { cx } from '@/styled-system/css';
import { stat } from '@/styled-system/recipes';
import { ElementType, forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { StatLabelProps } from './Stat.types';
import { useStatContext } from './Stat';

/**
 * The descriptive label for a Stat metric block.
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Panda CSS (Recipe: stat), Radix Slot
 * ### Notes
 * Renders above StatNumber to identify the metric being displayed.
 * ### Accessibility
 * - Use a meaningful label so screen readers can announce the metric in context.
 * @example
 * ```tsx
 * import { Stat } from '@poffy-ui/react/data-display';
 *
 * <Stat>
 *   <Stat.Label>Total Users</Stat.Label>
 *   <Stat.Number>84,293</Stat.Number>
 * </Stat>
 * ```
 */
export const StatLabel = forwardRef<HTMLDivElement, StatLabelProps>((props, ref) => {
  const { asChild, children, className, ...rest } = props;
  const context = useStatContext();
  const Component = asChild ? Slot : ('div' as ElementType);
  const classes = stat({ intent: context?.intent });

  return (
    <Component ref={ref} className={cx(classes.label, className)} {...rest}>
      {children}
    </Component>
  );
});

StatLabel.displayName = 'StatLabel';
