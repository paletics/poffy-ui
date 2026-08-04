import type { Meta, StoryObj } from '@storybook/react';
import { Spacer } from './Spacer';
import { Flex } from '../Flex';
import { Box } from '../Box';


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
    <Flex w="[min(500px,calc(100vw - 3rem))]" bg="slate.100" p="base" align="center">
      <Box p="base" bg="blue.700" color="white">
        Left
      </Box>
      <Spacer />
      <Box p="base" bg="blue.700" color="white">
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
    <Flex direction="column" h="[300px]" w="[100px]" bg="slate.100" p="base" align="center">
      <Box p="base" bg="rose.700" color="white">
        Top
      </Box>
      <Spacer />
      <Box p="base" bg="rose.700" color="white">
        Bottom
      </Box>
    </Flex>
  ),
};
