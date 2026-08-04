import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { CircleProgress } from '@/components/feedback/CircleProgress';
import { Flex } from '@/components/layout/Flex';
import { Stack } from '@/components/layout/Stack';
import { Text } from '@/components/typography/Text';
import { css } from '@/styled-system/css';

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
    <Flex gap="lg" align="center" wrap="wrap" justify="center">
      <CircleProgress size={50} value={30} />
      <CircleProgress size={100} value={50} showValue />
      <CircleProgress size={150} value={70} showValue />
    </Flex>
  ),
};

export const Thickness: Story = {
  render: () => (
    <Flex gap="lg" align="center" wrap="wrap" justify="center">
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

export const LongCustomLabel: Story = {
  args: {
    value: 82,
    size: 80,
    children: 'Processing upload request',
  },
};

export const TinyLongCustomLabel: Story = {
  args: {
    value: 82,
    size: 4,
    children: 'Processing upload request',
  },
};

export const PracticalMinimum: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'An unlabelled indicator may shrink with its container. Use at least 48px for a numeric center value and 64px for a short custom center label; smaller labelled circles retain accessible progress semantics but do not guarantee visual label readability.',
      },
    },
  },
  render: () => (
    <Flex gap="lg" align="center" wrap="wrap">
      <CircleProgress value={35} size={32} aria-label="Compact unlabelled progress" />
      <CircleProgress value={58} size={48} showValue aria-label="Minimum numeric progress" />
      <CircleProgress value={82} size={64} aria-label="Minimum custom-label progress">
        Sync
      </CircleProgress>
    </Flex>
  ),
};

const preferredMaximumLayout = css({
  display: 'grid',
  gap: 'lg',
  justifyItems: 'start',
  width: '100%',
  maxWidth: '100%',
  minWidth: 0,
});

const narrowProgressContainer = css({
  inlineSize: '160px',
});

const wideProgressContainer = css({
  inlineSize: '[min(360px,100%)]',
  maxWidth: '100%',
});

export const PreferredMaximum: Story = {
  render: () => (
    <div className={preferredMaximumLayout}>
      <div className={narrowProgressContainer} data-testid="circle-progress-narrow-parent">
        <CircleProgress value={82} size={300} aria-label="Narrow upload progress">
          Processing upload request with a deliberately long status label
        </CircleProgress>
      </div>
      <div className={wideProgressContainer} data-testid="circle-progress-wide-parent">
        <CircleProgress value={82} size={300} aria-label="Wide upload progress" showValue />
      </div>
    </div>
  ),
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

export const Appearances: Story = {
  render: () => (
    <Flex gap="lg" align="center" wrap="wrap">
      <CircleProgress aria-label="Solid progress" appearance="solid" value={65} size={80} />
      <CircleProgress aria-label="Soft progress" appearance="soft" value={65} size={80} />
    </Flex>
  ),
};
