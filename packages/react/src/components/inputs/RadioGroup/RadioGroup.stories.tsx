import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { RadioGroup } from './RadioGroup';
import { Radio } from './Radio';
import { useState } from 'react';

/**
 * A container for mutually exclusive radio options.
 * Supports controlled/uncontrolled patterns, `vertical` and `horizontal` orientations,
 * and distributes `size` and `disabled` props to child `Radio` atoms.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS (`radioGroup` recipe), React Context (`RadioGroupContext`)
 */
const meta: Meta<typeof RadioGroup> = {
  title: 'Inputs/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    intent: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'danger'],
    },
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
    animated: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: (args) => (
    <RadioGroup {...args} defaultValue="1">
      <Radio value="1">Option 1</Radio>
      <Radio value="2">Option 2</Radio>
      <Radio value="3">Option 3</Radio>
    </RadioGroup>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Default vertical group with `defaultValue="1"`. Verify `role="radiogroup"` on container and `role="radio"` on each option. Arrow keys navigate between options.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const options = canvas.getAllByRole('radio');
    await expect(options[0]).toBeChecked();
    await expect(options[1]).not.toBeChecked();
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Horizontal: Story = {
  render: (args) => (
    <RadioGroup {...args} orientation="horizontal" defaultValue="a">
      <Radio value="a">A</Radio>
      <Radio value="b">B</Radio>
      <Radio value="c">C</Radio>
    </RadioGroup>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Horizontal `orientation` - options render in a row. Verify gap between options uses Silver Ratio tokens.',
      },
    },
  },
};

export const Animated: Story = {
  render: (args) => (
    <RadioGroup {...args} animated defaultValue="a">
      <Radio value="a">Animated A</Radio>
      <Radio value="b">Animated B</Radio>
      <Radio value="c">Animated C</Radio>
    </RadioGroup>
  ),
};

export const Controlled = () => {
  const [value, setValue] = useState('apple');
  return (
    <RadioGroup value={value} onChange={setValue}>
      <Radio value="apple">Apple</Radio>
      <Radio value="banana">Banana</Radio>
      <Radio value="orange">Orange</Radio>
    </RadioGroup>
  );
};

Controlled.parameters = {
  docs: {
    description: {
      story:
        'Fully controlled pattern. `value` is managed externally via `useState`. Verify re-renders do not cause unexpected selection resets.',
    },
  },
};
