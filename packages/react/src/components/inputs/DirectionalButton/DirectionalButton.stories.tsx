import type { Meta, StoryObj } from '@storybook/react';
import { Box, Stack } from '@/components/layout';
import { css } from '@/styled-system/css';
import { DirectionalButton } from './DirectionalButton';
import { DirectionalButtonGroup } from './DirectionalButtonGroup';

const visuallyHiddenClass = css({
  position: 'absolute',
  w: '[1px]',
  h: '[1px]',
  p: 'none',
  m: '[-1px]',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: 0,
});

const constrainedGroupFixturesClass = css({
  display: 'grid',
  gridTemplateColumns: 'auto 40px',
  alignItems: 'center',
  gap: 'sm',
  width: 'fit-content',
});

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

export const ConstrainedConnectedGroup: Story = {
  render: () => (
    <div className={constrainedGroupFixturesClass}>
      <span>LTR</span>
      <DirectionalButtonGroup
        aria-label="Constrained LTR directional controls"
        startButton={{ direction: 'left', 'aria-label': 'Previous LTR item' }}
        endButton={{ direction: 'right', 'aria-label': 'Next LTR item' }}
      />
      <span>RTL</span>
      <DirectionalButtonGroup
        aria-label="Constrained RTL directional controls"
        dir="rtl"
        startButton={{ direction: 'right', 'aria-label': 'Previous RTL item' }}
        endButton={{ direction: 'left', 'aria-label': 'Next RTL item' }}
      />
    </div>
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

export const ConstrainedVisibleLabels: Story = {
  render: () => (
    <Stack direction="row" gap="md" align="start">
      <Box width="[40px]" data-testid="directional-visible-40">
        <DirectionalButton direction="right" size="sm">
          LocalizedUnbrokenDirectionalAction
        </DirectionalButton>
      </Box>
      <Box width="[80px]" dir="rtl" data-testid="directional-visible-80">
        <DirectionalButton direction="left">
          <span>LocalizedUnbrokenElementAction</span>
        </DirectionalButton>
      </Box>
      <Box width="[120px]" data-testid="directional-visible-120">
        <DirectionalButton asChild direction="right">
          <a href="#directional-visible-label">LocalizedUnbrokenLinkAction</a>
        </DirectionalButton>
      </Box>
    </Stack>
  ),
};
