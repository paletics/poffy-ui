import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from './Divider';
import { Flex } from '../Flex';
import { Box } from '../Box';

/**
 * A semantic layout primitive that renders a visual boundary between content groups, automatically applying the correct aria-orientation.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (Recipe: dividerStyle), Radix Slot
 */
const meta: Meta<typeof Divider> = {
  title: 'Layout/Divider',
  component: Divider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    variant: {
      control: 'select',
      options: ['solid', 'dashed', 'dotted'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Default: Story = {
  args: {
    orientation: 'horizontal',
  },
  render: (args) => (
    <Flex direction="column" gap="md" w="300px">
      <Box>Content Above</Box>
      <Divider {...args} />
      <Box>Content Below</Box>
    </Flex>
  ),
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  render: (args) => (
    <Flex h="100px" gap="md">
      <Box>Left</Box>
      <Divider {...args} />
      <Box>Right</Box>
    </Flex>
  ),
};

export const Variants: Story = {
  render: () => (
    <Flex direction="column" gap="md" w="300px">
      <Divider variant="solid" />
      <Divider variant="dashed" />
      <Divider variant="dotted" />
      <Divider variant="dashed" borderColor="rose.500" />
    </Flex>
  ),
};
