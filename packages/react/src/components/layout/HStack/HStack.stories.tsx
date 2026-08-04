import type { Meta, StoryObj } from '@storybook/react';
import { HStack } from './HStack';
import { Box } from '../Box';


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
        <Box p="base" bg="blue.100">
          Item 1
        </Box>
        <Box p="base" bg="blue.200">
          Item 2
        </Box>
        <Box p="base" bg="blue.300">
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
