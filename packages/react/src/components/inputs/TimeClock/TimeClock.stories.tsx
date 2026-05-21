import type { Meta, StoryObj } from '@storybook/react';
import { TimeClock } from '@/components/inputs/TimeClock';
import { Stack } from '@/components/layout';
import { Text } from '@/components/typography';
import { useState } from 'react';

/**
 * Clock-face time input for selecting hours, minutes, and optional seconds.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS slot recipe, `@poffy-ui/behavior/time`
 */
const meta = {
  title: 'Inputs/TimeClock',
  component: TimeClock,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A reusable clock-face input for time selection. TimePicker uses it for clock input mode.',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    format: { control: 'select', options: ['24h', '12h'] },
    withSeconds: { control: 'boolean' },
    hourStep: { control: 'number' },
    minuteStep: { control: 'number' },
    secondStep: { control: 'number' },
  },
} satisfies Meta<typeof TimeClock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: '09:30',
  },
};

export const Playground: Story = {
  args: Default.args,
};

export const Controlled: Story = {
  render: function ControlledTimeClockStory() {
    const [value, setValue] = useState<string | null>('14:45');

    return (
      <Stack gap="md">
        <TimeClock value={value} onChange={setValue} />
        <Text color="text.secondary" fontSize="sm">
          Selected: <strong>{value ?? 'None'}</strong>
        </Text>
      </Stack>
    );
  },
};

export const Sizes: Story = {
  render: () => (
    <Stack gap="lg">
      <TimeClock size="sm" defaultValue="08:15" />
      <TimeClock size="md" defaultValue="12:30" />
      <TimeClock size="lg" defaultValue="18:45" />
    </Stack>
  ),
};

export const TwelveHour: Story = {
  args: {
    defaultValue: '14:30',
    format: '12h',
  },
};

export const SteppedMinutes: Story = {
  args: {
    defaultValue: '10:00',
    minuteStep: 15,
  },
  parameters: {
    docs: {
      description: {
        story: 'Constrains minute options to quarter-hour increments.',
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
