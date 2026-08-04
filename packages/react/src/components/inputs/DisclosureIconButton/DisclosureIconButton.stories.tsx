import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from '@/components/layout/Stack';
import { css } from '@/styled-system/css';
import { DisclosureIconButton } from './DisclosureIconButton';

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

const meta: Meta<typeof DisclosureIconButton> = {
  title: 'Inputs/DisclosureIconButton',
  component: DisclosureIconButton,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DisclosureIconButton>;

export const Default: Story = {
  args: {
    'aria-label': 'Toggle details',
    open: false,
  },
};

export const States: Story = {
  render: () => (
    <Stack direction="row" gap="sm" align="center">
      <DisclosureIconButton aria-label="Closed details" open={false} />
      <DisclosureIconButton aria-label="Open details" open />
      <DisclosureIconButton aria-label="Disabled details" open={false} disabled />
      <DisclosureIconButton aria-label="Loading details" open={false} loading />
    </Stack>
  ),
};

export const AsChild: Story = {
  render: () => (
    <DisclosureIconButton asChild aria-label="Open linked details" open>
      <a href="#disclosure-icon-button">
        <span className={visuallyHiddenClass}>Open linked details</span>
      </a>
    </DisclosureIconButton>
  ),
};
