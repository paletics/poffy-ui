'use client';

import { cx } from '@/styled-system/css';
import { buttonGroup } from '@/styled-system/recipes';
import { forwardRef, useMemo } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { ButtonGroupProps } from './ButtonGroup.types';
import { ButtonGroupContext } from './ButtonGroupContext';
import { ActionMotion } from '@/components/animations';

/**
 * The internal root container for `ButtonGroup`. Manages layout context, spacing recipe,
 * and distributes orientation/connected state to child `Button` atoms via `ButtonGroupContext`.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS (`buttonGroup` recipe), Radix Slot, `ActionMotion`, `ButtonGroupContext`
 * - **Props**: `PrimitiveProps<'div'>`
 *
 * ### Design Tokens
 * - **spacing**: gap between buttons → `silver.{sm|md|lg|none}`
 * - **color**: no direct color tokens — inherits from child `Button` intents
 *
 * ### Variant Logic
 * - **orientation="horizontal"**: Default. Lays buttons in a row.
 * - **orientation="vertical"**: Stacks buttons in a column for sidebars or menus.
 * - **connected**: Collapses gaps and merges adjacent borders. Suppresses child `ActionMotion` to `subtle`.
 * - **fullWidth**: Stretches the group and all child buttons to fill the container.
 *
 * ### Accessibility
 * - **Role**: `group` (explicit via `role="group"`)
 * - **Pattern**: WAI-ARIA Toolbar (when used as toolbar)
 * - **Keyboard**: Tab / Arrow: navigate between buttons
 * - **Required**: Provide `aria-label` on the group to describe its purpose to screen readers
 *
 * ### AI Usage
 * - **DO**: Wrap 2+ related `Button` atoms that share a conceptual action group.
 * - **DON'T**: Nest `ButtonGroup` inside another `ButtonGroup`. Do not use for navigation — use `Tabs` instead.
 *
 * @example Standard grouping
 * ```tsx
 * <ButtonGroup connected>
 *   <Button>Left</Button>
 *   <Button>Center</Button>
 *   <Button>Right</Button>
 * </ButtonGroup>
 * ```
 *
 * @example Vertical toolbar
 * ```tsx
 * <ButtonGroup orientation="vertical" aria-label="Text alignment">
 *   <Button>Top</Button>
 *   <Button>Middle</Button>
 *   <Button>Bottom</Button>
 * </ButtonGroup>
 * ```
 */
export const ButtonGroupRoot = forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    {
      children,
      animationType = 'stagger',
      orientation = 'horizontal',
      spacing = 'md',
      connected = false,
      fullWidth = false,
      className,
      asChild,
      ...props
    },
    ref,
  ) => {
    const classes = buttonGroup({
      orientation,
      spacing: connected ? 'none' : spacing,
      connected,
      fullWidth,
    });
    const Component = asChild ? Slot : 'div';

    const contextValue = useMemo(
      () => ({ orientation, spacing, connected, fullWidth }),
      [orientation, spacing, connected, fullWidth],
    );

    return (
      <ButtonGroupContext.Provider value={contextValue}>
        <ActionMotion asChild animationType={animationType} customData={{ staggerChildren: 0.05 }}>
          <Component
            ref={ref}
            className={cx(classes.root, className)}
            role="group"
            data-orientation={orientation}
            {...props}
          >
            {children}
          </Component>
        </ActionMotion>
      </ButtonGroupContext.Provider>
    );
  },
);

ButtonGroupRoot.displayName = 'ButtonGroup.Root';
