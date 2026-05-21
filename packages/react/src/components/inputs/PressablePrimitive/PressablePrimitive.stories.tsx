import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from '@/components/layout/Stack';
import { css } from '@/styled-system/css';
import { PressablePrimitive } from './PressablePrimitive';

const pressableClass = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minW: '10rem',
  h: '2.5rem',
  px: 'md',
  borderRadius: 'md',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'border.default',
  bg: 'bg.canvas',
  color: 'fg.default',
  fontWeight: 'semibold',
  cursor: 'pointer',
  _hover: { bg: 'bg.subtle' },
  _focusVisible: { outline: '2px solid token(colors.focus)', outlineOffset: '2px' },
  _disabled: { opacity: 0.45, cursor: 'not-allowed' },
  '&[aria-disabled="true"]': { opacity: 0.45, cursor: 'not-allowed' },
});

/**
 * Behavior-only pressable primitive for custom interactive controls.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: native button or Radix Slot via `asChild`
 */
const meta: Meta<typeof PressablePrimitive> = {
  title: 'Inputs/PressablePrimitive',
  component: PressablePrimitive,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PressablePrimitive>;

export const Default: Story = {
  args: {
    className: pressableClass,
    children: 'Pressable control',
  },
};

export const AsChild: Story = {
  render: () => (
    <PressablePrimitive asChild className={pressableClass}>
      <span role="button" tabIndex={0}>
        Non-native child
      </span>
    </PressablePrimitive>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Stack gap="sm" align="flex-start">
      <PressablePrimitive className={pressableClass} disabled>
        Disabled button
      </PressablePrimitive>
      <PressablePrimitive asChild className={pressableClass} disabled>
        <span role="button" tabIndex={0}>
          Disabled child
        </span>
      </PressablePrimitive>
    </Stack>
  ),
};
