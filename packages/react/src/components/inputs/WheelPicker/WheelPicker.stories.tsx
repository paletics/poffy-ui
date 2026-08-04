import type { Meta, StoryObj } from '@storybook/react';
import { WheelPicker } from '@/components/inputs/WheelPicker';
import type { WheelPickerValue } from '@/components/inputs/WheelPicker/WheelPicker.types';
import { Box, Stack } from '@/components/layout';
import { Text } from '@/components/typography';
import { useState } from 'react';

const hourOptions = Array.from({ length: 24 }, (_, hour) => ({
  value: String(hour),
  label: String(hour).padStart(2, '0'),
}));

const minuteOptions = Array.from({ length: 12 }, (_, index) => {
  const value = String(index * 5);
  return { value, label: value.padStart(2, '0') };
});

const meta = {
  title: 'Inputs/WheelPicker',
  component: WheelPicker,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    loop: { control: 'boolean' },
  },
  args: {
    columns: [
      { id: 'hour', label: 'Hour', options: hourOptions },
      { id: 'minute', label: 'Minute', options: minuteOptions },
    ],
    defaultValue: { hour: '9', minute: '30' },
  },
} satisfies Meta<typeof WheelPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Controlled: Story = {
  render: function ControlledWheelPickerStory() {
    const [value, setValue] = useState<WheelPickerValue>({ hour: '14', minute: '45' });

    return (
      <Stack gap="md">
        <WheelPicker
          columns={[
            { id: 'hour', label: 'Hour', options: hourOptions },
            { id: 'minute', label: 'Minute', options: minuteOptions },
          ]}
          value={value}
          onChange={setValue}
        />
        <Text color="text.secondary" fontSize="sm">
          Selected:{' '}
          <strong>
            {value.hour.padStart(2, '0')}:{value.minute.padStart(2, '0')}
          </strong>
        </Text>
      </Stack>
    );
  },
};

export const RuntimeSizeChange: Story = {
  render: function RuntimeSizeChangeStory() {
    const [size, setSize] = useState<'sm' | 'md' | 'lg'>('sm');
    const [value, setValue] = useState<WheelPickerValue>({ minute: '45' });

    return (
      <Stack gap="md">
        <button
          type="button"
          onClick={() => setSize((current) => (current === 'lg' ? 'sm' : 'lg'))}
        >
          Toggle size
        </button>
        <WheelPicker
          aria-label="Runtime size picker"
          columns={[{ id: 'minute', label: 'Minute', options: minuteOptions }]}
          onChange={setValue}
          size={size}
          value={value}
        />
        <Text aria-label="Runtime selected value">{value.minute}</Text>
      </Stack>
    );
  },
};

export const Sizes: Story = {
  render: () => (
    <Stack gap="lg">
      <WheelPicker
        size="sm"
        columns={[{ id: 'minute', label: 'Minute', options: minuteOptions }]}
        defaultValue={{ minute: '15' }}
      />
      <WheelPicker
        size="md"
        columns={[{ id: 'minute', label: 'Minute', options: minuteOptions }]}
        defaultValue={{ minute: '30' }}
      />
      <WheelPicker
        size="lg"
        columns={[{ id: 'minute', label: 'Minute', options: minuteOptions }]}
        defaultValue={{ minute: '45' }}
      />
    </Stack>
  ),
};

export const NarrowContainer: Story = {
  render: () => (
    <Box width="[220px]" aria-label="Constrained wheel picker container">
      <WheelPicker
        aria-label="Constrained duration"
        size="lg"
        columns={[
          { id: 'hour', label: 'Hour', options: hourOptions },
          { id: 'minute', label: 'Minute', options: minuteOptions },
          { id: 'second', label: 'Second', options: minuteOptions },
        ]}
        defaultValue={{ hour: '9', minute: '30', second: '0' }}
      />
    </Box>
  ),
};
