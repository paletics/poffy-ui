import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { CircleProgress } from '@/components/feedback/CircleProgress';
import { Flex } from '@/components/layout/Flex';
import { Stack } from '@/components/layout/Stack';
import { Text } from '@/components/typography/Text';

/**
 * Single circular SVG indicator that visualises determinate progress as a percentage arc.
 * Use to show task completion or upload/download progress in a compact circular form.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (circleProgress recipe), Radix Slot
 */
const meta: Meta<typeof CircleProgress> = {
  title: 'Feedback/CircleProgress',
  component: CircleProgress,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    appearance: {
      control: 'select',
      options: ['solid', 'soft'],
    },
    intent: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'success', 'warning', 'info'],
    },
    animation: {
      control: 'select',
      options: ['progress', 'none'],
    },
    size: { control: 'number' },
    thickness: { control: 'number' },
    value: { control: { type: 'range', min: 0, max: 100 } },
    showValue: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof CircleProgress>;

const renderProgressItem = (label: string, children: ReactNode) => (
  <Stack align="center" gap="xs">
    {children}
    <Text variant="caption" opacity={0.6}>
      {label}
    </Text>
  </Stack>
);

export const Default: Story = {
  args: {
    value: 40,
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Primary: Story = {
  args: {
    intent: 'primary',
    value: 60,
    showValue: true,
  },
};

export const Secondary: Story = {
  args: {
    intent: 'secondary',
    value: 75,
    showValue: true,
  },
};

export const Sizes: Story = {
  render: () => (
    <Flex gap="lg" align="center">
      <CircleProgress size={50} value={30} />
      <CircleProgress size={100} value={50} showValue />
      <CircleProgress size={150} value={70} showValue />
    </Flex>
  ),
};

export const Thickness: Story = {
  render: () => (
    <Flex gap="lg" align="center">
      <CircleProgress size={100} thickness={5} value={50} showValue />
      <CircleProgress size={100} thickness={15} value={50} showValue />
      <CircleProgress size={100} thickness={25} value={50} showValue />
    </Flex>
  ),
};

export const WithLabel: Story = {
  args: {
    value: 80,
    showValue: true,
    children: 'Done',
  },
};

export const Intents: Story = {
  render: () => (
    <Flex gap="lg" align="center" wrap="wrap">
      {renderProgressItem(
        'primary',
        <CircleProgress intent="primary" value={65} showValue size={80} />,
      )}
      {renderProgressItem(
        'secondary',
        <CircleProgress intent="secondary" value={65} showValue size={80} />,
      )}
      {renderProgressItem(
        'success',
        <CircleProgress intent="success" value={65} showValue size={80} />,
      )}
      {renderProgressItem(
        'warning',
        <CircleProgress intent="warning" value={65} showValue size={80} />,
      )}
      {renderProgressItem(
        'danger',
        <CircleProgress intent="danger" value={65} showValue size={80} />,
      )}
      {renderProgressItem('info', <CircleProgress intent="info" value={65} showValue size={80} />)}
    </Flex>
  ),
};
