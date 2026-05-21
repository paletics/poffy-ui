import type { Meta, StoryObj } from '@storybook/react';
import { DatePicker } from '@/components/inputs/DatePicker';
import { Stack } from '@/components/layout';
import { Text } from '@/components/typography';
import { useState } from 'react';

/**
 * ### AI Context & Architecture
 * - **Tier**: Molecules, read-only `Input` + `Calendar` in a `Popover`
 * - **Stack**: Panda CSS (via `Input`, `Popover`, `Calendar`), `Intl.DateTimeFormat`
 * - **Modes**: Controlled (`value`) and uncontrolled (`defaultValue`)
 */
const meta: Meta<typeof DatePicker> = {
  title: 'Inputs/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Pairs a read-only text input with a Calendar popover. Click the input to open; selecting a date closes the popover and formats the value with `Intl.DateTimeFormat`.',
      },
    },
  },
  argTypes: {
    locale: { control: 'text' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    appearance: { control: 'select', options: ['outline', 'soft'] },
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
          'Standard date picker with default settings. Click the input to open the calendar popover.',
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
          'Controlled mode: `value` is managed by parent state. The display below the input reflects the selected date.',
      },
    },
  },
  render: function ControlledDatePickerStory() {
    const [date, setDate] = useState<Date | null>(new Date(2023, 9, 15));
    return (
      <Stack gap="base">
        <DatePicker value={date} onChange={setDate} placeholder="Controlled Picker" />
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
