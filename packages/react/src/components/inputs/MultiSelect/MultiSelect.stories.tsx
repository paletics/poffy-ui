import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { MultiSelect } from './MultiSelect';

/**
 * Storybook documentation and visual review surface for MultiSelect.
 * Covers representative usage, controls, and fixed review examples.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS recipe, Radix Slot
 */
const meta: Meta<typeof MultiSelect> = {
  title: 'Inputs/MultiSelect',
  component: MultiSelect,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Multi-value selector with tag chips. Type to filter options, click an option to add it, and use the remove button on each chip to clear selections.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MultiSelect>;

const options = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Angular', value: 'angular' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Solid', value: 'solid' },
];

export const Default: Story = {
  args: {
    'aria-label': 'Frameworks',
    options,
    placeholder: 'Select frameworks...',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default MultiSelect with no pre-selected values. Click the input area to open the dropdown and start selecting.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const input = canvas.getByRole('combobox');
    await userEvent.click(input);
    await waitFor(async () => {
      await expect(body.getByRole('option', { name: 'React' })).toBeVisible();
    });
    const option = body.getByRole('option', { name: 'React' });
    await userEvent.click(option);
    await waitFor(async () => {
      await expect(
        canvas.getByText('React', { selector: '[data-multiselect-tag-label="true"]' }),
      ).toBeVisible();
    });
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Interactive = () => {
  const [value, setValue] = useState<string[]>(['react']);
  return (
    <MultiSelect aria-label="Interactive" options={options} value={value} onChange={setValue} />
  );
};
