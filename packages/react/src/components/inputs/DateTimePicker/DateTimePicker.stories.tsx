import type { Meta, StoryObj } from '@storybook/react';
import { DateTimePicker } from '@/components/inputs/DateTimePicker';
import { Box, Stack } from '@/components/layout';
import { Text } from '@/components/typography';
import { useState } from 'react';

const meta = {
  title: 'Inputs/DateTimePicker',
  component: DateTimePicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Combines DatePicker and TimePicker into a single scheduling control. The public value is a Date object while the time segment supports segment, clock, and wheel input modes.',
      },
    },
  },
  argTypes: {
    appearance: { control: 'select', options: ['outline', 'soft', 'flushed'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    timeFormat: { control: 'select', options: ['24h', '12h'] },
    timeInputMode: { control: 'select', options: ['segments', 'clock', 'wheel'] },
    withSeconds: { control: 'boolean' },
    requireDateBeforeTime: { control: 'boolean' },
  },
} satisfies Meta<typeof DateTimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: new Date(2026, 3, 14, 9, 30),
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Controlled: Story = {
  render: function ControlledDateTimePickerStory() {
    const [value, setValue] = useState<Date | null>(new Date(2026, 3, 14, 14, 45));

    return (
      <Stack gap="md">
        <DateTimePicker value={value} onChange={setValue} />
        <Text color="text.secondary" fontSize="sm">
          Selected: <strong>{value?.toLocaleString() ?? 'None'}</strong>
        </Text>
      </Stack>
    );
  },
};

export const DateFirst: Story = {
  args: {
    'aria-label': 'Appointment',
  },
};

export const TimeFirstOptOut: Story = {
  args: {
    'aria-label': 'Appointment',
    requireDateBeforeTime: false,
  },
};

export const TwelveHourWithSeconds: Story = {
  args: {
    defaultValue: new Date(2026, 3, 14, 21, 5, 30),
    timeFormat: '12h',
    withSeconds: true,
  },
  render: (args) => (
    <Box width="[min(420px, calc(100vw - 4rem))]">
      <DateTimePicker {...args} />
    </Box>
  ),
};

export const Constrained: Story = {
  args: {
    defaultValue: new Date(2026, 3, 14, 9, 30),
    minDate: new Date(2026, 3, 10),
    maxDate: new Date(2026, 3, 20),
  },
};

export const ClockTimeInput: Story = {
  args: {
    defaultValue: new Date(2026, 3, 14, 9, 30),
    timeInputMode: 'clock',
  },
};

export const WheelTimeInput: Story = {
  args: {
    defaultValue: new Date(2026, 3, 14, 9, 30),
    timeInputMode: 'wheel',
  },
};

export const NarrowContainer: Story = {
  render: () => (
    <Box width="[180px]" aria-label="Constrained date-time container">
      <DateTimePicker
        aria-label="Constrained appointment"
        defaultValue={new Date(2026, 3, 14, 9, 30)}
      />
    </Box>
  ),
};
