import type { Meta, StoryObj } from '@storybook/react';
import { TimeClock } from '@/components/inputs/TimeClock';
import { Box, Stack } from '@/components/layout';
import { Text } from '@/components/typography';
import { css } from '@/styled-system/css';
import { useState } from 'react';

const constrainedClockWidthClasses = {
  40: css({ width: '[40px]' }),
  80: css({ width: '[80px]' }),
  120: css({ width: '[120px]' }),
} as const;


const meta = {
  title: 'Inputs/TimeClock',
  component: TimeClock,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A reusable clock-face input for time selection. The dial keeps its selected size and scrolls locally when its parent is narrower. For compact forms that must show the complete input at once, use TimePicker with inputMode="segments".',
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
    format: '24h',
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

export const NarrowContainer: Story = {
  render: () => (
    <Box width="[200px]" aria-label="Constrained time clock container">
      <TimeClock aria-label="Constrained clock" size="lg" defaultValue="09:30:45" withSeconds />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates bounded local dial scrolling below the selected clock-face size. This preserves option target sizes and keeps the header visible; it is not an alternate compact input mode.',
      },
    },
  },
};

export const ConstrainedLocalizedMeridiem: Story = {
  render: () => (
    <Stack gap="md">
      {[
        { width: 40, dir: 'ltr' as const },
        { width: 80, dir: 'rtl' as const },
        { width: 120, dir: 'ltr' as const },
      ].map(({ width, dir }) => (
        <Box
          key={width}
          className={
            constrainedClockWidthClasses[width as keyof typeof constrainedClockWidthClasses]
          }
          dir={dir}
          data-testid={`time-clock-meridiem-${width}`}
        >
          <TimeClock
            aria-label={`${width} pixel localized clock`}
            defaultValue="09:30:45"
            format="12h"
            messages={{
              am: 'AnteMeridiemLocalization',
              pm: 'PostMeridiemLocalization',
              meridiem: `${width} pixel meridiem`,
            }}
            size="sm"
            withSeconds
          />
        </Box>
      ))}
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Stress-tests information reachability and localized meridiem controls at extreme widths. The 40–120px containers are test boundaries, not recommended form widths.',
      },
    },
  },
};
