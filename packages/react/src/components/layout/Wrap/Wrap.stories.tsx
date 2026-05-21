import type { Meta, StoryObj } from '@storybook/react';
import { Wrap } from './Wrap';
import { Box } from '../Box';

/**
 * A flex-wrap layout primitive that lays out children horizontally and wraps to new rows automatically, ideal for tag clouds and chip groups.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (Flex with wrap="wrap" hardcoded), Radix Slot (inherited via Flex)
 */
const meta: Meta<typeof Wrap> = {
  title: 'Layout/Wrap',
  component: Wrap,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    gap: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Wrap>;

export const Default: Story = {
  args: {
    gap: 'md',
    w: '300px',
    children: Array.from({ length: 12 }).map((_, i) => (
      <Box key={i} p="2" bg="teal.100" borderRadius="md">
        Tag {i + 1}
      </Box>
    )),
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};
