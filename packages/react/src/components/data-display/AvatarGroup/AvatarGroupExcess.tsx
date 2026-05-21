import { cx } from '@/styled-system/css';
import { forwardRef, type Ref } from 'react';
import { AvatarGroupExcessProps } from './AvatarGroup.types';
import { useAvatarGroupContext } from './AvatarGroupContext';
import { Avatar } from '../Avatar/Avatar';
import { ButtonPrimitive } from '@/components/inputs/ButtonPrimitive';

/**
 * Internal props used while mapping through AvatarGroup.
 */
export interface InternalExcessProps extends AvatarGroupExcessProps {
  index?: number;
}

/**
 * The excess indicator component for AvatarGroup (`+X`).
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Panda CSS (Recipe: avatar), React Context
 * ### Design Tokens
 * - spacing/size: silver-ratio tokens inherited from AvatarGroup context
 * ### Variant Logic
 * - N/A
 * ### Notes
 * This component is automatically injected by AvatarRoot when children exceed `max`.
 * ### Accessibility
 * - Uses `asChild` to wrap an accessible button. Focus visible is imperative if `onClick` is provided.
 * ### AI Usage
 * - Do not use this directly. Manage via `AvatarGroup` props (`max`, `total`).
 */
export const AvatarGroupExcess = forwardRef<HTMLSpanElement, InternalExcessProps>((props, ref) => {
  const { count, onClick, className, index, ...rest } = props;
  const context = useAvatarGroupContext();
  const size = context?.size ?? 'md';
  const excessLabel = count === 1 ? 'Show 1 more avatar' : `Show ${count} more avatars`;

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
          <Avatar.Fallback>+{count}</Avatar.Fallback>
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
      <Avatar.Fallback>+{count}</Avatar.Fallback>
    </Avatar.Root>
  );
});

AvatarGroupExcess.displayName = 'AvatarGroup.Excess';
