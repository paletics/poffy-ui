import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/inputs/Button';
import { Box, Flex } from '@/components/layout';
import { Badge } from './Badge';

/**
 * Overlays a small status indicator or notification count on an anchor element.
 * Use to draw attention to a count, status, or new activity on icons, avatars, or buttons.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (badge recipe), Radix Slot
 */
const meta: Meta<typeof Badge> = {
  title: 'Display/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    appearance: {
      control: 'select',
      options: ['solid', 'soft', 'outline'],
    },
    intent: {
      control: 'select',
      options: ['primary', 'secondary', 'info', 'success', 'warning', 'danger', 'light', 'dark'],
    },
    shape: {
      control: 'select',
      options: ['rounded', 'pill'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    placement: {
      control: 'select',
      options: ['top-right', 'top-left', 'bottom-right', 'bottom-left', 'center'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

const demoBoxProps = {
  width: '[40px]',
  height: '[40px]',
  bg: 'slate.200',
  borderRadius: 'md',
} as const;

export const Default: Story = {
  args: {
    content: '3',
    appearance: 'solid',
    intent: 'danger',
    shape: 'pill',
    children: <Box {...demoBoxProps} />,
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Sizes: Story = {
  render: () => (
    <Flex gap="lg">
      <Badge content="1" size="sm">
        <Box {...demoBoxProps} />
      </Badge>
      <Badge content="1" size="md">
        <Box {...demoBoxProps} />
      </Badge>
      <Badge content="1" size="lg">
        <Box {...demoBoxProps} />
      </Badge>
    </Flex>
  ),
};

export const Intents: Story = {
  render: () => (
    <Flex gap="lg">
      <Badge content="1" intent="primary">
        <Box {...demoBoxProps} />
      </Badge>
      <Badge content="1" intent="secondary">
        <Box {...demoBoxProps} />
      </Badge>
      <Badge content="1" intent="danger">
        <Box {...demoBoxProps} />
      </Badge>
      <Badge content="1" intent="success">
        <Box {...demoBoxProps} />
      </Badge>
      <Badge content="1" intent="warning">
        <Box {...demoBoxProps} />
      </Badge>
    </Flex>
  ),
};

export const Appearances: Story = {
  render: () => (
    <Flex gap="lg">
      <Badge content="1" appearance="solid" intent="primary">
        <Box {...demoBoxProps} />
      </Badge>
      <Badge content="1" appearance="soft" intent="success">
        <Box {...demoBoxProps} />
      </Badge>
      <Badge content="1" appearance="outline" intent="warning">
        <Box {...demoBoxProps} />
      </Badge>
    </Flex>
  ),
};

export const Placements: Story = {
  render: () => (
    <Flex gap="2xl">
      <Badge content="1" placement="top-right">
        <Box {...demoBoxProps} />
      </Badge>
      <Badge content="1" placement="top-left">
        <Box {...demoBoxProps} />
      </Badge>
      <Badge content="1" placement="bottom-right">
        <Box {...demoBoxProps} />
      </Badge>
      <Badge content="1" placement="bottom-left">
        <Box {...demoBoxProps} />
      </Badge>
      <Box position="relative">
        <Badge content="1" placement="center">
          <Box {...demoBoxProps} />
        </Badge>
      </Box>
    </Flex>
  ),
};

export const Standalone: Story = {
  args: {
    content: 'New',
    intent: 'primary',
  },
};

export const AsChild: Story = {
  render: () => (
    <Badge content="New" intent="success" asChild>
      <Button appearance="outline">Button</Button>
    </Badge>
  ),
};
