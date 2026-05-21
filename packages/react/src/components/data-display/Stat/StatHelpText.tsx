import { cx } from '@/styled-system/css';
import { stat } from '@/styled-system/recipes';
import { ElementType, forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { StatHelpTextProps } from './Stat.types';
import { useStatContext } from './Stat';

/**
 * Supplementary text displayed below StatNumber, typically used for trend or comparison info.
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Panda CSS (Recipe: stat), Radix Slot
 * ### Notes
 * Commonly paired with StatArrow to indicate direction of change.
 * ### Accessibility
 * - Keep text concise; combine with StatArrow's `aria-label` for full context.
 * @example
 * ```tsx
 * import { Stat } from '@poffy-ui/react/data-display';
 *
 * <Stat>
 *   <Stat.Number>$420,000</Stat.Number>
 *   <Stat.HelpText>
 *     <Stat.Arrow type="increase" />
 *     +8% from last week
 *   </Stat.HelpText>
 * </Stat>
 * ```
 */
export const StatHelpText = forwardRef<HTMLDivElement, StatHelpTextProps>((props, ref) => {
  const { asChild, children, className, ...rest } = props;
  const context = useStatContext();
  const Component = asChild ? Slot : ('div' as ElementType);
  const classes = stat({ intent: context?.intent });

  return (
    <Component ref={ref} className={cx(classes.helpText, className)} {...rest}>
      {children}
    </Component>
  );
});

StatHelpText.displayName = 'StatHelpText';
