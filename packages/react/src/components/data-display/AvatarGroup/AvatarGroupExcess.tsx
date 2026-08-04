import { cx } from '@/styled-system/css';
import { forwardRef, type Ref } from 'react';
import { AvatarGroupExcessProps } from './AvatarGroup.types';
import { useAvatarGroupContext } from './AvatarGroupContext';
import { getAvatarGroupLabels } from './AvatarGroup.locales';
import { Avatar } from '../Avatar/Avatar';
import { ButtonPrimitive } from '@/components/inputs/ButtonPrimitive';
import { VisuallyHidden } from '@/components/a11y/VisuallyHidden';
import { useOptionalLocale } from '@/providers/LocaleProvider';

/**
 * Internal props used while mapping through AvatarGroup.
 */
export interface InternalExcessProps extends AvatarGroupExcessProps {
  index?: number;
}

/**
 * Shows the count of AvatarGroup members omitted from view.
 *
 * It inherits the group's size and localizes its accessible text. With
 * `onClick` it renders a labelled button; otherwise the visible `+count` is
 * paired with visually hidden text. Non-finite and negative counts become zero.
 */
export const AvatarGroupExcess = forwardRef<HTMLSpanElement, InternalExcessProps>((props, ref) => {
  const { count, onClick, className, index, ...rest } = props;
  const context = useAvatarGroupContext();
  const locale = useOptionalLocale()?.locale;
  const size = context?.size ?? 'md';
  const normalizedCount = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
  const excessLabel =
    context?.showMoreLabel?.(normalizedCount) ??
    getAvatarGroupLabels(locale).showMore(normalizedCount);

  if (onClick) {
    return (
      <Avatar.Root
        ref={ref as Ref<HTMLSpanElement>}
        className={cx('avatar-excess avatar', className)}
        size={size}
        asChild
        data-clickable=""
        data-index={index}
        {...rest}
      >
        <ButtonPrimitive aria-label={excessLabel} onClick={onClick}>
          <Avatar.Fallback>+{normalizedCount}</Avatar.Fallback>
        </ButtonPrimitive>
      </Avatar.Root>
    );
  }

  return (
    <Avatar.Root
      ref={ref}
      className={cx('avatar-excess avatar', className)}
      size={size}
      data-index={index}
      {...rest}
    >
      <Avatar.Fallback>
        <span aria-hidden="true">+{normalizedCount}</span>
        <VisuallyHidden>{excessLabel}</VisuallyHidden>
      </Avatar.Fallback>
    </Avatar.Root>
  );
});

AvatarGroupExcess.displayName = 'AvatarGroup.Excess';
