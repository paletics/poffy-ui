'use client';

import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, expect } from 'storybook/test';
import { Input } from './Input';
import { Stack } from '../../layout/Stack';
import { CalendarIcon, InlineTextIcon, SearchIcon } from '@/components/media/Icon/icons';

/**
 * The standard text input atom for Poffy UI forms. Supports multiple visual variants,
 * Silver Ratio sizing, error states with shake animation, and optional start/end adornments.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (`input` + `inputGroup` recipes), Radix Slot, `ActionMotion`
 */
const meta: Meta<typeof Input> = {
  title: 'Inputs/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    appearance: {
      control: 'select',
      options: ['outline', 'soft'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    error: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Basic Input',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Basic text input with placeholder. Click to focus, type to verify value binding, then Tab to blur.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Basic Input');

    await userEvent.click(input);
    await expect(input).toHaveFocus();

    await userEvent.type(input, 'Hello Poffy');
    await expect(input).toHaveValue('Hello Poffy');

    await userEvent.tab();
    await expect(input).not.toHaveFocus();
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Variants = () => (
  <Stack gap="md">
    <Input appearance="outline" placeholder="Outline (Default)" />
    <Input appearance="soft" placeholder="Soft" />
  </Stack>
);

export const Sizes = () => (
  <Stack gap="md">
    <Input size="sm" placeholder="Small Input" />
    <Input size="md" placeholder="Medium Input" />
    <Input size="lg" placeholder="Large Input" />
  </Stack>
);

export const States = () => (
  <Stack gap="md">
    <Input placeholder="Normal" />
    <Input placeholder="Error" error />
    <Input placeholder="Disabled" disabled />
    <Input placeholder="Read Only" readOnly defaultValue="Read Only Value" />
  </Stack>
);

export const WithStartElement: Story = {
  args: {
    placeholder: 'Search...',
    startElement: <SearchIcon />,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Start adornment for search-style inputs. Icon is vertically centered in a Silver Ratio width container and does not overlap placeholder text.',
      },
    },
  },
};

export const WithEndElement: Story = {
  args: {
    placeholder: 'Pick a date',
    endElement: <CalendarIcon />,
  },
  parameters: {
    docs: {
      description: {
        story:
          'End adornment for datepicker-style inputs. Icon is vertically centered on the right side.',
      },
    },
  },
};

export const WithBothElements: Story = {
  args: {
    placeholder: 'user@example.com',
    startElement: <InlineTextIcon />,
    endElement: <CalendarIcon />,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Both start and end adornments simultaneously. Both icons render without overlapping the input text area.',
      },
    },
  },
};

export const AdornmentSizes = () => (
  <Stack gap="md">
    <Input size="sm" placeholder="Small with icon" startElement={<SearchIcon />} />
    <Input size="md" placeholder="Medium with icon" startElement={<SearchIcon />} />
    <Input size="lg" placeholder="Large with icon" startElement={<SearchIcon />} />
  </Stack>
);

export const ErrorWithAdornment: Story = {
  args: {
    placeholder: 'Invalid value',
    error: true,
    startElement: <InlineTextIcon />,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Error state with adornment. The shake animation applies to the input element only; the icon container remains stationary. Error border/glow renders in `danger.main`.',
      },
    },
  },
};
