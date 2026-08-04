'use client';

import {
  getFallbackChildrenForNativeContainer,
  isNonVoidAsChildHost,
  isPotentiallyInteractiveAsChildHost,
} from '@/components/shared/asChild';
import { cx } from '@/styled-system/css';
import { directionalButton } from '@/styled-system/recipes';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cloneElement, forwardRef, Fragment } from 'react';
import type { ElementType, ReactElement, ReactNode } from 'react';
import { DirectionalButton } from './DirectionalButton';
import type {
  DirectionalButtonGroupComponent,
  DirectionalButtonGroupProps,
} from './DirectionalButton.types';
import { getSafeInteractiveContent } from '@/components/shared/getSafeInteractiveContent';

const directionalButtonGroupAsChildHosts = new Set(['article', 'div', 'section']);
const isDirectionalButtonGroupAsChildHost = (children: ReactNode): children is ReactElement => {
  if (!isNonVoidAsChildHost(children)) return false;
  return (
    typeof children.type === 'string' &&
    directionalButtonGroupAsChildHosts.has(children.type) &&
    !isPotentiallyInteractiveAsChildHost(children)
  );
};

const DirectionalButtonGroupImpl = forwardRef<HTMLElement, DirectionalButtonGroupProps>(
  (
    {
      orientation = 'horizontal',
      size = 'md',
      appearance = 'soft',
      intent = 'primary',
      shape = 'rounded',
      connected = true,
      startButton,
      endButton,
      className,
      buttonClassName,
      asChild,
      children,
      ...props
    },
    ref,
  ) => {
    const classes = directionalButton({ size, appearance, intent, shape, orientation, connected });
    const asChildElement =
      asChild && isDirectionalButtonGroupAsChildHost(children) ? children : null;
    const canUseAsChild = asChildElement !== null;
    const Component = (canUseAsChild ? Slot : 'div') as ElementType;
    const slottableChildren =
      canUseAsChild && asChildElement
        ? cloneElement(
            asChildElement as ReactElement<Record<string, unknown>>,
            { role: 'group' },
            <Fragment>{asChildElement.props.children}</Fragment>,
          )
        : children;
    const fallbackChildren =
      asChild && isNonVoidAsChildHost(children) && !canUseAsChild
        ? isPotentiallyInteractiveAsChildHost(children)
          ? getSafeInteractiveContent(children, { disallowActivationHandlers: true })
          : getFallbackChildrenForNativeContainer(children)
        : children;

    return (
      <Component
        ref={ref}
        className={cx(classes.group, className)}
        data-orientation={orientation}
        data-connected={connected ? '' : undefined}
        {...props}
        role="group"
      >
        {canUseAsChild ? (
          <Slottable>{slottableChildren}</Slottable>
        ) : asChild ? (
          fallbackChildren
        ) : null}
        <DirectionalButton
          size={size}
          appearance={appearance}
          intent={intent}
          shape={shape}
          {...startButton}
          className={cx(buttonClassName, startButton.className)}
        />
        <DirectionalButton
          size={size}
          appearance={appearance}
          intent={intent}
          shape={shape}
          {...endButton}
          className={cx(buttonClassName, endButton.className)}
        />
      </Component>
    );
  },
);

DirectionalButtonGroupImpl.displayName = 'DirectionalButtonGroup';

/**
 * Renders a labelled `role="group"` containing a start and end directional action.
 *
 * Both child configurations inherit the group's size and visual options. Supply an accessible
 * group name when their relationship is not evident. `asChild` is limited to passive
 * `article`, `div`, and `section` hosts; an unsupported host falls back to the default container.
 */

export const DirectionalButtonGroup =
  DirectionalButtonGroupImpl as unknown as DirectionalButtonGroupComponent;
