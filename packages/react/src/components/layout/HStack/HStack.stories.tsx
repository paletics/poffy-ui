import type { Meta, StoryObj } from '@storybook/react';
import { HStack } from './HStack';
import { Box } from '../Box';

/**
 * A horizontal layout primitive and semantic shortcut for Stack with direction="row", auto-centering children on the cross-axis for inline compositions.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (Recipe: stackStyle via Stack), Radix Slot (inherited)
 */
const meta: Meta<typeof HStack> = {
  title: 'Layout/HStack',
  component: HStack,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    gap: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof HStack>;

export const Default: Story = {
  args: {
    gap: 'md',
    children: (
      <>
        <Box p="4" bg="blue.100">
          Item 1
        </Box>
        <Box p="4" bg="blue.200">
          Item 2
        </Box>
        <Box p="4" bg="blue.300">
          Item 3
        </Box>
      </>
    ),
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};
