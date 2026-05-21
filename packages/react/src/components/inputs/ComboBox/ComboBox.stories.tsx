import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { ComboBox } from './ComboBox';

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Blueberry', value: 'blueberry' },
  { label: 'Grapes', value: 'grapes' },
  { label: 'Pineapple', value: 'pineapple' },
];

/**
 * Storybook documentation and visual review surface for ComboBox.
 * Covers representative usage, controls, and fixed review examples.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS recipe, Radix Slot
 */
const meta: Meta<typeof ComboBox> = {
  title: 'Inputs/ComboBox',
  component: ComboBox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Combines a text input with a searchable dropdown list. Type to filter options; select with Enter or click. Exports composable sub-components for advanced layouts.',
      },
    },
  },
  argTypes: {
    appearance: { control: 'select', options: ['outline', 'soft'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof ComboBox>;

export const Default: Story = {
  args: {
    label: 'Fruit',
    options: options,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default ComboBox with a static options list. Click or type to open the dropdown and filter results.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const input = canvas.getByRole('combobox');
    await userEvent.click(input);
    await userEvent.type(input, 'ban');
    const option = await body.findByRole('option', { name: 'Banana' });
    await expect(option).toBeVisible();
    await userEvent.click(option);
    await expect(input).toHaveValue('Banana');
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Controlled = () => {
  const [value, setValue] = useState<string | null>('banana');
  return <ComboBox label="Controlled" options={options} value={value} onChange={setValue} />;
};
