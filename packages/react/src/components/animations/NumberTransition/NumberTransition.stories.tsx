import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '@/components/layout/Box';
import { Flex } from '@/components/layout/Flex';
import { Stack } from '@/components/layout/Stack';
import { Text } from '@/components/typography/Text';
import { NumberTransition } from '@/components/animations/NumberTransition/NumberTransition';

/**
 * Smoothly interpolates a numeric value from a starting point to a target when the element enters the viewport. Used for statistics sections, dashboard widgets, and impact metrics.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: motion/react (useMotionValue, animate, useInView), Radix Slot
 */
const meta: Meta<typeof NumberTransition> = {
  title: 'Animations/NumberTransition',
  component: NumberTransition,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NumberTransition>;

export const Default: Story = {
  args: {
    from: 0,
    to: 100,
    decimals: 0,
  },
  render: (args) => (
    <Box fontSize="3xl" fontWeight="bold" color="blue.600">
      <NumberTransition {...args} />
    </Box>
  ),
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Currency: Story = {
  args: {
    from: 0,
    to: 1234.56,
    format: (val) =>
      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val),
  },
  render: (args) => (
    <Box fontSize="3xl" fontWeight="bold" color="emerald.600">
      <NumberTransition {...args} />
    </Box>
  ),
};

export const Staggered: Story = {
  render: () => (
    <Flex gap="[32px]" fontSize="3xl" fontWeight="bold">
      <Stack alignItems="center">
        <NumberTransition to={85.4} decimals={1} delay={0} />
        <Text fontSize="sm" color="slate.500">
          Performance
        </Text>
      </Stack>
      <Stack alignItems="center">
        <NumberTransition to={92} delay={0.2} />
        <Text fontSize="sm" color="slate.500">
          Reliability
        </Text>
      </Stack>
      <Stack alignItems="center">
        <NumberTransition to={78} delay={0.4} />
        <Text fontSize="sm" color="slate.500">
          Efficiency
        </Text>
      </Stack>
    </Flex>
  ),
};

export const LargeNumber: Story = {
  args: {
    from: 1000000,
    to: 10000000,
    duration: 3,
    format: (val) => val.toLocaleString(),
  },
  render: (args) => (
    <Box fontSize="3xl" fontWeight="bold" color="slate.800">
      <NumberTransition {...args} />
    </Box>
  ),
};
