import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from '@/components/feedback/Skeleton';
import { Stack } from '@/components/layout/Stack';
import { AnimationProvider } from '@/providers/AnimationProvider';
import { css } from '@/styled-system/css';

const meta: Meta<typeof Skeleton> = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    shape: {
      control: 'select',
      options: ['text', 'circle', 'rect'],
    },
    animation: {
      control: 'radio',
      options: ['pulse', 'shimmer', 'none'],
    },
    width: { control: 'text' },
    height: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const constrainedCircleClass = css({ width: '[5rem]' });

export const Default: Story = {
  args: {
    shape: 'text',
    animation: 'pulse',
    'data-testid': 'default-skeleton',
    width: '20rem',
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Circle: Story = {
  args: {
    shape: 'circle',
    width: '50px',
    height: '50px',
  },
};

export const ConstrainedCircle: Story = {
  render: () => (
    <div className={constrainedCircleClass} data-testid="constrained-circle-parent">
      <Skeleton animation="none" data-testid="constrained-circle" shape="circle" width={200} />
    </div>
  ),
};

export const RectNoAnimation: Story = {
  args: {
    shape: 'rect',
    animation: 'none',
    width: '200px',
    height: '100px',
  },
};

export const Shimmer: Story = {
  args: {
    animation: 'shimmer',
    'data-testid': 'shimmer-skeleton',
    height: '1.2rem',
    shape: 'text',
    width: '20rem',
  },
};

export const DefaultDimensions: Story = {
  render: () => (
    <Stack gap="md">
      <Skeleton animation="none" shape="circle" />
      <Skeleton animation="none" shape="rect" />
    </Stack>
  ),
};

export const MotionDisabled: Story = {
  render: () => (
    <AnimationProvider global={false} defaultAnimationEnabled={false}>
      <Stack data-testid="motion-disabled-skeletons" gap="xs">
        <Skeleton animation="pulse" width="20rem" />
        <Skeleton animation="shimmer" width="16rem" />
      </Stack>
    </AnimationProvider>
  ),
};

export const ArticleLoading: Story = {
  render: () => (
    <Stack gap="xs">
      <Skeleton shape="circle" width="40px" height="40px" />
      <Skeleton shape="text" width="80%" />
      <Skeleton shape="text" width="60%" />
    </Stack>
  ),
};

export const Intents: Story = {
  render: () => (
    <Stack gap="xs">
      <Skeleton intent="primary" width="100%" />
      <Skeleton intent="success" width="80%" />
      <Skeleton intent="danger" width="60%" />
    </Stack>
  ),
};
