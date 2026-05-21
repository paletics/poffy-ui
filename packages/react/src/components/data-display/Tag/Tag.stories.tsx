import type { Meta, StoryObj } from '@storybook/react';
import { Tag, TagLabel, TagCloseButton } from '@/components/data-display/Tag';
import { Flex } from '@/components/layout/Flex';

/**
 * Compact label used to annotate, categorize, or filter content with optional dismissal.
 * Use for taxonomy chips, status indicators, or removable filter tokens.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (tag recipe), Radix Slot
 */
const meta = {
  title: 'Display/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    appearance: {
      control: 'select',
      options: ['soft', 'outline', 'ghost'],
    },
    intent: {
      control: 'select',
      options: ['primary', 'secondary', 'info', 'success', 'warning', 'danger'],
    },
    shape: {
      control: 'select',
      options: ['rounded', 'pill'],
    },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Tag {...args}>
      <TagLabel>Sample Tag</TagLabel>
    </Tag>
  ),
  args: {
    size: 'md',
    appearance: 'soft',
    intent: 'secondary',
    shape: 'rounded',
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const WithCloseButton: Story = {
  render: (args) => (
    <Tag {...args}>
      <TagLabel>Closable Tag</TagLabel>
      <TagCloseButton onClick={() => undefined} />
    </Tag>
  ),
  args: {
    size: 'md',
    intent: 'success',
  },
};

export const Sizes: Story = {
  render: () => (
    <Flex gap="xs" align="center">
      <Tag size="sm">
        <TagLabel>Small</TagLabel>
      </Tag>
      <Tag size="md">
        <TagLabel>Medium</TagLabel>
      </Tag>
      <Tag size="lg">
        <TagLabel>Large</TagLabel>
      </Tag>
    </Flex>
  ),
};

export const Appearances: Story = {
  render: () => (
    <Flex gap="xs" align="center">
      <Tag appearance="soft" intent="info">
        <TagLabel>Soft</TagLabel>
      </Tag>
      <Tag appearance="outline" intent="info">
        <TagLabel>Outline</TagLabel>
      </Tag>
      <Tag appearance="ghost" intent="info">
        <TagLabel>Ghost</TagLabel>
      </Tag>
    </Flex>
  ),
};
