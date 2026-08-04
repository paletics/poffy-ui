import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { Switch } from './Switch';
import { Stack } from '../../layout/Stack';
import { useState } from 'react';


const meta: Meta<typeof Switch> = {
  title: 'Inputs/Switch',
  component: Switch,
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
    defaultChecked: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {
    children: 'Notifications',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default toggle with a label. Click to toggle, Tab to focus, Space to change state. Verify `role="switch"` and `aria-checked` are present.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const switchEl = canvas.getByRole('switch');
    await userEvent.click(switchEl);
    await expect(switchEl).toBeChecked();
    await userEvent.click(switchEl);
    await expect(switchEl).not.toBeChecked();
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Sizes = () => (
  <Stack gap="md">
    <Switch size="sm">Small</Switch>
    <Switch size="md">Medium</Switch>
    <Switch size="lg">Large</Switch>
  </Stack>
);

Sizes.parameters = {
  docs: {
    description: {
      story:
        'All three sizes side by side. Thumb and track scale proportionally via Silver Ratio tokens.',
    },
  },
};

export const States = () => (
  <Stack gap="md">
    <Switch defaultChecked>Checked</Switch>
    <Switch disabled>Disabled Off</Switch>
    <Switch disabled defaultChecked>
      Disabled On
    </Switch>
  </Stack>
);

States.parameters = {
  docs: {
    description: {
      story:
        'Checked, disabled-off, and disabled-on states. Disabled state must suppress click interaction.',
    },
  },
};

export const Controlled = () => {
  const [checked, setChecked] = useState(false);
  return (
    <Switch checked={checked} onChange={(e) => setChecked(e.target.checked)}>
      {checked ? 'On' : 'Off'}
    </Switch>
  );
};

Controlled.parameters = {
  docs: {
    description: {
      story:
        'Fully controlled pattern. The label text reflects the current boolean state. Verify React re-renders correctly on each toggle.',
    },
  },
};
