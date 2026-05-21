import { cx } from '@/styled-system/css';
import { stat } from '@/styled-system/recipes';
import { ElementType, forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { StatNumberProps } from './Stat.types';
import { useStatContext } from './Stat';

/**
 * The primary numeric value displayed within a Stat block.
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Panda CSS (Recipe: stat), Radix Slot
 * ### Design Tokens
 * - typography: large-scale silver-ratio token for prominent display
 * ### Notes
 * Should contain the raw value (formatted number, currency, percentage, etc.).
 * ### Accessibility
 * - Ensure the number is accompanied by StatLabel for context.
 * @example
 * ```tsx
 * import { Stat } from '@poffy-ui/react/data-display';
 *
 * <Stat>
 *   <Stat.Label>Active Sessions</Stat.Label>
 *   <Stat.Number>1,042</Stat.Number>
 * </Stat>
 * ```
 */
export const StatNumber = forwardRef<HTMLDivElement, StatNumberProps>((props, ref) => {
  const { asChild, children, className, ...rest } = props;
  const context = useStatContext();
  const Component = asChild ? Slot : ('div' as ElementType);
  const classes = stat({ intent: context?.intent });

  return (
    <Component ref={ref} className={cx(classes.number, className)} {...rest}>
      {children}
    </Component>
  );
});

StatNumber.displayName = 'StatNumber';
