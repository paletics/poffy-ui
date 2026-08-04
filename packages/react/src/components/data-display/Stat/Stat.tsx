'use client';

import { cx } from '@/styled-system/css';
import { stat } from '@/styled-system/recipes';
import { ElementType, createContext, forwardRef, useContext, useMemo } from 'react';
import { Slot } from '@radix-ui/react-slot';
import {
  getFallbackChildrenForNativeContainer,
  getFallbackChildrenPreservingVoidHost,
} from '@/components/shared/asChild';
import type { StatComponent, StatProps } from './Stat.types';
import { StatLabel } from './StatLabel';
import { StatNumber } from './StatNumber';
import { StatHelpText } from './StatHelpText';
import { StatArrow } from './StatArrow';
import { isStatAsChildHost } from './Stat.utils';

interface StatContextValue {
  intent?: StatProps['intent'];
  size?: StatProps['size'];
  classes: ReturnType<typeof stat>;
}

const StatContext = createContext<StatContextValue | null>(null);

/**
 * Returns the nearest Stat context for compound subcomponents.
 */
export const useStatContext = () => useContext(StatContext);

const StatRootImpl = forwardRef<HTMLElement, StatProps>((props, ref) => {
  const { asChild, children, className, intent, size, ...rest } = props;
  const canUseAsChild = Boolean(asChild && isStatAsChildHost(children));
  const Component = (canUseAsChild ? Slot : 'div') as ElementType;
  const classes = useMemo(() => stat({ intent, size }), [intent, size]);
  const contextValue = useMemo(() => ({ intent, size, classes }), [intent, size, classes]);

  return (
    <StatContext.Provider value={contextValue}>
      <Component ref={ref} className={cx(classes.root, className)} {...rest}>
        {asChild && !canUseAsChild
          ? getFallbackChildrenForNativeContainer(getFallbackChildrenPreservingVoidHost(children))
          : children}
      </Component>
    </StatContext.Provider>
  );
});
StatRootImpl.displayName = 'Stat.Root';
const StatRoot = StatRootImpl as StatComponent;

/**
 * Groups a metric label, value, and optional supporting context.
 *
 * `size` and `intent` are inherited by the compound parts. It renders a `div`
 * by default and accepts `article`, `div`, or `section` for `asChild`; an
 * incompatible child falls back to a safe native container.
 */

export const Stat = Object.assign(StatRoot, {
  Label: StatLabel,
  Number: StatNumber,
  HelpText: StatHelpText,
  Arrow: StatArrow,
});
