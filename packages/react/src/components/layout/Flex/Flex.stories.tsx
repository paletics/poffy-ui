import type { Meta, StoryObj } from '@storybook/react';
import { Flex } from './Flex';
import { Box } from '../Box';

/**
 * A pre-configured flexbox container exposing direction, alignment, justification, wrap, and gap as typed props for fine-grained layout control.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (Recipe: flexStyle, splitCssProps), Radix Slot
 */
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
        <Box p="4" bg="blue.100">
          Box 1
        </Box>
        <Box p="4" bg="blue.200">
          Box 2
        </Box>
        <Box p="4" bg="blue.300">
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
        <Box p="4" bg="emerald.100">
          Box 1
        </Box>
        <Box p="4" bg="emerald.200">
          Box 2
        </Box>
        <Box p="4" bg="emerald.300">
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
    p: '4',
    bg: 'slate.100',
    children: (
      <>
        <Box p="2" bg="rose.100">
          Left
        </Box>
        <Box p="2" bg="rose.100">
          Right
        </Box>
      </>
    ),
  },
  render: (args) => (
    <Box w="600px">
      <Flex {...args} />
    </Box>
  ),
};

export const Wrap: Story = {
  args: {
    wrap: 'wrap',
    gap: '4',
    w: '300px',
    bg: 'slate.50',
    p: '4',
    children: (
      <>
        {Array.from({ length: 10 }).map((_, i) => (
          <Box key={i} p="4" bg="violet.100">
            Box {i + 1}
          </Box>
        ))}
      </>
    ),
  },
};
