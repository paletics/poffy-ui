import type { Meta, StoryObj } from '@storybook/react';
import { VStack } from './VStack';
import { Box } from '../Box';

/**
 * A vertical layout primitive and semantic shortcut for Stack with direction="column", stretching children to full width for top-to-bottom compositions.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (Recipe: stackStyle via Stack), Radix Slot (inherited)
 */
const meta: Meta<typeof VStack> = {
  title: 'Layout/VStack',
  component: VStack,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    gap: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
    align: {
      control: 'select',
      options: ['stretch', 'center', 'flex-start', 'flex-end'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof VStack>;

export const Default: Story = {
  args: {
    gap: 'md',
    children: (
      <>
        <Box p="4" bg="rose.100">
          Item 1
        </Box>
        <Box p="4" bg="rose.200">
          Item 2
        </Box>
        <Box p="4" bg="rose.300">
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
