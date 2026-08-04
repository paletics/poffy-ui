import type { Meta, StoryObj } from '@storybook/react';
import { VStack } from './VStack';
import { Box } from '../Box';


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
        <Box p="base" bg="rose.100">
          Item 1
        </Box>
        <Box p="base" bg="rose.200">
          Item 2
        </Box>
        <Box p="base" bg="rose.300">
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
