import { cx } from '@/styled-system/css';
import { stat } from '@/styled-system/recipes';
import { ElementType, forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import type { StatLabelComponent, StatLabelProps } from './Stat.types';
import { useStatContext } from './Stat';
import { isStatTextAsChildHost } from './Stat.utils';

const StatLabelImpl = forwardRef<HTMLElement, StatLabelProps>((props, ref) => {
  const { asChild, children, className, ...rest } = props;
  const context = useStatContext();
  const canUseAsChild = Boolean(asChild && isStatTextAsChildHost(children));
  const Component = (canUseAsChild ? Slot : 'div') as ElementType;
  const classes = context?.classes ?? stat({});

  return (
    <Component ref={ref} className={cx(classes.label, className)} {...rest}>
      {children}
    </Component>
  );
});

StatLabelImpl.displayName = 'StatLabel';

/** Renders the descriptive label for a Stat metric; `asChild` accepts `div`, `p`, or `span`. */

export const StatLabel = StatLabelImpl as StatLabelComponent;
