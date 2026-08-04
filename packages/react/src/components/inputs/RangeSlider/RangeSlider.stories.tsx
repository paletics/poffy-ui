'use client';

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, within } from 'storybook/test';
import { Box, Stack } from '@/components/layout';
import { Text } from '@/components/typography';
import { RangeSlider } from './RangeSlider';
import type { RangeSliderValue } from './RangeSlider.types';

const meta: Meta<typeof RangeSlider> = {
  title: 'Inputs/RangeSlider',
  component: RangeSlider,
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
    readOnly: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof RangeSlider>;

export const Default: Story = {
  args: {
    defaultValue: [20, 80],
    children: 'Price range',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('slider')).toHaveLength(2);
  },
};

export const Controlled: Story = {
  render: function ControlledStory(args) {
    const [value, setValue] = useState<RangeSliderValue>([25, 75]);

    return (
      <Stack gap="md">
        <RangeSlider {...args} value={value} onValueChange={setValue}>
          Discount range
        </RangeSlider>
        <Text>
          {value[0]} - {value[1]}
        </Text>
      </Stack>
    );
  },
};

export const Sizes: Story = {
  render: (args) => (
    <Stack gap="lg">
      <RangeSlider {...args} size="sm" defaultValue={[10, 50]}>
        Small
      </RangeSlider>
      <RangeSlider {...args} size="md" defaultValue={[20, 70]}>
        Medium
      </RangeSlider>
      <RangeSlider {...args} size="lg" defaultValue={[30, 90]}>
        Large
      </RangeSlider>
    </Stack>
  ),
};

export const Intents: Story = {
  render: (args) => (
    <Stack gap="lg">
      <RangeSlider {...args} intent="primary" defaultValue={[10, 40]}>
        Primary
      </RangeSlider>
      <RangeSlider {...args} intent="success" defaultValue={[20, 70]}>
        Success
      </RangeSlider>
      <RangeSlider {...args} intent="danger" defaultValue={[45, 90]}>
        Danger
      </RangeSlider>
    </Stack>
  ),
};

export const States: Story = {
  render: (args) => (
    <Stack gap="lg">
      <RangeSlider {...args} defaultValue={[20, 80]}>
        Ready
      </RangeSlider>
      <RangeSlider {...args} defaultValue={[20, 80]} readOnly>
        Read only
      </RangeSlider>
      <RangeSlider {...args} defaultValue={[20, 80]} disabled>
        Disabled
      </RangeSlider>
      <RangeSlider {...args} defaultValue={[20, 80]} error>
        Error
      </RangeSlider>
    </Stack>
  ),
};

export const MinGap: Story = {
  args: {
    defaultValue: [40, 60],
    step: 5,
    minStepsBetweenThumbs: 2,
    children: 'Minimum gap',
  },
};

export const NarrowRtlEndpoints: Story = {
  render: () => (
    <Box width="[180px]" aria-label="Constrained range slider container">
      <RangeSlider dir="rtl" locale="ja-JP" defaultValue={[0, 100]} aria-label="価格範囲">
        非常に長い価格範囲ラベルでも狭いコンテナーからはみ出さない
      </RangeSlider>
    </Box>
  ),
};

export const EndpointContainment: Story = {
  render: () => (
    <Stack gap="md">
      {(['sm', 'md', 'lg'] as const).flatMap((size) =>
        (['ltr', 'rtl'] as const).map((dir) => (
          <Box
            key={`${size}-${dir}`}
            width="[180px]"
            overflow="hidden"
            aria-label={`${size}-${dir} range slider container`}
          >
            <RangeSlider
              aria-label={`${size} ${dir} endpoints`}
              defaultValue={[0, 100]}
              dir={dir}
              size={size}
            />
          </Box>
        )),
      )}
    </Stack>
  ),
};
