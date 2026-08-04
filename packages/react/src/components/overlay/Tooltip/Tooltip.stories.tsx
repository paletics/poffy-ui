import { Button } from '@/components/inputs/Button';
import { Box, Flex } from '@/components/layout';
import { InfoIcon } from '@/components/media/Icon/icons';
import { Text } from '@/components/typography/Text';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { useState } from 'react';
import { Tooltip } from './index';


const meta: Meta<typeof Tooltip> = {
  title: 'Overlay/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

const LongContentShortViewportFixture = () => {
  const [open, setOpen] = useState(true);

  return (
    <Box p="sm">
      <Tooltip
        open={open}
        onOpenChange={setOpen}
        content={[
          'This tooltip intentionally contains enough supplemental guidance to exceed a short viewport.',
          'The surface must remain bounded by Floating UI’s available height.',
          'Pointer and touch users can scroll the tooltip without moving the page behind it.',
          'Assistive technology still receives the complete description through the tooltip relationship.',
          'For interactive or primary content, use Popover instead of Tooltip.',
        ].join(' ')}
      >
        <Button>Long tooltip target</Button>
      </Tooltip>
    </Box>
  );
};

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
    <Flex p="3xl" gap="lg" wrap="wrap">
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

export const LongContentShortViewport: Story = {
  render: () => <LongContentShortViewportFixture />,
  parameters: {
    layout: 'fullscreen',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const target = canvas.getByRole('button', { name: /long tooltip target/i });

    expect(await body.findByRole('tooltip')).toBeVisible();
    target.focus();
    await userEvent.keyboard('{Escape}');
    await expect(body.queryByRole('tooltip')).not.toBeInTheDocument();
  },
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
