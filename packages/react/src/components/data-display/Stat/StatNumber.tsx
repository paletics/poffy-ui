import { cx } from '@/styled-system/css';
import { stat } from '@/styled-system/recipes';
import { ElementType, forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import type { StatNumberComponent, StatNumberProps } from './Stat.types';
import { useStatContext } from './Stat';
import { isStatTextAsChildHost } from './Stat.utils';

const StatNumberImpl = forwardRef<HTMLElement, StatNumberProps>((props, ref) => {
  const { asChild, children, className, ...rest } = props;
  const context = useStatContext();
  const canUseAsChild = Boolean(asChild && isStatTextAsChildHost(children));
  const Component = (canUseAsChild ? Slot : 'div') as ElementType;
  const classes = context?.classes ?? stat({});

  return (
    <Component ref={ref} className={cx(classes.number, className)} {...rest}>
      {children}
    </Component>
  );
});

StatNumberImpl.displayName = 'StatNumber';

/** Renders the primary value for a Stat; `asChild` accepts `div`, `p`, or `span`. */

export const StatNumber = StatNumberImpl as StatNumberComponent;
