import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { Input } from '@/components/inputs/Input';
import { FormControl, FormLabel, FormHelperText, FormErrorMessage } from './index';


const meta = {
  title: 'Inputs/FormControl',
  component: FormControl,
  tags: ['autodocs'],
  argTypes: {
    isInvalid: { control: 'boolean' },
    isRequired: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    isReadOnly: { control: 'boolean' },
  },
} satisfies Meta<typeof FormControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <FormControl {...args}>
      <FormLabel>Email address</FormLabel>
      <Input placeholder="Enter your email" />
      <FormHelperText>We&apos;ll never share your email.</FormHelperText>
    </FormControl>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Default state. Verify `FormLabel` auto-receives `htmlFor` from context `id` and `FormHelperText` receives the correct `helperTextId`.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('group')).toBeInTheDocument();
    await expect(canvas.getByRole('textbox')).toBeInTheDocument();
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Required: Story = {
  args: {
    isRequired: true,
  },
  render: (args) => (
    <FormControl {...args}>
      <FormLabel>First Name</FormLabel>
      <Input placeholder="First Name" />
    </FormControl>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`isRequired=true` appends a `*` aria-hidden indicator to the label. Verify the `*` span has `aria-hidden="true"` and the input has `required` attribute if wired.',
      },
    },
  },
};

export const Invalid: Story = {
  args: {
    isInvalid: true,
  },
  render: (args) => (
    <FormControl {...args}>
      <FormLabel>Password</FormLabel>
      <Input type="password" placeholder="Password" />
      <FormErrorMessage>Password is required.</FormErrorMessage>
    </FormControl>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`isInvalid=true` causes `FormErrorMessage` to render (it returns `null` when valid). The compatible default is `aria-live="polite"`; use `live="off"` when a form-level summary owns announcements and `live="assertive"` only for one urgent error.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
  render: (args) => (
    <FormControl {...args}>
      <FormLabel>Amount</FormLabel>
      <Input placeholder="Amount" disabled />
      <FormHelperText>This field is locked.</FormHelperText>
    </FormControl>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`isDisabled=true` sets `data-disabled` on the label and helper text. Verify the label renders with muted color and the input accepts no interaction.',
      },
    },
  },
};
