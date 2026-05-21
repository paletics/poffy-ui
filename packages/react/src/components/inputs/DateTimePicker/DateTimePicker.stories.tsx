import type { Meta, StoryObj } from '@storybook/react';
import { DateTimePicker } from '@/components/inputs/DateTimePicker';
import { Stack } from '@/components/layout';
import { Text } from '@/components/typography';
import { useState } from 'react';

/**
 * Storybook documentation and visual review surface for DateTimePicker.
 * Covers representative usage, controls, and fixed review examples.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS recipe, Radix Slot
 */
const meta = {
  title: 'Inputs/DateTimePicker',
  component: DateTimePicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Combines DatePicker and TimePicker into a single scheduling control. The public value is a Date object while the time segment stays editable with steppers.',
      },
    },
  },
  argTypes: {
    appearance: { control: 'select', options: ['outline', 'soft'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    timeFormat: { control: 'select', options: ['24h', '12h'] },
    timeInputMode: { control: 'select', options: ['segments', 'clock'] },
    withSeconds: { control: 'boolean' },
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

export const TwelveHourWithSeconds: Story = {
  args: {
    defaultValue: new Date(2026, 3, 14, 21, 5, 30),
    timeFormat: '12h',
    withSeconds: true,
  },
};

export const ClockTimeInput: Story = {
  args: {
    defaultValue: new Date(2026, 3, 14, 9, 30),
    timeInputMode: 'clock',
  },
};
