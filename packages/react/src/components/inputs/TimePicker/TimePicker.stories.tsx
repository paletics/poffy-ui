import type { Meta, StoryObj } from '@storybook/react';
import { TimePicker } from '@/components/inputs/TimePicker';
import { Stack } from '@/components/layout';
import { Text } from '@/components/typography';
import { useState } from 'react';

/**
 * Storybook documentation and visual review surface for TimePicker.
 * Covers representative usage, controls, and fixed review examples.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS recipe, Radix Slot
 */
const meta = {
  title: 'Inputs/TimePicker',
  component: TimePicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A time-only picker composed from two NumberInput segments for hours and minutes. Uses shared directional controls for stepper interaction.',
      },
    },
  },
  argTypes: {
    appearance: { control: 'select', options: ['outline', 'soft'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    inputMode: { control: 'select', options: ['segments', 'clock', 'wheel'] },
    format: { control: 'select', options: ['24h', '12h'] },
    withSeconds: { control: 'boolean' },
    hourStep: { control: 'number' },
    minuteStep: { control: 'number' },
    secondStep: { control: 'number' },
  },
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: '09:30',
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Controlled: Story = {
  render: function ControlledTimePickerStory() {
    const [value, setValue] = useState<string | null>('14:45');

    return (
      <Stack gap="md">
        <TimePicker value={value} onChange={setValue} />
        <Text color="text.secondary" fontSize="sm">
          Selected: <strong>{value ?? 'None'}</strong>
        </Text>
      </Stack>
    );
  },
};

export const Sizes: Story = {
  render: () => (
    <Stack gap="md">
      <TimePicker size="sm" defaultValue="08:15" />
      <TimePicker size="md" defaultValue="12:30" />
      <TimePicker size="lg" defaultValue="18:45" />
    </Stack>
  ),
};

export const Appearances: Story = {
  render: () => (
    <Stack gap="md">
      <TimePicker appearance="outline" defaultValue="09:30" />
      <TimePicker appearance="soft" defaultValue="09:30" />
    </Stack>
  ),
};

export const SteppedMinutes: Story = {
  args: {
    defaultValue: '10:00',
    minuteStep: 15,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Minute increments can be constrained to larger steps such as 15-minute booking intervals.',
      },
    },
  },
};

export const ClockInput: Story = {
  args: {
    defaultValue: '09:30',
    inputMode: 'clock',
  },
  parameters: {
    docs: {
      description: {
        story: 'Uses the reusable TimeClock face while preserving TimePicker value semantics.',
      },
    },
  },
};

export const ClockInput24Hour: Story = {
  args: {
    defaultValue: '14:30',
    format: '24h',
    inputMode: 'clock',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the clock input in 24-hour value mode with a 12-hour clock face and AM/PM controls.',
      },
    },
  },
};

export const WheelInput: Story = {
  args: {
    defaultValue: '09:30',
    inputMode: 'wheel',
  },
  parameters: {
    docs: {
      description: {
        story: 'Uses the reusable WheelPicker for drumroll-style time selection.',
      },
    },
  },
};

export const WheelInput12Hour: Story = {
  args: {
    defaultValue: '14:30',
    format: '12h',
    inputMode: 'wheel',
  },
};

export const TwelveHour: Story = {
  args: {
    defaultValue: '14:30',
    format: '12h',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Displays the hour in 12-hour format while keeping emitted values normalized to 24-hour time strings.',
      },
    },
  },
};

export const WithSeconds: Story = {
  args: {
    defaultValue: '09:30:45',
    withSeconds: true,
  },
};

export const ErrorState: Story = {
  args: {
    error: true,
    defaultValue: '21:05',
  },
};
