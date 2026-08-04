import { cx } from '@/styled-system/css';
import { closeButton } from '@/styled-system/recipes';
import {
  getFallbackChildrenForNativeButton,
  isButtonCompatibleAsChildHost,
  isExclusiveButtonAsChildHost,
  isNonVoidAsChildHost,
  shouldEmulateButtonHost,
} from '@/components/shared/asChild';
import {
  createDisabledActivationHandlers,
  guardDisabledActivationHandlers,
  useButtonKeyboardActivation,
} from '@poffy-ui/behavior/activation';
import { omitNativeButtonOnlyProps } from '@/components/shared/buttonDelegation';
import { cloneElement, forwardRef, isValidElement } from 'react';
import type { ElementType, MouseEvent, ReactNode } from 'react';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { CrossIcon } from '@/components/media/Icon/icons';
import type { CloseButtonComponent, CloseButtonProps } from './CloseButton.types';
import { getCommonMessages } from '@/components/shared/common.locales';
import { useOptionalLocale } from '@/providers/LocaleProvider';

const CloseButtonImpl = forwardRef<HTMLElement, CloseButtonProps>((rawProps, ref) => {
  const {
    size = 'md',
    appearance = 'ghost',
    shape = 'rounded',
    className,
    disabled = false,
    'aria-label': ariaLabel,
    'aria-disabled': _ariaDisabled,
    onAuxClick,
    onAuxClickCapture,
    onClick,
    onClickCapture,
    onKeyDown,
    onKeyDownCapture,
    onKeyUp,
    onKeyUpCapture,
    onBlur,
    onPointerDown,
    onPointerDownCapture,
    onPointerUp,
    onPointerUpCapture,
    asChild,
    children,
    type: _type,
    ...props
  } = rawProps as CloseButtonProps & { type?: unknown };
  const messages = getCommonMessages(useOptionalLocale()?.locale);
  const resolvedAriaLabel = ariaLabel?.trim() || messages.close;
  const recipeClass = closeButton({ size, appearance, shape });
  const asChildElement = asChild && isExclusiveButtonAsChildHost(children) ? children : null;
  const canUseAsChild = Boolean(asChild && asChildElement);
  const isButtonCompatibleHost = isButtonCompatibleAsChildHost(asChildElement);
  const needsButtonSemantics = Boolean(canUseAsChild && shouldEmulateButtonHost(asChildElement));
  const Component = (canUseAsChild ? Slot : 'button') as ElementType;
  const hostProps = asChild ? omitNativeButtonOnlyProps(props) : props;
  const shouldGuardAsChildActivation = Boolean(canUseAsChild && disabled);
  const fallbackChildren = isValidElement<{ children?: ReactNode }>(children)
    ? children.props.children
    : children;
  const safeFallbackChildren =
    asChild && isNonVoidAsChildHost(children) && !canUseAsChild
      ? getFallbackChildrenForNativeButton(children)
      : fallbackChildren;

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    onClick?.(event as MouseEvent<HTMLButtonElement>);
  };

  const keyboardActivation = useButtonKeyboardActivation<HTMLButtonElement>({
    enabled: needsButtonSemantics && !disabled,
    onBlur,
    onKeyDown,
    onKeyUp,
  });

  const guardedChildren = guardDisabledActivationHandlers(children, shouldGuardAsChildActivation);
  const activationHandlers = createDisabledActivationHandlers(shouldGuardAsChildActivation, {
    onAuxClick,
    onAuxClickCapture,
    onClick: handleClick,
    onClickCapture,
    onKeyDown: keyboardActivation.onKeyDown,
    onKeyDownCapture,
    onKeyUp: keyboardActivation.onKeyUp,
    onKeyUpCapture,
    onPointerDown,
    onPointerDownCapture,
    onPointerUp,
    onPointerUpCapture,
  });
  const slottableChildren: ReactNode =
    canUseAsChild && isValidElement<Record<string, unknown>>(guardedChildren)
      ? cloneElement(guardedChildren, {
          'aria-disabled': disabled ? true : undefined,
          'aria-label': resolvedAriaLabel,
          disabled: isButtonCompatibleHost ? disabled : undefined,
          ...(isButtonCompatibleHost ? { type: 'button' } : {}),
          ...(needsButtonSemantics ? { role: 'button', tabIndex: 0 } : {}),
        })
      : guardedChildren;

  return (
    <Component
      ref={ref}
      className={cx(recipeClass, className)}
      disabled={canUseAsChild ? undefined : disabled}
      {...hostProps}
      type={canUseAsChild ? undefined : 'button'}
      aria-disabled={disabled ? true : undefined}
      aria-label={resolvedAriaLabel}
      data-disabled={disabled ? '' : undefined}
      onBlur={keyboardActivation.onBlur}
      {...activationHandlers}
    >
      {canUseAsChild ? (
        <Slottable>{slottableChildren}</Slottable>
      ) : asChild ? (
        safeFallbackChildren
      ) : null}
      <CrossIcon />
    </Component>
  );
});

CloseButtonImpl.displayName = 'CloseButton';

/**
 * Triggers dismissal of its owning surface.
 *
 * The accessible name defaults to the active locale's “Close” message; override `aria-label`
 * when the target needs to be named. `asChild` accepts an action-only host, not a destination
 * link; unsupported children fall back to a native button. Disabled delegated hosts cannot
 * activate through pointer or keyboard input.
 */

export const CloseButton = CloseButtonImpl as CloseButtonComponent;
