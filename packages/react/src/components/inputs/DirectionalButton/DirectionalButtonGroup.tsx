'use client';

import { cx } from '@/styled-system/css';
import { directionalButton } from '@/styled-system/recipes';
import { forwardRef } from 'react';
import { DirectionalButton } from './DirectionalButton';
import type { DirectionalButtonGroupProps } from './DirectionalButton.types';

/**
 * Pairs two directional buttons into a previous/next or increment/decrement control group.
 * Keeps both buttons aligned, size-matched, and optionally visually connected as one control.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS (`directionalButton` slot recipe), `DirectionalButton`
 * - **Props**: `PrimitiveProps<'div'>`
 *
 * ### Design Tokens
 * - **spacing**: size-driven internal padding on child buttons
 * - **color**: shared semantic action tokens and border treatment for connected groups
 *
 * ### Variant Logic
 * - **orientation="horizontal"**: Use for previous/next pagination and calendar navigation.
 * - **orientation="vertical"**: Use for numeric steppers and compact increment/decrement controls.
 * - **connected={true}**: Renders as a single segmented control with shared border.
 *
 * ### Accessibility
 * - **Role**: group container (`div`)
 * - **Pattern**: WAI-ARIA Button group
 * - **Keyboard**: Tab stops remain on each inner button unless callers override `tabIndex`
 *
 * ### AI Usage
 * - **DO**: Use when the two actions are inverse or sequential pairs.
 * - **DON'T**: Do not use for unrelated icon actions; prefer `IconButton` or `ButtonGroup`.
 *
 * @example Connected previous / next pair
 * ```tsx
 * <DirectionalButtonGroup
 *   startButton={{ direction: 'left', 'aria-label': 'Previous' }}
 *   endButton={{ direction: 'right', 'aria-label': 'Next' }}
 * />
 * ```
 */
export const DirectionalButtonGroup = forwardRef<HTMLDivElement, DirectionalButtonGroupProps>(
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
      ...props
    },
    ref,
  ) => {
    const classes = directionalButton({ size, appearance, intent, shape, orientation, connected });

    return (
      <div
        ref={ref}
        className={cx(classes.group, className)}
        data-orientation={orientation}
        data-connected={connected ? '' : undefined}
        {...props}
      >
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
      </div>
    );
  },
);

DirectionalButtonGroup.displayName = 'DirectionalButtonGroup';
