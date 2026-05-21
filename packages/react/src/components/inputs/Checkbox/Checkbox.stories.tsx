import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, expect } from 'storybook/test';
import { css } from '@/styled-system/css';
import { Checkbox } from './Checkbox';
import { Stack } from '../../layout/Stack';
import { useState } from 'react';

/**
 * A binary selection control for forms and multi-selection lists.
 * Supports `intent`, `size`, `error`, `indeterminate` states and a `Checkbox.Group` composition pattern.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS (`checkbox` recipe), `CheckboxContext`, `CheckboxGroup`
 */
const meta: Meta<typeof Checkbox> = {
  title: 'Inputs/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    intent: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
    error: {
      control: 'boolean',
    },
    indeterminate: {
      control: 'boolean',
    },
    checked: {
      control: 'boolean',
    },
    animated: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    children: 'Accept terms and conditions',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Standard single checkbox. Click to toggle checked state, verify focus ring on Tab, and check/uncheck via Space or click.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox', { name: /Accept terms and conditions/i });

    await expect(checkbox).not.toBeChecked();

    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
    await expect(checkbox).toHaveFocus();

    await userEvent.click(checkbox);
    await expect(checkbox).not.toBeChecked();
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Sizes = () => (
  <Stack gap="md">
    <Checkbox size="sm">Small Checkbox</Checkbox>
    <Checkbox size="md">Medium Checkbox</Checkbox>
    <Checkbox size="lg">Large Checkbox</Checkbox>
  </Stack>
);

export const States = () => (
  <Stack gap="md">
    <Checkbox defaultChecked>Checked</Checkbox>
    <Checkbox disabled>Disabled Unchecked</Checkbox>
    <Checkbox disabled defaultChecked>
      Disabled Checked
    </Checkbox>
    <Checkbox error>Error State</Checkbox>
    <Checkbox indeterminate>Indeterminate</Checkbox>
  </Stack>
);

export const Animated: Story = {
  args: {
    animated: true,
    defaultChecked: true,
    children: 'Animated checkmark',
  },
};

export const Controlled = () => {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)}>
      Controlled: {checked ? 'On' : 'Off'}
    </Checkbox>
  );
};

export const Group = () => {
  const [value, setValue] = useState(['apple']);
  return (
    <Stack gap="lg">
      <Checkbox.Group value={value} onChange={setValue} aria-label="Select Fruits">
        <Checkbox value="apple">Apple</Checkbox>
        <Checkbox value="banana">Banana</Checkbox>
        <Checkbox value="orange">Orange</Checkbox>
      </Checkbox.Group>
      <div className={css({ fontSize: 'sm', color: 'text.secondary' })}>
        Selected: {value.join(', ')}
      </div>
    </Stack>
  );
};

export const GroupHorizontal = () => (
  <Checkbox.Group orientation="horizontal" defaultValue={['md']}>
    <Checkbox value="sm">Small</Checkbox>
    <Checkbox value="md">Medium</Checkbox>
    <Checkbox value="lg">Large</Checkbox>
  </Checkbox.Group>
);
