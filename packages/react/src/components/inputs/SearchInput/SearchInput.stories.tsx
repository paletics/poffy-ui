'use client';

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { Stack } from '../../layout/Stack';
import { Box } from '../../layout/Box';
import { SearchInput } from './SearchInput';

const meta: Meta<typeof SearchInput> = {
  title: 'Inputs/SearchInput',
  component: SearchInput,
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
    clearable: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
  args: {
    'aria-label': 'Search projects',
    placeholder: 'Search projects',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('searchbox', { name: 'Search projects' });

    await userEvent.type(input, 'alpha');
    await expect(input).toHaveValue('alpha');

    await userEvent.click(canvas.getByRole('button', { name: 'Clear search' }));
    await expect(input).toHaveValue('');
  },
};

export const Controlled: Story = {
  render: function ControlledSearchInputStory(args) {
    const [value, setValue] = useState('design');

    return (
      <SearchInput
        {...args}
        aria-label="Search docs"
        placeholder="Search docs"
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
        onClear={() => setValue('')}
      />
    );
  },
};

export const Sizes: Story = {
  render: (args) => (
    <Stack gap="md">
      <SearchInput {...args} size="sm" aria-label="Small search" placeholder="Small search" />
      <SearchInput {...args} size="md" aria-label="Medium search" placeholder="Medium search" />
      <SearchInput {...args} size="lg" aria-label="Large search" placeholder="Large search" />
    </Stack>
  ),
};

export const States: Story = {
  render: (args) => (
    <Stack gap="md">
      <SearchInput {...args} aria-label="Ready search" placeholder="Ready" />
      <SearchInput
        {...args}
        aria-label="Filled search"
        placeholder="Filled search"
        defaultValue="query"
      />
      <SearchInput {...args} aria-label="Disabled search" defaultValue="query" disabled />
      <SearchInput {...args} aria-label="Read only search" defaultValue="query" readOnly />
    </Stack>
  ),
};

export const PracticalMinimum: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The recommended 10rem practical minimum keeps the search identity, editable query, and clear action readable together. Narrower widths use the documented progressive-adornment fallback.',
      },
    },
  },
  render: () => (
    <Box width="[10rem]" maxWidth="100%" data-testid="practical-search-owner">
      <SearchInput aria-label="Practical minimum search" defaultValue="deployment" />
    </Box>
  ),
};

export const UltraNarrowRtl: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A below-minimum-width containment stress fixture. At 40–60px, readable query text is not part of the supported contract; the search and clear affordances must remain contained and operable.',
      },
    },
  },
  render: () => (
    <Stack gap="md">
      <Box width="[60px]" maxWidth="100%" dir="rtl">
        <SearchInput aria-label="Narrow RTL search" defaultValue="query" />
      </Box>
      <Box width="[40px]" maxWidth="100%">
        <SearchInput aria-label="Ultra narrow search" defaultValue="query" />
      </Box>
    </Stack>
  ),
};
