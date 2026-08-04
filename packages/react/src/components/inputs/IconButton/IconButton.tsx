'use client';

import { ActionMotion } from '@/components/animations';
import {
  hasAsChildLinkDestination,
  isButtonAsChildHost,
  isButtonCompatibleAsChildHost,
  shouldEmulateButtonHost,
} from '@/components/shared/asChild';
import { omitNativeButtonOnlyProps } from '@/components/shared/buttonDelegation';
import { cx } from '@/styled-system/css';
import { iconButton } from '@/styled-system/recipes';
import {
  createDisabledActivationHandlers,
  guardDisabledActivationHandlers,
  useButtonKeyboardActivation,
} from '@poffy-ui/behavior/activation';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cloneElement, forwardRef, isValidElement, type ReactElement } from 'react';
import type { ElementType, MouseEvent, ReactNode } from 'react';
import type { IconButtonComponent, IconButtonOwnProps, IconButtonProps } from './IconButton.types';
import type { PrimitiveProps } from '@poffy-ui/types';

interface IconA11yProps {
  'aria-hidden'?: true;
  focusable?: 'false';
}


type IconButtonRuntimeProps = Omit<
  PrimitiveProps<'button', IconButtonOwnProps>,
  'aria-busy' | 'aria-disabled' | 'type'
>;

const IconButtonImpl = forwardRef<HTMLElement, IconButtonProps>(
  (
    {
      icon,
      size = 'md',
      intent = 'primary',
      appearance = 'ghost',
      shape = 'pill',
      className,
      disabled = false,
      loading = false,
      'aria-label': ariaLabel,
      'aria-disabled': _ariaDisabled,
      'aria-busy': _ariaBusy,
      animationType = 'bouncy',
      asChild,
      children,
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
      type: _type,
      ...props
    }: IconButtonRuntimeProps & {
      'aria-busy'?: unknown;
      'aria-disabled'?: unknown;
      type?: unknown;
    },
    ref,
  ) => {
    const recipeClass = iconButton({ size, intent, appearance, shape });
    const isDisabled = [disabled, loading].includes(true);
    const asChildCandidate = asChild && isButtonAsChildHost(children) ? children : null;
    const shouldFallbackDisabledCustomLink = Boolean(
      isDisabled &&
      asChildCandidate &&
      typeof asChildCandidate.type !== 'string' &&
      hasAsChildLinkDestination(asChildCandidate),
    );
    const asChildElement = shouldFallbackDisabledCustomLink ? null : asChildCandidate;
    const canUseAsChild = Boolean(asChildElement);
    const isButtonCompatibleHost = isButtonCompatibleAsChildHost(asChildElement);
    const needsButtonSemantics = Boolean(canUseAsChild && shouldEmulateButtonHost(asChildElement));
    const Component = (canUseAsChild ? Slot : 'button') as ElementType;
    const shouldGuardAsChildActivation = Boolean(canUseAsChild && isDisabled);
    const hostProps = asChild ? omitNativeButtonOnlyProps(props) : props;

    const iconWithProps = cloneElement(icon as ReactElement<IconA11yProps>, {
      'aria-hidden': true,
      focusable: 'false',
    });

    const handleClick = (event: MouseEvent<HTMLElement>) => {
      onClick?.(event as MouseEvent<HTMLButtonElement>);
    };

    const keyboardActivation = useButtonKeyboardActivation<HTMLButtonElement>({
      enabled: needsButtonSemantics && !isDisabled,
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
      canUseAsChild &&
      isValidElement<Record<string, unknown> & { children?: ReactNode }>(guardedChildren)
        ? cloneElement(
            guardedChildren,
            {
              'aria-disabled': isDisabled ? true : undefined,
              'aria-busy': loading ? true : undefined,
              'aria-label': ariaLabel,
              disabled: isButtonCompatibleHost ? isDisabled : undefined,
              ...(isDisabled && asChildElement?.type === 'a'
                ? {
                    href: undefined,
                    role: asChildElement.props.role ?? 'link',
                  }
                : {}),
              ...(isButtonCompatibleHost ? { type: 'button' } : {}),
              ...(needsButtonSemantics ? { role: 'button', tabIndex: 0 } : {}),
            },
            guardedChildren.props.children,
          )
        : guardedChildren;

    return (
      <ActionMotion
        asChild
        disabled={isDisabled}
        animationType={animationType}
        aria-label={ariaLabel}
        aria-busy={loading}
      >
        <Component
          ref={ref}
          className={cx(recipeClass, className)}
          disabled={canUseAsChild ? undefined : isDisabled}
          {...hostProps}
          type={canUseAsChild ? undefined : 'button'}
          aria-disabled={isDisabled ? true : undefined}
          aria-busy={loading ? true : undefined}
          data-disabled={isDisabled && !loading ? '' : undefined}
          onBlur={keyboardActivation.onBlur}
          {...activationHandlers}
        >
          {canUseAsChild && <Slottable>{slottableChildren}</Slottable>}
          {loading ? (
            <span className="ti ti-loader animate-spin" aria-hidden="true" />
          ) : (
            iconWithProps
          )}
          {!asChild && children}
        </Component>
      </ActionMotion>
    );
  },
);

IconButtonImpl.displayName = 'IconButton';

/**
 * Triggers an icon-only action.
 *
 * `aria-label` is required because the supplied icon is always decorative. `loading` replaces it
 * with a decorative spinner and disables activation. With `asChild`, a compatible passive host
 * receives button semantics; a disabled delegated anchor loses its destination to prevent
 * navigation.
 */

export const IconButton = IconButtonImpl as unknown as IconButtonComponent;
