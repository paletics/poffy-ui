import { cx } from '@/styled-system/css';
import { stat } from '@/styled-system/recipes';
import { ElementType, forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import type { StatHelpTextComponent, StatHelpTextProps } from './Stat.types';
import { useStatContext } from './Stat';
import { isStatTextAsChildHost } from './Stat.utils';

const StatHelpTextImpl = forwardRef<HTMLElement, StatHelpTextProps>((props, ref) => {
  const { asChild, children, className, ...rest } = props;
  const context = useStatContext();
  const canUseAsChild = Boolean(asChild && isStatTextAsChildHost(children));
  const Component = (canUseAsChild ? Slot : 'div') as ElementType;
  const classes = context?.classes ?? stat({});

  return (
    <Component ref={ref} className={cx(classes.helpText, className)} {...rest}>
      {children}
    </Component>
  );
});

StatHelpTextImpl.displayName = 'StatHelpText';

/** Renders supporting context such as a comparison period; `asChild` accepts `div`, `p`, or `span`. */

export const StatHelpText = StatHelpTextImpl as StatHelpTextComponent;
