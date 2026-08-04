import type { Meta, StoryObj } from '@storybook/react';
import { Wrap } from './Wrap';
import { Box } from '../Box';


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
    w: '[300px]',
    children: Array.from({ length: 12 }).map((_, i) => (
      <Box key={i} p="sm" bg="teal.100" borderRadius="md">
        Tag {i + 1}
      </Box>
    )),
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};
