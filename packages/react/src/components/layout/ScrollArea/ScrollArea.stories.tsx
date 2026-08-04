import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '@/components/layout/Box';
import { Center } from '@/components/layout/Center';
import { Flex } from '@/components/layout/Flex';
import { Button } from '@/components/inputs/Button';
import { ScrollArea } from '@/components/layout/ScrollArea';
import { Text } from '@/components/typography/Text';
import { css } from '@/styled-system/css';


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
const narrowVerticalAreaClass = css({ height: '[120px]', width: '[40px]' });
const narrowHorizontalAreaClass = css({ height: '[40px]', width: '[120px]' });

export const Default: Story = {
  args: {
    'aria-label': 'Scrollable items',
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

export const NoOverflowInteraction: Story = {
  render: () => (
    <ScrollArea
      aria-label="Non-overflowing actions"
      className={horizontalAreaClass}
      orientation="vertical"
    >
      <Box p="md">
        <Button isGrow>Right edge action</Button>
      </Box>
    </ScrollArea>
  ),
};

export const EdgeAligned: Story = {
  render: () => (
    <Flex gap="lg" wrap="wrap">
      <ScrollArea
        data-testid="edge-scroll-ltr"
        aria-label="Narrow LTR scroll area"
        className={narrowVerticalAreaClass}
      >
        <Box height="[400px]" width="100%" bg="layout.background" />
      </ScrollArea>
      <ScrollArea
        data-testid="edge-scroll-rtl"
        aria-label="Narrow RTL scroll area"
        className={narrowVerticalAreaClass}
        dir="rtl"
      >
        <Box height="[400px]" width="100%" bg="layout.background" />
      </ScrollArea>
      <ScrollArea
        data-testid="edge-scroll-horizontal"
        aria-label="Narrow horizontal scroll area"
        className={narrowHorizontalAreaClass}
        orientation="horizontal"
      >
        <Box height="100%" width="[400px]" bg="layout.background" />
      </ScrollArea>
      <ScrollArea
        data-testid="edge-scroll-horizontal-rtl"
        aria-label="Narrow horizontal RTL scroll area"
        className={narrowHorizontalAreaClass}
        orientation="horizontal"
        dir="rtl"
      >
        <Box height="100%" width="[400px]" bg="layout.background" />
      </ScrollArea>
    </Flex>
  ),
};
