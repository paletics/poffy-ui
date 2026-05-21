import type { Meta, StoryObj } from '@storybook/react';
import { Spacer } from './Spacer';
import { Flex } from '../Flex';
import { Box } from '../Box';

/**
 * A flex-grow utility that expands to fill available space within a flex container, pushing sibling elements to opposite ends.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (Box with flex="1"), no recipe
 */
const meta: Meta<typeof Spacer> = {
  title: 'Layout/Spacer',
  component: Spacer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Spacer>;

export const Default: Story = {
  render: () => (
    <Flex w="[500px]" bg="slate.100" p="4" align="center">
      <Box p="4" bg="blue.700" color="white">
        Left
      </Box>
      <Spacer />
      <Box p="4" bg="blue.700" color="white">
        Right
      </Box>
    </Flex>
  ),
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Vertical: Story = {
  render: () => (
    <Flex direction="column" h="300px" w="100px" bg="slate.100" p="4" align="center">
      <Box p="4" bg="rose.700" color="white">
        Top
      </Box>
      <Spacer />
      <Box p="4" bg="rose.700" color="white">
        Bottom
      </Box>
    </Flex>
  ),
};
