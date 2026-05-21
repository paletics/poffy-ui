import { Button } from '@/components/inputs/Button';
import { Box, Flex } from '@/components/layout';
import { InfoIcon } from '@/components/media/Icon/icons';
import { Text } from '@/components/typography/Text';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { Tooltip } from './index';

/**
 * Storybook documentation and visual review surface for Tooltip.
 * Covers representative usage, controls, and fixed review examples.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS recipe, overlay primitives
 */
const meta: Meta<typeof Tooltip> = {
  title: 'Overlay/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    content: 'This is a tooltip',
  },
  render: (args) => (
    <Flex p="3xl" gap="lg" wrap="wrap">
      <Tooltip {...args}>
        <Button>Hover me</Button>
      </Tooltip>

      <Tooltip content="Tooltip on top" placement="top">
        <Button>top</Button>
      </Tooltip>
      <Tooltip content="Tooltip on right" placement="right">
        <Button>right</Button>
      </Tooltip>
      <Tooltip content="Tooltip on bottom" placement="bottom">
        <Button>bottom</Button>
      </Tooltip>
      <Tooltip content="Tooltip on left" placement="left">
        <Button>left</Button>
      </Tooltip>
    </Flex>
  ),
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Interaction: Story = {
  args: {
    content: 'Interaction tooltip',
    delay: 0,
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button>Hover target</Button>
    </Tooltip>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.hover(canvas.getByRole('button', { name: /hover target/i }));
    await expect(await body.findByRole('tooltip')).toHaveTextContent('Interaction tooltip');
  },
};

export const Brands: Story = {
  render: () => (
    <Flex p="3xl" gap="lg">
      <Tooltip content="Pome brand tooltip" brand="pome">
        <Button>Pome (Dark)</Button>
      </Tooltip>
      <Tooltip content="Blue brand tooltip" brand="blue">
        <Button>Blue (Dark)</Button>
      </Tooltip>
      <Tooltip content="Pome light tooltip" brand="pome" theme="light">
        <Button>Pome (Light)</Button>
      </Tooltip>
    </Flex>
  ),
};

export const CustomContent: Story = {
  render: () => (
    <Box p="3xl">
      <Tooltip
        content={
          <Flex align="center" gap="xs">
            <InfoIcon />
            <Text asChild weight="semibold">
              <span>Advanced Tooltip</span>
            </Text>
          </Flex>
        }
      >
        <Button>Hover for Magic</Button>
      </Tooltip>
    </Box>
  ),
};

export const AsChild: Story = {
  render: () => (
    <Box p="3xl">
      <Tooltip content="Tooltip on a button">
        <Button appearance="ghost">Interactive Button</Button>
      </Tooltip>
    </Box>
  ),
};
