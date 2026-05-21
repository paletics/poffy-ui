import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '@/components/layout/Box';
import { Center } from '@/components/layout/Center';
import { Flex } from '@/components/layout/Flex';
import { ScrollArea } from '@/components/layout/ScrollArea';
import { Text } from '@/components/typography/Text';
import { css } from '@/styled-system/css';

/**
 * A cross-platform scrollable container that replaces native OS scrollbars with consistently styled custom scrollbars, supporting vertical, horizontal, or both-axis scrolling.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS (Recipe: scrollArea - SVA), custom useScrollArea hook
 */
const meta: Meta<typeof ScrollArea> = {
  title: 'Layout/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal', 'both'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ScrollArea>;

const longText = Array.from(
  { length: 20 },
  (_, i) => `Item ${i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
);

const verticalAreaClass = css({ height: '[200px]', width: '[300px]' });
const horizontalAreaClass = css({ height: '[100px]', width: '[300px]' });

export const Default: Story = {
  args: {
    className: verticalAreaClass,
  },
  render: (args) => (
    <ScrollArea {...args}>
      <Box p="md">
        {longText.map((text, i) => (
          <Text key={i} mb="xs" whiteSpace="nowrap">
            {text}
          </Text>
        ))}
      </Box>
    </ScrollArea>
  ),
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
    className: horizontalAreaClass,
  },
  render: (args) => (
    <ScrollArea {...args}>
      <Flex gap="md" p="md" width="[max-content]">
        <Center
          width="[80px]"
          height="[60px]"
          bg="layout.background"
          borderRadius="md"
          flexShrink={0}
        >
          1
        </Center>
        <Center
          width="[80px]"
          height="[60px]"
          bg="layout.background"
          borderRadius="md"
          flexShrink={0}
        >
          2
        </Center>
        <Center
          width="[80px]"
          height="[60px]"
          bg="layout.background"
          borderRadius="md"
          flexShrink={0}
        >
          3
        </Center>
        <Center
          width="[80px]"
          height="[60px]"
          bg="layout.background"
          borderRadius="md"
          flexShrink={0}
        >
          4
        </Center>
        <Center
          width="[80px]"
          height="[60px]"
          bg="layout.background"
          borderRadius="md"
          flexShrink={0}
        >
          5
        </Center>
      </Flex>
    </ScrollArea>
  ),
};

export const Both: Story = {
  args: {
    orientation: 'both',
    className: verticalAreaClass,
  },
  render: (args) => (
    <ScrollArea {...args}>
      <Box p="md" width="[600px]">
        {longText.map((text, i) => (
          <Text key={i} mb="xs" whiteSpace="nowrap">
            {text}
          </Text>
        ))}
      </Box>
    </ScrollArea>
  ),
};

export const SmallScrollbar: Story = {
  args: {
    size: 'sm',
    className: verticalAreaClass,
  },
  render: (args) => (
    <ScrollArea {...args}>
      <Box p="md">
        {longText.map((text, i) => (
          <Text key={i} mb="xs">
            {text}
          </Text>
        ))}
      </Box>
    </ScrollArea>
  ),
};

export const LargeScrollbar: Story = {
  ...SmallScrollbar,
  args: {
    size: 'lg',
    className: verticalAreaClass,
  },
};
