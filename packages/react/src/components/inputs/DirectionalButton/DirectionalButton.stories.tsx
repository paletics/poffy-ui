import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from '@/components/layout/Stack';
import { css } from '@/styled-system/css';
import { DirectionalButton } from './DirectionalButton';
import { DirectionalButtonGroup } from './DirectionalButtonGroup';

const visuallyHiddenClass = css({
  position: 'absolute',
  w: '1px',
  h: '1px',
  p: 0,
  m: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: 0,
});

/**
 * Icon-only directional control for next/previous and increment/decrement affordances.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms / Molecules
 * - **Stack**: Panda CSS slot recipe, Radix Slot
 */
const meta: Meta<typeof DirectionalButton> = {
  title: 'Inputs/DirectionalButton',
  component: DirectionalButton,
  tags: ['autodocs'],
  argTypes: {
    direction: { control: 'select', options: ['up', 'down', 'left', 'right'] },
    appearance: { control: 'select', options: ['solid', 'soft', 'outline', 'ghost', 'neo'] },
    intent: { control: 'select', options: ['primary', 'secondary', 'info', 'light', 'dark'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    shape: { control: 'select', options: ['rounded', 'pill', 'square'] },
  },
};

export default meta;
type Story = StoryObj<typeof DirectionalButton>;

export const Default: Story = {
  args: {
    'aria-label': 'Next item',
    direction: 'right',
  },
};

export const Directions: Story = {
  render: () => (
    <Stack direction="row" gap="sm" align="center">
      <DirectionalButton direction="left" aria-label="Previous item" />
      <DirectionalButton direction="right" aria-label="Next item" />
      <DirectionalButton direction="up" aria-label="Move up" />
      <DirectionalButton direction="down" aria-label="Move down" />
    </Stack>
  ),
};

export const Group: Story = {
  render: () => (
    <DirectionalButtonGroup
      startButton={{ direction: 'left', 'aria-label': 'Previous page' }}
      endButton={{ direction: 'right', 'aria-label': 'Next page' }}
    />
  ),
};

export const DisabledAsChild: Story = {
  render: () => (
    <DirectionalButton asChild disabled direction="right" aria-label="Disabled next item">
      <a href="#directional-button-disabled">
        <span className={visuallyHiddenClass}>Disabled next item</span>
      </a>
    </DirectionalButton>
  ),
};
