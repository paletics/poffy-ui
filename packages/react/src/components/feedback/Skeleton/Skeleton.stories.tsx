import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from '@/components/feedback/Skeleton';
import { Stack } from '@/components/layout/Stack';

/**
 * Loading placeholder that mimics content shape (text, circle, or rect) while data is being fetched.
 * Use to reduce perceived latency by rendering a structural stand-in before real content arrives.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (skeleton recipe), motion/react, Radix Slot
 */
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

export const Default: Story = {
  args: {
    shape: 'text',
    animation: 'pulse',
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

export const RectNoAnimation: Story = {
  args: {
    shape: 'rect',
    animation: 'none',
    width: '200px',
    height: '100px',
  },
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

export const LegacyVariants: Story = {
  render: () => (
    <Stack gap="xs">
      <Skeleton variant="primary" width="full" />
      <Skeleton variant="success" width="80%" />
      <Skeleton variant="danger" width="60%" />
    </Stack>
  ),
};
