import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { ComboBox } from './ComboBox';
import { Box, Stack } from '@/components/layout';

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Blueberry', value: 'blueberry' },
  { label: 'Grapes', value: 'grapes' },
  { label: 'Pineapple', value: 'pineapple' },
];

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
    appearance: { control: 'select', options: ['outline', 'soft', 'flushed', 'neo'] },
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

export const ResponsiveSizes = () => (
  <Stack gap="md" width="[240px]" maxWidth="100%" aria-label="Responsive ComboBox container">
    <ComboBox size="sm" aria-label="Small fruit" options={options} />
    <ComboBox size="md" aria-label="Medium fruit" options={options} />
    <ComboBox size="lg" aria-label="Large fruit" options={options} />
  </Stack>
);

export const UltraNarrowRtl = () => (
  <Stack gap="md">
    <Box width="[60px]" maxWidth="100%" dir="rtl">
      <ComboBox
        style={{ minInlineSize: 0 }}
        size="md"
        aria-label="Narrow RTL fruit"
        options={options}
        defaultValue="banana"
      />
    </Box>
    <Box width="[40px]" maxWidth="100%">
      <ComboBox
        style={{ minInlineSize: 0 }}
        size="sm"
        aria-label="Ultra narrow fruit"
        options={options}
      />
    </Box>
  </Stack>
);
