import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { Slider } from '@/components/inputs/Slider';
import { Box, Stack } from '@/components/layout';
import { Text } from '@/components/typography';
import { useState } from 'react';


const meta: Meta<typeof Slider> = {
  title: 'Inputs/Slider',
  component: Slider,
  tags: ['autodocs'],
  argTypes: {
    intent: {
      control: 'select',
      options: ['primary', 'secondary', 'info', 'success', 'warning', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  args: {
    'aria-label': 'Example slider',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default slider with an accessible name. Tab to focus, Arrow keys to adjust value. Verify focus ring and track fill use brand tokens.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const slider = canvas.getByRole('slider');
    await expect(slider).toBeInTheDocument();
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const WithLabel: Story = {
  args: {
    children: 'Volume',
    defaultValue: 50,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Slider with `children` rendered as a visible `<span>` label. Verify the label is adjacent to the track and uses the `label` slot class.',
      },
    },
  },
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully controlled slider. `value` is driven externally via `useState`. The displayed value label updates on every change event.',
      },
    },
  },
  render: function ControlledSliderStory() {
    const [val, setVal] = useState(30);
    return (
      <Stack gap="md">
        <Slider value={val} onChange={(e) => setVal(Number(e.target.value))} />
        <Text>Value: {val}</Text>
      </Stack>
    );
  },
};

export const ConstrainedLongLabelRtl: Story = {
  render: () => (
    <Box width="[140px]" maxWidth="100%" dir="rtl">
      <Slider defaultValue={40}>
        https://example.com/preferences/audio/output/very-long-device-name
      </Slider>
    </Box>
  ),
};
