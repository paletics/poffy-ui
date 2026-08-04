import type { Meta, StoryObj } from '@storybook/react';
import { Flex } from './Flex';
import { Box } from '../Box';


const meta: Meta<typeof Flex> = {
  title: 'Layout/Flex',
  component: Flex,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['row', 'column', 'row-reverse', 'column-reverse'],
    },
    align: {
      control: 'select',
      options: ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'],
    },
    justify: {
      control: 'select',
      options: [
        'flex-start',
        'center',
        'flex-end',
        'space-between',
        'space-around',
        'space-evenly',
      ],
    },
    wrap: {
      control: 'select',
      options: ['nowrap', 'wrap', 'wrap-reverse'],
    },
    gap: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Flex>;

export const Default: Story = {
  args: {
    gap: 'md',
    children: (
      <>
        <Box p="base" bg="blue.100">
          Box 1
        </Box>
        <Box p="base" bg="blue.200">
          Box 2
        </Box>
        <Box p="base" bg="blue.300">
          Box 3
        </Box>
      </>
    ),
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Column: Story = {
  args: {
    direction: 'column',
    gap: 'md',
    children: (
      <>
        <Box p="base" bg="emerald.100">
          Box 1
        </Box>
        <Box p="base" bg="emerald.200">
          Box 2
        </Box>
        <Box p="base" bg="emerald.300">
          Box 3
        </Box>
      </>
    ),
  },
};

export const JustifySpaceBetween: Story = {
  args: {
    justify: 'space-between',
    w: 'full',
    p: 'base',
    bg: 'slate.100',
    children: (
      <>
        <Box p="sm" bg="rose.100">
          Left
        </Box>
        <Box p="sm" bg="rose.100">
          Right
        </Box>
      </>
    ),
  },
  render: (args) => (
    <Box w="[min(600px,calc(100vw - 3rem))]">
      <Flex {...args} />
    </Box>
  ),
};

export const Wrap: Story = {
  args: {
    wrap: 'wrap',
    gap: 'base',
    w: '[300px]',
    bg: 'slate.50',
    p: 'base',
    children: (
      <>
        {Array.from({ length: 10 }).map((_, i) => (
          <Box key={i} p="base" bg="violet.100">
            Box {i + 1}
          </Box>
        ))}
      </>
    ),
  },
};
