'use client';

import { cx } from '@/styled-system/css';
import { directionalButton } from '@/styled-system/recipes';
import {
  getFallbackChildrenForNativeButton,
  isButtonAsChildHost,
  isButtonCompatibleAsChildHost,
  isNonVoidAsChildHost,
  shouldEmulateButtonHost,
} from '@/components/shared/asChild';
import { omitNativeButtonOnlyProps } from '@/components/shared/buttonDelegation';
import {
  createDisabledActivationHandlers,
  guardDisabledActivationHandlers,
  useButtonKeyboardActivation,
} from '@poffy-ui/behavior/activation';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { Children, cloneElement, forwardRef, Fragment, isValidElement } from 'react';
import type { ElementType, MouseEvent, ReactNode } from 'react';
import { DirectionalIcon } from './DirectionalIcon';
import { getDirectionalButtonLabels } from './DirectionalButton.locales';
import type { DirectionalButtonComponent, DirectionalButtonProps } from './DirectionalButton.types';
import { useOptionalLocale } from '@/providers/LocaleProvider';
import { materializeReactNodeTree } from '@/components/shared/flattenFragmentChildren';

type DirectionalButtonChildProps = Record<string, unknown> & {
  children?: ReactNode;
  contentEditable?: unknown;
  hidden?: unknown;
  role?: unknown;
};

const hasAccessibleContent = (content: ReactNode): boolean =>
  Children.toArray(content).some((child) => {
    if (typeof child === 'string' || typeof child === 'number') {
      return String(child).trim().length > 0;
    }
    if (!isValidElement<DirectionalButtonChildProps>(child)) return false;
    if (child.type === Fragment) return hasAccessibleContent(child.props.children);
    // Custom component output and prop forwarding are opaque at this boundary.
    if (typeof child.type !== 'string') return false;
    if (
      child.props.hidden === true ||
      child.props['aria-hidden'] === true ||
      child.props['aria-hidden'] === 'true'
    ) {
      return false;
    }
    if (
      (typeof child.props['aria-label'] === 'string' &&
        child.props['aria-label'].trim().length > 0) ||
      (typeof child.props['aria-labelledby'] === 'string' &&
        child.props['aria-labelledby'].trim().length > 0)
    ) {
      return true;
    }
    return hasAccessibleContent(child.props.children);
  });

const DirectionalButtonImpl = forwardRef<HTMLElement, DirectionalButtonProps>((rawProps, ref) => {
  const {
    direction = 'right',
    icon,
    size = 'md',
    appearance = 'soft',
    intent = 'primary',
    shape = 'rounded',
    className,
    children,
    disabled = false,
    'aria-label': ariaLabel,
    'aria-disabled': _ariaDisabled,
    asChild,
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
  } = rawProps as DirectionalButtonProps & { type?: unknown };
  const locale = useOptionalLocale()?.locale;
  const classes = directionalButton({ size, appearance, intent, shape, direction });
  const materializedChildren = materializeReactNodeTree(children);
  const asChildElement =
    asChild && isButtonAsChildHost(materializedChildren) ? materializedChildren : null;
  const canUseAsChild = Boolean(asChild && asChildElement);
  const shouldForwardNativeButtonProps = isButtonCompatibleAsChildHost(asChildElement);
  const needsButtonSemantics = Boolean(canUseAsChild && shouldEmulateButtonHost(asChildElement));
  const Component = (canUseAsChild ? Slot : 'button') as ElementType;
  const shouldGuardAsChildActivation = Boolean(canUseAsChild && disabled);
  const fallbackChildren =
    asChild && isValidElement<{ children?: ReactNode }>(materializedChildren)
      ? materializedChildren.props.children
      : materializedChildren;
  const safeFallbackChildren =
    asChild && isNonVoidAsChildHost(materializedChildren) && !canUseAsChild
      ? getFallbackChildrenForNativeButton(materializedChildren)
      : fallbackChildren;
  const accessibleContent = canUseAsChild ? asChildElement?.props.children : safeFallbackChildren;
  const asChildProps = asChildElement?.props as DirectionalButtonChildProps | undefined;
  const hostAriaLabel =
    typeof asChildProps?.['aria-label'] === 'string' ? asChildProps['aria-label'].trim() : '';
  const hostAriaLabelledBy =
    typeof asChildProps?.['aria-labelledby'] === 'string'
      ? asChildProps['aria-labelledby'].trim()
      : '';
  const hostHasAccessibleName = Boolean(
    canUseAsChild && (hostAriaLabel.length > 0 ? true : hostAriaLabelledBy.length > 0),
  );
  const trimmedAriaLabel = ariaLabel?.trim();
  const explicitAriaLabel =
    trimmedAriaLabel && trimmedAriaLabel.length > 0 ? trimmedAriaLabel : undefined;
  const resolvedAriaLabel =
    explicitAriaLabel ??
    (hostHasAccessibleName || hasAccessibleContent(accessibleContent)
      ? undefined
      : getDirectionalButtonLabels(locale).move(direction));

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    onClick?.(event as MouseEvent<HTMLButtonElement>);
  };

  const keyboardActivation = useButtonKeyboardActivation<HTMLButtonElement>({
    enabled: needsButtonSemantics && !disabled,
    onBlur,
    onKeyDown,
    onKeyUp,
  });

  const guardedChildren = guardDisabledActivationHandlers(
    materializedChildren,
    shouldGuardAsChildActivation,
  );
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
  const guardedHostContent =
    isValidElement<DirectionalButtonChildProps>(guardedChildren) &&
    typeof guardedChildren.type === 'string' &&
    guardedChildren.props.children !== undefined
      ? cloneElement(guardedChildren, {
          children: (
            <span key="directional-button-label" data-directional-button-label="">
              {guardedChildren.props.children}
            </span>
          ),
        })
      : guardedChildren;
  const slottableChildren: ReactNode =
    canUseAsChild && isValidElement<Record<string, unknown>>(guardedHostContent)
      ? cloneElement(guardedHostContent, {
          ...(resolvedAriaLabel ? { 'aria-label': resolvedAriaLabel } : {}),
          'aria-disabled': disabled ? true : undefined,
          disabled: shouldForwardNativeButtonProps ? disabled : undefined,
          ...(shouldForwardNativeButtonProps ? { type: 'button' } : {}),
          ...(needsButtonSemantics ? { role: 'button', tabIndex: 0 } : {}),
        })
      : guardedChildren;
  const hostProps = asChild ? omitNativeButtonOnlyProps(props) : props;

  return (
    <Component
      ref={ref}
      data-directional-button=""
      className={cx(classes.button, className)}
      disabled={canUseAsChild ? undefined : disabled}
      {...hostProps}
      type={canUseAsChild ? undefined : 'button'}
      aria-disabled={disabled ? true : undefined}
      aria-label={resolvedAriaLabel}
      onBlur={keyboardActivation.onBlur}
      {...activationHandlers}
    >
      <DirectionalIcon key="directional-icon" className={classes.icon} icon={icon} />
      {canUseAsChild ? (
        <Slottable key="directional-button-content">{slottableChildren}</Slottable>
      ) : safeFallbackChildren !== undefined && safeFallbackChildren !== null ? (
        <span data-directional-button-label="">{safeFallbackChildren}</span>
      ) : null}
    </Component>
  );
});

DirectionalButtonImpl.displayName = 'DirectionalButton';

/**
 * Triggers navigation or movement in a specified direction.
 *
 * Visible child content or a delegated host name takes precedence for the accessible name;
 * otherwise the active locale supplies a direction-only fallback such as “Move right”. Override
 * `aria-label` with the concrete action (for example, “Next month”). Passive `asChild` hosts
 * receive button keyboard semantics, while delegated links retain their destination.
 */

export const DirectionalButton = DirectionalButtonImpl as DirectionalButtonComponent;
