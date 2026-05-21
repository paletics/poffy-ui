import type { Meta, StoryObj } from '@storybook/react';
import { css, cx } from '@/styled-system/css';
import { userEvent, within, expect, waitFor } from 'storybook/test';
import { Button } from '@/components/inputs/Button';
import { Calendar } from '@/components/inputs/Calendar';
import { Box, Stack } from '@/components/layout';
import { Code, Text } from '@/components/typography';
import { useState } from 'react';
import type { DateRange } from '@/components/inputs/Calendar/Calendar.types';

/**
 * ### AI Context & Architecture
 * - **Tier**: Molecules - headless calendar grid
 * - **Modes**: `single` (default) | `multiple` | `range`
 * - **Stack**: Panda CSS (`calendar` SlotRecipe), keyboard-navigable `role="grid"`
 * - **Silver Law**: Cell size and padding scale via Silver Ratio tokens
 */
const meta: Meta<typeof Calendar> = {
  title: 'Inputs/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A fully accessible, headless calendar component. Supports `single`, `multiple`, and `range` selection modes. Keyboard navigation follows the WAI-ARIA grid pattern.',
      },
    },
  },
  argTypes: {
    locale: { control: 'text' },
    size: { control: 'radio', options: ['sm', 'md'] },
  },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

const fullDateLabel = (date: Date, locale = 'en-US') =>
  date.toLocaleDateString(locale, { dateStyle: 'full' });

const customDayClass = css({ position: 'relative' });
const customDayDotClass = css({
  position: 'absolute',
  top: '2xs',
  right: '2xs',
  width: '[4px]',
  height: '[4px]',
  borderRadius: 'full',
  bg: 'variants.danger.main',
});

const REVIEW_MONTH = new Date(2026, 3, 1);
const REVIEW_DATE_5 = new Date(2026, 3, 5);
const REVIEW_DATE_10 = new Date(2026, 3, 10);
const REVIEW_DATE_12 = new Date(2026, 3, 12);
const REVIEW_DATE_15 = new Date(2026, 3, 15);
const REVIEW_DATE_20 = new Date(2026, 3, 20);

export const Default: Story = {
  args: {
    size: 'md',
    defaultMonth: REVIEW_MONTH,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default calendar in English (`en-US`). Click any day to select it - `data-selected` is set on the button and `aria-selected="true"` on the containing `gridcell`.',
      },
    },
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: fullDateLabel(REVIEW_DATE_15) });

    await userEvent.click(button);
    await expect(button).toHaveAttribute('data-selected');
    const gridcell = button.closest('[role="gridcell"]');
    await expect(gridcell).toHaveAttribute('aria-selected', 'true');
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Japanese: Story = {
  args: {
    locale: 'ja-JP',
    defaultMonth: REVIEW_MONTH,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Japanese locale (`ja-JP`). Month/year headers and day names are rendered in Japanese.',
      },
    },
  },
};

export const WithConstraints: Story = {
  args: {
    defaultMonth: REVIEW_MONTH,
    minDate: REVIEW_DATE_10,
    maxDate: REVIEW_DATE_20,
  },
  parameters: {
    docs: {
      description: {
        story:
          '`minDate` / `maxDate` constraints. Days outside the range get `aria-disabled="true"` and cannot be selected.',
      },
    },
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const disabledButton = canvas.getByRole('button', { name: fullDateLabel(REVIEW_DATE_5) });
    await userEvent.click(disabledButton);
    await expect(disabledButton).not.toHaveAttribute('data-selected');
    await expect(disabledButton).toHaveAttribute('aria-disabled', 'true');

    const enabledButton = canvas.getByRole('button', { name: fullDateLabel(REVIEW_DATE_15) });
    await userEvent.click(enabledButton);
    await expect(enabledButton).toHaveAttribute('data-selected');
  },
};

export const SelectedToday: Story = {
  render: (args) => {
    return <Calendar {...args} selected={REVIEW_DATE_15} defaultMonth={REVIEW_MONTH} />;
  },
  parameters: {
    docs: {
      description: {
        story:
          'Selected state on a fixed review date. Verify the selected background and text contrast remain stable.',
      },
    },
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const selectedButton = canvas.getByRole('button', { name: fullDateLabel(REVIEW_DATE_15) });
    await expect(selectedButton).toHaveAttribute('data-selected');
  },
};

export const MultipleSelection: Story = {
  render: function MultipleSelectionStory() {
    const [dates, setDates] = useState<Date[]>([]);
    return (
      <Stack gap="base">
        <Text data-testid="selected-count">Selected Count: {dates.length}</Text>
        <Calendar
          mode="multiple"
          defaultMonth={REVIEW_MONTH}
          selected={dates}
          onSelect={(val: Date[] | undefined) => setDates(val!)}
        />
      </Stack>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          '`mode="multiple"` - each click toggles individual dates. Clicking a selected date deselects it.',
      },
    },
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const day10 = canvas.getByRole('button', { name: fullDateLabel(REVIEW_DATE_10) });
    const day20 = canvas.getByRole('button', { name: fullDateLabel(REVIEW_DATE_20) });

    await userEvent.click(day10);
    await userEvent.click(day20);

    await expect(day10).toHaveAttribute('data-selected');
    await expect(day20).toHaveAttribute('data-selected');
    await expect(canvas.getByTestId('selected-count')).toHaveTextContent('Selected Count: 2');

    await userEvent.click(day10);
    await expect(day10).not.toHaveAttribute('data-selected');
    await expect(canvas.getByTestId('selected-count')).toHaveTextContent('Selected Count: 1');
  },
};

export const RangeSelection: Story = {
  render: function RangeSelectionStory() {
    const [range, setRange] = useState<{ from?: Date; to?: Date }>({});
    return (
      <Stack gap="base">
        <Text data-testid="range-info">
          Range: {range.from?.toLocaleDateString()} - {range.to?.toLocaleDateString() ?? '...'}
        </Text>
        <Calendar
          mode="range"
          defaultMonth={REVIEW_MONTH}
          selected={range}
          onSelect={(val: DateRange | undefined) => setRange(val!)}
        />
      </Stack>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          '`mode="range"` - first click sets `from`; second click sets `to`. Middle days receive `data-range-middle` for the bridge highlight.',
      },
    },
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const startButton = canvas.getByRole('button', { name: fullDateLabel(REVIEW_DATE_10) });
    const endButton = canvas.getByRole('button', { name: fullDateLabel(REVIEW_DATE_15) });

    await userEvent.click(startButton);
    await userEvent.click(endButton);

    await expect(startButton).toHaveAttribute('data-range-start');
    await expect(endButton).toHaveAttribute('data-range-end');

    const middleButton = canvas.getByRole('button', { name: fullDateLabel(REVIEW_DATE_12) });
    const middleDayCell = middleButton.parentElement;
    await expect(middleDayCell).toHaveAttribute('data-range-middle');
  },
};

export const FormIntegration: Story = {
  render: function FormIntegrationStory() {
    const [formData, setFormData] = useState<string>('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const data = new FormData(e.currentTarget);
      setFormData(JSON.stringify(Object.fromEntries(data.entries()), null, 2));
    };

    return (
      <Box asChild>
        <form onSubmit={handleSubmit} data-testid="calendar-form">
          <Stack gap="base">
            <Calendar
              mode="single"
              name="appointment"
              defaultMonth={REVIEW_MONTH}
              defaultValue={REVIEW_DATE_15}
            />
            <Button type="submit" data-testid="submit-btn">
              Submit Form
            </Button>
            {formData && (
              <Code variant="block" data-testid="form-output" p="base" bg="layout.background">
                {formData}
              </Code>
            )}
          </Stack>
        </form>
      </Box>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const day15 = canvas.getByRole('button', { name: fullDateLabel(REVIEW_DATE_15) });
    const submitBtn = canvas.getByTestId('submit-btn');

    await userEvent.click(day15);
    await userEvent.click(submitBtn);

    await waitFor(() => {
      const output = canvas.getByTestId('form-output');
      expect(output).toHaveTextContent(/"appointment":/);
      expect(output).toHaveTextContent(/-15/);
    });
  },
};

export const CustomDayRendering: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Custom `Day` component via the `components.Day` prop. Every 5th day gets a red dot overlay - useful for marking events.',
      },
    },
  },
  args: {
    defaultMonth: REVIEW_MONTH,
    components: {
      Day: ({ date, buttonProps }) => {
        const { className, style: _style, ...restButtonProps } = buttonProps;
        return (
          <button {...restButtonProps} className={cx(className, customDayClass)}>
            {date.getDate()}
            {date.getDate() % 5 === 0 && <span className={customDayDotClass} />}
          </button>
        );
      },
    },
  },
};

export const AutoFocus: Story = {
  args: {
    autoFocus: true,
    defaultMonth: REVIEW_MONTH,
  },
  parameters: {
    docs: {
      description: {
        story:
          '`autoFocus` prop - the fixed review date receives browser focus on mount for keyboard-first users.',
      },
    },
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const focusedButton = canvas.getByRole('button', { name: fullDateLabel(REVIEW_MONTH) });
    await expect(focusedButton).toHaveFocus();
  },
};
