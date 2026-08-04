import { cloneElement, ElementType, forwardRef, isValidElement } from 'react';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { Icon } from '@/components/media/Icon';
import { getCommonMessages } from '@/components/shared/common.locales';
import { useOptionalLocale } from '@/providers/LocaleProvider';
import { cx } from '@/styled-system/css';
import { stat } from '@/styled-system/recipes';
import type { StatArrowComponent, StatArrowProps } from './Stat.types';
import { useStatContext } from './Stat';
import { isStatArrowAsChildHost } from './Stat.utils';

/**
 * A non-interactive trend icon. With `asChild`, provide one native SVG host;
 * incompatible hosts fall back to the built-in arrow.
 */
const StatArrowImpl = forwardRef<HTMLElement, StatArrowProps>((props, ref) => {
  const {
    asChild,
    children,
    className,
    type = 'increase',
    decorative = true,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-hidden': _ariaHidden,
    role: _role,
    ...rest
  } = props as StatArrowProps & { role?: unknown; 'aria-hidden'?: unknown };
  const context = useStatContext();
  const messages = getCommonMessages(useOptionalLocale()?.locale);
  const resolvedAriaLabel = decorative ? undefined : ariaLabel?.trim() || messages[type];
  const canUseAsChild = Boolean(asChild && isStatArrowAsChildHost(children));
  const Component = (canUseAsChild ? Slot : 'span') as ElementType;
  const classes = stat({ type, intent: context?.intent, size: context?.size });
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
  const slottableChild =
    canUseAsChild && isValidElement<Record<string, unknown>>(children)
      ? cloneElement(children, {
          'aria-label': resolvedAriaLabel,
          'aria-labelledby': decorative ? undefined : ariaLabelledBy,
          'aria-hidden': decorative ? true : false,
          role: decorative ? undefined : 'img',
        })
      : null;

  return (
    <Component
      ref={ref}
      className={cx(classes.arrow, className)}
      {...rest}
      aria-label={resolvedAriaLabel}
      aria-labelledby={decorative ? undefined : ariaLabelledBy}
      aria-hidden={decorative ? true : false}
      role={decorative ? undefined : 'img'}
    >
      {canUseAsChild ? <Slottable>{slottableChild}</Slottable> : arrowIcon}
    </Component>
  );
});
StatArrowImpl.displayName = 'StatArrow';

/**
 * Shows an increase or decrease arrow for a Stat.
 *
 * It is decorative by default and therefore hidden from assistive technology.
 * Set `decorative={false}` with an accessible name to expose it as an image;
 * omitted names then use localized increase/decrease text. `asChild` accepts
 * exactly one native `svg` and otherwise uses the built-in icon.
 */

export const StatArrow = StatArrowImpl as StatArrowComponent;
