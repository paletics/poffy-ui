import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from '@/components/layout/Stack';
import { Text } from '@/components/typography/Text';
import { Kbd } from './Kbd';
import { Box } from '@/components/layout/Box';

const meta = {
  title: 'Display/Kbd',
  component: Kbd,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    overflow: {
      control: 'select',
      options: ['truncate', 'wrap'],
    },
  },
  args: {
    children: 'Cmd+K',
  },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <Stack direction="row" gap="sm" align="center">
      <Kbd size="sm">Esc</Kbd>
      <Kbd>Enter</Kbd>
      <Kbd size="lg">Shift</Kbd>
    </Stack>
  ),
};

export const Shortcut: Story = {
  render: () => (
    <Text>
      Press <Kbd>Cmd</Kbd> + <Kbd>K</Kbd> to open command search.
    </Text>
  ),
};

export const ConstrainedLongContent: Story = {
  render: () => (
    <Stack gap="sm" aria-label="Constrained keyboard inputs">
      <Box width="[120px]">
        <Kbd overflow="truncate">CommandOrControl+Shift+P</Kbd>
      </Box>
      <Box width="[120px]">
        <Kbd overflow="wrap">CommandOrControl+Shift+P</Kbd>
      </Box>
    </Stack>
  ),
};
