import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { Textarea } from './Textarea';
import { Stack } from '../../layout/Stack';


const meta: Meta<typeof Textarea> = {
  title: 'Inputs/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    appearance: {
      control: 'select',
      options: ['outline', 'soft', 'flushed'],
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
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: 'Enter proper description...',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default `outline` textarea with placeholder. Tab to focus, type to enter text. Verify focus ring uses `brand.main` token and placeholder color uses `neutral.muted` token.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByRole('textbox');
    await userEvent.click(textarea);
    await userEvent.type(textarea, 'Hello, Poffy!');
    await expect(textarea).toHaveValue('Hello, Poffy!');
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Variants = () => (
  <Stack gap="md">
    <Textarea appearance="outline" placeholder="Outline (Default)" />
    <Textarea appearance="soft" placeholder="Soft" />
    <Textarea appearance="flushed" placeholder="Flushed" />
  </Stack>
);

Variants.parameters = {
  docs: {
    description: {
      story:
        'Three visual appearances side-by-side: `outline` (bordered), `soft` (soft background), and `flushed` (bottom border only).',
    },
  },
};

export const Sizes = () => (
  <Stack gap="md">
    <Textarea size="sm" placeholder="Small Textarea" />
    <Textarea size="md" placeholder="Medium Textarea" />
    <Textarea size="lg" placeholder="Large Textarea" />
  </Stack>
);

Sizes.parameters = {
  docs: {
    description: {
      story:
        'All three sizes (`sm`, `md`, `lg`). Verify padding scales via Silver Ratio tokens and font size follows the readable role scale.',
    },
  },
};

export const States = () => (
  <Stack gap="md">
    <Textarea placeholder="Normal" />
    <Textarea placeholder="Error" error />
    <Textarea placeholder="Disabled" disabled />
    <Textarea placeholder="Read Only" readOnly defaultValue="Read Only Value" />
  </Stack>
);

States.parameters = {
  docs: {
    description: {
      story:
        'Four states stacked: normal, error (`danger.main` border), disabled (no cursor), readOnly. Verify `aria-invalid` is set when `error` is true.',
    },
  },
};
