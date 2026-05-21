'use client';

import { cx } from '@/styled-system/css';
import { stat } from '@/styled-system/recipes';
import { ElementType, createContext, forwardRef, useContext } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { StatProps } from './Stat.types';

interface StatContextValue {
  intent?: StatProps['intent'];
}

const StatContext = createContext<StatContextValue | null>(null);

/**
 * Returns the nearest Stat context for compound subcomponents.
 */
export const useStatContext = () => useContext(StatContext);

/**
 * A data display block for presenting key metrics and KPIs.
 * ### AI Context & Architecture
 * - Tier: Molecules, Stack: Panda CSS (Recipe: stat), Radix Slot
 * ### Design Tokens
 * - spacing/typography: silver-ratio tokens
 * ### Variant Logic
 * - N/A
 * ### Notes
 * Composed of StatLabel, StatNumber, StatHelpText, and StatArrow sub-components.
 * ### Accessibility
 * - Use descriptive labels to ensure metric content is understood by screen readers.
 * ### AI Usage
 * - Use in dashboard or analytics contexts to highlight a single important figure.
 * @example
 * ```tsx
 * import { Stat } from '@poffy-ui/react/data-display';
 *
 * <Stat>
 *   <Stat.Label>Monthly Revenue</Stat.Label>
 *   <Stat.Number>$1,234,567</Stat.Number>
 *   <Stat.HelpText>
 *     <Stat.Arrow type="increase" />
 *     +12.5% from last month
 *   </Stat.HelpText>
 * </Stat>
 * ```
 */
export const Stat = forwardRef<HTMLDivElement, StatProps>((props, ref) => {
  const { asChild, children, className, intent, ...rest } = props;
  const Component = asChild ? Slot : ('div' as ElementType);
  const classes = stat({ intent });

  return (
    <StatContext.Provider value={{ intent }}>
      <Component ref={ref} className={cx(classes.root, className)} {...rest}>
        {children}
      </Component>
    </StatContext.Provider>
  );
});

Stat.displayName = 'Stat';
