import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { Flex } from '@/components/layout/Flex';
import { Stack } from '@/components/layout/Stack';
import { Text } from '@/components/typography/Text';
import { Spinner } from '@/components/feedback/Spinner';

/**
 * Indeterminate circular loading indicator that signals an ongoing operation with no known completion time.
 * Use when content or data is loading and the duration cannot be expressed as a percentage.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (spinner recipe), Radix Slot, motion/react (lazy-loaded animations)
 */
const meta: Meta<typeof Spinner> = {
  title: 'Feedback/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    intent: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'success', 'warning', 'info', 'light', 'dark'],
    },
    animation: {
      control: 'select',
      options: [
        'spin',
        'dash',
        'breathe',
        'pop-spin',
        'refined-dash',
        'trail',
        'elastic',
        'orbit-glow',
        'silver',
        'none',
      ],
    },
    size: { control: 'number' },
    thickness: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

const renderSpinnerItem = (label: string, children: ReactNode, loose = false) => (
  <Stack align="center" gap={loose ? 'md' : 'xs'}>
    {children}
    <Text variant="caption" opacity={loose ? 0.6 : 0.55}>
      {label}
    </Text>
  </Stack>
);

export const Default: Story = {};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Sizes: Story = {
  render: () => (
    <Flex gap="lg" align="center">
      <Spinner size={24} />
      <Spinner size={40} />
      <Spinner size={64} />
    </Flex>
  ),
};

export const Intents: Story = {
  render: () => (
    <Flex gap="lg" align="center" wrap="wrap">
      {renderSpinnerItem('primary', <Spinner intent="primary" />)}
      {renderSpinnerItem('secondary', <Spinner intent="secondary" />)}
      {renderSpinnerItem('success', <Spinner intent="success" />)}
      {renderSpinnerItem('warning', <Spinner intent="warning" />)}
      {renderSpinnerItem('danger', <Spinner intent="danger" />)}
      {renderSpinnerItem('info', <Spinner intent="info" />)}
      {renderSpinnerItem('light', <Spinner intent="light" />)}
      {renderSpinnerItem('dark', <Spinner intent="dark" />)}
    </Flex>
  ),
};

export const CSSAnimations: Story = {
  render: () => (
    <Flex gap="2xl" align="center" wrap="wrap">
      {renderSpinnerItem('spin', <Spinner animation="spin" size={56} />)}
      {renderSpinnerItem('dash', <Spinner animation="dash" size={56} />)}
      {renderSpinnerItem('breathe', <Spinner animation="breathe" size={56} />)}
      {renderSpinnerItem('pop-spin', <Spinner animation="pop-spin" size={56} />)}
      {renderSpinnerItem('refined-dash', <Spinner animation="refined-dash" size={56} />)}
    </Flex>
  ),
};

export const MotionAnimations: Story = {
  render: () => (
    <Flex gap="2xl" align="center" wrap="wrap" p="lg">
      {renderSpinnerItem('trail', <Spinner animation="trail" size={72} intent="primary" />, true)}
      {renderSpinnerItem(
        'elastic',
        <Spinner animation="elastic" size={72} intent="primary" />,
        true,
      )}
      {renderSpinnerItem(
        'orbit-glow',
        <Spinner animation="orbit-glow" size={72} intent="primary" />,
        true,
      )}
      {renderSpinnerItem('silver', <Spinner animation="silver" size={72} intent="primary" />, true)}
    </Flex>
  ),
};

export const SilverRatio: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Silver animation tuned around the 1:sqrt(2) ratio.',
      },
    },
  },
  render: () => (
    <Flex gap="xl" align="center" justify="center" wrap="wrap" p="xl">
      {renderSpinnerItem('primary', <Spinner animation="silver" size={72} intent="primary" />)}
      {renderSpinnerItem('secondary', <Spinner animation="silver" size={72} intent="secondary" />)}
      {renderSpinnerItem('success', <Spinner animation="silver" size={72} intent="success" />)}
      {renderSpinnerItem('warning', <Spinner animation="silver" size={72} intent="warning" />)}
      {renderSpinnerItem('danger', <Spinner animation="silver" size={72} intent="danger" />)}
      {renderSpinnerItem('info', <Spinner animation="silver" size={72} intent="info" />)}
      {renderSpinnerItem('light', <Spinner animation="silver" size={72} intent="light" />)}
      {renderSpinnerItem('dark', <Spinner animation="silver" size={72} intent="dark" />)}
    </Flex>
  ),
};
