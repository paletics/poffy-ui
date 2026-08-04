import type { Meta, StoryObj } from '@storybook/react';
import { DatePicker } from '@/components/inputs/DatePicker';
import { Stack } from '@/components/layout';
import { Text } from '@/components/typography';
import { useState } from 'react';

const meta: Meta<typeof DatePicker> = {
  title: 'Inputs/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Pairs an input-styled button with a Calendar popover. Click the button to open; selecting a date closes the popover and formats the visible text with `Intl.DateTimeFormat`.',
      },
    },
  },
  argTypes: {
    locale: { control: 'text' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    appearance: { control: 'select', options: ['outline', 'soft', 'flushed'] },
    native: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  args: {
    placeholder: 'Select a date',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Standard date picker with default settings. Click the button to open the calendar popover.',
      },
    },
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Japanese: Story = {
  args: {
    locale: 'ja-JP',
    placeholder: 'Select date',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Japanese locale (`ja-JP`). The selected date is formatted by `Intl.DateTimeFormat` with `dateStyle: medium`.',
      },
    },
  },
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Controlled mode: `value` is managed by parent state. The display below the button reflects the selected date.',
      },
    },
  },
  render: function ControlledDatePickerStory() {
    const [date, setDate] = useState<Date | null>(new Date(2023, 9, 15));
    return (
      <Stack gap="base">
        <DatePicker
          aria-label="Controlled date picker"
          value={date}
          onChange={setDate}
          placeholder="Controlled Picker"
        />
        <Text>Selected: {date?.toLocaleDateString() ?? 'None'}</Text>
      </Stack>
    );
  },
};

export const ErrorState: Story = {
  args: {
    error: true,
    defaultValue: new Date(2026, 3, 14),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Error state. The `error` prop is applied to the underlying `Input` component, showing the error styling.',
      },
    },
  },
};

export const Constrained: Story = {
  args: {
    defaultValue: new Date(2026, 3, 14),
    minDate: new Date(2026, 3, 10),
    maxDate: new Date(2026, 3, 20),
    placeholder: 'Select a date',
  },
  parameters: {
    docs: {
      description: {
        story:
          '`minDate` and `maxDate` limit calendar selection by local calendar day. Native mode also maps them to date input `min` and `max` attributes.',
      },
    },
  },
};

export const Native: Story = {
  args: {
    native: true,
    defaultValue: new Date(2026, 3, 14),
    minDate: new Date(2026, 3, 10),
    maxDate: new Date(2026, 3, 20),
  },
};

export const StandardSizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'All three sizes: `sm`, `md`, `lg`. Sizes scale the `Input` trigger via Silver Ratio tokens.',
      },
    },
  },
  render: () => (
    <Stack gap="2xl">
      <DatePicker size="sm" placeholder="Small" />
      <DatePicker size="md" placeholder="Medium" />
      <DatePicker size="lg" placeholder="Large" />
    </Stack>
  ),
};

export const TabOrder: Story = {
  render: () => (
    <Stack gap="md">
      <button type="button">Before date picker</button>
      <DatePicker
        aria-label="Appointment date"
        defaultValue={new Date(2026, 3, 14)}
        locale="en-US"
      />
      <button type="button">After date picker</button>
    </Stack>
  ),
};
