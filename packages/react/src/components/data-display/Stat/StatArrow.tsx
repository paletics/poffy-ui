import { cx } from '@/styled-system/css';
import { stat } from '@/styled-system/recipes';
import { ElementType, forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { Icon } from '@/components/media/Icon';
import { StatArrowProps } from './Stat.types';
import { useStatContext } from './Stat';

/**
 * A directional arrow icon indicating the trend of a Stat value.
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Panda CSS (Recipe: stat), Radix Slot
 * ### Variant Logic
 * - type: `increase` renders an upward arrow; `decrease` renders a downward arrow.
 * ### Notes
 * Renders a built-in SVG icon. Pass `children` with `asChild` to substitute a custom icon.
 * ### Accessibility
 * - Has `role="img"` and `aria-label` set to the `type` value by default.
 * @example
 * ```tsx
 * import { Stat } from '@poffy-ui/react/data-display';
 *
 * <Stat.HelpText>
 *   <Stat.Arrow type="increase" />
 *   +23% vs last month
 * </Stat.HelpText>
 * ```
 *
 * @example Custom icon via asChild
 * ```tsx
 * import { Stat } from '@poffy-ui/react/data-display';
 * import { ChevronDownIcon } from '@poffy-ui/react/media';
 *
 * <Stat.Arrow type="decrease" asChild>
 *   <ChevronDownIcon aria-label="decrease" />
 * </Stat.Arrow>
 * ```
 */
export const StatArrow = forwardRef<HTMLDivElement, StatArrowProps>((props, ref) => {
  const { asChild, children, className, type = 'increase', ...rest } = props;
  const context = useStatContext();
  const Component = asChild ? Slot : ('div' as ElementType);
  const classes = stat({ type, intent: context?.intent });

  const arrowIcon =
    type === 'increase' ? (
      <Icon size="xs" variant="filled">
        <path d="M12 4l-8 8h16z" />
      </Icon>
    ) : (
      <Icon size="xs" variant="filled">
        <path d="M12 20l-8-8h16z" />
      </Icon>
    );

  return (
    <Component
      ref={ref}
      className={cx(classes.arrow, className)}
      aria-label={type}
      role="img"
      {...rest}
    >
      {asChild ? children : arrowIcon}
    </Component>
  );
});

StatArrow.displayName = 'StatArrow';
